'use server';

import {
  getLastThirdOfNightFacts,
  getDuhaPrayerFacts,
  getFridayResponseHourFacts,
  getProhibitedPrayerWindowsFacts,
} from '@/lib/night-prayer-facts';

// Keeps `adhan` (imported transitively via night-prayer-facts → prayerEngine)
// out of the client bundle — the client only ever needs the small computed
// label/boolean output, not the calculation engine itself.
const FACT_BUILDERS = {
  'last-third': getLastThirdOfNightFacts,
  duha: getDuhaPrayerFacts,
  friday: getFridayResponseHourFacts,
  prohibited: getProhibitedPrayerWindowsFacts,
};

export async function getNightPrayerFactsAction({ factType, lat, lon, timezone, countryCode }) {
  const builder = FACT_BUILDERS[factType];
  if (!builder) return null;

  try {
    // No time-based suffix here: calculatePrayerTimes' own cache key already
    // includes the date, so the underlying day's prayer times are computed
    // once and reused all day. The live "is it happening now" booleans are
    // still computed fresh on every call (compared against `date` below),
    // so nothing about "now" is stale — only the cache key needs to stay
    // stable per location+day to avoid growing the bounded module cache.
    return builder({
      lat: Number(lat),
      lon: Number(lon),
      timezone: String(timezone || ''),
      date: new Date(),
      countryCode: countryCode || undefined,
      cacheKey: `${lat},${lon}::${factType}`,
    });
  } catch {
    return null;
  }
}
