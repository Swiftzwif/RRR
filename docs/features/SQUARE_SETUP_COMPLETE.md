# Square Payment Integration - Setup Complete! 🎉

## ✅ Completed Configuration

### Environment Variables Configured
- ✅ `SQUARE_ACCESS_TOKEN` - Sandbox token configured
- ✅ `SQUARE_LOCATION_ID` - Location ID: LWW8YNZEB49DM
- ✅ `SQUARE_ENVIRONMENT` - Set to 'sandbox' for testing
- ⏳ `SQUARE_WEBHOOK_SIGNATURE_KEY` - To be added after webhook setup

### Payment Integration Wired Up
- ✅ **Course Page** (`/course`) - "Get Instant Access" button → Square API
- ✅ **Coaching Page** (`/coaching`) - "Book Interview" button → Square API
- ✅ **API Route** - `/api/payments/square/create` ready
- ✅ **Webhook Handler** - `/api/webhooks/square` ready

---

## 🧪 Testing Instructions

### Dev Server
Your dev server is running on: **http://localhost:3000**

### Test Payment Flow

#### Option 1: Course Purchase ($99.99)
1. Navigate to: `http://localhost:3000/course`
2. Click "Get Instant Access" button
3. You'll be redirected to Square payment page
4. Use test card: **4111 1111 1111 1111**
5. Any future expiration date, any CVV

#### Option 2: Coaching Purchase ($100)
1. Navigate to: `http://localhost:3000/coaching`
2. Click "Book Interview" button
3. Square payment page will open
4. Use same test card to complete purchase

### Square Test Cards
- **Success:** `4111 1111 1111 1111`
- **Declined:** `4000 0000 0000 0002`
- **Expiration:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Postal Code:** Any 5 digits (e.g., 12345)

---

## 🔗 Next Step: Webhook Configuration

To receive payment confirmations and automatically record purchases in your database, you need to set up webhooks.

### Step 1: Deploy Your App (Required for Webhooks)

Webhooks need a public URL. You have two options:

#### Option A: Deploy to Vercel (Recommended)
```bash
# From your project root
cd /Users/tiffanynguyen/RRR/apps/trajectory2
vercel
```

After deployment, you'll get a URL like: `https://your-app.vercel.app`

#### Option B: Use ngrok for Local Testing
```bash
# Install ngrok if you don't have it
brew install ngrok

# Expose your local server
ngrok http 3000
```

This gives you a temporary public URL like: `https://abc123.ngrok.io`

### Step 2: Configure Webhook in Square Dashboard

1. **Go to Square Developer Dashboard**
   - https://developer.squareup.com/apps
   - Select your "Trajectory" application

2. **Navigate to Webhooks**
   - Click "Webhooks" in the left sidebar
   - Click "Add Endpoint"

3. **Add Webhook Endpoint**
   - **URL:** `https://your-domain.com/api/webhooks/square`
     - Replace `your-domain.com` with your Vercel URL or ngrok URL
     - Example: `https://trajectory.vercel.app/api/webhooks/square`
   
   - **Webhook API Version:** Select latest (2024-01-18 or newer)
   
   - **Subscribe to Events:**
     - ✅ `payment.created`
     - ✅ `payment.updated`

4. **Save and Get Signature Key**
   - After saving, Square will show you a **Signature Key**
   - Copy this key (looks like: `ABCD-1234-EFGH-5678`)

### Step 3: Add Signature Key to Environment

Add the signature key to your `.env.local`:

```bash
echo 'SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_here' >> /Users/tiffanynguyen/RRR/apps/trajectory2/.env.local
```

Replace `your_signature_key_here` with the actual key from Square.

### Step 4: Restart Dev Server

After adding the webhook signature key:

```bash
# Stop current server (Ctrl+C)
# Restart
npm run dev
```

---

## 📊 Verify Webhook is Working

### Test the Complete Flow:

1. **Make a test purchase** (use steps above)
2. **Check Square Dashboard:**
   - Go to Webhooks → Events
   - You should see events being sent
   - Status should be "Success" (200 OK)

