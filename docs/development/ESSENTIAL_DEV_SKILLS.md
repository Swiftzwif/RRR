# Essential Developer Skills for Trajectory Project

> **For New Developers:** These are the critical skills you MUST master to work effectively on trajectorygroup.org. Each skill has a dedicated guide with examples specific to this project.

## The 7 Core Skills (Master These First)

### 1. Git Workflow & Version Control ✅
**Status:** Complete guide in `.cursorrules`
**Why Critical:** Every code change goes through Git. Mess this up and you lose work or break production.
**Time to Learn:** 2-3 days of practice
**Mastery Indicator:** You can create branches, commit, handle conflicts, and create PRs without help.

**Quick Reference:**
- See `.cursorrules` for complete Git workflow
- Practice daily: `git status`, `git diff`, `git log`
- Never commit directly to main/develop

---

### 2. Browser DevTools & Debugging 🔧
**Why Critical:** 80% of bugs are found in the browser console. If you can't debug, you can't develop.
**Time to Learn:** 1 week of daily use
**Mastery Indicator:** You can inspect elements, read console errors, debug network requests, and use breakpoints.

#### Essential DevTools Skills

**Console Tab:**
```javascript
// See all errors and warnings
// Red = errors (MUST fix)
// Yellow = warnings (should fix)
// Blue = info (nice to know)

// Common errors you'll see:
// - "Cannot read property 'x' of undefined" → Check if object exists
// - "404 Not Found" → API endpoint wrong or server down
// - "CORS error" → Backend needs CORS headers
// - "Hydration mismatch" → Server/client rendering different HTML
```

**Network Tab:**
```
Filter by:
- XHR/Fetch → API calls
- JS → JavaScript files
- CSS → Stylesheets
- Img → Images

Check:
- Status codes (200 = good, 404 = not found, 500 = server error)
- Response time (>3s = slow)
- Request payload (what you sent)
- Response data (what you got back)
```

**Elements Tab:**
```
- Inspect any element (right-click → Inspect)
- See computed styles (actual CSS applied)
- Edit HTML/CSS live (test changes before coding)
- Check responsive layout (toggle device toolbar)
```

**Application Tab:**
```
- Check cookies (authentication tokens)
- Check localStorage (saved data)
- Check session storage (temporary data)
- Clear storage (fix weird bugs)
```

#### Debugging Workflow for Trajectory

**When something doesn't work:**

1. **Open Console** (Cmd + Option + J on Mac)
   - Look for red errors
   - Read the error message
   - Click the file link to see where error occurred

2. **Check Network Tab**
   - Did API call succeed? (200 status)
   - Is response data correct?
   - Is request being sent at all?

3. **Inspect Element**
   - Is element rendering?
   - Are styles applied correctly?
   - Is element visible (check display, opacity, z-index)?

4. **Check Application Storage**
   - Is user logged in? (check auth token)
   - Is data cached? (check localStorage)

**Common Trajectory Issues:**

| Symptom | Where to Look | Common Cause |
|---------|---------------|--------------|
| Login not working | Network tab | API endpoint wrong or CORS issue |
| Styles look wrong | Elements tab | CSS class not applied or Tailwind not compiled |
| Data not loading | Console + Network | API error or missing auth token |
| Page blank | Console | JavaScript error breaking render |
| Slow page load | Network tab | Large images or slow API calls |

---

### 3. Environment Variables & Configuration 🔐
**Why Critical:** Your app needs API keys, database URLs, etc. Get this wrong and nothing works.
**Time to Learn:** 1 day
**Mastery Indicator:** You understand .env files, never commit secrets, and can debug env var issues.

#### Trajectory Environment Variables

**Location:** `apps/trajectory2/.env.local` (NEVER commit this file!)

**Required Variables:**

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend (Email)
RESEND_API_KEY=re_your-key-here

# Square (Payments)
SQUARE_ACCESS_TOKEN=your-square-token
SQUARE_LOCATION_ID=your-location-id
SQUARE_ENVIRONMENT=sandbox  # or 'production'

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3003  # or https://trajectorygroup.org
```

**Rules:**

1. **NEXT_PUBLIC_* variables** → Available in browser (safe for public)
2. **Variables without NEXT_PUBLIC_** → Server-only (keep secret)
3. **Never commit .env.local** → It's in .gitignore for a reason
4. **Use env.template** → Share variable names, not values

**How to Use in Code:**

```typescript
// Client-side (browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Server-side only (API routes, server components)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Always check if variable exists
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
```

**Debugging Env Vars:**

```bash
# Check if .env.local exists
ls -la apps/trajectory2/.env.local

# Verify variables are loaded (add to page temporarily)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

