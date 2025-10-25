# Trajectory Premium User Management System

## 🎯 Overview

Comprehensive premium user management system with tier-based access control, subscription management, feature flags, usage tracking, and environment configuration.

## 📊 Database Schema

### User Tiers

```typescript
type UserTier = 'free' | 'premium' | 'lifetime' | 'admin';
```

- **free**: Default tier, limited features
- **premium**: Paid subscription, full feature access
- **lifetime**: One-time payment, permanent premium access
- **admin**: Full system access with administrative capabilities

### Core Tables

1. **user_profiles** - Extended user information
2. **subscriptions** - Subscription tracking and billing
3. **feature_flags** - Feature availability per tier
4. **user_feature_usage** - Usage tracking and limits
5. **app_config** - Environment variables and configuration
6. **user_activity_log** - Audit trail and analytics

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key
```

### 3. Import Helper Functions

```typescript
import {
  getUserProfile,
  isPremiumUser,
  canAccessFeature,
  upgradeToPremium,
} from '@/lib/supabase-premium';
```

## 💡 Usage Examples

### Check if User is Premium

```typescript
// Server Component
async function PremiumContent({ userId }: { userId: string }) {
  const isPremium = await isPremiumUser(userId);

  if (!isPremium) {
    return <UpgradePrompt />;
  }

  return <PremiumFeatures />;
}

// Client Component with useEffect
function PremiumCheck() {
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      isPremiumUser(user.id).then(setIsPremium);
    }
  }, [user]);

  return isPremium ? <PremiumBadge /> : null;
}
```

### Feature Gating

```typescript
// Check single feature
async function CourseAccess({ userId }: { userId: string }) {
  const canAccess = await canAccessFeature(userId, 'course_access');

  if (!canAccess) {
    return (
      <div>
        <h2>Upgrade to Premium</h2>
        <p>Get access to the full Trajectory course</p>
        <UpgradeButton />
      </div>
    );
  }

  return <CourseContent />;
}

// Check multiple features
async function FeatureList({ userId }: { userId: string }) {
  const features = await checkMultipleFeatures(userId, [
    'course_access',
    'coaching_application',
    'resources_premium',
  ]);

  return (
    <ul>
      {Object.entries(features).map(([key, canAccess]) => (
        <li key={key}>
          {key}: {canAccess ? '✅' : '❌'}
        </li>
      ))}
    </ul>
  );
}
```

### Usage Tracking with Limits

```typescript
// Example: Assessment retakes (1 free, unlimited premium)
async function TakeAssessment({ userId }: { userId: string }) {
  // Check if user can take assessment
  const canRetake = await checkFeatureLimit(userId, 'assessment_retake');

  if (!canRetake) {
    return (
      <div>
        <h2>Assessment Limit Reached</h2>
        <p>Upgrade to premium for unlimited retakes</p>
        <UpgradeButton />
      </div>
    );
  }

  // Increment usage after successful assessment
  const handleAssessmentComplete = async () => {
    await incrementFeatureUsage(userId, 'assessment_retake');
    // ... handle results
  };

  return <AssessmentStepper onComplete={handleAssessmentComplete} />;
}
```

### Upgrade Flow

```typescript
// Square Payment Integration
async function handlePurchaseComplete(
  userId: string,
  paymentId: string,
  amount: number
) {
  const result = await upgradeToPremium(
    userId,
    amount, // in cents
    'square',
    paymentId
  );

  if (result.success) {
    // Show success message
    toast.success('Welcome to Trajectory Premium!');
    router.push('/course');
  } else {
    toast.error(result.message);
  }
}

