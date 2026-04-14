import { getCitiesByCountry } from '@/lib/db/queries/cities';
import { getAllCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getSiteUrl } from '@/lib/site-config';

export const dynamic = 'force-dynamic';
// export const revalidate = 86400;

export async function generateSitemaps() {
  const countrySlugs = await getAllCountrySlugs();
  return countrySlugs.map((countrySlug) => ({ id: countrySlug }));
}

export default async function sitemap(params) {
  const { id } = await params;
  const resolvedId = typeof id === 'object' && id !== null && 'then' in id ? await id : id;
  const base = getSiteUrl();
  const lastModified = new Date().toISOString();
  const country = await getCountryBySlug(resolvedId).catch(() => null);
  const cities = country ? await getCitiesByCountry(country.country_code) : [];

  const urls = [{ url: `${base}/time-now/${resolvedId}`, lastModified }];

  for (const city of cities) {
    if (!city?.city_slug) continue;
    urls.push({
      url: `${base}/time-now/${resolvedId}/${city.city_slug}`,
      lastModified,
    });
  }

  return urls;
}
