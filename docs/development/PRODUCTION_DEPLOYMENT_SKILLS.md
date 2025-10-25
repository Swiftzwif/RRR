# Production Deployment Skills - trajectorygroup.org

> **The Veteran's Guide to Shipping Code Without Breaking Production**

## Core Principle

> "Production is sacred. Test locally, deploy confidently, monitor constantly."

---

## Skill 1: Understanding Production vs Development

### Development Environment

- **URL:** <http://localhost:3003>
- **Database:** Development Supabase project
- **Errors:** Shown in browser (helpful)
- **Changes:** Instant (hot reload)
- **Stakes:** Low (only you see it)
- **Data:** Test data (safe to delete)

### Production Environment

- **URL:** <https://trajectorygroup.org>
- **Database:** Production Supabase project
- **Errors:** Hidden from users (security)
- **Changes:** Deploy required (5-10 minutes)
- **Stakes:** HIGH (real users, real money)
- **Data:** Real user data (NEVER delete)

### Key Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Error messages | Detailed | Generic |
| Performance | Slower (dev build) | Faster (optimized) |
| Caching | Disabled | Enabled |
| API keys | Test keys | Live keys |
| Payments | Sandbox mode | Real charges |
| Users | Just you | Real customers |

**Critical Rule:** NEVER test with production database or API keys locally.

---

## Skill 2: Pre-Deployment Checklist

### Before EVERY Deploy (Non-Negotiable)

```bash
# 1. Run linter (catch code quality issues)
npm run lint
# Must show: ✓ No ESLint warnings or errors

# 2. Run type check (catch type errors)
npm run typecheck
# Must show: Found 0 errors

# 3. Run tests (if you have them)
npm run test
# Must show: All tests passed

# 4. Build locally (catch build errors)
npm run build
# Must show: ✓ Compiled successfully

# 5. Test production build locally
npm run start
# Open http://localhost:3003
# Test critical paths:
# - Home page loads
# - Assessment works
# - Login works
# - Course pages load (if premium user)

# 6. Check git status (no uncommitted changes)
git status
# Must show: nothing to commit, working tree clean

# 7. Verify you're on correct branch
git branch
# Should show: * main (or develop, depending on workflow)

# 8. Pull latest changes
git pull origin main
# Ensure you have latest code
```

**If ANY step fails, DO NOT DEPLOY. Fix the issue first.**

---

## Skill 3: Deployment Workflow (Vercel)

### How Trajectory Deploys

```
Your Code (Git)
    ↓
GitHub (main branch)
    ↓
Vercel (auto-deploys)
    ↓
trajectorygroup.org (live)
```

**Key Points:**

- Vercel watches the `main` branch
- Every push to `main` triggers a deployment
- Deployment takes 5-10 minutes
- Old version stays live until new version is ready (zero downtime)

### Manual Deployment Steps

```bash
# Step 1: Ensure you're on main branch
git checkout main

# Step 2: Pull latest changes
git pull origin main

# Step 3: Merge your feature branch
git merge feature/your-branch

# Step 4: Run pre-deployment checklist (see above)

# Step 5: Push to main
git push origin main

# Step 6: Watch Vercel dashboard
# Go to: https://vercel.com/your-team/trajectory2
# You'll see:
# - Building... (2-3 minutes)
# - Deploying... (1-2 minutes)
# - Ready (deployment complete)

# Step 7: Verify deployment
# Open https://trajectorygroup.org
# Test critical paths:
# - Home page
# - Assessment
# - Login
# - Course (if premium)

# Step 8: Monitor for errors
# Check Vercel logs for any errors
# Check Supabase logs for database errors
# Check user reports (if any)
```

### Automatic Deployment (Recommended)

```bash
# Just push to main - Vercel handles the rest
git push origin main

# Vercel will:
# 1. Detect the push
# 2. Run npm run build
# 3. Run tests (if configured)
# 4. Deploy if build succeeds
# 5. Send you a notification

# You'll get:
# - Email notification (build started)
# - Email notification (build succeeded/failed)
# - Slack notification (if configured)
```

---

## Skill 4: Environment Variables in Production

### Local vs Production Env Vars

**Local (.env.local):**

```bash
# Development Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key

# Test email (Resend)
RESEND_API_KEY=re_test_key

# Sandbox payments (Square)
SQUARE_ACCESS_TOKEN=sandbox-token
SQUARE_ENVIRONMENT=sandbox
```

**Production (Vercel Dashboard):**

```bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key

# Live email (Resend)
RESEND_API_KEY=re_live_key

# Live payments (Square)
SQUARE_ACCESS_TOKEN=production-token
SQUARE_ENVIRONMENT=production
```

