import { calculatePrayerTimes } from '@/lib/prayerEngine';
import { json, withApiHandler } from '@/lib/api/route-utils';

const SAMPLE_CITY = {
  cityNameAr: 'الرباط',
  countryCode: 'MA',
  lat: 34.020882,
  lon: -6.84165,
  timezone: 'Africa/Casablanca',
  cacheKey: 'country::morocco::rabat',
};

export const GET = withApiHandler('/api/test-prayer', async ({ requestId }) => {
  const checkedAt = new Date();
  const times = calculatePrayerTimes({
    lat: SAMPLE_CITY.lat,
    lon: SAMPLE_CITY.lon,
    timezone: SAMPLE_CITY.timezone,
    date: checkedAt,
    countryCode: SAMPLE_CITY.countryCode,
    cacheKey: SAMPLE_CITY.cacheKey,
  });

  if (!times) {
    return json(
      {
        ok: false,
        error: 'تعذر حساب مواقيت الصلاة التجريبية لعينة الرباط.',
        requestId,
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  return json({
    ok: true,
    sample: SAMPLE_CITY,
    checkedAt: checkedAt.toISOString(),
    times,
    requestId,
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}, {
  rateLimit: {
    key: 'test-prayer',
    limit: 30,
    windowMs: 60_000,
  },
});
