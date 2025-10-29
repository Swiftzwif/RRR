# UI Component Builder Skill

This skill helps build new UI components following the Trajectory design system.

## When to Use This Skill

Use this skill when you need to create a new React component that follows the project's design standards.

## Design System Quick Reference

**Colors**: Sky-inspired palette (sky-50 through sky-800), sunset accents
**Typography**: Inter (body), Clash Display (headings), JetBrains Mono (code)
**Spacing**: 8px grid (space-2 = 8px, space-4 = 16px, space-6 = 24px, etc.)
**Border Radius**: 8-12px for professional feel

## Component Template

```typescript
// components/[ComponentName].tsx
'use client'

import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
}

export function [ComponentName]({
  children,
  className,
  variant = 'default',
  size = 'md'
}: [ComponentName]Props) {
  const variantClasses = {
    default: 'bg-white border border-sky-200 text-sky-800',
    accent: 'bg-sunset text-white',
    subtle: 'bg-sky-50 border border-sky-100 text-sky-700'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <div className={cn(
      'rounded-lg transition-colors duration-200',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}
```

## Checklist

When building a component:
- [ ] TypeScript interface for props
- [ ] Variants for different use cases
- [ ] Size options (sm, md, lg)
- [ ] className prop for customization
- [ ] Uses cn() utility for class merging
- [ ] Follows design system colors
- [ ] Responsive design (mobile-first)
- [ ] Accessibility (ARIA labels if interactive)
- [ ] Framer Motion for animations (if needed)

## Testing Checklist

Before committing:
- [ ] Test in browser at http://localhost:3000
- [ ] Check console for errors
- [ ] Test all variants
- [ ] Test all sizes
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Verify accessibility (keyboard navigation)
