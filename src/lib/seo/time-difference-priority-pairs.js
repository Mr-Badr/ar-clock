import 'server-only';

import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { SITEMAP_PAIRS } from '@/components/time-diff/data/sitemapPairs';
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity, getTopCitiesByCountry } from '@/lib/db/queries/cities';
import { buildTimeDifferenceSegment } from '@/lib/time-difference-links';
import { logger, serializeError } from '@/lib/logger';

// Per-country city depth. Priority (Arab/Islamic) countries get real coverage of their actual
// secondary cities (Jeddah/Makkah/Madinah/Dammam next to Riyadh, Alexandria/Giza next to Cairo,
// etc.), not just one hand-picked hub — found 2026-08-24: the old "1 city per country" model was
// capping this whole system at ~38 hub cities total (21 priority + 17 global) no matter how many
// real cities the geo DB/snapshot actually has for each (252 countries / 1,389 cities). Globally
// popular (non-Arab) countries stay shallower — Arabic search intent there is concentrated on a
// couple of major/diaspora cities (New York, London...), not every mid-size city in France or Japan.
const PRIORITY_CITY_LIMIT = 5;
const GLOBAL_CITY_LIMIT = 2;

// Hard ceiling on the full generated set (sitemap consumer). Purely a sanity backstop — with the
// limits above this rarely gets close, but it keeps a future constant bump from silently producing
// a sitemap.xml that blows past Google's documented 50,000-URL-per-file cap.
const MAX_GENERATED_PAIRS = 20000;

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

/**
 * Real city segments for one country, DB-first: tries the live/snapshot geo source
 * (`getTopCitiesByCountry`, already DB-first with the JSON snapshot as its own fallback — see
 * `src/lib/db/queries/cities.ts`) for up to `perCountryLimit` real cities. Only falls back to the
 * single hand-curated hub segment (or the bare capital-city lookup) when that source has nothing
 * for this country at all, so a country never silently drops out of coverage.
 */
async function collectHubsForCountry(countrySlug, perCountryLimit, isPriority, knownSegments) {
  let country = null;
  let citySlugs = [];
  try {
    country = await getCountryBySlug(countrySlug);
    if (country?.country_code) {
      const cities = await getTopCitiesByCountry(country.country_code, perCountryLimit);
      citySlugs = [...new Set(cities.map((city) => city?.city_slug).filter(Boolean))];
    }
  } catch (error) {
    logger.warn('time-difference-hub-city-lookup-failed', {
      countrySlug,
      error: serializeError(error),
    });
  }

  if (citySlugs.length > 0) {
    return citySlugs.map((citySlug) => ({
      segment: buildTimeDifferenceSegment(countrySlug, citySlug),
      country: countrySlug,
      isPriority,
    }));
  }

  // DB/snapshot had nothing for this country — fall back to the curated hub segment, then to a
  // direct capital-city lookup, in that order, exactly like the previous single-hub model did.
  // This is the safety net, not the primary path.
  const curatedSegment = pickHubSegmentForCountry(countrySlug, knownSegments);
  if (curatedSegment) {
    return [{ segment: curatedSegment, country: countrySlug, isPriority }];
  }

  try {
    const capital = country ? await getCapitalCity(country.country_code) : null;
    if (capital?.city_slug) {
      return [{
        segment: buildTimeDifferenceSegment(countrySlug, capital.city_slug),
        country: countrySlug,
        isPriority,
      }];
    }
  } catch (error) {
    logger.warn('time-difference-hub-capital-fallback-failed', {
      countrySlug,
      error: serializeError(error),
    });
  }

  return [];
}

// Fans `collectHubsForCountry` out across every country in the list in parallel (each country's
// lookups are independent) — order in the returned flat array still follows `countrySlugs`'s own
// order, since `Promise.all` preserves array position regardless of resolution timing.
async function collectCountryHubs(countrySlugs, perCountryLimit, isPriority, knownSegments) {
  const perCountryHubs = await Promise.all(
    countrySlugs.map((countrySlug) =>
      collectHubsForCountry(countrySlug, perCountryLimit, isPriority, knownSegments),
    ),
  );
  return perCountryHubs.flat();
}

function pairUpHubs(fromHubs, toHubs, seen, pairs, { skipSameCountry }) {
  for (const from of fromHubs) {
    for (const to of toHubs) {
      if (from.segment === to.segment) continue;
      if (skipSameCountry && from.country && to.country && from.country === to.country) continue;
      const key = `${from.segment}::${to.segment}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({ from: from.segment, to: to.segment });
      if (pairs.length >= MAX_GENERATED_PAIRS) return true;
    }
  }
  return false;
}

/**
 * Ordered city-pair segments covering real cities (not just one hub each) across every priority
 * (Arab/Islamic) country and every globally-popular country, in both directions — e.g. this is
 * what gives Jeddah, Alexandria, Sharjah and dozens of other real secondary cities their own
 * time-difference pages, not just each country's single hand-picked hub.
 *
 * Same-country pairs are skipped (near-always a 0-hour "difference", thin/duplicate content).
 * Pairs where NEITHER side is a priority country are skipped (a foreign-to-foreign pair like
 * Tokyo↔Berlin has no Arabic search intent and isn't worth spending crawl budget on).
 *
 * Generation is tiered so the highest-value pairs come first when the caller asks for a subset via
 * `limit`: priority-country ↔ priority-country pairs are generated before priority ↔ global-popular
 * pairs, and within each tier countries are walked in `PRIORITY_COUNTRY_SLUGS`/
 * `GLOBAL_POPULAR_COUNTRIES`'s own declared order (Egypt/Saudi/UAE first, etc.).
 *
 * `limit` bounds the returned set — pass a small one for build-time prerendering
 * (`generateStaticParams`) and leave it unset (or generous) for the sitemap, since a pair outside
 * `generateStaticParams` still renders on demand and can be indexed the moment a crawler reaches
 * it (`isSeoIndexableTimeDifferencePair` allows any two real, distinct cities — it was never
 * limited to this curated set, only *discoverability* was).
 */
export async function getPriorityHubTimeDifferencePairs({ limit } = {}) {
  const knownSegments = collectKnownSegments();
  const [priorityHubs, globalHubs] = await Promise.all([
    collectCountryHubs(PRIORITY_COUNTRY_SLUGS, PRIORITY_CITY_LIMIT, true, knownSegments),
    collectCountryHubs(GLOBAL_POPULAR_COUNTRIES, GLOBAL_CITY_LIMIT, false, knownSegments),
  ]);

  const seen = new Set();
  const pairs = [];

  // Tier 1: priority ↔ priority (Arab/Islamic world to itself) — the highest-value tier.
  const capped = pairUpHubs(priorityHubs, priorityHubs, seen, pairs, { skipSameCountry: true });
  // Tier 2: priority ↔ globally-popular, both directions.
  if (!capped) {
    pairUpHubs(priorityHubs, globalHubs, seen, pairs, { skipSameCountry: false });
  }
  if (pairs.length < MAX_GENERATED_PAIRS) {
    pairUpHubs(globalHubs, priorityHubs, seen, pairs, { skipSameCountry: false });
  }

  return typeof limit === 'number' ? pairs.slice(0, limit) : pairs;
}
