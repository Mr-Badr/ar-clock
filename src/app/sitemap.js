import { getSiteUrl } from '@/lib/site-config';

/**
 * app/sitemap.js — Next.js App Router native sitemap
 * Static pages only.
 */

export default async function sitemap() {
  const BASE = getSiteUrl();
  const now = new Date().toISOString();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/time-now`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/mwaqit-al-salat`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/holidays`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/time-difference`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
