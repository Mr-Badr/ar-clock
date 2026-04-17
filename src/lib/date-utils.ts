import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';

export async function getCachedNowIso() {
  'use cache';
  cacheTag('current-time');
  cacheLife('days');
  return new Date().toISOString();
}
