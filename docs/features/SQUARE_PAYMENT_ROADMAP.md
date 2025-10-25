# Square Payment Integration - Completion Roadmap

## ✅ Current Status (DONE)

### Phase 1: Payment Integration - **COMPLETE** ✅
- [x] Square sandbox credentials configured
- [x] Payment buttons wired up (Course $99.99, Coaching $100)
- [x] Payment flow working - redirects to Square
- [x] Success redirect working - shows "Payment Processing" message
- [x] Code committed to `refactor/codebase-organization-cleanup` branch

---

## 🎯 What's Next: Complete User Satisfaction Flow

### Phase 2: Webhook Integration (CRITICAL - DO THIS FIRST) ⏳

**Why this matters:** Right now, when a user pays, Square gets the money but your database doesn't know about it. The user sees "Payment Processing" but never gets access to the content.

#### Step 1: Deploy App or Use ngrok
**Option A: Deploy to Vercel (Recommended - 10 minutes)**
```bash
cd /Users/tiffanynguyen/RRR/apps/trajectory2

# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set project name: trajectory2
# - Copy the deployment URL (e.g., https://trajectory2.vercel.app)
```

**Option B: Local Testing with ngrok (5 minutes)**
```bash
# Install ngrok
brew install ngrok

# Expose local server
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

#### Step 2: Configure Square Webhook
1. **Go to:** https://developer.squareup.com/apps
2. **Select** your "Trajectory" application
3. **Click** "Webhooks" in sidebar
4. **Add Endpoint:**
   - **URL:** `https://your-domain.com/api/webhooks/square`
   - **API Version:** 2024-01-18 (or latest)
   - **Events to Subscribe:**
     - ✅ `payment.created`
     - ✅ `payment.updated`
5. **Save** - Square will show you a **Signature Key**
6. **Copy the Signature Key** (looks like: `SIG_ABC123...`)

#### Step 3: Add Webhook Signature to Environment
```bash
# Add to .env.local
echo 'SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_here' >> /Users/tiffanynguyen/RRR/apps/trajectory2/.env.local

# If deployed to Vercel, also add to Vercel environment variables:
vercel env add SQUARE_WEBHOOK_SIGNATURE_KEY
# Paste the signature key when prompted
```

#### Step 4: Test Webhook
1. Make a test purchase with card: `4111 1111 1111 1111`
2. Check Square Dashboard → Webhooks → Events
   - Should show events with status "Success" (200)
3. Check Supabase → Table Editor → `purchases`
   - Should see new row with your purchase

---

### Phase 3: Grant User Access After Payment ⏳

**Current gap:** Webhook stores purchase in database, but user doesn't automatically get access to content.

#### What needs to happen:
1. User pays → Square processes payment
2. Webhook receives event → Stores in `purchases` table ✅ (already done)
3. **NEW:** Webhook grants user access to product ❌ (need to add)

#### Implementation:

**File to modify:** `/apps/trajectory2/src/app/api/webhooks/square/route.ts`

After storing the purchase, add this logic:

```typescript
// After successfully storing purchase...
if (supabase && product && userId) {
  // Grant access to the product
  if (product === 'course') {
    // Option 1: Update user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { has_course_access: true }
    });
  } else if (product === 'coaching') {
    // Grant coaching access
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { has_coaching_access: true }
    });
  }
}
```

**Alternative approach:** Use the premium system already built:

```typescript
// After storing purchase...
if (product === 'course') {
  await supabase.from('user_tier').upsert({
    user_id: userId,
    tier: 'premium',
    expires_at: null, // lifetime access
    updated_at: new Date().toISOString()
  });
}
```

---

### Phase 4: Update Success Page ⏳

**File:** `/apps/trajectory2/src/app/course/page.tsx`

The current success page says "Payment Processing" but should:
1. Check if webhook has processed (purchase exists in DB)
2. Show actual success message
3. Give user immediate access to content

**Update the success check:**

