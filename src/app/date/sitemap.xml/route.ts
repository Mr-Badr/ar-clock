/**
 * /date/sitemap.xml — Sitemap Index
 * Points to specialized child sitemaps for scale and organization.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';

export async function GET() {
  const todayIso = new Date().toISOString().split('T')[0];

  const sitemaps = [
    '/date/sitemaps/static',
    '/date/sitemaps/countries',
    '/date/sitemaps/calendars',
  ];

  const entries = sitemaps.map(
    url => `
  <sitemap>
    <loc>${BASE}${url}</loc>
    <lastmod>${todayIso}</lastmod>
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
