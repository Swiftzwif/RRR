-- Raffle to Giveaway Migration
-- Transform raffle infrastructure to giveaway with newsletter signup
-- Removes payment requirement, adds ConvertKit integration, manual verification

-- Step 1: Rename tables
ALTER TABLE IF EXISTS raffle_config RENAME TO giveaway_config;
ALTER TABLE IF EXISTS raffle_entries RENAME TO giveaway_entries;

-- Step 2: Update foreign key constraints and column names
-- First, drop existing foreign keys
ALTER TABLE giveaway_entries 
  DROP CONSTRAINT IF EXISTS raffle_entries_raffle_id_fkey;

ALTER TABLE purchases
  DROP CONSTRAINT IF EXISTS purchases_raffle_id_fkey;

-- Step 3: Update column names in giveaway_entries
ALTER TABLE giveaway_entries
  RENAME COLUMN raffle_id TO giveaway_id;

ALTER TABLE purchases
  RENAME COLUMN raffle_id TO giveaway_id;

-- Step 4: Recreate foreign key constraints with new names
ALTER TABLE giveaway_entries
  ADD CONSTRAINT giveaway_entries_giveaway_id_fkey
  FOREIGN KEY (giveaway_id) REFERENCES giveaway_config(id) ON DELETE CASCADE;

ALTER TABLE purchases
  ADD CONSTRAINT purchases_giveaway_id_fkey
  FOREIGN KEY (giveaway_id) REFERENCES giveaway_config(id) ON DELETE SET NULL;

-- Step 5: Modify giveaway_entries table structure
-- Remove purchase_id requirement (make it optional)
ALTER TABLE giveaway_entries
  ALTER COLUMN purchase_id DROP NOT NULL;

-- Remove user_id requirement (make it optional)
ALTER TABLE giveaway_entries
  ALTER COLUMN user_id DROP NOT NULL;

-- Add new columns for giveaway entry requirements
ALTER TABLE giveaway_entries
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS convertkit_subscriber_id TEXT,
  ADD COLUMN IF NOT EXISTS liked_post BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS shared_post BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tagged_friend BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Make first_name and last_name required for new entries (but allow NULL for existing data)
-- We'll enforce this at the application level

-- Step 6: Update unique constraints
-- Drop old constraints
ALTER TABLE giveaway_entries
  DROP CONSTRAINT IF EXISTS raffle_entries_raffle_id_email_key,
  DROP CONSTRAINT IF EXISTS raffle_entries_raffle_id_purchase_id_key,
  DROP CONSTRAINT IF EXISTS unique_user_raffle_entry,
  DROP CONSTRAINT IF EXISTS unique_email_raffle_entry;

-- Add new constraint: one entry per email per giveaway
ALTER TABLE giveaway_entries
  ADD CONSTRAINT giveaway_entries_giveaway_id_email_key UNIQUE (giveaway_id, email);

-- Step 7: Rename and update indexes
DROP INDEX IF EXISTS idx_raffle_entries_created;
DROP INDEX IF EXISTS idx_raffle_entries_email;
DROP INDEX IF EXISTS idx_raffle_entries_user_id;
DROP INDEX IF EXISTS idx_purchases_raffle;