3. **Verify in Supabase Database:**
   ```sql
   SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5;
   ```
   - You should see your test purchase recorded
   - Fields: `user_id`, `email`, `product`, `amount_cents`, `square_payment_id`

---

## 🐛 Troubleshooting

### Issue: Payment button does nothing
**Solution:**
- Check browser console for errors (F12 → Console tab)
- Verify `.env.local` has Square credentials
- Restart dev server after adding env vars

### Issue: "Failed to create payment link"
**Solution:**
- Check `SQUARE_ACCESS_TOKEN` is correct
- Verify `SQUARE_LOCATION_ID` is correct
- Check Network tab (F12 → Network) for API error details

### Issue: Webhook shows "Failed" in Square dashboard
**Solution:**
- Verify webhook URL is publicly accessible
- Check webhook signature key is in `.env.local`
- View error details in Square webhook logs
- Check your server logs for errors

### Issue: Purchase not recorded in database
**Solution:**
- Verify Supabase connection is working
- Check `purchases` table exists (run migration if needed)
- Check webhook is receiving events (Square dashboard)
- Check server logs for database errors

---

## 🚀 Going to Production

When ready to accept real payments:

### 1. Get Production Credentials
- Go to Square Dashboard → Production tab
- Copy Production Access Token
- Copy Production Location ID

### 2. Update Environment Variables

In **Vercel Dashboard** (or your hosting platform):
- Set `SQUARE_ACCESS_TOKEN` to production token
- Set `SQUARE_LOCATION_ID` to production location
- Set `SQUARE_ENVIRONMENT=production`
- Update `SQUARE_WEBHOOK_SIGNATURE_KEY` (production webhooks have different keys)

### 3. Update Webhook URL
- In Square Dashboard → Webhooks
- Update endpoint to production URL
- Use production webhook events

### 4. Test with Real Card
- Make a small test purchase ($0.01 if possible, or refund after)
- Verify webhook triggers
- Verify purchase records in database
- Test user access to content

---

## 📝 Implementation Summary

### Files Modified:
1. `/apps/trajectory2/.env.local` - Added Square credentials
2. `/apps/trajectory2/src/app/course/page.tsx` - Wired payment button
3. `/apps/trajectory2/src/app/coaching/page.tsx` - Wired payment button

### Files Already Implemented (No Changes Needed):
1. `/apps/trajectory2/src/app/api/payments/square/create/route.ts` - Payment API
2. `/apps/trajectory2/src/app/api/webhooks/square/route.ts` - Webhook handler

### Database Tables Used:
- `purchases` - Stores all completed purchases
  - Columns: `user_id`, `email`, `product`, `amount_cents`, `square_payment_id`, `created_at`

---

## 🎯 Current Status

### ✅ Ready to Test:
- Course purchase button
- Coaching purchase button
- Square payment flow (sandbox)

### ⏳ Needs Configuration:
- Webhook endpoint (requires deployment or ngrok)
- Webhook signature key

### 🚫 Not Yet Configured:
- Production credentials
- Production webhook

---

## 📚 Additional Resources

- **Square API Docs:** https://developer.squareup.com/docs
- **Test Cards:** https://developer.squareup.com/docs/testing/test-cards
- **Webhooks Guide:** https://developer.squareup.com/docs/webhooks/overview
- **Payment Links API:** https://developer.squareup.com/docs/online-checkout/payment-links

---

## ✨ What's Next?

1. **Test the payment buttons** (both course and coaching)
2. **Deploy to Vercel or use ngrok**
3. **Configure webhooks in Square Dashboard**
4. **Add webhook signature key to env**
5. **Test complete flow end-to-end**
6. **Verify purchases appear in database**

You're almost done! The hard work is complete. Now just test and configure webhooks. 🚀

---

**Questions or issues?** Check the troubleshooting section above or reach out!

**Generated on:** $(date)
**Integration Status:** ✅ Sandbox Ready | ⏳ Webhook Pending | 🚫 Production Pending
