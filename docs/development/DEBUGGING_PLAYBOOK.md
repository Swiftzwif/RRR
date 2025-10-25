# Debugging Playbook - Trajectory Project

> **The Veteran's Guide to Fixing Shit Fast**

## The Golden Rule of Debugging

> "If you can't reproduce it, you can't fix it. If you can't explain it, you don't understand it."

## The 5-Minute Debug Protocol

When something breaks, follow this EXACT sequence:

### Step 1: Reproduce (60 seconds)

```bash
# Can you make it happen again?
# If yes → Continue
# If no → Document what you did, try to trigger again
```

### Step 2: Console Check (30 seconds)

```bash
# Open browser console (Cmd + Option + J)
# Look for red errors
# Read the FULL error message
# Note the file and line number
```

### Step 3: Recent Changes (60 seconds)

```bash
# What did you change last?
git diff

# What changed in last few commits?
git log --oneline -5

# Undo last change and test
git stash
# Test again - does it work now?
# If yes → Your change broke it
# If no → Something else broke it
```

### Step 4: Network Check (30 seconds)

```bash
# Open Network tab in DevTools
# Refresh page
# Look for:
# - Red (failed requests)
# - Yellow (slow requests >3s)
# - 404 (wrong URL)
# - 401/403 (auth issue)
# - 500 (server error)
```

### Step 5: Environment Check (30 seconds)

```bash
# Is dev server running?
lsof -i :3003

# Are env vars loaded?
# Add temporarily to page:
console.log('ENV CHECK:', {
  supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  resend: !!process.env.RESEND_API_KEY
});

# Restart dev server
# Ctrl+C, then npm run dev
```

**After 5 minutes, you should know:**

1. What's broken
2. Where it's broken (file/line)
3. When it broke (recent change or not)
4. What the error message says

---

## Common Issues & Instant Fixes

### Issue: "Cannot read property 'X' of undefined"

**What it means:** You're trying to access a property on something that doesn't exist.

**Instant fix:**

```typescript
// Problem
const name = user.name;  // Error if user is undefined

// Fix 1: Optional chaining
const name = user?.name;

// Fix 2: Default value
const name = user?.name || 'Guest';

// Fix 3: Check first
if (user) {
  const name = user.name;
}
```

**Root causes:**

- API call hasn't returned yet (data is still loading)
- API call failed (data is null/undefined)
- Wrong variable name (typo)

---

### Issue: "Hydration mismatch" (React)

**What it means:** Server rendered different HTML than client expected.

**Instant fix:**

```typescript
// Problem: Using Date.now() or Math.random() in render
<div>Generated at: {Date.now()}</div>  // Different on server vs client

// Fix: Use useEffect for client-only rendering
'use client';
import { useState, useEffect } from 'react';

export default function Component() {
  const [timestamp, setTimestamp] = useState<number | null>(null);
  
  useEffect(() => {
    setTimestamp(Date.now());
  }, []);
  
  return <div>Generated at: {timestamp}</div>;
}
```

**Root causes:**

- Using browser APIs (window, localStorage) without guards
- Using random values or timestamps in render
- Conditional rendering based on client-only state

---

### Issue: "404 Not Found" (API calls)

**What it means:** The URL you're calling doesn't exist.

**Instant fix:**

```typescript
// Problem
fetch('/api/assessment/submit')  // Wrong path

// Fix: Check actual file structure
// src/app/api/assessment/submit/route.ts
fetch('/api/assessment/submit')  // Correct

// Debug: Log the full URL
const url = '/api/assessment/submit';
console.log('Calling:', url);
const response = await fetch(url);
console.log('Status:', response.status);
```

**Root causes:**

- Typo in URL
- API route file in wrong location
- Missing route.ts file
- Server not running

---

### Issue: "CORS error"

**What it means:** Browser blocking request due to security policy.

**Instant fix:**

