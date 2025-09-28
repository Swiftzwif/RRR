import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client with service role
export function getSupabaseServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  
  if (!url || !key) {
    console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE not configured');
    return null;
  }
  
  return createClient(url, key, { 
    auth: { persistSession: false },
    db: { schema: 'public' }
  });
}

// Game-specific database types
export interface GameDiagnosticSession {
  id: string;
  user_id?: string;
  started_at: string;
  completed_at?: string;
  question_order: string[];
  consistency_score: number;
  avg_answer_ms: number;
  timeouts: number;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface GameDiagnosticEvent {
  id: string;
  session_id: string;
  q_index: number;
  question_id: string;
  answer?: number;
  started_at: string;
  answered_at?: string;
  duration_ms: number;
  timed_out: boolean;
  changed_answer: boolean;
  created_at: string;
}

export interface GameAchievement {
  id: string;
  user_id?: string;
  session_id: string;
  code: string;
  created_at: string;
}

export interface GameNotifyList {
  id: string;
  email: string;
  topic: string;
  created_at: string;
}

// Game API functions
export async function createGameSession(sessionData: Omit<GameDiagnosticSession, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('game_diagnostic_sessions')
    .insert([sessionData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateGameSession(id: string, updates: Partial<GameDiagnosticSession>) {
  const { data, error } = await supabase
    .from('game_diagnostic_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function createGameEvent(eventData: Omit<GameDiagnosticEvent, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('game_diagnostic_events')
    .insert([eventData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function createGameAchievement(achievementData: Omit<GameAchievement, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('game_achievements')
    .insert([achievementData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getGameSession(id: string) {
  const { data, error } = await supabase
    .from('game_diagnostic_sessions')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
}

export async function getGameEvents(sessionId: string) {
  const { data, error } = await supabase
    .from('game_diagnostic_events')
    .select('*')
    .eq('session_id', sessionId)
    .order('q_index');
    
  if (error) throw error;
  return data;
}

export async function getGameAchievements(sessionId: string) {
  const { data, error } = await supabase
    .from('game_achievements')
    .select('*')
    .eq('session_id', sessionId);
    
  if (error) throw error;
  return data;
}

export async function addToNotifyList(email: string, topic: string = 'lane-game') {
  const { data, error } = await supabase
    .from('game_notify_list')
    .insert([{ email, topic }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
