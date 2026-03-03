/**
 * lib/supabaseClient.js
 *
 * TWO exports:
 *   - supabaseServer  → uses SERVICE_ROLE key (never send to browser)
 *   - supabasePublic  → uses ANON key (safe for client reads if needed)
 *
 * Why two clients?
 * - service_role bypasses RLS and can do full writes/reads.
 *   It MUST stay server-only.
 * - anon key is restricted by RLS to SELECT only.
 *
 * How to rotate keys if leaked:
 * 1. Go to Supabase Dashboard → Settings → API → Regenerate keys.
 * 2. Update .env.local and redeploy.
 * 3. The anon key can safely be rotated without data loss.
 *    The service_role key rotation requires updating all server scripts.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.warn('[supabaseClient] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/** Server-only client with service_role — bypass RLS for writes and admin reads */
export const supabaseServer = createClient(
  SUPABASE_URL,
  SERVICE_KEY || ANON_KEY, // fallback to anon if service key missing (dev only)
  { auth: { persistSession: false } }
);

/** Public client — uses anon key, respects RLS */
export const supabasePublic = createClient(
  SUPABASE_URL,
  ANON_KEY,
  { auth: { persistSession: false } }
);
