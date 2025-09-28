# @trajectory/theme

The Trajectory Design System theme package providing consistent styling across all applications.

## Overview

This package contains the core design system for the Trajectory platform, implementing the **Inspiring Sky Authority** aesthetic with professional, stoic design patterns that make users feel ready to soar.

## Installation

```bash
# In your app directory
npm install @trajectory/theme
```

## Usage

### In Next.js Applications

#### 1. Import Global Styles

```tsx
// app/globals.css
@import "@trajectory/theme/globals.css";
```

#### 2. Extend Tailwind Config

```js
// tailwind.config.js
import sharedConfig from '@trajectory/theme/tailwind.config.js';

export default {
  ...sharedConfig,
  content: [
    "./app/**/*.{ts,tsx}", 
    "./components/**/*.{ts,tsx}", 
    "./src/**/*.{ts,tsx}"
  ],
};
```

## Design System Classes

### Core Strata Classes

```css
.strata-gradient     /* Sky-inspired background gradient */
.strata-text         /* Sky gradient text effect */
.strata-shadow       /* Professional sky-inspired shadow */
.strata-glow         /* Subtle glow effect */
.strata-card         /* Professional card styling */
.strata-button       /* Primary button styling */
.strata-meter        /* Progress/score meter background */
.strata-meter-fill   /* Progress/score meter fill */
.strata-divider      /* Section dividers */
.strata-input        /* Form input styling */
```

### Usage Examples

#### Cards
```tsx
<div className="strata-card p-6">
  <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
    Card Title
  </h3>
  <p className="text-sky-600 leading-relaxed">
    Card content with proper spacing.
  </p>
</div>
```

#### Buttons
```tsx
<button className="strata-button">
  Primary Action
</button>
```

#### Meters
```tsx
<div className="strata-meter h-3 relative">
  <div 
    className="strata-meter-fill bg-sky-400"
    style={{ width: '60%' }}
  />
</div>
```

#### Text Effects
```tsx
<h1 className="text-5xl font-display font-bold">
  <span className="strata-text">
    Inspiring Headline
  </span>
</h1>
```

## Color System

### Sky Colors
- `sky-50` to `sky-800`: Primary blue palette
- `sunset`: Golden accent color (`#F59E0B`)
- `sunset-dark`: Deep sunset (`#D97706`)
- `glow`: Warm glow (`#FCD34D`)

### Status Colors
- `success`: Growth green (`#10B981`)
- `warn`: Caution amber (`#F59E0B`)
- `danger`: Error red (`#EF4444`)

## Typography

### Font Families
- `font-display`: General Sans, Clash Display (headings)
- `font-body`: Inter (body text)

### Font Sizes
- `text-h1` to `text-h6`: Heading sizes
- `text-base`: 18px body text
- `text-small`: 16px small text
- `text-xs`: 14px extra small

## Spacing

8px grid system:
- `xs`: 8px
- `sm`: 12px  
- `md`: 16px
- `lg`: 20px
- `xl`: 24px
- `2xl`: 32px
- `3xl`: 48px
- `4xl`: 64px
- `5xl`: 96px
- `6xl`: 128px

## Animations

### Standard Animations
- `animate-strata-float`: Gentle floating effect
- `animate-strata-pulse`: Subtle pulsing glow
- `animate-fade-slide-up`: Content reveal animation

### Durations
- `duration-fast`: 200ms
- `duration-normal`: 300ms
- `duration-slow`: 500ms

## Best Practices

### Do's ✅
- Use Strata design system classes consistently
- Maintain generous whitespace (8px grid)
- Follow professional, stoic aesthetic
- Ensure AA accessibility compliance
- Test responsive design on all breakpoints
- Use semantic HTML with proper ARIA labels

### Don'ts ❌
- Override core Strata classes
- Use colors outside the defined palette
- Create cramped layouts without breathing room
- Add flashy or distracting animations
- Use non-professional fonts
- Skip accessibility considerations

## Development

### Building the Package

```bash
npm run build
```

### Testing Styles

```bash
npm run test:styles
```

### Linting

```bash
npm run lint:css
```

## Compatibility

- Next.js 14+
- React 18+
- Tailwind CSS 3.4+
- TypeScript 5+

## Support

For questions about the design system, refer to:
- [UI Design System Documentation](../UI_DESIGN_SYSTEM.md)
- [Component Examples](../packages/ui/components/)
- [Workspace Rules](../.cursor-rules)