### Setting Production Env Vars

```bash
# Method 1: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/your-team/trajectory2
2. Click "Settings"
3. Click "Environment Variables"
4. Add each variable:
   - Key: NEXT_PUBLIC_SUPABASE_URL
   - Value: https://prod-project.supabase.co
   - Environment: Production
5. Click "Save"
6. Redeploy for changes to take effect

# Method 2: Vercel CLI
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter value when prompted

# Method 3: .env.production file (NOT RECOMMENDED)
# Don't do this - env vars should be in Vercel, not in Git
```

### Verifying Production Env Vars

```typescript
// Add temporarily to a page to verify
// src/app/debug/page.tsx (DELETE AFTER CHECKING)
export default function DebugPage() {
  return (
    <div>
      <h1>Env Vars Check</h1>
      <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
      <p>Square Env: {process.env.SQUARE_ENVIRONMENT}</p>
      {/* DO NOT log secret keys - only check if they exist */}
      <p>Resend Key: {process.env.RESEND_API_KEY ? 'Set' : 'Missing'}</p>
    </div>
  );
}

// Visit https://trajectorygroup.org/debug
// Verify values are correct
// DELETE THIS PAGE after verification
```

**Security Rule:** NEVER log secret keys in production. Only check if they exist.

---

## Skill 5: Monitoring Production

### What to Monitor

1. **Vercel Logs** (Application errors)
2. **Supabase Logs** (Database errors)
3. **Resend Logs** (Email delivery)
4. **Square Dashboard** (Payment issues)
5. **User Reports** (Bug reports, support tickets)

### Checking Vercel Logs

```bash
# Method 1: Vercel Dashboard
1. Go to https://vercel.com/your-team/trajectory2
2. Click "Deployments"
3. Click latest deployment
4. Click "Logs" tab
5. Look for errors (red text)

# Method 2: Vercel CLI
vercel logs trajectorygroup.org

# What to look for:
# - 500 errors (server errors)
# - Unhandled promise rejections
# - Missing env vars
# - API timeouts
# - Database connection errors
```

### Checking Supabase Logs

```bash
# Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select production project
3. Click "Logs" in sidebar
4. Filter by:
   - Time: Last hour
   - Level: Error
   - Service: API

# What to look for:
# - Failed queries
# - RLS policy violations
# - Connection errors
# - Slow queries (>1s)
```

### Setting Up Alerts

**Vercel Alerts:**

```bash
# Vercel Dashboard → Settings → Notifications
# Enable:
- Deployment failed
- Deployment succeeded
- Error rate spike
- Performance degradation
```

**Supabase Alerts:**

```bash
# Supabase Dashboard → Settings → Alerts
# Enable:
- Database CPU >80%
- Database memory >80%
- API error rate >5%
- Slow queries (>1s)
```

---

## Skill 6: Rollback Strategy

### When to Rollback

- Critical bug affecting all users
- Payment processing broken
- Authentication not working
- Data corruption risk
- Security vulnerability

### How to Rollback (Instant)

```bash
# Method 1: Vercel Dashboard (Fastest)
1. Go to https://vercel.com/your-team/trajectory2
2. Click "Deployments"
3. Find last working deployment
4. Click "..." menu
5. Click "Promote to Production"
6. Confirm
# Site reverts to old version in 30 seconds

# Method 2: Git Revert + Redeploy
git revert HEAD  # Undo last commit
git push origin main  # Trigger new deployment
# Takes 5-10 minutes

# Method 3: Git Reset (Nuclear Option)
git reset --hard HEAD~1  # Undo last commit
git push --force origin main  # Force push
# DANGEROUS - only use in emergencies
```

### After Rollback

```bash
# 1. Verify site is working
# Open https://trajectorygroup.org
# Test critical paths

# 2. Investigate the issue
# Check logs, reproduce locally

# 3. Fix the bug
# Create hotfix branch
git checkout -b hotfix/critical-issue

# 4. Test thoroughly
# Run full pre-deployment checklist

# 5. Deploy fix
git checkout main
git merge hotfix/critical-issue
git push origin main

# 6. Monitor closely
# Watch logs for 30 minutes after deployment
```

---

## Skill 7: Database Migrations in Production

### The Golden Rules

1. **NEVER delete columns with data** (data loss)
2. **NEVER rename tables directly** (breaks existing queries)
3. **ALWAYS test migrations locally first**
4. **ALWAYS backup before migrations**
5. **ALWAYS make migrations reversible**

### Safe Migration Process

