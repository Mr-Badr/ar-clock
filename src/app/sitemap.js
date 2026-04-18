import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';
import { ROOT_PRIORITY_TOOL_PATHS } from '@/lib/seo/discovery-links';

/**
 * app/sitemap.js — Next.js App Router native sitemap
 * Static pages only.
 */

export default async function sitemap() {
  const BASE = getSiteUrl();
  const lastModified = getSitemapLastModified();
  const topToolEntries = ROOT_PRIORITY_TOOL_PATHS.map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.78,
  }));

  return [
    { url: `${BASE}/`, lastModified, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/time-now`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/mwaqit-al-salat`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/holidays`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/time-difference`, lastModified, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/calculators`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/economie`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    ...topToolEntries,
    // ─────────────────────────────────────────────────────────────────────────
    { url: `${BASE}/map`, lastModified, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/editorial-policy`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/disclaimer`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
