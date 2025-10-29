# Claude Code Skills for Trajectory

This folder contains specialized skills that Claude Code can reference when working on this project. Each skill provides focused guidance for specific development tasks, transforming Claude into a complete expert for building Trajectory.

## How to Use Skills

When working with Claude Code, you can reference these skills in your prompts:

```
"Use the ui-component-builder skill to create a new ProfileCard component"
"Follow the api-route-builder skill to create an endpoint for user progress"
"Use the supabase-query-helper skill to query assessment data"
"Apply the atomic-git-workflow for committing changes"
```

Claude Code will read the skill file and follow its patterns, templates, and checklists.

## Complete Skills Library

### 🚀 Core Development Skills

#### 1. `atomic-git-workflow.md`
**Purpose**: Lightning-fast git operations with human-like commit messages

**Use when**:
- Making any code changes
- Creating branches
- Writing commit messages
- Managing PRs
- Handling merge conflicts

**Key features**:
- No AI signatures in commits
- Human-like abbreviations
- Quick branch strategies
- PR automation

#### 2. `apple-grade-ui.md`
**Purpose**: Build interfaces that feel expensive, intentional, and transformative

**Use when**:
- Creating any UI component
- Designing layouts
- Adding animations
- Ensuring responsive design
- Polishing interactions

**Key features**:
- Generous whitespace patterns
- Perfect typography
- 60fps animations
- Flawless interactions

#### 3. `ui-component-builder.md`
**Purpose**: Build new React components following the Trajectory design system

**Use when**:
- Creating new UI components
- Need design system reference
- Want to ensure consistency with existing components

**Includes**:
- Component template with TypeScript
- Design system quick reference (colors, typography, spacing)
- Variants and size patterns
- Testing checklist

### 📊 Business Logic Skills

#### 4. `assessment-optimization.md`
**Purpose**: Turn the assessment into a transformative experience that converts

**Use when**:
- Modifying assessment flow
- Improving conversion rates
- Adding email capture
- Optimizing results display
- A/B testing assessment

**Key features**:
- Conversion optimization patterns
- Email gate implementation
- Social proof integration
- Progress tracking

#### 5. `course-content-management.md`
**Purpose**: Manage 50+ pages of conversational, life-changing content

**Use when**:
- Adding course modules
- Creating conversation flows
- Building progress tracking
- Managing action items
- Implementing content delivery

**Key features**:
- Conversational UI patterns
- Progress visualization
- Mobile-first layouts
- Content caching strategies

#### 6. `payment-edge-cases.md`
**Purpose**: Handle every possible payment scenario bulletproof

**Use when**:
- Implementing payment flows
- Handling failed payments
- Setting up webhooks
- Managing subscriptions
- Dealing with refunds

**Key features**:
- Webhook retry logic
- Duplicate prevention
- Smart payment retry
- International payments

### 🔧 Integration Skills

#### 7. `api-route-builder.md`
**Purpose**: Create Next.js API routes with proper validation and error handling

**Use when**:
- Building new API endpoints
- Creating webhook handlers
- Need request validation patterns
- Integrating with Supabase, Square, or Resend

**Includes**:
- API route template with Zod validation
- Webhook template with signature verification
- Error handling patterns
- Common integration snippets

#### 8. `supabase-query-helper.md`
**Purpose**: Quick reference for Supabase queries and authentication

**Use when**:
- Querying database tables
- Handling authentication
- Managing user metadata
- Need RLS guidance

**Includes**:
- Database schema reference
- Client initialization patterns
- Common query examples
- Authentication flows
- Error handling

#### 9. `email-automation.md`
**Purpose**: Build life-changing email sequences that feel personal

**Use when**:
- Setting up email flows
- Creating email templates
- Building automation sequences
- Implementing SMS (Twilio)
- Managing email/SMS campaigns

**Key features**:
- React Email templates
- Automation engine
- Smart send times
- A/B testing framework

#### 10. `integration-patterns.md`
**Purpose**: Connect seamlessly with external services

**Use when**:
- Adding new integrations
- Setting up Twilio SMS
- Implementing Calendly
- Adding AI features
- Building webhook handlers

**Key features**:
- Base integration class
- Service-specific implementations
- Webhook management
- Health monitoring

### ⚡ Performance & Marketing Skills

#### 11. `performance-optimization.md`
**Purpose**: Make the site feel instant with Apple-grade performance