```typescript
// Problem: Calling external API from client
fetch('https://external-api.com/data')  // CORS error

// Fix 1: Call from API route (server-side)
// src/app/api/external/route.ts
export async function GET() {
  const data = await fetch('https://external-api.com/data');
  return NextResponse.json(data);
}

// Then call your API route from client
fetch('/api/external')  // No CORS issue
```

**Root causes:**

- Calling external API from browser (use API route instead)
- External API doesn't allow your domain
- Missing CORS headers on your API

---

### Issue: "Module not found"

**What it means:** Import path is wrong or package not installed.

**Instant fix:**

```bash
# Problem
import { Button } from '@/components/Button';  # File doesn't exist

# Fix 1: Check file exists
ls src/components/Button.tsx

# Fix 2: Check import path
# If file is at src/components/ui/button.tsx
import { Button } from '@/components/ui/button';

# Fix 3: Install missing package
npm install package-name

# Fix 4: Restart TypeScript server
# Cmd + Shift + P → "TypeScript: Restart TS Server"
```

---

### Issue: Page shows blank/white screen

**What it means:** JavaScript error breaking the entire page.

**Instant fix:**

```bash
# Step 1: Open console - you'll see the error
# Step 2: Find the error in your code
# Step 3: Common causes:

# Cause 1: Missing return statement
export default function Page() {
  // Missing return!
}
# Fix: Add return
export default function Page() {
  return <div>Content</div>;
}

# Cause 2: Syntax error
<div className="flex>  # Missing closing quote
# Fix: Close the quote
<div className="flex">

# Cause 3: Undefined variable
<div>{nonExistentVariable}</div>
# Fix: Define the variable or use optional chaining
<div>{variable?.value}</div>
```

---

### Issue: Styles not applying

**What it means:** Tailwind classes not working or CSS not loading.

**Instant fix:**

```bash
# Step 1: Check class name is correct
<div className="bg-blue-500">  # Correct
<div className="background-blue">  # Wrong - not a Tailwind class

# Step 2: Check Tailwind is running
# Should see this in terminal:
# ✓ Compiled in XXXms

# Step 3: Hard refresh browser
# Cmd + Shift + R (Mac)
# Ctrl + Shift + R (Windows)

# Step 4: Check if class is being overridden
# Right-click element → Inspect
# Look at "Computed" tab to see actual styles applied

# Step 5: Restart dev server
# Ctrl+C, then npm run dev
```

---

### Issue: Authentication not working

**What it means:** User can't login or session not persisting.

**Instant fix:**

```typescript
// Step 1: Check Supabase env vars
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
// Should NOT be undefined

// Step 2: Check auth in Network tab
// Look for requests to supabase.co/auth/v1/token
// Status should be 200

// Step 3: Check cookies
// DevTools → Application → Cookies
// Should see supabase-auth-token

// Step 4: Test auth manually
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123'
});
console.log('Auth result:', { data, error });
```

**Root causes:**

- Missing/wrong Supabase env vars
- Supabase project paused
- Wrong email/password
- Email not confirmed
- RLS policies blocking access

---

### Issue: Data not loading from Supabase

**What it means:** Query returns empty or null.

**Instant fix:**

```typescript
// Step 1: Log the query result
const { data, error } = await supabase
  .from('courses')
  .select('*');

console.log('Query result:', { data, error });
// If error exists, read the message

// Step 2: Check data exists in Supabase dashboard
// Go to Supabase → Table Editor → courses
// Verify rows exist

// Step 3: Check RLS policies
// If data exists but query returns empty:
// - RLS is blocking you
// - Check if user is authenticated
// - Check RLS policies in Supabase

// Step 4: Test without RLS (temporarily)
// Supabase → Authentication → Policies
// Disable RLS on table, test query
// If works now → RLS policy is the issue
// Re-enable RLS and fix policy
```

---

### Issue: Slow page load

**What it means:** Page takes >3 seconds to load.

**Instant fix:**

