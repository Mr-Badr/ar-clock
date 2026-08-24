import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import { getAllCityParams } from '@/lib/db/queries/cities';
import { getSiteUrl } from '@/lib/site-config';

export default async function sitemap() {
  const base = getSiteUrl();
  // Was `getPriorityCountrySlugs(20)` + `getPriorityCityParams(60)` — a small curated slice.
  // Sitemap listing doesn't cost build time (unlike generateStaticParams' prerendering, which
  // stays bounded to a priority-first combo in the page files themselves), so it uses the full
  // DB-first city/country lists directly — same reasoning as /time-difference and /time-now/
  // /date's sitemaps. Fixed 2026-08-24.
  const [countrySlugs, cities] = await Promise.all([
    getAllCountrySlugs(),
    getAllCityParams(),
  ]);

  const urls = [
    { url: `${base}/imsakiya`, changeFrequency: 'monthly', priority: 0.88 },
  ];

  for (const countrySlug of countrySlugs) {
    urls.push({ url: `${base}/imsakiya/${countrySlug}`, changeFrequency: 'monthly', priority: 0.82 });
  }

  for (const { country, city } of cities) {
    urls.push({ url: `${base}/imsakiya/${country}/${city}`, changeFrequency: 'monthly', priority: 0.86 });
  }

  return urls;
}
