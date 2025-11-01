# DEPLOYMENT FIX GUIDE

## Current Status ✅
- Local dev server is running at http://localhost:3000
- Thinkific integration is complete
- All code changes are committed to branch: `feat-square-checkout-9BoD6`

## What's Working
1. ✅ Course page redirects to Thinkific
2. ✅ Square API routes are disabled (return 503 with Thinkific URL)
3. ✅ Assessment results page has course CTA
4. ✅ Build passes successfully

## To Fix Deployment

### 1. Get Your Supabase Service Role Key
1. Go to: https://supabase.com/dashboard/project/nxtmcorzlosubfvxumpt/settings/api
2. Find "Service Role Key" (it starts with `eyJ...`)
3. Copy it

### 2. Update Vercel Environment Variables
Go to your Vercel project settings and add these:

```
NEXT_PUBLIC_SUPABASE_URL=https://nxtmcorzlosubfvxumpt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dG1jb3J6bG9zdWJmdnh1bXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMzI4MTUsImV4cCI6MjA3MjYwODgxNX0.tp3e3JMnjueRYSkwpZrHx4qaQ1Q2lXmYzQNGKx0ZdOI
SUPABASE_SERVICE_ROLE_KEY=[YOUR SERVICE ROLE KEY FROM STEP 1]
NEXT_PUBLIC_THINKIFIC_COURSE_URL=https://jean-s-site-8b39.thinkific.com/products/courses/trajectory
RESEND_API_KEY=re_jaK9ejza_L5cNqfeRsZmd7TN1oWEfyoLb
RESEND_FROM_EMAIL=Jaymison from Trajectory <jsanchez@trajectorygroup.org>
NEXT_PUBLIC_APP_URL=https://trajectorygroup.org
CRON_SECRET=your-super-secret-cron-key-here
```

### 3. What Changed in This PR

#### Files Modified (9 files)
- `LAUNCH_CHECKLIST.md` - Added Thinkific integration steps
- `PAYMENT_SETUP.md` - Updated for Thinkific, Square preserved
- `env.template` - Added Thinkific URL
- `src/app/api/admin/reconcile-payments/route.ts` - Disabled (returns 503)
- `src/app/api/payments/square/create/route.ts` - Disabled (returns 503)
- `src/app/api/webhooks/square/route.ts` - Disabled (returns 503)
- `src/app/course/page.tsx` - Simplified, redirects to Thinkific
- `src/app/results/page.tsx` - Added course CTA section
- `src/lib/env-validation.ts` - Square vars now optional

#### Files Added (1 file)
- `src/lib/config.ts` - Thinkific configuration

### 4. Test Locally

```bash
# In terminal 1 - keep dev server running
cd /Users/tiffanynguyen/.cursor/worktrees/RRR/9BoD6/apps/trajectory2
npm run dev

# In terminal 2 - test the integration
curl http://localhost:3000/api/payments/square/create -X POST \
  -H "Content-Type: application/json" \
  -d '{"product":"course"}'
# Should return: {"error":"Square payment integration is currently disabled...","redirect_url":"https://jean-s-site-8b39.thinkific.com/products/courses/trajectory"}
```

### 5. Test Pages
- http://localhost:3000 - Homepage
- http://localhost:3000/course - Should have "Get Instant Access on Thinkific" button
- http://localhost:3000/assessment - Take assessment
- http://localhost:3000/results - Should show course CTA after assessment

### 6. Deploy to Production

1. Push your changes (already done)
2. Merge PR to master
3. Vercel will auto-deploy
4. Monitor build logs in Vercel dashboard

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs for missing env vars
2. Verify all environment variables are set in Vercel
3. Make sure service role key is correct

### If Square routes return 500 instead of 503:
- This is expected if Square env vars are missing
- The disabled routes properly return 503 with Thinkific URL

### If Thinkific redirect doesn't work:
- Check that NEXT_PUBLIC_THINKIFIC_COURSE_URL is set in Vercel
- Verify the URL is correct: https://jean-s-site-8b39.thinkific.com/products/courses/trajectory

## Summary

The Thinkific integration is complete and working locally. You just need to:
1. Get the service role key from Supabase dashboard
2. Add all env vars to Vercel
3. Deploy

The site will work without Square - all payment flows redirect to Thinkific.
