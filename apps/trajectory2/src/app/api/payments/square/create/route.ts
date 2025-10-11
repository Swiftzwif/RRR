import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema
const createPaymentSchema = z.object({
  product: z.enum(['course', 'coaching']),
  userId: z.string().optional(),
  email: z.string().email().optional(),
});

// Square API configuration
const SQUARE_BASE_URL = process.env.SQUARE_ENVIRONMENT === 'production' 
  ? 'https://connect.squareup.com/v2'
  : 'https://connect.squareupsandbox.com/v2';

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// Product configuration
const PRODUCTS = {
  course: {
    name: 'Trajectory Course - Rethink. Redesign. Reignite.',
    amount: 9999, // $99.99 in cents
    description: 'Complete 31-day transformation experience with all book summaries, action tasks, and worksheets',
  },
  coaching: {
    name: 'Trajectory Coaching Interview',
    amount: 2499, // $24.99 in cents
    description: '1-on-1 coaching interview to determine fit and create your personalized roadmap',
  },
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const { product, userId, email } = createPaymentSchema.parse(body);

    // Get product details
    const productDetails = PRODUCTS[product];
    
    // Get success URL from request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const successUrl = `${baseUrl}/${product}?success=1&session_id={CHECKOUT_SESSION_ID}`;

    // Create Square Payment Link
    const paymentLinkResponse = await fetch(`${SQUARE_BASE_URL}/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: `${product}-${userId || email}-${Date.now()}`,
        quick_pay: {
          name: productDetails.name,
          price_money: {
            amount: productDetails.amount,
            currency: 'USD',
          },
          location_id: SQUARE_LOCATION_ID,
        },
        checkout_options: {
          redirect_url: successUrl,
          ask_for_shipping_address: false,
          enable_loyalty: false,
          enable_coupon: false,
        },
        pre_populated_data: email ? {
          buyer_email: email,
        } : undefined,
        payment_note: `${product} purchase${userId ? ` - User: ${userId}` : ''}${email ? ` - Email: ${email}` : ''}`,
      }),
    });

    if (!paymentLinkResponse.ok) {
      const error = await paymentLinkResponse.json();
      console.error('Square API Error:', error);
      throw new Error('Failed to create payment link');
    }

    const paymentLinkData = await paymentLinkResponse.json();
    
    return NextResponse.json({
      url: paymentLinkData.payment_link.url,
      id: paymentLinkData.payment_link.id,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
}
