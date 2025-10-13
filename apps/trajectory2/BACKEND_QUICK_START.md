# 🚀 Backend Quick Start Guide
## Get Your Trajectory2 Backend Running in 15 Minutes

> **TL;DR:** Copy `.env.local`, fill in Supabase keys, run migrations, test. That's it.

---

## The Absolute Minimum (5 Minutes)

### Step 1: Create Environment File (1 minute)

```bash
cd apps/trajectory2
cp env.template .env.local
```

**Or use the interactive script:**
```bash
./setup-env.sh
```

### Step 2: Get Supabase Credentials (2 minutes)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Create new project or select existing
3. Settings → API
4. Copy these three values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

5. Paste them into `.env.local` (replace the TODO_... placeholders)

### Step 3: Run Database Migrations (2 minutes)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New query**
3. Copy entire contents of `/database/schemas/main-schema.sql`
4. Paste and click **Run**
5. You should see: `Success. No rows returned`

**Optional but recommended:** Run premium features migration
- Copy SQL from `SUPABASE_PREMIUM_IMPLEMENTATION.md`
- Paste in new query and run

### Step 4: Test It (30 seconds)

```bash
npm run dev
```

Visit `http://localhost:3003`

**✅ If the page loads, you're done!**

---

## The Complete Setup (15 Minutes)

For full functionality including emails and payments:

### 1. Supabase Setup (5 minutes)

**Create Project:**
```
1. Go to https://supabase.com
2. Create new project
3. Save database password (you'll need it!)
4. Wait 2-3 minutes for provisioning
```

**Get API Keys:**
```
Settings → API → Copy:
  - Project URL
  - anon/public key  
  - service_role key
```

**Run Migrations:**
```sql
-- In SQL Editor:
-- 1. Run main-schema.sql (REQUIRED)
-- 2. Run premium features SQL (OPTIONAL)
```

**Configure Auth:**
```
Authentication → Settings:
  - Site URL: http://localhost:3003
  - Redirect URLs: http://localhost:3003/**
```

**Update Email Template:**
```
Authentication → Email Templates → Confirm signup:
  Replace {{ .ConfirmationURL }} with:
  {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

### 2. Email Setup (3 minutes)

**Get Resend API Key:**
```
1. Sign up at https://resend.com
2. API Keys → Create API Key
3. Copy the key (starts with re_...)
```

**Configure Domain:**
```
Domains → Add Domain → your-domain.com
Add DNS records shown
Wait for verification (~5 min)
```

**Update .env.local:**
```env
RESEND_API_KEY=re_your_actual_key
RESEND_FROM_EMAIL=Your Name <hello@your-domain.com>
```

**For testing only:**
```env
RESEND_FROM_EMAIL=Trajectory <onboarding@resend.dev>
```

### 3. App Configuration (1 minute)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

For production:
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Verification (1 minute)

**Test database connection:**
```bash
npm run dev
# Visit http://localhost:3003/assessment
# Complete assessment
# Submit email
```

**Check Supabase:**
```
Table Editor → assessments (should have 1 row)
Table Editor → email_notifications (should have 1 row)
```

**✅ If you see data, everything works!**

---

## File Structure

```
apps/trajectory2/
├── env.template               ← Copy this to .env.local
├── setup-env.sh              ← Interactive setup script
├── SUPABASE_BACKEND_SETUP.md ← Comprehensive guide
├── BACKEND_QUICK_START.md    ← This file
├── EMAIL_SETUP.md            ← Email details
├── PAYMENT_SETUP.md          ← Payment details
└── .env.local                ← Create this (gitignored)
```

---

## Environment Variables Reference

### Required (App won't work without these)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Name <email@domain.com>
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

### Optional (Can add later)

```env
# Square Payments
SQUARE_ACCESS_TOKEN=...
SQUARE_LOCATION_ID=...
SQUARE_ENVIRONMENT=sandbox
SQUARE_WEBHOOK_SIGNATURE_KEY=...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_GA_MEASUREMENT_ID=...
```

---

## Common Issues

### Issue: "Supabase URL is not defined"

**Fix:**
```bash
# Check .env.local exists
ls -la .env.local

# Check variable is set
grep NEXT_PUBLIC_SUPABASE_URL .env.local

# Restart dev server
npm run dev
```

### Issue: "Failed to send email"

**Fix:**
```bash
# Verify Resend API key
curl -X GET https://api.resend.com/api-keys \
  -H "Authorization: Bearer YOUR_API_KEY"

