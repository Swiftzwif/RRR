# 🚀 Quick Test Guide - Square Payment Integration

## ✅ What's Done:
- Square credentials configured in `.env.local`
- Payment buttons wired up (course & coaching)
- Dev server running on `http://localhost:3000`

---

## 🧪 Test Now (3 Easy Steps):

### Step 1: Test Course Purchase
```
1. Open: http://localhost:3000/course
2. Click: "Get Instant Access" button
3. Use test card: 4111 1111 1111 1111
   - Exp: 12/25
   - CVV: 123
   - Zip: 12345
```

### Step 2: Test Coaching Purchase
```
1. Open: http://localhost:3000/coaching
2. Click: "Book Interview" button
3. Use same test card
```

### Step 3: Verify Redirect
```
✅ Should redirect to Square payment page
✅ Should show correct amount ($99.99 or $100)
✅ Should pre-fill your email (if logged in)
```

---

## 🔗 Next: Webhook Setup (After Testing)

Webhooks need a **public URL**. Choose one:

### Option A: Deploy to Vercel (5 minutes)
```bash
cd /Users/tiffanynguyen/RRR/apps/trajectory2
vercel
```

### Option B: Use ngrok for Local Testing
```bash
brew install ngrok
ngrok http 3000
```

Then configure webhook at: https://developer.squareup.com/apps
- URL: `https://your-domain.com/api/webhooks/square`
- Events: `payment.created`, `payment.updated`
- Copy signature key → Add to `.env.local`

---

## 📝 Test Cards Reference

| Card | Result |
|------|--------|
| `4111 1111 1111 1111` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |

---

## 📚 Full Documentation

See: `SQUARE_SETUP_COMPLETE.md` for detailed instructions and troubleshooting.

---

**Status:** ✅ Ready to Test | ⏳ Webhooks Pending
