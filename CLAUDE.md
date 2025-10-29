# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# Trajectory - Professional Life Assessment Platform

A comprehensive guide to the Trajectory codebase for AI assistants. This Next.js 15 application is a professional, stoic assessment platform targeting high-value men seeking financial and personal transformation.

## Table of Contents

1. [Quick Start Overview](#quick-start-overview)
2. [Development Commands](#development-commands)
3. [Design System & Philosophy](#design-system--philosophy)
4. [Application Structure](#application-structure)
5. [Feature Areas](#feature-areas)
6. [Key Integrations](#key-integrations)
7. [Important Patterns](#important-patterns)
8. [Git Workflow & Branch Strategy](#git-workflow--branch-strategy)
9. [UI Testing Protocol](#ui-testing-protocol)
10. [Configuration & Environment](#configuration--environment)

---

## Quick Start Overview

**Trajectory2** is a Next.js 15 application built with:
- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion for animations
- **Backend**: Next.js App Router with server/client components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Square
- **Email**: Resend + React Email
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI primitives + shadcn/ui

**Purpose**: Transform users' life trajectories through self-assessment, personalized content, and premium courses/coaching.

---

## Product Overview

### Core Products & Pricing

**1. Assessment (Kill the Boy Quiz)**
- Free diagnostic tool to determine current "life lane" and transformation readiness
- Flow: 15 scored questions → domain scoring → avatar assignment (Drifter/Balancer/Architect)
- Gating: Email capture required for results access
- Conversion: Direct path to course purchase

**2. Course - "Rethink. Redesign. Reignite."**
- Price: **$99.99** one-time purchase
- 6 modules covering FastLane fundamentals (31-day experience)
- Access: Automatically granted via Square webhook after payment
- Structure: Module 1 (Kill the Boy) always available, Modules 2-6 progressively unlock
- 15+ hours of video content, book summaries, daily action tasks

**3. Coaching Interview**
- Price: **$24.99** application fee
- Qualification gateway for $400/month ongoing coaching program
- Flow: Square checkout → redirect to coaching scheduler (Calendly)
- Purpose: Screen for client readiness and program fit

**4. Story & Free Resources**
- Brand narrative showcasing transformation
- Blog content and knowledge base
- SEO-driven organic traffic generation

### FastLane/SideLane/SlowLane Framework

This is the conceptual foundation of the platform:

- **FastLane**: High-leverage, scalable wealth building (entrepreneurship, systems, passive income)
- **SideLane**: Traditional employment with optimization (side hustles, skill development)
- **SlowLane**: Conventional career path with incremental growth (9-5, save for retirement)

The assessment determines which lane users are in and provides tailored recommendations for moving toward the FastLane.

### Target Audience

- Ambitious men aged 18-35 experiencing "life drift"
- Seeking structured path from drift to dominion
- Ready for action-oriented transformation (not therapy or crisis intervention)
- Professional, stoic messaging resonates

---

## Development Commands

### Workspace Scripts (run from root)
```bash
# Install all dependencies
npm run install:all

# Start dev server (runs trajectory2 app)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Type checking
npm run typecheck
```

### Trajectory2 Specific (run from apps/trajectory2/)
```bash
# Development with Turbopack
npm run dev

# Production build with Turbopack
npm run build

# Start production server
npm start

# Lint check
npm run lint

# Type checking only
npm run typecheck
```

### Testing a Single Component
```bash
# Run dev server and navigate to specific route
npm run dev
# Then visit: http://localhost:3000/assessment
# Or: http://localhost:3000/course
```

### Common Development Tasks
```bash
# Check git history before modifying a file
git log --oneline -10 -- path/to/file

# View recent commits in the project
git log --oneline -15

# Check current branch status
git status

# Run all checks before committing
npm run lint && npm run typecheck && npm run build
```

---

## Design System & Philosophy

### Design Philosophy

**Inspiring Sky Authority**: Sophisticated sky-inspired design that makes you feel alive and ready to soar
**Breathable Experience**: Generous whitespace, clean layouts that let content breathe like open sky
**Memorable Journey**: Every interaction feels intentional and uplifting - like reaching for the heavens
**Masculine Sophistication**: Strong typography, confident spacing, purposeful hierarchy that inspires action

### Color Palette

The color system uses sky and canyon-inspired colors:

```css
/* Sky-Inspired Base Colors */
'sky-50': '#F0F9FF',        /* Lightest sky - clean backgrounds */
'sky-100': '#E0F2FE',       /* Light sky - subtle contrast */
'sky-200': '#BAE6FD',       /* Medium sky - gentle borders */
'sky-300': '#7DD3FC',       /* Baby blue - soft accents */
'sky-400': '#38BDF8',       /* Electric blue - primary actions */
'sky-500': '#0EA5E9',       /* Strong blue - hover states */
'sky-600': '#0284C7',       /* Deep blue - strong text */
'sky-700': '#0369A1',       /* Darker blue - headings */
'sky-800': '#075985',       /* Deepest blue - authoritative */

/* Canyon Accent Colors */
'sunset': '#F59E0B',        /* Golden sunset - warm highlights */
'sunset-dark': '#D97706',   /* Deep sunset - hover states */
'glow': '#FCD34D',          /* Warm glow - highlights */

/* Status Colors */
'success': '#10B981',       /* Growth, achievement */
'warn': '#F59E0B',          /* Caution, attention */
'danger': '#EF4444'         /* Error, critical */
```

### Typography

- **Primary**: Inter (clean, professional, highly readable)
- **Display**: Clash Display/General Sans (canyon-inspired, authoritative headings)
- **Monospace**: JetBrains Mono (technical, precise)

### Spacing & Layout

- **Generous Spacing**: 8px grid system with extra breathing room (16, 24, 32, 48, 64, 96, 128px)
- **Professional Radius**: Subtle border radius (8-12px) for modern feel
- **Clean Lines**: 1px borders, subtle shadows for depth
- **Breathable Layouts**: Extra whitespace between sections

### Performance & Accessibility

- **Animations**: Subtle, no layout thrash, 60fps target
- **A11y**: Strong accessibility, AA contrast, keyboard navigation
- **Responsive**: Support sm–xl breakpoints
- **Performance**: Limit blur/filters, Lighthouse pass for a11y & performance

---

## Application Structure

### Directory Layout

```
apps/trajectory2/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── layout.tsx                # Root layout with Navigation & Footer
│   │   ├── page.tsx                  # Home/landing page (649 lines)
│   │   ├── assessment/               # Assessment system
│   │   │   ├── page.tsx              # Main assessment flow
│   │   │   └── landing/page.tsx      # Assessment intro/landing
│   │   ├── results/                  # Assessment results display
│   │   │   └── page.tsx
│   │   ├── experience/               # 31-day experience content
│   │   │   ├── page.tsx              # 31-day overview
│   │   │   └── day/[dayNumber]/page.tsx # Individual day content
│   │   ├── course/                   # Course landing & access control
│   │   │   └── page.tsx
│   │   ├── coaching/                 # Coaching inquiry page
│   │   ├── kill-the-boy/             # Module content
│   │   ├── story/                    # Brand narrative
│   │   ├── resources/                # Free resources
│   │   ├── account/                  # User account management
│   │   │   ├── page.tsx
│   │   │   └── account-form.tsx
│   │   ├── login/                    # Auth pages
│   │   │   ├── page.tsx
│   │   │   └── actions.ts            # Server actions for auth
│   │   ├── auth/                     # Auth callbacks
│   │   │   ├── confirm/route.ts
│   │   │   └── signout/route.ts
│   │   ├── api/                      # API Routes (Next.js app router)
│   │   │   ├── payments/square/create/route.ts  # Payment link creation
│   │   │   ├── webhooks/square/route.ts         # Payment webhooks
│   │   │   └── notify/route.ts                  # Notification endpoint
│   │   ├── globals.css               # Tailwind + luxury design tokens
│   │   └── error/                    # Error page
│   ├── components/                   # Reusable React components
│   │   ├── Navigation.tsx            # Header with auth state
│   │   ├── Footer.tsx                # Footer component
│   │   ├── AssessmentStepper.tsx     # Assessment UI with keyboard shortcuts
│   │   ├── AvatarBadge.tsx           # Display user avatar (Drifter/Balancer/Architect)
│   │   ├── Meter.tsx                 # Domain score visualization
│   │   ├── ResultCard.tsx            # Result display card
│   │   ├── LogoMark.tsx              # Logo component
│   │   ├── premium/                  # Premium feature components
│   │   │   ├── FeatureGate.tsx       # Server component for feature access check
│   │   │   ├── UpgradePrompt.tsx     # Prompt to upgrade
│   │   │   └── PremiumBadge.tsx      # Badge indicator
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       ├── dialog.tsx
│   │       ├── tabs.tsx
│   │       ├── accordion.tsx
│   │       └── progress.tsx
│   ├── lib/                          # Business logic & utilities
│   │   ├── supabase.ts               # Supabase client initialization (both server/client)
│   │   ├── supabase-types.ts         # TypeScript types (auto-generated from DB schema)
│   │   ├── supabase-premium.ts       # Premium user helper functions (150+ lines)
│   │   ├── email.ts                  # Email service integration (Resend)
│   │   ├── scoring.ts                # Assessment domain scoring logic
│   │   ├── copy.ts                   # Centralized copy/microcopy (9,942 bytes)
│   │   └── utils.ts                  # General utilities
│   ├── utils/                        # Utility modules (separate from lib)
│   │   └── supabase/
│   │       ├── client.ts             # Browser-side Supabase client with caching
│   │       ├── server.ts             # Server-side Supabase client
│   │       └── middleware.ts         # Auth middleware
│   ├── emails/                       # React Email templates
│   │   ├── purchase-confirmation.tsx # Payment confirmation email
│   │   ├── assessment-complete.tsx   # Assessment results email
│   │   └── daily-experience.tsx      # Daily experience email
│   └── public/
│       ├── questions.json            # Assessment questions (scored + reflective)
│       └── strata/                   # SVG assets
├── package.json                      # Dependencies (Next.js 15.5.4, React 19.1.0)
├── tsconfig.json                     # TypeScript configuration (@/* path alias)
├── tailwind.config.js                # Tailwind CSS v4 configuration
├── postcss.config.mjs                # PostCSS configuration
└── next.config.ts                    # Next.js configuration

```

### Key Configuration Files

**tsconfig.json**:
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017, strict mode enabled
- Module resolution: bundler (for Next.js)

**Styling**:
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- CSS-in-JS via Tailwind utilities
- Custom design tokens in `globals.css` (gold, luxury colors, etc.)

---

## Feature Areas

### 1. Assessment System

**Purpose**: 10-minute questionnaire to determine user's "life trajectory" (Drifter/Balancer/Architect).

**How It Works**:
1. User navigates to `/assessment/landing` → `/assessment`
2. `AssessmentStepper` component renders questions from `questions.json`
3. Questions organized by 6 life domains:
   - **Identity** (3 questions)
   - **Health** (2 questions)
   - **Finances** (3 questions)
   - **Relationships** (3 questions)
   - **Emotions** (2 questions)
   - **Focus** (2 questions)
4. 1-5 scale answers stored in component state
5. On completion:
   - `scoreDomains()` calculates domain averages
   - Avatar determined: Drifter (1.0-3.1), Balancer (3.2-4.1), Architect (4.2-5.0)
   - Results saved to Supabase `assessments` table
   - Results stored in `sessionStorage` for results page
   - User redirected to `/results`

**Key Files**:
- `/src/app/assessment/page.tsx` - Client component with Supabase integration
- `/src/components/AssessmentStepper.tsx` - Reusable stepper UI with keyboard shortcuts (keys 1-5 to answer)
- `/src/lib/scoring.ts` - Domain scoring logic with tie-breaking algorithm
- `/src/public/questions.json` - Question definitions

**Database Integration**:
```typescript
// Assessment saved to Supabase
const { data, error } = await supabase
  .from('assessments')
  .insert({
    user_id: user?.id || null,
    answers: Record<string, number>,
    domain_scores: Record<Domain, number>,
    avatar: 'Drifter' | 'Balancer' | 'Architect',
    score: number (overall average),
  })
```

### 2. Course/Content System

**Product**: $99.99 "Trajectory Course - Rethink. Redesign. Reignite."

**Structure**:
- 6 modules (31-day experience content)
- Module 1: Kill the Boy (always available after purchase)
- Module 2-6: Progressively unlock
- 15+ hours of video content
- Book summaries + action tasks per day

**How Access Works**:
1. Unauthenticated users see locked modules with price CTA
2. On `/course` page, check if user has made `course` purchase
3. If purchase exists in `purchases` table with `product='course'`, unlock all modules
4. Purchase completion flow:
   - User clicks "Get Instant Access"
   - POST to `/api/payments/square/create` creates Square payment link
   - User completes payment
   - Square webhook hits `/api/webhooks/square`
   - Webhook grants access via user metadata: `has_course_access = true`
   - Polling mechanism checks for access every 2 seconds (up to 30 seconds)

**Key Files**:
- `/src/app/course/page.tsx` - Course landing with module list and purchase CTA
- `/src/app/experience/page.tsx` - 31-day experience overview (7 free days, rest locked)
- `/src/app/experience/day/[dayNumber]/page.tsx` - Individual day content

### 3. Authentication/User System

**Provider**: Supabase Auth with email/password

**Flow**:
1. `/login` page with toggle between login and signup
2. Uses server action `login()` and `signup()` from `/src/app/login/actions.ts`
3. Server actions call Supabase auth API
4. On success: user redirected to home, layout revalidated
5. Navigation component shows user state via `createClient()` from `/utils/supabase/client.ts`

**Key Patterns**:
- **Client-side auth**: `useEffect` + `supabase.auth.onAuthStateChange()` for listening
- **Server-side auth**: `createClient()` async function from `server.ts` using cookies
- **Auth guards**: Check `user` before accessing protected resources
- **User metadata**: Stores `has_course_access`, `has_coaching_access`, etc.

**Key Files**:
- `/src/app/login/page.tsx` - Login/signup UI
- `/src/app/login/actions.ts` - Server actions for auth
- `/src/utils/supabase/client.ts` - Browser client (singleton pattern)
- `/src/utils/supabase/server.ts` - Server client using cookies
- `/src/app/auth/signout/route.ts` - Logout route

### 4. Payment Integration (Square)

**Provider**: Square Payments

**Products**:
- **Course**: $99.99 (one-time)
- **Coaching Interview**: $24.99 (one-time)

**Payment Flow**:
1. User clicks purchase button on `/course` or `/coaching`
2. POST to `/api/payments/square/create` with:
   ```typescript
   {
     product: 'course' | 'coaching',
     userId?: string,
     email?: string
   }
   ```
3. API route creates Square payment link via REST API
4. User redirected to Square checkout
5. On payment success:
   - Square sends webhook to `/api/webhooks/square`
   - Webhook validates HMAC signature
   - Processes `payment.created` and `payment.updated` events
   - Only processes `COMPLETED` payments
   - Stores purchase record in `purchases` table
   - Grants access via user metadata update
   - Sends confirmation email via Resend

**Key Files**:
- `/src/app/api/payments/square/create/route.ts` - Create payment link
- `/src/app/api/webhooks/square/route.ts` - Webhook handler (~188 lines)
- `/src/app/course/page.tsx` - Purchase button integration

**Webhook Processing** (detailed):
```typescript
// Webhook receives payment event
if (payment.status === 'COMPLETED') {
  // Store purchase
  await supabase.from('purchases').upsert({
    user_id, email, product, amount_cents, square_payment_id
  })
  
  // Grant access to user
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      has_course_access: true,
      course_purchase_date: ISO string,
      course_payment_id: payment ID
    }
  })
  
  // Send confirmation email
  await sendPurchaseConfirmationEmail({...})
}
```

### 5. Email System

**Provider**: Resend with React Email templates

**Email Templates**:
1. **Purchase Confirmation** (`purchase-confirmation.tsx`)
   - Product details, purchase date, amount
   - Action CTA to access course/schedule coaching
   - "What's Next?" steps
   - Contact support link

2. **Assessment Complete** (`assessment-complete.tsx`)
   - User's avatar, overall score, domain breakdown
   - Suggested 7-day and 30-day actions
   - Link to results page

3. **Daily Experience** (`daily-experience.tsx`)
   - Day-specific book summaries (3 per day)
   - Task list for the day
   - Link to day content

**Sending Emails**:
```typescript
// Server function
async function sendPurchaseConfirmationEmail(data: PurchaseConfirmationEmailData) {
  const resendClient = getResendClient() // Lazy initialization
  const result = await resendClient.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: data.to,
    subject: `Your Purchase is Confirmed - ${data.productName}`,
    react: PurchaseConfirmationEmail(emailProps)
  })
  return { success: true, data: result }
}
```

**Key Files**:
- `/src/lib/email.ts` - Email service integration (172 lines)
- `/src/emails/` - React Email templates
- Environment variables: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`

---

## Key Integrations

### 1. Supabase

**Client Initialization**:

**Browser Client** (`/src/utils/supabase/client.ts`):
```typescript
// Singleton pattern with caching
import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient(): SupabaseClient {
  if (clientInstance) return clientInstance
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}
```

**Server Client** (`/src/utils/supabase/server.ts`):
```typescript
// Async function that reads from cookies
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {...}
    }
  })
}
```

**Legacy Client** (`/src/lib/supabase.ts`):
- Direct `createClient` from `@supabase/supabase-js` (older pattern)
- Used in some pages for simplicity
- Includes fallback hardcoded keys (not recommended for production)

**Auth Flow**:
- Client-side: Uses browser client from `/utils/supabase/client.ts`
- Server-side: Uses server client from `/utils/supabase/server.ts`
- Both integrate with Next.js cookie handling for session persistence

**Database Tables** (inferred from code):
- `assessments` - User assessment results
- `purchases` - Payment records
- `user_profiles` - User metadata and tier info
- `subscriptions` - Subscription records
- `feature_flags` - Feature access control

### 2. Square Payments

**API Base URLs**:
- Production: `https://connect.squareup.com/v2`
- Sandbox: `https://connect.squareupsandbox.com/v2`

**Endpoints Used**:
- `POST /online-checkout/payment-links` - Create payment link

**Request Headers**:
```typescript
{
  'Square-Version': '2024-01-18',
  'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
}
```

**Webhook Signature Verification**:
```typescript
// HMAC-SHA256
const hmac = createHmac('sha256', SQUARE_WEBHOOK_SIGNATURE_KEY)
hmac.update(bodyString)
const expectedSignature = hmac.digest('base64')
// Compare with header: x-square-hmacsha256-signature
```

**Environment Variables**:
- `SQUARE_ACCESS_TOKEN` - API token
- `SQUARE_LOCATION_ID` - Business location ID
- `SQUARE_ENVIRONMENT` - 'production' or 'sandbox'
- `SQUARE_WEBHOOK_SIGNATURE_KEY` - For signature verification

### 3. Resend + React Email

**Integration Point**: `/src/lib/email.ts`

**Key Functions**:
- `sendPurchaseConfirmationEmail(data)` - Purchase receipts
- `sendAssessmentCompleteEmail(data)` - Assessment results
- `sendDailyExperienceEmail(data)` - Daily content emails
- `scheduleDailyEmails(email, userName)` - Schedule 7-day sequence

**Email Template Pattern**:
```typescript
// React Email component
const PurchaseConfirmationEmail = ({
  userName, productName, productType, amount, accessUrl, purchaseDate
}: PurchaseConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          {/* Sections: header, success, details, access, footer */}
        </Container>
      </Body>
    </Html>
  )
}
```

**Note**: Daily email scheduling is currently placeholder (comments say would use BullMQ or Inngest).

---

## Important Patterns

### 1. Server vs Client Components

**Client Components** (23 files with `'use client'`):
- Pages with interactivity: assessment, results, course, experience
- Navigation (auth state listening)
- Forms with React Hook Form
- Components that need `useState`, `useEffect`, event handlers

**Server Components** (only 1 file with `'use server'`):
- Server actions in `/src/app/login/actions.ts`
- Most of `/src/lib/` files are utility imports (used by both)
- Email sending functions are server-only

**Pattern**:
- Page components are client components (`'use client'`)
- They import server utilities for Supabase queries
- Server actions handle sensitive operations

### 2. Data Fetching Patterns

**Client-Side Fetching** (Assessment, Course pages):
```typescript
useEffect(() => {
  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('user_id', user?.id)
  }
  loadData()
}, [])
```

**Server-Side Fetching** (Auth routes, API routes):
```typescript
const supabase = await createClient() // Server function
const { data, error } = await supabase.from('table').select('*')
return NextResponse.json(data)
```

**API Routes Pattern**:
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = schema.parse(body) // Zod validation
  // Process...
  return NextResponse.json(result)
}
```

### 3. Authentication Guards

**Client-Side Guard**:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  router.push('/login')
  return
}
```

**Server-Side Guard**:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 4. Form Handling

**Pattern**: React Hook Form + Zod validation

**Example** (Assessment Stepper):
```typescript
const [answers, setAnswers] = useState<Record<string, number>>({})

const handleAnswer = (value: number) => {
  setAnswers(prev => ({
    ...prev,
    [currentQuestion.id]: value
  }))
}
```

**Login Form** (uses native form submission with server action):
```tsx
<form action={handleSubmit}>
  <Input name="email" type="email" />
  <Input name="password" type="password" />
  <Button type="submit">Sign In</Button>
</form>

// handleSubmit calls server action
const handleSubmit = async (formData: FormData) => {
  await login(formData) // Server action
}
```

**API Validation** (Zod):
```typescript
const createPaymentSchema = z.object({
  product: z.enum(['course', 'coaching']),
  userId: z.string().optional(),
  email: z.string().email().optional(),
})

const { product, userId, email } = createPaymentSchema.parse(body)
```

### 5. Premium Feature Access Control

**FeatureGate Component** (Server Component):
```typescript
// Check access before rendering
const canAccess = await canAccessFeature(userId, featureKey)
if (!canAccess) {
  return <UpgradePrompt />
}
return <>{children}</>
```

**User Metadata Approach**:
```typescript
// Check during auth state
if (user?.user_metadata?.has_course_access === true) {
  // Show course content
}
```

### 6. Responsive Design

**Breakpoints** (Tailwind):
- `sm` - 640px
- `md` - 768px
- `lg` - 1024px

**Pattern**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Stacks on mobile, 2 cols on tablet, 3 cols on desktop */}
</div>
```

### 7. Animation

**Framer Motion** (imported in client components):
```typescript
import { motion, AnimatePresence } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

### 8. Error Handling

**API Routes**:
```typescript
try {
  // Process...
  return NextResponse.json(result)
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid request', details: error.issues },
      { status: 400 }
    )
  }
  return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
```

**Client Components**:
```typescript
const [error, setError] = useState<string | null>(null)

try {
  // Async operation
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error')
} finally {
  setLoading(false)
}
```

**Webhooks** (graceful degradation):
```typescript
// Store purchase (critical)
// Ignore if this fails (purchase stored is enough)

// Grant access (important)
// Ignore if this fails (webhook will retry)

// Send email (nice to have)
// Ignore if this fails (purchase is stored)
```

### 9. Component Design Patterns

**Composition Over Inheritance**:
```typescript
// ✅ Good: Composition pattern
interface AssessmentCardProps {
  assessment: Assessment;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AssessmentCard({ assessment, actions, footer }: AssessmentCardProps) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{assessment.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <AssessmentSummary assessment={assessment} />
      </Card.Content>
      {actions && <Card.Footer>{actions}</Card.Footer>}
    </Card>
  );
}
```

**Custom Hooks Pattern**:
```typescript
// ✅ Good: Custom hook for reusable logic
export function useAssessment(assessmentId: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAssessment(assessmentId)
      .then(setAssessment)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [assessmentId]);

  return { assessment, loading, error };
}
```

### 10. Performance Optimization

**Bundle Size**:
- Use dynamic imports for large components
- Ensure unused code is eliminated (tree shaking)
- Use Next.js Image component for image optimization
- Implement route-based code splitting

**Runtime Performance**:
```typescript
// ✅ Good: Memoized expensive calculations
const domainScores = useMemo(() =>
  calculateDomainScores(responses),
  [responses]
);

// ✅ Good: Code splitting for large components
const AssessmentStepper = dynamic(() => import('./AssessmentStepper'), {
  loading: () => <AssessmentSkeleton />,
  ssr: false,
});
```

**Memory Management**:
- Proper cleanup of event listeners and subscriptions
- Use refs for DOM manipulation, not state
- Avoid memory leaks in closures

---

## Git Workflow & Branch Strategy

### Branch Naming Convention

- `main` - Production-ready code (also referred to as `master` in some places)
- `develop` - Integration branch for features
- `feature/<ticket-number>-<short-description>` - New features
- `fix/<ticket-number>-<short-description>` - Bug fixes
- `hotfix/<ticket-number>-<short-description>` - Urgent production fixes
- `refactor/<scope>-<description>` - Code refactoring
- `chore/<description>` - Maintenance tasks
- `docs/<description>` - Documentation updates

### Branch Creation Rules

1. **ALWAYS create a new branch** for each distinct piece of work
2. **NEVER commit directly to main or develop**
3. Create branches from `develop` for features/fixes
4. Create branches from `main` only for hotfixes
5. Keep branches small and focused on a single concern

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `build`, `ci`

**Scopes**: `assessment`, `course`, `payment`, `auth`, `email`, `ui`, `api`, `db`, `config`

**Examples**:
```
feat(assessment): add progress indicator to assessment stepper
fix(payment): resolve Square API webhook validation error
docs(api): update API documentation with new endpoints
refactor(ui): extract common button styles to shared component
```

### PR Requirements for UI Changes

For **EVERY** UI change PR, include:

1. **Before Screenshots** - Desktop (1920x1080) and Mobile (375x667)
2. **After Screenshots** - Same views as "before"
3. **Console Screenshot** - Show zero errors
4. **Testing Checklist**:
   ```markdown
   - [x] Tested in browser (localhost:3000)
   - [x] All console errors resolved
   - [x] Responsive layout verified (mobile, tablet, desktop)
   - [x] User flow tested end-to-end
   - [x] Network requests verified
   ```

### Pre-Commit Checklist

```bash
# 1. Run linter
npm run lint

# 2. Run type check
npm run typecheck

# 3. Run tests
npm run test  # if tests exist

# 4. Review git diff
git diff

# 5. Stage changes
git add -p

# 6. Commit with proper message
git commit -m "type(scope): description"
```

### Payment and Database Change Rules

- **Payment changes**: Require extra review, test in Square sandbox first
- **Database schema changes**: Need migration files, document in PR
- **UI changes**: Need screenshots in PR
- **Email template changes**: Need preview screenshots

---

## UI Testing Protocol

### The Non-Negotiable Rule

**EVERY UI change, style modification, or user interaction update MUST be validated in an actual browser BEFORE and AFTER making changes.**

### When Browser Testing is MANDATORY

- ✅ UI Component Changes
- ✅ CSS/Styling Updates
- ✅ Form Implementation
- ✅ Navigation/Routing
- ✅ Interactive Elements
- ✅ Layout Changes
- ✅ Authentication Flows
- ✅ Payment Flows
- ✅ Assessment/Course Pages
- ✅ Error States
- ✅ Loading States

### Pre-Development Checklist

Before touching any UI code:

1. Check git history: `git log --oneline -15 -- path/to/file`
2. Start dev server: `npm run dev`
3. Navigate to the page you're modifying
4. Take screenshot of current state
5. Check console for existing errors
6. Test current functionality
7. Test responsive behavior (mobile, tablet, desktop)

### During Development

Test in browser every 10-15 minutes during active development:

1. Let Next.js hot reload (wait 2-3 seconds)
2. Check console for errors
3. Test the specific feature you just changed
4. Verify no regressions in related features

### Post-Development Validation

Before committing, complete this checklist:

**Visual Verification**:
- [ ] Navigate to page
- [ ] Take final screenshot (fullPage: true)
- [ ] Compare before/after screenshots
- [ ] Verify design matches design system
- [ ] Check all text is readable
- [ ] Verify images load correctly

**Functional Verification**:
- [ ] Test all interactive elements
- [ ] Test form validation if applicable
- [ ] Test navigation flows
- [ ] Test data loading
- [ ] Test error states
- [ ] Test loading states

**Console Verification**:
- [ ] Check console for errors (ZERO errors required)
- [ ] Check for warnings related to your changes

**Responsive Verification**:
- [ ] Desktop: 1920x1080
- [ ] Laptop: 1366x768
- [ ] Tablet: 768x1024
- [ ] Mobile: 375x667
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets ≥ 44x44px on mobile

**Accessibility Verification**:
- [ ] Semantic HTML structure
- [ ] Buttons have accessible labels
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Keyboard accessible (test tab navigation)
- [ ] Focus indicators visible

**Network Verification**:
- [ ] All API calls succeed (200/201/204)
- [ ] No failed requests (unless expected)
- [ ] No excessively slow requests (>3s)

### Common UI Issues to Catch

**Hydration Mismatches**: React warning about mismatched text content
- Check for `Date.now()` or `Math.random()` in render
- Check for browser-only APIs without guards
- Use `useEffect` for client-only rendering

**Missing Key Props**: React warning about keys in lists
- Add unique `key` prop to all `.map()` items
- Use stable IDs, not array indices

**Responsive Layout Breaks**: Content overflows on mobile
- Use responsive Tailwind classes (sm:, md:, lg:)
- Test at 375px width (iPhone SE)
- Ensure touch targets are 44x44px minimum

**Failed API Calls**: Data doesn't load
- Check endpoint URL is correct
- Verify authentication headers
- Check server is running
- Verify CORS configuration

### Special Rules for Trajectory2

**Assessment Pages**:
- MUST test entire flow start-to-finish
- MUST verify progress indicator updates
- MUST test both mobile and desktop layouts
- MUST verify results page displays correctly

**Course Pages**:
- MUST verify authentication gates work
- MUST test navigation between lessons
- MUST verify content displays correctly
- MUST verify progress tracking

**Payment Pages**:
- MUST test form validation thoroughly
- MUST verify Square integration works
- MUST test error states (declined card, etc.)
- MUST verify confirmation page displays

---

## Configuration & Environment

### Environment Variables

**Public Variables** (exposed to browser, prefixed `NEXT_PUBLIC_`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_APP_URL=https://trajectory.example.com
NEXT_PUBLIC_COACHING_SCHEDULER_URL=https://calendly.com/...
```

**Secret Variables** (server-only):
```env
SUPABASE_SERVICE_ROLE=[service role key]
RESEND_API_KEY=[resend api key]
RESEND_FROM_EMAIL=Trajectory <hello@trajectory.com>
SQUARE_ACCESS_TOKEN=[square access token]
SQUARE_LOCATION_ID=[square location id]
SQUARE_ENVIRONMENT=production|sandbox
SQUARE_WEBHOOK_SIGNATURE_KEY=[webhook signature key]
```

### TypeScript Configuration

**Path Aliases**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Strict Mode**: Enabled

**Target**: ES2017

### Build & Development

**Scripts** (package.json):
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  }
}
```

**Turbopack**: Enabled for faster builds/dev server

### Key Dependencies

**Framework & Core**:
- `next@15.5.4` - App Router, Server Components
- `react@19.1.0` - React 19
- `typescript@5` - Type safety

**UI & Styling**:
- `tailwindcss@4` - Utility CSS
- `@tailwindcss/postcss@4` - PostCSS integration
- `framer-motion@12.23.12` - Animations
- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icon library

**Forms & Validation**:
- `react-hook-form@7.64.0` - Form management
- `@hookform/resolvers@5.2.2` - Zod/Yup integration
- `zod@4.1.12` - Schema validation

**Authentication & Database**:
- `@supabase/supabase-js@2.56.1` - Supabase client
- `@supabase/ssr@0.7.0` - SSR-compatible Supabase

**Email**:
- `resend@6.1.2` - Email sending
- `react-email@4.3.0` - React Email templates
- `@react-email/components@0.5.6` - Email components

**Utilities**:
- `class-variance-authority` - Component variants
- `tailwind-merge` - Merge Tailwind classes
- `clsx` - Conditional classnames

---

## Common Development Tasks

### Adding a New Page

1. Create `/src/app/[pageName]/page.tsx`
2. Add `'use client'` at top if interactive
3. Import components and utilities
4. Add to Navigation if needed

### Adding a New Email Template

1. Create `/src/emails/[name].tsx`
2. Build with `@react-email/components`
3. Export as named export
4. Add send function to `/src/lib/email.ts`

### Adding a New API Route

1. Create `/src/app/api/[route]/route.ts`
2. Export `GET`, `POST`, etc. functions
3. Use `NextRequest` and `NextResponse`
4. Include Zod validation
5. Handle errors gracefully

### Querying Supabase

**From Client Component**:
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value)
  .single()
```

**From Server Action/Route**:
```typescript
const supabase = await createClient() // Async!
const { data, error } = await supabase.from('table').select('*')
```

### Sending Email

```typescript
import { sendPurchaseConfirmationEmail } from '@/lib/email'

await sendPurchaseConfirmationEmail({
  to: user.email,
  productName: 'Trajectory Course',
  productType: 'course',
  amount: '99.99',
  accessUrl: 'https://...',
  purchaseDate: new Date().toLocaleDateString()
})
```

---

## Debugging Tips

1. **Auth Issues**: Check browser DevTools > Application > Cookies for Supabase session
2. **Payment Issues**: Check Square API logs and webhook logs in dashboard
3. **Email Issues**: Check Resend dashboard for delivery status
4. **Client State**: Use React DevTools extension to inspect component state
5. **Server Logs**: `console.log()` in server components/routes appears in terminal during `next dev`

---

## Performance Considerations

- **Client Component Caching**: Supabase browser client uses singleton pattern
- **Animations**: Framer Motion is lazy-loaded (CSS-in-JS)
- **Image Optimization**: Use `next/image` for images
- **Code Splitting**: Automatic with Next.js App Router
- **Tailwind**: JIT compilation, only includes used classes

---

## Security Notes

- **Supabase Keys**: Public anon key is in environment, never expose service role
- **Square Webhook**: Always verify HMAC signature before processing
- **Auth**: Use server-side functions for sensitive operations
- **Rate Limiting**: Not currently implemented (add if needed)
- **CORS**: Not configured (API routes are same-origin only)

---

## Related Documentation

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Square**: https://developer.squareup.com/docs
- **Resend**: https://resend.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com/

---

## Architecture Principles

### File Organization

- **Components**: Keep small, composable, presentational when possible
- **Business Logic**: Centralized in `/lib` directory
- **API Routes**: Use server actions or route handlers for secure operations
- **Never expose secrets client-side**
- **Modular Design**: Components should be self-contained and testable
- **Clear Boundaries**: Well-defined interfaces between modules
- **Single Responsibility**: Each module has one clear purpose

### Code Quality Standards

**TypeScript Strict Mode Requirements**:
- All TypeScript strict flags enabled
- No `any` types allowed - explicit typing required
- Proper null/undefined handling
- Explicit return types for public functions

**Function Design**:
- Single Responsibility - each function does one thing well
- Max 50 lines - keep functions concise and readable
- Pure functions preferred when possible
- Descriptive names that clearly indicate purpose

**Error Handling**:
```typescript
// ✅ Good: Explicit error handling
async function saveAssessment(result: AssessmentResult): Promise<void> {
  try {
    await supabase.from('assessments').insert(result);
  } catch (error) {
    console.error('Failed to save assessment:', error);
    throw new Error('Assessment save failed');
  }
}

// ❌ Bad: Silent failures
async function saveAssessment(result: AssessmentResult) {
  await supabase.from('assessments').insert(result);
}
```

**Tailwind CSS Standards**:
- Logical grouping and sorting of classes
- Custom semantic classes for reusable patterns
- Mobile-first responsive design

**Component Architecture**:
- Clear component structure with TypeScript interfaces
- Props destructuring in function signature
- Typed event handlers
- Composition over inheritance

**File Naming**:
- Components: PascalCase (`AssessmentStepper.tsx`)
- Utilities: camelCase (`scoring.ts`)
- Types: camelCase (`assessment.types.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

**Import Order**:
1. React and Next.js imports
2. Third-party libraries
3. Internal utilities and types
4. Components
5. Styles (if needed)

### When to Use What

**Client Components** (`'use client'`):
- Pages with interactivity
- Forms with React Hook Form
- Components needing `useState`, `useEffect`, event handlers
- Navigation (auth state listening)

**Server Components** (default):
- Static content
- Data fetching from database
- API routes
- Email sending functions

**Server Actions** (`'use server'`):
- Authentication operations
- Sensitive database operations
- Operations requiring service role access

### Important Implementation Notes

1. **Supabase Client Creation**: Use the correct client for your context
   - Browser: `createClient()` from `/utils/supabase/client.ts` (singleton)
   - Server: `await createClient()` from `/utils/supabase/server.ts` (async, cookie-based)

2. **Square Payment Flow**: Always verify webhook signatures before processing

3. **Email Sending**: All email functions are server-side only, never expose Resend API key

4. **Premium Access**: Check user metadata (`has_course_access`, `has_coaching_access`) for feature gating

5. **Assessment Scoring**: Uses `lib/scoring.ts` with tie-breaking algorithm for avatar assignment

6. **Payment Processing**: Webhook handles both `payment.created` and `payment.updated` events, only processes `COMPLETED` status

### Security Checklist

- [ ] Public Supabase anon key only (never service role)
- [ ] Square webhook signatures verified (HMAC-SHA256)
- [ ] Server-side functions for sensitive operations
- [ ] No hardcoded secrets in code
- [ ] Rate limiting considered for public APIs
- [ ] CORS configured appropriately

---

## Related Documentation

### Project Documentation
- **Setup Guide**: `/docs/setup/START_HERE.md`
- **Backend Setup**: `/docs/setup/BACKEND_QUICK_START.md`
- **Environment Setup**: `/docs/setup/ENV_SETUP.md`
- **Design System**: `/docs/development/DESIGN_SYSTEM.md`
- **Payment Setup**: `/docs/features/PAYMENT_SETUP.md`
- **Deployment Guide**: `/docs/deployment/DEPLOYMENT_GUIDE.md`
- **Git Workflow**: `/docs/development/GIT_CHEATSHEET.md`

### External Documentation
- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Square**: https://developer.squareup.com/docs
- **Resend**: https://resend.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com/

---

Last Updated: October 2025
Version: 2.0
