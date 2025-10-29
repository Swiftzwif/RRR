# API Route Builder Skill

This skill helps create new API routes following Next.js 15 conventions and project patterns.

## When to Use This Skill

Use this skill when you need to create a new API endpoint for:
- Data fetching from Supabase
- Square payment processing
- Email sending via Resend
- Webhook handling
- Server-side operations

## API Route Template

```typescript
// app/api/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Define request schema with Zod
const RequestSchema = z.object({
  // Define expected fields
  field1: z.string(),
  field2: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    // 2. Check authentication if needed
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 3. Perform operation
    const { data, error } = await supabase
      .from('table_name')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }

    // 4. Return success response
    return NextResponse.json({ data }, { status: 200 });

  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.issues },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Example: Get query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Webhook Template

For external webhooks (Square, Stripe, etc.):

```typescript
// app/api/webhooks/[service]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Get raw body and signature
    const bodyString = await request.text();
    const signature = request.headers.get('x-signature-header');

    // 2. Verify webhook signature
    const expectedSignature = createHmac('sha256', process.env.WEBHOOK_SECRET!)
      .update(bodyString)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Parse event
    const event = JSON.parse(bodyString);

    // 4. Handle event type
    switch (event.type) {
      case 'event.type.1':
        await handleEventType1(event.data);
        break;
      case 'event.type.2':
        await handleEventType2(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
```

## Checklist

- [ ] Zod schema for request validation
- [ ] Proper error handling (try/catch)
- [ ] Authentication check (if needed)
- [ ] TypeScript types for all data
- [ ] Appropriate HTTP status codes
- [ ] Console logging for debugging
- [ ] Webhook signature verification (if webhook)
- [ ] Graceful error responses
- [ ] Test in development with curl or Postman

## Common Patterns

**Supabase Query**:
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

**Square Payment**:
```typescript
const response = await fetch('https://connect.squareup.com/v2/endpoint', {
  method: 'POST',
  headers: {
    'Square-Version': '2024-01-18',
    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
});
```

**Send Email**:
```typescript
import { sendPurchaseConfirmationEmail } from '@/lib/email';

await sendPurchaseConfirmationEmail({
  to: user.email,
  productName: 'Course',
  amount: '99.99',
  accessUrl: 'https://...'
});
```
