# Project Context & Memory Skill

Everything Claude needs to remember about Trajectory. The mission, the vision, the transformation.

## Core Mission & Vision

### The Mission
**"Improving the better way of life"** - Not about money initially. About transformation. About killing the boy and becoming the man.

### The Vision
Create a global movement where men stop accepting mediocrity and start building their trajectory. Every feature, every line of code, every pixel serves this transformation.

### The Philosophy
- **Kill the Boy**: Let go of childish patterns, excuses, and mediocrity
- **Become the Man**: Rise into discipline, purpose, and excellence
- **Build Your Trajectory**: Design your path from Drifter → Balancer → Architect

## Key Context to Remember

### 1. Brand Voice & Personality
```typescript
const trajectoryVoice = {
  tone: "Stoic, authoritative, slightly edgy",
  
  personality: {
    primary: "Wise mentor who's been there",
    secondary: "No-nonsense truth-teller",
    avoid: "Motivational fluff, corporate speak, weak language",
  },
  
  speakingStyle: {
    jean: {
      phrases: [
        "Listen, brother...",
        "Here's the truth nobody tells you...",
        "Stop lying to yourself about...",
        "The difference between boys and men is...",
        "Your trajectory changes when...",
      ],
      
      avoidPhrases: [
        "You've got this!", // Too cheerleader
        "Just believe in yourself", // Too fluffy
        "Follow your passion", // Too cliché
        "Good job!", // Too patronizing
      ],
    },
  },
  
  contentRules: {
    always: [
      "Speak directly to 'you'",
      "Use concrete examples",
      "Challenge comfortable thinking",
      "Provide actionable steps",
      "Reference transformation journey",
    ],
    
    never: [
      "Use academic jargon",
      "Sugarcoat harsh truths",
      "Make excuses for mediocrity",
      "Use corporate buzzwords",
      "Sound like a therapist",
    ],
  },
};
```

### 2. User Journey Map
```typescript
const userJourneyStages = {
  1: {
    name: "Awareness",
    userState: "Knows something's wrong but can't articulate it",
    content: "Mirror their frustration, show them they're not alone",
    goal: "Get them to take assessment",
  },
  
  2: {
    name: "Discovery",
    userState: "Taking assessment, learning their avatar",
    content: "Build anticipation, make it feel significant",
    goal: "Complete assessment + give email",
  },
  
  3: {
    name: "Consideration",
    userState: "Received results, considering course",
    content: "Show transformation possibility, urgency to act",
    goal: "Purchase course within 7 days",
  },
  
  4: {
    name: "Commitment",
    userState: "Purchased course, starting journey",
    content: "Cement their decision, build excitement",
    goal: "Complete first module",
  },
  
  5: {
    name: "Transformation",
    userState: "Working through course",
    content: "Maintain momentum, celebrate progress",
    goal: "Complete course + see real changes",
  },
  
  6: {
    name: "Advocacy",
    userState: "Transformed, want to help others",
    content: "Give them tools to share, build community",
    goal: "Refer others, join coaching",
  },
};
```

### 3. Product Ecosystem
```typescript
const trajectoryProducts = {
  assessment: {
    name: "Kill the Boy Assessment",
    price: "Free",
    purpose: "Awareness + lead generation",
    conversion: "Email capture before results",
    avatars: ["Drifter", "Balancer", "Architect"],
  },
  
  course: {
    name: "Rethink. Redesign. Reignite.",
    price: "$99.99",
    duration: "31 days",
    modules: 6,
    format: "Conversational between Jean and user",
    promise: "Transform from boy to man in 31 days",
  },
  
  coaching: {
    name: "Trajectory Coaching",
    price: "$24.99 application, $400/month program",
    purpose: "High-touch transformation",
    selection: "Application + interview process",
  },
  
  future: {
    community: "Brotherhood of architects",
    mobileApp: "Daily transformation in your pocket",
    certifications: "Trajectory Coach certification",
    conferences: "Annual Trajectory Summit",
    book: "Kill the Boy book + audiobook",
  },
};
```

