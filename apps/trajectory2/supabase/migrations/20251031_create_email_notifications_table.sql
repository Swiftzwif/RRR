-- Create email_notifications table for tracking email subscriptions and preferences
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  topic TEXT NOT NULL,
  metadata JSONB,
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure unique email-topic combination
  UNIQUE(email, topic)
);

-- Create email_schedule table for tracking scheduled daily emails
CREATE TABLE IF NOT EXISTS public.email_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_name TEXT,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 31),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure unique email-day combination
  UNIQUE(email, day_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS email_notifications_email_idx ON public.email_notifications(email);
CREATE INDEX IF NOT EXISTS email_notifications_topic_idx ON public.email_notifications(topic);
CREATE INDEX IF NOT EXISTS email_notifications_subscribed_idx ON public.email_notifications(subscribed);

CREATE INDEX IF NOT EXISTS email_schedule_email_idx ON public.email_schedule(email);
CREATE INDEX IF NOT EXISTS email_schedule_status_idx ON public.email_schedule(status);
CREATE INDEX IF NOT EXISTS email_schedule_scheduled_for_idx ON public.email_schedule(scheduled_for);
CREATE INDEX IF NOT EXISTS email_schedule_day_number_idx ON public.email_schedule(day_number);

-- Enable Row Level Security
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_schedule ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for email_notifications
-- Allow users to read their own email notifications
CREATE POLICY "Users can read own email notifications" ON public.email_notifications
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = email
    OR
    auth.role() = 'service_role'
  );

-- Allow users to insert their own email notifications
CREATE POLICY "Users can insert own email notifications" ON public.email_notifications
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'email' = email
    OR
    auth.role() = 'service_role'
    OR
    auth.role() = 'anon' -- Allow anonymous signups
  );

-- Allow users to update their own email notifications
CREATE POLICY "Users can update own email notifications" ON public.email_notifications
  FOR UPDATE
  USING (
    auth.jwt() ->> 'email' = email
    OR
    auth.role() = 'service_role'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = email
    OR
    auth.role() = 'service_role'
  );

-- Create RLS policies for email_schedule
-- Only service role can manage email schedule
CREATE POLICY "Service role can manage email schedule" ON public.email_schedule
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow users to view their own scheduled emails
CREATE POLICY "Users can view own scheduled emails" ON public.email_schedule
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' = email
    OR
    auth.role() = 'service_role'
  );

-- Create trigger to update updated_at timestamp
CREATE TRIGGER handle_email_notifications_updated_at
  BEFORE UPDATE ON public.email_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_email_schedule_updated_at
  BEFORE UPDATE ON public.email_schedule
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.email_notifications TO authenticated;
GRANT ALL ON public.email_notifications TO service_role;
GRANT INSERT, SELECT ON public.email_notifications TO anon;

GRANT ALL ON public.email_schedule TO service_role;
GRANT SELECT ON public.email_schedule TO authenticated;
GRANT SELECT ON public.email_schedule TO anon;