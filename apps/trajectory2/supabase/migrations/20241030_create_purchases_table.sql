-- Create purchases table for tracking all payments
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL CHECK (product IN ('raffle_entry', 'course', 'coaching')),
  amount_cents INTEGER NOT NULL,
  square_payment_id TEXT UNIQUE NOT NULL,
  square_order_id TEXT,
  raffle_id UUID REFERENCES raffle_config(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for updating updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX idx_purchases_user_id ON purchases(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_purchases_email ON purchases(email);
CREATE INDEX idx_purchases_square_payment_id ON purchases(square_payment_id);
CREATE INDEX idx_purchases_raffle_id ON purchases(raffle_id) WHERE raffle_id IS NOT NULL;
CREATE INDEX idx_purchases_created_at ON purchases(created_at DESC);
CREATE INDEX idx_purchases_status ON purchases(status);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases by user_id
CREATE POLICY "Users view own purchases by user_id" ON purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can view their own purchases by email
CREATE POLICY "Users view own purchases by email" ON purchases
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Service role can manage all purchases (for webhook processing)
CREATE POLICY "Service role can manage purchases" ON purchases
  FOR ALL
  TO service_role
  USING (true);

-- Public can't access purchases at all
CREATE POLICY "Anon users cannot access purchases" ON purchases
  FOR ALL
  TO anon
  USING (false);

-- Update trigger
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE purchases IS 'All purchase records from Square payments including raffle entries, course purchases, and coaching';
COMMENT ON COLUMN purchases.square_payment_id IS 'Unique payment ID from Square, used for idempotency';
COMMENT ON COLUMN purchases.metadata IS 'JSON data containing additional payment details from Square';