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
import { ALL_EVENTS } from '@/lib/holidays-engine';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const revalidate = 86400; // regenerate sitemap daily

export default async function sitemap() {
  const now = new Date();
  const entries = [];
  const today = new Date().toISOString();

  // ── Core pages ──────────────────────────────────────────────────────────────
  entries.push(
    { url: `${BASE}/`, lastModified: today, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE}/holidays`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/time-difference`, lastModified: today, changeFrequency: 'monthly', priority: 0.8 },
  );

  // ── Holidays (Dynamic Events) ───────────────────────────────────────────────
  const eventEntries = ALL_EVENTS.map(ev => {
    // Priority: events within 7 days = 0.9, within 30 = 0.8, else 0.6
    const isHijri     = ev.type === 'hijri';
    const isMonthly   = ev.type === 'monthly';
    const priority    = isHijri ? 0.9 : isMonthly ? 0.7 : 0.8;
    const changefreq  = isHijri ? 'daily' : isMonthly ? 'daily' : 'yearly';

    return {
      url:          `${BASE}/holidays/${ev.slug}`,
      lastModified: now,
      changeFrequency: changefreq,
      priority,
    };
  });
  entries.push(...eventEntries);

  // ── Time Difference (Top Comparisons) ───────────────────────────────────────
  // We include top capitals to boost "Time difference between X and Y" queries
  const topCities = seedData.filter(c => c.priority >= 95);
  for (let i = 0; i < topCities.length; i++) {
    for (let j = i + 1; j < topCities.length; j++) {
      const c1 = topCities[i];
      const c2 = topCities[j];
      entries.push({
        url: `${BASE}/time-difference/${c1.country_slug}-${c1.city_slug}/${c2.country_slug}-${c2.city_slug}`,
        lastModified: today,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  // ── Top seed cities (1.0 priority → highest crawl attention) ────────────────
  const sortedSeed = [...seedData].sort((a, b) => b.priority - a.priority);
  const topSeedCount = 20;
  
  for (let i = 0; i < topSeedCount && i < sortedSeed.length; i++) {
    const c = sortedSeed[i];
    entries.push({
      url: `${BASE}/mwaqit-al-salat/${c.country_slug}/${c.city_slug}`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // ── Rest of seed cities ──────────────────────────────────────────────────────
  const topSeedSlugs = new Set(sortedSeed.slice(0, topSeedCount).map(c => `${c.country_slug}::${c.city_slug}`));
  for (const c of seedData) {
    if (!topSeedSlugs.has(`${c.country_slug}::${c.city_slug}`)) {
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
      .limit(1000); // reduced from 2000 to keep sitemap manageable

    const allSeedSlugs = new Set(seedData.map(c => `${c.country_slug}::${c.city_slug}`));
    for (const c of (data || [])) {
      if (!allSeedSlugs.has(`${c.country_slug}::${c.city_slug}`)) {
        entries.push({
          url: `${BASE}/mwaqit-al-salat/${c.country_slug}/${c.city_slug}`,
          lastModified: today,
          changeFrequency: 'daily',
          priority: 0.6,
        });
      }
    }
  } catch { /* DB down — seed sitemap still works */ }
 
  return entries;
}
