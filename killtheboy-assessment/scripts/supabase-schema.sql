-- Supabase Schema for KillTheBoy Assessment Migration
-- Run this in Supabase SQL Editor

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_submissions_module_id ON submissions(module_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_submission_id ON leads(submission_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_module_id ON leads(module_id);

-- Enable RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (server-side only)
-- These policies allow full access for service role operations
CREATE POLICY "Service role can do everything on submissions" ON submissions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on leads" ON leads
    FOR ALL USING (auth.role() = 'service_role');

-- Optional: Add read policies for authenticated users if needed later
-- CREATE POLICY "Authenticated users can read submissions" ON submissions
--     FOR SELECT USING (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Authenticated users can read leads" ON leads
--     FOR SELECT USING (auth.role() = 'authenticated');
