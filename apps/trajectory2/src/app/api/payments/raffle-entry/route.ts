import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Validation schema for raffle entry
const RaffleEntrySchema = z.object({
  email: z.string().email('Valid email required for transformation journey'),
  phone: z.string().optional(),
  commitmentMessage: z.string().min(10, 'Share your commitment (min 10 characters)'),
  transformationGoal: z.string().min(20, 'What do you want to transform? (min 20 characters)'),
  guestCheckout: z.boolean().default(false),
});

// Square API configuration
const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RaffleEntrySchema.parse(body);

    // Get Supabase client
    const supabase = await createClient();

    // Check for active raffle
    const { data: raffle, error: raffleError } = await supabase
      .from('raffle_config')
      .select('*')
      .eq('status', 'active')
      .single();

    if (raffleError || !raffle) {
      return NextResponse.json(
        { error: 'No active raffle found. The grand opening has ended.' },
        { status: 404 }
      );
    }

    // Check if raffle has ended
    const now = new Date();
    const endDate = new Date(raffle.end_date);
    if (now > endDate) {
      return NextResponse.json(
        { error: 'The raffle has ended. But your transformation journey doesn\'t have to.' },
        { status: 410 }
      );
    }

    // Check for duplicate entry
    const { data: existingEntry } = await supabase
      .from('raffle_entries')
      .select('id')
      .eq('email', validatedData.email.toLowerCase())
      .eq('raffle_id', raffle.id)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        {
          error: 'You\'ve already begun your transformation journey!',
          existingEntry: true,
          message: 'Check your email for your confirmation and course access.'
        },
        { status: 409 }
      );
    }

    // Check if user exists (for non-guest checkout)
    let userId: string | null = null;
    if (!validatedData.guestCheckout) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    // Build success URL
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const successUrl = `${baseUrl}/course?raffle_success=1&session_id={CHECKOUT_SESSION_ID}`;

    // Create metadata for webhook processing
    const metadata = {
      raffle_id: raffle.id,
      commitment_message: validatedData.commitmentMessage,
      transformation_goal: validatedData.transformationGoal,
      phone: validatedData.phone || '',
      email: validatedData.email.toLowerCase(),
      user_id: userId || '',
      is_raffle_entry: 'true',
    };

    // Create Square payment link with raffle pricing
    const paymentLinkResponse = await fetch(
      `${SQUARE_BASE_URL}/online-checkout/payment-links`,
      {
        method: 'POST',
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idempotency_key: `raffle-${raffle.id}-${validatedData.email}-${Date.now()}`,
          quick_pay: {
            name: 'Kill The Boy Course - Grand Opening Special (35% OFF)',
            price_money: {
              amount: raffle.entry_price, // $97 in cents
              currency: 'USD',
            },
            location_id: SQUARE_LOCATION_ID,
          },
          checkout_options: {
            redirect_url: successUrl,
            ask_for_shipping_address: false,
            enable_loyalty: false,
            enable_coupon: false,
            accepted_payment_methods: {
              apple_pay: true,
              google_pay: true,
              cash_app_pay: true,
              afterpay_clearpay: false,
            },
          },
          pre_populated_data: {
            buyer_email: validatedData.email,
            buyer_phone_number: validatedData.phone,
          },
          payment_note: JSON.stringify(metadata), // Store metadata in payment note for webhook
          description: `Transform your life with the Kill The Boy course at 35% off the regular price. Plus, you're automatically entered to win $2,500+ in transformation prizes. Your commitment: "${validatedData.commitmentMessage.substring(0, 100)}..."`,
        }),
      }
    );

    if (!paymentLinkResponse.ok) {
      const error = await paymentLinkResponse.json();
      console.error('Square API Error:', error);

      // Handle specific Square errors
      if (error.errors?.[0]?.code === 'INVALID_EMAIL_ADDRESS') {
        return NextResponse.json(
          { error: 'Real email = real transformation. Please use a valid email.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Payment system temporarily unavailable. Your transformation awaits - try again.' },
        { status: 500 }
      );
    }

    const paymentLinkData = await paymentLinkResponse.json();

    // Track the commitment moment (if analytics available)
    // This would integrate with your analytics system
    console.log('Raffle entry initiated:', {
      email: validatedData.email,
      raffle_id: raffle.id,
      goal_preview: validatedData.transformationGoal.substring(0, 50),
    });

    return NextResponse.json({
      paymentUrl: paymentLinkData.payment_link.url,
      paymentLinkId: paymentLinkData.payment_link.id,
      message: 'Your transformation begins now. Redirecting to secure payment...',
      raffleDetails: {
        discount: Math.round((raffle.savings_amount / raffle.regular_price) * 100),
        savings: raffle.savings_amount / 100,
        finalPrice: raffle.entry_price / 100,
      },
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(
        {
          error: 'Complete your commitment to transformation',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error('Raffle entry error:', error);

    return NextResponse.json(
      {
        error: 'Technical issue - but your transformation is meant to be. Try again.',
        message: 'If this persists, email us directly. We won\'t let technology stop your journey.',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check raffle status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get active raffle and stats
    const { data: raffle } = await supabase
      .from('raffle_config')
      .select('*')
      .eq('status', 'active')
      .single();

    if (!raffle) {
      return NextResponse.json({
        active: false,
        message: 'No active raffle at this time',
      });
    }

    // Get entry count
    const { count } = await supabase
      .from('raffle_entries')
      .select('*', { count: 'exact', head: true })
      .eq('raffle_id', raffle.id);

    // Calculate time remaining
    const now = new Date();
    const endDate = new Date(raffle.end_date);
    const timeRemaining = endDate.getTime() - now.getTime();

    return NextResponse.json({
      active: true,
      raffle: {
        name: raffle.name,
        tagline: raffle.tagline,
        entryPrice: raffle.entry_price / 100,
        regularPrice: raffle.regular_price / 100,
        savings: raffle.savings_amount / 100,
        discountPercentage: Math.round((raffle.savings_amount / raffle.regular_price) * 100),
        endDate: raffle.end_date,
        timeRemainingMs: timeRemaining,
        prizes: raffle.prizes,
      },
      stats: {
        totalEntries: count || 0,
        spotsRemaining: 'unlimited', // Or calculate if there's a limit
      },
    });

  } catch (error) {
    console.error('Raffle status error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch raffle status' },
      { status: 500 }
    );
  }
}