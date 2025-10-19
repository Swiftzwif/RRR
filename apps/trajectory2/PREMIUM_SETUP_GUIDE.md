# Premium User System - Setup Guide

## ✅ Installation Complete

Your Trajectory platform now has a comprehensive premium user management system!

## 🎉 What Was Created

### Database Tables (in Supabase)

✅ `user_profiles` - User tier and profile information
✅ `subscriptions` - Subscription tracking
✅ `feature_flags` - Feature availability per tier  
✅ `user_feature_usage` - Usage limits and tracking
✅ `app_config` - Environment variables
✅ `user_activity_log` - Activity tracking

### Functions (Database)

✅ `is_premium_user(user_id)` - Check premium status
✅ `has_active_subscription(user_id)` - Check subscription
✅ `can_access_feature(user_id, feature)` - Feature gate check
✅ `check_feature_limit(user_id, feature)` - Usage limit check
✅ `increment_feature_usage(user_id, feature)` - Track usage
✅ `grant_premium_access(...)` - Upgrade user
✅ `upgrade_to_premium(...)` - Full upgrade flow
✅ `cancel_subscription(...)` - Cancel subscription

### TypeScript Files

✅ `/src/lib/supabase-types.ts` - Auto-generated types
✅ `/src/lib/supabase-premium.ts` - Helper functions
✅ `/src/lib/supabase.ts` - Updated with types

### Documentation

✅ `PREMIUM_USER_SYSTEM.md` - Complete documentation
✅ `PREMIUM_SETUP_GUIDE.md` - This guide

## 🚀 Quick Start

### 1. Basic Premium Check

```typescript
import { isPremiumUser } from '@/lib/supabase-premium';

// In a server component
export default async function MyPage() {
  const userId = await getCurrentUserId();
  const isPremium = await isPremiumUser(userId);

  return (
    <div>
      {isPremium ? (
        <h1>Welcome Premium Member!</h1>
      ) : (
        <h1>Upgrade to Premium</h1>
      )}
    </div>
  );
}
```

### 2. Feature Gate

```typescript
import { canAccessFeature } from '@/lib/supabase-premium';

export default async function CoursePage() {
  const userId = await getCurrentUserId();
  const canAccess = await canAccessFeature(userId, 'course_access');

  if (!canAccess) {
    return <UpgradePrompt feature="Course Access" />;
  }

  return <CourseContent />;
}
```

### 3. Process Payment

```typescript
import { upgradeToPremium } from '@/lib/supabase-premium';

export async function POST(request: Request) {
  const { userId, paymentId, amount } = await request.json();

  const result = await upgradeToPremium(
    userId,
    amount, // in cents (e.g., 9700 = $97.00)
    'square', // or 'stripe'
    paymentId
  );

  return Response.json(result);
}
```

## 📋 Pre-Configured Features

These features are ready to use:

| Feature Key | Description | Free Limit | Premium |
|------------|-------------|------------|---------|
| `assessment_basic` | Take assessment | 1 | Unlimited |
| `assessment_retake` | Retake assessment | 0 | Unlimited |
| `course_access` | Full course access | ❌ | ✅ |
| `coaching_application` | Apply for coaching | ❌ | ✅ |
| `experience_7day` | 7-day experience | ❌ | ✅ |
| `resources_premium` | Premium resources | ❌ | ✅ |
| `community_access` | Community access | ❌ | ✅ |
| `progress_tracking` | Track progress | ✅ | ✅ |
| `email_support` | Email support | 5/month | Unlimited |

## 🔧 Configuration

### Environment Variables (Already Set)

Your `.env.local` should have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nxtmcorzlosubfvxumpt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
```

### App Configuration (Database)

Access via `getConfigValue()`:

```typescript
import { getConfigValue } from '@/lib/supabase-premium';

const coursePrice = await getConfigValue('price_course_usd');
// Returns: "9700" (in cents, so $97.00)
```

## 🎯 Next Steps

### 1. Test the System

Create a test user and grant premium:

```typescript
// In a server action or API route (with service role)
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

