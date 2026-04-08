import { headers } from 'next/headers';

import { resolveRequestLocationFromHeaders } from '@/lib/locationService';

export async function getEconomyViewerContext() {
  const hdrs = await headers();
  const matchedCity = await resolveRequestLocationFromHeaders(hdrs).catch(() => null);
  const fallbackTimezone = hdrs.get('x-vercel-ip-timezone') || matchedCity?.timezone || 'UTC';
  const fallbackCountryCode = hdrs.get('x-vercel-ip-country') || matchedCity?.country_code || '';

  return {
    timezone: matchedCity?.timezone || fallbackTimezone || 'UTC',
    cityNameAr: matchedCity?.city_name_ar || matchedCity?.name_ar || '',
    countryNameAr: matchedCity?.country_name_ar || '',
    countryCode: matchedCity?.country_code || fallbackCountryCode || '',
    source: matchedCity ? 'detected-city' : 'timezone',
  };
}
