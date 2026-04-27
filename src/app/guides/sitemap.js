import { ALL_GUIDES } from '@/lib/guides/data';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

function getGuidePriority(guide) {
  if (guide?.hubHref === '/economie/market-hours') return 0.76;
  if (guide?.hubHref === '/calculators/building') return 0.72;
  return 0.74;
}

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();
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
      lastModified,
      changeFrequency: 'monthly',
      priority: getGuidePriority(guide),
    }));

  return [
    {
      url: `${base}/guides`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    ...guideEntries,
  ];
}
