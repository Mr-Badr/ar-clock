import { ALL_GUIDES } from '@/lib/guides/data';
import { getSiteUrl } from '@/lib/site-config';

function getGuidePriority(guide) {
  if (guide?.hubHref === '/calculators/building') return 0.72;
  return 0.74;
}

export default async function blogSitemap() {
  const base = getSiteUrl();
  const seen = new Set();
  const guideEntries = ALL_GUIDES
    .filter((guide) => guide?.href)
    .filter((guide) => {
      if (seen.has(guide.href)) return false;
      seen.add(guide.href);
      return true;
    })
    .map((guide) => ({
      url: `${base}${guide.href}`,
      changeFrequency: 'monthly',
      priority: getGuidePriority(guide),
    }));

  return [
    {
      url: `${base}/blog`,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    ...guideEntries,
  ];
}