```bash
# Step 1: Create migration locally
# src/database/migrations/add_user_preferences.sql
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

# Step 2: Test locally
supabase db reset  # Reset local database
supabase db push   # Apply migration
# Test that app still works

# Step 3: Backup production database
# Supabase Dashboard → Database → Backups → Create Backup

# Step 4: Apply to production
supabase link --project-ref YOUR_PROD_PROJECT
supabase db push
# Migration runs on production

# Step 5: Verify
# Check Supabase Dashboard → Table Editor
# Verify new table exists
# Verify data is intact

# Step 6: Deploy code that uses new table
git push origin main
```

### Dangerous Migrations (Avoid)

```sql
-- ❌ BAD: Deletes data
DROP TABLE users;

-- ❌ BAD: Loses data
ALTER TABLE users DROP COLUMN email;

-- ❌ BAD: Breaks existing queries
ALTER TABLE users RENAME TO accounts;

-- ✅ GOOD: Adds new column (safe)
ALTER TABLE users ADD COLUMN phone TEXT;

-- ✅ GOOD: Creates new table (safe)
CREATE TABLE user_preferences (...);

-- ✅ GOOD: Adds index (safe, improves performance)
CREATE INDEX idx_users_email ON users(email);
```

### Migration Rollback

```sql
-- Always create a rollback migration
-- migrations/add_user_preferences.sql
CREATE TABLE user_preferences (...);

-- migrations/rollback_add_user_preferences.sql
DROP TABLE IF EXISTS user_preferences;

-- If migration breaks production:
supabase db push --file migrations/rollback_add_user_preferences.sql
```

---

## Skill 8: Hotfix Workflow

### When You Need a Hotfix

- Production is broken RIGHT NOW
- Users can't login
- Payments failing
- Critical security issue
- Data corruption

### Hotfix Process (Fast Track)

```bash
# Step 1: Create hotfix branch from main (NOT develop)
git checkout main
git pull origin main
git checkout -b hotfix/payment-processing-fix

# Step 2: Make MINIMAL fix
# Only fix the critical issue
# Don't add features or refactor

# Step 3: Test locally
npm run build
npm run start
# Test the specific broken feature

# Step 4: Commit and push
git add -p
git commit -m "fix(payment): resolve Square webhook timeout issue"
git push origin hotfix/payment-processing-fix

# Step 5: Create PR targeting main
# Title: [HOTFIX] Payment processing fix
# Description: Critical fix for production issue
# Request immediate review

# Step 6: Merge to main (after approval)
git checkout main
git merge hotfix/payment-processing-fix
git push origin main

# Step 7: Verify deployment
# Watch Vercel deployment
# Test on production immediately

# Step 8: Merge back to develop
git checkout develop
git merge main
git push origin develop

# Step 9: Delete hotfix branch
git branch -d hotfix/payment-processing-fix
git push origin --delete hotfix/payment-processing-fix
```

### Hotfix Checklist

- [ ] **Issue is actually critical** (not just annoying)
- [ ] **Root cause identified** (not guessing)
- [ ] **Fix is minimal** (only fixes the issue)
- [ ] **Tested locally** (works in production build)
- [ ] **Deployed to production** (via main branch)
- [ ] **Verified working** (tested on live site)
- [ ] **Merged to develop** (keep branches in sync)
- [ ] **Documented** (what broke, why, how fixed)

---

## Skill 9: Performance Monitoring

### Key Metrics to Watch

1. **Page Load Time** (should be <3s)
2. **API Response Time** (should be <500ms)
3. **Database Query Time** (should be <100ms)
4. **Error Rate** (should be <1%)
5. **Uptime** (should be >99.9%)

### Checking Performance

**Vercel Analytics:**

```bash
# Vercel Dashboard → Analytics
# Check:
- Real Experience Score (should be >75)
- Largest Contentful Paint (should be <2.5s)
- First Input Delay (should be <100ms)
- Cumulative Layout Shift (should be <0.1)
```

**Lighthouse (Chrome DevTools):**

```bash
# Open https://trajectorygroup.org
# Open DevTools (Cmd+Opt+I)
# Click "Lighthouse" tab
# Click "Generate report"
# Check scores:
- Performance (should be >90)
- Accessibility (should be >90)
- Best Practices (should be >90)
- SEO (should be >90)
```

**Supabase Performance:**

```bash
# Supabase Dashboard → Reports
# Check:
- API requests per second
- Database CPU usage
- Database memory usage
- Slow queries (>1s)
```

### Optimizing Performance

**Slow Page Load:**

```typescript
// Problem: Large images
<img src="/huge-image.jpg" />

// Fix: Use Next.js Image component
import Image from 'next/image';
<Image src="/huge-image.jpg" width={800} height={600} alt="..." />
```

**Slow API Calls:**

