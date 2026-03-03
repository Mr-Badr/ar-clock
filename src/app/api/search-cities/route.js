/**
 * app/api/search-cities/route.js
 *
 * Server search endpoint — THE ONLY ENDPOINT the client calls for city suggestions.
 *
 * SECURITY:
 * - Uses service_role key on server (via cityService.js) — never exposed to browser.
 * - Rate limiting: per-IP token bucket (10 req / 10 sec window).
 * - Returns small payloads only — prevents full-table dumps.
 *
 * PERFORMANCE:
 * - In-memory request-level cache (LRU 300 entries, 60s TTL) avoids re-searching same query.
 * - Seed results appear <20ms; Supabase fallback merges within ~200ms.
 *
 * ADDING REDIS LATER:
 * - Replace queryCache with `redis.get(key)` / `redis.set(key, val, { ex: 60 })`.
 */

import { NextResponse } from 'next/server';
import { searchCities } from '@/lib/cityService';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import seedData from '@/lib/seedCities.json';

// ─── Rate limiter: simple in-memory per-IP token bucket ──────────────────────
const RATE_LIMIT = 10;      // requests
const RATE_WINDOW = 10_000; // ms (10 seconds)
const rateLimitMap = new Map(); // IP → { count, resetAt }

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true; // allowed
  }

  if (entry.count >= RATE_LIMIT) return false; // blocked

  entry.count++;
  return true; // allowed
}

// ─── Query result cache (LRU 300, 60s TTL) ───────────────────────────────────
const QUERY_CACHE_SIZE = 300;
const QUERY_CACHE_TTL = 60_000; // ms
const queryCache = new Map();

function cacheGet(key) {
  const hit = queryCache.get(key);
  if (!hit || Date.now() > hit.expiresAt) { queryCache.delete(key); return null; }
  return hit.value;
}

function cacheSet(key, value) {
  if (queryCache.size >= QUERY_CACHE_SIZE) {
    queryCache.delete(queryCache.keys().next().value); // evict oldest
  }
  queryCache.set(key, { value, expiresAt: Date.now() + QUERY_CACHE_TTL });
}

// ─── Next prayer preview snippet (cached in prayerEngine internally) ─────────
function buildPreviewSnippet(city) {
  try {
    const times = calculatePrayerTimes({
      lat: city.lat, lon: city.lon,
      timezone: city.timezone || 'UTC',
      date: new Date(),
      cacheKey: `${city.country_slug}::${city.city_slug}`
    });
    if (!times) return null;

    const { nextKey, nextIso } = getNextPrayer(times, new Date().toISOString());
    const PRAYER_AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    const timeStr = formatTime(nextIso, city.timezone || 'UTC', false);
    return `${PRAYER_AR[nextKey] || nextKey}: ${timeStr}`;
  } catch {
    return null;
  }
}

export async function GET(request) {
  // Rate limit by IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  const country = (searchParams.get('country') || '').trim();

  // If both empty, return nothing
  if (!q && !country) return NextResponse.json([]);
  if (q.length > 60) return NextResponse.json({ error: 'Query too long' }, { status: 400 });

  // Check query cache
  const cacheKey = `q:${q}:c:${country}`;
  const cacheHit = cacheGet(cacheKey);
  if (cacheHit) {
    return NextResponse.json(cacheHit, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'no-store' }
    });
  }

  const cities = await searchCities(q, 10, country);

  // Add preview snippet to top 3 results
  const enriched = cities.map((city, i) => ({
    country_slug: city.country_slug,
    country_name_ar: city.country_name_ar,
    city_slug: city.city_slug,
    city_name_ar: city.city_name_ar,
    city_name_en: city.city_name_en || '',
    timezone: city.timezone,
    population: city.population,
    // Only compute expensive preview for top 3
    preview: i < 3 ? buildPreviewSnippet(city) : null,
  }));

  cacheSet(cacheKey, enriched);
  return NextResponse.json(enriched, {
    headers: { 'X-Cache': 'MISS', 'Cache-Control': 'no-store' }
  });
}
