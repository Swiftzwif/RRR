# MongoDB to Supabase Migration Guide

This guide walks you through migrating from MongoDB to Supabase for the KillTheBoy Assessment application.

## Overview

The migration uses a dual-write strategy to ensure zero downtime:
1. **Phase 1**: Set up Supabase schema and dual-write (current state)
2. **Phase 2**: Backfill historical data
3. **Phase 3**: Flip reads to Supabase primary
4. **Phase 4**: Remove MongoDB fallback

## Prerequisites

1. **Supabase Project**: Create a new Supabase project
2. **Environment Variables**: Set up the required environment variables
3. **Database Schema**: Run the Supabase schema setup

## Step 1: Environment Setup

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration (Required)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# MongoDB Configuration (Keep during transition)
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=trajectory
```

**Important**: 
- Use the **Service Role** key, not the anon key
- Keep MongoDB variables during the transition period
- Never commit the service role key to version control

## Step 2: Database Schema Setup

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the schema from `scripts/supabase-schema.sql`:

```sql
-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id text PRIMARY KEY,
    module_id text NOT NULL DEFAULT 'ktb',
    answers jsonb NOT NULL,
    reflective jsonb,
    domain_scores jsonb NOT NULL,
    overall numeric NOT NULL,
    avatar text NOT NULL,
    lowest_domains text[] NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id text NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    module_id text NOT NULL DEFAULT 'ktb',
    email text NOT NULL,
    source text NOT NULL DEFAULT 'assessment',
    created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_submissions_module_id ON submissions(module_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_submission_id ON leads(submission_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_module_id ON leads(module_id);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Service role policies
CREATE POLICY "Service role can do everything on submissions" ON submissions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on leads" ON leads
    FOR ALL USING (auth.role() = 'service_role');
```

## Step 3: Deploy Dual-Write Code

The code is already updated to implement dual-write strategy:

- **Submit API**: Writes to Supabase first, falls back to MongoDB, then dual-writes to MongoDB
- **Lead API**: Reads from Supabase first, falls back to MongoDB, writes to Supabase first
- **Fetch API**: Reads from Supabase first, falls back to MongoDB
- **Health Check**: Tests both databases

Deploy this code to your production environment.

## Step 4: Backfill Historical Data

Run the backfill script to migrate existing data:

```bash
npm run backfill:supabase
```

This script will:
- Read all submissions from MongoDB
- Read all leads from MongoDB
- Upsert them into Supabase
- Provide progress reporting and verification

**Expected Output**:
```
🚀 Initializing backfill service...
✅ Connected to MongoDB
✅ Connected to Supabase
✅ Supabase connection verified

📊 Starting submissions backfill...
📝 Processed batch of 100 submissions
✅ Submissions backfill complete: 1,234 written, 0 errors

📧 Starting leads backfill...
📝 Processed batch of 100 leads
✅ Leads backfill complete: 567 written, 0 errors

🔍 Verifying backfill...
📊 Verification Results:
Submissions - MongoDB: 1,234, Supabase: 1,234
Leads - MongoDB: 567, Supabase: 567
✅ All counts match! Backfill successful.

🎉 Backfill completed successfully!
```

## Step 5: Verification

### Health Check
Test the health endpoint to ensure both databases are working:

```bash
curl https://your-domain.com/api/health/db
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "databases": {
    "supabase": {
      "status": "healthy",
      "message": "Supabase connection and query successful"
    },
    "mongodb": {
      "status": "healthy", 
      "message": "Connected to trajectory, 2 collections"
    }
  }
}
```

### End-to-End Testing

1. **Submit a new assessment**:
   ```bash
   curl -X POST https://your-domain.com/api/submit \
     -H "Content-Type: application/json" \
     -d '{"answers": {"q1": 4, "q2": 3}, "moduleId": "ktb"}'
   ```

2. **Verify it exists in Supabase**:
   - Check the Supabase dashboard
   - Verify the submission appears in the `submissions` table

3. **Submit a lead**:
   ```bash
   curl -X POST https://your-domain.com/api/lead \
     -H "Content-Type: application/json" \
     -d '{"submissionId": "submission-id", "email": "test@example.com"}'
   ```

4. **Fetch the submission**:
   ```bash
   curl https://your-domain.com/api/submission/submission-id
   ```

## Step 6: Monitor and Validate

Monitor the application for 24-48 hours to ensure:

1. **No errors** in the application logs
2. **Data consistency** between MongoDB and Supabase
3. **Performance** is acceptable
4. **All features** work as expected

Check logs for:
- `Successfully wrote to Supabase`
- `Found submission in Supabase`
- `Dual-write to MongoDB successful`

## Step 7: Remove MongoDB Fallback (Future)

After successful monitoring period, you can remove MongoDB fallback:

1. **Remove dual-write logic** from APIs
2. **Remove MongoDB imports** and connection code
3. **Remove MongoDB environment variables**
4. **Update health check** to only test Supabase
5. **Clean up MongoDB scripts**

## Troubleshooting

### Common Issues

1. **Supabase Connection Failed**
   - Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE` are correct
   - Check that the service role key has proper permissions
   - Ensure RLS policies allow service role access

2. **Schema Mismatch**
   - Verify the schema was created correctly
   - Check that indexes were created
   - Ensure RLS is enabled with proper policies

3. **Backfill Errors**
   - Check MongoDB connection
   - Verify data types match between MongoDB and Supabase
   - Review error logs for specific issues

4. **Performance Issues**
   - Monitor query performance in Supabase dashboard
   - Check that indexes are being used
   - Consider query optimization

### Rollback Plan

If issues arise, you can quickly rollback by:

1. **Revert code** to MongoDB-only version
2. **Update environment variables** to remove Supabase
3. **Restart application** to use MongoDB only

The dual-write strategy ensures data remains in MongoDB during the transition, so rollback is safe.

## Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Code deployed with dual-write
- [ ] Health check passes
- [ ] Backfill script completed successfully
- [ ] End-to-end tests pass
- [ ] Monitoring period completed (24-48 hours)
- [ ] No errors in logs
- [ ] Data consistency verified
- [ ] Performance acceptable
- [ ] Ready to remove MongoDB fallback

## Support

If you encounter issues during the migration:

1. Check the application logs for specific error messages
2. Verify environment variables are correctly set
3. Test database connections individually
4. Review the Supabase dashboard for any errors
5. Check MongoDB connection and data integrity

The migration is designed to be safe and reversible, with comprehensive logging and fallback mechanisms.
