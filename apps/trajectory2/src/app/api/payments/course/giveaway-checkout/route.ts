import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { logger } from '@/lib/logger';

// Validation schema
const courseCheckoutSchema = z.object({
  email: z.string().email(),
  userId: z.string().uuid().optional(),
});

// Square API configuration
const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production'
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// Charity configuration - $2 per charity per course sale
const CHARITIES = [
  'Hurricane Relief Fund for Displaced Families of Jamaica',
  "St. Jude's Children's Research Hospital",
  'Bellesini Academy Lawrence MA',
  'Minds with Purpose Lawrence MA',
  'AFJ American Friends of Jamaica',
  'Brothers in Arms Lawrence MA',
];

// Product configuration
const REGULAR_PRICE = 14900; // $149.00 in cents
const OPENING_WEEK_PRICE = 9700; // $97.00 in cents (35% off)
const OPENING_WEEK_DAYS = 7; // Days from giveaway start

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId } = courseCheckoutSchema.parse(body);

    // Get Supabase client
    const supabase = await createClient();

    // Get active giveaway to determine if we're in opening week
    const { data: giveaway } = await supabase
      .from('giveaway_config')
      .select('start_date, end_date')
      .eq('status', 'active')
      .single();

    // Determine price based on opening week status
    let amount = REGULAR_PRICE;
    let isOpeningWeek = false;

    if (giveaway) {
      const now = new Date();
      const startDate = new Date(giveaway.start_date);
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceStart < OPENING_WEEK_DAYS) {
        amount = OPENING_WEEK_PRICE;
        isOpeningWeek = true;
      }
    }

    // Build success URL
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const successUrl = `${baseUrl}/course?success=1&session_id={CHECKOUT_SESSION_ID}`;

    // Create metadata for webhook processing
    const metadata = {
      product: 'course',
      course_name: 'Change Your Trajectory by Shifting Lanes',
      email: email.toLowerCase(),
      user_id: userId || '',
      is_opening_week: isOpeningWeek,
      price: amount,
      donation_amount: CHARITIES.length * 200, // $2 per charity in cents
      charity_count: CHARITIES.length,
    };

    // Create Square payment link
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
          idempotency_key: `course-giveaway-${email}-${Date.now()}`,
          quick_pay: {
            name: `Change Your Trajectory by Shifting Lanes${isOpeningWeek ? ' - Grand Opening Special (35% OFF)' : ''}`,
            price_money: {
              amount: amount,
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
            buyer_email: email,
          },
          payment_note: JSON.stringify(metadata),
          description: `Transform your life with "Change Your Trajectory by Shifting Lanes". $2 from each purchase goes to ${CHARITIES.length} charities including ${CHARITIES[0]}.${isOpeningWeek ? ' Limited time: 35% off during opening week!' : ''}`,
        }),
      }
    );

    if (!paymentLinkResponse.ok) {
      const error = await paymentLinkResponse.json();
      logger.error('Square API Error', error);

      if (error.errors?.[0]?.code === 'INVALID_EMAIL_ADDRESS') {
        return NextResponse.json(
          { error: 'Please use a valid email address' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Payment system temporarily unavailable. Please try again.' },
        { status: 500 }
      );
    }

    const paymentLinkData = await paymentLinkResponse.json();

    return NextResponse.json({
      paymentUrl: paymentLinkData.payment_link.url,
      paymentLinkId: paymentLinkData.payment_link.id,
      message: 'Redirecting to secure payment...',
      pricing: {
        amount: amount / 100,
        isOpeningWeek,
        regularPrice: REGULAR_PRICE / 100,
        discountPercentage: isOpeningWeek ? 35 : 0,
        donationInfo: {
          total: (CHARITIES.length * 200) / 100,
          charities: CHARITIES,
        },
      },
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce((acc, issue) => {
        const key = String(issue.path[0]);
        acc[key] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json(
        {
          error: 'Invalid request',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error('Course checkout error:', error);

    return NextResponse.json(
      {
        error: 'An error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
