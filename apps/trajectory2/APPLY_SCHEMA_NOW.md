# 🚨 URGENT: Apply Database Schema

## The Problem
Your Supabase backend is online, but the database schema hasn't been applied yet. This is why signup is failing with "Database error saving new user".

## The Solution (2 minutes)

### Option 1: Via Supabase Dashboard (Recommended)

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/nxtmcorzlosubfvxumpt
   - Or: https://supabase.com → Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Paste and Run the Schema:**
   - Open this file: `/Users/tiffanynguyen/RRR/database/schemas/main-schema.sql`
   - Copy **ALL** the contents
   - Paste into the SQL editor
   - Click "Run" button (or press Cmd/Ctrl + Enter)

4. **Verify Success:**
   - You should see: "Success. No rows returned"
   - Or check the "Table Editor" sidebar - you should see new tables

### Option 2: Via Terminal (if you have psql)

```bash
# The schema file is ready at:
cat /tmp/apply-schema.sql

# If you have direct database access, you can apply it with psql
# (You'd need the database password from Supabase dashboard)
```

## After Applying the Schema

Once you've applied the schema, **come back here** and I'll immediately test the signup again!

## What This Schema Does

- Creates `assessments` table for storing user assessment results
- Creates `purchases` table for course/coaching purchases  
- Creates `user_progress` table for tracking course completion
- Creates `coaching_applications` table
- Creates `notifications` and `email_notifications` tables
- Sets up Row Level Security (RLS) policies
- Creates necessary indexes for performance
- Grants proper permissions

## Why This is Safe

- All statements use `IF NOT EXISTS` - won't break existing data
- Policies use idempotent DO blocks - won't create duplicates
- Proper foreign key constraints to `auth.users`

---

**After you've applied the schema, let me know and I'll test everything!**
