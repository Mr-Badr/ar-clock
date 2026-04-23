import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';

export async function getCachedNowIso() {
  'use cache';
  cacheTag('current-time');
  // "Current time" powers live prayer/economy pages, so it must stay fresh.
  // A second-level cache still keeps the function cacheable without freezing
  // the clock for an entire day.
  cacheLife('seconds');
  return new Date().toISOString();
}
