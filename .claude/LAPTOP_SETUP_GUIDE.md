# Laptop Setup Guide - Continue from Desktop Session

**Date**: 2025-11-15
**Purpose**: Transfer session from desktop to laptop seamlessly

This guide helps you continue working on the Trajectory project from your laptop with full context.

---

## 📦 What's Already in GitHub

All configuration and documentation has been committed to the repository:

### Claude Configuration Files
- `.claude/agents/*.md` - All 17 agent definitions
- `.claude/config/*.yaml` - System configuration
- `.claude/*.md` - All project documentation
- `.claude/comprehensive-improvement-plan.md` - Master plan
- `.claude/CODE_HARDENING_SUMMARY.md` - Phases 1-3 work
- `.claude/CODE_HARDENING_EXECUTION_SUMMARY.md` - Full execution details
- `.claude/PRE_MERGE_CHECKLIST.md` - Action items before merging
- `.claude/LAPTOP_SETUP_GUIDE.md` - This file

### User Configuration Files
Located in `~/.claude/` on desktop (need to copy manually):
- `~/.claude/CLAUDE.md` - Global user instructions
- `~/.claude/agents/` - Agent definitions
- `~/.claude/config/` - System configuration
- `~/.claude/templates/` - Project templates

---

## 🚀 Quick Start on Laptop

### 1. Clone Repository
```bash
cd ~/Projects
git clone git@github.com:Swiftzwif/RRR.git
cd RRR
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Setup
```bash
# Check build
npm run build

# Check tests
npm run test:run

# Check types
npm run typecheck
```

---

## 📋 Current Project State

### Open PRs (6 total)
All ready for review and merge:

| PR # | Title | Status | Priority |
|------|-------|--------|----------|
| [#57](https://github.com/Swiftzwif/RRR/pull/57) | feat(testing): comprehensive test infrastructure | 🟢 Ready | 1st |
| [#58](https://github.com/Swiftzwif/RRR/pull/58) | refactor: remove unused raffle/giveaway | 🟢 Ready | 2nd |
| [#59](https://github.com/Swiftzwif/RRR/pull/59) | perf(bundle): reduce bundles 40-45KB | 🟢 Ready | 3rd |
| [#60](https://github.com/Swiftzwif/RRR/pull/60) | fix(security): 4 critical vulnerabilities | ⚠️ Needs ADMIN_EMAILS | 4th |
| [#61](https://github.com/Swiftzwif/RRR/pull/61) | refactor: modularize page.tsx | 🟢 Ready | 5th |
| [#62](https://github.com/Swiftzwif/RRR/pull/62) | perf(react): optimize re-renders | 🟢 Ready | 6th |

### Git Worktrees
Located at: `/home/locker/Projects/RRR-worktrees/` on desktop

**On Laptop**: You don't need worktrees - all branches are on GitHub
```bash
# To review a PR locally:
git fetch origin
git checkout feature/comprehensive-testing  # or any branch
npm install
npm run build
```

---

## 🔧 Laptop Environment Setup

### 1. Node.js & npm
```bash
# Verify versions match desktop
node --version  # Should be v22.16.0 or compatible
npm --version   # Should be compatible with project
```

### 2. Environment Variables
Create `.env.local` in project root:

```bash
# Copy from desktop or use these templates:

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

# Application
COACHING_SCHEDULER_URL=your_scheduler_url
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ Security**: Never commit `.env.local` to git

