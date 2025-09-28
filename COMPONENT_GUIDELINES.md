# Trajectory Component Development Guidelines

## Overview

This document outlines the mandatory guidelines for developing UI components within the Trajectory platform. All components must follow these patterns to ensure consistency with our **Inspiring Sky Authority** design system.

## Component Architecture

### File Structure

```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── index.ts
├── feature/               # Feature-specific components
│   ├── AssessmentStepper.tsx
│   ├── AvatarBadge.tsx
│   └── ResultCard.tsx
└── layout/               # Layout components
    ├── CanyonHero.tsx
    ├── StrataDivider.tsx
    └── TopNav.tsx
```

### Naming Conventions

- **Components**: PascalCase (`Button`, `AssessmentStepper`)
- **Files**: PascalCase matching component name
- **Props**: camelCase (`className`, `isDisabled`)
- **CSS Classes**: kebab-case or Tailwind utilities

## Component Template

### Basic Component Structure

```tsx
'use client'; // Only if using client-side features

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define variants using CVA for consistency
const componentVariants = cva(
  // Base classes - always include Strata system classes
  "strata-card transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset",
  {
    variants: {
      variant: {
        default: "bg-white border-sky-200",
        primary: "bg-sky-50 border-sky-300",
        accent: "bg-sunset/10 border-sunset/20",
      },
      size: {
        sm: "p-4",
        md: "p-6", 
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

// Props interface with proper TypeScript
interface ComponentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  children: React.ReactNode;
  className?: string;
  // Add specific props here
}

// Component with forwardRef for proper ref handling
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
export type { ComponentProps };
```

## Mandatory Design System Integration

### 1. Strata Classes Usage

Every component MUST use appropriate Strata design system classes:

```tsx
// Cards
<div className="strata-card p-6">

// Buttons  
<button className="strata-button">

// Meters
<div className="strata-meter h-3">
  <div className="strata-meter-fill bg-sky-400" />
</div>

// Text effects
<h1 className="strata-text font-display">

// Inputs
<input className="strata-input" />

// Dividers
<div className="strata-divider" />
```

### 2. Color System Compliance

Only use colors from the approved palette:

```tsx
// Sky colors (primary)
"text-sky-800"     // Dark text
"text-sky-600"     // Medium text  
"text-sky-400"     // Light text
"bg-sky-50"        // Light backgrounds
"border-sky-200"   // Subtle borders

// Canyon accents
"text-sunset"      // Warm highlights
"bg-sunset/10"     // Subtle accent backgrounds
"border-sunset/20" // Accent borders

// Status colors
"text-success"     // Success states
"text-warn"        // Warning states  
"text-danger"      // Error states
```

### 3. Typography Standards

```tsx
// Headings - always use font-display
<h1 className="text-h1 font-display font-bold text-sky-800">
<h2 className="text-h2 font-display font-semibold text-sky-700">
<h3 className="text-h3 font-display font-medium text-sky-700">

// Body text - use font-body (default)
<p className="text-base text-sky-600 leading-relaxed">

// Small text
<span className="text-small text-sky-500">

// Monospace for technical content
<code className="font-mono text-sky-700 bg-sky-50 px-2 py-1 rounded">
```

### 4. Spacing Consistency

Always use the 8px grid system:

```tsx
// Padding/Margin
"p-4"      // 16px
"p-6"      // 24px  
"p-8"      // 32px
"mb-4"     // 16px bottom margin
"space-y-6" // 24px vertical spacing between children

// Gaps
"gap-4"    // 16px
"gap-6"    // 24px
"gap-8"    // 32px
```

## Component Categories

### 1. UI Components (Base Level)

Located in `src/components/ui/`, these are the building blocks:

```tsx
// Button.tsx
export function Button({ variant = "default", size = "md", ...props }) {
  return (
    <button 
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// Card.tsx  
export function Card({ className, ...props }) {
  return (
    <div 
      className={cn("strata-card", className)}
      {...props} 
    />
  );
}
```

### 2. Feature Components

Located in `src/components/feature/`, these implement specific functionality:

```tsx
// AssessmentStepper.tsx
export function AssessmentStepper({ 
  questions, 
  currentIndex, 
  onAnswer,
  className 
}) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="strata-meter h-2">
        <div 
          className="strata-meter-fill bg-sky-400"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Question content */}
    </div>
  );
}
```

### 3. Layout Components

Located in `src/components/layout/`, these handle page structure:

```tsx
// CanyonHero.tsx
export function CanyonHero({ className }) {
  return (
    <section className={cn(
      "relative min-h-screen flex items-center justify-center overflow-hidden",
      className
    )}>
      {/* Hero content with parallax backgrounds */}
    </section>
  );
}
```

## Animation Guidelines

### Using Framer Motion