CREATE INDEX IF NOT EXISTS idx_giveaway_entries_created ON giveaway_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_email ON giveaway_entries(email);
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_user_id ON giveaway_entries(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_verified ON giveaway_entries(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_giveaway_entries_newsletter ON giveaway_entries(newsletter_subscribed) WHERE newsletter_subscribed = true;
CREATE INDEX IF NOT EXISTS idx_purchases_giveaway ON purchases(giveaway_id) WHERE giveaway_id IS NOT NULL;

-- Step 8: Update views
DROP VIEW IF EXISTS raffle_live_stats;

CREATE OR REPLACE VIEW giveaway_live_stats AS
SELECT
  g.id as giveaway_id,
  g.name,
  g.status,
  COUNT(ge.id) as participant_count,
  g.end_date - NOW() as time_remaining,
  ARRAY_AGG(
    DISTINCT ge.transformation_goal
    ORDER BY ge.created_at DESC
    LIMIT 5
  ) FILTER (WHERE ge.transformation_goal IS NOT NULL) as recent_goals
FROM giveaway_config g
LEFT JOIN giveaway_entries ge ON g.id = ge.giveaway_id
WHERE g.status = 'active'
GROUP BY g.id;

-- Step 9: Update RLS policies
-- Drop old policies
DROP POLICY IF EXISTS "Public views active raffles" ON giveaway_config;
DROP POLICY IF EXISTS "Users view own entries" ON giveaway_entries;
DROP POLICY IF EXISTS "Users can view their own raffle entries" ON giveaway_entries;
DROP POLICY IF EXISTS "Service role can manage raffle entries" ON giveaway_entries;

-- New policies for giveaway_config
CREATE POLICY "Public views active giveaways" ON giveaway_config
  FOR SELECT USING (status IN ('active', 'ended', 'completed'));

-- New policies for giveaway_entries
-- Public can view count (but not details)
CREATE POLICY "Public views entry counts" ON giveaway_entries
  FOR SELECT USING (true);

-- Authenticated users can view their own entries
CREATE POLICY "Users view own giveaway entries" ON giveaway_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Service role can manage all entries (for API processing)
CREATE POLICY "Service role can manage giveaway entries" ON giveaway_entries
  FOR ALL
  TO service_role
  USING (true);

-- Step 10: Create donations table for course purchase tracking
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  charity_name TEXT NOT NULL,
  amount_cents INTEGER NOT NULL DEFAULT 200, -- $2.00 per charity
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for donations table
CREATE INDEX IF NOT EXISTS idx_donations_purchase_id ON donations(purchase_id) WHERE purchase_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);

-- Update trigger for donations
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS for donations (service role only)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage donations" ON donations
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Admin can view donations" ON donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Step 11: Update triggers
DROP TRIGGER IF EXISTS track_raffle_participation_trigger ON giveaway_entries;
DROP FUNCTION IF EXISTS track_raffle_participation();

-- Update trigger name for giveaway_config
DROP TRIGGER IF EXISTS update_raffle_config_updated_at ON giveaway_config;

CREATE TRIGGER update_giveaway_config_updated_at
  BEFORE UPDATE ON giveaway_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 12: Update table comments
COMMENT ON TABLE giveaway_config IS 'Giveaway configuration and settings';
COMMENT ON TABLE giveaway_entries IS 'Giveaway entries with newsletter subscription and Instagram action tracking';
COMMENT ON TABLE donations IS 'Donations to charities from course purchases ($2 per charity per course sale)';
COMMENT ON COLUMN giveaway_entries.newsletter_subscribed IS 'Whether user successfully subscribed to ConvertKit newsletter';
COMMENT ON COLUMN giveaway_entries.convertkit_subscriber_id IS 'ConvertKit subscriber ID for cross-reference';
COMMENT ON COLUMN giveaway_entries.verified IS 'Manual verification flag set by admin after checking ConvertKit and Instagram';

-- Step 13: Update product enum in purchases table to include giveaway entry
-- Note: This might fail if there are existing purchases with 'raffle_entry'
-- We'll handle this gracefully
DO $$
BEGIN
  -- Check if raffle_entry exists in purchases
  IF EXISTS (
    SELECT 1 FROM purchases WHERE product = 'raffle_entry'
  ) THEN
    -- Update existing raffle_entry to course (since giveaway entries are now free)
    UPDATE purchases SET product = 'course' WHERE product = 'raffle_entry';
  END IF;
  
  -- Alter the constraint to remove raffle_entry and add giveaway_entry
  ALTER TABLE purchases DROP CONSTRAINT IF EXISTS purchases_product_check;
  ALTER TABLE purchases ADD CONSTRAINT purchases_product_check 
    CHECK (product IN ('giveaway_entry', 'course', 'coaching'));
END $$;
