/**
 * lib/cityService.js
 *
 * City resolution pipeline — THREE tiers:
 *   1. in-memory seed (seedCities.json) — ZERO latency (O(1) Map lookup)
 *   2. Next.js unstable_cache → Supabase DB (~30-100ms, then cached across renders)
 *   3. OSM/Nominatim fallback — one-time ~400ms, then inserted into Supabase & cached
 *
 * WHY SEED-FIRST:
 * - 90%+ of Arabic prayer-time searches hit the top 200-500 cities.
 * - Serving from memory avoids ALL network/DB cost for these.
 *
 * Adding Redis/edge cache later:
 * - Replace `supabaseLRU` Map with redis.get/set calls.
 * - Wrap `findCityBySlug` result with `unstable_cache(fn, [key], { revalidate: 3600 })`.
 */

import { unstable_cache } from 'next/cache';
import seedData from './seedCities.json';
import { supabaseServer } from './supabaseClient';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripDiacritics(str = '') {
  return str.replace(/[\u064B-\u065F\u0670]/g, '');
}

// ─── In-memory seed index ────────────────────────────────────────────────────
// Build slug map once at module load time for O(1) lookups
const SEED_INDEX = new Map(
  seedData.map(c => [`${c.country_slug}::${c.city_slug}`, c])
);

// ─── Simple LRU cache for Supabase results (avoids re-querying same city) ────
// For production scale, replace with Redis or edge KV.
const MAX_LRU = 500;
const supabaseLRU = new Map();

function lruGet(key) {
  if (!supabaseLRU.has(key)) return null;
  const val = supabaseLRU.get(key);
  // Refresh position
  supabaseLRU.delete(key);
  supabaseLRU.set(key, val);
  return val;
}

function lruSet(key, val) {
  if (supabaseLRU.size >= MAX_LRU) {
    // Evict the oldest entry
    const firstKey = supabaseLRU.keys().next().value;
    supabaseLRU.delete(firstKey);
  }
  supabaseLRU.set(key, val);
}

// ─── Tier 1: Seed lookup ──────────────────────────────────────────────────────
function findInSeed(countrySlug, citySlug) {
  return SEED_INDEX.get(`${countrySlug}::${citySlug}`) || null;
}

