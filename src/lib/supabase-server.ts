import 'server-only'
import { supabaseAdmin } from './supabase/admin'

// Never import this in a Client Component
export function getSupabaseServer() {
  return supabaseAdmin;
}
