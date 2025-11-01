<!-- 8a242426-5f95-455e-a7df-bdaf5025de76 b8006a7a-9a8d-4020-8492-2436d0623ffc -->
# Products Page & Landing Page CTA Implementation

## Overview

Transform the user journey to clearly showcase products with elegant, masculine Apple-grade design. Add a limited-time course offer to the landing page and create a comprehensive products page.

## Design Philosophy

- **Stoic, authoritative tone** - For high-value men
- **Apple-grade feel** - Clean, elegant, premium
- **Manly texture** - Strong, confident, not playful
- **Consistent with raffle/giveaway page** - Same visual language
- **Clear CTAs** - No confusion about next steps

## Changes Required

### 1. Landing Page (`/apps/trajectory2/src/app/page.tsx`)

#### Add Limited-Time Course Offer Section

Insert after the Hero Section (around line 489), before Features Section:

**New Section: "Transform Your Trajectory - Limited Time Offer"**

- **Headline**: "The Trajectory Digital Course"
- **Subheadline**: "From Drifter to Architect in 6 Transformative Modules"
- **Pricing Display**:
  - ~~$149~~ crossed out
  - **$97** large, bold, gold
  - "35% OFF - Limited Time Until November 7th"
- **Course Benefits** (3-4 key points with icons):
  - Complete 6-module transformation system
  - Lifetime access + future updates
  - Actionable frameworks from 50+ books
  - Private community access
- **CTA Button**: "Get The Course Today" → Links to `/products`
- **Design**:
  - Gold gradient border (like raffle page)
  - Dark slate background with gold accents
  - Subtle gold glow effects
  - Clean spacing, breathing room

### 2. New Products Page (`/apps/trajectory2/src/app/products/page.tsx`)

#### Page Structure

**Hero Section**

- Title: "Transform Your Life"
- Subtitle: "Choose Your Path to Commanding Attention, Energy, and Resources"
- Clean, minimal, with gold accent line

**Product Grid** (2 main products)

##### Product 1: The Trajectory Digital Course

- **Visual Card**:
  - Large, premium card design
  - Gold border with subtle glow
  - Dark background with texture
- **Header**:
  - Badge: "MOST POPULAR" (gold)
  - Title: "The Trajectory Digital Course"
  - Subtitle: "Your Complete Transformation System"
- **Pricing**:
  - Original: ~~$149~~
  - Current: **$97** (large, gold)
  - Badge: "35% OFF Until Nov 7th" (red/urgent)
- **What's Included**:
  - 6 comprehensive modules
  - 50+ book summaries distilled
  - Actionable daily frameworks
  - Lifetime access + updates
  - Private community access
  - 30-day money-back guarantee
- **Impact Statement**:
  - "Transform from reactive to proactive. From drifter to architect. This isn't information—it's implementation."
- **CTA**: "Get Instant Access on Thinkific" → Redirects to Thinkific URL
- **Secondary CTA**: "View Course Curriculum" → Expands/shows modules

##### Product 2: Inner Mastery Sessions

- **Visual Card**:
  - Premium card design
  - Silver/platinum border
  - Sophisticated, exclusive feel
- **Header**:
  - Badge: "ELITE ACCESS"
  - Title: "Inner Mastery Sessions"
  - Subtitle: "1-on-1 Transformation Coaching"
- **Pricing**:
  - "Custom Pricing"
  - "Application Required"
- **What's Included**:
  - Personal coaching with Jean
  - Custom transformation roadmap
  - Weekly accountability calls
  - Direct access via private channel
  - Personalized frameworks
  - Limited availability
- **Impact Statement**:
  - "For men ready to accelerate their transformation with direct guidance. This is where theory becomes reality."
- **CTA**: "Apply for Coaching" → Links to application form
- **Note**: "Limited to 10 clients per quarter"

**Comparison Section** (Optional)

- Side-by-side comparison table
- "Which path is right for you?"
- Clear differentiation

**Trust Section**

- Testimonials (if available)
- Guarantee badges
- "Join 1,000+ men transforming their trajectory"

**FAQ Section**

- "What if I can't afford it?"
- "How is this different from other courses?"
- "What's the time commitment?"
- "Can I get a refund?"

