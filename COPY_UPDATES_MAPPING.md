# Copy Updates and Archetype Mapping

This document tracks all copy changes and archetype mappings applied to the Trajectory platform.

## Copy Changes

### Homepage (`apps/trajectory2/src/app/page.tsx`)

| Location | Old Copy | New Copy |
|----------|----------|----------|
| Top badge (line 193) | "TRANSFORM YOUR TRAJECTORY" | "YOU HAVE INFINITE WORTH" |
| Rotating command words (line 33) | `["attention", "energy", "money"]` | `["attention", "energy", "worth"]` |
| Secondary promise line (line 221) | "Transform into the commander of your life." | "Your story is about to change." |
| Emotional reassurance (line 224) | "Most men drift through life unaware of their worth—distracted by feeds, trapped in yesterday's thoughts, repeating the same inputs and getting the same results." | "If you don't like your current emotions — don't worry, you're in the right place." |
| Mission statement (line 227) | "Trajectory exists to help you reclaim the throne of your mind and lead from within." | "Trajectory exists to help men ages 18–35 become fearless, humble, compassionate leaders — to rise out of suffering and into joy." |
| Slogan/CTA (line 760) | "Stop Drifting. Start Commanding." | "Inner Mastery. Outer Freedom." |
| Social proof (line 763) | "Join thousands of men who have transformed their trajectory from passive observer to active commander." | "Join thousands of men who have transformed their trajectory — from good little soldiers to conscious capital allocators." |
| Feature description (line 124) | "Discover if you're a Drifter, Balancer, or Architect..." | "Discover if you're a Good Little Soldier, Conformist, or Commander..." |
| Assessment slide (line 362) | "...whether you're a Drifter, Balancer, or Architect..." | "...whether you're a Good Little Soldier, Conformist, or Commander..." |
| Course CTA social proof (line 572) | "Join 1,000+ men transforming their trajectory" | "Join thousands of men who have transformed their trajectory — from good little soldiers to conscious capital allocators" |

### Metadata (`apps/trajectory2/src/app/layout.tsx`)

| Location | Old Copy | New Copy |
|----------|----------|----------|
| Title | "Trajectory2.0 \| Transform Your Life" | "Trajectory2.0 \| Inner Mastery. Outer Freedom." |
| Description | "Unified webapp combining professional assessment system with beautiful animations. Transform into the commander of your life." | "Trajectory exists to help men ages 18–35 become fearless, humble, compassionate leaders — to rise out of suffering and into joy." |
| OpenGraph title | "Trajectory2.0 \| Transform Your Life" | "Trajectory2.0 \| Inner Mastery. Outer Freedom." |
| OpenGraph description | "Unified webapp combining professional assessment system with beautiful animations. Transform into the commander of your life." | "Trajectory exists to help men ages 18–35 become fearless, humble, compassionate leaders — to rise out of suffering and into joy." |
| Twitter title | "Trajectory2.0 \| Transform Your Life" | "Trajectory2.0 \| Inner Mastery. Outer Freedom." |
| Twitter description | "Unified webapp combining professional assessment system with beautiful animations." | "Trajectory exists to help men ages 18–35 become fearless, humble, compassionate leaders — to rise out of suffering and into joy." |

### Email Content (`apps/trajectory2/src/app/api/cron/send-scheduled-emails/route.ts`)

| Location | Old Copy | New Copy |
|----------|----------|----------|
| Day 5 subject (line 71) | "Day 5: Command Your Money 💰" | "Day 5: Know Your Worth 💎" |

### Centralized Copy (`packages/lib/copy.ts`)

| Location | Old Copy | New Copy |
|----------|----------|----------|
| Landing features description (line 45) | "Are you a Drifter, Balancer, or Architect? Discover your current trajectory pattern." | "Are you a Good Little Soldier, Conformist, or Commander? Discover your current trajectory pattern." |

## Archetype Mapping

### Display Label Changes

**Note**: Enum keys remain stable (`'Drifter' | 'Balancer' | 'Architect'`) for database compatibility. Only display labels have changed.

| Enum Key | Old Display Label | New Display Label | Location |
|----------|------------------|-------------------|----------|
| `drifter` | "The Drifter" | "The Good Little Soldier" | `packages/lib/copy.ts` (line 135) |
| `balancer` | "The Balancer" | "The Conformist" | `packages/lib/copy.ts` (line 141) |
| `architect` | "The Architect" | "The Commander" | `packages/lib/copy.ts` (line 147) |

### Files Using Archetype Labels

The following files automatically receive updated labels via `getCopy()` calls:
- `apps/trajectory2/src/components/AvatarBadge.tsx` - Displays avatar badges with new titles
- All assessment results pages
- All components using `getCopy('results.avatar.{type}')`

### Database Schema

**No changes required** - The database schema uses enum keys (`'Drifter'`, `'Balancer'`, `'Architect'`) which remain unchanged. Display labels are handled at the application layer through `copy.ts`.

## New Resources

### Daily Performance Tracker

- **File**: `apps/trajectory2/public/daily-performance-tracker.csv`
- **Location**: `/resources` page (new card added)
- **Description**: "Simple, printable tracker to measure daily execution."
- **Download**: Direct CSV file download via `/daily-performance-tracker.csv`
- **Structure**: CSV with headers: Date, Task, Completed, Notes

## Technical Notes

### Eager Loading Verification

All updates use eager imports (no lazy loading):
- Homepage: `"use client"` with top-level imports
- Resources page: `'use client'` with top-level imports
- Copy module: Synchronous module, no dynamic imports
- CSV download: Direct public file link (no API route)

### Animation Compatibility

The rotating command animation continues to work seamlessly:
- Array changed from `["attention", "energy", "money"]` to `["attention", "energy", "worth"]`
- Animation logic unchanged (same `useState`/`useEffect` pattern)
- Frame timing remains identical (6s intervals)

### Backwards Compatibility

- Database schema unchanged (enum keys stable)
- API routes unchanged (Zod schemas use same enum values)
- Analytics event properties unchanged (event names remain the same)
- Only display labels updated in UI layer

## Files Modified

1. `apps/trajectory2/src/app/page.tsx` - Homepage copy updates
2. `apps/trajectory2/src/app/layout.tsx` - SEO/metadata updates
3. `apps/trajectory2/src/app/api/cron/send-scheduled-emails/route.ts` - Email subject update
4. `packages/lib/copy.ts` - Archetype display labels and feature descriptions
5. `apps/trajectory2/src/app/resources/page.tsx` - Added Daily Performance Tracker card
6. `apps/trajectory2/public/daily-performance-tracker.csv` - New CSV file

## Files Created

1. `COPY_UPDATES_MAPPING.md` - This documentation file