**Use when**:
- Optimizing load times
- Improving Core Web Vitals
- Setting up caching
- Implementing lazy loading
- Monitoring performance

**Key features**:
- Next.js 15 optimizations
- Database query patterns
- Bundle optimization
- Performance monitoring

#### 12. `seo-marketing-integration.md`
**Purpose**: Drive organic traffic and convert visitors

**Use when**:
- Setting up SEO
- Adding analytics
- Creating landing pages
- Implementing tracking
- A/B testing

**Key features**:
- Next.js metadata API
- Structured data
- Conversion tracking
- Content optimization

#### 13. `analytics-tracking.md`
**Purpose**: Track every step of the transformation journey

**Use when**:
- Adding analytics events
- Building dashboards
- Tracking user journeys
- Analyzing funnels
- Creating reports

**Key features**:
- Custom analytics system
- Real-time dashboards
- Cohort analysis
- Predictive analytics prep

### 🎨 Advanced UX & Strategy Skills

#### 14. `life-transforming-ux.md`
**Purpose**: Create experiences that make men feel their life is about to change

**Use when**:
- Designing key user flows
- Creating emotional triggers
- Building community features
- Implementing gamification
- Crafting transformation moments

**Key features**:
- Mirror effect patterns
- Commitment rituals
- Progress visualization
- Emotional copy library

#### 15. `project-context-memory.md`
**Purpose**: Everything Claude needs to remember about Trajectory's mission

**Use when**:
- Need project context
- Understanding brand voice
- Checking business goals
- Reviewing user avatars
- Planning features

**Key features**:
- Complete mission/vision
- Brand voice guide
- User journey maps
- Business context

#### 16. `future-features-prep.md`
**Purpose**: Build today with tomorrow's features in mind

**Use when**:
- Planning architecture
- Adding new features
- Designing database schema
- Preparing for mobile app
- Setting up for scale

**Key features**:
- Community features prep
- Mobile app architecture
- Coaching platform design
- AI/ML preparation

## Creating New Skills

To add a new skill:

1. Create a new `.md` file in this directory
2. Follow this structure:
   ```markdown
   # [Skill Name]

   Brief description of what this skill helps with.

   ## When to Use This Skill

   Specific scenarios...

   ## Template/Pattern

   Code templates or examples...

   ## Checklist

   - [ ] Step 1
   - [ ] Step 2

   ## Common Patterns

   Reusable snippets...
   ```

3. Update this README to list the new skill

## Skill Usage Priority

When working on Trajectory, prioritize skills in this order:

1. **Always use**: `atomic-git-workflow.md` - For every code change
2. **Check first**: `project-context-memory.md` - Understand the mission
3. **UI work**: `apple-grade-ui.md` → `life-transforming-ux.md`
4. **Backend work**: `api-route-builder.md` → `supabase-query-helper.md`
5. **Features**: Match the skill to the feature area
6. **Polish**: `performance-optimization.md` → `seo-marketing-integration.md`

## Benefits of Skills

- **Consistency**: Ensures all new code follows established patterns
- **Speed**: Templates and snippets accelerate development  
- **Quality**: Checklists prevent common mistakes
- **Transformation Focus**: Every skill serves the mission
- **Future-Ready**: Build with tomorrow's features in mind
- **Autonomous Operation**: Claude can work independently with confidence

## Skills vs CLAUDE.md

**CLAUDE.md**: High-level architecture, what the system does, how pieces fit together
**Skills**: Actionable templates and patterns for specific development tasks
**Master Instructions**: How Claude should think and operate

Think of:
- CLAUDE.md as the "map" 
- Skills as the "tools"
- Master Instructions as the "mindset"

## Quick Reference

Most used patterns across all skills:

```typescript
// Atomic commit
git add -p && git commit -m "feat: add transformation animation"

// Apple-grade spacing
className="px-6 py-12 md:px-8 md:py-16 lg:px-12 lg:py-24"

// Supabase query
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('user_id', userId)
  .single();

// Error handling
if (error) {
  console.error('Operation failed:', error);
  throw new Error(`Failed to ${operation}: ${error.message}`);
}

// Life-changing copy
"Kill the boy. Become the man."
"Your trajectory changes today."
"31 days to transform your life."
```

Remember: Every skill serves the transformation. Every line of code changes lives.