# Restart dev server after changing .env.local
# Ctrl+C to stop, then npm run dev again
```

**Production (Vercel):**

1. Go to Vercel dashboard
2. Select trajectory2 project
3. Settings → Environment Variables
4. Add each variable (same names as .env.local)
5. Redeploy for changes to take effect

---

### 4. Next.js App Router & File-Based Routing 🗺️
**Why Critical:** Trajectory uses Next.js 15 App Router. Understanding routing is fundamental.
**Time to Learn:** 3-4 days
**Mastery Indicator:** You can create pages, layouts, and understand server vs client components.

#### File Structure = URL Structure

```
src/app/
├── page.tsx              → trajectorygroup.org/
├── layout.tsx            → Wraps all pages
├── assessment/
│   └── page.tsx          → trajectorygroup.org/assessment
├── login/
│   └── page.tsx          → trajectorygroup.org/login
├── course/
│   └── page.tsx          → trajectorygroup.org/course
└── api/
    └── webhook/
        └── route.ts      → trajectorygroup.org/api/webhook
```

**Key Concepts:**

**1. page.tsx = Route**
```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Trajectory</div>;
}
// This creates trajectorygroup.org/about
```

**2. layout.tsx = Shared Wrapper**
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />  {/* Shows on all pages */}
        {children}      {/* Page content goes here */}
        <Footer />      {/* Shows on all pages */}
      </body>
    </html>
  );
}
```

**3. Server Components (Default)**
```typescript
// Runs on server, can access database directly
export default async function CoursePage() {
  const courses = await supabase.from('courses').select('*');
  return <div>{courses.map(...)}</div>;
}
```

**4. Client Components (When Needed)**
```typescript
'use client';  // Add this at top for interactivity

import { useState } from 'react';

export default function AssessmentPage() {
  const [answer, setAnswer] = useState('');
  // Can use hooks, event handlers, browser APIs
}
```

**When to Use Client Components:**
- Need useState, useEffect, or other hooks
- Need event handlers (onClick, onChange)
- Need browser APIs (window, localStorage)
- Need interactivity

**When to Use Server Components:**
- Fetching data from database
- No interactivity needed
- Want better performance
- Need to keep secrets server-side

---

### 5. TypeScript Basics 📘
**Why Critical:** Trajectory is 100% TypeScript. It catches bugs before runtime.
**Time to Learn:** 1 week
**Mastery Indicator:** You can read type errors, define interfaces, and use types correctly.

#### TypeScript Essentials for Trajectory

**1. Basic Types**
```typescript
// Primitives
const name: string = "John";
const age: number = 30;
const isActive: boolean = true;

// Arrays
const scores: number[] = [1, 2, 3];
const names: string[] = ["Alice", "Bob"];

// Objects
const user: { name: string; age: number } = {
  name: "John",
  age: 30
};
```

**2. Interfaces (Define Object Shapes)**
```typescript
// Define once, use everywhere
interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
}

// Use in function
function greetUser(user: User) {
  console.log(`Hello, ${user.name}`);
}

// Use in component
function UserProfile({ user }: { user: User }) {
  return <div>{user.name}</div>;
}
```

**3. Trajectory Database Types**
```typescript
// Auto-generated from Supabase
import { Database } from '@/lib/supabase-types';

type AssessmentResult = Database['public']['Tables']['assessment_results']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

// Use in components
function ResultCard({ result }: { result: AssessmentResult }) {
  return <div>{result.score}</div>;
}
```

**4. Common Type Errors & Fixes**

**Error:** `Property 'x' does not exist on type 'y'`
```typescript
// Problem
const user = { name: "John" };
console.log(user.age);  // Error: age doesn't exist

// Fix: Add the property or make it optional
interface User {
  name: string;
  age?: number;  // ? means optional
}
```

**Error:** `Type 'null' is not assignable to type 'string'`
```typescript
// Problem
const name: string = null;  // Error

// Fix: Allow null
const name: string | null = null;  // OK
```

**Error:** `Argument of type 'string' is not assignable to parameter of type 'number'`
```typescript
// Problem
function double(x: number) { return x * 2; }
double("5");  // Error: string not number

// Fix: Convert or change type
double(Number("5"));  // OK
```

**5. Type Inference (Let TypeScript Figure It Out)**
```typescript
// TypeScript knows these types automatically
const name = "John";  // string
const age = 30;       // number
const scores = [1, 2, 3];  // number[]

// No need to write:
const name: string = "John";  // Redundant
```

**6. Trajectory-Specific Patterns**

**API Route Handler:**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true });
}
```

**Component Props:**
```typescript
interface AssessmentStepperProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
}

