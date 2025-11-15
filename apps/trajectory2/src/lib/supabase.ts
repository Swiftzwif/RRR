import { createClient } from '@supabase/supabase-js';

/**
 * Client-side Supabase client for browser-based queries.
 *
 * Uses public anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) and is subject to RLS policies.
 * Used in React components and client-side operations.
 *
 * Returns null if environment variables are not configured.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Singleton client-side Supabase client instance.
 * Null if credentials not available.
 */
export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Checks if Supabase is properly configured with required environment variables.
 *
 * @returns true if both NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
 */
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseKey);
};

/**
 * Server-side Supabase client with service role credentials.
 *
 * Used in API routes and server-side operations where elevated permissions are needed.
 * Bypasses RLS policies using the SUPABASE_SERVICE_ROLE_KEY (server-side secret).
 *
 * Should ONLY be used in server-side code. NEVER expose this in client-side code.
 * Caches connection to avoid recreating client on each call.
 *
 * @returns Supabase admin client or null if credentials not configured
 */
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

/**
 * Database type definitions for Supabase tables.
 * These interfaces represent the schema and are used for type safety.
 */

/**
 * Assessment record stored after user completes the evaluation.
 *
 * @interface Assessment
 * @property {string} id - Unique assessment ID
 * @property {string} user_id - Optional Supabase auth user ID if user is authenticated
 * @property {Record<string, number>} answers - Raw Q1-Q15 responses (1-5 scale)
 * @property {Record<string, number>} domain_scores - Computed average scores for 6 domains
 * @property {Avatar} avatar - Assigned avatar tier (Drifter, Balancer, Architect)
 * @property {number} score - Overall assessment score (1-5)
 * @property {string} email - Email address (for lead capture / unauthenticated users)
 * @property {string} created_at - ISO 8601 timestamp
 */
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

/**
 * Purchase record from completed payment transaction.
 *
 * Created when user completes checkout for course or coaching products.
 * Used for access gating and product delivery.
 *
 * @interface Purchase
 * @property {string} id - Unique purchase ID
 * @property {string} user_id - Optional Supabase auth user ID if authenticated
 * @property {string} email - Buyer email address (for lead tracking)
 * @property {string} product - Product type: "course" or "coaching"
 * @property {number} amount_cents - Purchase amount in cents (e.g., 9999 for $99.99)
 * @property {string} stripe_session_id - Stripe checkout session ID (if using Stripe)
 * @property {string} square_payment_id - Square payment ID (if using Square)
 * @property {string} created_at - ISO 8601 timestamp of purchase
 */
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

/**
 * User progress tracking for course completion.
 *
 * Tracks which modules user has started, is currently working on, or completed.
 *
 * @interface UserProgress
 * @property {string} id - Unique progress record ID
 * @property {string} user_id - Optional Supabase auth user ID
 * @property {string} course_module - Module identifier (e.g., "module-1", "module-7")
 * @property {string} status - Progress status: not_started, in_progress, or complete
 * @property {string} updated_at - ISO 8601 timestamp of last update
 */
export interface UserProgress {
  id: string;
  user_id?: string;
  course_module?: string;
  status: 'not_started' | 'in_progress' | 'complete';
  updated_at: string;
}

/**
 * Coaching application for $24.99 coaching interview.
 *
 * User submits application to book personalized coaching call.
 * Status tracks review and acceptance workflow.
 *
 * @interface CoachingApplication
 * @property {string} id - Unique application ID
 * @property {string} user_id - Optional Supabase auth user ID
 * @property {string} status - Application status: pending, accepted, or rejected
 * @property {string} notes - Optional internal notes from coaching coordinator
 * @property {string} created_at - ISO 8601 timestamp of application submission
 */
export interface CoachingApplication {
  id: string;
  user_id?: string;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  created_at: string;
}
