# Apple-Grade UI Skill

Build interfaces that feel expensive, intentional, and transformative. Every pixel matters.

## Core Principles

**The Apple Standard:**

- Generous whitespace (breathe like open sky)
- Perfect typography (hierarchy that guides)
- Subtle animations (60fps, no jank)
- Flawless interactions (instant response)
- Consistent spacing (8px grid religiously)

## Component Patterns

### Hero Sections

```tsx
// Life-changing first impression
<section className="min-h-screen flex items-center relative overflow-hidden">
  {/* Subtle gradient background */}
  <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100/50" />
  
  {/* Content with perfect spacing */}
  <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
    <div className="max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-sky-900 mb-6">
        Kill the Boy.
        <span className="text-sky-600 block mt-2">Become the Man.</span>
      </h1>
      <p className="text-xl md:text-2xl text-sky-700 leading-relaxed mb-10 max-w-2xl">
        Your trajectory changes today. Not tomorrow. Not next week. Right now.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button size="lg" className="text-lg px-8">
          Start Assessment
        </Button>
        <Button variant="ghost" size="lg" className="text-lg">
          Watch Story
        </Button>
      </div>
    </div>
  </div>
</section>
```

### Cards That Breathe

```tsx
// Not cramped, not empty - just right
<Card className="p-8 md:p-10 space-y-6 hover:shadow-xl transition-all duration-300 border-sky-200">
  <div className="space-y-2">
    <h3 className="text-2xl font-semibold text-sky-900">
      Module 1: Kill the Boy
    </h3>
    <p className="text-sky-600">
      31 days to transform your mindset
    </p>
  </div>
  
  <div className="space-y-4">
    <Progress value={33} className="h-2" />
    <p className="text-sm text-sky-500">
      Day 10 of 31 completed
    </p>
  </div>
  
  <Button className="w-full" size="lg">
    Continue Journey
  </Button>
</Card>
```

### Micro-Interactions

```tsx
// Every interaction feels intentional
const AnimatedButton = ({ children, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ 
      type: "spring", 
      stiffness: 400, 
      damping: 17 
    }}
    className="relative overflow-hidden"
    {...props}
  >
    {/* Subtle shine effect on hover */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
      initial={{ x: "-100%" }}
      whileHover={{ x: "100%" }}
      transition={{ duration: 0.6 }}
    />
    <span className="relative">{children}</span>
  </motion.button>
);
```

## Typography Hierarchy

```css
/* Clash Display for impact */
.heading-hero {
  @apply text-7xl md:text-8xl font-bold tracking-tight leading-[0.9];
}

.heading-section {
  @apply text-4xl md:text-5xl font-bold tracking-tight;
}

.heading-card {
  @apply text-2xl md:text-3xl font-semibold;
}

/* Inter for clarity */
.body-large {
  @apply text-xl md:text-2xl leading-relaxed;
}

.body-base {
  @apply text-base md:text-lg leading-relaxed;
}

.body-small {
  @apply text-sm md:text-base;
}
```

## Animation Patterns

### Page Transitions

```tsx
// Smooth, confident transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};
```

### Stagger Children

```tsx
// Content reveals with purpose
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};
```

## Responsive Perfection

```tsx
// Mobile-first, always
<div className="
  px-6 py-12        // Mobile base
  md:px-8 md:py-16  // Tablet bump  
  lg:px-12 lg:py-24 // Desktop luxury
  max-w-7xl mx-auto
">
```

## Loading States

```tsx
// Never leave users hanging
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-sky-200 rounded w-3/4 mb-4" />
    <div className="h-4 bg-sky-100 rounded w-full mb-2" />
    <div className="h-4 bg-sky-100 rounded w-5/6" />
  </div>
);
```

## Error States

```tsx
// Errors that don't feel like failures
<div className="text-center py-12 px-6">
  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <XCircle className="w-8 h-8 text-red-600" />
  </div>
  <h3 className="text-lg font-semibold text-gray-900 mb-2">
    Payment didn't go through
  </h3>
  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
    No worries - this happens sometimes. Your card wasn't charged.
  </p>
  <Button onClick={retry}>
    Try Again
  </Button>
</div>
```

## Polish Checklist

- [ ] Every element has proper padding
- [ ] Consistent border radius (8-12px)
- [ ] Shadows are subtle (shadow-sm, shadow-md max)
- [ ] Text has proper line height
- [ ] Interactive elements have hover states
- [ ] Focus states are beautiful, not default
- [ ] Transitions use spring physics
- [ ] Loading states for every async action
- [ ] Empty states that inspire action
- [ ] Error states that maintain trust

## Color Application

```tsx
// Sky-inspired palette application
const colorClasses = {
  // Backgrounds
  surface: "bg-white",
  surfaceAlt: "bg-sky-50",
  surfaceHover: "bg-sky-100",
  
  // Text
  textPrimary: "text-sky-900",
  textSecondary: "text-sky-700",
  textMuted: "text-sky-500",
  
  // Borders
  borderDefault: "border-sky-200",
  borderHover: "border-sky-300",
  borderFocus: "border-sky-500",
  
  // Accents
  accentBg: "bg-sunset",
  accentText: "text-sunset",
  accentHover: "bg-sunset-dark"
};
```

## Final Polish

Always apply these finishing touches:

1. **Scroll Performance**: Use `will-change` sparingly
2. **Image Optimization**: Next.js Image with proper sizes
3. **Font Loading**: Preload critical fonts
4. **Interaction Feedback**: Instant visual response
5. **Accessibility**: Never sacrifice for aesthetics
