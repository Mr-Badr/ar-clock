import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getEnv } from '@/lib/env.server'

let cachedSupabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin() {
  if (cachedSupabaseAdmin) return cachedSupabaseAdmin

  const env = getEnv()

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('[env] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for admin Supabase access')
  }

  cachedSupabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  )

  return cachedSupabaseAdmin
}
