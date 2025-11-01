-- Create assessments table for storing user assessment data
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  domain_scores JSONB NOT NULL,
  avatar TEXT NOT NULL,
  score INTEGER NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS assessments_user_id_idx ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS assessments_email_idx ON public.assessments(email);
CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON public.assessments(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow users to read their own assessments
CREATE POLICY "Users can read own assessments" ON public.assessments
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    auth.jwt() ->> 'email' = email
  );

-- Allow users to insert their own assessments
CREATE POLICY "Users can insert own assessments" ON public.assessments
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR
    user_id IS NULL -- Allow anonymous assessments
  );

-- Allow users to update their own assessments
CREATE POLICY "Users can update own assessments" ON public.assessments
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR
    auth.jwt() ->> 'email' = email
  )
  WITH CHECK (
    auth.uid() = user_id
    OR
    auth.jwt() ->> 'email' = email
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions for authenticated users
GRANT ALL ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;

-- Allow anonymous users to insert assessments (for non-authenticated flow)
GRANT INSERT, SELECT ON public.assessments TO anon;