```typescript
// In CourseContent component
if (purchaseSuccess && !hasAccess) {
  // Poll for purchase completion
  useEffect(() => {
    const checkPurchaseComplete = async () => {
      const sessionId = searchParams.get("session_id");
      if (sessionId && sessionId !== "{CHECKOUT_SESSION_ID}") {
        // Check if webhook processed the payment
        const { data: purchase } = await supabase
          .from("purchases")
          .select("*")
          .eq("square_payment_id", sessionId)
          .single();

        if (purchase) {
          // Purchase found! Reload to show access
          window.location.reload();
        }
      }
    };

    const interval = setInterval(checkPurchaseComplete, 2000); // Check every 2 seconds
    const timeout = setTimeout(() => clearInterval(interval), 30000); // Stop after 30 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      {/* ... existing processing message ... */}
    </div>
  );
}
```

---

### Phase 5: Send Confirmation Email (Optional but Recommended) ⏳

**When:** After webhook stores purchase  
**What:** Send email confirming purchase and providing access instructions

**Implementation:**

**File:** `/apps/trajectory2/src/emails/purchase-confirmation.tsx`

Create new email template:

```tsx
import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface PurchaseConfirmationEmailProps {
  productName: string;
  productUrl: string;
  amount: string;
}

export default function PurchaseConfirmationEmail({
  productName,
  productUrl,
  amount,
}: PurchaseConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for your purchase - {productName}</Preview>
      <Body>
        <Container>
          <Text>Thank you for your purchase!</Text>
          <Text>
            You now have access to: <strong>{productName}</strong>
          </Text>
          <Text>Amount paid: ${amount}</Text>
          <Link href={productUrl}>Access Your Content →</Link>
        </Container>
      </Body>
    </Html>
  );
}
```

**Add to webhook handler:**

```typescript
// After storing purchase and granting access...
import { sendEmail } from '@/lib/email';
import PurchaseConfirmationEmail from '@/emails/purchase-confirmation';

if (email && product) {
  await sendEmail({
    to: email,
    subject: `Welcome to ${product === 'course' ? 'Trajectory Course' : 'Coaching Program'}`,
    react: PurchaseConfirmationEmail({
      productName: product === 'course' ? 'Trajectory Course' : 'Coaching Interview',
      productUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${product}`,
      amount: (amountCents / 100).toFixed(2),
    }),
  });
}
```

---

### Phase 6: Email System Setup (If Not Already Done) ⏳

**Check if Resend is configured:**

```bash
# Check environment variables
grep RESEND /Users/tiffanynguyen/RRR/apps/trajectory2/.env.local
```

**If empty, set up Resend:**

1. **Go to:** https://resend.com
2. **Sign up** and verify your email
3. **Add domain** or use `onboarding@resend.dev` for testing
4. **Create API key**
5. **Add to .env.local:**
   ```bash
   RESEND_API_KEY=re_your_api_key
   RESEND_FROM_EMAIL=Trajectory <hello@yourdomain.com>
   ```

**See:** `/Users/tiffanynguyen/RRR/docs/setup/EMAIL_SETUP.md` for detailed instructions

---

### Phase 7: Handle Edge Cases ⏳

#### What if payment succeeds but webhook fails?
**Solution:** Add manual reconciliation endpoint

```typescript
// /apps/trajectory2/src/app/api/admin/reconcile-purchases/route.ts
export async function POST(request: NextRequest) {
  // Admin-only endpoint to manually sync Square payments to database
  // Useful if webhook fails or times out
}
```

#### What if user pays but never gets access?
**Solution:** Add customer support endpoint to manually grant access

```typescript
// /apps/trajectory2/src/app/api/admin/grant-access/route.ts
export async function POST(request: NextRequest) {
  const { email, product } = await request.json();
  // Manually grant access to user
}
```

#### What if user requests refund?
**Solution:** 
1. Process refund in Square Dashboard
2. Manually revoke access in Supabase
3. Update `purchases` table with refund status

---

## 📋 Complete Implementation Checklist

### Critical Path (User Can't Access Content Without This):
- [ ] Deploy app or set up ngrok
- [ ] Configure webhook in Square Dashboard
- [ ] Add webhook signature key to environment
- [ ] Test webhook with real purchase
- [ ] Verify purchase appears in database
- [ ] Update webhook to grant user access
- [ ] Test: User can access content after payment

### Important (Better User Experience):
- [ ] Update success page to poll for completion
- [ ] Create purchase confirmation email
- [ ] Set up Resend email service
- [ ] Test email delivery
- [ ] Add loading states during payment processing

### Nice to Have (Edge Cases & Support):
- [ ] Add manual reconciliation endpoint
- [ ] Add admin access grant endpoint
- [ ] Document refund process
- [ ] Add payment error handling
- [ ] Add retry logic for webhook failures

---

## 🧪 Testing Checklist

### Test Scenario 1: Happy Path (Course)
1. [ ] User clicks "Get Instant Access" on `/course`
2. [ ] Redirects to Square payment page
3. [ ] Enter test card: `4111 1111 1111 1111`
4. [ ] Complete payment
5. [ ] Redirected back to `/course?success=1`
6. [ ] Shows "Payment Processing" message
7. [ ] **NEW:** After 2-5 seconds, page reloads
8. [ ] **NEW:** User sees "Welcome Back, Commander" (has access)
9. [ ] **NEW:** Can click "Go to Course Dashboard"
10. [ ] **NEW:** Receives confirmation email

### Test Scenario 2: Happy Path (Coaching)
Same as above but for `/coaching` page

### Test Scenario 3: Declined Card
1. [ ] Use declined card: `4000 0000 0000 0002`
2. [ ] Payment fails on Square
3. [ ] User sees error message
4. [ ] Can retry with different card
5. [ ] No purchase recorded in database

### Test Scenario 4: Existing User
1. [ ] User already logged in
2. [ ] Makes purchase
3. [ ] Payment links to their user ID
4. [ ] Access granted immediately
5. [ ] Email sent to their account email

---

## 🚀 Git Workflow for This Work

### Current State:
- ✅ Square payment integration committed to `refactor/codebase-organization-cleanup`
- ✅ Commit: `016d1b5 - refactor(structure): organize project structure and documentation`

### Recommended Next Steps:

**Option A: Keep on Refactor Branch (Simpler)**
```bash
# Already on the right branch
git branch  # Should show: refactor/codebase-organization-cleanup

