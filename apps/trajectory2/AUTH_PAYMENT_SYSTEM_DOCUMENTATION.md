# Authentication & Payment System Documentation

## 🚀 Overview

This document provides comprehensive documentation for the authentication, payment, and email automation system implemented for the Kill The Boy application.

## 📋 Table of Contents

1. [Database Schema](#database-schema)
2. [Authentication System](#authentication-system)
3. [Payment Processing](#payment-processing)
4. [Email Automation](#email-automation)
5. [Security Features](#security-features)
6. [Admin Tools](#admin-tools)
7. [Testing](#testing)
8. [Environment Variables](#environment-variables)
9. [Troubleshooting](#troubleshooting)

---

## 🗄️ Database Schema

### New Tables Created

#### 1. **purchases**
Stores all purchase transactions from Square payments.

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  product TEXT CHECK (product IN ('raffle_entry', 'course', 'coaching')),
  amount_cents INTEGER NOT NULL,
  square_payment_id TEXT UNIQUE NOT NULL,
  square_order_id TEXT,
  raffle_id UUID REFERENCES raffle_config(id),
  status TEXT DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. **webhook_events**
Tracks and manages webhook events for retry mechanism.

```sql
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  last_error TEXT,
  next_retry_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. **auth_events**
Logs authentication events for security auditing.

```sql
CREATE TABLE auth_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT CHECK (event_type IN ('signup', 'signin', 'signout', 'password_reset_requested', ...)),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Security Fixes Applied

#### RLS Policy Fix for raffle_entries
Fixed critical privacy leak that exposed all user entries:

```sql
-- REMOVED: Dangerous policy that exposed all data
DROP POLICY IF EXISTS "Users view own entries" ON raffle_entries;

-- ADDED: Secure policies
CREATE POLICY "Users view own raffle entries by user_id" ON raffle_entries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users view own raffle entries by email" ON raffle_entries
  FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
```

---

## 🔐 Authentication System

### Features Implemented

1. **Email/Password Authentication**
   - Secure signup with email verification
   - Password reset flow with email confirmation
   - Rate-limited endpoints for security

2. **Google OAuth Integration**
   - Seamless social login
   - Automatic account linking

3. **Email Verification**
   - Automatic verification emails on signup
   - Resend verification endpoint
   - Token-based verification with expiry

4. **Password Reset Flow**
   - Secure token generation
   - Email delivery with reset link
   - Rate limiting (3 attempts per 15 minutes)
   - Token expiry (1 hour)

### API Endpoints

#### POST `/api/auth/reset-password`
Request a password reset email.

```javascript
// Request
{
  "email": "user@example.com"
}

// Response
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

#### PUT `/api/auth/reset-password`
Update password with reset token.

```javascript
// Request
{
  "token": "reset_token_here",
  "password": "NewSecurePassword123!"
}

// Response
{
  "message": "Password successfully reset",
  "user": { "email": "user@example.com", "id": "user_id" }
}
```

#### POST `/api/auth/verify-email`
Send or resend verification email.

```javascript
// Request
{
  "email": "user@example.com"
  // OR
  "userId": "user_id_here"
}

// Response
{
  "message": "Verification email sent",
  "email": "user@example.com"
}
```

---

## 💳 Payment Processing

### Square Webhook Integration

The system processes Square payment webhooks with:
- Signature verification for security
- Duplicate prevention
- Automatic retry mechanism
- Failed payment reconciliation

### Webhook Flow

1. **Receive webhook** at `/api/webhooks/square`
2. **Verify signature** using HMAC-SHA256
3. **Store event** in `webhook_events` table
4. **Process payment**:
   - Create purchase record
   - Create raffle entry (if applicable)
   - Grant course access
   - Send confirmation email
5. **Mark as completed** or schedule retry

### Retry Mechanism

Failed webhooks are retried with exponential backoff:
- 1st retry: 1 minute
- 2nd retry: 5 minutes
- 3rd retry: 15 minutes
- 4th retry: 1 hour
- 5th retry: 6 hours

---

## 📧 Email Automation

### Email Templates

All emails are sent via Resend API with the following templates:

1. **Welcome Email** (`sendWelcomeEmail`)
   - Sent on new user signup
   - Includes verification link if unverified

2. **Email Verification** (`sendEmailVerification`)
   - Verification link with 24-hour expiry
   - Clear instructions

3. **Password Reset** (`sendPasswordResetEmail`)
   - Secure reset link with 1-hour expiry
   - Security information included

4. **Payment Receipt** (`sendPaymentReceiptEmail`)
   - Transaction details
   - Product information
   - Access instructions

5. **Raffle Confirmation** (`sendRaffleConfirmationEmail`)
   - Entry number
   - Warrior count
   - Transformation goal
   - Course access link

### Email Utility Functions

Located in `/src/lib/email.ts`:

```typescript
// Send welcome email to new user
await sendWelcomeEmail({
  to: "user@example.com",
  userName: "John",
  verificationUrl: "https://..."
});

// Send payment receipt
await sendPaymentReceiptEmail({
  to: "user@example.com",
  userName: "John",
  productName: "Kill The Boy Course",
  amount: "25.00",
  paymentId: "payment_123",
  date: "2024-10-30"
});
```

---

## 🛡️ Security Features

### 1. Rate Limiting

Implemented across all sensitive endpoints:

```typescript
// Configuration in /src/lib/rate-limit.ts
const rateLimitConfigs = {
  auth: { maxRequests: 5, windowMs: 5 * 60 * 1000 },
  passwordReset: { maxRequests: 3, windowMs: 15 * 60 * 1000 },
  emailVerification: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  webhook: { maxRequests: 100, windowMs: 60 * 1000 },
  admin: { maxRequests: 30, windowMs: 60 * 1000 }
};
```

### 2. Environment Variable Security

Removed all hardcoded credentials. All sensitive data now in environment variables:
- ✅ No hardcoded Supabase URLs or keys
- ✅ No hardcoded API keys
- ✅ Secure admin authentication

### 3. RLS (Row Level Security)

Applied proper RLS policies:
- Users can only view their own data
- Service role has full access for admin operations
- No public access to sensitive tables

---

## 🛠️ Admin Tools

### Payment Reconciliation Dashboard

Located at `/admin/payments`

Features:
- View failed webhook events
- Manually reconcile payments
- Retry failed webhooks in bulk
- Secure admin authentication

Usage:
1. Navigate to `/admin/payments`
2. Enter admin secret (from `ADMIN_SECRET` env var)
3. Click "Fetch Events" to load failed webhooks
4. Use "Reconcile" to process individual payments
5. Use "Retry All Failed" for bulk retry

### Admin API Endpoints

#### GET `/api/admin/reconcile-payments`
Fetch unprocessed webhook events.

#### POST `/api/admin/reconcile-payments`
Manually reconcile a specific payment.

#### PATCH `/api/admin/reconcile-payments`
Retry all failed webhook events.

---

## 🧪 Testing

### Automated Test Suite

Run the comprehensive test suite:

```bash
node test-auth-payment-system.js
```

Tests include:
- Environment variable validation
- Password reset flow with rate limiting
- Email verification
- Webhook processing
- Admin API security

### Manual Testing Checklist

- [ ] User can sign up with email/password
- [ ] User receives welcome email
- [ ] User can verify email
- [ ] User can reset password
- [ ] Rate limiting blocks excessive requests
- [ ] Payment webhooks are processed
- [ ] Failed webhooks retry automatically
- [ ] Admin can view failed payments
- [ ] Admin can manually reconcile payments

---

## 🔧 Environment Variables

Required environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=hello@yourdomain.com

# Square Payments
SQUARE_ACCESS_TOKEN=your_square_token
SQUARE_WEBHOOK_SIGNATURE_KEY=your_webhook_key
SQUARE_ENVIRONMENT=sandbox # or production

# Admin
ADMIN_SECRET=your_secure_admin_secret

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Emails not sending
- Check `RESEND_API_KEY` is valid
- Verify `RESEND_FROM_EMAIL` is verified in Resend dashboard
- Check email utility logs in console

#### 2. Webhooks failing
- Verify `SQUARE_WEBHOOK_SIGNATURE_KEY` matches Square dashboard
- Check webhook_events table for error messages
- Use admin dashboard to manually reconcile

#### 3. Rate limiting too strict
- Adjust configurations in `/src/lib/rate-limit.ts`
- Clear rate limit cache by restarting server

#### 4. Database migrations not applied
- Run migrations manually in Supabase SQL editor
- Check migration files in `/supabase/migrations/`

### Debug Mode

Enable detailed logging:

```javascript
// In relevant files, add:
console.log('DEBUG:', { /* your data */ });
```

### Support

For issues or questions:
1. Check this documentation
2. Review test output from `test-auth-payment-system.js`
3. Check Supabase logs
4. Review Square webhook logs

---

## 📝 Migration Checklist

When deploying to production:

1. **Database Setup**
   - [ ] Run all migrations in order
   - [ ] Verify table creation
   - [ ] Test RLS policies

2. **Environment Configuration**
   - [ ] Set all required environment variables
   - [ ] Verify API keys are production keys
   - [ ] Set secure ADMIN_SECRET

3. **Testing**
   - [ ] Run test suite
   - [ ] Test payment flow end-to-end
   - [ ] Verify email delivery

4. **Monitoring**
   - [ ] Set up error tracking (Sentry)
   - [ ] Monitor webhook_events table
   - [ ] Set up alerts for failed payments

---

## 🎉 Summary

The authentication and payment system provides:

✅ **Secure user authentication** with email verification and password reset
✅ **Reliable payment processing** with automatic retry mechanism
✅ **Comprehensive email automation** for all user interactions
✅ **Admin tools** for payment reconciliation
✅ **Security features** including rate limiting and RLS policies
✅ **Detailed logging** for debugging and auditing

The system is production-ready with proper error handling, security measures, and administrative capabilities.