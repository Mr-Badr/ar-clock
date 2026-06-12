import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { getSiteUrl } from '@/lib/site-config';
import { buildTimeDifferenceHref } from '@/lib/time-difference-links';

export default async function sitemap() {
  const base = getSiteUrl();

  return [
    {
      url: `${base}/time-difference`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...POPULAR_PAIRS.map((pair, index) => ({
      url: `${base}${buildTimeDifferenceHref(pair.from.slug, pair.to.slug)}`,
      changeFrequency: 'daily',
      priority: index < 4 ? 0.9 : 0.8,
    })),
  ];
}