# Push to remote
git push origin refactor/codebase-organization-cleanup

# Create PR
gh pr create --base develop --title "refactor(structure): organize project structure and add Square payments" --body "See SQUARE_PAYMENT_ROADMAP.md for details"
```

**Option B: Create Dedicated Feature Branch (More Organized)**
```bash
# Create new branch from current state
git checkout -b feature/square-payment-complete

# Cherry-pick just the payment-related changes
# (Would need to separate payment changes from refactor changes)

# Push
git push origin feature/square-payment-complete
```

**Recommendation:** Use Option A (keep on refactor branch) since the payment work is already mixed with refactor work.

---

## 📊 Timeline Estimate

| Phase | Time | Priority |
|-------|------|----------|
| Phase 2: Webhook Setup | 30 min | 🔴 CRITICAL |
| Phase 3: Grant Access Logic | 20 min | 🔴 CRITICAL |
| Phase 4: Success Page Update | 15 min | 🟡 HIGH |
| Phase 5: Confirmation Email | 30 min | 🟡 HIGH |
| Phase 6: Email System Setup | 20 min | 🟡 HIGH |
| Phase 7: Edge Cases | 1 hour | 🟢 NICE TO HAVE |

**Total for MVP:** ~2 hours (Phases 2-5)  
**Total for Production-Ready:** ~3 hours (All phases)

---

## 🎯 Definition of "User Satisfied"

A user is satisfied when:
1. ✅ They can easily find and click the payment button
2. ✅ Payment process is smooth and professional
3. ✅ They immediately get access after payment
4. ✅ They receive confirmation email
5. ✅ They can access the content they paid for
6. ✅ If something goes wrong, they get clear error messages
7. ✅ They can contact support if needed

**Current Status:** ✅ 1-2, ⏳ 3-7 (need to complete phases above)

---

## 📞 Support Needed

### If Webhook Doesn't Work:
1. Check Square Dashboard → Webhooks → Events for errors
2. Check server logs for webhook handler errors
3. Verify webhook signature key is correct
4. Test webhook locally with ngrok first

### If User Doesn't Get Access:
1. Check `purchases` table for their purchase
2. Check user's `user_metadata` or `user_tier` for access flag
3. Manually grant access using Supabase if needed

### If Email Doesn't Send:
1. Check Resend Dashboard for delivery status
2. Verify `RESEND_API_KEY` is correct
3. Check email address is valid
4. Test with a different email address

---

**Next Step:** Complete Phase 2 (Webhook Setup) - This is the most critical blocker!


