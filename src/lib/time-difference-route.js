import 'server-only';

import { cache } from 'react';
import { getCityBySlug, getCitiesByCountry } from '@/lib/db/queries/cities';
import { getAllCountries, getCountryBySlug } from '@/lib/db/queries/countries';
import { buildTimeDifferenceSegment } from '@/lib/time-difference-links';
import { getTimeDifferenceCitySlugCandidates } from '@/lib/time-difference-slugs';

const resolveCountryCityPair = cache(async (segment) => {
  if (!segment || !segment.includes('-')) return null;

  const normalizedSegment = segment.trim().replace(/^-+|-+$/g, '');
  const countries = await getAllCountries();
  const matchingCountrySlugs = countries
    .map((country) => country.country_slug)
    .filter(Boolean)
    .filter(
      (countrySlug) =>
        normalizedSegment === countrySlug || normalizedSegment.startsWith(`${countrySlug}-`),
    )
    .sort((a, b) => b.length - a.length);

  for (const countrySlug of matchingCountrySlugs) {
    const citySlug = normalizedSegment.slice(countrySlug.length).replace(/^-/, '');
    if (!citySlug) continue;
    return { countrySlug, citySlug };
  }

  return null;
});

async function resolveCanonicalCity(country, requestedCitySlug) {
  const exact = await getCityBySlug(country.country_code, requestedCitySlug).catch(() => null);
  if (exact) return exact;

  const candidateSlugs = getTimeDifferenceCitySlugCandidates(country.country_slug, requestedCitySlug);

  for (const candidateSlug of candidateSlugs) {
    if (candidateSlug === requestedCitySlug) continue;
    const aliased = await getCityBySlug(country.country_code, candidateSlug).catch(() => null);
    if (aliased) return aliased;
  }

  const countryCities = await getCitiesByCountry(country.country_code).catch(() => []);
  return candidateSlugs
    .map((candidateSlug) => countryCities.find((city) => city.city_slug === candidateSlug) || null)
    .find(Boolean) || null;
}

async function resolveTimeDifferenceCityFromSegmentInternal(segment) {
  if (!segment) return null;
  const resolvedPair = await resolveCountryCityPair(segment);
  if (!resolvedPair) return null;

  const country = await getCountryBySlug(resolvedPair.countrySlug).catch(() => null);
  if (!country) return null;

  const city = await resolveCanonicalCity(country, resolvedPair.citySlug);
  if (!city) return null;

  return {
    country_slug: country.country_slug,
    country_name_ar: country.name_ar,
    city_slug: city.city_slug,
    city_name_ar: city.name_ar || city.name_en,
    timezone: city.timezone || 'UTC',
    canonicalSegment: buildTimeDifferenceSegment(country.country_slug, city.city_slug),
  };
}

export const resolveTimeDifferenceCityFromSegment = cache(resolveTimeDifferenceCityFromSegmentInternal);
