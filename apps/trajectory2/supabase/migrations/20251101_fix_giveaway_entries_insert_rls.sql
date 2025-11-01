-- Fix giveaway entries INSERT RLS policy
-- Allow public to insert giveaway entries via the API endpoint

-- Add policy for public to insert giveaway entries
-- This is safe because the API validates all data server-side
CREATE POLICY "Public can insert giveaway entries"
ON giveaway_entries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also add policy for authenticated users to insert their own entries
CREATE POLICY "Authenticated users can insert their own giveaway entries"
ON giveaway_entries
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Add comment explaining the security model
COMMENT ON POLICY "Public can insert giveaway entries" ON giveaway_entries 
IS 'Allows public entry submissions via verified API endpoint. Server-side validation ensures data integrity.';