```bash
# Step 1: Open Network tab, refresh page
# Sort by "Time" column
# Look for slow requests (>1s)

# Step 2: Common culprits:

# Large images
# Fix: Optimize images, use Next.js Image component
import Image from 'next/image';
<Image src="/large-image.jpg" width={800} height={600} alt="..." />

# Slow API calls
# Fix: Add loading states, optimize queries
const { data, isLoading } = useQuery('courses', fetchCourses);
if (isLoading) return <Spinner />;

# Too many API calls
# Fix: Combine into one call or use parallel fetching
const [courses, users] = await Promise.all([
  fetchCourses(),
  fetchUsers()
]);

# Large JavaScript bundles
# Fix: Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

---

## Advanced Debugging Techniques

### Technique 1: Binary Search Debugging

When you don't know what broke:

```bash
# Step 1: Find last working commit
git log --oneline -20

# Step 2: Checkout middle commit
git checkout abc123

# Step 3: Test - does it work?
# If yes → Bug is in recent half
# If no → Bug is in older half

# Step 4: Repeat until you find the exact commit
# This is called "git bisect" - automates binary search
git bisect start
git bisect bad  # Current commit is bad
git bisect good abc123  # This commit was good
# Git will checkout middle commit, you test, then:
git bisect good  # or git bisect bad
# Repeat until git finds the bad commit
```

### Technique 2: Rubber Duck Debugging

Explain the problem out loud (to a rubber duck, or AI):

```
"I'm trying to fetch courses from Supabase.
The query is: supabase.from('courses').select('*')
The result is: { data: [], error: null }
But I know there are 5 courses in the database.
The user is logged in because I see the auth token.
Wait... am I querying the right database?
Let me check the Supabase URL..."
```

Often, explaining the problem reveals the solution.

### Technique 3: Isolation Testing

Remove everything except the broken part:

```typescript
// Original complex component (broken)
export default function ComplexPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // ... 100 lines of code
}

// Simplified version (test if basic fetch works)
export default function SimplePage() {
  useEffect(() => {
    fetch('/api/courses')
      .then(r => r.json())
      .then(data => console.log('Data:', data));
  }, []);
  
  return <div>Check console</div>;
}

// If this works → Problem is in your complex logic
// If this fails → Problem is in the API
```

### Technique 4: Diff Debugging

Compare working vs broken:

```bash
# Compare current file to last working version
git diff HEAD~5 -- src/app/assessment/page.tsx

# Look for:
# - Removed lines (red) that might be important
# - Added lines (green) that might break things
# - Changed logic that might cause issues
```

### Technique 5: Console.log Archaeology

Strategic logging to trace execution:

```typescript
console.log('1. Component mounted');

useEffect(() => {
  console.log('2. Effect running');
  
  fetchData()
    .then(data => {
      console.log('3. Data received:', data);
      setData(data);
      console.log('4. State updated');
    })
    .catch(error => {
      console.log('ERROR:', error);
    });
}, []);

console.log('5. Rendering with data:', data);

// If you see 1, 2, 3, but not 4 → setData is the issue
// If you see 1, 2, ERROR → fetchData is the issue
// If you only see 1, 5 → useEffect not running
```

---

## Debugging Checklist (Print This)

Before asking for help, verify:

- [ ] **Console is open** - Checked for errors
- [ ] **Error message read** - Fully, not just skimmed
- [ ] **Recent changes reviewed** - `git diff` checked
- [ ] **Network tab checked** - API calls inspected
- [ ] **Dev server restarted** - Fresh start
- [ ] **Hard refresh done** - Cmd+Shift+R
- [ ] **Env vars verified** - Not undefined
- [ ] **Typos ruled out** - Double-checked spelling
- [ ] **File paths correct** - Imports match file locations
- [ ] **Dependencies installed** - `npm install` run
- [ ] **Supabase dashboard checked** - Data exists
- [ ] **RLS policies considered** - Not blocking access
- [ ] **Auth state verified** - User logged in if needed
- [ ] **Simplified version tested** - Isolated the issue
- [ ] **Working version compared** - Diff reviewed

---

## When to Ask for Help

### Ask AFTER you've

1. Tried the 5-minute debug protocol
2. Read the full error message
3. Checked the debugging checklist
4. Spent 15-30 minutes investigating

### Provide

1. **Full error message** (copy-paste, not screenshot)
2. **Relevant code** (the part that's broken)
3. **What you tried** (list your debugging steps)
4. **Expected vs actual** (what should happen vs what happens)

### Good Help Request

```
I'm getting this error when submitting the assessment:

