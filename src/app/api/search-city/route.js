import { z } from 'zod';

import { searchCities as dbSearchCities } from '@/lib/db/queries/cities';
import fallbackCities from '@/lib/db/fallback/cities-index.json';

import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  q: z.string().trim().max(80).optional().default(''),
  limit: z.coerce.number().int().min(1).max(10).optional().default(10),
});

// ==========================
// ⚡ 1. FAST FALLBACK SEARCH
// ==========================
function searchFallback(query, limit) {
  const q = query.toLowerCase();

  return fallbackCities
    .filter((c) =>
      c.city_name_en?.toLowerCase().includes(q) ||
      c.city_name_ar?.includes(query) ||
      c.country_name_ar?.includes(query)
    )
    .slice(0, limit)
    .map(normalizeCity);
}

// ==========================
// 🧠 normalize shared format
// ==========================
function normalizeCity(city) {
  return {
    city_slug: city.city_slug,
    city_name_ar: city.city_name_ar,
    city_name_en: city.city_name_en,
    country_slug: city.country_slug || city.country_code,
    country_code: city.country_code,
    country_name_ar: city.country_name_ar,
    timezone: city.timezone,
    lat: city.lat,
    lon: city.lon,
    is_capital: city.is_capital,
    population: city.population || 0,
    _source: city._source || 'fallback',
  };
}

// ==========================
// 🔀 merge + dedupe + ranking
// ==========================
function mergeAndRank(fallback, db, limit) {
  const map = new Map();

  for (const c of fallback) {
    map.set(`${c.country_code}-${c.city_slug}`, {
      ...c,
      _score: 1, // fallback base score
    });
  }

  for (const c of db) {
    const key = `${c.country_code}-${c.city_slug}`;

    const normalized = {
      ...c,
      _source: 'db',
      _score: 3 + (c.population || 0) / 1_000_000, // boost important cities
    };

    if (!map.has(key)) {
      map.set(key, normalized);
    } else {
      // DB overrides fallback
      map.set(key, {
        ...map.get(key),
        ...normalized,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}

// ==========================
// 🚀 API
// ==========================
export const GET = withApiHandler(
  '/api/search-city',
  async ({ request }) => {
    const { q: query, limit } = parseSearchParams(request, querySchema);

    if (!query || query.length < 2) {
      return json([]);
    }

    if (query.length < 4) {
      return json([], {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // ⚡ STEP 1: fallback instant
    const fallback = searchFallback(query, limit);

    // 🧠 STEP 2: DB enrichment
    let db = [];
    try {
      const cities = await dbSearchCities(query, limit);

      db = cities.map(normalizeCity);
    } catch (e) {
      console.warn('[search-city] DB failed → fallback only');
    }

    // 🔀 STEP 3: merge + rank
    const results = mergeAndRank(fallback, db, limit);

    return json(results, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  },
  {
    rateLimit: {
      key: 'search-city',
      limit: 120,
      windowMs: 60_000,
    },
  },
);