```tsx
import { motion } from 'framer-motion';

// Standard reveal animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>

// Staggered children
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
  initial="hidden"
  animate="show"
>
```

### Performance Considerations

```tsx
// Good - transform properties
"transform translate-y-2 hover:translate-y-0"

// Avoid - layout-triggering properties
// Don't animate: width, height, padding, margin

// Use will-change sparingly
<div className="will-change-transform">
```

## Accessibility Requirements

### Keyboard Navigation

```tsx
// Focusable elements must have proper focus styles
<button 
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset focus-visible:ring-offset-2"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

### ARIA Labels

```tsx
// Descriptive labels
<button aria-label="Start assessment">
  <PlayIcon />
</button>

// Status announcements
<div 
  role="status" 
  aria-live="polite"
  className="sr-only"
>
  {statusMessage}
</div>

// Form associations
<label htmlFor="email" className="block text-sm font-medium text-sky-800">
  Email Address
</label>
<input 
  id="email"
  type="email"
  className="strata-input"
  aria-describedby="email-help"
/>
<p id="email-help" className="text-xs text-sky-500">
  We'll never share your email
</p>
```

### Color Contrast

Ensure all text meets AA standards:

```tsx
// Good contrast combinations
"text-sky-800 bg-sky-50"    // 12.6:1 ratio
"text-sky-700 bg-white"     // 8.2:1 ratio  
"text-white bg-sky-600"     // 4.9:1 ratio

// Check with tools like WebAIM Color Contrast Checker
```

## Responsive Design Patterns

### Mobile-First Approach

```tsx
<div className="
  text-lg md:text-xl lg:text-2xl
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
">
```

### Touch-Friendly Interactions

```tsx
// Minimum 44px touch targets
<button className="min-h-[44px] min-w-[44px] p-3">

// Adequate spacing between interactive elements
<div className="space-y-4 md:space-y-2">
```

## Testing Requirements

### Component Testing Template

```tsx
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  it('renders with default props', () => {
    render(<Component>Test content</Component>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Component className="custom-class">Test</Component>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles interactions correctly', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick}>Test</Component>);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('meets accessibility standards', () => {
    render(<Component>Test content</Component>);
    // Add accessibility-specific tests
  });
});
```

### Visual Testing

```tsx
// Component.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from './Component';

const meta: Meta<typeof Component> = {
  title: 'UI/Component',
  component: Component,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default component',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary variant',
  },
};
```

## Performance Optimization

### Bundle Size Considerations

```tsx
// Good - tree-shakeable imports
import { Button } from '@/components/ui/Button';

// Avoid - importing entire libraries
import * as Icons from 'lucide-react';

// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div className="animate-pulse bg-sky-100 h-32 rounded" />
});
```

### Memoization Patterns

```tsx
import { memo, useMemo, useCallback } from 'react';

// Memo for expensive renders
const ExpensiveComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return heavyProcessing(data);
  }, [data]);

  const handleAction = useCallback((id) => {
    onAction(id);
  }, [onAction]);

  return (
    <div className="strata-card p-6">
      {processedData.map(item => (
        <button 
          key={item.id}
          onClick={() => handleAction(item.id)}
          className="strata-button"
        >
          {item.name}
        </button>
      ))}
    </div>
  );
});
```

## Quality Checklist

Before submitting any component:

### Design System Compliance
- [ ] Uses appropriate Strata design system classes
- [ ] Follows approved color palette
- [ ] Maintains 8px spacing grid
- [ ] Uses correct typography scale
- [ ] Includes proper focus states

### Code Quality
- [ ] TypeScript interfaces defined
- [ ] Props properly typed
- [ ] forwardRef implemented where needed
- [ ] className prop accepted for extensibility
- [ ] Clean, readable code structure

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast meets AA standards
- [ ] ARIA labels where appropriate
- [ ] Focus management implemented

### Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization used
- [ ] Bundle size impact considered
- [ ] Animations are 60fps

### Testing
- [ ] Unit tests written
- [ ] Accessibility tests included
- [ ] Visual regression tests
- [ ] Works across browsers/devices

### Documentation
- [ ] Storybook story created
- [ ] Props documented
- [ ] Usage examples provided
- [ ] Accessibility notes included

## Common Patterns

### Form Components

```tsx
export function FormField({ 
  label, 
  error, 
  required, 
  children,
  className 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-sky-800">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Loading States

```tsx
export function LoadingState({ className }) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400" />
      <span className="ml-3 text-sky-600">Loading...</span>
    </div>
  );
}
```

### Error Boundaries

```tsx
export function ErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundaryComponent
      fallback={
        <div className="strata-card p-8 text-center">
          <p className="text-danger mb-4">Something went wrong</p>
          <button 
            className="strata-button"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
```

Following these guidelines ensures every component contributes to the cohesive, professional experience that makes users feel ready to soar to new heights.
