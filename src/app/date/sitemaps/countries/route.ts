/**
 * /date/sitemaps/countries/route.ts
 * All country-specific Date pages.
 */
import { getAllCountrySlugs } from '@/lib/db/queries/countries';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  selectSeoCountrySlugs,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

const BASE = getSiteUrl();

export async function GET() {
  const policy = GEO_ROUTE_INDEXING_POLICIES.dateCountry;
  const slugs = selectSeoCountrySlugs(await getAllCountrySlugs(), { scope: policy.countryScope });
  const lastmod = getSitemapLastModifiedDate();

  const entries = slugs.map(
    slug => `
  <url>
    <loc>${BASE}/date/country/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
