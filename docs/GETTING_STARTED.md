# Getting Started with Trajectory Development

> **Welcome to the Trajectory codebase!** This guide will get you up and running quickly.

## 🚀 Quick Start (5 Minutes)

### 1. Your Production Site
**Live URL:** https://trajectorygroup.org  
This is your production environment. Real users, real data, real money. Handle with care.

### 2. Essential Information
- **Project:** Trajectory Life Assessment & Course Platform
- **Tech Stack:** Next.js 15, TypeScript, Supabase, Tailwind CSS
- **Deployment:** Vercel (auto-deploys from `main` branch)
- **Target Audience:** High-value men seeking financial transformation

### 3. First Steps

```bash
# Clone the repo (if you haven't already)
git clone https://github.com/your-org/RRR.git
cd RRR

# Install dependencies
cd apps/trajectory2
npm install

# Set up environment variables
cp env.template .env.local
# Edit .env.local with your actual keys (ask team for these)

# Start dev server
npm run dev

# Open http://localhost:3003
```

---

## 📚 Learning Resources

### Start Here: Developer Skills Index
**File:** `/docs/development/SKILLS_INDEX.md`

This is your master guide. It contains:
- All available skill guides
- Learning paths for different experience levels
- Progress trackers
- Quick references

### Critical Guides (Read These First)

1. **Essential Developer Skills** (`/docs/development/ESSENTIAL_DEV_SKILLS.md`)
   - 7 core skills you MUST know
   - Git, DevTools, TypeScript, Supabase, Tailwind, etc.
   - Practice projects included

2. **Debugging Playbook** (`/docs/development/DEBUGGING_PLAYBOOK.md`)
   - Use this when things break
   - 5-minute debug protocol
   - Common issues & instant fixes

3. **Production Deployment Skills** (`/docs/development/PRODUCTION_DEPLOYMENT_SKILLS.md`)
   - How to deploy without breaking production
   - Pre-deployment checklist
   - Rollback strategies

4. **Git Workflow** (in `/.cursorrules`)
   - Branch strategy
   - Commit conventions
   - Pull request process
   - **NEVER commit directly to main!**

---

## 🛠️ Your Development Environment

### Required Tools
- **Node.js** 18+ (check: `node --version`)
- **Git** (check: `git --version`)
- **Code Editor** (VS Code or Cursor recommended)
- **Supabase CLI** (install: `brew install supabase/tap/supabase`)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

### Browser Tools
- Chrome DevTools (Cmd+Opt+J)
- React DevTools extension
- Network tab (essential for debugging)

---

## 🎯 Your First Task

### Goal: Make Your First Contribution

**Task:** Add your name to the team page (we'll create one if it doesn't exist)

```bash
# 1. Create a branch
git checkout develop
git pull origin develop
git checkout -b feature/add-team-member-yourname

# 2. Create or edit the team page
# src/app/team/page.tsx

# 3. Add your info
# (Follow the existing pattern)

# 4. Test locally
npm run dev
# Visit http://localhost:3003/team

# 5. Check for errors
npm run lint
npm run typecheck
npm run build

# 6. Commit
git add src/app/team/page.tsx
git commit -m "feat(team): add [Your Name] to team page"

# 7. Push
git push origin feature/add-team-member-yourname

# 8. Create Pull Request on GitHub
# Request review from team
```

**This teaches you:**
- Branch creation
- File editing
- Testing locally
- Git workflow
- Pull request process

---

## 🔑 Key Concepts

### 1. Environment Variables
**Local:** `.env.local` (NEVER commit this!)  
**Production:** Vercel dashboard

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `SQUARE_ACCESS_TOKEN`

### 2. File Structure
```
apps/trajectory2/
├── src/
│   ├── app/              # Pages & API routes
│   ├── components/       # React components
│   ├── lib/             # Utilities
│   └── utils/           # Helper functions
├── public/              # Static assets
└── .env.local          # Environment variables (local only)
```

### 3. Routing
File-based routing (Next.js App Router):
- `src/app/page.tsx` → `/`
- `src/app/about/page.tsx` → `/about`
- `src/app/api/example/route.ts` → `/api/example`

