import { z } from 'zod';

import { searchCities as dbSearchCities } from '@/lib/db/queries/cities';

import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  q: z.string().trim().max(80).optional().default(''),
  limit: z.coerce.number().int().min(1).max(10).optional().default(10),
});

const CITY_SEARCH_CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
};

function citySearchJson(data) {
  return json(data, {
    headers: CITY_SEARCH_CACHE_HEADERS,
  });
}

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

export const GET = withApiHandler(
  '/api/search-city',
  async ({ request }) => {
    const { q: query, limit } = parseSearchParams(request, querySchema);

    if (!query || query.length < 2) {
      return citySearchJson([]);
    }

    if (query.length < 4) {
      return citySearchJson([]);
    }

    const cities = await dbSearchCities(query, limit);
    const results = cities.map(normalizeCity);

    return citySearchJson(results);
  },
  {
    rateLimit: {
      key: 'search-city',
      limit: 120,
      windowMs: 60_000,
    },
  },
);
