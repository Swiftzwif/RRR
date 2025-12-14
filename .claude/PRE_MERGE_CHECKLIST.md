# Pre-Merge Checklist - Action Required

**Date Created**: 2025-11-15
**Status**: 📋 ACTION REQUIRED BEFORE MERGING PRs #57-62

This document contains all actions YOU (the end user) must complete before merging the 6 open PRs.

---

## ⚠️ CRITICAL: Required Before Any Merge

### 1. Set Environment Variable in Vercel (REQUIRED FOR PR #60)

**Variable**: `ADMIN_EMAILS`
**Value**: `jean@killtheboy.com,admin@trajectory.com`
**Required For**: PR #60 (Security fixes)

**Steps**:
1. Log into Vercel dashboard: https://vercel.com
2. Navigate to your Trajectory project
3. Go to: Settings → Environment Variables
4. Click "Add Variable"
5. Enter:
   - **Name**: `ADMIN_EMAILS`
   - **Value**: `jean@killtheboy.com,admin@trajectory.com`
   - **Apply to**: ✅ Production, ✅ Preview, ✅ Development
6. Click "Save"
7. **Redeploy**: Settings → Deployments → Latest → Redeploy

**Why This Is Critical**:
- PR #60 moves hardcoded admin emails to environment variable
- Without this, admin dashboard will fail to load
- Security best practice: credentials in environment, not code

**Verification**:
```bash
# After setting, verify in your next deployment:
# Check admin dashboard loads correctly
# Verify admin access works
```

---

## 📋 Pre-Merge Testing Checklist

### For Each PR Before Merging

Run these commands in the main repo:

```bash
cd /home/locker/Projects/RRR

# Build verification
npm run build
# ✅ Must succeed without errors

# Type checking
npm run typecheck
# ✅ Must pass with zero errors

# Linting
npm run lint
# ✅ Must pass (warnings OK, errors not OK)

# Tests
npm run test:run
# ✅ All tests must pass (70+ tests)

# Coverage check
npm run test:coverage
# ✅ Coverage must be ≥72%
```

### Vercel Preview Testing

Each PR automatically gets a preview deployment:

1. Go to PR page on GitHub
2. Look for "Vercel" bot comment with preview URL
3. Click "Visit Preview" link
4. Test these critical flows:

**Assessment Flow**:
- [ ] Landing page loads
- [ ] Start assessment button works
- [ ] All 15 questions render
- [ ] Keyboard shortcuts work (1-5, arrows, Enter)
- [ ] Results page displays correctly
- [ ] Domain meters animate
- [ ] Avatar displays correctly

**Auth Flow**:
- [ ] Sign up form works
- [ ] Email verification triggers
- [ ] Login form works
- [ ] Password reset flow works
- [ ] Sign out works

**Payment Flow** (if applicable):
- [ ] Course checkout works
- [ ] Coaching application checkout works
- [ ] Stripe integration functional

