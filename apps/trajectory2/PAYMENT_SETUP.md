# Payment Setup Guide

## Overview

This guide covers payment integration for the Trajectory2 platform.

**Current Integration**: Thinkific (Active)
**Preserved for Future**: Square Payment API

## Current: Thinkific Integration ✅

### Setup

1. Course URL is configured in `.env.local`:
   ```env
   NEXT_PUBLIC_THINKIFIC_COURSE_URL=https://jean-s-site-8b39.thinkific.com/products/courses/trajectory
   ```

2. No additional setup required - redirects work automatically!

3. Users are redirected to Thinkific to:
   - Purchase the course
   - Access course content
   - Manage their enrollment

## Preserved: Square Payment API (Disabled)

**Status**: Code preserved but disabled. All Square infrastructure exists and can be re-enabled in minutes when needed.

### Environment Variables (Optional - Not Required)

### Square Configuration

```env
# These are preserved for future use - not required for Thinkific integration

# Square API Access Token (from Square Dashboard)
# SQUARE_ACCESS_TOKEN=your_square_access_token

# Square Location ID (from Square Dashboard)
# SQUARE_LOCATION_ID=your_square_location_id

# Environment: sandbox or production
# SQUARE_ENVIRONMENT=sandbox

# Webhook Signature Key (from Square Webhooks settings)
# SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_signature_key
```

## Re-enabling Square (When Needed)

All Square code is preserved with clear comments. To re-enable:

1. Uncomment Square routes in `/src/app/api/payments/square/` and `/src/app/api/webhooks/square/`
2. Update `env-validation.ts` to make Square vars required again
3. Add Square credentials to `.env.local`
4. Configure webhook endpoint in Square dashboard
5. Test the payment flow

That's it! The entire integration is ready to go.

### Original Square Setup Steps (Reference Only)

### 1. Create Square Account

1. Go to [Square Developer](https://developer.squareup.com)
2. Create a new application
3. Note your Sandbox credentials for testing

### 2. Configure Payment Links

The application uses Square Payment Links API for a quick MVP approach:

- Course: $99.99
- Coaching Interview: $24.99

### 3. Set Up Webhooks

1. In Square Dashboard, go to Webhooks
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/square`
3. Subscribe to events:
   - `payment.created`
   - `payment.updated`
4. Copy the Signature Key to your env

### 4. Database Schema

Ensure your Supabase has the `purchases` table:

```sql
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  product TEXT CHECK (product IN ('course', 'coaching')),
  amount_cents INTEGER NOT NULL,
  stripe_session_id TEXT,
  square_payment_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_square_payment_id ON purchases(square_payment_id);
```

### 5. Test Payment Flow

1. Use Square Sandbox test cards
2. Complete a purchase
3. Verify webhook receives event
4. Check purchase is recorded in database

## API Routes

### `/api/payments/square/create`

Creates a Square Payment Link for course or coaching.

**Request:**

```json
{
  "product": "course" | "coaching",
  "userId": "optional-user-id",
  "email": "optional@email.com"
}
```

**Response:**

```json
{
  "url": "https://square.link/...",
  "id": "payment-link-id"
}
```

### `/api/webhooks/square`

Handles Square webhook events to record successful payments.

## Moving to Production

1. Get production credentials from Square
2. Update `SQUARE_ENVIRONMENT=production`
3. Update webhook URL to production domain
4. Test with real payment

## Future Enhancements

Consider moving to Square Web Payments SDK for:

- Fully branded checkout experience
- Save payment methods
- Subscription support
- Better conversion tracking
