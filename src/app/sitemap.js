import { getSiteUrl } from '@/lib/site-config';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

/**
 * app/sitemap.js — Next.js App Router native sitemap
 * Static pages only.
 */

export default async function sitemap() {
  const BASE = getSiteUrl();
  const now = new Date().toISOString();

  // Building calculator country pages (12 dynamic routes)
  const buildingCountryPages = COUNTRY_LIST.map((c) => ({
    url: `${BASE}/calculators/building/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/time-now`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/mwaqit-al-salat`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/holidays`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/time-difference`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/calculators`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/calculators/age`, lastModified: now, changeFrequency: 'weekly', priority: 0.86 },
    { url: `${BASE}/calculators/age/calculator`, lastModified: now, changeFrequency: 'weekly', priority: 0.84 },
    { url: `${BASE}/calculators/age/hijri`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE}/calculators/age/difference`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE}/calculators/age/birth-day`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/calculators/age/milestones`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/calculators/age/planets`, lastModified: now, changeFrequency: 'weekly', priority: 0.78 },
    { url: `${BASE}/calculators/age/countdown`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE}/calculators/age/retirement`, lastModified: now, changeFrequency: 'weekly', priority: 0.72 },
    // ── Building calculators ──────────────────────────────────────────────────
    { url: `${BASE}/calculators/building`,       lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/calculators/building/cement`,lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/calculators/building/rebar`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${BASE}/calculators/building/tiles`, lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    ...buildingCountryPages,
    // ─────────────────────────────────────────────────────────────────────────
    { url: `${BASE}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/editorial-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
