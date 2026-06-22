import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { SITEMAP_PAIRS } from '@/components/time-diff/data/sitemapPairs';
import { getSiteUrl } from '@/lib/site-config';
import { buildTimeDifferenceHref } from '@/lib/time-difference-links';

export default async function sitemap() {
  const base = getSiteUrl();

  const popularUrls = POPULAR_PAIRS.map((pair, index) => ({
    url: `${base}${buildTimeDifferenceHref(pair.from.slug, pair.to.slug)}`,
    changeFrequency: 'daily',
    priority: index < 4 ? 0.9 : 0.8,
  }));

  const popularUrlSet = new Set(popularUrls.map((e) => e.url));

  const sitemapUrls = SITEMAP_PAIRS
    .map(({ from, to }) => ({
      url: `${base}/time-difference/${from}/${to}`,
      changeFrequency: 'daily',
      priority: 0.75,
    }))
    .filter((e) => !popularUrlSet.has(e.url));

  return [
    {
      url: `${base}/time-difference`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...popularUrls,
    ...sitemapUrls,
  ];
}
