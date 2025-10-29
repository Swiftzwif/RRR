-- Kill The Boy Grand Opening Raffle - Transformation Catalyst
-- This isn't just a raffle - it's a transformation moment
-- Every element captures commitment and builds momentum

-- Raffle as transformation moment
CREATE TABLE raffle_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT DEFAULT 'Your transformation starts with a single decision',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  entry_price INTEGER NOT NULL DEFAULT 9700, -- $97 in cents (35% off $149)
  regular_price INTEGER NOT NULL DEFAULT 14900, -- $149 in cents
  savings_amount INTEGER GENERATED ALWAYS AS (regular_price - entry_price) STORED,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'completed')),
  prizes JSONB NOT NULL DEFAULT '[
    {
      "type": "cash",
      "value": "$500",
      "quantity": 1,
      "description": "Cash Prize - Invest in Your Transformation",
      "icon": "dollar-sign"
    },
    {
      "type": "book",
      "value": "A Happy Pocket Full of Money",
      "quantity": 10,
      "description": "Mind-expanding book by David Cameron Gikandi",
      "icon": "book-open"
    },
    {
      "type": "access",
      "value": "Inner Mastery Sessions",
      "quantity": 5,
      "description": "Exclusive transformation accelerator sessions",
      "icon": "zap"
    }
  ]'::jsonb,
  metadata JSONB DEFAULT '{}', -- For future features
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warriors who've committed
CREATE TABLE raffle_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID REFERENCES raffle_config(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  phone TEXT,
  purchase_id UUID REFERENCES purchases(id) NOT NULL,
  entry_number SERIAL, -- For fair drawing
  commitment_message TEXT, -- "I'm ready to kill the boy"
  transformation_goal TEXT, -- What they want to transform
  is_winner BOOLEAN DEFAULT FALSE,
  prize_won TEXT,
  winner_notified_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(raffle_id, email), -- One transformation per person
  UNIQUE(raffle_id, purchase_id)
);

-- Track the movement
CREATE OR REPLACE VIEW raffle_live_stats AS
SELECT
  r.id as raffle_id,
  r.name,
  r.status,
  COUNT(re.id) as warrior_count,
  r.end_date - NOW() as time_remaining,
  ARRAY_AGG(
    DISTINCT re.transformation_goal
    ORDER BY re.created_at DESC
    LIMIT 5
  ) as recent_goals
FROM raffle_config r
LEFT JOIN raffle_entries re ON r.id = re.raffle_id
WHERE r.status = 'active'
GROUP BY r.id;

-- RLS for transformation privacy
ALTER TABLE raffle_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;

-- Everyone can see the movement
CREATE POLICY "Public views active raffles" ON raffle_config
  FOR SELECT USING (status IN ('active', 'ended', 'completed'));

-- Users see their own journey
CREATE POLICY "Users view own entries" ON raffle_entries
  FOR SELECT USING (auth.uid() = user_id OR true); -- Public count

-- Indexes for performance
CREATE INDEX idx_raffle_entries_created ON raffle_entries(created_at DESC);
CREATE INDEX idx_raffle_entries_email ON raffle_entries(email);

-- Add raffle_id to purchases table for tracking
ALTER TABLE purchases ADD COLUMN raffle_id UUID REFERENCES raffle_config(id);
CREATE INDEX idx_purchases_raffle ON purchases(raffle_id) WHERE raffle_id IS NOT NULL;

-- Insert initial Grand Opening raffle configuration
INSERT INTO raffle_config (
  name,
  tagline,
  start_date,
  end_date,
  entry_price,
  regular_price,
  status
) VALUES (
  'Kill The Boy Grand Opening',
  'Transform your life + win prizes that accelerate your journey',
  NOW(),
  NOW() + INTERVAL '7 days', -- 7-day raffle period
  9700,  -- $97 (35% off)
  14900, -- $149 regular price
  'active'
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_raffle_config_updated_at BEFORE UPDATE
    ON raffle_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();