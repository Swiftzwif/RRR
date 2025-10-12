import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient(): SupabaseClient {
  // Return cached instance if it exists
  if (clientInstance) {
    return clientInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Auth features will be disabled.')
    // Return a mock client that won't crash but also won't work
    // This prevents errors on pages that don't actually use Supabase
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as unknown as SupabaseClient
  }

  clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return clientInstance
}
