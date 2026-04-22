import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getEnv } from '@/lib/env.server'

let cachedSupabase: SupabaseClient | null = null

export function getSupabase() {
  if (cachedSupabase) return cachedSupabase

  const env = getEnv()
  const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[env] SUPABASE_URL/SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_* are required for Supabase access')
  }

  cachedSupabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    { auth: { persistSession: false } }
  )

  return cachedSupabase
}
