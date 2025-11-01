/**
 * ============================================================================
 * DISABLED - SQUARE WEBHOOK HANDLER
 * ============================================================================
 * This route has been disabled in favor of Thinkific integration.
 * All Square webhook code is preserved for future use.
 * 
 * To re-enable:
 * 1. Uncomment all code below
 * 2. Add Square env vars back to env-validation.ts as required
 * 3. Configure webhook URL in Square dashboard
 * 
 * Last disabled: 2025-10-31
 * Reason: Pivoting to Thinkific for faster time-to-market
 * ============================================================================
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      message: 'Square webhook handler is currently disabled.',
      info: 'Using Thinkific for course purchases and access control.',
      thinkific_url: 'https://jean-s-site-8b39.thinkific.com/products/courses/trajectory'
    },
    { status: 503 }
  );
}

/* ============================================================================
 * PRESERVED SQUARE WEBHOOK CODE - DO NOT DELETE
 * ============================================================================

import { getSupabaseServiceRole } from '@/lib/supabase';
import { createHmac } from 'crypto';
import { sendRaffleConfirmationEmail, sendPaymentReceiptEmail } from '@/lib/email';

// Square webhook event types
const RELEVANT_EVENTS = [
  'payment.created',
  'payment.updated',
];

// Verify Square webhook signature
function verifyWebhookSignature(
  body: string,
  signature: string | null,
  webhookSignatureKey: string
): boolean {
  if (!signature) return false;

  const hmac = createHmac('sha256', webhookSignatureKey);
  hmac.update(body);
  const expectedSignature = hmac.digest('base64');
  
  return signature === expectedSignature;
}

export async function POST_DISABLED(request: NextRequest) {
  let webhookEventId: string | null = null;

  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('x-square-hmacsha256-signature');

    // Verify webhook signature
    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    if (!webhookSignatureKey) {
      console.error('Missing SQUARE_WEBHOOK_SIGNATURE_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!verifyWebhookSignature(body, signature, webhookSignatureKey)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse webhook payload
    const event = JSON.parse(body);

    // Only process relevant events
    if (!RELEVANT_EVENTS.includes(event.type)) {
      return NextResponse.json({ received: true });
    }

    // Store webhook event for potential retry
    const supabase = getSupabaseServiceRole();
    if (supabase) {
      const { data: webhookEvent, error: webhookError } = await supabase
        .from('webhook_events')
        .upsert({
          event_id: event.event_id || `${event.type}_${Date.now()}`,
          event_type: event.type,
          payload: event,
          status: 'processing',
          created_at: new Date().toISOString()
        }, {
          onConflict: 'event_id'
        })
        .select()
        .single();

      if (!webhookError && webhookEvent) {
        webhookEventId = webhookEvent.id;
      }

      // Check if already processed
      if (webhookEvent?.status === 'completed') {
        console.log('Webhook already processed:', event.event_id);
        return NextResponse.json({ received: true, status: 'already_processed' });
      }
    }

    // Handle payment events
    if (event.type === 'payment.created' || event.type === 'payment.updated') {
      const payment = event.data.object.payment;
      
      // Only process completed payments
      if (payment.status !== 'COMPLETED') {
        return NextResponse.json({ received: true });
      }

      // Extract payment details
      const amountCents = payment.amount_money.amount;
      const paymentId = payment.id;
      const note = payment.note || '';

      // Parse user info from payment note
      let userId: string | null = null;
      let email: string | null = null;
      let product: 'course' | 'coaching' | null = null;
      let isRaffleEntry = false;
      let raffleMetadata: any = null;

      // Check if this is a raffle entry (note contains JSON)
      try {
        if (note.startsWith('{') && note.includes('is_raffle_entry')) {
          raffleMetadata = JSON.parse(note);
          if (raffleMetadata.is_raffle_entry === 'true') {
            isRaffleEntry = true;
            product = 'course'; // Raffle is for course
            userId = raffleMetadata.user_id || null;
            email = raffleMetadata.email;
          }
        }
      } catch (e) {
        // Not JSON, parse as before
      }

      // If not raffle, parse normally
      if (!isRaffleEntry) {
        // Extract product type
        if (note.toLowerCase().includes('course')) {
          product = 'course';
        } else if (note.toLowerCase().includes('coaching')) {
          product = 'coaching';
        }

        // Extract user ID
        const userIdMatch = note.match(/User: ([a-zA-Z0-9-]+)/);
        if (userIdMatch) {
          userId = userIdMatch[1];
        }

        // Extract email
        const emailMatch = note.match(/Email: ([^\s]+@[^\s]+)/);
        if (emailMatch) {
          email = emailMatch[1];
        }
      }

      // Also check buyer email as fallback
      if (!email && payment.buyer_email_address) {
        email = payment.buyer_email_address;
      }

      // Store purchase in Supabase
      const supabase = getSupabaseServiceRole();
      if (supabase && product) {
        // Store the purchase record
        const { data: purchaseRecord, error: purchaseError } = await supabase
          .from('purchases')
          .upsert({
            user_id: userId,
            email: email,
            product: product,
            amount_cents: amountCents,
            square_payment_id: paymentId,
            raffle_id: isRaffleEntry ? raffleMetadata?.raffle_id : null,
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'square_payment_id',
          })
          .select()
          .single();

        if (purchaseError) {
          console.error('Error storing purchase:', purchaseError);
          // Don't fail the webhook - Square will retry
        }

        // If this is a raffle entry, create the entry and grant course access
        if (isRaffleEntry && raffleMetadata && purchaseRecord) {
          try {
            // Create raffle entry
            const { data: entry, error: entryError } = await supabase
              .from('raffle_entries')
              .insert({
                raffle_id: raffleMetadata.raffle_id,
                user_id: userId,
                email: email,
                phone: raffleMetadata.phone || null,
                purchase_id: purchaseRecord.id,
                commitment_message: raffleMetadata.commitment_message,
                transformation_goal: raffleMetadata.transformation_goal,
              })
              .select()
              .single();

            if (entryError) {
              console.error('Error creating raffle entry:', entryError);
            } else if (entry) {
              console.log('Raffle entry created:', entry.id);

              // Grant course access if user exists
              if (userId) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
                  user_metadata: {
                    has_course_access: true,
                    course_purchase_date: new Date().toISOString(),
                    course_payment_id: paymentId,
                    raffle_entry: true,
                  }
                });

                if (updateError) {
                  console.error('Error granting course access:', updateError);
                }
              }

              // Get warrior count for email
              const { count } = await supabase
                .from('raffle_entries')
                .select('*', { count: 'exact', head: true })
                .eq('raffle_id', raffleMetadata.raffle_id);

              // Send confirmation email
              try {
                await sendRaffleConfirmationEmail({
                  to: email!,
                  userName: raffleMetadata.user_name || email?.split('@')[0] || 'Warrior',
                  productName: 'Kill The Boy Course - Grand Opening Special',
                  amount: (amountCents / 100).toFixed(2),
                  entryNumber: entry.entry_number,
                  warriorCount: count || 1,
                  transformationGoal: raffleMetadata.transformation_goal,
                  accessUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.killtheboy.com'}/course`,
                });
              } catch (emailError) {
                console.error('Error sending raffle confirmation email:', emailError);
                // Don't fail - purchase is complete
              }
            }
          } catch (raffleError) {
            console.error('Error processing raffle entry:', raffleError);
            // Don't fail - purchase is stored
          }
        } else if (!isRaffleEntry && email && product) {
          // Send payment receipt for non-raffle purchases
          try {
            await sendPaymentReceiptEmail({
              to: email,
              userName: userId ? (await supabase.auth.admin.getUserById(userId)).data?.user?.user_metadata?.name || email.split('@')[0] : email.split('@')[0],
              productName: product === 'course' ? 'Kill The Boy Course' : 'Personal Coaching Session',
              amount: (amountCents / 100).toFixed(2),
              paymentId: paymentId,
              date: new Date().toLocaleString(),
              invoiceUrl: undefined // Could generate invoice URL if needed
            });
          } catch (receiptError) {
            console.error('Error sending payment receipt email:', receiptError);
            // Don't fail - purchase is complete
          }
        }
      }
    }

    // Mark webhook as completed if we have an ID
    if (webhookEventId) {
      const supabase = getSupabaseServiceRole();
      if (supabase) {
        await supabase
          .from('webhook_events')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', webhookEventId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);

    // Mark webhook as failed if we have an ID
    if (webhookEventId) {
      const supabase = getSupabaseServiceRole();
      if (supabase) {
        await supabase
          .from('webhook_events')
          .update({
            status: 'failed',
            last_error: error instanceof Error ? error.message : String(error),
            attempts: 1,
            next_retry_at: new Date(Date.now() + 60000).toISOString() // Retry in 1 minute
          })
          .eq('id', webhookEventId);
      }
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

* ============================================================================ */
