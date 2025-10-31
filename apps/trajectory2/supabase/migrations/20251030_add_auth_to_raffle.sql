-- Add user authentication tracking to raffle entries
ALTER TABLE raffle_entries
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_raffle_entries_user_id ON raffle_entries(user_id);

-- Update RLS policies to allow authenticated users to view their own entries
DROP POLICY IF EXISTS "Users can view their own raffle entries" ON raffle_entries;

CREATE POLICY "Users can view their own raffle entries"
ON raffle_entries
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow service role to create entries (for webhook processing)
DROP POLICY IF EXISTS "Service role can manage raffle entries" ON raffle_entries;

CREATE POLICY "Service role can manage raffle entries"
ON raffle_entries
FOR ALL
TO service_role
USING (true);

-- Create function to track user raffle participation
CREATE OR REPLACE FUNCTION track_raffle_participation()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user metadata to track raffle participation
  IF NEW.user_id IS NOT NULL THEN
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data ||
      jsonb_build_object(
        'raffle_participant', true,
        'raffle_entry_date', NEW.created_at,
        'raffle_id', NEW.raffle_id
      )
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for tracking participation
DROP TRIGGER IF EXISTS track_raffle_participation_trigger ON raffle_entries;

CREATE TRIGGER track_raffle_participation_trigger
AFTER INSERT ON raffle_entries
FOR EACH ROW
EXECUTE FUNCTION track_raffle_participation();

-- Add unique constraint to prevent duplicate entries per user per raffle
ALTER TABLE raffle_entries
DROP CONSTRAINT IF EXISTS unique_user_raffle_entry;

ALTER TABLE raffle_entries
ADD CONSTRAINT unique_user_raffle_entry UNIQUE (raffle_id, user_id);

-- Also keep the email constraint for backwards compatibility
ALTER TABLE raffle_entries
DROP CONSTRAINT IF EXISTS unique_email_raffle_entry;

ALTER TABLE raffle_entries
ADD CONSTRAINT unique_email_raffle_entry UNIQUE (raffle_id, email);