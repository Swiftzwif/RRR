-- Fix critical RLS privacy leak in raffle_entries table
-- Remove the policy that allows anyone to view all entries

-- Drop the problematic policy with "OR true" that exposes all entries
DROP POLICY IF EXISTS "Public can view their own raffle entries" ON raffle_entries;
DROP POLICY IF EXISTS "Users view own entries" ON raffle_entries;

-- Create proper RLS policies that protect user privacy

-- Authenticated users can only view their own entries by user_id
CREATE POLICY "Users view own raffle entries by user_id" ON raffle_entries
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Authenticated users can also view their own entries by email match
CREATE POLICY "Users view own raffle entries by email" ON raffle_entries
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Service role can manage all entries (for admin and webhook operations)
DROP POLICY IF EXISTS "Service role can manage raffle entries" ON raffle_entries;
CREATE POLICY "Service role can manage raffle entries" ON raffle_entries
  FOR ALL
  TO service_role
  USING (true);

-- Public/anon users cannot access raffle entries at all
CREATE POLICY "Anon users cannot access raffle entries" ON raffle_entries
  FOR ALL
  TO anon
  USING (false);

-- Add policy for users to view aggregated counts (for display purposes)
-- This allows showing total entry count without exposing individual entries
CREATE OR REPLACE FUNCTION get_raffle_entry_count(raffle_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM raffle_entries WHERE raffle_id = raffle_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_raffle_entry_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_raffle_entry_count(UUID) TO anon;

-- Add comment explaining the security fix
COMMENT ON TABLE raffle_entries IS 'Raffle entries table with proper RLS policies to protect user privacy. Users can only see their own entries.';

-- Verify no other policies exist that might leak data
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'raffle_entries';

  RAISE NOTICE 'Total RLS policies on raffle_entries: %', policy_count;
END $$;