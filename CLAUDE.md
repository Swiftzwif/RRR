# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Trajectory** is a professional assessment platform targeting high-value men (18-35) seeking financial transformation. The platform includes:
- **Assessment System**: 15+2 question diagnostic that assigns domain scores and avatars (Drifter, Balancer, Architect)
- **Course Platform**: $99.99 course with modular content system
- **Coaching Program**: $24.99 application fee for $400/month premium coaching
- **Payment Integration**: Stripe checkout with webhook-based access gating

This is a monorepo using npm workspaces with a single main app: `trajectory2`.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL with RLS)
- **Payments**: Stripe
- **Validation**: Zod
- **Animations**: Framer Motion (minimal, purposeful)
- **Email**: Resend + React Email

## Common Commands

### Development
```bash
# Install dependencies for entire workspace
npm install

# Development server (uses turbopack)
npm run dev
# OR from root
cd apps/trajectory2 && npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Project Navigation
```bash
# Main application
cd apps/trajectory2

# Shared packages (if any)
cd packages/
```

## Architecture Overview

### Application Structure

```
apps/trajectory2/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes (Stripe webhook, notify, etc.)
│   │   ├── assessment/   # Assessment flow pages
│   │   ├── auth/         # Authentication pages
│   │   ├── course/       # Gated course content
│   │   ├── coaching/     # Coaching application
│   │   ├── admin/        # Admin dashboard
│   │   └── page.tsx      # Landing page with CanyonHero
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── ...           # Custom components
│   ├── lib/              # Business logic
│   │   ├── supabase.ts   # Database client
│   │   ├── scoring.ts    # Assessment scoring logic
│   │   ├── utils.ts      # Utilities
│   │   ├── email.ts      # Email sending
│   │   └── copy.ts       # Marketing copy
│   ├── utils/            # Type definitions and utilities
│   ├── content/          # Static content (questions.json)
│   └── emails/           # React Email templates
└── supabase/
    └── migrations/       # Database migrations
```

### Assessment Flow Architecture

The assessment system is the core product feature:

1. **Question Flow** (`/assessment`)
   - Imports questions from `src/content/questions.json`
   - 15 core questions mapped to 6 domains (identity, health, finances, relationships, emotions, focus)
   - Scoring logic in `src/lib/scoring.ts`

2. **Scoring System** (`src/lib/scoring.ts`)
   - Domain scoring: Each domain gets average of its questions (1-5 scale)
   - Overall score: Average of all domain scores
   - Avatar assignment: Drifter (1.0-3.1), Balancer (3.2-4.1), Architect (4.2-5.0)
   - Lowest domains determine suggested actions

3. **Results Gating**
   - Unauthenticated users: email capture required to see results
   - Data stored to Supabase `assessments` table
   - Redirect to `/results` with domain meters, avatar, and CTAs

### Payment Integration Architecture

**Stripe Checkout Flow**:
1. Client creates checkout session via API route
2. User completes payment on Stripe-hosted page
3. Stripe webhook (`/api/stripe/webhook`) processes events
4. On `checkout.session.completed`: Write to `purchases` table
5. Access gating checks `purchases` table for user entitlements

**Product Types**:
- `course`: $99.99 → Unlocks `/course` access
- `coaching`: $24.99 → Creates `coaching_applications` record + redirects to `COACHING_SCHEDULER_URL`

### Database Schema

Key tables (see `supabase/migrations/`):
- `assessments`: Stores completed assessments (user_id, domain_scores, avatar, answers)
- `purchases`: Stripe payment records (user_id, product_type, stripe_session_id, amount)
- `coaching_applications`: Coaching interview applications
- `notify_requests`: Email captures for "notify me" CTAs

Row Level Security (RLS) enforces user-specific access control.

## Design System

### Color Philosophy: "Inspiring Sky Authority"

The design is inspired by open skies and canyon landscapes, creating an uplifting, authoritative experience.

**Primary Colors**:
- Sky blues: `sky-50` through `sky-800` for backgrounds, borders, text
- Canyon accents: `sunset` (#F59E0B), `sunset-dark` (#D97706)
- Status colors: `success` (green), `warn` (amber), `danger` (red)

**Typography**:
- Primary: Inter (body text, UI)
- Display: Clash Display/General Sans (headings)
- Monospace: JetBrains Mono (technical content)

**Spacing**: 8px grid system with generous whitespace (16, 24, 32, 48, 64, 96, 128px)

### Key Components

Critical custom components:
- `CanyonHero`: Multi-layer SVG parallax hero (landing page)
- `StrataDivider`: Topographic overlay dividers
- `Meter`: Domain scoring visualization with fill animations
- `AvatarBadge`: User avatar with canyon styling
- `AssessmentStepper`: Step-by-step question flow with progress tracking
- `ModuleCardTBD`: Premium "coming soon" cards with notify-me CTAs
- `Paywall`: Stripe checkout integration component

## Environment Variables

Required variables (see `.env.example` if it exists):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=              # Server-side only
STRIPE_WEBHOOK_SECRET=          # Server-side only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Application
COACHING_SCHEDULER_URL=         # Redirect URL after coaching purchase

# Optional
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security Notes**:
- Client-side variables MUST use `NEXT_PUBLIC_` prefix
- Server secrets (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET) are NEVER exposed to client
- Use environment validation (Zod schema) on app startup

## Git Workflow

This project follows strict git hygiene (see `.cursorrules` for full details):

### Branch Strategy
- `main`: Production-ready code (also called `master` in this repo)
- `develop`: Integration branch for features
- `feature/<ticket>-<description>`: New features
- `fix/<ticket>-<description>`: Bug fixes
- `hotfix/<ticket>-<description>`: Urgent production fixes

### Commit Convention
```
<type>(<scope>): <subject>

