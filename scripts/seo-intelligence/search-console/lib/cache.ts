/**
 * Tiny local JSON cache so `npm run gsc:report` doesn't re-pull the same
 * 28-day Search Console window on every invocation.
 *
 * Lives under `.secrets/cache/` — inside the same already-gitignored
 * `.secrets/` tree used for OAuth credentials/tokens, but in its own
 * subfolder. This is report DATA (clicks/impressions/etc.), never
 * credentials or tokens — those stay exclusively in `.secrets/tokens/`
 * (see lib/auth.ts).
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const CACHE_DIR = path.join(process.cwd(), '.secrets', 'cache');

export const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function cacheFileFor(cacheKey: string): string {
  const safe = cacheKey.replace(/[^a-z0-9._-]/gi, '_');
  return path.join(CACHE_DIR, `${safe}.json`);
}

export async function readFromCache<T>(cacheKey: string): Promise<{ cachedAt: string; ageMs: number; data: T } | null> {
  try {
    const raw = await readFile(cacheFileFor(cacheKey), 'utf-8');
    const parsed = JSON.parse(raw) as { cachedAt: string; data: T };
    const ageMs = Date.now() - new Date(parsed.cachedAt).getTime();
    return { cachedAt: parsed.cachedAt, ageMs, data: parsed.data };
  } catch {
    return null;
  }
}

export async function writeToCache<T>(cacheKey: string, data: T): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  const payload = { cachedAt: new Date().toISOString(), data };
  await writeFile(cacheFileFor(cacheKey), JSON.stringify(payload, null, 2), { mode: 0o600 });
}
