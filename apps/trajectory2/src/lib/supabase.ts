import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseKey);
};

// Server-side Supabase client with service role
export function getSupabaseServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured');
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    db: { schema: 'public' }
  });
}

// Database types
export interface Assessment {
  id: string;
  user_id?: string;
  answers: Record<string, number>;
  domain_scores: Record<string, number>;
  avatar: 'Drifter' | 'Balancer' | 'Architect';
  score: number;
  email?: string;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id?: string;
  email?: string;
  product: "course" | "coaching";
  amount_cents: number;
  stripe_session_id?: string;
  square_payment_id?: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id?: string;
  course_module?: string;
  status: 'not_started' | 'in_progress' | 'complete';
  updated_at: string;
}

export interface CoachingApplication {
  id: string;
  user_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
}
