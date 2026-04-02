/**
 * /date/sitemaps/static/route.ts
 * Core static pages for the Date feature.
 */
import { getSiteUrl } from '@/lib/site-config';

const BASE = getSiteUrl();

const STATIC_PAGES = [
  { url: '/date', priority: '1.0', changefreq: 'daily' },
  { url: '/date/today', priority: '1.0', changefreq: 'daily' },
  { url: '/date/today/hijri', priority: '0.9', changefreq: 'daily' },
  { url: '/date/today/gregorian', priority: '0.9', changefreq: 'daily' },
  { url: '/date/converter', priority: '0.9', changefreq: 'monthly' },
  { url: '/date/hijri-to-gregorian', priority: '0.8', changefreq: 'monthly' },
  { url: '/date/gregorian-to-hijri', priority: '0.8', changefreq: 'monthly' },
];

export async function GET() {
  const todayIso = new Date().toISOString().split('T')[0];

  const entries = STATIC_PAGES.map(
    p => `
  <url>
    <loc>${BASE}${p.url}</loc>
    <lastmod>${todayIso}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
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
