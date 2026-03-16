/**
 * app/sitemap.js — Next.js App Router native sitemap
 * Static pages only.
 */

export default async function sitemap() {
  const BASE = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://miqatime.com';
  // Use a fixed past date so Google does not recrawl these unless necessary
  const fixedDate = new Date('2026-01-01').toISOString();

  return [
    { url: `${BASE}/`, lastModified: fixedDate },
    { url: `${BASE}/time-now`, lastModified: fixedDate },
    { url: `${BASE}/mwaqit-al-salat`, lastModified: fixedDate },
    { url: `${BASE}/holidays`, lastModified: fixedDate },
    { url: `${BASE}/time-difference`, lastModified: fixedDate },
  ];
}