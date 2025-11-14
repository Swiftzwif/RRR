# CLAUDE.md - AI Assistant Guide for Trajectory 2.0

> **Purpose**: This document provides comprehensive guidance for AI assistants (like Claude) working on the Trajectory 2.0 codebase. It complements existing documentation with AI-specific context, patterns, and best practices.

**Last Updated**: 2025-11-14
**Project**: Trajectory 2.0 - Life transformation platform with assessment, coaching, and digital courses

---

## 📋 Quick Reference

### Essential Commands
```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking

# Workspace management
npm run install:all      # Install all workspace dependencies
```

### Key File Paths
- **Main App**: `/apps/trajectory2/`
- **Components**: `/apps/trajectory2/src/components/`
- **API Routes**: `/apps/trajectory2/src/app/api/`
- **Config**: `/apps/trajectory2/src/lib/config.ts`
- **Environment**: `/apps/trajectory2/.env.example`

### Critical Documentation
- `COMPONENT_GUIDELINES.md` - Design system and component patterns (READ THIS for UI work)
- `CONTRIBUTING.md` - Git workflow and contribution guidelines
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `REQUIREMENTS.md` - Project requirements and specifications

---

## 🎯 Project Context

### What is Trajectory 2.0?
A life transformation platform that helps users identify their current state (Drifter/Balancer/Architect) through assessments and provides personalized guidance, digital courses, and coaching to help them reach their potential.

### Core Features
1. **Assessment System**: Interactive questionnaire scoring users across 7 life domains
2. **Results & Email**: Personalized results with email delivery
3. **Digital Course**: Hosted on Thinkific (formerly Square payments)
4. **Giveaway System**: Grand opening giveaway with Instagram integration
5. **Raffle System**: Paid raffle entries
6. **Experience Modules**: 7-day and 31-day guided experiences
7. **Admin Dashboards**: Giveaway, payment, and raffle management

### Technology Stack
- **Framework**: Next.js 15.5.4 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + Framer Motion + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Email**: Resend + React Email
- **Forms**: React Hook Form + Zod validation
- **Payment**: Thinkific (Square integration disabled but preserved)
- **Monitoring**: Sentry
- **Deployment**: Likely Vercel (based on environment config)

---

## 🏗️ Architecture Overview

### Monorepo Structure
```
RRR/
├── apps/
│   └── trajectory2/           # Main Next.js application
│       ├── src/
│       │   ├── app/           # Next.js App Router (pages + API routes)
│       │   ├── components/    # 67 React components
│       │   ├── lib/           # Core utilities (config, scoring, email)
│       │   ├── utils/         # Supabase clients and middleware
│       │   └── emails/        # React Email templates
│       ├── supabase/
│       │   └── migrations/    # Database migrations
│       └── public/
│           └── questions.json # Assessment questions
├── packages/                  # Shared packages (ui, lib, theme, content)
└── docs/                      # Project documentation
```

### Routing Pattern (App Router)
```
/app/
├── page.tsx                   # Homepage (2000+ lines, animation-heavy)
├── assessment/page.tsx        # Assessment flow
├── results/page.tsx           # Assessment results
├── products/                  # Course and coaching pages
├── giveaway/page.tsx          # Giveaway entry
├── raffle/page.tsx            # Raffle entry
├── experience/                # 7-day/31-day modules
├── login/                     # Authentication
├── account/                   # User account management
├── admin/                     # Admin dashboards
└── api/                       # API endpoints
    ├── auth/                  # Auth callbacks, verification, password reset
    ├── giveaway/              # Giveaway entry and stats
    ├── payments/              # Payment processing (Square disabled, raffle active)
    ├── admin/                 # Admin operations
    ├── webhooks/              # Square webhooks
    └── cron/                  # Scheduled tasks
```

### Data Flow Examples

**Assessment Flow**:
```
User → /assessment → AssessmentStepper component
→ answers questions → scoreDomains() calculates results
→ save to Supabase assessments table
→ send email via Resend
→ store in sessionStorage
→ redirect to /results
```

**Authentication Flow**:
```
Google OAuth → Supabase Auth → /api/auth/callback
→ create/update user → send welcome email → redirect to app
```

**Giveaway Entry Flow**:
```
User submits form → /api/giveaway/entry
→ validate + rate limit check (Vercel KV)
→ save to giveaway_entries table
→ subscribe to ConvertKit
→ send confirmation email
```

---

## 🎨 Design System: "Inspiring Sky Authority"

### CRITICAL: Always Follow Design Guidelines
Before making ANY UI changes, read `COMPONENT_GUIDELINES.md`. The design system is called "Inspiring Sky Authority" and has strict patterns.

