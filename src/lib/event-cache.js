/**
 * src/lib/event-cache.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized caching for event meta resolution
 * Prevents duplicate processing of the same event across multiple components.
 *
 * NOTE: TTL-based expiry via Date.now() is intentionally omitted here.
 * Next.js 15+ forbids calling Date.now() in a Server Component before
 * accessing dynamic data (headers/cookies/fetch), which would trigger a
 * prerender error. Page-level freshness is handled by ISR revalidation
 * instead. This cache acts as a per-request deduplication store only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { _resolveEventMetaInternal } from './holidays-engine';

// In-memory dedup cache for event meta (no TTL — ISR handles freshness)
const eventMetaCache = new Map();

/**
 * Get cached event meta or compute and cache it
 * @param {Object} event - The event object
 * @param {Date} targetDate - The target date for the event
 * @param {number|null} overrideHijriYear - Optional Hijri year override
 * @returns {Object} The resolved event meta
 */
export function getCachedEventMeta(event, targetDate, overrideHijriYear = null) {
  const cacheKey = `${event.slug}-${targetDate.getTime()}-${overrideHijriYear || 'auto'}`;

  // Return cached result if available
  if (eventMetaCache.has(cacheKey)) {
    return eventMetaCache.get(cacheKey);
  }

  // Compute the meta using the internal function
  const meta = _resolveEventMetaInternal(event, targetDate, overrideHijriYear);

  // Cache the result
  eventMetaCache.set(cacheKey, meta);

  return meta;
}

/**
 * Clear the entire event meta cache
 * Useful for testing or when data changes
 */
export function clearEventMetaCache() {
  eventMetaCache.clear();
}

/**
 * Clear cache for a specific event
 * @param {string} slug - The event slug
 */
export function clearEventCache(slug) {
  for (const key of eventMetaCache.keys()) {
    if (key.startsWith(`${slug}-`)) {
      eventMetaCache.delete(key);
    }
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
  return {
    size: eventMetaCache.size,
    keys: Array.from(eventMetaCache.keys())
  };
}
