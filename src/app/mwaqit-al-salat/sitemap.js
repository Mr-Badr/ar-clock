import { getAllCityParams } from '@/lib/db/queries/cities';
import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();
  const [countrySlugs, cities] = await Promise.all([
    getAllCountrySlugs(),
    getAllCityParams(),
  ]);
  const urls = [];

  for (const countrySlug of countrySlugs) {
    if (!countrySlug) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${countrySlug}`,
      lastModified,
    });
  }

  for (const city of cities) {
    if (!city?.country || !city?.city) continue;
    urls.push({
      url: `${base}/mwaqit-al-salat/${city.country}/${city.city}`,
      lastModified,
    });
  }

  return urls;
}
