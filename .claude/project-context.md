# Project Context - Trajectory 2.0 Comprehensive Improvement

## Project Overview
- **Name**: Trajectory 2.0
- **Type**: Life Transformation Platform (SaaS)
- **Tech Stack**: Next.js 15.5.4, React 19, TypeScript 5, Tailwind CSS 4, Supabase, Resend
- **Status**: In Progress - Comprehensive Audit & Improvement

## Current Task
**Comprehensive codebase improvement with giveaway removal**
- User requested: "focus on absolutely everything"
- Priority: Remove expired giveaway from frontend
- Scope: Full audit of UI/UX, code quality, performance, testing

## Architecture Decisions
- 2025-11-14: Initiated multi-agent system for comprehensive improvements
- 2025-11-14: Decided to remove giveaway frontend (expired event)
- Existing: Next.js App Router, Supabase RLS, Thinkific integration

## Current Tasks

### Active
- **Coordinator**: Creating comprehensive improvement plan

### Completed
- User requirements clarified

### Blocked
None

## Implementation Plan

### Phase 1: Analysis & Planning
1. Audit current codebase structure
2. Identify all giveaway-related code
3. Create removal plan for giveaway
4. Identify improvement opportunities

### Phase 2: Giveaway Removal (Priority)
1. Remove giveaway routes and pages
2. Update navigation to remove giveaway links
3. Clean up giveaway-related components
4. Update database (keep data, remove frontend access)
5. Remove giveaway API routes (optional - discuss with user)

### Phase 3: UI/UX Improvements
1. Accessibility audit (WCAG AA compliance)
2. Design system consistency check
3. Responsive design validation
4. Animation performance review
5. Text visibility and contrast (recent focus area)

### Phase 4: Code Quality
1. TypeScript strict mode audit
2. ESLint error resolution
3. Remove unused code and dependencies
4. Refactor large files (e.g., homepage 2000+ lines)
5. Component optimization

### Phase 5: Performance Optimization
1. Bundle size analysis
2. Core Web Vitals optimization
3. Image optimization
4. Code splitting review
5. Caching strategy

### Phase 6: Testing & Documentation
1. Add missing tests
2. Improve test coverage
3. Update documentation
4. Validate all critical paths

## File Structure
```
RRR/
├── apps/trajectory2/           # Main application
├── packages/                    # Shared packages
├── docs/                        # Documentation
└── .claude/                     # Project context (new)
```

## Giveaway Components to Remove/Update
(To be populated during analysis)

## Dependencies
- Next.js 15.5.4
- React 19
- TypeScript 5
- Supabase (PostgreSQL + Auth)
- Resend (email)
- Tailwind CSS 4
- Framer Motion
- Radix UI
- React Hook Form
- Zod
- Sentry

## Git Status (GitHub Admin)
- **Current Branch**: claude/claude-md-mhyhfggf6nch4z72-01BTS4V3n5XFH1ABEWXd18R8
- **Last Commit**: ec97370 - docs: create comprehensive CLAUDE.md guide for AI assistants
- **Pending Changes**: None yet

## Notes
- Recent focus: Text visibility and contrast improvements
- Social proof fake count feature recently added
- Square payments disabled, Thinkific active
- Homepage is animation-heavy (2000+ lines) - needs refactoring consideration
- Giveaway ended "a couple of days ago" - remove from frontend only
