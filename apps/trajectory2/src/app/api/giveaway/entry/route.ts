import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { subscribeToForm } from '@/lib/convertkit';
import { sendGiveawayConfirmationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

// Validation schema for giveaway entry
const GiveawayEntrySchema = z.object({
  email: z.string().email('Valid email required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  liked_post: z.boolean().refine((val) => val === true, {
    message: 'You must like the Instagram post to enter',
  }),
  shared_post: z.boolean().refine((val) => val === true, {
    message: 'You must share the Instagram post to enter',
  }),
  tagged_friend: z.boolean().refine((val) => val === true, {
    message: 'You must tag a friend in the Instagram post comments to enter',
  }),
  giveaway_id: z.string().uuid().optional(),
});

const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

// Rate limiting for giveaway entries - 5 requests per 15 minutes
const entryLimiter = rateLimit({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await entryLimiter(request);
  if (!rateLimitResult.isAllowed) {
    return NextResponse.json(
      { 
        error: 'Too many requests',
        message: 'Please wait before submitting another entry',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const validatedData = GiveawayEntrySchema.parse(body);

    // Get Supabase client
    const supabase = await createClient();

    // Check for active giveaway
    const { data: giveaway, error: giveawayError } = await supabase
      .from('giveaway_config')
      .select('*')
      .eq('status', 'active')
      .single();

    if (giveawayError || !giveaway) {
      return NextResponse.json(
        { error: 'No active giveaway found. The giveaway has ended.' },
        { status: 404 }
      );
    }

    // Check if giveaway has ended
    const now = new Date();
    const endDate = new Date(giveaway.end_date);
    if (now > endDate) {
      return NextResponse.json(
        { error: 'The giveaway has ended. Thank you for your interest!' },
        { status: 410 }
      );
    }

    // Check for duplicate entry
    const { data: existingEntry } = await supabase
      .from('giveaway_entries')
      .select('id, entry_number')
      .eq('email', validatedData.email.toLowerCase())
      .eq('giveaway_id', giveaway.id)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        {
          error: 'You have already entered this giveaway!',
          existingEntry: true,
          message: 'Check your email for your confirmation.',
          entryNumber: existingEntry.entry_number,
        },
        { status: 409 }
      );
    }

    // Subscribe to ConvertKit newsletter
    let convertkitSubscriberId: string | undefined;
    let newsletterSubscribed = false;

    if (CONVERTKIT_FORM_ID) {
      const subscriptionResult = await subscribeToForm({
        email: validatedData.email,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        form_id: CONVERTKIT_FORM_ID,
        tags: ['giveaway-entry'],
      });

      if (subscriptionResult.success) {
        newsletterSubscribed = true;
        convertkitSubscriberId = subscriptionResult.subscriber_id;
      } else {
        // Log error but don't block entry
        logger.error('ConvertKit subscription failed', subscriptionResult.error);
      }
    } else {
      logger.warn('CONVERTKIT_FORM_ID is not configured');
    }

    // Create giveaway entry
    const { data: entry, error: entryError } = await supabase
      .from('giveaway_entries')
      .insert({
        giveaway_id: giveaway.id,
        email: validatedData.email.toLowerCase(),
        name: `${validatedData.first_name} ${validatedData.last_name}`,
        first_name: validatedData.first_name,
        last_name: validatedData.last_name,
        newsletter_subscribed: newsletterSubscribed,
        convertkit_subscriber_id: convertkitSubscriberId,
        liked_post: validatedData.liked_post,
        shared_post: validatedData.shared_post,
        tagged_friend: validatedData.tagged_friend,
        verified: false, // Manual verification required
      })
      .select('id, entry_number, created_at')
      .single();

    if (entryError || !entry) {
      logger.error('Error creating giveaway entry', entryError);
      return NextResponse.json(
        { error: 'Failed to process your entry. Please try again.' },
        { status: 500 }
      );
    }

    // Get participant count for email
    const { count: participantCount } = await supabase
      .from('giveaway_entries')
      .select('*', { count: 'exact', head: true })
      .eq('giveaway_id', giveaway.id);

    // Send confirmation email
    try {
      await sendGiveawayConfirmationEmail({
        to: validatedData.email,
        firstName: validatedData.first_name,
        lastName: validatedData.last_name,
        entryNumber: entry.entry_number,
        participantCount: participantCount || 0,
        giveawayName: giveaway.name,
      });
    } catch (emailError) {
      // Log but don't fail the request
      console.error('Error sending confirmation email:', emailError);
    }

    // Track entry (analytics would go here)
    console.log('Giveaway entry created:', {
      email: validatedData.email,
      giveaway_id: giveaway.id,
      entry_number: entry.entry_number,
      newsletter_subscribed: newsletterSubscribed,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully entered the giveaway!',
      entry: {
        id: entry.id,
        entryNumber: entry.entry_number,
        email: validatedData.email,
      },
      giveaway: {
        name: giveaway.name,
        endDate: giveaway.end_date,
      },
      newsletterSubscribed,
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
          error: 'Please complete all required fields',
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    // Log unexpected errors
    console.error('Giveaway entry error:', error);

    return NextResponse.json(
      {
        error: 'An error occurred while processing your entry. Please try again.',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check giveaway status
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get active giveaway and stats
    const { data: giveaway } = await supabase
      .from('giveaway_config')
      .select('*')
      .eq('status', 'active')
      .single();

    if (!giveaway) {
      return NextResponse.json({
        active: false,
        message: 'No active giveaway at this time',
      });
    }

    // Get entry count
    const { count } = await supabase
      .from('giveaway_entries')
      .select('*', { count: 'exact', head: true })
      .eq('giveaway_id', giveaway.id);

    // Calculate time remaining
    const now = new Date();
    const endDate = new Date(giveaway.end_date);
    const timeRemaining = endDate.getTime() - now.getTime();

    return NextResponse.json({
      active: true,
      giveaway: {
        name: giveaway.name,
        tagline: giveaway.tagline,
        endDate: giveaway.end_date,
        timeRemainingMs: timeRemaining,
        prizes: giveaway.prizes,
      },
      stats: {
        totalEntries: count || 0,
      },
    });

  } catch (error) {
    console.error('Giveaway status error:', error);
    return NextResponse.json(
      { error: 'Unable to fetch giveaway status' },
      { status: 500 }
    );
  }
}