export function AssessmentStepper({ 
  currentStep, 
  totalSteps, 
  onNext 
}: AssessmentStepperProps) {
  // ...
}
```

**React Hooks:**
```typescript
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
```

---

### 6. Supabase Database & Auth 🗄️
**Why Critical:** Supabase is your backend. All data and authentication goes through it.
**Time to Learn:** 1 week
**Mastery Indicator:** You can query data, insert records, and understand RLS policies.

#### Supabase Essentials

**1. Database Structure (Trajectory)**

```
Tables:
- users → User accounts (managed by Supabase Auth)
- assessment_results → Completed assessments
- courses → Course content
- user_progress → Course progress tracking
- payments → Payment records (Square integration)
```

**2. Querying Data**

```typescript
import { createClient } from '@/utils/supabase/server';

// Get all courses
const supabase = createClient();
const { data: courses, error } = await supabase
  .from('courses')
  .select('*');

// Get specific user's results
const { data: results } = await supabase
  .from('assessment_results')
  .select('*')
  .eq('user_id', userId);

// Insert new assessment result
const { data, error } = await supabase
  .from('assessment_results')
  .insert({
    user_id: userId,
    score: 85,
    completed_at: new Date().toISOString()
  });

// Update user progress
const { error } = await supabase
  .from('user_progress')
  .update({ current_lesson: 5 })
  .eq('user_id', userId);
```

**3. Authentication**

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

// Sign out
await supabase.auth.signOut();

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

**4. Row Level Security (RLS)**

Trajectory uses RLS to protect data:

```sql
-- Users can only see their own assessment results
CREATE POLICY "Users can view own results"
ON assessment_results
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own results
CREATE POLICY "Users can insert own results"
ON assessment_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**What This Means:**
- Users automatically can't see other users' data
- Queries are filtered by user_id automatically
- You don't need to add WHERE clauses for security

**5. Common Patterns in Trajectory**

**Server Component (Direct Query):**
```typescript
// src/app/course/page.tsx
import { createClient } from '@/utils/supabase/server';

export default async function CoursePage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*');
  
  return <div>{courses.map(...)}</div>;
}
```

**Client Component (API Route):**
```typescript
// src/app/assessment/page.tsx
'use client';

async function submitAssessment(answers: any) {
  const response = await fetch('/api/assessment/submit', {
    method: 'POST',
    body: JSON.stringify(answers)
  });
  return response.json();
}
```

**API Route (Server-Side Query):**
```typescript
// src/app/api/assessment/submit/route.ts
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('assessment_results')
    .insert(body);
  
  return NextResponse.json({ data, error });
}
```

---

### 7. Tailwind CSS & Component Styling 🎨
**Why Critical:** Trajectory uses Tailwind for all styling. No separate CSS files.
**Time to Learn:** 3-4 days
**Mastery Indicator:** You can build layouts, make responsive designs, and use the design system.

#### Tailwind Essentials

**1. Utility-First Approach**

Instead of writing CSS:
```css
/* Old way - separate CSS file */
.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

Use Tailwind classes:
```tsx
{/* New way - classes in JSX */}
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

**2. Common Patterns**

**Layout:**
```tsx
{/* Flexbox */}
<div className="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>

{/* Grid */}
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

{/* Centering */}
<div className="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>
```

**Spacing:**
```tsx
{/* Padding */}
<div className="p-4">Padding all sides</div>
<div className="px-4 py-2">Padding x and y</div>

{/* Margin */}
<div className="m-4">Margin all sides</div>
<div className="mt-8">Margin top only</div>

{/* Gap (for flex/grid) */}
<div className="flex gap-4">...</div>
```

**Typography:**
```tsx
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-gray-600">Body text</p>
<span className="text-sm italic">Small text</span>
```

**Colors (Trajectory Theme):**
```tsx
{/* Primary (Canyon theme) */}
<div className="bg-orange-600 text-white">Primary</div>

{/* Neutral */}
<div className="bg-gray-100 text-gray-900">Light</div>
<div className="bg-gray-900 text-white">Dark</div>

{/* Accent */}
<div className="bg-amber-500">Accent</div>
```

**3. Responsive Design**

```tsx
{/* Mobile-first approach */}
<div className="
  text-sm         {/* Mobile: small text */}
  md:text-base    {/* Tablet: normal text */}
  lg:text-lg      {/* Desktop: large text */}
">
  Responsive text
</div>

{/* Breakpoints */}
{/* sm: 640px */}
{/* md: 768px */}
{/* lg: 1024px */}
{/* xl: 1280px */}

{/* Example: Responsive grid */}
<div className="
  grid 
  grid-cols-1      {/* Mobile: 1 column */}
  md:grid-cols-2   {/* Tablet: 2 columns */}
  lg:grid-cols-3   {/* Desktop: 3 columns */}
  gap-4
">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

**4. Hover/Focus States**

```tsx
<button className="
  bg-blue-500 
  hover:bg-blue-600      {/* Darker on hover */}
  focus:ring-2           {/* Ring on focus */}
  focus:ring-blue-300    {/* Ring color */}
  transition-colors      {/* Smooth transition */}
