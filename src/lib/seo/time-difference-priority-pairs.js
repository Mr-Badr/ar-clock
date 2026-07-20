import 'server-only';

import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { SITEMAP_PAIRS } from '@/components/time-diff/data/sitemapPairs';
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';
import { getAllCountries } from '@/lib/db/queries/countries';
import { getCapitalCity } from '@/lib/db/queries/cities';
import { buildTimeDifferenceSegment } from '@/lib/time-difference-links';

function collectKnownSegments() {
  const segments = [];
  for (const pair of POPULAR_PAIRS) {
    if (pair?.from?.slug) segments.push(pair.from.slug);
    if (pair?.to?.slug) segments.push(pair.to.slug);
  }
  for (const pair of SITEMAP_PAIRS) {
    if (pair?.from) segments.push(pair.from);
    if (pair?.to) segments.push(pair.to);
  }
  return segments;
}

// Picks whichever city segment is already established for this country in
// POPULAR_PAIRS/SITEMAP_PAIRS (e.g. Dubai for the UAE, not the administrative
// capital Abu Dhabi) instead of trusting the DB "capital" flag, which would
// silently pick the wrong, low-search-volume city for several countries.
function pickHubSegmentForCountry(countrySlug, knownSegments) {
  const prefix = `${countrySlug}-`;
  const counts = new Map();
  for (const segment of knownSegments) {
    if (!segment.startsWith(prefix)) continue;
    counts.set(segment, (counts.get(segment) || 0) + 1);
  }
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

async function buildHubSegments() {
  const knownSegments = collectKnownSegments();
  const countries = await getAllCountries();
  const countryBySlug = new Map(countries.map((country) => [country.country_slug, country]));
  const hubCountrySlugs = [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES];

  const hubs = [];
  for (const countrySlug of hubCountrySlugs) {
    let segment = pickHubSegmentForCountry(countrySlug, knownSegments);
    if (!segment) {
      const country = countryBySlug.get(countrySlug);
      if (!country) continue;
      const capital = await getCapitalCity(country.country_code).catch(() => null);
      if (!capital?.city_slug) continue;
      segment = buildTimeDifferenceSegment(countrySlug, capital.city_slug);
    }
    hubs.push({ segment, isPriority: PRIORITY_COUNTRY_SLUGS.includes(countrySlug) });
  }
  return hubs;
}

/**
 * Ordered city-pair segments covering every priority (Arab/Islamic) country's
 * hub city against every other hub city (priority or globally popular), in
 * both directions — e.g. this is what finally gives Libya, Yemen, Somalia,
 * Djibouti, Mauritania and Comoros their first ever time-difference pages;
 * previously none of the 20 PRIORITY_COUNTRY_SLUGS had guaranteed coverage.
 *
 * Pairs where NEITHER side is a priority country are skipped (a foreign-to-
 * foreign pair like Tokyo↔Berlin has no Arabic search intent and isn't worth
 * spending prerender/crawl budget on).
 *
 * This list is deliberately bounded (roughly 1,000 pairs, not every possible
 * combination in the ~1,400-city geo DB) — it only controls what gets
 * build-time prerendered and what's listed in sitemap.xml for fast discovery
 * of the highest-value pairs. Actual SEO indexability is NOT limited to this
 * set: `isSeoIndexableTimeDifferencePair` allows any two real, distinct
 * cities, so a pair outside this list still renders on-demand and can be
 * indexed the moment a crawler reaches it through an internal link or a
 * direct URL.
 */
export async function getPriorityHubTimeDifferencePairs() {
  const hubs = await buildHubSegments();
  const seen = new Set();
  const pairs = [];

  for (const from of hubs) {
    for (const to of hubs) {
      if (from.segment === to.segment) continue;
      if (!from.isPriority && !to.isPriority) continue;
      const key = `${from.segment}::${to.segment}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ from: from.segment, to: to.segment });
    }
  }

  return pairs;
}
