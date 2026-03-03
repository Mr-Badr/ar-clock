/**
 * app/sitemap.js — Next.js App Router native sitemap
 *
 * Automatically served at /sitemap.xml
 * Google sees a live, correct sitemap on every deploy.
 *
 * STRATEGY:
 * - Priority 1.0: top 20 seed cities (highest search volume)
 * - Priority 0.9: all seed cities
 * - Priority 0.8: remaining Supabase cities (queried server-side)
 * - changeFrequency 'daily' — prayer times change every day
 */

import seedData from '@/lib/seedCities.json';
import { supabaseServer } from '@/lib/supabaseClient';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const revalidate = 86400; // regenerate sitemap daily

export default async function sitemap() {
  const entries = [];
  const today = new Date().toISOString();

  // ── Core pages ──────────────────────────────────────────────────────────────
  entries.push(
    { url: `${BASE}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/qibla`, lastModified: today, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/holidays`, lastModified: today, changeFrequency: 'weekly', priority: 0.6 },
  );

  // ── Top seed cities (1.0 priority → highest crawl attention) ────────────────
  const topSeed = [...seedData].sort((a, b) => b.priority - a.priority).slice(0, 20);
  for (const c of topSeed) {
    entries.push({
      url: `${BASE}/mwaqit-al-salat/${c.country_slug}/${c.city_slug}`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // ── Rest of seed cities ──────────────────────────────────────────────────────
  const seedSlugs = new Set(topSeed.map(c => `${c.country_slug}::${c.city_slug}`));
  for (const c of seedData) {
    if (!seedSlugs.has(`${c.country_slug}::${c.city_slug}`)) {
      entries.push({
        url: `${BASE}/mwaqit-al-salat/${c.country_slug}/${c.city_slug}`,
        lastModified: today,
        changeFrequency: 'daily',
        priority: 0.9,
      });
    }
  }

  // ── Supabase cities (beyond seed) ───────────────────────────────────────────
  try {
    const { data } = await supabaseServer
      .from('cities')
      .select('country_slug, city_slug, priority')
      .order('priority', { ascending: false })
      .limit(2000);

    const allSeedSlugs = new Set(seedData.map(c => `${c.country_slug}::${c.city_slug}`));
    for (const c of (data || [])) {
      if (!allSeedSlugs.has(`${c.country_slug}::${c.city_slug}`)) {
        entries.push({
          url: `${BASE}/mwaqit-al-salat/${c.country_slug}/${c.city_slug}`,
          lastModified: today,
          changeFrequency: 'daily',
          priority: 0.8,
        });
      }
    }
  } catch { /* DB down — seed sitemap still works */ }

  return entries;
}
