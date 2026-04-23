import { getAllCityParams } from '@/lib/db/queries/cities';
import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import {
  filterSeoPriorityCityParams,
  filterSeoPriorityCountrySlugs,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();
  const [countrySlugs, cities] = await Promise.all([
    getAllCountrySlugs(),
    getAllCityParams(),
  ]);
  const focusCountrySlugs = filterSeoPriorityCountrySlugs(countrySlugs);
  const focusCities = filterSeoPriorityCityParams(cities);
  const urls = [];

  for (const countrySlug of focusCountrySlugs) {
    if (!countrySlug) continue;
    urls.push({
      url: `${base}/time-now/${countrySlug}`,
      lastModified,
    });
  }

  for (const city of focusCities) {
    if (!city?.country || !city?.city) continue;
    urls.push({
      url: `${base}/time-now/${city.country}/${city.city}`,
      lastModified,
    });
  }

  return urls;
}