// Stripe Integration
async function handleStripeCheckout(userId: string, sessionId: string) {
  const result = await upgradeToPremium(
    userId,
    9700, // $97.00
    'stripe',
    sessionId
  );

  if (result.success) {
    // Redirect to welcome page
    window.location.href = '/premium-welcome';
  }
}
```

### Get Complete User Data

```typescript
async function UserDashboard({ userId }: { userId: string }) {
  const userData = await getCompleteUserData(userId);

  return (
    <div>
      <h1>Welcome, {userData.profile?.full_name}</h1>
      <p>
        Tier: <Badge>{userData.profile?.tier}</Badge>
      </p>

      {userData.subscription && (
        <div>
          <h2>Subscription</h2>
          <p>Status: {userData.subscription.status}</p>
          <p>
            Renews: {new Date(userData.subscription.current_period_end!).toLocaleDateString()}
          </p>
        </div>
      )}

      <h2>Feature Usage This Month</h2>
      <ul>
        {userData.featureUsage.map((usage) => (
          <li key={usage.id}>
            {usage.feature_key}: {usage.usage_count} uses
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Cancel Subscription

```typescript
// Cancel at end of period
async function handleCancelSubscription(userId: string) {
  const result = await cancelSubscription(userId, false);

  if (result.success) {
    toast.success('Subscription will end at the end of your billing period');
  }
}

// Cancel immediately
async function handleCancelImmediately(userId: string) {
  const result = await cancelSubscription(userId, true);

  if (result.success) {
    toast.warning('Premium access revoked immediately');
    router.push('/');
  }
}
```

### Activity Logging

```typescript
// Log user actions
async function handleLogin(userId: string, req: Request) {
  await logActivity(
    userId,
    'login',
    {
      method: 'email',
      timestamp: new Date().toISOString(),
    },
    req.headers.get('x-forwarded-for'),
    req.headers.get('user-agent')
  );
}

// Log feature access
async function handleFeatureAccess(userId: string, featureKey: string) {
  await logActivity(userId, 'feature_access', {
    feature: featureKey,
    tier: await getUserProfile(userId).then((p) => p?.tier),
  });
}

// View activity log
async function ActivityLog({ userId }: { userId: string }) {
  const activities = await getUserActivityLog(userId, 100);

  return (
    <table>
      <thead>
        <tr>
          <th>Action</th>
          <th>Data</th>
          <th>When</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>{activity.activity_type}</td>
            <td>{JSON.stringify(activity.activity_data)}</td>
            <td>{new Date(activity.created_at!).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 🎨 React Hooks (Custom)

### usePremiumStatus Hook

```typescript
// hooks/usePremiumStatus.ts
import { useEffect, useState } from 'react';
import { isPremiumUser, getUserProfile } from '@/lib/supabase-premium';

export function usePremiumStatus(userId: string | undefined) {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    isPremiumUser(userId).then((result) => {
      setIsPremium(result);
      setLoading(false);
    });
  }, [userId]);

  return { isPremium, loading };
}

// Usage
function MyComponent() {
  const { user } = useUser();
  const { isPremium, loading } = usePremiumStatus(user?.id);

  if (loading) return <Spinner />;

  return isPremium ? <PremiumContent /> : <FreeContent />;
}
```

### useFeatureAccess Hook

```typescript
// hooks/useFeatureAccess.ts
import { useEffect, useState } from 'react';
import { canAccessFeature } from '@/lib/supabase-premium';

export function useFeatureAccess(userId: string | undefined, featureKey: string) {
  const [canAccess, setCanAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    canAccessFeature(userId, featureKey).then((result) => {
      setCanAccess(result);
      setLoading(false);
    });
  }, [userId, featureKey]);

  return { canAccess, loading };
}

// Usage
function CoachingApplication() {
  const { user } = useUser();
  const { canAccess, loading } = useFeatureAccess(user?.id, 'coaching_application');

  if (loading) return <Spinner />;
  if (!canAccess) return <UpgradePrompt feature="coaching_application" />;

  return <CoachingForm />;
}
```

### useSubscription Hook

```typescript
// hooks/useSubscription.ts
import { useEffect, useState } from 'react';
import { getActiveSubscription, type Subscription } from '@/lib/supabase-premium';

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    getActiveSubscription(userId).then((result) => {
      setSubscription(result);
      setLoading(false);
    });
  }, [userId]);

  return { subscription, loading };
}
```

## 🔐 Feature Flags Configuration

### Default Features

The system comes pre-configured with these features:

| Feature Key | Feature Name | Free | Premium |
|------------|-------------|------|---------|
| `assessment_basic` | Basic Assessment | ✅ (1 time) | ✅ (unlimited) |
| `assessment_retake` | Assessment Retake | ❌ | ✅ |
| `course_access` | Course Access | ❌ | ✅ |
| `coaching_application` | Coaching Application | ❌ | ✅ |
| `experience_7day` | 7-Day Experience | ❌ | ✅ |
| `resources_premium` | Premium Resources | ❌ | ✅ |
| `community_access` | Community Access | ❌ | ✅ |
| `progress_tracking` | Progress Tracking | ✅ | ✅ |
| `email_support` | Email Support | ✅ (5/month) | ✅ (unlimited) |

### Adding New Features

```typescript
// Add via Supabase SQL Editor or API
const { data, error } = await supabase.from('feature_flags').insert({
  feature_key: 'new_feature',
  feature_name: 'New Feature',
  description: 'Description of new feature',
  available_for_free: false,
  available_for_premium: true,
  premium_tier_limit: null, // null = unlimited
  is_enabled: true,
});
```

## ⚙️ App Configuration

### Reading Configuration

```typescript
// Single value
const appName = await getConfigValue('app_name');
const supportEmail = await getConfigValue('support_email');

// Multiple values
const config = await getConfigValues([
  'price_course_usd',
  'price_coaching_usd',
  'trial_period_days',
]);

