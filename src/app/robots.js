/**
 * app/robots.js — Next.js App Router native robots.txt
 * Auto-served at /robots.txt
 */

export default function robots() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/*?*'],
      },
    ],
    sitemap: `${base}/sitemap-index.xml`,
    host: base,
  };
}
