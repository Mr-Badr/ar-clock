// Fall back to the current deployment/runtime start instead of a frozen date so
// sitemap files refresh automatically when the site is deployed with new pages.
const DEFAULT_SITEMAP_LASTMOD = new Date().toISOString();

function normalizeLastmod(value) {
  if (typeof value !== 'string') return null;
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString();
}

export function getSitemapLastModified(value) {
  return (
    normalizeLastmod(value)
    || normalizeLastmod(process.env.SITEMAP_LASTMOD)
    || DEFAULT_SITEMAP_LASTMOD
  );
}

export function getSitemapLastModifiedDate(value) {
  return getSitemapLastModified(value).split('T')[0];
}