**Animations** (especially for PR #59):
- [ ] Home page hero animates
- [ ] Product showcase cycles
- [ ] Page transitions smooth
- [ ] Mobile menu works

**Error Handling** (especially for PR #60):
- [ ] Toast notifications appear on errors
- [ ] ErrorBoundary catches component errors
- [ ] User-friendly error messages

---

## 🔄 Recommended Merge Sequence

**Merge PRs in this order to minimize risk**:

### 1. PR #57: Comprehensive Testing (MERGE FIRST)
**Risk**: None (adds tests only)

**Pre-Merge**:
- [ ] Run `npm run test:run` - verify 70+ tests pass
- [ ] Check coverage report: `npm run test:coverage`
- [ ] Verify 72%+ coverage achieved

**Post-Merge**:
- [ ] Add `npm run test:run` to CI/CD pipeline
- [ ] Verify tests still pass in production

**Why First**: Zero risk, adds safety net for future changes

---

### 2. PR #58: Raffle Removal (MERGE SECOND)
**Risk**: Low (removes unused code)

**Pre-Merge**:
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No broken imports

**Post-Merge**:
- [ ] Admin dashboard loads (no raffle references)
- [ ] Payment routes work (no raffle integration)
- [ ] No 404 errors in production logs

**Why Second**: Safe cleanup, reduces codebase complexity

---

### 3. PR #59: Bundle Optimization (MERGE THIRD)
**Risk**: Low (no functional changes)

**Pre-Merge**:
- [ ] Build succeeds
- [ ] Test all pages with animations:
  - [ ] Home page (hero, product showcase)
  - [ ] Assessment page (progress animation)
  - [ ] Results page (meter animations)
- [ ] Verify no visual regressions

**Post-Merge**:
- [ ] Run Lighthouse audit: `npx lighthouse https://trajectory.com --view`
- [ ] Check bundle size: `npm run build` (look for page sizes)
- [ ] Verify Core Web Vitals improved
- [ ] Monitor page load times

**Expected Improvements**:
- Home page: -44KB (231KB → 187KB)
- Assessment: -44KB (232KB → 188KB)
- Results: -42KB (233KB → 191KB)

**Why Third**: High value performance gains with low risk

---

### 4. PR #60: Security & Error Handling (MERGE FOURTH)
**Risk**: Medium (requires environment variable)

**⚠️ PREREQUISITE**: `ADMIN_EMAILS` must be set in Vercel first!

**Pre-Merge**:
- [ ] ✅ `ADMIN_EMAILS` set in Vercel (see above)
- [ ] Build succeeds
- [ ] Redeploy Vercel after setting env var
- [ ] Test in preview deployment:
  - [ ] Submit assessment with error (verify toast shows)
  - [ ] Test admin dashboard access
  - [ ] Try XSS attack (verify sanitization works)
  - [ ] Verify ErrorBoundary catches errors

**Post-Merge**:
- [ ] Monitor Sentry for errors
- [ ] Verify toast notifications work in production
- [ ] Check admin email access works
- [ ] Verify no XSS vulnerabilities

**Why Fourth**: Critical security fixes, but requires setup

---

### 5. PR #61: Component Refactoring (MERGE FIFTH)
**Risk**: Low (large refactor, but well-tested)

**Pre-Merge**:
- [ ] Build succeeds
- [ ] All tests pass
- [ ] Test in preview:
  - [ ] Home page loads all 5 sections correctly
  - [ ] Product showcase auto-cycles
  - [ ] Assessment keyboard navigation works
  - [ ] Email sending functional (after assessment completion)

**Post-Merge**:
- [ ] Verify home page loads quickly
- [ ] Check for any styling issues
- [ ] Verify email delivery works
- [ ] Monitor for broken imports

**Why Fifth**: Large changes, but thoroughly tested and safe

---

### 6. PR #62: React Optimization (MERGE SIXTH - OPTIONAL)
**Risk**: None (optimization only)

**Pre-Merge**:
- [ ] Build succeeds
- [ ] All tests pass
- [ ] No functional changes

**Post-Merge** (Optional Profiling):
- [ ] Install React DevTools in browser
- [ ] Open Profiler tab
- [ ] Record assessment flow interaction
- [ ] Verify reduced re-render count
- [ ] Check Core Web Vitals improvements

**Expected Improvements**:
- Assessment flow: 40-60% fewer re-renders
- Home page: 20-30% faster initial render
- Navigation: 15-20% fewer re-renders

**Why Sixth**: Enhancement, not critical - can merge anytime

---

## 🛠️ Post-Merge Monitoring

### After Each Merge

**Check Vercel Deployment**:
```bash
# Visit your production URL
open https://trajectory.com

# Check deployment logs in Vercel dashboard
# Look for any errors or warnings
```

**Monitor Errors**:
- Check Vercel function logs for errors
- Check Sentry dashboard (if configured)
- Monitor browser console for client-side errors

**Verify Metrics**:
```bash
# Run Lighthouse audit
npx lighthouse https://trajectory.com --view

# Check Core Web Vitals:
# - LCP (Largest Contentful Paint): Target <2.5s
# - FID (First Input Delay): Target <100ms
# - CLS (Cumulative Layout Shift): Target <0.1
```

**Test Critical Paths**:
- Complete assessment flow (start → 15 questions → results)
- Test auth flow (sign up → verify → login)
- Test payment flow (if applicable)

---

## 🚨 Rollback Plan

If any PR causes issues after merging:

### Quick Rollback
```bash
# In Vercel dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"
```

### Git Rollback
```bash
# Find the commit to revert
git log --oneline -10

# Revert the merge commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin master
```

---

## 📊 Success Criteria

After merging all 6 PRs, verify:

### Code Quality
- [ ] Test coverage ≥72%
- [ ] TypeScript strict mode clean (zero errors)
- [ ] ESLint passing (zero errors)
- [ ] Build succeeds in <60 seconds

### Performance
- [ ] Home page: ~187KB (down from 231KB)
- [ ] Assessment page: ~188KB (down from 232KB)
- [ ] Results page: ~191KB (down from 233KB)
- [ ] Lighthouse Performance Score: ≥85

### Security
- [ ] Zero hardcoded secrets in code
- [ ] Admin emails in environment variables
- [ ] XSS protection active (DOMPurify)
- [ ] Error boundaries catching errors
- [ ] Toast notifications working

### Functionality
- [ ] Assessment flow: 100% functional
- [ ] Auth flow: 100% functional
- [ ] Payment flow: 100% functional
- [ ] Admin dashboard: Accessible to authorized users
- [ ] Email sending: Working correctly

---

## 🔧 Optional Enhancements (Future)

These were planned but not completed (agents hit credit limits):

### Phase 5: API Optimization (4-6 hours)
**Status**: Backend Engineer hit credit limit

**Planned Improvements**:
- [ ] Optimize Supabase query patterns
- [ ] Implement query batching
- [ ] Add caching headers to API routes
- [ ] Document database index recommendations

**How to Resume**:
1. Review `.claude/CODE_HARDENING_SUMMARY.md` Phase 5 section
2. Create new worktree: `git worktree add ../RRR-worktrees/phase5-api-optimization -b feature/phase5-api-optimization`
3. Work on API optimization
4. Create PR when complete

### Phase 6: JSDoc Documentation (4-6 hours)
**Status**: Documentation Writer hit credit limit

**Planned Improvements**:
- [ ] Add JSDoc to `src/lib/scoring.ts`
- [ ] Document `src/lib/email/sender.ts` functions
- [ ] Add API route documentation
- [ ] Document webhook handling logic

**How to Resume**:
1. Review `.claude/CODE_HARDENING_SUMMARY.md` Phase 6 section
2. Create new worktree: `git worktree add ../RRR-worktrees/phase6-documentation -b feature/phase6-documentation`
3. Add JSDoc comments
4. Create PR when complete

---

## 📞 Need Help?

### Resources
- **Full Summary**: `.claude/CODE_HARDENING_SUMMARY.md` (528 lines)
- **Execution Details**: `.claude/CODE_HARDENING_EXECUTION_SUMMARY.md`
- **React Optimization**: `.claude/PHASE4_REACT_OPTIMIZATION.md`
- **Comprehensive Plan**: `.claude/comprehensive-improvement-plan.md`

### Common Issues

**Issue**: Build fails after merge
**Solution**: Check TypeScript errors, verify all imports are correct

**Issue**: Tests fail after merge
**Solution**: Run `npm run test:coverage` to see which tests are failing

**Issue**: Admin dashboard not loading (after PR #60)
**Solution**: Verify `ADMIN_EMAILS` is set in Vercel, redeploy

**Issue**: Animations not working (after PR #59)
**Solution**: Check browser console for errors, verify framer-motion loads

**Issue**: Environment variable not working
**Solution**: Redeploy after setting env var, verify it's set in all environments

---

## ✅ Final Checklist Before Closing Session

- [ ] `ADMIN_EMAILS` set in Vercel
- [ ] All 6 PRs reviewed and understood
- [ ] Merge sequence plan clear
- [ ] Testing checklist saved
- [ ] Rollback plan understood
- [ ] Documentation reviewed

---

**This checklist ensures a smooth, safe deployment of all improvements.**

Good luck with the merges! 🚀
