# 🚀 Supabase Backend Setup Guide
## Complete Backend Configuration for Trajectory2

> **👨‍💻 Veteran's Note:** This is your one-stop guide for all Supabase backend setup. Follow these steps sequentially, and you'll have a production-ready backend in 30 minutes.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Supabase Project](#create-supabase-project)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Authentication Configuration](#authentication-configuration)
6. [Row Level Security (RLS)](#row-level-security-rls)
7. [Testing & Verification](#testing--verification)
8. [Premium Features Setup](#premium-features-setup)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ A GitHub account (for Supabase signup)
- ✅ Access to your domain's DNS settings (for custom domain)
- ✅ Terminal/command line access
- ✅ Node.js 18+ installed
- ✅ Text editor (VS Code recommended)

**Time Required:** ~30 minutes

---

## Create Supabase Project

### Step 1: Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub (recommended) or email
4. Accept terms and complete onboarding

### Step 2: Create New Project

1. Click **"New Project"**
2. Select your organization (or create new one)
3. Fill in project details:
   ```
   Name: trajectory-production
   Database Password: [Generate strong password - SAVE THIS!]
   Region: Choose closest to your users (e.g., East US, West EU)
   Pricing Plan: Free (can upgrade later)
   ```
4. Click **"Create new project"**
5. ⏰ **Wait 2-3 minutes** for project to provision

### Step 3: Save Your Project Details

Once created, you'll see your project dashboard. **SAVE THESE IMMEDIATELY:**

```bash
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon (public) Key: eyJhbGc...
Service Role Key: eyJhbGc... (keep secret!)
Database Password: [your password from Step 2]
```

**⚠️ CRITICAL:** Store these in a password manager. You'll need them throughout setup.

---

## Database Setup

### Step 4: Access SQL Editor

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. You'll see an empty SQL editor

### Step 5: Run Main Schema Migration

Copy the entire contents of `/database/schemas/main-schema.sql` and paste into the SQL editor.

**What this creates:**
- ✅ `assessments` table - Store user assessment results
- ✅ `purchases` table - Track course/coaching purchases
- ✅ `user_progress` table - Monitor course completion
- ✅ `coaching_applications` table - Manage coaching requests
- ✅ `notifications` table - Email capture storage
- ✅ `email_notifications` table - Track email send status
- ✅ Indexes for performance
- ✅ Row Level Security policies

**Run it:**
1. Click **"Run"** (or press `Cmd/Ctrl + Enter`)
2. Wait for success message
3. You should see: `Success. No rows returned`

### Step 6: Run Premium Features Schema

If you want premium user features (recommended):

1. Create a new query
2. Copy contents from `SUPABASE_PREMIUM_IMPLEMENTATION.md` (the SQL section)
3. Run it

**What this adds:**
- ✅ `user_profiles` table - User tier management
- ✅ `subscriptions` table - Subscription tracking
- ✅ `feature_flags` table - Feature gating
- ✅ `user_feature_usage` table - Usage tracking
- ✅ `app_config` table - App configuration
- ✅ `user_activity_log` table - Activity tracking
- ✅ Database functions for premium operations

### Step 7: Verify Tables Created

1. Click **"Table Editor"** in left sidebar
2. You should see all tables listed:
   - assessments
   - purchases
   - user_progress
   - coaching_applications
   - notifications
   - email_notifications
   - user_profiles
   - subscriptions
   - feature_flags
   - user_feature_usage
   - app_config
   - user_activity_log

✅ **If you see all tables, you're good to go!**

---

## Environment Variables

### Step 8: Get API Keys

1. Go to **Settings** → **API** in Supabase dashboard
2. You'll see:
   ```
   Project URL: https://xxxxx.supabase.co
   Project API keys:
     - anon / public: eyJhbGc...
     - service_role: eyJhbGc... (keep secret!)
   ```

### Step 9: Configure Local Environment

In your `trajectory2` directory:

```bash
cd apps/trajectory2

# Copy the template
cp .env.local.template .env.local

# Open in your editor
code .env.local  # or vim, nano, etc.
```

### Step 10: Fill in Supabase Variables

Replace the TODO placeholders:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
```

**⚠️ IMPORTANT:**
- `NEXT_PUBLIC_*` vars are exposed to browser (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (NEVER expose to client)

### Step 11: Verify Environment Variables

Test that env vars are loaded:

```bash
# Start dev server
npm run dev

# Open browser to http://localhost:3003
# Open browser console (F12)
# Run:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
# Should show your Supabase URL
```

---

## Authentication Configuration

### Step 12: Configure Auth Settings

1. Go to **Authentication** → **Settings** in Supabase
2. Update these settings:

**Site URL:**
```
Development: http://localhost:3003
Production: https://your-domain.com
```

**Redirect URLs (add all):**
```
http://localhost:3003/**
http://localhost:3003/auth/confirm
https://your-domain.com/**
https://your-domain.com/auth/confirm
```

**Email Auth:**
- ✅ Enable Email provider
- ✅ Confirm email: ON
- ✅ Secure email change: ON
- ✅ Secure password change: ON

### Step 13: Configure Email Templates

Supabase sends emails for:
- Email confirmation
- Password reset
- Magic link login

**Update Confirmation Email:**

1. Go to **Authentication** → **Email Templates**
2. Select **"Confirm signup"**
3. Replace `{{ .ConfirmationURL }}` with:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   ```
4. Click **"Save"**

**Customize Email Appearance:**
1. Update the email subject: `Confirm Your Trajectory Account`
2. Customize the body text to match your brand
3. Use your brand colors in HTML

### Step 14: Set Up Social Auth (Optional)

If you want Google/GitHub login:

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://xxxxx.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase: **Authentication** → **Providers** → **Google**
6. Enable and paste credentials

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth app
3. Authorization callback URL: `https://xxxxx.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret
5. In Supabase: **Authentication** → **Providers** → **GitHub**
6. Enable and paste credentials

---

## Row Level Security (RLS)

Your database is already secured if you ran the schema migrations!

### Step 15: Verify RLS is Enabled

1. Go to **Table Editor** in Supabase
2. Click on `assessments` table
3. Look for shield icon 🛡️ - it should show "RLS enabled"

### Step 16: Test RLS Policies

Create a test user and verify they can only see their own data:

**SQL to test:**
```sql
-- Create test user (in SQL Editor)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('testpassword', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Try to view assessments as this user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '[user-id-from-above]';
SELECT * FROM assessments;
-- Should only return assessments for this user
```

### Step 17: Understand RLS Policies

Each table has policies that control access:

**Example: Assessments Table**
```sql
-- Users can view their own assessments
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own assessments
CREATE POLICY "Users can insert their own assessments" ON assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
```

**Key concepts:**
- `auth.uid()` = Currently logged-in user's ID
- `FOR SELECT` = Reading data
- `FOR INSERT` = Creating new records
- `FOR UPDATE` = Modifying records
- `FOR DELETE` = Removing records
- `USING` = Filter what user can see
- `WITH CHECK` = Validation when creating/updating

---

## Testing & Verification

### Step 18: Test Database Connection

Create a test script:

```typescript
// test-db.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testConnection() {
  const { data, error } = await supabase
    .from('assessments')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Database connection successful!');
  }
}

testConnection();
```

Run it:
```bash
npx tsx test-db.ts
```

### Step 19: Test Assessment Creation

Visit your app and take the assessment:

1. Start dev server: `npm run dev`
2. Go to http://localhost:3003/assessment
3. Complete the assessment
4. Submit email
5. Check Supabase **Table Editor** → **assessments**
6. You should see a new row!

### Step 20: Verify Email Notifications Table

After submitting email in assessment:

1. Go to **Table Editor** → **email_notifications**
2. You should see a row with:
   - email: [your test email]
   - topic: 'assessment'
   - metadata: [your assessment results]

✅ **If you see the data, everything is working!**

---

## Premium Features Setup

### Step 21: Verify Premium Functions

Check that database functions were created:

1. Go to **Database** → **Functions** in Supabase
2. You should see functions like:
   - `is_premium_user`
   - `has_active_subscription`
   - `can_access_feature`
   - `upgrade_to_premium`
   - `cancel_subscription`

### Step 22: Test Premium Functions

Run in SQL Editor:

```sql
-- Test premium check for a user
SELECT is_premium_user('[user-uuid-here]');
-- Should return false for new user

-- Grant premium to test user
SELECT grant_premium_access(
  '[user-uuid-here]',
  'premium',
  12, -- months
  'manual',
  0
);

-- Check again
SELECT is_premium_user('[user-uuid-here]');
-- Should now return true!
```

### Step 23: Configure Feature Flags

Default features are already seeded, but you can customize:

```sql
-- View all features
SELECT * FROM feature_flags;

-- Add custom feature
INSERT INTO feature_flags (
  feature_key,
  feature_name,
  feature_description,
  available_for_free,
  available_for_premium,
  usage_limit_free,
  usage_limit_premium,
  is_enabled
) VALUES (
  'custom_feature',
  'My Custom Feature',
  'Description of the feature',
  false, -- not available to free users
  true,  -- available to premium
  0,     -- no limit for free (they can't access it)
  null,  -- unlimited for premium
  true   -- feature is enabled
);
```

### Step 24: Test Feature Access

In your Next.js app:

```typescript
// app/test-premium/page.tsx
import { canAccessFeature } from '@/lib/supabase-premium';
import { createServerClient } from '@/utils/supabase/server';

export default async function TestPremiumPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>Please log in</div>;
  }

  const canAccessCourse = await canAccessFeature(user.id, 'course_access');

  return (
    <div>
      <h1>Premium Feature Test</h1>
      <p>User ID: {user.id}</p>
      <p>Can access course: {canAccessCourse ? '✅ Yes' : '❌ No'}</p>
    </div>
  );
}
```

---

## Production Deployment

### Step 25: Set Up Production Environment

When deploying to Vercel/production:

1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add the same variables from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   NEXT_PUBLIC_APP_URL (use production URL)
   ```

3. Update Supabase Auth URLs:
   - Go to Supabase → Authentication → Settings
   - Update Site URL to production URL
   - Add production redirect URLs

### Step 26: Enable Database Backups

**Recommended for production:**

1. Go to Supabase → Settings → Database
2. Enable **Point-in-time Recovery** (PITR)
   - Free plan: 7 days of backups
   - Pro plan: 30 days of backups
3. Test restoration process in staging first

### Step 27: Set Up Monitoring

**Enable Supabase monitoring:**

1. Go to **Reports** in Supabase dashboard
2. Monitor:
   - Database size
   - API requests
   - Database connections
   - Query performance

**Add external monitoring:**

- **Sentry** for error tracking
- **LogRocket** for session replay
- **PostHog** for product analytics

### Step 28: Security Hardening

**Enable security features:**

1. **Enable SSL enforcement** (should be on by default)
2. **Configure API rate limits:**
   - Go to Settings → API
   - Set reasonable limits per user
3. **Review RLS policies** - ensure all tables are protected
4. **Rotate secrets** regularly:
   - Service role key every 6 months
   - Database password yearly

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Relation does not exist"

**Error:**
```
ERROR: relation "assessments" does not exist
```

**Solution:**
1. Verify schema was run: Check Table Editor for tables
2. Re-run migration: Copy `main-schema.sql` and run in SQL Editor
3. Check if you're connected to correct project

#### Issue: "JWT expired"

**Error:**
```
ERROR: JWT expired
```

**Solution:**
1. User session expired - normal behavior
2. Implement session refresh in app:
   ```typescript
   const { data: { session } } = await supabase.auth.getSession();
   if (!session) {
     await supabase.auth.refreshSession();
   }
   ```

#### Issue: "Permission denied for relation"

**Error:**
```
ERROR: permission denied for relation assessments
```

**Solution:**
1. Check RLS policies are created
2. Verify user is authenticated
3. Ensure policy allows operation
4. Check if using correct user ID

#### Issue: "Connection string is not valid"

**Error:**
```
ERROR: Connection string is not valid
```

**Solution:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Ensure no extra spaces or quotes
3. Verify project is not paused (free tier auto-pauses after 7 days inactivity)
4. Restart dev server after changing env vars

#### Issue: "Rate limit exceeded"

**Error:**
```
ERROR: Rate limit exceeded
```

**Solution:**
1. Check Settings → API → Rate Limits
2. Implement caching to reduce requests
3. Use database functions instead of multiple queries
4. Consider upgrading plan if legitimate high usage

#### Issue: Tables created but empty

**Symptom:** Tables exist but no test data appears

**Solution:**
1. Check RLS policies allow your user to see data
2. Try as service role:
   ```typescript
   const supabaseAdmin = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_ROLE_KEY!
   );
   const { data } = await supabaseAdmin.from('assessments').select('*');
   ```
3. If data appears with service role, it's an RLS issue

#### Issue: Email confirmation not working

**Symptom:** Users don't receive confirmation emails

**Solution:**
1. Check SMTP is configured: Settings → Authentication → SMTP Settings
2. Verify email template is correct
3. Check spam folder
4. Enable email auth: Settings → Authentication → Providers → Email
5. Test with Supabase Auth UI to isolate issue

---

## Database Maintenance

### Regular Maintenance Tasks

**Weekly:**
- [ ] Check database size (Settings → Database → Usage)
- [ ] Review slow queries (Reports → Query Performance)
- [ ] Check error logs (Logs → Database Logs)

**Monthly:**
- [ ] Review RLS policies for any needed updates
- [ ] Clean up test data
- [ ] Analyze table statistics:
  ```sql
  ANALYZE assessments;
  ANALYZE purchases;
  -- etc.
  ```
- [ ] Check backup status

**Quarterly:**
- [ ] Review and optimize indexes
- [ ] Archive old data if needed
- [ ] Update database statistics
- [ ] Test backup restoration

---

## Advanced Configuration

### Realtime Subscriptions

Enable realtime updates for live features:

```typescript
// Listen for new assessments
const subscription = supabase
  .channel('assessments')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'assessments' 
    }, 
    (payload) => {
      console.log('New assessment:', payload.new);
    }
  )
  .subscribe();
```

**Enable in Supabase:**
1. Go to Database → Replication
2. Enable replication for tables you need
3. Configure publication settings

### Database Functions (Advanced)

Create custom functions for complex operations:

```sql
-- Example: Get user dashboard data in one query
CREATE OR REPLACE FUNCTION get_user_dashboard(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', (SELECT row_to_json(p.*) FROM user_profiles p WHERE p.id = user_uuid),
    'assessments', (SELECT json_agg(a.*) FROM assessments a WHERE a.user_id = user_uuid),
    'purchases', (SELECT json_agg(pur.*) FROM purchases pur WHERE pur.user_id = user_uuid),
    'progress', (SELECT json_agg(prog.*) FROM user_progress prog WHERE prog.user_id = user_uuid)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Use in app:
```typescript
const { data } = await supabase.rpc('get_user_dashboard', {
  user_uuid: userId
});
```

---

## Next Steps

After completing this setup:

1. ✅ **Test everything** - Run through user flows
2. ✅ **Set up monitoring** - Add error tracking
3. ✅ **Configure backups** - Enable PITR
4. ✅ **Deploy to production** - Follow deployment checklist
5. ✅ **Document custom changes** - Keep notes on modifications

---

## Resources

- 📖 **Supabase Docs:** https://supabase.com/docs
- 💬 **Supabase Discord:** https://discord.supabase.com
- 🐛 **Report Issues:** https://github.com/supabase/supabase/issues
- 📺 **Video Tutorials:** https://www.youtube.com/c/Supabase

---

## Getting Help

If you get stuck:

1. **Check this guide** - Use Cmd/Ctrl+F to search
2. **Check Supabase logs** - Most errors show in Dashboard logs
3. **Search Supabase docs** - Excellent documentation
4. **Ask Supabase Discord** - Very responsive community
5. **GitHub Issues** - Check if others had same problem

---

## Checklist

Use this to track your progress:

### Initial Setup
- [ ] Created Supabase project
- [ ] Saved project credentials securely
- [ ] Ran main schema migration
- [ ] Ran premium features migration
- [ ] Verified all tables created
- [ ] Configured environment variables
- [ ] Tested database connection

### Authentication
- [ ] Configured site URL
- [ ] Added redirect URLs
- [ ] Updated email templates
- [ ] Tested email confirmation
- [ ] (Optional) Set up social auth

### Security
- [ ] Verified RLS enabled on all tables
- [ ] Tested RLS policies
- [ ] Reviewed security settings
- [ ] Secured service role key

### Testing
- [ ] Tested assessment creation
- [ ] Tested email capture
- [ ] Tested premium functions
- [ ] Tested feature access
- [ ] Verified data appears correctly

### Production Ready
- [ ] Configured production environment variables
- [ ] Updated auth URLs for production
- [ ] Enabled database backups
- [ ] Set up monitoring
- [ ] Tested backup restoration
- [ ] Documented any custom changes

---

**🎉 Congratulations!** You now have a fully configured Supabase backend!

Your app is ready to handle:
- ✅ User authentication
- ✅ Assessment storage
- ✅ Payment tracking
- ✅ Premium user management
- ✅ Feature gating
- ✅ Email notifications

**Now go build something amazing! 🚀**
