# UI Component Libraries Reference

This document provides quick reference for all supported UI component libraries in the Multi-Agent Development System.

## Primary Libraries

### 1. shadcn/ui

**Best for**: Forms, dashboards, admin panels, complex UI patterns
**Installation**:
```bash
npx shadcn@latest init
npx shadcn@latest add [component-name]
```

**Key Components**:
- Form, Input, Select, Checkbox, Radio
- Button, Badge, Card
- Dialog, Sheet, Popover, Tooltip
- Table, DataTable
- Command (⌘K menu)
- Dropdown Menu, Context Menu
- Calendar, Date Picker
- Toast, Alert
- Tabs, Accordion
- Avatar, Separator

**Links**:
- Website: https://ui.shadcn.com
- GitHub: https://github.com/shadcn-ui/ui
- Components: https://ui.shadcn.com/docs/components

**Usage**:
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <h2>Card Title</h2>
  </CardHeader>
  <CardContent>
    <Button>Click Me</Button>
  </CardContent>
</Card>
```

---

### 2. Magic UI

**Best for**: Animated landing pages, marketing sites, eye-catching effects
**Installation**:
```bash
npm install framer-motion
```
Then copy components from https://magicui.design/docs

**Key Components**:
- Animated Beam (connection lines)
- Bento Grid (Apple-style grid)
- Blur Fade (fade-in animations)
- Border Beam (animated borders)
- Dock (macOS-style dock)
- Globe (3D rotating globe)
- Marquee (scrolling text)
- Meteors (shooting star effect)
- Number Ticker (animated numbers)
- Particles (background particles)
- Shimmer Button (shimmering effect)
- Sparkles (text sparkles)
- Text Reveal (animated text reveal)
- Word Rotate (rotating words)

**Links**:
- Website: https://magicui.design
- Docs: https://magicui.design/docs
- Components: https://magicui.design/docs/components

**Usage**:
```tsx
import { BorderBeam } from "@/components/magic-ui/border-beam"
import { NumberTicker } from "@/components/magic-ui/number-ticker"

<div className="relative rounded-lg border">
  <BorderBeam />
  <h1>
    <NumberTicker value={10000} /> users
  </h1>
</div>
```

---

### 3. Aceternity UI

**Best for**: Modern trendy designs, unique visual effects
**Installation**: Copy components from https://ui.aceternity.com

**Key Components**:
- 3D Card Effect
- Animated Tabs
- Background Beams
- Background Boxes
- Canvas Reveal Effect
- Card Hover Effect
- Container Scroll Animation
- Floating Navbar
- Focus Cards
- Following Pointer
- Glowing Stars
- Grid Background
- Hero Highlight
- Infinite Moving Cards
- Lamp Effect
- Lens Effect
- Moving Border
- Parallax Scroll
- Shooting Stars
- Spotlight Effect
- Sticky Scroll
- Text Generate Effect
- Tracing Beam
- Typewriter Effect
- Wavy Background
- Word Pull Up

**Links**:
- Website: https://ui.aceternity.com
- Components: https://ui.aceternity.com/components

**Usage**:
```tsx
import { Card3D } from "@/components/aceternity-ui/3d-card"
import { TypewriterEffect } from "@/components/aceternity-ui/typewriter-effect"

<TypewriterEffect
  words={[
    { text: "Build" },
    { text: "awesome" },
    { text: "websites", className: "text-blue-500" },
  ]}
/>
```

---

### 4. Cult UI

**Best for**: Animated shadcn-style components
**Installation**: Copy from https://www.cult-ui.com

**Key Components**:
- Animated List
- Animated Subscribe
- Animated Tabs
- Aurora Text
- Blur Text
- Color Picker
- Confetti Button
- Direction Aware Tabs
- Expandable
- File Tree
- Floating Label Input
- Gradient Heading
- Multi Step
- OTP Input
- PDF Viewer
- Popover Form
- Scratchcard
- Shiny Button
- Video Modal
- Wavy Text

**Links**:
- Website: https://www.cult-ui.com
- Components: https://www.cult-ui.com/components

---

### 5. Origin UI

**Best for**: Additional shadcn-style building blocks
**Installation**: Copy from https://originui.com

**Key Components**:
- Advanced inputs
- File uploads
- Rich text editors
- Color pickers
- Timeline components
- Stat cards
- Pricing tables
- Feature grids
- Team sections
- Testimonial cards

**Links**:
- Website: https://originui.com
- Components: https://originui.com/components

---

### 6. Hexta UI

**Best for**: Modern Next.js components
**Installation**: Copy from https://ui.hexta.io

**Key Components**:
- Navigation menus
- Hero sections
- Feature sections
- CTA sections
- Footer components
- Blog layouts
- Portfolio grids

**Links**:
- Website: https://ui.hexta.io

---

### 7. 21st.dev

**Best for**: npm-installable shadcn components
**Installation**:
```bash
npx shadcn@latest add https://21st.dev/r/[component-id]
```

**Links**:
- Website: https://21st.dev
- Explore: https://21st.dev/components

---

## Component Selection Strategy

### Use shadcn/ui when you need:
- ✅ Forms and data entry
- ✅ Admin panels and dashboards
- ✅ Complex interactive patterns
- ✅ Accessibility-first components
- ✅ Headless UI with Radix primitives

### Use MagicUI when you need:
- ✅ Animated landing pages
- ✅ Marketing websites
- ✅ Eye-catching hero sections
- ✅ Interactive backgrounds
- ✅ Smooth animations

### Use Aceternity UI when you need:
- ✅ Unique, modern effects
- ✅ Standing out visually
- ✅ Portfolio sites
- ✅ Creative agencies
- ✅ Experimental designs

### Use Cult/Origin/Hexta/21st when:
- ✅ shadcn components don't cover your need
- ✅ You want pre-built sections
- ✅ You need specific UI patterns
- ✅ You want variety

## Mixing Libraries

It's common to mix libraries:
- **Base**: shadcn/ui for forms, buttons, dialogs
- **Enhancement**: MagicUI for hero animations
- **Accent**: Aceternity for special effects
- **Fill gaps**: Cult/Origin/Hexta for specific needs

Example stack:
```
Project: SaaS Landing Page + Dashboard

