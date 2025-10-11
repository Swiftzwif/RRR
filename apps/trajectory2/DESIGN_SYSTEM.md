# Trajectory Design System

## Philosophy
The Trajectory design system embodies **professional stoicism** and **commanding presence**. Every element should convey authority, clarity, and transformation for high-value men.

## Color Palette

### Brand Gold
- **Primary**: `#C89B3C` - Main brand color for accents and CTAs
- **600**: `#B1842F` - Darker shade for depth
- **400**: `#D4A853` - Lighter shade for highlights
- **300**: `#E0B564` - Subtle highlights

### Background Elevations (Canyon Theme)
- **Base**: `#0A0B0D` - Foundation layer
- **Elev-1**: `#0E0F12` - First elevation
- **Elev-2**: `#15171C` - Second elevation
- **Elev-3**: `#1C1F26` - Highest elevation

### Text Colors
- **Primary**: `#FFFFFF` - Headlines, important text
- **Secondary**: `#B8BCC8` - Body text, descriptions
- **Muted**: `#71758A` - Helper text, timestamps

### Borders
- **Default**: `rgba(255, 255, 255, 0.08)` - Standard borders
- **Hover**: `rgba(255, 255, 255, 0.12)` - Interactive borders
- **Gold**: `rgba(200, 155, 60, 0.3)` - Accent borders

## Spacing System

### Sections
- **Standard**: `py-20` (5rem) - Default section padding
- **Small**: `py-16` (4rem) - Compact sections
- **Large**: `py-24` (6rem) - Hero sections

### Content
- **Between Elements**: `mb-6` to `mb-8` (1.5rem - 2rem)
- **Between Sections**: `mb-12` to `mb-16` (3rem - 4rem)
- **Container Padding**: `px-4 sm:px-6 lg:px-8`

### Professional Spacing Classes
```css
.section-spacing      /* Ample vertical breathing room */
.content-spacing      /* Standard content separation */
.breathing-space      /* Combined padding and margin */
.professional-container /* Responsive horizontal spacing */
```

## Typography

### Hierarchy
```
Hero:        6xl-8xl (3.75rem - 6rem)
Display:     4xl-5xl (2.25rem - 3rem)
Heading:     3xl-4xl (1.875rem - 2.25rem)
Subheading:  xl-2xl (1.25rem - 1.5rem)
Body:        base-lg (1rem - 1.125rem)
Small:       sm-base (0.875rem - 1rem)
```

### Font Weights
- **Bold**: 700 - Headlines, emphasis
- **Semibold**: 600 - Subheadings, labels
- **Medium**: 500 - Navigation, buttons
- **Regular**: 400 - Body text

### Line Heights
- Headlines: 1.1-1.2
- Subheadings: 1.3-1.4
- Body: 1.6-1.7
- Small: 1.5

## Component Patterns

### Cards
```tsx
<Card className="bg-elev-2 border-[var(--border-default)] hover:border-[var(--border-gold)]">
  // Content with ample padding
</Card>
```

### Buttons
```tsx
// Primary
<Button className="bg-gold-gradient text-black">Command</Button>

// Secondary
<Button variant="outline" className="border-gold text-gold">Explore</Button>
```

### Sections
```tsx
<section className="py-20 bg-elev-1">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    // Content with generous spacing
  </div>
</section>
```

## Animation Principles

### Timing
- **Fast**: 0.15s - Micro-interactions
- **Standard**: 0.3s - Most transitions
- **Slow**: 0.5s - Page transitions

### Easing
- **Default**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth, professional
- **Elastic**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Playful (use sparingly)

### Motion Guidelines
1. Use subtle, purposeful animations
2. Respect `prefers-reduced-motion`
3. Never animate layout shifts
4. Use transforms over position changes

## Accessibility

### Focus States
- All interactive elements must have visible focus states
- Use `outline: 2px solid var(--brand-gold)` with `outline-offset: 2px`

### Color Contrast
- Text on dark backgrounds: minimum 7:1 ratio
- Interactive elements: minimum 4.5:1 ratio

### Screen Readers
- Use semantic HTML
- Provide aria-labels for icon buttons
- Use proper heading hierarchy

## Implementation Guidelines

### Do's ✅
- Use consistent spacing scale
- Maintain visual hierarchy
- Provide ample breathing room between elements
- Use gold sparingly for emphasis
- Keep interactions smooth and professional

### Don'ts ❌
- Don't use playful or childish elements
- Don't overcrowd the interface
- Don't use bright, jarring colors
- Don't add unnecessary animations
- Don't compromise readability for aesthetics

## Responsive Breakpoints

```
sm:  640px  - Mobile landscape
md:  768px  - Tablet
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

### Mobile-First Approach
1. Design for mobile first
2. Add complexity at larger breakpoints
3. Use `clamp()` for fluid scaling
4. Maintain readability at all sizes

## Example Page Structure

```tsx
<div className="min-h-screen bg-base">
  {/* Hero with generous spacing */}
  <section className="py-24 px-4">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-bold mb-8">
        Trajectory
      </h1>
      <p className="text-xl text-secondary max-w-2xl leading-relaxed">
        Transform into the commander of your life.
      </p>
    </div>
  </section>

  {/* Content sections with elevation */}
  <section className="py-20 bg-elev-1">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cards with consistent styling */}
      </div>
    </div>
  </section>
</div>
```

## Brand Voice

### Tone
- **Authoritative** - Command respect
- **Clear** - No fluff or confusion
- **Transformational** - Focus on growth
- **Masculine** - Appeal to high-value men
- **Stoic** - Calm, controlled, powerful

### Language
- Use strong, active verbs
- Speak directly to the reader
- Avoid wishy-washy language
- Be concise and impactful
- Maintain professional confidence

