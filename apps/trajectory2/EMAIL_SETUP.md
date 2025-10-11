# Email Setup Guide for Trajectory2

## Overview
This guide walks through setting up Resend for email delivery in the Trajectory2 platform.

## Quick Start

### 1. Copy Environment Variables
```bash
cp env.template .env.local
```

### 2. Add Your Resend API Key
In `.env.local`, add your Resend API key:
```env
RESEND_API_KEY=re_123456789_your_actual_api_key
```

### 3. Configure Your Domain in Resend

1. Go to [Resend Domains](https://resend.com/domains)
2. Add your domain (e.g., `trajectory.com`)
3. Add the DNS records Resend provides to your domain
4. Wait for verification (usually ~5 minutes)
5. Update your `.env.local`:
   ```env
   RESEND_FROM_EMAIL=Trajectory <hello@trajectory.com>
   NEXT_PUBLIC_APP_URL=https://trajectory.com
   ```

## Email Templates

We've created two React Email templates:

### 1. Assessment Complete Email
- **File**: `/src/emails/assessment-complete.tsx`
- **Triggered**: When user completes assessment and enters email
- **Contains**: 
  - Assessment results (avatar, score)
  - CTA to start 7-day experience
  - Introduction to transformation journey

### 2. Daily Experience Email
- **File**: `/src/emails/daily-experience.tsx`
- **Triggered**: Daily for 7 days after assessment
- **Contains**:
  - Daily book summaries (3 per day)
  - Action tasks (2 per day)
  - Link to full day content with worksheets

## Testing Emails Locally

1. Install the React Email dev server:
   ```bash
   npm install -g react-email
   ```

2. Run the email preview server:
   ```bash
   cd apps/trajectory2
   email dev
   ```

3. Open http://localhost:3000 to preview your email templates

## Email Flow

### Assessment → Email Capture → 7-Day Sequence

1. **User completes assessment** → Results page
2. **Email capture form** → Triggers `/api/notify`
3. **Immediate email**: Assessment results + Day 1 access
4. **Daily emails**: Days 2-7 sent at 6 AM user timezone
5. **Day 7**: Includes upgrade CTA for full 31-day experience

## Production Checklist

- [ ] Domain verified in Resend
- [ ] SPF/DKIM records added to DNS
- [ ] From email matches verified domain
- [ ] Production URL set in `NEXT_PUBLIC_APP_URL`
- [ ] Test email delivery with real addresses
- [ ] Set up email scheduling (Inngest/BullMQ recommended)

## Email Scheduling Options

Currently, only Day 1 is sent immediately. For production, consider:

### Option 1: Inngest (Recommended)
```typescript
// Install: npm install inngest
// Create scheduled function for daily emails
```

### Option 2: Vercel Cron Jobs
```typescript
// app/api/cron/daily-emails/route.ts
// Configure in vercel.json
```

### Option 3: External Service
- SendGrid Campaigns
- Mailchimp Automations
- ConvertKit Sequences

## Monitoring

Track email performance:
1. Resend Dashboard shows delivery stats
2. Add tracking pixels for open rates
3. Use UTM parameters on links
4. Monitor `/api/notify` for errors

## Troubleshooting

### Emails not sending
1. Check Resend API key is correct
2. Verify domain is verified in Resend
3. Check logs: `console.error` in `/lib/email.ts`
4. Test with Resend playground

### Emails going to spam
1. Ensure SPF/DKIM are configured
2. Use verified domain (not gmail.com)
3. Avoid spam trigger words
4. Include unsubscribe link

### Rate limits
- Resend free tier: 100 emails/day
- Implement queuing for large sends
- Consider upgrading for production
