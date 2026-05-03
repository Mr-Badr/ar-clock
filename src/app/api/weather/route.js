import { z } from 'zod';

import {
  ApiValidationError,
  json,
  parseSearchParams,
  withApiHandler,
} from '@/lib/api/route-utils';
import { logger, serializeError } from '@/lib/logger';
import { readFallbackCache, writeFallbackCache } from '@/lib/server/fallback-cache';

const csvCoordinates = z
  .string()
  .trim()
  .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean))
  .superRefine((values, ctx) => {
    if (values.length === 0) {
      ctx.addIssue({ code: 'custom', message: 'At least one coordinate is required.' });
      return;
    }

    if (values.length > 10) {
      ctx.addIssue({ code: 'custom', message: 'A maximum of 10 coordinates is allowed.' });
    }
  });

const querySchema = z.object({
  latitudes: csvCoordinates,
  longitudes: csvCoordinates,
});

function parseCoordinates(values, min, max, label) {
  return values.map((value, index) => {
    const number = Number(value);

    if (!Number.isFinite(number) || number < min || number > max) {
      throw new ApiValidationError('Invalid coordinate values.', [
        { path: `${label.toLowerCase()}.${index}`, message: `${label} is out of range.` },
      ]);
    }

    return number;
  });
}

export const GET = withApiHandler(
  '/api/weather',
  async ({ request, requestId }) => {
    const { latitudes: latitudeValues, longitudes: longitudeValues } = parseSearchParams(request, querySchema);

    if (latitudeValues.length !== longitudeValues.length) {
      return json({ error: 'Latitude/longitude counts must match.' }, { status: 400 });
    }

    const latitudes = parseCoordinates(latitudeValues, -90, 90, 'Latitude');
    const longitudes = parseCoordinates(longitudeValues, -180, 180, 'Longitude');
    const cacheKey = `weather:${latitudes.join(',')}:${longitudes.join(',')}`;
    const staleEntry = readFallbackCache(cacheKey, 6 * 60 * 60 * 1000);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes.join(',')}&longitude=${longitudes.join(',')}&current=temperature_2m,weather_code,is_day`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 600 },
        headers: {
          'User-Agent': 'miqat-weather-proxy/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Weather upstream returned ${response.status}.`);
      }

      const payload = await response.json();
      writeFallbackCache(cacheKey, payload);

      return json(payload, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600',
        },
      });
    } catch (error) {
      logger.warn('weather-upstream-failed', {
        route: '/api/weather',
        requestId,
        error: serializeError(error),
        cacheKey,
      });

      if (staleEntry) {
        return json(
          {
            ...staleEntry.value,
            degraded: true,
            stale: true,
            staleAt: new Date(staleEntry.updatedAt).toISOString(),
          },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=3600',
              'X-Data-Fallback': 'stale-cache',
            },
          },
        );
      }

      return json({ error: 'Weather request failed.' }, { status: 502 });
    } finally {
      clearTimeout(timeout);
    }
  },
  {
    rateLimit: {
      key: 'weather',
      limit: 90,
      windowMs: 60_000,
    },
  },
);
