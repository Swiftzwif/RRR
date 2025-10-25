# Deploy to Production - Step-by-Step Guide

## 🎯 Goal
Deploy your Trajectory app to Vercel with Square payments fully working.

---

## 📋 Pre-Deployment Checklist

- [x] Square payment integration working locally
- [x] Webhook configured in Square Dashboard
- [x] Webhook signature key added to .env.local
- [x] Code committed and pushed to GitHub
- [ ] Ready to deploy to production

---

## 🚀 Step 1: Install Vercel CLI (If Needed)

```bash
npm install -g vercel
```

**Test it works:**
```bash
vercel --version
```

---

## 🚀 Step 2: Initial Deployment

```bash
cd /Users/tiffanynguyen/RRR/apps/trajectory2
vercel
```

**You'll be asked:**

1. **"Set up and deploy?"** → Press **Enter** (Yes)
2. **"Which scope?"** → Choose your account
3. **"Link to existing project?"** → Choose based on if you have one
   - If new: Choose **"No"** and create new project
4. **"What's your project's name?"** → Type: `trajectory2` (or your preference)
5. **"In which directory is your code located?"** → Press **Enter** (current directory)
6. **"Want to modify settings?"** → Press **Enter** (No)

**Wait for deployment...** ⏳

**You'll get a URL like:** `https://trajectory2-abc123.vercel.app`

---

## 🔐 Step 3: Add Environment Variables to Vercel

**CRITICAL:** Your app won't work without these!

### Method A: Using Vercel CLI (Faster)

```bash
# Square Payment Credentials
vercel env add SQUARE_ACCESS_TOKEN
# Paste: EAAAlzEpQQg5hd0Ba2Qr0f__PKQGgLP8SedRN2nF0d8ojpqU9PM8qvLmRobQZRmH
# Environment: Production, Preview, Development (select all 3)

vercel env add SQUARE_LOCATION_ID
# Paste: LK4AA2RQ4Y0QA

vercel env add SQUARE_ENVIRONMENT
# Paste: sandbox

vercel env add SQUARE_WEBHOOK_SIGNATURE_KEY
# Paste: TIyxwMXUk0FZlyzDJep5WQ

# Supabase Credentials (from your .env.local)
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste: https://nxtmcorzlosubfvxumpt.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dG1jb3J6bG9zdWJmdnh1bXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzI4MTUsImV4cCI6MjA3MjYwODgxNX0.tp3e3JMnjueRYSkwpZrHx4qaQ1Q2lXmYzQNGKx0ZdOI

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dG1jb3J6bG9zdWJmdnh1bXB0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzAzMjgxNSwiZXhwIjoyMDcyNjA4ODE1fQ.F4a1NcT3UnGsM6PRjQzLmZGz0nxs9HrhknfVdAvjbQE

# Email (Resend)
vercel env add RESEND_API_KEY
# Paste: re_jaK9ejza_L5cNqfeRsZmd7TN1oWEfyoLb

vercel env add RESEND_FROM_EMAIL
# Paste: Jaymison <jsanchez@trajectorygroup.org>

# App URL
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://trajectorygroup.org (or your Vercel URL from step 2)
```

### Method B: Using Vercel Dashboard (Visual)

1. Go to: https://vercel.com/dashboard
2. Click on your **trajectory2** project
3. Click **Settings** → **Environment Variables**
4. Add each variable one by one:
   - Variable name (e.g., `SQUARE_ACCESS_TOKEN`)
   - Value (paste from above)
   - Select environments: Production, Preview, Development
   - Click **Save**

---

## 🔄 Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

This redeploys your app with all the environment variables configured.

**Wait for deployment...** ⏳

**Your production URL:** `https://trajectory2-abc123.vercel.app` (or custom domain)

---

## 🌐 Step 5: Configure Custom Domain (Optional)

If you want to use `trajectorygroup.org`:

### In Vercel:
1. Go to: https://vercel.com/dashboard
2. Click your **trajectory2** project
3. Click **Settings** → **Domains**
4. Add domain: `trajectorygroup.org`
5. Vercel will give you DNS records to add

