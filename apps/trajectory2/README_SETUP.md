# 🚀 Trajectory2 - Complete Setup Guide

> **Welcome!** This is your master setup guide. Everything you need to get Trajectory2 running from scratch.

---

## 📖 Quick Navigation

- [Fastest Setup (5 minutes)](#fastest-setup-5-minutes) - Get running NOW
- [Complete Setup (15 minutes)](#complete-setup-15-minutes) - Full functionality
- [Documentation Index](#documentation-index) - All guides
- [Troubleshooting](#troubleshooting) - Fix common issues

---

## Fastest Setup (5 Minutes)

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free)
- A Resend account (free)

### Steps

1. **Environment Setup** (1 minute)
   ```bash
   cd apps/trajectory2
   ./setup-env.sh
   # OR manually: cp env.template .env.local
   ```

2. **Get Supabase Keys** (2 minutes)
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Create/select project → Settings → API
   - Copy URL and keys into `.env.local`

3. **Run Database Migration** (1 minute)
   - In Supabase: SQL Editor → New query
   - Copy `/database/schemas/main-schema.sql` contents
   - Paste and Run

4. **Start Dev Server** (30 seconds)
   ```bash
   npm install
   npm run dev
   ```

5. **Test** (30 seconds)
   - Visit http://localhost:3003
   - If page loads → ✅ Done!

**Need more details?** See [BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md)

---

## Complete Setup (15 Minutes)

For full functionality including emails, payments, and premium features:

### 1. Backend Setup (5 min)

**Environment Variables:**
```bash
./setup-env.sh  # Interactive setup
# OR
cp env.template .env.local  # Manual setup
```

**Supabase Configuration:**
1. Create project at [supabase.com](https://supabase.com)
2. Run database migrations (see below)
3. Configure authentication
4. Update email templates

**Migrations to Run:**
```sql
-- Required:
1. /database/schemas/main-schema.sql

-- Optional but recommended:
2. Premium features SQL (from SUPABASE_PREMIUM_IMPLEMENTATION.md)
```

📖 **Detailed Guide:** [SUPABASE_BACKEND_SETUP.md](./SUPABASE_BACKEND_SETUP.md)

### 2. Email Setup (3 min)

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Verify domain (or use test domain)
4. Update `.env.local`:
   ```env
   RESEND_API_KEY=re_your_key
   RESEND_FROM_EMAIL=Your Name <email@domain.com>
   ```

📖 **Detailed Guide:** [EMAIL_SETUP.md](./EMAIL_SETUP.md)

### 3. Payment Setup (5 min) - Optional

1. Create [Square Developer](https://developer.squareup.com) account
2. Get sandbox credentials
3. Update `.env.local`:
   ```env
   SQUARE_ACCESS_TOKEN=your_token
   SQUARE_LOCATION_ID=your_location
   SQUARE_ENVIRONMENT=sandbox
   ```

📖 **Detailed Guide:** [PAYMENT_SETUP.md](./PAYMENT_SETUP.md)

### 4. Premium Features (2 min) - Optional

1. Run premium migration SQL
2. Test feature gating
3. Configure feature flags

📖 **Detailed Guide:** [PREMIUM_SETUP_GUIDE.md](./PREMIUM_SETUP_GUIDE.md)

---

## Documentation Index

### 🎯 Setup Guides (Start Here)

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md)** | Fastest path to running app | Starting from scratch |
| **[SUPABASE_BACKEND_SETUP.md](./SUPABASE_BACKEND_SETUP.md)** | Complete backend configuration | Need detailed instructions |
| **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** | Email delivery setup | Setting up notifications |
| **[PAYMENT_SETUP.md](./PAYMENT_SETUP.md)** | Payment integration | Adding paid features |
| **[ENV_SETUP.md](./ENV_SETUP.md)** | Environment variables reference | Quick env var lookup |

### 💎 Premium Features

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[PREMIUM_SETUP_GUIDE.md](./PREMIUM_SETUP_GUIDE.md)** | Setup premium user system | Enabling paid tiers |
| **[PREMIUM_USER_SYSTEM.md](./PREMIUM_USER_SYSTEM.md)** | Technical documentation | Building premium features |
| **[PREMIUM_QUICK_REFERENCE.md](./PREMIUM_QUICK_REFERENCE.md)** | API quick reference | Implementing features |
| **[SUPABASE_PREMIUM_IMPLEMENTATION.md](./SUPABASE_PREMIUM_IMPLEMENTATION.md)** | Premium database schema | Understanding structure |

### 📐 Design & Development

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** | UI/UX guidelines | Building components |
| **[COMPONENT_GUIDELINES.md](../../COMPONENT_GUIDELINES.md)** | Component best practices | Creating React components |
| **[UI_DESIGN_SYSTEM.md](../../UI_DESIGN_SYSTEM.md)** | Design system specs | Styling the app |

### 🚀 Deployment

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** | Pre-launch verification | Before going live |
| **[VERCEL_DEPLOYMENT_CHECKLIST.md](../../VERCEL_DEPLOYMENT_CHECKLIST.md)** | Vercel deployment guide | Deploying to production |
| **[DEPLOYMENT_GUIDE.md](../../DEPLOYMENT_GUIDE.md)** | General deployment | Understanding deployment |

### 📚 Database & Backend

| Document | Purpose | Read When |
|----------|---------|-----------|
| **[/database/schemas/main-schema.sql](../../database/schemas/main-schema.sql)** | Core database schema | Setting up database |
| **[DATABASE_SETUP_COMPLETE.md](../../DATABASE_SETUP_COMPLETE.md)** | Database verification | Confirming setup |

---

## Project Structure

```
apps/trajectory2/
├── 📄 Setup Guides
│   ├── env.template                      # Environment variables template
│   ├── setup-env.sh                      # Interactive setup script
│   ├── BACKEND_QUICK_START.md           # Quick start guide
│   ├── SUPABASE_BACKEND_SETUP.md        # Comprehensive backend setup
│   ├── EMAIL_SETUP.md                   # Email configuration
│   ├── PAYMENT_SETUP.md                 # Payment integration
│   ├── ENV_SETUP.md                     # Environment reference
│   └── README_SETUP.md                  # This file
│
├── 💎 Premium Features
│   ├── PREMIUM_SETUP_GUIDE.md           # Premium setup
│   ├── PREMIUM_USER_SYSTEM.md           # Technical docs
│   ├── PREMIUM_QUICK_REFERENCE.md       # API reference
│   └── SUPABASE_PREMIUM_IMPLEMENTATION.md
│
├── 📐 Design System
│   ├── DESIGN_SYSTEM.md                 # UI guidelines
│   └── components.json                  # Shadcn config
│
├── 🚀 Deployment
│   └── LAUNCH_CHECKLIST.md              # Pre-launch checks
│
├── 📦 Source Code
│   └── src/
│       ├── app/                         # Next.js pages & routes
│       ├── components/                  # React components
│       ├── lib/                         # Utilities & helpers
│       ├── emails/                      # Email templates
│       └── utils/                       # Utility functions
│
└── 🗄️ Database
    └── ../../database/schemas/           # SQL migrations
```

---

## Environment Variables Checklist

### Required (Priority 1)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only!)
- [ ] `RESEND_API_KEY` - Resend email API key
- [ ] `RESEND_FROM_EMAIL` - From email address
- [ ] `NEXT_PUBLIC_APP_URL` - Your app URL (localhost for dev)

### Optional (Can Add Later)

- [ ] `SQUARE_ACCESS_TOKEN` - Square payment token
- [ ] `SQUARE_LOCATION_ID` - Square location ID
- [ ] `SQUARE_ENVIRONMENT` - sandbox or production
- [ ] `SQUARE_WEBHOOK_SIGNATURE_KEY` - Square webhook key
- [ ] `NEXT_PUBLIC_POSTHOG_KEY` - Analytics key
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics

**Get the template:**
```bash
cp env.template .env.local
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev                    # http://localhost:3003

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

---

## Testing Your Setup

### ✅ Backend Working

1. Server starts without errors
2. Homepage loads (http://localhost:3003)
3. No console errors (check F12)
4. Assessment page loads
5. Can complete assessment
6. Can submit email
7. Data appears in Supabase tables

### ✅ Email Working

1. Email capture form submits successfully
2. Row appears in `email_notifications` table
3. Email received (check inbox/spam)
4. Email links work correctly

### ✅ Auth Working

1. Can visit signup page
2. Can create account
3. Receive confirmation email
4. Can confirm email
5. Can log in
6. Can log out
7. Protected routes redirect to login

### ✅ Payments Working (if configured)

1. Payment button appears
2. Clicking opens Square payment page
3. Test card processes successfully
4. Webhook receives event
5. Purchase recorded in database
6. User gains access to paid content

---

## Troubleshooting

### Issue: Server won't start

**Error:** `NEXT_PUBLIC_SUPABASE_URL is not defined`

**Fix:**
```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. Verify it has required variables
cat .env.local | grep SUPABASE

# 3. Restart server
npm run dev
```

### Issue: Database connection fails

**Error:** `Failed to connect to Supabase`

**Fix:**
1. Check Supabase project is not paused
2. Verify credentials in `.env.local`
3. Test with Supabase dashboard
4. Check RLS policies are configured

**Detailed troubleshooting:** [SUPABASE_BACKEND_SETUP.md#troubleshooting](./SUPABASE_BACKEND_SETUP.md#troubleshooting)

### Issue: Emails not sending

**Error:** `Failed to send email`

**Fix:**
1. Verify Resend API key is valid
2. Check domain is verified
3. Test with curl:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{"from":"onboarding@resend.dev","to":"you@example.com","subject":"Test","html":"<p>Test</p>"}'
   ```

**Detailed troubleshooting:** [EMAIL_SETUP.md#troubleshooting](./EMAIL_SETUP.md#troubleshooting)

### Issue: TypeScript errors

**Error:** Type errors in IDE

**Fix:**
```bash
# Regenerate types
npm run typecheck

# If using Supabase CLI:
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase-types.ts
```

### Issue: Build fails

**Error:** Build errors

**Fix:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## Getting Help

### 📚 Documentation

1. **Check this README** - Start here
2. **Check specific guide** - Navigate to relevant doc
3. **Check external docs**:
   - [Supabase Docs](https://supabase.com/docs)
   - [Resend Docs](https://resend.com/docs)
   - [Square Docs](https://developer.squareup.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)

### 💬 Community Support

- **Supabase Discord** - [discord.supabase.com](https://discord.supabase.com)
- **Next.js Discussions** - [GitHub Discussions](https://github.com/vercel/next.js/discussions)

### 🐛 Found a Bug?

1. Check existing issues
2. Create detailed bug report
3. Include:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots/logs

---

## Security Checklist

### ⚠️ Development

- [x] `.env.local` is in `.gitignore`
- [x] Never commit secrets to git
- [x] Use development keys locally
- [x] Don't share service role key

### 🔒 Production

- [ ] Use separate Supabase project
- [ ] Use production API keys
- [ ] Enable RLS on all tables
- [ ] Configure rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring
- [ ] Use HTTPS only
- [ ] Rotate secrets regularly

**See:** [SUPABASE_BACKEND_SETUP.md#security](./SUPABASE_BACKEND_SETUP.md#security-best-practices)

---

## Production Deployment Checklist

Before deploying to production:

### Environment
- [ ] Created production `.env` in Vercel
- [ ] Updated `NEXT_PUBLIC_APP_URL` to production URL
- [ ] All secrets are production values
- [ ] No `TODO_` placeholders remain

### Supabase
- [ ] Created production Supabase project
- [ ] Ran all migrations
- [ ] Updated auth URLs
- [ ] Enabled database backups
- [ ] Tested RLS policies

### Email
- [ ] Verified production domain in Resend
- [ ] Tested email delivery
- [ ] Updated email templates with production URLs
- [ ] Configured SPF/DKIM

### Testing
- [ ] Smoke test all critical flows
- [ ] Verified auth works
- [ ] Tested assessment submission
- [ ] Tested email delivery
- [ ] Checked mobile responsiveness
- [ ] Verified no console errors

**See:** [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)

---

## Next Steps

### After Setup Completes

1. **Test the Application**
   - Complete assessment
   - Test email capture
   - Verify data storage

2. **Customize Content**
   - Update assessment questions
   - Customize email templates
   - Update branding/colors

3. **Add Features**
   - Enable premium features
   - Configure payments
   - Add analytics

4. **Deploy**
   - Set up production environment
   - Deploy to Vercel
   - Test production site

---

## Folder Organization

```
trajectory2/
├── Public-facing docs (you are here)
│   ├── README_SETUP.md                  # Master guide
│   ├── BACKEND_QUICK_START.md          # Quick start
│   └── env.template                     # Env template
│
├── Technical docs
│   ├── SUPABASE_BACKEND_SETUP.md       # Backend setup
│   ├── PREMIUM_USER_SYSTEM.md          # Premium docs
│   └── DESIGN_SYSTEM.md                # Design system
│
└── Implementation
    └── src/                             # Source code
```

---

## Key Technologies

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Email:** Resend
- **Payments:** Square
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Type Safety:** TypeScript

---

## Support & Contributing

### Getting Support

1. Read the relevant documentation
2. Check troubleshooting sections
3. Search existing issues
4. Ask in community forums

### Documentation Updates

If you find unclear documentation:
1. Note what was confusing
2. Suggest improvements
3. Update docs if possible
4. Share feedback

---

## Quick Command Reference

```bash
# Setup
cp env.template .env.local        # Create environment file
./setup-env.sh                    # Interactive setup
npm install                       # Install dependencies

# Development
npm run dev                       # Start dev server
npm run build                     # Build for production
npm run lint                      # Check code quality
npm run typecheck                 # Check types

# Database (in Supabase SQL Editor)
# Run: /database/schemas/main-schema.sql
# Run: Premium migration SQL (optional)

# Testing
curl http://localhost:3003        # Test homepage
npm run build                     # Test build works
```

---

## File Quick Reference

| Need to... | Check this file |
|------------|----------------|
| Get started quickly | `BACKEND_QUICK_START.md` |
| Set up Supabase | `SUPABASE_BACKEND_SETUP.md` |
| Configure emails | `EMAIL_SETUP.md` |
| Add payments | `PAYMENT_SETUP.md` |
| Enable premium features | `PREMIUM_SETUP_GUIDE.md` |
| Understand env vars | `env.template` |
| Fix issues | `SUPABASE_BACKEND_SETUP.md#troubleshooting` |
| Deploy to production | `LAUNCH_CHECKLIST.md` |

---

**🎉 You're ready to build!**

Start with [BACKEND_QUICK_START.md](./BACKEND_QUICK_START.md) for the fastest setup.

---

_Last updated: January 2025_
_Trajectory2 - Rethink. Redesign. Reignite._

