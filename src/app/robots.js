import { getSiteUrl } from '@/lib/site-config';

/**
 * app/robots.js — Next.js App Router native robots.txt
 * Auto-served at /robots.txt
 */

export default function robots() {
  const base = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap-index.xml`,
  };
}