### 3. Update Navigation

Add "Products" to main navigation:

- Update `/apps/trajectory2/src/components/Navigation.tsx`
- Add link to `/products`
- Position between "Course" and "Resources"

### 4. Update Course Page (`/apps/trajectory2/src/app/course/page.tsx`)

Currently redirects to Thinkific. Update to:

- Keep the promotional content
- Change CTA to "View All Products" → `/products`
- Or redirect directly to `/products`

### 5. Components to Create

#### `/apps/trajectory2/src/components/products/ProductCard.tsx`

- Reusable product card component
- Props: title, subtitle, price, features, cta, badge, etc.
- Apple-grade styling

#### `/apps/trajectory2/src/components/products/PricingDisplay.tsx`

- Elegant pricing component
- Handles original/sale pricing
- Countdown timer for limited offers

#### `/apps/trajectory2/src/components/products/LimitedTimeOffer.tsx`

- Countdown component
- "Ends November 7th" display
- Urgency without being pushy

### 6. Configuration Updates - Smart Limited-Time System

#### `/apps/trajectory2/src/lib/config.ts`

Add product configuration with automatic expiration:

```typescript
export const PRODUCTS = {
  DIGITAL_COURSE: {
    name: "The Trajectory Digital Course",
    regularPrice: 149,
    salePrice: 97,
    saleEndsDate: "2025-11-07T23:59:59-05:00", // EST timezone
    thinkificUrl: THINKIFIC_COURSE_URL,
  },
  INNER_MASTERY: {
    name: "Inner Mastery Sessions",
    pricing: "Custom",
    applicationUrl: "/coaching",
  },
};

// Helper function to check if sale is active
export const isSaleActive = () => {
  const now = new Date();
  const saleEnd = new Date(PRODUCTS.DIGITAL_COURSE.saleEndsDate);
  return now < saleEnd;
};

// Get current price automatically
export const getCurrentPrice = () => {
  return isSaleActive() 
    ? PRODUCTS.DIGITAL_COURSE.salePrice 
    : PRODUCTS.DIGITAL_COURSE.regularPrice;
};
```

#### How It Works:

**Before Nov 7, 2025 11:59 PM EST:**

- Shows: ~~$149~~ **$97** with "35% OFF - Limited Time Until November 7th"
- Countdown timer visible
- Urgent styling (red badge, pulsing effects)

**After Nov 7, 2025 11:59 PM EST:**

- Shows: **$149** (no strikethrough)
- No countdown timer
- No "limited time" messaging
- Clean, regular CTA: "Get The Course Today"

#### To Change Later:

**Option 1: Run Another Sale**

Just update the date in `config.ts`:

```typescript
saleEndsDate: "2025-12-31T23:59:59-05:00", // New sale end date
```

**Option 2: Permanent Price Change**

Update `regularPrice`:

```typescript
regularPrice: 97, // New regular price
```

**Option 3: Remove CTA Entirely**

Set a flag in config:

```typescript
showCourseCTA: false, // Hides the entire section
```

No code changes needed - just update the config file!

## Design Specifications

### Color Palette

