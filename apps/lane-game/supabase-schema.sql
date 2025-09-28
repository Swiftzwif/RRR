-- Game Diagnostic Tables
-- These tables store data for the gamified Lane Diagnostic assessment

-- Game diagnostic sessions table
CREATE TABLE IF NOT EXISTS game_diagnostic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  question_order TEXT[] NOT NULL,
  consistency_score DECIMAL(3,2) DEFAULT 0.0 CHECK (consistency_score >= 0 AND consistency_score <= 1),
  avg_answer_ms INTEGER DEFAULT 0,
  timeouts INTEGER DEFAULT 0,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game diagnostic events table (individual question responses)
CREATE TABLE IF NOT EXISTS game_diagnostic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_diagnostic_sessions(id) ON DELETE CASCADE,
  q_index INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  answer INTEGER CHECK (answer >= 1 AND answer <= 5),
  started_at TIMESTAMPTZ NOT NULL,
  answered_at TIMESTAMPTZ,
  duration_ms INTEGER DEFAULT 0,
  timed_out BOOLEAN DEFAULT FALSE,
  changed_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game achievements table
CREATE TABLE IF NOT EXISTS game_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID NOT NULL REFERENCES game_diagnostic_sessions(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game notify list for future communications
CREATE TABLE IF NOT EXISTS game_notify_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  topic TEXT DEFAULT 'lane-game',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, topic)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_diagnostic_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON game_diagnostic_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_game_events_session_id ON game_diagnostic_events(session_id);
CREATE INDEX IF NOT EXISTS idx_game_events_question_id ON game_diagnostic_events(question_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_session_id ON game_achievements(session_id);
CREATE INDEX IF NOT EXISTS idx_game_achievements_user_id ON game_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_game_notify_email ON game_notify_list(email);

-- Row Level Security (RLS) policies
ALTER TABLE game_diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_diagnostic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_notify_list ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create sessions and events
CREATE POLICY "Allow anonymous session creation" ON game_diagnostic_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous event creation" ON game_diagnostic_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous achievement creation" ON game_achievements
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous notify list addition" ON game_notify_list
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own sessions" ON game_diagnostic_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read own events" ON game_diagnostic_events
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM game_diagnostic_sessions 
      WHERE auth.uid() = user_id OR user_id IS NULL
    )
  );

CREATE POLICY "Users can read own achievements" ON game_achievements
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow updates to sessions (for completion)
CREATE POLICY "Allow session updates" ON game_diagnostic_sessions
  FOR UPDATE USING (true);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating updated_at
CREATE TRIGGER update_game_sessions_updated_at 
  BEFORE UPDATE ON game_diagnostic_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate consistency score
CREATE OR REPLACE FUNCTION calculate_consistency_score(session_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  validation_events RECORD;
  total_difference INTEGER := 0;
  pair_count INTEGER := 0;
  consistency DECIMAL(3,2);
BEGIN
  -- Get validation question pairs and calculate differences
  FOR validation_events IN
    SELECT 
      e1.answer as answer1,
      e2.answer as answer2
    FROM game_diagnostic_events e1
    JOIN game_diagnostic_events e2 ON e1.session_id = e2.session_id
    WHERE e1.session_id = session_uuid
      AND e1.question_id LIKE 'V%'
      AND e2.question_id LIKE 'V%'
      AND e1.question_id != e2.question_id
      AND e1.answer IS NOT NULL
      AND e2.answer IS NOT NULL
  LOOP
    total_difference := total_difference + ABS(validation_events.answer1 - validation_events.answer2);
    pair_count := pair_count + 1;
  END LOOP;
  
  IF pair_count = 0 THEN
    RETURN 1.0; -- No validation questions, assume consistent
  END IF;
  
  -- Calculate consistency (1.0 = perfect, 0.0 = completely inconsistent)
  consistency := GREATEST(0.0, 1.0 - (total_difference::DECIMAL / (pair_count * 4.0)));
  RETURN consistency;
END;
$$ LANGUAGE plpgsql;

-- Function to get session statistics
CREATE OR REPLACE FUNCTION get_session_stats(session_uuid UUID)
RETURNS TABLE (
  total_questions INTEGER,
  answered_questions INTEGER,
  timeouts INTEGER,
  avg_answer_time_ms INTEGER,
  consistency_score DECIMAL(3,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*)::INTEGER FROM game_diagnostic_events WHERE session_id = session_uuid) as total_questions,
    (SELECT COUNT(*)::INTEGER FROM game_diagnostic_events WHERE session_id = session_uuid AND answer IS NOT NULL) as answered_questions,
    (SELECT timeouts FROM game_diagnostic_sessions WHERE id = session_uuid) as timeouts,
    (SELECT COALESCE(AVG(duration_ms), 0)::INTEGER FROM game_diagnostic_events WHERE session_id = session_uuid AND answer IS NOT NULL) as avg_answer_time_ms,
    calculate_consistency_score(session_uuid) as consistency_score;
END;
$$ LANGUAGE plpgsql;
