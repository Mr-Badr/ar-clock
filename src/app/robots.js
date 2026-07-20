import { getSiteUrl } from '@/lib/site-config';

/**
 * app/robots.js — Next.js App Router native robots.txt
 * Auto-served at /robots.txt
 *
 * SEO STRATEGY:
 *  - Allow all content pages (calculators, prayer times, date, holidays)
 *  - Block API routes (no SEO value, wastes crawl budget)
 *  - Block search result pages (duplicate content risk)
 *  - Block PWA/offline pages (no SEO value)
 *  - Block redirect-only pages with no canonical content (crawl budget)
 *
 * Google Ads eligibility requires:
 *  - robots.txt must allow Googlebot
 *  - Pages must have original content
 *  - No cloaking or deceptive redirects
 */

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      {
        // General: allow all content, block infrastructure
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',              // Backend APIs — no crawl value
          '/search?*',          // Search query pages — duplicate content
          '/offline',           // PWA offline page — no content
          '/*/opengraph-image', // Dynamic OG image endpoints — image binaries, never pages;
                                 // only ever needed for og:image previews, which social
                                 // scrapers fetch directly regardless of robots.txt.
        ],
      },
      {
        // Google specifically: ensure full access to all main content
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/search?*',
          '/offline',
          '/*/opengraph-image',
        ],
      },
      {
        // Google Ads crawler: ad destinations must be reachable for policy review.
        userAgent: 'AdsBot-Google',
        allow: '/',
        disallow: [
          '/api/',
          '/search?*',
          '/offline',
          '/*/opengraph-image',
        ],
      },
      {
        // Google Ads mobile crawler: mirrors mobile landing page review.
        userAgent: 'AdsBot-Google-Mobile',
        allow: '/',
        disallow: [
          '/api/',
          '/search?*',
          '/offline',
          '/*/opengraph-image',
        ],
      },
      {
        // Block known bad bots that waste crawl budget and skew analytics
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: `${base}/sitemap-index.xml`,
    host: base,
  };
}
