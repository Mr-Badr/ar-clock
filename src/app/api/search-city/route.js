import { z } from 'zod';

import { searchCities } from '@/lib/db/queries/cities';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';

const querySchema = z.object({
  q: z.string().trim().max(80).optional().default(''),
  limit: z.coerce.number().int().min(1).max(10).optional().default(10),
});

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

    const cities = await searchCities(query, limit);

    const formattedCities = cities.map(city => ({
      city_slug: city.city_slug,
      city_name_ar: city.name_ar,
      city_name_en: city.name_en,
      country_slug: city.countries.country_slug,
      country_code: city.country_code,
      country_name_ar: city.countries.name_ar,
      timezone: city.timezone,
      lat: city.lat,
      lon: city.lon,
      is_capital: city.is_capital,
      population: city.population,
    }));

    return json(formattedCities, {
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