- **Primary**: Deep slate (#0f172a, #1e293b)
- **Accent**: Gold (#FFD700, #FFA500)
- **Text**: White (#ffffff), Light slate (#cbd5e1)
- **Borders**: Gold with opacity variations
- **Backgrounds**: Gradient from slate-900 to slate-800

### Typography

- **Headings**: Bold, large, confident
- **Body**: Clean, readable, spacious
- **Pricing**: Extra large, gold, commanding attention

### Spacing

- **Generous padding**: 8-12 spacing units
- **Card gaps**: 6-8 spacing units
- **Section padding**: 20-24 spacing units (py-20, py-24)

### Effects

- **Gold glow**: Subtle box-shadow with gold
- **Hover states**: Scale 1.02, increased glow
- **Borders**: 2px solid with gold
- **Gradients**: Subtle, from-to patterns

### Layout

- **Max width**: 7xl (1280px) for content
- **Grid**: 2 columns on desktop, 1 on mobile
- **Cards**: Full height, equal sizing
- **Responsive**: Mobile-first, scales beautifully

## Implementation Order (Proper Git Workflow)

### Phase 1: Setup & Configuration

1. **Create new branch**: `feature/products-page-launch`
2. **Create product configuration** (`lib/config.ts`) with sale logic
3. **Commit**: `feat(config): add product configuration with automatic sale expiration`

### Phase 2: Reusable Components

4. **Build components**: ProductCard, PricingDisplay, LimitedTimeOffer
5. **Test color conflicts**: Ensure gold (#FFD700) doesn't clash with existing orange/red gradients
6. **Commit**: `feat(components): add product showcase components with Apple-grade design`

### Phase 3: Products Page

7. **Create /products page** with both products
8. **Add testimonials** (Armani, Jose, Luis)
9. **Verify responsive design** on all screen sizes
10. **Commit**: `feat(products): create products page with course and coaching offerings`

### Phase 4: Landing Page Integration

11. **Add course CTA section** to landing page
12. **Test automatic sale expiration** (verify it works after Nov 7)
13. **Commit**: `feat(landing): add limited-time course CTA with automatic expiration`

### Phase 5: Navigation & Polish

14. **Update navigation** to include Products link
15. **Add metadata** for SEO
16. **Test all CTAs and redirects**
17. **Commit**: `feat(nav): add products link and update metadata`

### Phase 6: Final Review

18. **Run linter**: `npm run lint`
19. **Run build**: `npm run build`
20. **Test locally**: Verify all pages, colors, gradients
21. **Push branch** and create PR
22. **Review PR comments** (check for deployment issues)
23. **Merge to master** after approval

### Color Conflict Prevention

- **Gold**: #FFD700, #FFA500 (course CTA, pricing)
- **Orange/Red**: Keep for existing raffle/hero sections
- **Slate**: #0f172a, #1e293b (backgrounds)
- **Separation**: Use different sections, clear visual hierarchy
- **Test**: Ensure gold doesn't appear next to orange gradients

## Copy Guidelines

### Tone

- **Authoritative**: "This is what you need"
- **Direct**: No fluff, straight to value
- **Masculine**: Strong, confident language
- **Aspirational**: Paint the transformation

### Avoid

- ❌ Playful emojis (except sparingly)
- ❌ "Hey bro" casual tone
- ❌ Desperate urgency tactics
- ❌ Overpromising results

### Use

- ✅ "Command your trajectory"
- ✅ "Transform from drifter to architect"
- ✅ "For men ready to lead"
- ✅ "This isn't theory—it's implementation"

## Success Metrics

After implementation, users should:

1. **See the course offer** prominently on landing page
2. **Understand the limited-time discount** clearly
3. **Navigate easily** to products page
4. **Distinguish between** digital course and coaching
5. **Take action** with clear, compelling CTAs

## Files to Create/Modify

### New Files (5)

- `src/app/products/page.tsx`
- `src/components/products/ProductCard.tsx`
- `src/components/products/PricingDisplay.tsx`
- `src/components/products/LimitedTimeOffer.tsx`
- `src/components/products/ProductComparison.tsx` (optional)

### Modified Files (4)

- `src/app/page.tsx` (add course CTA section)
- `src/lib/config.ts` (add product config)
- `src/components/Navigation.tsx` (add Products link)
- `src/app/course/page.tsx` (update CTA)

## Timeline

- **Phase 1**: Components + Config (30 min)
- **Phase 2**: Products Page (45 min)
- **Phase 3**: Landing Page CTA (20 min)
- **Phase 4**: Navigation + Testing (15 min)
- **Total**: ~2 hours

Ready to build this and ship it to production! 🚀

### To-dos

- [ ] Comment out Square API routes (payment creation, webhooks, admin reconciliation) with preservation notes
- [ ] Move Square environment variables from required to optional in env-validation.ts
- [ ] Create Thinkific configuration file and update env.template with new variable
- [ ] Refactor course page to remove purchase logic and redirect to Thinkific
- [ ] Add compelling course CTA section to assessment results page
- [ ] Update PAYMENT_SETUP.md and LAUNCH_CHECKLIST.md with Thinkific integration notes
- [ ] Test that app works without Square env vars and redirects function correctly