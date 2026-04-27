import { getSiteUrl } from '@/lib/site-config';
import { getSitemapIndexUrls } from '@/lib/seo/site-architecture';
import { getSitemapLastModifiedDate } from '@/lib/sitemap';

export async function GET() {
  const BASE = getSiteUrl();
  const lastmod = getSitemapLastModifiedDate();
  const sitemaps = getSitemapIndexUrls(BASE);

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
