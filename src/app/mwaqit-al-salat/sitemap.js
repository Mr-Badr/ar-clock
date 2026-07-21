import { getAllCityParams, getPriorityCityParams, getPriorityCountriesCityParams } from '@/lib/db/queries/cities';
import { getAllCountrySlugs, getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  selectSeoCityParams,
  selectSeoCountrySlugs,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { SPECIAL_PRAYER_FACT_SLUGS } from '@/lib/mwaqit/special-prayer-fact-types';

export default async function sitemap() {
  const base = getSiteUrl();
  const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
  const [countrySlugs, cities, priorityCountrySlugsRaw, priorityCityParamsA, priorityCityParamsB] = await Promise.all([
    getAllCountrySlugs(),
    getAllCityParams(),
    getPriorityCountrySlugs(15),
    getPriorityCityParams(12),
    getPriorityCountriesCityParams(6),
  ]);
  const indexedCountrySlugs = selectSeoCountrySlugs(countrySlugs, { scope: policy.countryScope });
  const indexedCities = selectSeoCityParams(cities, {
    countryScope: policy.countryScope,
    cityScope: policy.cityScope,
  });

  // Priority-scoped only (not every city) for the per-factType geo pages —
  // these mirror generateStaticParams in special-prayer-geo-pages.jsx so the
  // sitemap only lists the curated set that's actually prebuilt at high value,
  // rather than ballooning to (all cities) × (4 fact types).
  const priorityCountrySlugs = selectSeoCountrySlugs(priorityCountrySlugsRaw, { scope: policy.countryScope });
  const priorityCitySeen = new Set();
  const priorityCityParams = [];
  for (const p of [...priorityCityParamsA, ...priorityCityParamsB]) {
    const key = `${p.country}::${p.city}`;
    if (priorityCitySeen.has(key)) continue;
    priorityCitySeen.add(key);
    priorityCityParams.push(p);
  }
  const indexedPriorityCityParams = selectSeoCityParams(priorityCityParams, {
    countryScope: policy.countryScope,
    cityScope: policy.cityScope,
  });
  const urls = [
    {
      url: `${base}/mwaqit-al-salat`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/mwaqit-al-salat/last-third-of-night`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/mwaqit-al-salat/duha-prayer-time`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/mwaqit-al-salat/friday-response-hour`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/mwaqit-al-salat/white-days`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/mwaqit-al-salat/prohibited-prayer-times`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/mwaqit-al-salat/prayer-times-calculation-method`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  for (const countrySlug of indexedCountrySlugs) {
    if (!countrySlug) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${countrySlug}`,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  for (const city of indexedCities) {
    if (!city?.country || !city?.city) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${city.country}/${city.city}`,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  }

  for (const factSlug of SPECIAL_PRAYER_FACT_SLUGS) {
    for (const countrySlug of priorityCountrySlugs) {
      if (!countrySlug) continue;
      urls.push({
        url: `${base}/mwaqit-al-salat/${factSlug}/${countrySlug}`,
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
    for (const city of indexedPriorityCityParams) {
      if (!city?.country || !city?.city) continue;
      urls.push({
        url: `${base}/mwaqit-al-salat/${factSlug}/${city.country}/${city.city}`,
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }
  }

  return urls;
}
