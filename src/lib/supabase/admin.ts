import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getEnv } from '@/lib/env.server'

const env = getEnv()

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('[env] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for admin Supabase access')
}

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)
