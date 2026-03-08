/**
 * app/sitemap.js — Next.js App Router native sitemap
 *
 * Serves /sitemap.xml automatically.
 * All city/country data comes from the new countries + cities DB tables.
 */

import { ALL_EVENTS }       from '@/lib/holidays-engine';
import { getAllCityParams }  from '@/lib/db/queries/cities';
import citiesFallback       from '@/lib/db/fallback/cities-index.json';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const revalidate = 86400;

const ARAB_COUNTRY_SLUGS = [
  'egypt','saudi-arabia','uae','morocco','algeria','tunisia','libya','sudan',
  'kuwait','qatar','bahrain','oman','iraq','jordan','lebanon','syria',
  'palestine','yemen','somalia','djibouti','mauritania',
];

const WORLD_COUNTRY_SLUGS = [
  'united-states','united-kingdom','france','germany','turkey','japan',
  'china','india','brazil','russia','australia','canada','italy','spain',
  'nigeria','south-africa','pakistan','bangladesh','indonesia','mexico',
  'south-korea','philippines','thailand','vietnam','kenya','ethiopia',
  'ghana','tanzania','singapore','malaysia','netherlands','belgium',
  'sweden','norway','denmark','finland','switzerland','austria','poland',
  'portugal','greece','ukraine','argentina','chile','colombia','new-zealand',
];

export default async function sitemap() {
  const today   = new Date().toISOString();
  const entries = [];

  // Static pages
  entries.push(
    { url:`${BASE}/`,                lastModified:today, changeFrequency:'always',  priority:1.0  },
    { url:`${BASE}/time-now`,        lastModified:today, changeFrequency:'daily',   priority:0.95 },
    { url:`${BASE}/holidays`,        lastModified:today, changeFrequency:'daily',   priority:0.80 },
    { url:`${BASE}/time-difference`, lastModified:today, changeFrequency:'monthly', priority:0.80 },
  );

  // Country pages
  for (const slug of ARAB_COUNTRY_SLUGS) {
    entries.push({ url:`${BASE}/time-now/${slug}`,        lastModified:today, changeFrequency:'daily', priority:0.95 });
    entries.push({ url:`${BASE}/mwaqit-al-salat/${slug}`, lastModified:today, changeFrequency:'daily', priority:0.90 });
  }
  for (const slug of WORLD_COUNTRY_SLUGS) {
    entries.push({ url:`${BASE}/time-now/${slug}`, lastModified:today, changeFrequency:'daily', priority:0.90 });
  }

  // Holiday pages
  for (const ev of ALL_EVENTS) {
    const isHijri   = ev.type === 'hijri';
    const isMonthly = ev.type === 'monthly';
    entries.push({
      url:             `${BASE}/holidays/${ev.slug}`,
      lastModified:    today,
      changeFrequency: isHijri || isMonthly ? 'daily' : 'yearly',
      priority:        isHijri ? 0.90 : isMonthly ? 0.70 : 0.80,
    });
  }

  // Time-difference top city pairs from build-time fallback
  const topCities = [...citiesFallback]
    .filter(c => (c.priority || 0) >= 95)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 20);

  for (let i = 0; i < topCities.length; i++) {
    for (let j = i + 1; j < topCities.length; j++) {
      const c1 = topCities[i], c2 = topCities[j];
      const s1 = c1.country_slug || c1.country_code?.toLowerCase();
      const s2 = c2.country_slug || c2.country_code?.toLowerCase();
      if (s1 && s2) entries.push({
        url:`${BASE}/time-difference/${s1}-${c1.city_slug}/${s2}-${c2.city_slug}`,
        lastModified:today, changeFrequency:'monthly', priority:0.80,
      });
    }
  }

  // All city pages from Supabase DB (prayer times + time-now)
  try {
    const dbCities   = await getAllCityParams();
    const seedSlugs  = new Set(citiesFallback.map(c => `${c.country_slug || c.country_code?.toLowerCase()}::${c.city_slug}`));

    for (const c of dbCities) {
      const isInFallback = seedSlugs.has(`${c.country}::${c.city}`);
      entries.push({
        url:             `${BASE}/time-now/${c.country}/${c.city}`,
        lastModified:    today,
        changeFrequency: 'daily',
        priority:        isInFallback ? 0.85 : 0.75,
      });
      entries.push({
        url:             `${BASE}/mwaqit-al-salat/${c.country}/${c.city}`,
        lastModified:    today,
        changeFrequency: 'daily',
        priority:        isInFallback ? 0.90 : 0.60,
      });
    }
  } catch { /* DB down — static entries already included */ }

  return entries;
}