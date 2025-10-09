import { getSupabaseServiceRole } from '@/lib/supabase';
import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
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
      
      // Also check buyer email
      if (!email && payment.buyer_email_address) {
        email = payment.buyer_email_address;
      }

      // Store purchase in Supabase
      const supabase = getSupabaseServiceRole();
      if (supabase && product) {
        const { error } = await supabase
          .from('purchases')
          .upsert({
            user_id: userId,
            email: email,
            product: product,
            amount_cents: amountCents,
            square_payment_id: paymentId,
            created_at: new Date().toISOString(),
          }, {
            onConflict: 'square_payment_id',
          });

        if (error) {
          console.error('Error storing purchase:', error);
          // Don't fail the webhook - Square will retry
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
