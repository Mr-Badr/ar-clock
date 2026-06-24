import { getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import { getPriorityCityParams } from '@/lib/db/queries/cities';
import { getSiteUrl } from '@/lib/site-config';

export default async function sitemap() {
  const base = getSiteUrl();
  const [countrySlugs, cities] = await Promise.all([
    getPriorityCountrySlugs(20),
    getPriorityCityParams(60),
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
