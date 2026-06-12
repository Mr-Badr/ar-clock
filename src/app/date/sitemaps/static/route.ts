/**
 * /date/sitemaps/static/route.ts
 * Core static pages for the Date feature.
 */
import { getSiteUrl } from '@/lib/site-config';

const STATIC_PAGES = [
  '/date',
  '/date/today',
  '/date/today/hijri',
  '/date/today/gregorian',
  '/date/converter',
  '/date/hijri-to-gregorian',
  '/date/gregorian-to-hijri',
  '/date/calendar',
  '/date/calendar/hijri',
  '/date/country',
];

export async function GET() {
  const base = getSiteUrl();

  const entries = STATIC_PAGES.map(
    path => `
  <url>
    <loc>${base}${path}</loc>
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