Landing Page:
- shadcn/ui: Buttons, forms, navigation
- MagicUI: Hero animations, bento grid
- Aceternity: Background effects, spotlights

Dashboard:
- shadcn/ui: All components (forms, tables, dialogs)
- Cult UI: Special inputs (OTP, file upload)
- Origin UI: Stat cards, charts
```

## Installation Patterns

### Method 1: shadcn CLI (shadcn/ui, 21st.dev)
```bash
npx shadcn@latest add button card form
```

### Method 2: Copy-Paste (MagicUI, Aceternity, Cult, Origin, Hexta)
1. Browse component on website
2. Copy component code
3. Paste into `components/[library]/[component].tsx`
4. Install required dependencies (usually just framer-motion)

### Method 3: npm Package (if available)
```bash
npm install @magic-ui/react framer-motion
```

## Common Dependencies

Most animation libraries need:
```bash
npm install framer-motion clsx tailwind-merge
```

For shadcn/ui:
```bash
npm install @radix-ui/react-[component]
```

## Styling

All libraries use **Tailwind CSS** as the base styling system. Ensure Tailwind is properly configured:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## TypeScript Support

All components should be fully typed:
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export function Button({ variant = "default", size = "md", ...props }: ButtonProps) {
  // Implementation
}
```

## Accessibility

shadcn/ui components are built on Radix UI primitives, providing excellent accessibility out of the box:
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus management
- ✅ ARIA attributes

For custom components from other libraries, ensure:
- ✅ Semantic HTML
- ✅ Keyboard accessibility
- ✅ ARIA labels where needed
- ✅ Focus indicators

## Performance Considerations

### Code Splitting
Use dynamic imports for heavy animation components:
```tsx
import dynamic from 'next/dynamic'

const HeavyAnimation = dynamic(
  () => import('@/components/aceternity-ui/canvas-reveal'),
  { ssr: false, loading: () => <Skeleton /> }
)
```

### Reduce Motion
Respect user preferences:
```tsx
"use client"

import { useReducedMotion } from 'framer-motion'

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { opacity: [0, 1] }}
    >
      Content
    </motion.div>
  )
}
```

## Quick Start for New Projects

```bash
# 1. Initialize shadcn/ui
npx shadcn@latest init

# 2. Add common shadcn components
npx shadcn@latest add button card form input label select

# 3. Install animation dependencies
npm install framer-motion

# 4. Create component directories
mkdir -p components/magic-ui components/aceternity-ui components/ui

# 5. Start copying components as needed
```

## Resources

- **shadcn/ui**: https://ui.shadcn.com
- **MagicUI**: https://magicui.design
- **Aceternity**: https://ui.aceternity.com
- **Cult UI**: https://www.cult-ui.com
- **Origin UI**: https://originui.com
- **Hexta UI**: https://ui.hexta.io
- **21st.dev**: https://21st.dev
- **Awesome shadcn/ui**: https://github.com/birobirobiro/awesome-shadcn-ui

## UI/UX Designer Agent Reference

When UI/UX Designer needs to choose components:
1. Start with shadcn/ui as the base
2. Add MagicUI for animations (if landing page/marketing)
3. Use Aceternity for special effects (if needed)
4. Fill gaps with Cult/Origin/Hexta
5. Document choices in project context

Example context entry:
```markdown
## Design System
- **Base**: shadcn/ui (forms, buttons, layouts)
- **Animations**: MagicUI (hero, features)
- **Effects**: Aceternity UI (background beams)
- **Special**: Cult UI (OTP input, confetti button)
```

This ensures Frontend Engineer knows exactly what to implement and where to find components.
