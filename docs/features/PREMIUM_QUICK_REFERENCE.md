# Premium System Quick Reference

> **TL;DR**: Complete premium user management system installed. Use helper functions to check access, upgrade users, and track usage.

## 🚀 Most Common Tasks

### 1. Check if User is Premium

```typescript
import { isPremiumUser } from '@/lib/supabase-premium';

const isPremium = await isPremiumUser(userId);
```

### 2. Gate a Feature

```typescript
import { FeatureGate } from '@/components/FeatureGate';

<FeatureGate userId={user.id} featureKey="course_access">
  <CourseContent />
</FeatureGate>
```

### 3. Upgrade User

```typescript
import { upgradeToPremium } from '@/lib/supabase-premium';

await upgradeToPremium(userId, 9700, 'square', paymentId);
```

### 4. Track Feature Usage

```typescript
import { checkFeatureLimit, incrementFeatureUsage } from '@/lib/supabase-premium';

if (await checkFeatureLimit(userId, 'assessment_retake')) {
  // Allow access
  await incrementFeatureUsage(userId, 'assessment_retake');
}
```

## 📋 Available Features

| Feature Key | Free | Premium |
|------------|------|---------|
| `assessment_basic` | 1 time | Unlimited |
| `assessment_retake` | No | Yes |
| `course_access` | No | Yes |
| `coaching_application` | No | Yes |
| `experience_7day` | No | Yes |
| `resources_premium` | No | Yes |

## 🔧 Helper Functions

```typescript
// User Profile
getUserProfile(userId)
isPremiumUser(userId)
updateUserProfile(userId, updates)

// Subscriptions
getActiveSubscription(userId)
hasActiveSubscription(userId)
upgradeToPremium(userId, amount, provider, providerId)
cancelSubscription(userId, immediate?)

// Features
canAccessFeature(userId, featureKey)
checkFeatureLimit(userId, featureKey)
incrementFeatureUsage(userId, featureKey)
getFeatureFlags()

// Activity
logActivity(userId, activityType, data?, ip?, userAgent?)
getUserActivityLog(userId, limit?)

// Configuration
getConfigValue(key)
getConfigValues(keys[])

// Batch
getCompleteUserData(userId)
checkMultipleFeatures(userId, featureKeys[])
```

## 🎨 Components

```typescript
// Feature Gate
<FeatureGate userId={user.id} featureKey="course_access">
  <Content />
</FeatureGate>

// Upgrade Prompt
<UpgradePrompt feature="Course Access" />

// Premium Badge
<PremiumBadge userId={user.id} />
```

## 📊 Database Tables

- `user_profiles` - User tier and info
- `subscriptions` - Subscription tracking
- `feature_flags` - Feature availability
- `user_feature_usage` - Usage tracking
- `app_config` - Configuration
- `user_activity_log` - Activity logs

## 🔐 User Tiers

```typescript
type UserTier = 'free' | 'premium' | 'lifetime' | 'admin';
```

## 💰 Pricing

```typescript
const coursePrice = await getConfigValue('price_course_usd');
// Returns: "9700" (i.e., $97.00 in cents)
```

## 🐛 Common Issues

### User not upgraded after payment

```sql
-- Check purchase status
SELECT * FROM purchases WHERE user_id = 'uuid' ORDER BY created_at DESC;

-- Should have payment_status = 'completed'
-- If not, update it to trigger premium grant
UPDATE purchases SET payment_status = 'completed' WHERE id = 'uuid';
```

### Feature access always false

```sql
-- Check user tier
SELECT id, tier, is_active FROM user_profiles WHERE id = 'uuid';

-- Check feature exists
SELECT * FROM feature_flags WHERE feature_key = 'your_feature';
```

## 📚 Full Documentation

- **Complete Guide**: `PREMIUM_USER_SYSTEM.md` (200+ examples)
- **Setup Guide**: `PREMIUM_SETUP_GUIDE.md`
- **Implementation**: `SUPABASE_PREMIUM_IMPLEMENTATION.md`
- **Code Reference**: `/src/lib/supabase-premium.ts`

## 🎯 Next Steps

1. Test with `grant_premium_access()` function
2. Add feature gates to protected pages
3. Integrate with payment webhooks
4. Monitor user activity

---

**Need Help?** Check the full docs or contact support.
