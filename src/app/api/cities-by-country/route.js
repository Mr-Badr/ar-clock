import { z } from 'zod';

import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getCitiesByCountry } from '@/lib/db/queries/cities';
import { json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';
import { logger } from '@/lib/logger';

const querySchema = z.object({
  country: z.string().trim().regex(/^[a-z0-9-]{2,64}$/i, 'Invalid country slug.'),
});

export const GET = withApiHandler(
  '/api/cities-by-country',
  async ({ request, requestId }) => {
    const { country: countrySlug } = parseSearchParams(request, querySchema);

    const country = await getCountryBySlug(countrySlug)
    if (!country) {
      return json({ error: 'Country not found.' }, { status: 404 });
    }

    const cities = await getCitiesByCountry(country.country_code);

    logger.info('cities-by-country-served', {
      route: '/api/cities-by-country',
      requestId,
      countrySlug,
      countryCode: country.country_code,
      cityCount: cities?.length || 0,
    });

    const formattedCities = (cities || []).map(city => ({
      city_slug: city.city_slug,
      city_name_ar: city.name_ar,
      city_name_en: city.name_en,
      country_slug: country.country_slug,
      country_code: country.country_code,
      country_name_ar: country.name_ar,
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
      key: 'cities-by-country',
      limit: 90,
      windowMs: 60_000,
    },
  },
);
