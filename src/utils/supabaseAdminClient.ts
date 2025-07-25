import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Admin client for user management - requires service role key
// This should only be used in admin contexts and never exposed to regular users
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

// Create admin client only if service key is available
export const supabaseAdminClient = supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const isAdminClientAvailable = () => !!supabaseAdminClient;