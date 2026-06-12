import { getAllCityParams } from '@/lib/db/queries/cities';
import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  selectSeoCityParams,
  selectSeoCountrySlugs,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';

export default async function sitemap() {
  const base = getSiteUrl();
  const policy = GEO_ROUTE_INDEXING_POLICIES.prayerTimes;
  const [countrySlugs, cities] = await Promise.all([
    getAllCountrySlugs(),
    getAllCityParams(),
  ]);
  const indexedCountrySlugs = selectSeoCountrySlugs(countrySlugs, { scope: policy.countryScope });
  const indexedCities = selectSeoCityParams(cities, {
    countryScope: policy.countryScope,
    cityScope: policy.cityScope,
  });
  const urls = [
    {
      url: `${base}/mwaqit-al-salat`,
      changeFrequency: 'daily',
      priority: 0.9,
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
      priority: 0.7,
    });
  }

  return urls;
}
