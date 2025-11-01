-- Create auth_events table for tracking authentication events
CREATE TABLE IF NOT EXISTS auth_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup',
    'signin',
    'signout',
    'password_reset_requested',
    'password_reset_completed',
    'email_verified',
    'email_changed',
    'password_changed',
    'oauth_linked',
    'oauth_unlinked',
    'account_deleted',
    'account_locked',
    'account_unlocked'
  )),
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_auth_events_user_id ON auth_events(user_id);
CREATE INDEX idx_auth_events_event_type ON auth_events(event_type);
CREATE INDEX idx_auth_events_created_at ON auth_events(created_at DESC);
CREATE INDEX idx_auth_events_user_type ON auth_events(user_id, event_type);

-- Enable RLS
ALTER TABLE auth_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access auth events (for security)
CREATE POLICY "Service role manages auth events" ON auth_events
  FOR ALL
  TO service_role
  USING (true);

-- Users can view their own auth events
CREATE POLICY "Users view own auth events" ON auth_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No public access
CREATE POLICY "No public access to auth events" ON auth_events
  FOR ALL
  TO anon
  USING (false);

-- Function to automatically log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO auth_events (user_id, event_type, metadata, created_at)
  VALUES (p_user_id, p_event_type, p_metadata, NOW())
  RETURNING id INTO event_id;

  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION log_auth_event(UUID, TEXT, JSONB) TO authenticated;

-- Trigger to log signups
CREATE OR REPLACE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  -- Log signup event
  PERFORM log_auth_event(NEW.id, 'signup', jsonb_build_object(
    'email', NEW.email,
    'provider', COALESCE(NEW.raw_app_meta_data->>'provider', 'email')
  ));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups (unique name to avoid collision with other triggers)
DROP TRIGGER IF EXISTS on_auth_user_created_log_event ON auth.users;
CREATE TRIGGER on_auth_user_created_log_event
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add comment
COMMENT ON TABLE auth_events IS 'Tracks all authentication-related events for security auditing and user activity monitoring';
