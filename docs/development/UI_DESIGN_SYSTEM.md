# Trajectory UI Design System

## Overview

The Trajectory UI Design System embodies **Inspiring Sky Authority** - a sophisticated sky-inspired design that makes users feel alive and ready to soar. Every element is crafted to create a breathable experience with generous whitespace and clean layouts that let content breathe like open sky.

## Design Philosophy

### Core Principles

1. **Inspiring Sky Authority**: Sophisticated design that inspires action and confidence
2. **Breathable Experience**: Generous whitespace creates comfortable, uncluttered interfaces
3. **Memorable Journey**: Every interaction feels intentional and uplifting
4. **Masculine Sophistication**: Strong typography and confident spacing appeal to high-value men

## Color System

### Primary Sky Colors

```css
--sky-50: #F0F9FF;   /* Lightest sky - clean backgrounds */
--sky-100: #E0F2FE;  /* Light sky - subtle contrast */
--sky-200: #BAE6FD;  /* Medium sky - gentle borders */
--sky-300: #7DD3FC;  /* Baby blue - soft accents */
--sky-400: #38BDF8;  /* Electric blue - primary actions */
--sky-500: #0EA5E9;  /* Strong blue - hover states */
--sky-600: #0284C7;  /* Deep blue - strong text */
--sky-700: #0369A1;  /* Darker blue - headings */
--sky-800: #075985;  /* Deepest blue - authoritative */
```

### Canyon Accent Colors

```css
--sunset: #F59E0B;      /* Golden sunset - warm highlights */
--sunset-dark: #D97706; /* Deep sunset - hover states */
--glow: #FCD34D;        /* Warm glow - highlights */
```

### Status Colors

```css
--success: #10B981;  /* Growth, achievement */
--warn: #F59E0B;     /* Caution, attention */
--danger: #EF4444;   /* Error, critical */
```

## Typography

### Font Families

- **Display**: General Sans, Clash Display - Canyon-inspired, authoritative headings
- **Body**: Inter - Clean, professional, highly readable
- **Monospace**: JetBrains Mono - Technical, precise

### Typography Scale

```css
h1: 40px / 1.2
h2: 32px / 1.2
h3: 28px / 1.2
h4: 24px / 1.2
h5: 20px / 1.2
h6: 18px / 1.2
body: 18px / 1.6
small: 16px / 1.5
xs: 14px / 1.5
```

## Spacing System

Based on 8px grid with emphasis on breathing room:

```css
xs: 8px
sm: 12px
md: 16px
lg: 20px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
5xl: 96px
6xl: 128px
```

## Component Library

### Strata Design System Classes

#### Core Layout Classes

```css
.strata-gradient {
  background: linear-gradient(135deg, var(--sky-50) 0%, var(--sky-200) 50%, var(--sky-50) 100%);
}

.sky-gradient {
  background: linear-gradient(135deg, var(--sky-400) 0%, var(--sky-500) 100%);
}

.sunset-gradient {
  background: linear-gradient(135deg, var(--sunset) 0%, var(--sunset-dark) 100%);
}
```

#### Text Effects

```css
.strata-text {
  background: linear-gradient(135deg, var(--sky-400), var(--sky-600));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

#### Shadows and Effects

```css
.strata-shadow {
  box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.2);
}

.strata-glow {
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}
```

### Component Patterns

#### Cards

```tsx
<div className="strata-card p-6">
  <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
    Card Title
  </h3>
  <p className="text-sky-600 leading-relaxed">
    Card content with proper spacing and typography.
  </p>
</div>
```

#### Buttons

```tsx
<button className="strata-button">
  Primary Action
</button>

// Or using the Button component
<Button variant="default" size="lg">
  Primary Action
</Button>
```

#### Meters/Progress Bars

```tsx
<div className="strata-meter h-3 relative">
  <div 
    className="strata-meter-fill bg-sky-400"
    style={{ width: '60%' }}
  />
</div>
```

#### Form Inputs

```tsx
<input 
  className="strata-input w-full"
  placeholder="Enter your email"
