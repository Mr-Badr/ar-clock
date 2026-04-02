/**
 * app/time-now/sitemap.js
 *
 * Strategy:
 *  - generateSitemaps()  → uses STATIC fallback JSON (no fetch allowed during SSG)
 *  - sitemap()           → force-dynamic: NOT prerendered at build time.
 *                          When Googlebot requests /time-now/sitemap/egypt.xml
 *                          we do a live Supabase REST query to get ALL cities
 *                          for that country (including ones not in the fallback).
 *                          Fallback cities are merged in so coverage is guaranteed
 *                          even if the DB is temporarily unavailable.
 */
import fallbackCountries from '@/lib/db/fallback/countries.json';
import fallbackCities from '@/lib/db/fallback/cities-index.json';
import { getSiteUrl } from '@/lib/site-config';

// ⚠️ Do NOT prerender sitemap segments at build time — we need live DB data.
// Googlebot will call these URLs on-demand after deploy.
export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Vercel will regenerate every 24 h

// generateSitemaps MUST use static data — fetch() is forbidden here.
export async function generateSitemaps() {
  return fallbackCountries.map((c) => ({ id: c.country_slug }));
}

export default async function sitemap(params) {
  const { id } = await params;
  const resolvedId = typeof id === 'object' && id !== null && 'then' in id ? await id : id;
  const BASE = getSiteUrl();
  const lastModified = new Date().toISOString();

  // 1. Fallback cities for this country (guaranteed coverage)
  const fallbackSet = new Set(
    fallbackCities
      .filter((c) => c.country_slug === resolvedId)
      .map((c) => c.city_slug)
  );

  const allCitySlugs = new Set(fallbackSet);

  // 2. Live DB cities — fetched when Googlebot requests the XML (force-dynamic)
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      // First resolve country_code from country_slug
      const cRes = await fetch(
        `${supabaseUrl}/rest/v1/countries?select=country_code&country_slug=eq.${encodeURIComponent(resolvedId)}&limit=1`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      );

      if (cRes.ok) {
        const cData = await cRes.json();
        if (cData?.length > 0) {
          const { country_code } = cData[0];

          // Fetch ALL cities for this country from DB (no limit)
          const citiesRes = await fetch(
            `${supabaseUrl}/rest/v1/cities?select=city_slug&country_code=eq.${country_code}`,
            { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
          );

          if (citiesRes.ok) {
            const dbCities = await citiesRes.json();
            for (const c of dbCities) {
              if (c.city_slug) allCitySlugs.add(c.city_slug);
            }
          }
        }
      }
    }
  } catch {
    // DB unavailable — fallback data is still included above
  }

  const urls = [
    { url: `${BASE}/time-now/${resolvedId}`, lastModified },
  ];

  for (const citySlug of allCitySlugs) {
    urls.push({
      url: `${BASE}/time-now/${resolvedId}/${citySlug}`,
      lastModified,
    });
  }

  return urls;
}
