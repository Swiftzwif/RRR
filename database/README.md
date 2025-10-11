# Database Schemas

This directory contains Supabase database schema files preserved from the original apps.

## Schema Files

### `schemas/main-schema.sql`
**Original location:** `apps/main/supabase-schema.sql`

Main Trajectory Strata MVP Database Schema containing:
- `assessments` - User assessment results
- `purchases` - Purchase transactions (course/coaching)
- `user_progress` - Course module progress tracking
- `coaching_applications` - Coaching application submissions
- `notifications` - Email capture for notifications

Includes RLS (Row Level Security) policies and proper indexing.

### `schemas/ktb-module-schema.sql`
**Original location:** `apps/main/scripts/supabase-schema.sql`

Kill The Boy Assessment Module Schema containing:
- `submissions` - Assessment submissions with answers and scores
- `leads` - Email leads captured from assessments

Includes service role policies for server-side operations.

## Usage

Run these SQL files in your Supabase SQL Editor to set up the database schema.

**Note:** The Supabase client configuration is maintained in `packages/lib/supabase.ts` and `apps/trajectory2/src/lib/supabase.ts`.

## Migration History

- **2025-10-11**: Schemas preserved during cleanup of unused `apps/main/` directory
  - Original implementation was in Next.js app at `apps/main/`
  - Core Supabase utilities moved to `packages/lib/` for shared usage
  - Active development continues in `apps/trajectory2/`