### 4. Database
**Supabase** (PostgreSQL)
- Tables: users, assessment_results, courses, user_progress, payments
- Auth: Built-in authentication
- RLS: Row Level Security (users can only see their own data)

### 5. Styling
**Tailwind CSS** (utility-first)
```tsx
<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
  <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
</div>
```

---

## 🚨 Important Rules

### Git Rules (Non-Negotiable)
1. **NEVER commit directly to `main` or `develop`**
2. **ALWAYS create a branch** for your work
3. **ALWAYS test locally** before pushing
4. **ALWAYS run linter** before committing (`npm run lint`)
5. **NEVER commit secrets** (API keys, passwords)

### Code Rules
1. **NEVER use `console.log` in production** (remove before committing)
2. **ALWAYS handle errors** (try/catch, error states)
3. **ALWAYS validate user input** (never trust users)
4. **NEVER expose API keys** in client code
5. **ALWAYS test in browser** before committing UI changes

### Production Rules
1. **Test in local production build** (`npm run build && npm run start`)
2. **Check Vercel logs** after deployment
3. **Monitor for 30 minutes** after deploying
4. **Have rollback plan** ready
5. **Never test with production database** locally

---

## 🆘 Common Issues & Fixes

### Issue: Dev server won't start
```bash
# Fix 1: Check if port is in use
lsof -i :3003
# Kill the process if needed

# Fix 2: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Fix 3: Check .env.local exists
ls -la .env.local
```

### Issue: "Module not found" error
```bash
# Fix: Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or restart dev server
# Ctrl+C, then npm run dev
```

### Issue: Styles not applying
```bash
# Fix: Hard refresh browser
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Or restart dev server
# Ctrl+C, then npm run dev
```

### Issue: Supabase queries returning empty
```bash
# Check 1: Is user authenticated?
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

# Check 2: RLS policies
# Go to Supabase Dashboard → Authentication → Policies
# Verify policies allow access

# Check 3: Data exists
# Go to Supabase Dashboard → Table Editor
# Verify rows exist in table
```

---

## 📞 Getting Help

### Before Asking for Help
1. **Check the guides** (especially Debugging Playbook)
2. **Check console** for error messages
3. **Try the 5-minute debug protocol**
4. **Search the codebase** for similar patterns

### When Asking for Help
Provide:
1. **Full error message** (copy-paste, not screenshot)
2. **Relevant code** (the part that's broken)
3. **What you tried** (list your debugging steps)
4. **Expected vs actual** (what should happen vs what happens)

### Resources
- **Skills Index:** `/docs/development/SKILLS_INDEX.md`
- **All Guides:** `/docs/development/`
- **Feature Docs:** `/docs/features/`
- **Setup Docs:** `/docs/setup/`

---

## 🎓 Learning Path

### Week 1: Foundations
- [ ] Read Essential Developer Skills
- [ ] Set up local environment
- [ ] Make first Git commit
- [ ] Complete "First Task" above

### Week 2: Building
- [ ] Read Debugging Playbook
- [ ] Build a simple page
- [ ] Query Supabase
- [ ] Style with Tailwind

### Week 3: Shipping
- [ ] Read Production Deployment Skills
- [ ] Create a pull request
- [ ] Review someone's code
- [ ] Deploy to production (with guidance)

### Week 4: Advanced
- [ ] Read API Integration Skills
- [ ] Build a feature end-to-end
- [ ] Handle a production issue
- [ ] Deploy independently

---

## 🎉 You're Ready!

You now have:
- ✅ Access to the codebase
- ✅ Development environment set up
- ✅ Essential guides bookmarked
- ✅ First task to complete
- ✅ Resources for when you're stuck

**Next step:** Open `/docs/development/SKILLS_INDEX.md` and start with "Essential Developer Skills"

---

## 🚀 Remember

> "Every expert was once a beginner. Start small, learn daily, ship often."

Welcome to the team! Let's build something amazing. 💪

---

**Questions?** Check the guides or ask in team chat.  
**Stuck?** Use the Debugging Playbook.  
**Ready to ship?** Follow the Production Deployment guide.

**Let's go! 🔥**

