import { connection } from 'next/server';
import { z } from 'zod';

import { detectBestCityMatch } from '@/lib/locationService';
import { searchCities } from '@/lib/db/queries/cities';
import { lookupIpGeo } from '@/lib/ip-lookup';
import { getRequestIp, json, parseSearchParams, withApiHandler } from '@/lib/api/route-utils';
import { logger, serializeError } from '@/lib/logger';

const querySchema = z.object({
  timezoneHint: z.string().trim().max(80).optional().default(''),
  countryCodeHint: z.string().trim().max(2).optional().default(''),
});

/**
 * api/ip-city/route.js
 * 
 * Falls back to IP-based location detection when GPS is not available.
 * Uses ip-api.com (free for non-commercial).
 */
export const GET = withApiHandler(
  '/api/ip-city',
  async ({ request, requestId }) => {
    await connection();

    const { timezoneHint, countryCodeHint } = parseSearchParams(request, querySchema);
    const normalizedCountryCodeHint = countryCodeHint ? countryCodeHint.toUpperCase() : '';
    const ip = String(getRequestIp(request) || '').trim();

    const data = ip
      ? await lookupIpGeo(ip, {
          fields: ['status', 'message', 'country', 'countryCode', 'city', 'lat', 'lon', 'timezone'],
          revalidate: 3600,
        })
      : null;

    const city = await detectBestCityMatch({
      lat: data?.lat,
      lon: data?.lon,
      timezone: timezoneHint || data?.timezone,
      countryCode: normalizedCountryCodeHint || data?.countryCode,
      cityName: data?.city,
    });

    if (city) {
      return json(city, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        },
      });
    }

    if (!data?.city) {
      logger.warn('ip-city-no-hints', {
        route: '/api/ip-city',
        requestId,
        ip,
        timezoneHint,
        countryCodeHint: normalizedCountryCodeHint,
      });

      return json({ error: 'No location hints available.' }, { status: 404 });
    }

    const results = await searchCities(data.city, 1);
    if (results.length > 0) {
      const result = results[0];
      return json({
        ...result,
        country_slug: result.countries?.country_slug || result.country_slug,
        country_name_ar: result.countries?.name_ar || result.country_name_ar,
        city_name_ar: result.name_ar,
        city_name_en: result.name_en,
        timezone: result.timezone,
      });
    }

    logger.warn('ip-city-db-fallback-miss', {
      route: '/api/ip-city',
      requestId,
      ip,
      lookupCity: data.city,
      lookupCountryCode: data.countryCode,
    });

    return json({ error: 'No matching city in database.' }, { status: 404 });
  },
  {
    rateLimit: {
      key: 'ip-city',
      limit: 60,
      windowMs: 60_000,
    },
  },
);