### 3. Development Server
```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 📚 Understanding the Current State

### Completed Work (Desktop Session)
1. ✅ **Phases 1-3**: Comprehensive code hardening
   - Dead code removal: -3,113 lines
   - Bundle optimization: -40KB per page
   - Security fixes: 4 critical issues
   - Component refactoring: page.tsx 699→35 lines
   - Test infrastructure: 0%→72% coverage

2. ✅ **Phase 4 (Partial)**: React optimization
   - 11 optimizations across 4 components
   - Expected 20-60% re-render reduction

3. ⏸️ **Phase 5-6**: Incomplete (agents hit credit limits)
   - API optimization (planned but not started)
   - JSDoc documentation (planned but not started)

### Current Status
- Master branch: Clean and production-ready
- 6 PRs: Open and ready for review/merge
- All branches: Pushed to GitHub
- Documentation: Complete and in `.claude/`

---

## 🎯 Next Actions on Laptop

### Immediate (Today)
1. **Set Environment Variable in Vercel**
   - Variable: `ADMIN_EMAILS=jean@killtheboy.com,admin@trajectory.com`
   - Required before merging PR #60
   - See: `.claude/PRE_MERGE_CHECKLIST.md`

2. **Review PRs**
   - Read each PR description on GitHub
   - Test in Vercel preview deployments
   - Use checklist: `.claude/PRE_MERGE_CHECKLIST.md`

### Short Term (This Week)
1. **Merge PRs** (in recommended sequence)
   - #57 → #58 → #59 → #60 → #61 → #62
   - Test after each merge
   - Monitor production

2. **Verify Deployment**
   - Check Vercel deployments succeed
   - Run Lighthouse audits
   - Monitor error logs

### Optional (Next Week)
1. **Complete Phase 5**: API Optimization
   - Resume Backend Engineer work
   - Optimize Supabase queries
   - Add caching headers

2. **Complete Phase 6**: JSDoc Documentation
   - Resume Documentation Writer work
   - Document business logic (scoring.ts)
   - Document API routes

---

## 🔍 Key Documentation to Review

### Start Here
1. **PRE_MERGE_CHECKLIST.md** - Action items before merging
2. **CODE_HARDENING_EXECUTION_SUMMARY.md** - Today's work summary
3. **comprehensive-improvement-plan.md** - Overall project plan

### Deep Dives
1. **CODE_HARDENING_SUMMARY.md** - Detailed Phases 1-3 analysis (528 lines)
2. **PHASE4_REACT_OPTIMIZATION.md** - React optimization details
3. **project-context.md** - Current project context

### Reference
1. **CLAUDE.md** (project root) - Project-specific instructions
2. **~/.claude/CLAUDE.md** - Global user instructions
3. `.claude/agents/*.md` - Agent definitions

---

## 🛠️ Development Workflow on Laptop

### Working on a New Feature
```bash
# Create new branch
git checkout master
git pull origin master
git checkout -b feature/my-new-feature

# Make changes
# ... edit files ...

# Test
npm run build
npm run typecheck
npm run lint
npm run test:run

# Commit
git add .
git commit -m "feat(scope): description"

# Push
git push origin feature/my-new-feature

# Create PR on GitHub
gh pr create --base master --title "..." --body "..."
```

### Reviewing a PR Locally
```bash
# Fetch and checkout PR branch
git fetch origin
git checkout feature/comprehensive-testing

# Install dependencies (if needed)
npm install

# Test
npm run build
npm run test:run
npm run dev  # Test manually at localhost:3000
```

### Merging a PR
```bash
# Use GitHub UI (recommended)
# Or use gh CLI:
gh pr merge 57 --squash --delete-branch
```

---

## 🔒 Security Reminders

### Never Commit These
- `.env.local` - Local environment variables
- `.env` - Production environment variables
- `node_modules/` - Dependencies (already in .gitignore)
- API keys or secrets

### Verify .gitignore
```bash
cat .gitignore | grep -E '\.env|node_modules'
# Should see:
# .env*.local
# node_modules/
```

---

## 📊 Project Structure

```
RRR/
├── apps/trajectory2/          # Main application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   ├── lib/              # Business logic
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── README.md
├── .claude/                   # Claude configuration & docs
│   ├── agents/               # Agent definitions
│   ├── config/               # System config
│   ├── *.md                  # Documentation
│   └── reports/              # Agent reports
├── CLAUDE.md                 # Project instructions
└── README.md                 # Project README
```

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Tests Fail
```bash
# Check test output
npm run test:run

# Generate coverage report
npm run test:coverage
# Open: coverage/index.html
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Environment Variables Not Working
```bash
# Verify .env.local exists
cat .env.local

# Restart dev server
npm run dev
```

---

## 📞 Getting Help

### GitHub Issues
Check open issues: https://github.com/Swiftzwif/RRR/issues

### Documentation
- Project docs: `.claude/*.md`
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Tailwind docs: https://tailwindcss.com/docs

### Claude Code
Continue conversation in Claude Code on laptop:
- Reference: `.claude/project-context.md`
- All agent prompts in: `.claude/agents/`
- System config: `.claude/config/`

---

## ✅ Laptop Setup Checklist

- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created with environment variables
- [ ] Build succeeds (`npm run build`)
- [ ] Tests pass (`npm run test:run`)
- [ ] Dev server runs (`npm run dev`)
- [ ] Documentation reviewed (PRE_MERGE_CHECKLIST.md)
- [ ] PRs reviewed on GitHub
- [ ] `ADMIN_EMAILS` set in Vercel (before merging PR #60)

---

**You're now ready to continue from your laptop!** 🎉

All context is preserved in GitHub. Review the PRs, merge them in sequence, and continue building.
