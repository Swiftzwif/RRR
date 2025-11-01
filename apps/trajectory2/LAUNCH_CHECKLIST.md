# 🚀 Trajectory Launch Checklist - November 1st Deadline

## Quick Setup (Do Now - 10 minutes)

### 1. Environment Variables ✅

```bash
cd apps/trajectory2
cp env.template .env.local
```

### 2. Vercel Deployment

1. Push your code: `git add . && git commit -m "Launch ready" && git push`
2. In Vercel Dashboard:
   - Import from GitHub
   - Root Directory: `apps/trajectory2`
   - Framework Preset: Next.js
   - Environment Variables: Copy everything from `.env.local`

### 3. Domain Setup (trajectorygroup.org)

Since you're using Squarespace for domain:

1. In Squarespace domain settings, add these DNS records:

   ```
   Type: A     Name: @      Value: 76.76.21.21
   Type: CNAME Name: www    Value: cname.vercel-dns.com
   ```

2. In Vercel: Settings → Domains → Add `trajectorygroup.org`

## Critical Path to Launch (Priority Order)

### Week 1: Core Functionality (Oct 18-24) ✅ COMPLETE

- [ ] **Supabase Setup**
  - [ ] Create project at supabase.com
  - [ ] Run database migrations (check `/scripts/supabase-schema.sql`)
  - [ ] Add credentials to Vercel env vars
  - [ ] Test assessment saves to database

- [ ] **Thinkific Course Integration**
  - [ ] Add `NEXT_PUBLIC_THINKIFIC_COURSE_URL` to Vercel env vars
  - [ ] Test redirect from assessment results page
  - [ ] Test redirect from course page
  - [ ] Verify Thinkific checkout flow works

- [ ] **Email Domain Verification**
  - [ ] Add trajectorygroup.org to Resend
  - [ ] Add DNS records from Resend to Squarespace
  - [ ] Test email sending with your <jsanchez@trajectorygroup.org>

- [ ] **Basic Testing**
  - [ ] Complete assessment flow
  - [ ] Verify email is sent
  - [ ] Check results display correctly
  - [ ] Test course purchase redirect to Thinkific

### Week 2: Content & Polish (Oct 25-31)

- [ ] **7-Day Content**
  - [ ] Add book summaries for Days 1-7
  - [ ] Create downloadable worksheets
  - [ ] Test Day 1 email delivery

- [ ] **Final Checks**
  - [ ] Mobile responsiveness
  - [ ] Cross-browser testing
  - [ ] Fix any critical bugs
  - [ ] Analytics setup (optional but recommended)

## Time-Saving Recommendations

### 1. Use Vercel's Built-in Features

- **Analytics**: Just enable in Vercel dashboard (free)
- **Speed Insights**: Automatic performance monitoring
- **Preview Deployments**: Every PR gets a preview URL

### 2. Monitoring Setup (5 minutes)

- **Sentry** for error tracking:

  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

- Add `SENTRY_DSN` to env vars

### 3. Quick Wins for Launch

- **Favicon**: Add `favicon.ico` to `/public`
- **OG Image**: Create `opengraph-image.png` (1200x630)
- **Robots.txt**: Allow search engines

  ```txt
  User-agent: *
  Allow: /
  Sitemap: https://trajectorygroup.org/sitemap.xml
  ```

### 4. Email Scheduling (Post-Launch)

Instead of complex job queues, use Resend's built-in scheduling:

```typescript
// In your email service
await resend.emails.send({
  from: RESEND_FROM_EMAIL,
  to: email,
  subject: `Day ${day}: ${title}`,
  react: DailyExperienceEmail(props),
  scheduledAt: new Date(Date.now() + (day * 24 * 60 * 60 * 1000))
});
```

## Database Schema Quick Setup

Run this in Supabase SQL editor:

```sql
-- Assessments table
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  answers JSONB NOT NULL,
  domain_scores JSONB NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchases table (for when Square is ready)
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  product TEXT CHECK (product IN ('course', 'coaching')),
  amount_cents INTEGER NOT NULL,
  square_payment_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email notifications
CREATE TABLE email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, topic)
);

-- Indexes for performance
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_email ON assessments(email);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_email ON purchases(email);
```

## Launch Day Checklist

### Morning of November 1st

- [ ] Final deployment to production
- [ ] Test complete user flow
- [ ] Send test email to yourself
- [ ] Check all links work
- [ ] Verify domain is live

### Go-Live

- [ ] Announce on social media
- [ ] Send to your email list
- [ ] Monitor for any issues
- [ ] Celebrate! 🎉

## Support Resources

- **Vercel Support**: <support@vercel.com>
- **Resend Dashboard**: <https://resend.com/emails>
- **Supabase Dashboard**: <https://app.supabase.com>
- **Error Monitoring**: Check Vercel Functions logs

## Post-Launch Priorities

1. **Week 1**: Monitor user feedback, fix critical bugs
2. **Week 2**: Track Thinkific conversion rates, optimize CTAs
3. **Week 3**: Implement full 31-day content
4. **Month 2**: Consider re-enabling Square for custom checkout experience
5. **Month 2**: Add community features

Remember: Launch with core features working well rather than everything perfect. You can iterate after launch!

**Note**: Square payment integration is preserved and ready to re-enable if you want more control over the checkout experience in the future.