// ─── Tier 2: Supabase lookup wrapped with Next.js Data Cache ─────────────────
// unstable_cache persists across requests *within a build* (ISR-aware).
// The in-process LRU is a faster fallback within the same lambda instance.
const _fetchFromSupabase = unstable_cache(
  async (countrySlug, citySlug) => {
    try {
      const { data, error } = await supabaseServer
        .from('cities')
        .select('*')
        .eq('country_slug', countrySlug)
        .eq('city_slug', citySlug)
        .maybeSingle();
      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  },
  ['city-by-slug'],       // cache key namespace
  { revalidate: 86400 }  // refresh city data daily (matches ISR)
);

async function findInSupabase(countrySlug, citySlug) {
  const cacheKey = `${countrySlug}::${citySlug}`;
  // Check process-level LRU first (fastest)
  const cached = lruGet(cacheKey);
  if (cached) return cached;
  const data = await _fetchFromSupabase(countrySlug, citySlug);
  if (data) lruSet(cacheKey, data);
  return data;
}

// ─── Tier 3: Nominatim geocoding fallback ────────────────────────────────────
async function geocodeAndInsert(countrySlug, citySlug) {
  const q = encodeURIComponent(`${citySlug.replace(/-/g, ' ')}, ${countrySlug.replace(/-/g, ' ')}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&accept-language=ar`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'MwaqitAlSalat/1.0 (contact@example.com)' },
      next: { revalidate: 86400 } // Next.js cache the geocode call for 24h
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.length) return null;

    const hit = json[0];
    const newCity = {
      country_slug: countrySlug,
      country_name_ar: countrySlug, // placeholder — improve with a country map
      city_slug: citySlug,
      city_name_ar: hit.display_name.split(',')[0].trim(),
      city_name_en: hit.display_name.split(',')[0].trim(),
      lat: parseFloat(hit.lat),
      lon: parseFloat(hit.lon),
      timezone: 'UTC', // Nominatim doesn't return tz — use geo-tz lib in prod
      population: 0,
      priority: 0,
    };

    // Fire-and-forget insert to grow the DB organically
    supabaseServer.from('cities').upsert(newCity, { onConflict: 'country_slug,city_slug' }).then();

    return newCity;
  } catch {
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Primary entry point — resolves a city through all three tiers.
 */
export async function findCityBySlug(countrySlug, citySlug) {
  return (
    findInSeed(countrySlug, citySlug) ||
    (await findInSupabase(countrySlug, citySlug)) ||
    (await geocodeAndInsert(countrySlug, citySlug))
  );
}

/**
 * Search cities — seed index first for instant UX, merge Supabase as fallback.
 * Used by the search-cities API route only (never called from client directly).
 *
 * @param {string} query
 * @param {number} [limit=10]
 */
export async function searchCities(query, limit = 10, country = null) {
  console.log(`🔍 [Search] query="${query}" country="${country}" limit=${limit}`);
  const q = query.toLowerCase().trim();
  if (!q && !country) return [];

  // 1. Core Logic: Local-First with Global Fallback
  // We'll perform one search pass that prioritizes the country but allows global matches

  // Step A: Search Seed Data
  let seedResults = seedData.filter(c => {
    if (!q) return country ? c.country_slug === country : true;

    const ar = stripDiacritics(c.city_name_ar);
    const en = (c.city_name_en || '').toLowerCase();
    const coAr = stripDiacritics(c.country_name_ar || '');
    const coEn = (c.country_slug || '').toLowerCase();

    const matchesCity = ar.includes(q) || en.includes(q) || c.city_slug.includes(q);
    const matchesCountry = coAr.includes(q) || coEn.includes(q);

    return matchesCity || matchesCountry;
  });

  // Sort seed: Priority to [Country Match AND City Match] > [Country Match Only] > [Global Match]
  seedResults = seedResults.sort((a, b) => {
    const aInCo = country && a.country_slug === country ? 5000 : 0;
    const bInCo = country && b.country_slug === country ? 5000 : 0;

    const aCoExact = a.country_slug === q || stripDiacritics(a.country_name_ar) === q ? 2000 : 0;
    const bCoExact = b.country_slug === q || stripDiacritics(b.country_name_ar) === q ? 2000 : 0;

    const aExact = a.city_slug === q || a.city_name_ar === q ? 1000 : 0;
    const bExact = b.city_slug === q || b.city_name_ar === q ? 1000 : 0;

    return (bInCo + bCoExact + bExact + b.priority) - (aInCo + aCoExact + aExact + a.priority);
  }).slice(0, limit);

  console.log(`   └─ Found ${seedResults.length} in seed data`);

  // If we have enough high-quality results from seed, return them
  if (seedResults.length >= limit) return seedResults;

  // Step B: Supabase Search
  try {
    let queryBuilder = supabaseServer
      .from('cities')
      .select('country_slug, country_name_ar, city_slug, city_name_ar, city_name_en, timezone, population, priority');

    if (q) {
      // Improved query: search globally by default but results will be prioritized by priority/population
      queryBuilder = queryBuilder.or(`city_name_ar.ilike.%${q}%,city_name_en.ilike.%${q}%,city_slug.ilike.%${q}%,country_name_ar.ilike.%${q}%,country_slug.ilike.%${q}%`);
    } else if (country) {
      queryBuilder = queryBuilder.eq('country_slug', country);
    }

    const { data } = await queryBuilder
      .order('priority', { ascending: false })
      .order('population', { ascending: false })
      .limit(limit * 2); // Get a larger pool to filter/rank

    const seedSlugs = new Set(seedResults.map(c => `${c.country_slug}::${c.city_slug}`));
    const extra = (data || []).filter(c => !seedSlugs.has(`${c.country_slug}::${c.city_slug}`));

    // Final merge and smart re-sort
    const final = [...seedResults, ...extra]
      .sort((a, b) => {
        // Priority to specified country
        const aInCo = country && a.country_slug === country ? 10000 : 0;
        const bInCo = country && b.country_slug === country ? 10000 : 0;

        // Priority to country-name matches (e.g. searching "Canada")
        const aCoMatch = (a.country_slug || '').includes(q) || (a.country_name_ar || '').includes(q) ? 5000 : 0;
        const bCoMatch = (b.country_slug || '').includes(q) || (b.country_name_ar || '').includes(q) ? 5000 : 0;

        return (bInCo + bCoMatch + b.priority) - (aInCo + aCoMatch + a.priority);
      })
      .slice(0, limit);

    console.log(`   └─ Final merge: ${final.length} results (merged ${extra.length} from Supabase)`);

    // Step C: Global External Fallback (Nominatim)
    // If we still have very few results, try searching the real world
    if (final.length < 3 && q.length > 2) {
      console.log(`   └─ Low results (${final.length}), triggering Nominatim search`);
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=ar`;
      try {
        const geoRes = await fetch(geoUrl, {
          headers: { 'User-Agent': 'MwaqitAlSalat/1.0' },
          next: { revalidate: 86400 }
        });
        if (geoRes.ok) {
          const geoJson = await geoRes.json();
          const geoResults = geoJson.map(hit => ({
            country_slug: hit.display_name.split(',').pop().trim().toLowerCase().replace(/\s+/g, '-'),
            country_name_ar: hit.display_name.split(',').pop().trim(),
            city_slug: hit.display_name.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-'),
            city_name_ar: hit.display_name.split(',')[0].trim(),
            city_name_en: hit.name,
            lat: parseFloat(hit.lat),
            lon: parseFloat(hit.lon),
            timezone: 'UTC', // Default to UTC, server component will resolve it or TimezoneBanner will handle it
            priority: 0,
            is_external: true
          }));

          // Avoid duplicates with what we already have
          const existingSlugs = new Set(final.map(c => `${c.country_slug}::${c.city_slug}`));
          const uniqueGeo = geoResults.filter(c => !existingSlugs.has(`${c.country_slug}::${c.city_slug}`));

          const expanded = [...final, ...uniqueGeo].slice(0, limit);
          console.log(`   └─ Nominatim found ${uniqueGeo.length} external results. Total: ${expanded.length}`);
          return expanded;
        }
      } catch (geoErr) {
        console.error(`   └─ Nominatim search failed:`, geoErr);
      }
    }

    return final;
  } catch (err) {
    console.error(`   └─ Supabase search error:`, err);
    return seedResults;
  }
}

/**
 * Returns a unique list of countries from seed data + top countries in Supabase.
 */
export async function getCountries() {
  const seedCountries = new Map();
  seedData.forEach(c => {
    if (!seedCountries.has(c.country_slug)) {
      seedCountries.set(c.country_slug, { slug: c.country_slug, name_ar: c.country_name_ar });
    }
  });

  try {
    const { data } = await supabaseServer
      .from('countries')
      .select('slug, name_ar')
      .order('priority', { ascending: false });

    const dbCountries = data || [];
    for (const country of dbCountries) {
      if (!seedCountries.has(country.slug)) {
        seedCountries.set(country.slug, { slug: country.slug, name_ar: country.name_ar });
      }
    }
  } catch (e) {
    console.error('Failed to fetch countries from Supabase', e);
  }

  return Array.from(seedCountries.values()).sort((a, b) => a.name_ar.localeCompare(b.name_ar, 'ar'));
}

/**
 * Finds the nearest city to coordinates using Haversine distance.
 */
export async function findNearestCity(lat, lon) {
  // 1. Check seed data first (Tier 1: Instant)
  let nearest = null;
  let minDistance = Infinity;

  const getDist = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  for (const city of seedData) {
    const d = getDist(lat, lon, city.lat, city.lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = city;
    }
  }

  // 2. Check Supabase (Tier 2: Fast)
  // If nearest seed is > 5km away, maybe the DB has a closer one
  if (minDistance > 5) {
    try {
      const { data } = await supabaseServer.rpc('find_nearest_cities', {
        user_lat: lat,
        user_lon: lon,
        lim: 1
      });

      if (data && data.length > 0) {
        const topDb = data[0];
        const dbDist = getDist(lat, lon, topDb.lat, topDb.lon);
        if (dbDist < minDistance) {
          minDistance = dbDist;
          nearest = topDb;
        }
      }
    } catch (e) {
      console.error('Nearest city RPC failed', e);
    }
  }

  // 3. External Fallback (Tier 3: Reverse Geocoding)
  // If still > 5km or no city, call Nominatim to find the real identity of this coordinate
  if (minDistance > 5 || !nearest) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`, {
        headers: { 'User-Agent': 'MwaqitAlSalat/1.0' },
        next: { revalidate: 86400 }
      });

      if (res.ok) {
        const hit = await res.json();
        if (hit && hit.address) {
          const cityName = hit.address.city || hit.address.town || hit.address.village || hit.address.suburb || hit.display_name.split(',')[0];
          const countryName = hit.address.country;
          const countryCode = hit.address.country_code?.toLowerCase();

          const newCity = {
            country_slug: countryCode, // best guess from code
            country_name_ar: countryName,
            city_slug: cityName.toLowerCase().replace(/\s+/g, '-'),
            city_name_ar: cityName,
            city_name_en: cityName, // fallback
            lat: parseFloat(hit.lat),
            lon: parseFloat(hit.lon),
            timezone: nearest?.timezone || 'UTC', // Borrow nearest seed city's timezone as best guess
            population: 0,
            priority: 0,
          };

          // Save to DB in background
          supabaseServer.from('cities').upsert(newCity, { onConflict: 'country_slug,city_slug' }).then();

          return newCity;
        }
      }
    } catch (e) {
      console.error('Nominatim reverse failed', e);
    }
  }

  return nearest;
}

/**
 * Returns top N seed city entries for generateStaticParams
 */
export function getTopSeedCities(n = 100) {
  return [...seedData]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, n);
}

/**
 * Map an IANA timezone string to a best-matching seed city.
 */
export function mapTimezoneToCityFromSeed(tz) {
  // Direct timezone match first
  const direct = seedData.find(c => c.timezone === tz && c.priority >= 90);
  if (direct) return direct;

  // Country-level heuristic (e.g. "Asia/Riyadh" → Saudi Arabia)
  const partial = seedData.find(c => c.timezone === tz);
  return partial || null;
}