Examples:
feat(assessment): add progress indicator to stepper
fix(payment): resolve Square webhook validation error
docs(api): update API documentation
refactor(ui): extract shared button components
```

**Types**: feat, fix, docs, style, refactor, perf, test, chore, build, ci
**Scopes**: assessment, course, payment, auth, email, ui, api, db, config

### Key Rules
1. NEVER commit directly to main/develop
2. Create new branch for each distinct task
3. Atomic commits with meaningful messages
4. Run `npm run lint`, `npm run typecheck`, `npm run build` before creating PR
5. Keep PRs small and focused (<500 lines changed)

## Code Style Standards

### TypeScript
- Strict mode enabled (no `any` types)
- Explicit return types for public functions
- Named exports preferred over default exports
- Use Zod for runtime validation

### Component Design
- Small, focused, single-responsibility components
- Props interfaces with explicit typing
- Destructure props in function signature
- Use composition over inheritance patterns

### Tailwind CSS
- Mobile-first responsive design (sm, md, lg, xl breakpoints)
- Logical class grouping: layout → spacing → colors → typography
- Custom classes for repeated patterns (canyon-hero-container, sky-gradient-background)
- Semantic class names

### Performance
- Dynamic imports for large components
- Memoize expensive calculations (useMemo)
- Image optimization with Next.js Image component
- Respect `prefers-reduced-motion`

## Testing Strategy

Testing guidelines (see `.cursor/rules/12_tests-and-quality.mdc`):

**Testing Pyramid**:
- 70% Unit tests: Component logic, utilities, business logic
- 25% Integration tests: API endpoints, database operations
- 5% E2E tests: Critical user journeys (assessment completion, payment flow)

**Coverage Requirements**:
- Minimum 70% on all touched files
- 100% on payment and assessment flows
- All new features require tests

## Key Integrations

### Supabase
- Client: `createClient()` for browser (in components)
- Admin: `supabaseAdmin` for server (API routes only)
- RLS policies enforce user-level access control
- Migrations in `supabase/migrations/`

### Stripe
- Client checkout: Use Stripe.js in browser
- Webhook handling: `/api/stripe/webhook` with signature verification
- Products: Course ($99.99), Coaching ($24.99)
- Test mode keys for development

### Email (Resend)
- React Email templates in `src/emails/`
- Transactional emails via API routes
- Email capture for results gating and notify-me features

## Page-Specific Notes

### Landing (`/`)
- Features `CanyonHero` with parallax scrolling
- Authoritative, stoic design
- Clear CTA to assessment

### Assessment (`/assessment`)
- Stepper component with progress tracking
- Keyboard navigation required for accessibility
- Results gated by email/auth

### Results (`/results`)
- Display avatar, domain meters, lowest domains
- 7/30-day suggested actions based on scoring
- CTAs for Course and Coaching purchases

### Course (`/course`)
- Gated: Check `purchases` table for access
- ModuleCardTBD components with "coming soon" placeholders
- Email capture for content notifications

### Admin (`/admin`)
- Dashboard for viewing assessment data
- Analytics and user insights
- Requires admin authentication

## Common Tasks

### Adding a New Assessment Question
1. Edit `src/content/questions.json`
2. Update domain mapping in `src/lib/scoring.ts` if needed
3. Ensure question IDs follow convention (Q1, Q2, etc.)

### Adding a Stripe Product
1. Create product in Stripe dashboard
2. Get price ID
3. Add checkout flow in component
4. Update webhook handler if new product type

### Creating a New Page
1. Add route in `src/app/[route]/page.tsx`
2. Follow layout conventions (CanyonHero for heroes, StrataDivider between sections)
3. Ensure responsive design (test sm, md, lg, xl)
4. Add to navigation if needed

### Database Migration
1. Create migration file: `supabase/migrations/[timestamp]_[description].sql`
2. Follow versioning convention
3. Include rollback instructions in comments
4. Test locally before deploying

## Performance Targets

- Lighthouse scores: 90+ for Performance, Accessibility, Best Practices, SEO
- First Contentful Paint: <2s
- Time to Interactive: <3s
- Bundle size: Main bundle <250KB
- 60fps animations (no layout thrash)

## Accessibility Requirements

- WCAG AA contrast ratios
- Keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels and landmarks
- Screen reader support
- Focus management
- Respect `prefers-reduced-motion`

## Deployment

Platform: Vercel

**Pre-deployment Checklist**:
1. All tests pass
2. Type checking passes
3. Build succeeds locally
4. Environment variables set in Vercel
5. Database migrations applied
6. Stripe webhook endpoint configured

**Environment Setup**:
- Production: Set all env vars in Vercel dashboard
- Preview: Automatic from git branches
- Development: `.env.local` (not committed)

## Documentation

Additional documentation files in repo:
- `.cursorrules`: Comprehensive git workflow and PR guidelines
- `.cursor/rules/*.mdc`: Detailed standards for code style, architecture, testing, integrations
- `IMPLEMENTATION_SUMMARY*.md`: Project progress and completed features
- `DEPLOYMENT_GUIDE.md`: Deployment procedures
- `DATABASE_SETUP_COMPLETE.md`: Database setup instructions

## Key Architectural Decisions

1. **Next.js App Router**: Server components for performance, RSC for data fetching
2. **Supabase**: All-in-one backend (auth, database, RLS) reduces complexity
3. **Stripe Checkout**: Hosted checkout reduces PCI compliance burden
4. **Monorepo**: Future-proofing for shared packages, currently single app
5. **Turbopack**: Faster dev builds and HMR
6. **Email Gating**: Low-friction lead capture before showing results

## Brand Context

**Target Audience**: Ambitious men 18-35 experiencing "life drift"
**Value Proposition**: Structured path from drift to financial dominion (FastLane framework)
**Tone**: Professional, stoic, authoritative (not therapy/crisis intervention)
**Core Philosophy**: Based on "Millionaire Fastlane" by MJ DeMarco, Stoic principles

**Lane Framework**:
- **SlowLane**: Traditional career path, incremental growth
- **SideLane**: Employment with optimization
- **FastLane**: High-leverage, scalable wealth building

Assessment determines current lane and provides transformation path.
