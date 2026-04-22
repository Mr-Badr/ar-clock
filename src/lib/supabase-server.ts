import 'server-only'
import { getSupabaseAdmin } from './supabase/admin'

// Never import this in a Client Component
export function getSupabaseServer() {
  return getSupabaseAdmin();
}