### Color Palette
```typescript
// Primary (Sky colors)
"text-sky-800"     // Dark text
"text-sky-600"     // Medium text
"bg-sky-50"        // Light backgrounds
"border-sky-200"   // Borders

// Accent (Canyon/Sunset)
"text-sunset"      // Warm highlights
"bg-sunset/10"     // Subtle accents

// Status
"text-success"     // Success states
"text-warn"        // Warnings
"text-danger"      // Errors
```

### Strata System Classes
Always use these design system classes:
```tsx
<div className="strata-card p-6">        {/* Cards */}
<button className="strata-button">       {/* Buttons */}
<input className="strata-input">         {/* Inputs */}
<div className="strata-divider">         {/* Dividers */}
<div className="strata-meter">           {/* Progress bars */}
<h1 className="strata-text font-display"> {/* Text effects */}
```

### Component Structure Pattern
```tsx
'use client'; // Only if using client-side features

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define variants using CVA
const componentVariants = cva(
  "strata-card transition-colors focus-visible:outline-none focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "bg-white border-sky-200",
        primary: "bg-sky-50 border-sky-300",
      },
      size: { sm: "p-4", md: "p-6", lg: "p-8" },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

// Props with TypeScript
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  children: React.ReactNode;
  className?: string;
}

// Component with forwardRef
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = "Component";

export { Component, componentVariants };
```

---

## 🔐 Authentication & Security

### Supabase Client Usage
```typescript
// Client components (browser)
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

// Server components
import { createClient } from '@/utils/supabase/server';
const supabase = await createClient();

// Middleware
import { updateSession } from '@/utils/supabase/middleware';
// See /middleware.ts for implementation
```

### Row Level Security (RLS)
- **ALWAYS** enabled on all tables
- Users can only read/write their own data
- Use service role key only in API routes for admin operations

### Environment Variables
All secrets in `.env.local` (never committed). See `.env.example` for template.

**Critical Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `RESEND_API_KEY` (email)
- `VERCEL_KV_REST_API_URL` / `VERCEL_KV_REST_API_TOKEN` (rate limiting)
- Square variables (currently disabled but preserved)

---

## 📦 Database Schema

### Key Tables

**assessments**:
```sql
id (UUID), user_id (FK to auth.users), answers (JSONB),
domain_scores (JSONB), avatar (TEXT), score (INTEGER),
email (TEXT), created_at, updated_at
```
- Stores user assessment responses and calculated scores
- RLS: Users can read/write their own assessments

**giveaway_entries**:
```sql
id, giveaway_id, email, name, first_name, last_name,
entry_number, liked_post, shared_post, tagged_friend,
newsletter_subscribed, convertkit_subscriber_id, verified
```

**giveaway_config**:
```sql
id, name, tagline, status, start_date, end_date, prizes (JSONB)
```

**Migrations**: Located in `/apps/trajectory2/supabase/migrations/`
- Always create new migrations, never edit existing ones
- Use Supabase CLI for generating migrations

---

## 🔧 Common Development Patterns

### API Route Pattern
```typescript
// /app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod validation schema
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate
    const body = await request.json();
    const validated = schema.parse(body);

    // Business logic
    // ...

    return NextResponse.json({
      success: true,
      message: "Operation successful",
      data: result
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Form Pattern (React Hook Form + Zod)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name required'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} className="strata-input" />
      {errors.email && <span className="text-danger">{errors.email.message}</span>}
    </form>
  );
}
```

### Email Sending Pattern
```typescript
import { sendAssessmentCompleteEmail } from '@/lib/email';

await sendAssessmentCompleteEmail({
  to: user.email,
  name: user.name,
  avatar: 'architect',
  score: 85,
  domainScores: { /* ... */ }
});
```

### Rate Limiting Pattern
```typescript
import { rateLimit } from '@/lib/rate-limit';

// In API route
const identifier = `giveaway-entry:${email}`;
const { success, limit, remaining, reset } = await rateLimit(identifier, {
  limit: 5,
  window: '15m'
});

if (!success) {
  return NextResponse.json(
    { error: 'Too many requests', reset },
    { status: 429 }
  );
}
```

---

## 🎯 AI Assistant Best Practices

### Before Starting Any Task

1. **Read Relevant Documentation**:
   - `COMPONENT_GUIDELINES.md` for UI work
   - `CONTRIBUTING.md` for git workflow
   - `DEPLOYMENT_GUIDE.md` for deployment tasks

2. **Check Existing Implementations**:
   - Search for similar components/features first
   - Maintain consistency with existing patterns

3. **Understand the Context**:
   - What user problem does this solve?
   - How does it fit into the broader product?

### Code Changes

**DO**:
- ✅ Use existing design system classes (`strata-*`)
- ✅ Follow TypeScript strictly (avoid `any`)
- ✅ Validate all inputs with Zod
- ✅ Handle errors gracefully with user-friendly messages
- ✅ Use Supabase RLS for data security
- ✅ Write accessible components (ARIA labels, keyboard navigation)
- ✅ Test responsive design (mobile-first)
- ✅ Use React Hook Form for forms
- ✅ Leverage existing utilities in `/lib/` and `/utils/`