/>
```

#### Dividers

```tsx
<StrataDivider />
// or
<div className="strata-divider" />
```

## Animation Guidelines

### Principles

- **Subtle and Purposeful**: Animations enhance UX without being distracting
- **Performance First**: 60fps target, no layout thrashing
- **Respectful**: Honor `prefers-reduced-motion`

### Standard Durations

```css
fast: 200ms
normal: 300ms
slow: 500ms
```

### Easing Functions

```css
/* Professional ease for most interactions */
cubic-bezier(0.22, 0.61, 0.36, 1)

/* Spring effect for special interactions */
cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Animation Classes

```css
.animate-strata-float {
  animation: strata-float 6s ease-in-out infinite;
}

.animate-strata-pulse {
  animation: strata-pulse 3s infinite;
}

.animate-fade-slide-up {
  animation: fade-slide-up 0.45s cubic-bezier(.22,.61,.36,1) forwards;
}
```

## Layout Patterns

### Hero Section

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background layers */}
  <div className="absolute inset-0">
    {/* Parallax layers */}
  </div>
  
  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
      <span className="strata-text">
        Inspiring Headline
      </span>
    </h1>
    <p className="text-xl md:text-2xl text-sky-600 mb-8 max-w-3xl mx-auto leading-relaxed">
      Supporting description that breathes.
    </p>
  </div>
</section>
```

### Content Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {items.map((item, index) => (
    <div key={index} className="strata-card p-6">
      {/* Card content */}
    </div>
  ))}
</div>
```

### Form Layout

```tsx
<form className="space-y-6 max-w-md mx-auto">
  <div>
    <label className="block text-sm font-medium text-sky-800 mb-2">
      Email Address
    </label>
    <input 
      type="email"
      className="strata-input w-full"
      placeholder="your@email.com"
    />
  </div>
  <button type="submit" className="strata-button w-full">
    Submit
  </button>
</form>
```

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
<div className="text-lg md:text-xl lg:text-2xl">
  Responsive text that scales appropriately
</div>
```

## Accessibility Standards

### Color Contrast

- **AA Compliance**: Minimum 4.5:1 for normal text
- **AAA Preferred**: 7:1 for enhanced readability
- **Large Text**: Minimum 3:1 for 18px+ or bold 14px+

### Focus Management

```css
*:focus-visible {
  outline: 2px solid var(--sunset);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Interactive Elements

- **Touch Targets**: Minimum 44px for mobile
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML

## Implementation Guidelines

### CSS Architecture

1. **Utility-First**: Use Tailwind CSS for most styling
2. **Component Classes**: Use Strata classes for consistent patterns
3. **Custom Properties**: Use CSS variables for theme values
4. **Responsive**: Mobile-first responsive design

### Component Development

```tsx
// Example component following design system
interface CardProps {
  title: string;
  description: string;
  className?: string;
}

export function Card({ title, description, className }: CardProps) {
  return (
    <div className={cn("strata-card p-6", className)}>
      <h3 className="text-xl font-display font-semibold text-sky-800 mb-4">
        {title}
      </h3>
      <p className="text-sky-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
```

### Quality Checklist

Before shipping any UI:

- [ ] Uses appropriate Strata design system classes
- [ ] Follows 8px spacing grid
- [ ] Maintains generous whitespace
- [ ] Uses professional color palette
- [ ] Includes proper focus states
- [ ] Tests on multiple screen sizes
- [ ] Validates accessibility with tools
- [ ] Respects reduced motion preferences
- [ ] Maintains 60fps animations
- [ ] Follows semantic HTML structure

## Maintenance

### Regular Reviews

- **Monthly**: Review component usage and consistency
- **Quarterly**: Audit color usage and accessibility
- **Bi-annually**: Update design tokens and patterns

### Evolution Guidelines

- **Additions**: New components must follow existing patterns
- **Changes**: Breaking changes require team discussion
- **Deprecation**: Gradual migration with clear timelines

This design system ensures every interface feels like an inspiring journey through open sky, ready to help users soar to new heights.
