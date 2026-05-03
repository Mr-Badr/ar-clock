import { calculatePrayerTimes } from '@/lib/prayerEngine';
import { json, withApiHandler } from '@/lib/api/route-utils';

export const GET = withApiHandler('/api/test-prayer', async () => {
  const times = calculatePrayerTimes({
    lat: 34.020882,
    lon: -6.84165,
    timezone: 'Africa/Casablanca',
    date: new Date(),
    countryCode: 'MA',
    cacheKey: 'country::morocco::rabat',
  });

  return json(times, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
});
