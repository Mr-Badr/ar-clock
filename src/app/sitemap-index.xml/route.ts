import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

export async function GET() {
  const BASE = getSiteUrl();
  const lastmod = getSitemapLastModifiedDate();

  const sitemaps = [
    `${BASE}/sitemap.xml`,
    `${BASE}/calculators/sitemap.xml`,
    `${BASE}/economie/sitemap.xml`,
    `${BASE}/holidays/sitemap.xml`,
    `${BASE}/time-difference/sitemap.xml`,
    `${BASE}/time-now/sitemap.xml`,
    `${BASE}/mwaqit-al-salat/sitemap.xml`,
    // Date leaf sitemaps are listed directly here so crawlers and Search
    // Console can see the actual submitted URL sets without following a
    // nested feature-local sitemap index first.
    `${BASE}/date/sitemaps/static`,
    `${BASE}/date/sitemaps/countries`,
    `${BASE}/date/sitemaps/calendars`,
  ];

  // Build the XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps
      .map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`)
      .join('')}
</sitemapindex>
`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