// Grant premium to existing user
const { data } = await supabaseAdmin.rpc('grant_premium_access', {
  user_uuid: 'user_id_here',
  subscription_tier: 'premium',
  duration_months: 12,
  provider: 'manual',
  amount: 0,
});
```

### 2. Add Feature Gates to Your Pages

Update your existing pages:

**Before:**
```typescript
// app/course/page.tsx
export default function CoursePage() {
  return <CourseContent />;
}
```

**After:**
```typescript
// app/course/page.tsx
import { canAccessFeature } from '@/lib/supabase-premium';
import { getCurrentUser } from '@/lib/auth';

export default async function CoursePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const canAccess = await canAccessFeature(user.id, 'course_access');

  if (!canAccess) {
    return <UpgradePrompt />;
  }

  return <CourseContent />;
}
```

### 3. Update Your Payment Flow

**Square Integration:**

```typescript
// app/api/payments/square/webhook/route.ts
import { upgradeToPremium } from '@/lib/supabase-premium';

export async function POST(request: Request) {
  const payload = await request.json();
  
  if (payload.type === 'payment.updated' && payload.data.object.payment.status === 'COMPLETED') {
    const userId = payload.data.object.payment.reference_id;
    const amount = payload.data.object.payment.amount_money.amount;
    const paymentId = payload.data.object.payment.id;

    await upgradeToPremium(userId, amount, 'square', paymentId);
  }

  return Response.json({ received: true });
}
```

### 4. Add Usage Tracking

For limited features (like assessment retakes):

```typescript
// app/assessment/page.tsx
import { checkFeatureLimit, incrementFeatureUsage } from '@/lib/supabase-premium';

export default async function AssessmentPage() {
  const user = await getCurrentUser();
  const canTakeAssessment = await checkFeatureLimit(user.id, 'assessment_retake');

  if (!canTakeAssessment) {
    return (
      <div>
        <h1>Assessment Limit Reached</h1>
        <p>You've used your free assessment. Upgrade for unlimited retakes!</p>
        <UpgradeButton />
      </div>
    );
  }

  const handleAssessmentComplete = async () => {
    'use server';
    await incrementFeatureUsage(user.id, 'assessment_retake');
  };

  return <AssessmentStepper onComplete={handleAssessmentComplete} />;
}
```

### 5. Create an Upgrade Page

```typescript
// app/upgrade/page.tsx
import { getUserProfile, getConfigValue } from '@/lib/supabase-premium';

export default async function UpgradePage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile(user.id);
  const price = await getConfigValue('price_course_usd');

  if (profile?.tier === 'premium') {
    return <div>You're already premium!</div>;
  }

  return (
    <div>
      <h1>Upgrade to Premium</h1>
      <p>Price: ${(parseInt(price!) / 100).toFixed(2)}</p>
      
      <h2>What you get:</h2>
      <ul>
        <li>✅ Full Course Access</li>
        <li>✅ Unlimited Assessments</li>
        <li>✅ 7-Day Experience</li>
        <li>✅ Premium Resources</li>
        <li>✅ Coaching Application</li>
      </ul>

      <PaymentForm userId={user.id} amount={parseInt(price!)} />
    </div>
  );
}
```

### 6. Add Account Management

```typescript
// app/account/page.tsx
import { 
  getUserProfile, 
  getActiveSubscription, 
  getUserFeatureUsage,
  cancelSubscription 
} from '@/lib/supabase-premium';