console.log(`Course Price: $${config.price_course_usd / 100}`);
```

### Default Configuration Keys

| Key | Value | Category |
|-----|-------|----------|
| `app_name` | Trajectory | general |
| `support_email` | support@trajectory.com | contact |
| `price_course_usd` | 9700 ($97.00) | pricing |
| `price_coaching_usd` | 50000 ($500.00) | pricing |
| `free_assessment_limit` | 1 | limits |
| `trial_period_days` | 7 | limits |

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **user_profiles**: Users can view/update their own profile
- **subscriptions**: Users can view their own subscriptions
- **feature_flags**: Public read for enabled features
- **user_feature_usage**: Users can view their own usage
- **user_activity_log**: Users can view their own activity
- **app_config**: Service role only (server-side access)

## 📈 Analytics & Monitoring

### Track User Engagement

```typescript
// Get all activity for a user
const activities = await getUserActivityLog(userId);

// Analyze usage patterns
const featureUsage = await getUserFeatureUsage(userId);
const mostUsedFeatures = featureUsage
  .sort((a, b) => b.usage_count - a.usage_count)
  .slice(0, 5);
```

### Subscription Health

```typescript
async function getSubscriptionHealth(userId: string) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return 'no_subscription';
  }

  const daysUntilRenewal = Math.floor(
    (new Date(subscription.current_period_end!).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  if (daysUntilRenewal < 0) {
    return 'expired';
  } else if (daysUntilRenewal < 7) {
    return 'expiring_soon';
  }

  return 'active';
}
```

## 🧪 Testing

### Test User Creation

```typescript
// Create test user with premium access (development only)
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

async function createTestPremiumUser() {
  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: 'test@example.com',
    password: 'test123456',
    email_confirm: true,
  });

  if (authError || !authData.user) {
    throw authError;
  }

  // Grant premium access
  const { data: functionData } = await supabaseAdmin.rpc('grant_premium_access', {
    user_uuid: authData.user.id,
    subscription_tier: 'premium',
    duration_months: 12,
    provider: 'manual',
    amount: 0,
  });

  return authData.user;
}
```

## 🚨 Error Handling

```typescript
// Graceful degradation
async function SafePremiumCheck({ userId }: { userId: string }) {
  try {
    const isPremium = await isPremiumUser(userId);
    return isPremium ? <PremiumFeatures /> : <FreeFeatures />;
  } catch (error) {
    console.error('Premium check failed:', error);
    // Default to free tier on error
    return <FreeFeatures />;
  }
}

// With retry logic
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const isPremium = await retryOperation(() => isPremiumUser(userId));
```

## 📚 Best Practices

### 1. Cache User Tier

```typescript
// Use React Context for user tier
const UserContext = createContext<{
  tier: UserTier;
  isPremium: boolean;
}>(null!);

// Provider
function UserProvider({ children, userId }: { children: React.ReactNode; userId: string }) {
  const [tier, setTier] = useState<UserTier>('free');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    getUserProfile(userId).then((profile) => {
      setTier(profile?.tier ?? 'free');
      setIsPremium(['premium', 'lifetime', 'admin'].includes(profile?.tier ?? 'free'));
    });
  }, [userId]);

  return (
    <UserContext.Provider value={{ tier, isPremium }}>
      {children}
    </UserContext.Provider>
  );
}
```

### 2. Server-Side Feature Gates

```typescript
// API Route Protection
export async function GET(request: Request) {
  const userId = await getCurrentUserId(request);

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const canAccess = await canAccessFeature(userId, 'api_advanced');

  if (!canAccess) {
    return new Response('Upgrade Required', { status: 403 });
  }

  // Process request
  return Response.json({ data: 'premium content' });
}
```

### 3. Progressive Enhancement

```typescript
// Show features based on tier
function Dashboard({ userId }: { userId: string }) {
  const { tier } = useUserTier();

  return (
    <div>
      {/* Everyone sees this */}
      <BasicDashboard />

      {/* Premium users see this */}
      {['premium', 'lifetime', 'admin'].includes(tier) && <PremiumDashboard />}

      {/* Only admins see this */}
      {tier === 'admin' && <AdminPanel />}
    </div>
  );
}
```

## 🔧 Troubleshooting

### Issue: User profile not created

**Solution**: Profile is auto-created on signup via trigger. Check if trigger is enabled:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Issue: Feature access always returns false

**Solution**: Check if feature flag exists and is enabled:

```sql
SELECT * FROM feature_flags WHERE feature_key = 'your_feature' AND is_enabled = true;
```

### Issue: Subscription not working after payment

**Solution**: Check purchases table has correct payment_status:

```sql
SELECT * FROM purchases WHERE user_id = 'user_uuid' ORDER BY created_at DESC;
-- payment_status should be 'completed' to trigger premium access
```

## 📞 Support

For issues or questions:
- Check Supabase logs for database errors
- Review `user_activity_log` for user actions
- Contact: support@trajectory.com

---

**Built with ❤️ for the Trajectory Platform**
