/**
 * /date/sitemap.xml: Date feature sitemap index
 * Kept as a feature-local diagnostic index, while the root sitemap index lists
 * the date leaf sitemaps directly for simpler Search Console visibility.
 */
import { getSiteUrl } from '@/lib/site-config';

export async function GET() {
  const base = getSiteUrl();

  const sitemaps = [
    '/date/sitemaps/static',
    '/date/sitemaps/countries',
    '/date/sitemaps/calendars',
    '/date/gregorian/sitemap.xml',
    '/date/hijri/sitemap.xml',
  ];

  const entries = sitemaps.map(
    url => `
  <sitemap>
    <loc>${base}${url}</loc>
  </sitemap>`
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