# Check domain is verified
# Go to: https://resend.com/domains
```

### Issue: "Database connection failed"

**Fix:**
```bash
# Check Supabase project is not paused
# Go to: https://supabase.com/dashboard

# Verify credentials are correct
# Settings → API → Compare with .env.local

# Check migrations ran
# Table Editor → Should see all tables
```

### Issue: "Permission denied for relation"

**Fix:**
```sql
-- In Supabase SQL Editor:
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Re-run migration if needed
-- Copy main-schema.sql and run again
```

---

## What Each File Does

| File | Purpose | When to Use |
|------|---------|-------------|
| `env.template` | Template for environment variables | Copy to `.env.local` to start |
| `setup-env.sh` | Interactive setup script | Run to create `.env.local` interactively |
| `SUPABASE_BACKEND_SETUP.md` | Comprehensive backend guide | Read for detailed setup instructions |
| `BACKEND_QUICK_START.md` | This file - quick reference | Read for fastest setup path |
| `EMAIL_SETUP.md` | Email configuration details | Read when setting up Resend |
| `PAYMENT_SETUP.md` | Payment integration guide | Read when adding Square payments |
| `PREMIUM_SETUP_GUIDE.md` | Premium features guide | Read when enabling premium tiers |
| `.env.local` | Your actual environment variables | Create this, never commit to git |

---

## Testing Checklist

After setup, verify these work:

- [ ] Homepage loads (http://localhost:3003)
- [ ] Assessment page loads (http://localhost:3003/assessment)
- [ ] Can complete assessment
- [ ] Can submit email
- [ ] Data appears in Supabase tables
- [ ] No console errors (F12 to check)
- [ ] Can sign up for account
- [ ] Can log in
- [ ] Can log out

---

## Next Steps

**After backend is working:**

1. ✅ **Set up payments** (optional)
   - See `PAYMENT_SETUP.md`
   - Configure Square credentials
   - Test in sandbox mode

2. ✅ **Enable premium features** (optional)
   - See `PREMIUM_SETUP_GUIDE.md`
   - Run premium migration
   - Test feature gating

3. ✅ **Deploy to production**
   - See `VERCEL_DEPLOYMENT_CHECKLIST.md`
   - Configure production environment variables
   - Update Supabase auth URLs

---

## Help & Resources

**Documentation:**
- 📖 [Supabase Docs](https://supabase.com/docs)
- 📧 [Resend Docs](https://resend.com/docs)
- 💳 [Square Docs](https://developer.squareup.com/docs)

**Support:**
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)

**Internal Docs:**
- Complete setup: `SUPABASE_BACKEND_SETUP.md`
- Email setup: `EMAIL_SETUP.md`
- Payment setup: `PAYMENT_SETUP.md`
- Premium features: `PREMIUM_SETUP_GUIDE.md`

---

## Commands Reference

```bash
# Environment setup
cp env.template .env.local          # Copy template
./setup-env.sh                      # Interactive setup
vim .env.local                      # Edit manually

# Development
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run start                       # Start production server

# Database
# (Run in Supabase SQL Editor)
# - main-schema.sql - Core tables
# - premium migration - Premium features

# Testing
curl http://localhost:3003          # Test homepage
curl http://localhost:3003/api/health # Test API (if exists)
```

---

## Security Reminders

⚠️ **NEVER:**
- Commit `.env.local` to git (it's in `.gitignore`)
- Share your `SUPABASE_SERVICE_ROLE_KEY` publicly
- Expose service role key to browser/client-side code
- Use production keys in development

✅ **ALWAYS:**
- Use `.env.local` for local development
- Use Vercel Environment Variables for production
- Rotate secrets every 6 months
- Use different keys for dev/staging/production

---

## Production Deployment Quick Checklist

Before deploying to production:

- [ ] Created production Supabase project
- [ ] Ran all migrations on production database
- [ ] Updated `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Configured production env vars in Vercel
- [ ] Updated Supabase auth URLs to production
- [ ] Verified Resend domain for production
- [ ] Tested email delivery to real addresses
- [ ] Enabled database backups in Supabase
- [ ] Set up error monitoring (Sentry)
- [ ] Tested all critical user flows

---

**🎉 That's it! You're ready to build.**

**Questions?** Check `SUPABASE_BACKEND_SETUP.md` for detailed explanations.

---

_Last updated: January 2025_