### 4. Design System Memory
```typescript
const designPhilosophy = {
  core: "Apple-grade quality, sky-inspired beauty",
  
  principles: {
    space: "Generous whitespace, let it breathe like open sky",
    typography: "Strong hierarchy, confident sizing",
    color: "Sky palette (hope) + sunset accents (warmth)",
    motion: "Subtle, purposeful, 60fps always",
    interaction: "Instant feedback, satisfying to use",
  },
  
  emotions: {
    landing: "Awe + possibility",
    assessment: "Significance + anticipation",
    results: "Revelation + urgency",
    course: "Transformation + progress",
    completion: "Achievement + brotherhood",
  },
  
  neverDo: [
    "Cramped layouts",
    "Weak typography",
    "Stock photography",
    "Generic illustrations",
    "Boring forms",
    "Slow interactions",
  ],
};
```

### 5. Technical Architecture
```typescript
const techStack = {
  frontend: {
    framework: "Next.js 15.5.4 (App Router)",
    ui: "React 19 + TypeScript",
    styling: "Tailwind CSS v4 + Framer Motion",
    components: "Radix UI + custom",
  },
  
  backend: {
    api: "Next.js API routes",
    database: "Supabase PostgreSQL",
    auth: "Supabase Auth",
    storage: "Supabase Storage",
  },
  
  integrations: {
    payments: "Square",
    email: "Resend + React Email",
    sms: "Twilio",
    scheduling: "Calendly",
    analytics: "GA4 + custom",
  },
  
  deployment: {
    hosting: "Vercel",
    domain: "trajectorygroup.org",
    monitoring: "Vercel Analytics + custom",
  },
};
```

### 6. Business Context
```typescript
const businessContext = {
  entity: {
    name: "Trajectory Group LLC",
    status: "Active LLC with business credit",
    team: ["Jean (Founder)", "Support team"],
  },
  
  metrics: {
    assessments: "12,847+ completed",
    courseMembers: "3,421+ enrolled",
    successRate: "4.9/5 rating",
    targetGrowth: "10,000 members by end of year",
  },
  
  competition: {
    differentiation: [
      "Stoic/masculine approach vs feel-good content",
      "31-day transformation vs endless courses",
      "Brotherhood focus vs solo journey",
      "Practical FastLane principles vs theory",
    ],
  },
  
  expansion: {
    phase1: "Perfect core experience (current)",
    phase2: "Scale with community features",
    phase3: "Certification + coaching network",
    phase4: "Global movement + conferences",
  },
};
```

### 7. Content Patterns
```typescript
const contentPatterns = {
  emailSubjects: {
    pattern: "[Benefit] + [Curiosity] + [Urgency optional]",
    examples: [
      "Your assessment results (what they mean for your future)",
      "One thing to do today (takes 5 minutes)",
      "Why 95% stay boys (harsh truth inside)",
    ],
  },
  
  ctaButtons: {
    primary: [
      "Start Your Transformation",
      "Take the Assessment",
      "Claim Your Trajectory",
      "Begin Your Journey",
    ],
    
    secondary: [
      "Learn More",
      "See How It Works",
      "Read Success Stories",
    ],
    
    avoid: [
      "Submit", // Too generic
      "Click Here", // Too weak
      "Get Started", // Overused
      "Sign Up", // Not transformative
    ],
  },
  
  headlines: {
    pattern: "Challenge + Promise + Urgency",
    formulas: [
      "Kill the Boy, Become the Man",
      "Your Trajectory Changes Today",
      "31 Days to Transform Your Life",
      "From Drifter to Architect",
    ],
  },
};
```

