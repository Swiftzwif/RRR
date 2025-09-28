# Component API Contracts

## Core Components

### TopNav
**Purpose**: Minimal navigation with logo and essential links
**Props**:
```typescript
interface TopNavProps {
  className?: string;
  showLogo?: boolean;
  showAuth?: boolean;
}
```

### HeroCard
**Purpose**: Landing page hero section with main CTA
**Props**:
```typescript
interface HeroCardProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  secondaryCTA?: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
}
```

### ProgressBar
**Purpose**: Quiz progress indicator
**Props**:
```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}
```

### QuestionCard
**Purpose**: Individual quiz question with Likert scale
**Props**:
```typescript
interface QuestionCardProps {
  question: string;
  domain: string;
  value: number;
  onChange: (value: number) => void;
  microcopy?: string;
}
```

### MiniMeter
**Purpose**: Side rail domain progress meter
**Props**:
```typescript
interface MiniMeterProps {
  domain: string;
  level: 'low' | 'mid' | 'high';
  progress: number; // 0-100 (internal only)
  nextMilestone: string;
  className?: string;
}
```

### EmailGate
**Purpose**: Blocking modal for email capture
**Props**:
```typescript
interface EmailGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}
```

### AvatarReveal
**Purpose**: End animation for avatar reveal
**Props**:
```typescript
interface AvatarRevealProps {
  avatar: string;
  onComplete: () => void;
  className?: string;
}
```

### DomainStatCard
**Purpose**: Results page domain display with meter and actions
**Props**:
```typescript
interface DomainStatCardProps {
  domain: string;
  level: 'low' | 'mid' | 'high';
  progress: number; // 0-100 (internal only)
  nextMilestone: string;
  sevenDayPlay: string;
  isFocusArea?: boolean;
  className?: string;
}
```

### OfferStripe
**Purpose**: Course offer section
**Props**:
```typescript
interface OfferStripeProps {
  title: string;
  description: string;
  cta: string;
  onCTAClick: () => void;
  className?: string;
}
```

### CTAButton
**Purpose**: Primary and secondary action buttons
**Props**:
```typescript
interface CTAButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}
```

### MicroToast
**Purpose**: Non-blocking level-up notifications
**Props**:
```typescript
interface MicroToastProps {
  message: string;
  type?: 'success' | 'info';
  duration?: number;
  onClose: () => void;
}
```

### FooterLegal
**Purpose**: Legal links and privacy notice
**Props**:
```typescript
interface FooterLegalProps {
  className?: string;
}
```

## Component States

### Loading States
- All interactive components should show loading states
- Use skeleton loaders for content-heavy components
- Disable interactions during loading

### Error States
- Form validation with clear error messages
- Network error handling with retry options
- Graceful degradation for missing data

### Empty States
- Helpful messaging for empty quiz results
- Clear CTAs for empty states
- Consistent illustration style

## Animation Guidelines

### Micro-interactions
- Button hover: 200ms ease
- Focus states: 150ms ease
- Form validation: 300ms spring

### Level-up Animations
- Sparkle effect: ≤1s duration
- Meter fill: 300ms spring easing
- Toast slide-in: 200ms ease

### Page Transitions
- Route changes: 300ms ease
- Modal open/close: 200ms ease
- Respect reduced motion preferences

## Accessibility Requirements

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators
- Escape key closes modals

### Screen Readers
- Proper ARIA labels
- Semantic HTML structure
- Live regions for dynamic content
- Alt text for all images

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Color is not the only indicator of state
