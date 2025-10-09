import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nxtmcorzlosubfvxumpt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dG1jb3J6bG9zdWJmdnh1bXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjQ4MTUsImV4cCI6MjA5MTA0MDgxNX0.8Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  product: 'course' | 'coaching';
  amount_cents: number;
  stripe_session_id?: string;
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