### 8. User Avatars Deep Dive
```typescript
const avatarProfiles = {
  drifter: {
    score: "1.0-3.1",
    mindset: "Reactive, excuse-making, consuming",
    dailyLife: "No routine, Netflix, scroll social media",
    pain: "Knows he's wasting potential",
    messaging: "Wake up call + urgent action needed",
    transformation: "Needs structure and accountability",
  },
  
  balancer: {
    score: "3.2-4.1",
    mindset: "Trying but inconsistent, some progress",
    dailyLife: "Some good habits, falls off wagon",
    pain: "Frustrated by lack of breakthrough",
    messaging: "You're close, need system not motivation",
    transformation: "Needs consistency and strategy",
  },
  
  architect: {
    score: "4.2-5.0",
    mindset: "Building, designing, creating",
    dailyLife: "Structured, purposeful, growing",
    pain: "Wants to scale and help others",
    messaging: "Time to lead and multiply impact",
    transformation: "Needs leverage and leadership",
  },
};
```

### 9. Conversion Optimization Rules
```typescript
const conversionRules = {
  assessment: {
    hook: "Question their current reality",
    promise: "Reveal hidden truth about themselves",
    friction: "Remove all barriers except email",
    urgency: "Limited time to see results",
  },
  
  emailCapture: {
    value: "Results + transformation roadmap",
    objection: "We don't spam, unsubscribe anytime",
    design: "Can't miss it, beautiful form",
  },
  
  courseSales: {
    pattern: "Problem → Agitate → Solution → Urgency",
    socialProof: "Show others transforming now",
    guarantee: "30-day money back, no risk",
    scarcity: "Launch pricing, enrollment windows",
  },
  
  retention: {
    earlyWin: "Quick victory in first 48 hours",
    momentum: "Daily progress visibility",
    community: "Others on same journey",
    celebration: "Milestone recognition",
  },
};
```

### 10. Future Features Context
```typescript
const futureFeatures = {
  community: {
    purpose: "Brotherhood of men transforming",
    features: [
      "Private forums by avatar level",
      "Accountability partners matching",
      "Local meetup organization",
      "Success story sharing",
      "Peer coaching circles",
    ],
    monetization: "Premium community tier",
  },
  
  mobile: {
    purpose: "Daily transformation companion",
    features: [
      "Morning trajectory check-in",
      "Daily action reminders",
      "Progress tracking",
      "Quick lesson consumption",
      "Brotherhood chat",
    ],
    launch: "After 5,000 active users",
  },
  
  certifications: {
    purpose: "Create army of transformation leaders",
    levels: [
      "Trajectory Guide (help others start)",
      "Trajectory Coach (paid coaching)",
      "Trajectory Trainer (teach coaches)",
    ],
    requirement: "Complete course + results + application",
  },
  
  ai: {
    purpose: "Personalized transformation assistant",
    features: [
      "Custom action plans",
      "Progress analysis",
      "Accountability check-ins",
      "Content recommendations",
      "Coaching conversations",
    ],
    implementation: "Start simple, learn from usage",
  },
};
```

## Important Memories

### What Works
- Direct, challenging language resonates
- Men want structure, not motivation
- Visual progress drives engagement  
- Community aspect is powerful
- 31-day timeframe creates urgency
- Stoic aesthetic stands out

### What Doesn't Work  
- Soft, feel-good messaging
- Complex onboarding
- Too many choices
- Slow loading pages
- Generic content
- Weak CTAs

### User Feedback Themes
- "Finally something that speaks to men"
- "The assessment was a wake-up call"  
- "31 days actually changed my life"
- "Wish I found this sooner"
- "The conversational format is genius"
- "Feel like Jean knows exactly where I am"

## Development Principles

1. **Every feature must serve transformation** - If it doesn't help men change, cut it
2. **Speed is essential** - Slow sites kill transformation momentum  
3. **Quality over quantity** - One perfect feature > ten mediocre ones
4. **Test with real users** - Developers aren't the target audience
5. **Data drives decisions** - Track everything, assume nothing
6. **Mobile-first always** - Most transformations happen on phones
7. **Accessibility matters** - Transformation is for everyone

## Remember: This Isn't Just a Course

This is a movement. A brotherhood. A new way for men to live.

Every line of code should reflect that mission.
