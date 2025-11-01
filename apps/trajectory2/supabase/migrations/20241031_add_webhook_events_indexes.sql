-- Add indexes for webhook_events table to improve query performance
-- These indexes support the retry mechanism and status filtering

-- Index for filtering by status (used in retry queries)
CREATE INDEX IF NOT EXISTS idx_webhook_events_status 
ON webhook_events(status) 
WHERE status IN ('failed', 'retrying', 'pending');

-- Index for retry queries (find events ready to retry)
CREATE INDEX IF NOT EXISTS idx_webhook_events_retry 
ON webhook_events(next_retry_at) 
WHERE status = 'retrying' AND next_retry_at IS NOT NULL;

-- Composite index for efficient status and retry time queries
CREATE INDEX IF NOT EXISTS idx_webhook_events_status_retry 
ON webhook_events(status, next_retry_at) 
WHERE status IN ('retrying', 'failed') AND next_retry_at IS NOT NULL;

-- Index for looking up webhook events by payment ID (common query pattern)
CREATE INDEX IF NOT EXISTS idx_webhook_events_payment_id 
ON webhook_events((metadata->>'payment_id')) 
WHERE metadata->>'payment_id' IS NOT NULL;

-- Add comment
COMMENT ON INDEX idx_webhook_events_status IS 'Improves queries filtering webhook events by status';
COMMENT ON INDEX idx_webhook_events_retry IS 'Optimizes retry mechanism queries for events ready to retry';
COMMENT ON INDEX idx_webhook_events_status_retry IS 'Composite index for efficient retry queue queries';
COMMENT ON INDEX idx_webhook_events_payment_id IS 'Enables fast lookups of webhook events by payment ID';
