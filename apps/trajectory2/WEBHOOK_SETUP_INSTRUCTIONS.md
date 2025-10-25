# Webhook Setup - Next Steps

## ✅ COMPLETED
- [x] Webhook configured in Square Dashboard
- [x] Signature key added to .env.local
- [x] Webhook URL set to: https://trajectorygroup.org/api/webhooks/square

## 🚨 IMPORTANT: Webhook Won't Work Yet!

**Why:** You configured the webhook URL as `https://trajectorygroup.org/api/webhooks/square`, but your app is running on `http://localhost:3000`. Square can't reach localhost!

## 🔧 You Have 2 Options:

### Option A: Use ngrok (Quick Local Testing - 5 minutes)

**Best for:** Testing webhooks before deploying

**Steps:**
```bash
# 1. Install ngrok (if you don't have it)
brew install ngrok

# 2. In a NEW terminal window (keep dev server running), run:
ngrok http 3000

# 3. You'll see output like:
# Forwarding   https://abc123.ngrok.io -> http://localhost:3000

# 4. Copy that HTTPS URL (e.g., https://abc123.ngrok.io)

# 5. Go BACK to Square Dashboard → Webhooks → Edit your webhook
# 6. UPDATE the Notification URL to:
#    https://abc123.ngrok.io/api/webhooks/square
#    (Replace abc123 with your actual ngrok URL)

# 7. Save the webhook
```

**Then test:**
- Go to http://localhost:3000/course
- Click "Get Instant Access"
- Complete payment with test card: 4111 1111 1111 1111
- Check Square Dashboard → Webhooks → Events (should show Success)
- Check Supabase → purchases table (should have new row)

---

### Option B: Deploy to Production (Recommended - 15 minutes)

**Best for:** Going live with real webhooks

**Steps:**
```bash
# 1. Install Vercel CLI if you don't have it
npm install -g vercel

# 2. Deploy your app
cd /Users/tiffanynguyen/RRR/apps/trajectory2
vercel

# Follow the prompts:
# - Link to existing project? Choose based on if you have one
# - Project name: trajectory2
# - It will deploy and give you a URL

# 3. Add environment variables to Vercel:
vercel env add SQUARE_ACCESS_TOKEN
# Paste: EAAAlzEpQQg5hd0Ba2Qr0f__PKQGgLP8SedRN2nF0d8ojpqU9PM8qvLmRobQZRmH

vercel env add SQUARE_LOCATION_ID
# Paste: LK4AA2RQ4Y0QA

vercel env add SQUARE_ENVIRONMENT
# Paste: sandbox

vercel env add SQUARE_WEBHOOK_SIGNATURE_KEY
# Paste: TIyxwMXUk0FZlyzDJep5WQ

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL from .env.local

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key from .env.local

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your Supabase service role key from .env.local

vercel env add RESEND_API_KEY
# Paste your Resend API key (if you have it)

vercel env add RESEND_FROM_EMAIL
# Paste: Trajectory <jsanchez@trajectorygroup.org>

vercel env add NEXT_PUBLIC_APP_URL
# Paste: https://trajectorygroup.org (or your Vercel URL)

# 4. Redeploy with environment variables
vercel --prod

# 5. Your webhook URL is already correct!
# Since you used trajectorygroup.org, it should work if that's your production domain
```

---

## 📝 My Recommendation

**For now:** Use **Option A (ngrok)** to test webhooks locally.

**Why:**
- Faster to set up (5 min vs 15 min)
- Test everything works before deploying
- Don't need to configure production environment variables yet
- Can iterate quickly

**After testing works:** Deploy to production (Option B)

---

## 🧪 Testing Checklist

Once ngrok is running or you've deployed:

1. [ ] Make a test purchase
2. [ ] Check Square Dashboard → Webhooks → Events
   - Should show "Success" (200 status)
3. [ ] Check Supabase → purchases table
   - Should have new row with purchase data
4. [ ] Check your terminal/logs
   - Should see webhook received and processed

---

## 🐛 Troubleshooting

### If webhook shows "Failed" in Square:
- Check the error message in Square Dashboard
- Make sure ngrok URL matches exactly in Square settings
- Verify signature key in .env.local is correct
- Check your server logs for errors

### If purchase doesn't appear in Supabase:
- Check webhook was received (Square Dashboard shows Success)
- Check your server logs for database errors
- Verify Supabase credentials in .env.local
- Check `purchases` table exists

---

## ✅ After Webhooks Work

Once webhooks are successfully receiving and storing purchases:

1. **Update webhook handler** to grant user access
2. **Set up confirmation emails** (Resend)
3. **Update success page** to poll for completion
4. **Test complete user flow** end-to-end

See: `/docs/features/SQUARE_PAYMENT_ROADMAP.md` for complete roadmap

---

**Your Webhook Details:**
- Subscription ID: `wbhk_69b97b22cea24716a980e1418b2d9f24`
- Signature Key: `TIyxwMXUk0FZlyzDJep5WQ` ✅
- Current URL: `https://trajectorygroup.org/api/webhooks/square`
- Events: `payment.created`, `payment.updated` ✅

---

**Next Step:** Choose Option A or B above and follow those steps!
