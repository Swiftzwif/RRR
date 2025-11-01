-- Create webhook_events table for tracking and retrying failed webhooks
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'retrying')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  last_error TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  next_retry_at TIMESTAMPTZ,

  -- Unique constraint to prevent duplicate events
  CONSTRAINT webhook_events_event_id_unique UNIQUE (event_id)
);

-- Indexes for performance
CREATE INDEX idx_webhook_events_status ON webhook_events(status) WHERE status IN ('pending', 'failed', 'retrying');
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX idx_webhook_events_next_retry_at ON webhook_events(next_retry_at) WHERE status IN ('failed', 'retrying');

-- Enable RLS
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access webhook events
CREATE POLICY "Service role manages webhook events" ON webhook_events
  FOR ALL
  TO service_role
  USING (true);

-- No public access
CREATE POLICY "No public access to webhook events" ON webhook_events
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "No authenticated access to webhook events" ON webhook_events
  FOR ALL
  TO authenticated
  USING (false);

-- Function to calculate next retry time with exponential backoff
CREATE OR REPLACE FUNCTION calculate_next_retry(attempt_count INTEGER)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  -- Exponential backoff: 1min, 5min, 15min, 1hr, 6hr
  CASE attempt_count
    WHEN 0 THEN RETURN NOW() + INTERVAL '1 minute';
    WHEN 1 THEN RETURN NOW() + INTERVAL '5 minutes';
    WHEN 2 THEN RETURN NOW() + INTERVAL '15 minutes';
    WHEN 3 THEN RETURN NOW() + INTERVAL '1 hour';
    WHEN 4 THEN RETURN NOW() + INTERVAL '6 hours';
    ELSE RETURN NOW() + INTERVAL '24 hours';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to mark webhook for retry
CREATE OR REPLACE FUNCTION retry_webhook_event(webhook_id UUID, error_message TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  UPDATE webhook_events
  SET
    status = 'retrying',
    attempts = attempts + 1,
    last_error = error_message,
    next_retry_at = calculate_next_retry(attempts),
    updated_at = NOW()
  WHERE id = webhook_id
  AND attempts < max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Update trigger
CREATE TRIGGER update_webhook_events_updated_at
  BEFORE UPDATE ON webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE webhook_events IS 'Tracks all webhook events from Square for retry and reconciliation';
COMMENT ON COLUMN webhook_events.event_id IS 'Unique event ID from Square to prevent duplicates';
COMMENT ON COLUMN webhook_events.payload IS 'Complete webhook payload from Square';