```typescript
// Problem: Multiple sequential calls
const courses = await fetchCourses();
const users = await fetchUsers();
const progress = await fetchProgress();

// Fix: Parallel calls
const [courses, users, progress] = await Promise.all([
  fetchCourses(),
  fetchUsers(),
  fetchProgress()
]);
```

**Slow Database Queries:**

```sql
-- Problem: Missing index
SELECT * FROM assessment_results WHERE user_id = 'abc123';
-- Slow if no index on user_id

-- Fix: Add index
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
-- Now query is fast
```

---

## Skill 10: Security Best Practices

### Never Do These in Production

1. **❌ Log sensitive data**

   ```typescript
   console.log('User password:', password);  // NEVER
   console.log('API key:', process.env.SECRET_KEY);  // NEVER
   ```

2. **❌ Expose error details to users**

   ```typescript
   // Bad
   catch (error) {
     return { error: error.message };  // Exposes internals
   }
   
   // Good
   catch (error) {
     console.error('Internal error:', error);  // Log server-side
     return { error: 'Something went wrong' };  // Generic message
   }
   ```

3. **❌ Disable security features**

   ```typescript
   // Bad
   const supabase = createClient(url, key, {
     auth: { persistSession: false }  // Disables security
   });
   ```

4. **❌ Trust user input**

   ```typescript
   // Bad
   const query = `SELECT * FROM users WHERE id = '${userId}'`;  // SQL injection
   
   // Good
   const { data } = await supabase
     .from('users')
     .select('*')
     .eq('id', userId);  // Parameterized query
   ```

5. **❌ Commit secrets to Git**

   ```bash
   # Bad
   git add .env.local  # Contains secrets
   
   # Good
   # .env.local is in .gitignore
   # Secrets are in Vercel dashboard
   ```

### Security Checklist

- [ ] **All secrets in Vercel env vars** (not in code)
- [ ] **RLS enabled on all tables** (Supabase)
- [ ] **Input validation on all forms** (prevent injection)
- [ ] **HTTPS only** (no HTTP)
- [ ] **Auth required for protected routes** (middleware)
- [ ] **Error messages generic** (no internal details)
- [ ] **Dependencies updated** (no known vulnerabilities)
- [ ] **CORS configured correctly** (not wide open)

---

## Deployment Checklist (Print This)

### Before Deploy

- [ ] Code reviewed (PR approved)
- [ ] Linter passed (`npm run lint`)
- [ ] Type check passed (`npm run typecheck`)
- [ ] Build successful (`npm run build`)
- [ ] Tested locally (production build)
- [ ] No console errors (browser DevTools)
- [ ] No console.log statements (removed debug code)
- [ ] Environment variables verified (Vercel dashboard)
- [ ] Database migrations tested (locally first)
- [ ] Dependencies updated (`npm outdated`)

### During Deploy

- [ ] Pushed to main branch
- [ ] Vercel build started (check dashboard)
- [ ] Build succeeded (green checkmark)
- [ ] Deployment completed (live URL updated)

### After Deploy

- [ ] Site loads (`https://trajectorygroup.org`)
- [ ] Home page works
- [ ] Assessment works
- [ ] Login works
- [ ] Course pages work (if premium)
- [ ] No console errors (check DevTools)
- [ ] No 404 errors (check Network tab)
- [ ] Vercel logs clean (no errors)
- [ ] Supabase logs clean (no errors)
- [ ] Performance acceptable (Lighthouse >90)
- [ ] Monitored for 30 minutes (watch for issues)

---

## Emergency Contacts & Resources

### When Production Breaks

1. **Rollback immediately** (Vercel dashboard)
2. **Check logs** (Vercel + Supabase)
3. **Notify team** (if applicable)
4. **Create hotfix** (see Hotfix Workflow)
5. **Deploy fix** (test thoroughly first)
6. **Document incident** (what happened, why, how fixed)

### Useful Links

- Vercel Dashboard: <https://vercel.com/your-team/trajectory2>
- Supabase Dashboard: <https://supabase.com/dashboard>
- Resend Dashboard: <https://resend.com/dashboard>
- Square Dashboard: <https://squareup.com/dashboard>
- GitHub Repo: <https://github.com/your-org/RRR>

### Support Channels

- Vercel Support: <https://vercel.com/support>
- Supabase Support: <https://supabase.com/support>
- Square Support: <https://squareup.com/help>

---

## Remember

> "Deploy often. Deploy confidently. But always have a rollback plan."

Production deployment is a skill that improves with practice. Every deployment teaches you something new. Every incident makes you more prepared.

**Test thoroughly. Deploy carefully. Monitor constantly.**

🚀 **Happy Deploying!**
