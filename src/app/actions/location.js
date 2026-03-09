'use server';

import {
  findNearestCity,
  mapTimezoneToCityFromSeed
} from '@/lib/locationService';
import { searchCities } from '@/lib/db/queries/cities';
import { getAllCountries } from '@/lib/db/queries/countries';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import { getTimeDifference } from '@/lib/time-diff';

// ─── Next prayer preview snippet ─────────
function buildPreviewSnippet(city) {
  try {
    const times = calculatePrayerTimes({
      lat: city.lat, lon: city.lon,
      timezone: city.timezone || 'UTC',
      date: new Date(),
      cacheKey: `${city.country_slug}::${city.city_slug}`
    });
    if (!times) return null;

    const { nextKey, nextIso } = getNextPrayer(times, new Date().toISOString());
    const PRAYER_AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    const timeStr = formatTime(nextIso, city.timezone || 'UTC', false);
    return `${PRAYER_AR[nextKey] || nextKey}: ${timeStr}`;
  } catch {
    return null;
  }
}

/**
 * Perform a city search (used by typeahead/search bar)
 */
export async function searchCitiesAction(q = '', limit = 8, countrySlug = '') {
  const cities = await searchCities(q, limit); // Fallback ignores country filtering for now, relies on DB ranking

  return cities.map((city, i) => {
    const metaCountrySlug = city.countries?.country_slug || '';
    return {
      country_slug: metaCountrySlug,
      country_name_ar: city.countries?.name_ar || '',
      country_name_en: city.countries?.name_en || '',
      country_code: city.country_code || '',
      city_slug: city.city_slug || '',
      city_name_ar: city.name_ar || '',
      city_name_en: city.name_en || '',
      timezone: city.timezone || 'UTC',
      population: city.population || 0,
      is_capital: city.is_capital || false,
      preview: i < 3 ? buildPreviewSnippet({ ...city, country_slug: metaCountrySlug }) : null,
    };
  });
}

/**
 * Get unified list of countries 
 */
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';

export async function getCountriesAction() {
  const all = await getAllCountries();

  const priorityMap = new Map();
  // Arab countries get tier 0 (0-21)
  PRIORITY_COUNTRY_SLUGS.forEach((slug, index) => priorityMap.set(slug, index));
  // Global popular countries get tier 1 (100-116)
  GLOBAL_POPULAR_COUNTRIES.forEach((slug, index) => priorityMap.set(slug, 100 + index));

  return all.sort((a, b) => {
    const aPrio = priorityMap.has(a.country_slug) ? priorityMap.get(a.country_slug) : 999;
    const bPrio = priorityMap.has(b.country_slug) ? priorityMap.get(b.country_slug) : 999;
    if (aPrio !== bPrio) return aPrio - bPrio;
    return (a.name_ar || '').localeCompare(b.name_ar || '', 'ar');
  }).map(c => ({
    ...c,
    slug: c.country_slug
  }));
}

/**
 * Use server-side geodesic calculation to find nearest city
 */
export async function getNearestCityAction(lat, lon) {
  return await findNearestCity(lat, lon);
}

/**
 * Resolve an IANA timezone to a city slug 
 */
export async function mapTimezoneToCityAction(tz) {
  const city = mapTimezoneToCityFromSeed(tz);
  if (!city) return null;
  return city;
}

/**
 * Get time difference analytics between two locations
 */
export async function getTimeDiffAction(fromTz, toTz) {
  return await getTimeDifference(fromTz, toTz);
}
