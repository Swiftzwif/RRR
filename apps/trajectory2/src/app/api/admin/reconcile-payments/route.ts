/**
 * ============================================================================
 * DISABLED - SQUARE PAYMENT RECONCILIATION
 * ============================================================================
 * This route has been disabled in favor of Thinkific integration.
 * All Square reconciliation code is preserved for future use.
 * 
 * To re-enable:
 * 1. Uncomment all code below
 * 2. Add Square env vars back to env-validation.ts as required
 * 3. Update admin dashboard to use this endpoint
 * 
 * Last disabled: 2025-10-31
 * Reason: Pivoting to Thinkific for faster time-to-market
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Square reconciliation endpoint is currently disabled.',
      info: 'Using Thinkific for course purchases and access control.',
      unprocessed_events: [],
      count: 0
    },
    { status: 503 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Square reconciliation is currently disabled.',
      message: 'Please use Thinkific for course purchases.'
    },
    { status: 503 }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Square webhook retry is currently disabled.',
      processed: 0,
      results: []
    },
    { status: 503 }
  );
}

/* ============================================================================
 * PRESERVED SQUARE RECONCILIATION CODE - DO NOT DELETE
 * ============================================================================

import { getSupabaseServiceRole } from '@/lib/supabase';

// Helper function to verify admin authorization
function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!adminSecret) {
    console.error('No admin secret configured');
    return false;
  }

  return authHeader === `Bearer ${adminSecret}`;
}

// GET endpoint to check for unprocessed payments
export async function GET_DISABLED(request: NextRequest) {
  try {
    // Verify admin authorization
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Get failed webhook events
    const { data: failedEvents, error } = await supabase
      .from('webhook_events')
      .select('*')
      .in('status', ['failed', 'retrying', 'pending'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching webhook events:', error);
      return NextResponse.json({ error: 'Failed to fetch webhook events' }, { status: 500 });
    }

    return NextResponse.json({
      unprocessed_events: failedEvents || [],
      count: failedEvents?.length || 0
    });
  } catch (error: any) {
    console.error('Reconciliation check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to manually reconcile a payment
export async function POST_DISABLED(request: NextRequest) {
  try {
    // Verify admin authorization
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { square_payment_id, webhook_event_id } = await request.json();

    if (!square_payment_id) {
      return NextResponse.json({ error: 'square_payment_id is required' }, { status: 400 });
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Check if payment already processed
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('square_payment_id', square_payment_id)
      .single();

    if (existingPurchase) {
      return NextResponse.json({
        message: 'Payment already processed',
        purchase_id: existingPurchase.id,
        status: 'already_processed'
      });
    }

    // Fetch payment from Square
    const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production'
      ? 'https://connect.squareup.com/v2'
      : 'https://connect.squareupsandbox.com/v2';

    const paymentResponse = await fetch(
      `${SQUARE_BASE_URL}/payments/${square_payment_id}`,
      {
        headers: {
          'Square-Version': '2024-01-18',
          'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!paymentResponse.ok) {
      const error = await paymentResponse.text();
      console.error('Square API error:', error);
      return NextResponse.json({
        error: 'Payment not found in Square',
        details: error
      }, { status: 404 });
    }

    const { payment } = await paymentResponse.json();

    // Extract metadata from payment note
    let metadata: any = {};
    if (payment.note) {
      try {
        metadata = JSON.parse(payment.note);
      } catch {
        console.warn('Failed to parse payment note as JSON');
      }
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        square_payment_id: payment.id,
        square_order_id: payment.order_id,
        email: metadata.email || payment.buyer_email_address || 'unknown@example.com',
        user_id: metadata.user_id || null,
        amount_cents: payment.amount_money?.amount || 0,
        product: metadata.is_raffle_entry === 'true' ? 'raffle_entry' :
                (metadata.product || 'course'),
        raffle_id: metadata.raffle_id || null,
        status: payment.status === 'COMPLETED' ? 'completed' : 'pending',
        metadata: metadata
      })
      .select()
      .single();

    if (purchaseError) {
      console.error('Error creating purchase:', purchaseError);
      return NextResponse.json({
        error: 'Failed to create purchase record',
        details: purchaseError.message
      }, { status: 500 });
    }

    // If it's a raffle entry, create the raffle entry
    if (metadata.is_raffle_entry === 'true' && metadata.raffle_id) {
      const { data: raffle } = await supabase
        .from('raffle_config')
        .select('*')
        .eq('id', metadata.raffle_id)
        .single();

      if (raffle) {
        // Check for existing entry
        const { data: existingEntry } = await supabase
          .from('raffle_entries')
          .select('id')
          .eq('raffle_id', metadata.raffle_id)
          .eq('email', metadata.email)
          .single();

        if (!existingEntry) {
          // Create raffle entry
          const { data: entry, error: entryError } = await supabase
            .from('raffle_entries')
            .insert({
              raffle_id: metadata.raffle_id,
              email: metadata.email,
              phone: metadata.phone || null,
              user_id: metadata.user_id || null,
              commitment_message: metadata.commitment_message || 'Entry via payment reconciliation',
              transformation_goal: metadata.transformation_goal || 'Transform my life',
              purchase_id: purchase.id,
              entry_number: 0 // Will be updated by trigger
            })
            .select()
            .single();

          if (entryError) {
            console.error('Error creating raffle entry:', entryError);
            // Don't fail the whole reconciliation if raffle entry fails
          } else {
            // Send confirmation email
            try {
              const emailResponse = await fetch('/api/emails/send-raffle-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: metadata.email,
                  entryNumber: entry.entry_number,
                  transformationGoal: metadata.transformation_goal
                })
              });

              if (!emailResponse.ok) {
                console.error('Failed to send confirmation email');
              }
            } catch (emailError) {
              console.error('Email send error:', emailError);
            }
          }
        }
      }
    }

    // Update webhook event if provided
    if (webhook_event_id) {
      await supabase
        .from('webhook_events')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString()
        })
        .eq('id', webhook_event_id);
    }

    return NextResponse.json({
      message: 'Payment reconciled successfully',
      purchase_id: purchase.id,
      status: 'reconciled'
    });
  } catch (error: any) {
    console.error('Reconciliation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to retry all failed webhooks
export async function PATCH_DISABLED(request: NextRequest) {
  try {
    // Verify admin authorization
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseServiceRole();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // Get all failed/retrying events that are due for retry
    const { data: eventsToRetry, error } = await supabase
      .from('webhook_events')
      .select('*')
      .in('status', ['failed', 'retrying'])
      .or(`next_retry_at.is.null,next_retry_at.lte.${new Date().toISOString()}`)
      .lt('attempts', 5)
      .limit(10);

    if (error) {
      console.error('Error fetching events to retry:', error);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    const results = [];
    for (const event of eventsToRetry || []) {
      try {
        // Process each webhook event
        const payment_id = event.payload?.data?.object?.payment?.id;
        if (payment_id) {
          const response = await fetch(request.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': request.headers.get('authorization') || ''
            },
            body: JSON.stringify({
              square_payment_id: payment_id,
              webhook_event_id: event.id
            })
          });

          const result = await response.json();
          results.push({ event_id: event.id, ...result });
        }
      } catch (err) {
        console.error(`Failed to retry event ${event.id}:`, err);
        results.push({ event_id: event.id, error: 'Failed to retry' });

        // Mark as failed
        await supabase
          .from('webhook_events')
          .update({
            status: 'failed',
            attempts: event.attempts + 1,
            last_error: String(err),
            next_retry_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
          })
          .eq('id', event.id);
      }
    }

    return NextResponse.json({
      message: 'Retry completed',
      processed: results.length,
      results
    });
  } catch (error: any) {
    console.error('Retry error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

* ============================================================================ */