### In Your Domain Registrar (where you bought trajectorygroup.org):
1. Go to DNS settings
2. Add the A/CNAME records Vercel provided
3. Wait 5-60 minutes for DNS to propagate

### Update Environment Variable:
```bash
vercel env rm NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://trajectorygroup.org
```

Then redeploy:
```bash
vercel --prod
```

---

## ✅ Step 6: Verify Webhook is Working

**Your webhook is already configured!**
- URL: `https://trajectorygroup.org/api/webhooks/square`
- If you didn't set up custom domain yet, update it to your Vercel URL

### Update Webhook URL (if needed):
1. Go to: https://developer.squareup.com/apps
2. Select your app → **Webhooks**
3. **Edit** your webhook subscription
4. Update URL to: `https://your-vercel-url.vercel.app/api/webhooks/square`
   - (or `https://trajectorygroup.org/api/webhooks/square` if custom domain is set up)
5. **Save**

---

## 🧪 Step 7: Test Everything in Production

### Test 1: Payment Flow
1. Go to your production URL: `https://trajectory2-abc123.vercel.app/course`
2. Click "Get Instant Access"
3. Use test card: `4111 1111 1111 1111`
   - Exp: 12/25
   - CVV: 123
   - Zip: 12345
4. Complete payment
5. Should redirect back with success message

### Test 2: Webhook Verification
1. Go to: https://developer.squareup.com/apps
2. Select your app → **Webhooks** → **Events**
3. Find your recent test payment
4. Status should be **"Success"** (200)

### Test 3: Database Check
1. Go to: https://supabase.com/dashboard
2. Select your project → **Table Editor** → **purchases**
3. You should see a new row with:
   - user_id (if logged in)
   - email
   - product: 'course'
   - amount_cents: 9999
   - square_payment_id
   - created_at

### Test 4: User Access (After we add this logic)
1. User should see "Welcome Back, Commander"
2. User can access course content

---

## 🐛 Troubleshooting

### Issue: "Payment creation failed"
**Fix:**
- Check Vercel logs: `vercel logs`
- Verify all environment variables are set
- Check Square credentials are correct

### Issue: Webhook shows "Failed" in Square
**Fix:**
- Check webhook URL matches your deployment URL
- Verify `SQUARE_WEBHOOK_SIGNATURE_KEY` is set in Vercel
- Check Vercel logs for errors: `vercel logs --follow`

### Issue: Purchase not in database
**Fix:**
- Verify webhook received event (Square Dashboard)
- Check Supabase credentials in Vercel
- Check Vercel logs for database errors
- Verify `purchases` table exists in Supabase

### Issue: Environment variables not working
**Fix:**
```bash
# Remove old deployment
vercel remove trajectory2

# Redeploy from scratch
vercel --prod
```

---

## 📊 Deployment Summary

After completing all steps:

| Component | Status |
|-----------|--------|
| App Deployed | ✅ On Vercel |
| Environment Variables | ✅ Configured |
| Square Payments | ✅ Working |
| Webhooks | ✅ Configured |
| Database | ✅ Connected |
| Custom Domain | ⏳ Optional |

---

## 🎯 Next Steps After Deployment

Once webhooks are working in production:

1. **Update webhook handler** to grant user access
2. **Set up confirmation emails**
3. **Update success page** to poll for completion
4. **Test complete user flow** end-to-end
5. **Switch to production Square credentials** (when ready for real payments)

See: `/docs/features/SQUARE_PAYMENT_ROADMAP.md` for complete post-deployment roadmap

---

## 🔒 Security Reminders

- ✅ `.env.local` is in `.gitignore` (not committed)
- ✅ All secrets stored in Vercel (not in code)
- ✅ Webhook signature verified
- ✅ Service role key only used server-side

---

## 📞 Need Help?

**Vercel Docs:** https://vercel.com/docs
**Square Webhooks:** https://developer.squareup.com/docs/webhooks/overview
**Supabase Docs:** https://supabase.com/docs

---

**Ready to deploy?** Start with Step 1 above! 🚀

**Current branch:** `refactor/codebase-organization-cleanup`
**Last commit:** Webhook setup documentation added
**Ready for:** Production deployment

