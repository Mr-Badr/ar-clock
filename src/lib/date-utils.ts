import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';

export async function getCachedNowIso() {
  'use cache';
  cacheTag('current-time');
  cacheLife('hours');
  return new Date().toISOString();
}