Error: Cannot read property 'score' of undefined
  at calculateResults (scoring.ts:45)
  
Here's the code at line 45:
```typescript
const total = results.score + previousScore;
```

I've checked:

- results is defined (logged it, shows data)
- previousScore is defined (shows 0)
- But results.score is undefined

Expected: results should have a score property
Actual: results is { answers: [...] } - no score property

I think the issue is in how I'm calling calculateResults, but not sure why score is missing.

```

### Bad Help Request:

```

It's broken. Help!

```

---

## Production Debugging (Live Site Issues)

### Step 1: Check Vercel Logs

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# View logs
vercel logs trajectorygroup.org
```

### Step 2: Check Supabase Logs

```bash
# Supabase Dashboard → Logs
# Filter by:
# - Time range (last hour)
# - Log level (errors only)
# - Service (API, Auth, etc.)
```

### Step 3: Reproduce Locally

```bash
# Pull latest production code
git checkout main
git pull origin main

# Use production env vars (copy from Vercel)
# Test locally with production data
npm run build
npm run start  # Production mode
```

### Step 4: Hotfix Process

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-issue

# Make minimal fix
# Test thoroughly
# Commit and push
git commit -m "fix: resolve critical production issue"
git push origin hotfix/critical-issue

# Create PR targeting main
# Get immediate review
# Merge and deploy

# Merge back to develop
git checkout develop
git merge main
git push origin develop
```

---

## Debugging Tools Cheatsheet

### Browser DevTools

| Tool | Shortcut | Use For |
|------|----------|---------|
| Console | Cmd+Opt+J | Errors, logs |
| Network | Cmd+Opt+J → Network tab | API calls |
| Elements | Cmd+Opt+C | Inspect HTML/CSS |
| Application | Cmd+Opt+J → Application | Cookies, storage |
| Sources | Cmd+Opt+J → Sources | Breakpoints |

### Git Commands

| Command | Use For |
|---------|---------|
| `git diff` | See what changed |
| `git log --oneline -10` | Recent commits |
| `git stash` | Temporarily undo changes |
| `git bisect` | Find breaking commit |
| `git blame file.ts` | Who changed this line |

### Next.js Commands

| Command | Use For |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Test production build |
| `npm run lint` | Find code issues |
| `npm run typecheck` | Find type errors |

### Supabase Commands

| Command | Use For |
|---------|---------|
| `supabase status` | Check connection |
| `supabase db pull` | Get latest schema |
| `supabase db push` | Apply migrations |
| `supabase functions list` | List edge functions |

---

## The Debugging Mindset

### Good Debugger Thinks

- "What changed recently?"
- "What does the error actually say?"
- "Can I reproduce this consistently?"
- "What's the simplest test I can run?"
- "What assumptions am I making?"

### Bad Debugger Thinks

- "It's probably a bug in the framework"
- "It worked before, I didn't change anything"
- "I'll just try random things until it works"
- "This error message doesn't make sense" (it does, read it again)
- "I'll ask for help without investigating"

---

## Remember

> "Debugging is like being a detective in a crime movie where you are also the murderer."

Every bug you fix makes you a better developer. Every error message teaches you something new. Every debugging session builds your intuition.

**Debug systematically. Fix confidently. Ship fearlessly.**

🔍 **Happy Debugging!**
