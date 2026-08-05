import { z } from 'zod';

import {
  json,
  parseSearchParams,
  withApiHandler,
} from '@/lib/api/route-utils';
import { logger, serializeError } from '@/lib/logger';

// NHTSA vPIC (vehicle Product Information Catalog) — a free, public, no-key-required US
// government API. It doesn't send Access-Control-Allow-Origin, so a browser can't call it
// directly (confirmed via a real curl check, 2026-08-02) — this route exists purely to proxy
// the request server-side, where CORS doesn't apply.
const vinSchema = z
  .string()
  .trim()
  .toUpperCase()
  .length(17, 'رقم الشاصي يجب أن يتكون من 17 حرفاً ورقماً بالضبط')
  .regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'رقم الشاصي يحتوي على حرف غير صالح (لا يُستخدم I أو O أو Q في أي VIN)');

const querySchema = z.object({
  vin: vinSchema,
});

// Only the fields actually shown on the page — NHTSA returns 100+, most empty for non-US VINs.
const RELEVANT_FIELDS = [
  'Make', 'Model', 'ModelYear', 'BodyClass', 'VehicleType',
  'EngineCylinders', 'DisplacementL', 'FuelTypePrimary', 'DriveType',
  'PlantCountry', 'PlantCity', 'Manufacturer', 'ErrorCode', 'ErrorText',
];

export const GET = withApiHandler(
  '/api/vin-decode',
  async ({ request, requestId }) => {
    const { vin } = parseSearchParams(request, querySchema);

    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'miqatona-vin-proxy/1.0' },
      });

      if (!response.ok) {
        throw new Error(`NHTSA upstream returned ${response.status}.`);
      }

      const payload = await response.json();
      const result = payload?.Results?.[0] ?? null;
      const fields = {};
      if (result) {
        for (const key of RELEVANT_FIELDS) fields[key] = result[key] || null;
      }

      return json(
        { ok: true, vin, fields },
        { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
      );
    } catch (error) {
      logger.warn('vin-decode-upstream-failed', {
        route: '/api/vin-decode',
        requestId,
        error: serializeError(error),
        vin,
      });
      return json(
        { ok: false, error: 'تعذر الوصول لقاعدة بيانات NHTSA الآن — التحليل العام لرقم الشاصي أدناه لا يزال يعمل.' },
        { status: 502 },
      );
    } finally {
      clearTimeout(timeout);
    }
  },
  {
    rateLimit: {
      key: 'vin-decode',
      limit: 30,
      windowMs: 60_000,
    },
  },
);