export default async function AccountPage() {
  const user = await getCurrentUser();
  const profile = await getUserProfile(user.id);
  const subscription = await getActiveSubscription(user.id);
  const usage = await getUserFeatureUsage(user.id);

  return (
    <div>
      <h1>Account Settings</h1>
      
      <section>
        <h2>Your Plan</h2>
        <p>Current Tier: {profile?.tier}</p>
        {subscription && (
          <>
            <p>Status: {subscription.status}</p>
            <p>Renews: {new Date(subscription.current_period_end!).toLocaleDateString()}</p>
            <form action={async () => {
              'use server';
              await cancelSubscription(user.id, false);
            }}>
              <button>Cancel Subscription</button>
            </form>
          </>
        )}
      </section>

      <section>
        <h2>Feature Usage This Month</h2>
        <ul>
          {usage.map((item) => (
            <li key={item.id}>
              {item.feature_key}: {item.usage_count} uses
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

## 🎨 Recommended Components to Create

### 1. UpgradePrompt Component

```typescript
// components/UpgradePrompt.tsx
import Link from 'next/link';

export function UpgradePrompt({ feature }: { feature?: string }) {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Premium Feature</h2>
      {feature && (
        <p className="mb-6">
          Upgrade to access <strong>{feature}</strong>
        </p>
      )}
      <Link
        href="/upgrade"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-block"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
}
```

### 2. PremiumBadge Component

```typescript
// components/PremiumBadge.tsx
import { isPremiumUser } from '@/lib/supabase-premium';

export async function PremiumBadge({ userId }: { userId: string }) {
  const isPremium = await isPremiumUser(userId);

  if (!isPremium) return null;

  return (
    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
      PREMIUM
    </span>
  );
}
```

### 3. FeatureGate Component

```typescript
// components/FeatureGate.tsx
import { canAccessFeature } from '@/lib/supabase-premium';
import { UpgradePrompt } from './UpgradePrompt';

export async function FeatureGate({
  userId,
  featureKey,
  featureName,
  children,
}: {
  userId: string;
  featureKey: string;
  featureName?: string;
  children: React.ReactNode;
}) {
  const canAccess = await canAccessFeature(userId, featureKey);

  if (!canAccess) {
    return <UpgradePrompt feature={featureName || featureKey} />;
  }

  return <>{children}</>;
}

// Usage:
// <FeatureGate userId={user.id} featureKey="course_access" featureName="Course">
//   <CourseContent />
// </FeatureGate>
```

## 📱 Mobile Responsiveness

All premium features work seamlessly on mobile. No additional configuration needed!

## 🐛 Common Issues & Solutions

### Issue: User profile not created after signup

**Solution**: Check if the trigger is enabled. Run in Supabase SQL editor:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If missing, re-run the migration.

### Issue: isPremiumUser always returns false

**Solution**: Check the user's tier:

```sql
SELECT id, tier, is_active FROM user_profiles WHERE id = 'user_uuid';
```

Manually update if needed:

```sql
UPDATE user_profiles SET tier = 'premium', is_active = true WHERE id = 'user_uuid';
```

### Issue: Payment completed but user not upgraded

**Solution**: Check the purchases table:

```sql
SELECT * FROM purchases WHERE user_id = 'user_uuid' ORDER BY created_at DESC LIMIT 1;
```

If `payment_status` is not `'completed'`, update it:

```sql
UPDATE purchases SET payment_status = 'completed' WHERE id = 'purchase_uuid';
```

This will trigger the premium access grant.

## 📊 Monitoring & Analytics

View in Supabase Dashboard:

1. **User Profiles** - See all users and their tiers
2. **Subscriptions** - Track active subscriptions
3. **User Activity Log** - Monitor user actions
4. **Feature Usage** - See which features are most used

Or query directly:

```sql
-- Premium users count
SELECT COUNT(*) FROM user_profiles WHERE tier IN ('premium', 'lifetime', 'admin');

-- Revenue this month
SELECT SUM(amount_cents) FROM purchases 
WHERE created_at >= DATE_TRUNC('month', NOW()) 
AND payment_status = 'completed';

-- Most popular features
SELECT feature_key, SUM(usage_count) as total_uses
FROM user_feature_usage
GROUP BY feature_key
ORDER BY total_uses DESC;
```

## 🎓 Learning Resources

- Full Documentation: `PREMIUM_USER_SYSTEM.md`
- TypeScript Types: `/src/lib/supabase-types.ts`
- Helper Functions: `/src/lib/supabase-premium.ts`
- Supabase Docs: https://supabase.com/docs

## ✨ You're All Set!

Your premium user system is ready to use. Start by:

1. ✅ Testing with a manual premium grant
2. ✅ Adding feature gates to protected pages  
3. ✅ Integrating with your payment provider
4. ✅ Monitoring user activity and subscriptions

**Need Help?** Check the documentation or contact support.

---

**Happy Building! 🚀**