**DON'T**:
- ❌ Create new colors outside the design system
- ❌ Skip form validation
- ❌ Use `console.log` in production code
- ❌ Commit secrets or API keys
- ❌ Bypass RLS with service role key in client code
- ❌ Create inline styles (use Tailwind)
- ❌ Import entire libraries (tree-shake with specific imports)
- ❌ Commit directly to `master` or `develop`

### File Operations

**Reading Files**:
```typescript
// Component imports
import { Component } from '@/components/ui/Component';

// Lib imports (utilities)
import { config } from '@/lib/config';
import { scoreDomains } from '@/lib/scoring';

// Supabase clients
import { createClient } from '@/utils/supabase/client'; // Browser
import { createClient } from '@/utils/supabase/server'; // Server
```

**Creating New Files**:
- Components: `/src/components/[category]/ComponentName.tsx`
- API routes: `/src/app/api/[resource]/route.ts`
- Utilities: `/src/lib/[utility-name].ts`
- Types: Define inline or in `/src/lib/types.ts` if shared

### Testing Considerations

**Current State**:
- Playwright for E2E testing
- Minimal unit test coverage
- ESLint and TypeScript in CI

**When Making Changes**:
- Ensure TypeScript compiles (`npm run typecheck`)
- Run ESLint (`npm run lint`)
- Test locally (`npm run dev`)
- Verify build succeeds (`npm run build`)

---

## 🚨 Common Gotchas & Important Notes

### 1. Square Payments Are Disabled
- Square payment integration exists but is **intentionally disabled**
- Product now uses Thinkific for course delivery
- Square code preserved for potential future re-enablement
- See `/src/app/api/payments/square/create/route.ts` for implementation

### 2. Homepage is Animation-Heavy
- `/app/page.tsx` is 2000+ lines with extensive Framer Motion animations
- Changes to homepage require careful performance testing
- Use `will-change` sparingly to avoid performance issues

### 3. Assessment Questions in JSON
- Questions stored in `/public/questions.json`
- Scoring logic in `/src/lib/scoring.ts`
- 7 domains: Purpose, Identity, Relationships, Health, Wealth, Mastery, Environment

### 4. Environment-Specific Behavior
- Auth redirects differ based on `NEXT_PUBLIC_APP_URL`
- Square has separate sandbox/production configs
- Always use environment variables, never hardcode

### 5. Email Templates
- React Email components in `/src/emails/`
- Must be tested in email clients (not just browser)
- Dark theme with gold accents (matches brand)

### 6. Rate Limiting
- Uses Vercel KV (Redis-like store)
- Configured per-endpoint (see `/lib/rate-limit.ts`)
- Returns reset timestamp for user feedback

### 7. Middleware Runs on All Routes
- `/middleware.ts` updates Supabase session on every request
- Be mindful of performance implications
- Auth state is always fresh

### 8. Recent Focus: Accessibility
- Multiple recent commits improving text visibility and contrast
- Always check color contrast (WCAG AA minimum)
- Test with screen readers when possible

### 9. Social Proof Feature
- "Fake count" feature for giveaway/raffle participants
- Increments count for social proof effect
- See `LiveParticipantFeed.tsx` for implementation

### 10. Admin Dashboards
- Located in `/app/admin/`
- Require authentication (check in component)
- Real-time data from Supabase

---

## 🔄 Git Workflow

