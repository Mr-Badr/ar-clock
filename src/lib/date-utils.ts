import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';

export async function getCachedNowIso() {
  'use cache';
  cacheTag('current-time');
  // A minute-level cache keeps server HTML fresh enough for SEO/date labels
  // while still allowing prerendering under Next.js cache components.
  // The truly live experiences update on the client after first paint.
  cacheLife('minutes');
  return new Date().toISOString();
}