">
  Interactive button
</button>
```

**5. Trajectory Design System**

**Buttons:**
```tsx
{/* Primary */}
<button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold">
  Primary Action
</button>

{/* Secondary */}
<button className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold">
  Secondary Action
</button>
```

**Cards:**
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-xl font-bold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

**Forms:**
```tsx
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-2">
      Email
    </label>
    <input 
      type="email"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
    />
  </div>
</div>
```

---

## Learning Path (Recommended Order)

### Week 1: Foundation
- [ ] Day 1-2: Git workflow (practice branching, committing)
- [ ] Day 3-4: Browser DevTools (inspect every page, read console)
- [ ] Day 5-7: Environment variables & Next.js routing

### Week 2: Core Skills
- [ ] Day 1-3: TypeScript basics (read existing code, fix type errors)
- [ ] Day 4-5: Supabase queries (read data, insert data)
- [ ] Day 6-7: Tailwind CSS (build simple components)

### Week 3: Integration
- [ ] Day 1-3: Build a simple feature end-to-end
- [ ] Day 4-5: Debug issues using all skills
- [ ] Day 6-7: Review and practice

## Practice Projects (Hands-On Learning)

### Project 1: Add a New Page
**Skills:** Next.js routing, Tailwind CSS
**Task:** Create `/about` page with company info
**Time:** 2 hours

### Project 2: Display Database Data
**Skills:** Supabase, TypeScript, Server Components
**Task:** Show list of courses from database
**Time:** 3 hours

### Project 3: Build a Form
**Skills:** Client Components, API routes, Supabase
**Task:** Create contact form that saves to database
**Time:** 4 hours

### Project 4: Add Authentication Gate
**Skills:** Supabase Auth, Middleware, Protected Routes
**Task:** Make a page require login to access
**Time:** 3 hours

## Resources

### Official Docs (Bookmark These)
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs

### Trajectory-Specific Docs
- Git Workflow: See `.cursorrules`
- Premium System: `/docs/features/PREMIUM_USER_SYSTEM.md`
- Deployment: `/docs/deployment/VERCEL_DEPLOYMENT_CHECKLIST.md`
- Design System: `/docs/development/UI_DESIGN_SYSTEM.md`

### Quick Reference Guides
- Git Cheatsheet: `/docs/development/GIT_CHEATSHEET.md`
- Quick Test Guide: `/docs/development/QUICK_TEST_GUIDE.md`
- Component Guidelines: `/docs/development/COMPONENT_GUIDELINES.md`

## Measuring Your Progress

### Beginner → Intermediate
- [ ] Can create a new page without help
- [ ] Can query Supabase and display data
- [ ] Can style components with Tailwind
- [ ] Can read and fix TypeScript errors
- [ ] Can use Git without breaking things
- [ ] Can debug using browser DevTools

### Intermediate → Advanced
- [ ] Can build full features end-to-end
- [ ] Can handle merge conflicts
- [ ] Can optimize database queries
- [ ] Can write custom TypeScript types
- [ ] Can debug production issues
- [ ] Can review others' code

### Advanced → Expert
- [ ] Can architect new features
- [ ] Can optimize performance
- [ ] Can mentor other developers
- [ ] Can handle complex Git scenarios
- [ ] Can write database migrations
- [ ] Can deploy to production confidently

## Getting Help

### When Stuck:
1. **Check console** - 80% of answers are there
2. **Read error message** - It usually tells you what's wrong
3. **Search docs** - Official docs are your best friend
4. **Check Trajectory docs** - Project-specific guidance
5. **Ask AI assistant** - Provide full error message and context

### Good Questions vs Bad Questions:

**Bad:**
- "It doesn't work"
- "I'm getting an error"
- "How do I do X?"

**Good:**
- "I'm getting 'Cannot read property X of undefined' on line 45 of AssessmentPage.tsx. Here's the code: [paste code]. What does this mean?"
- "My Supabase query returns empty array but data exists in database. Here's my query: [paste query]. What am I missing?"
- "I want to add a new page at /resources. I created src/app/resources/page.tsx but getting 404. What did I forget?"

---

## Next Steps

1. **Read this guide** - Understand the 7 core skills
2. **Practice daily** - Use each skill every day
3. **Build something** - Start with practice projects
4. **Review code** - Read existing Trajectory code
5. **Ask questions** - When stuck, ask specific questions

Remember: Everyone was a beginner once. These skills take time to master, but with daily practice, you'll be proficient in 2-3 weeks.

**You got this! 🚀**