### Branch Strategy
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat(scope): description of change"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Message Format
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`

**Examples**:
```
feat(auth): add Google OAuth integration
fix(payments): resolve webhook validation error
docs(readme): update installation instructions
style(ui): improve email input text visibility
```

### PR Process
1. Ensure branch is up to date with `develop`
2. Run tests locally (`npm run build`, `npm run lint`, `npm run typecheck`)
3. Create PR with clear description
4. Link related issues
5. Request review
6. Address feedback
7. Squash and merge to `develop`

### Merging Strategy
- **Feature → Develop**: Squash and merge (clean history)
- **Develop → Master**: Create merge commit (preserve history)
- **Hotfix → Master**: Create merge commit, then merge back to develop

---

## 📊 Key Metrics & Analytics

### Monitoring
- **Sentry**: Error tracking and performance monitoring
- Setup in `sentry.client.config.ts` and `sentry.server.config.ts`
- Automatic error capture with context

### Optional Analytics
- Google Analytics: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- PostHog: `NEXT_PUBLIC_POSTHOG_KEY` (see `.env.example`)

---

## 🚀 Deployment

### CI/CD Pipeline
GitHub Actions runs on every PR and push to `develop`/`master`:

1. **Build & Test** (Node 18.x, 20.x):
   - Dependency install
   - Linting (soft fail)
   - Type checking (soft fail)
   - Build (must pass)
   - Tests (soft fail)

2. **Security Scan**:
   - npm audit (soft fail)

3. **Code Quality**:
   - Prettier formatting check
   - Console.log detection

4. **PR Validation**:
   - Commit message format
   - Branch naming convention
   - PR size check (warns if >1000 lines)

### Environment Variables in CI
All secrets configured as GitHub Secrets and passed to build:
- Supabase credentials
- Square credentials (even though disabled)
- Resend API key
- Vercel KV credentials
- Cron secret

### Deployment Target
Likely **Vercel** based on configuration:
- Uses Turbopack for builds
- Vercel KV for rate limiting
- Automatic deployments from `master`

---

## 🔍 Debugging Tips

### Common Issues

**1. "Supabase client not initialized"**:
- Check that environment variables are set
- Ensure using correct client (browser vs server)
- Verify middleware is running

**2. "Rate limit exceeded"**:
- Check Vercel KV connection
- Verify rate limit window hasn't changed
- Test with different identifier

**3. "Email not sending"**:
- Check Resend API key
- Verify email template renders correctly
- Check `from` address is verified in Resend

**4. "Build fails with type errors"**:
- Run `npm run typecheck` locally
- Ensure all imports have proper types
- Check for missing dependencies

**5. "Styles not applying"**:
- Verify Tailwind classes are correct
- Check for typos in class names
- Ensure component is client-side if using dynamic classes

### Useful Debug Commands
```bash
# Check types
npm run typecheck

# Check linting
npm run lint

# Build locally
npm run build

# Check environment variables
printenv | grep NEXT_PUBLIC

# Check Supabase connection
# In browser console:
const supabase = createClient();
const { data, error } = await supabase.auth.getSession();
```

---

## 📚 Learning Resources

### Framework Documentation
- [Next.js 15 Docs](https://nextjs.org/docs) - App Router patterns
- [React 19 Docs](https://react.dev) - Latest React features
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system

### Libraries
- [Supabase Docs](https://supabase.io/docs) - Database, auth, RLS
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility classes
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Hook Form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - Schema validation
- [Radix UI](https://www.radix-ui.com/) - Accessible components

### Project-Specific
- `COMPONENT_GUIDELINES.md` - Complete design system guide
- `CONTRIBUTING.md` - Detailed workflow and standards
- `DEPLOYMENT_GUIDE.md` - Deployment procedures
- `/apps/trajectory2/src/lib/` - Core utilities and logic

---

## 🎓 Project Philosophy

### Product Vision
Trajectory helps people move from:
- **Drifter** (lost, uncertain) →
- **Balancer** (maintaining, stable) →
- **Architect** (designing, thriving)

### Design Philosophy: "Inspiring Sky Authority"
- **Sky**: Aspirational, uplifting, limitless potential
- **Authority**: Trustworthy, professional, confident
- **Canyon**: Grounded, warm accents for humanity

### Code Philosophy
1. **User First**: Every decision serves user transformation
2. **Accessibility**: Everyone deserves access to growth
3. **Performance**: Fast experiences = better engagement
4. **Maintainability**: Code should be easy to understand and change
5. **Security**: Protect user data with RLS and validation

---

## 🤝 Contributing as an AI Assistant

### Your Role
As an AI assistant working on this codebase, you should:

1. **Understand Context**: Read relevant docs before making changes
2. **Follow Patterns**: Maintain consistency with existing code
3. **Prioritize Quality**: Write clean, tested, accessible code
4. **Communicate Clearly**: Explain changes and reasoning
5. **Ask Questions**: When requirements are unclear, clarify first
6. **Think Holistically**: Consider impact on users and other features

### When to Ask for Human Review
- Security-sensitive changes (auth, payments, RLS)
- Major architectural decisions
- Breaking changes to APIs or schemas
- Design system modifications
- Performance-critical code paths

### How to Propose Changes
1. Explain the problem or opportunity
2. Propose the solution with reasoning
3. Outline alternatives considered
4. Identify potential risks or trade-offs
5. Suggest testing approach

---

## 📞 Support & Questions

### For AI Assistants
- This document is your primary reference
- Cross-reference with specific guides (COMPONENT_GUIDELINES.md, etc.)
- When in doubt, follow existing patterns in the codebase
- Prioritize user experience and code quality

### For Humans
- Open issues for bugs
- Start discussions for features
- Check existing documentation first
- Tag maintainers for urgent items

---

## 📝 Changelog

### 2025-11-14
- Initial CLAUDE.md creation
- Comprehensive codebase analysis
- AI-specific guidance and patterns
- Integration with existing documentation

---

**Remember**: This codebase represents someone's vision to help people transform their lives. Every line of code should honor that mission and serve users with excellence.
