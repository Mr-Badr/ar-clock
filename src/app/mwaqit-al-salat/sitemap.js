import { getAllCityParams } from '@/lib/db/queries/cities';
import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  selectSeoCityParams,
  selectSeoCountrySlugs,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();
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
  const urls = [];

  for (const countrySlug of indexedCountrySlugs) {
    if (!countrySlug) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${countrySlug}`,
      lastModified,
    });
  }

  for (const city of indexedCities) {
    if (!city?.country || !city?.city) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${city.country}/${city.city}`,
      lastModified,
    });
  }

  return urls;
}
