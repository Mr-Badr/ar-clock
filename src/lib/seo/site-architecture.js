import { getSiteUrl } from '@/lib/site-config';
import { ALL_CALCULATOR_SEO_ROUTES } from '@/lib/seo/calculator-route-manifest';
import { ECONOMY_SEO_ROUTES } from '@/lib/seo/economy-route-manifest';

function normalizePath(path) {
  const value = String(path || '').trim();
  if (!value || value === '/') return '/';
  return value.replace(/\/+$/, '');
}

function dedupeRoutes(routes) {
  const seen = new Set();
  return routes.filter((route) => {
    const path = normalizePath(route?.path);
    if (!path || seen.has(path)) return false;
    seen.add(path);
    return true;
  });
}

export const ROOT_SITEMAP_ROUTES = Object.freeze(dedupeRoutes([
  { path: '/', priority: 1.0, changeFrequency: 'daily', websitePart: true },
  { path: '/fahras', priority: 0.95, changeFrequency: 'daily', websitePart: true },
  { path: '/time-now', priority: 0.93, changeFrequency: 'daily', websitePart: true },
  { path: '/mwaqit-al-salat', priority: 0.93, changeFrequency: 'daily', websitePart: true },
  { path: '/holidays', priority: 0.92, changeFrequency: 'daily', websitePart: true },
  { path: '/time-difference', priority: 0.9, changeFrequency: 'daily', websitePart: true },
  { path: '/date', priority: 0.9, changeFrequency: 'daily', websitePart: true },
  { path: '/date/today', priority: 0.9, changeFrequency: 'daily', websitePart: true },
  { path: '/date/converter', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/date/gregorian-to-hijri', priority: 0.86, changeFrequency: 'weekly', websitePart: true },
  { path: '/date/hijri-to-gregorian', priority: 0.86, changeFrequency: 'weekly', websitePart: true },
  { path: '/date/calendar', priority: 0.82, changeFrequency: 'weekly', websitePart: true },
  { path: '/date/calendar/hijri', priority: 0.82, changeFrequency: 'weekly', websitePart: true },
  { path: '/date/country', priority: 0.8, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/finance', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep', priority: 0.86, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance', priority: 0.86, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/building', priority: 0.84, changeFrequency: 'monthly', websitePart: true },
  ...ALL_CALCULATOR_SEO_ROUTES.map((route) => ({
    ...route,
    websitePart: route.websitePart ?? true,
  })),
  { path: '/economie', priority: 0.88, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/market-hours', priority: 0.88, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/us-market-open', priority: 0.87, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/gold-market-hours', priority: 0.87, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/forex-sessions', priority: 0.87, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/stock-markets', priority: 0.86, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/market-clock', priority: 0.86, changeFrequency: 'daily', websitePart: true },
  { path: '/economie/best-trading-time', priority: 0.85, changeFrequency: 'daily', websitePart: true },
  ...ECONOMY_SEO_ROUTES.map((route) => ({
    ...route,
    websitePart: route.websitePart ?? true,
  })),
  { path: '/guides', priority: 0.82, changeFrequency: 'weekly', websitePart: true },
  { path: '/about', priority: 0.44, changeFrequency: 'monthly', websitePart: true },
  { path: '/editorial-policy', priority: 0.44, changeFrequency: 'monthly', websitePart: true },
  { path: '/contact', priority: 0.38, changeFrequency: 'monthly', websitePart: true },
  { path: '/privacy', priority: 0.28, changeFrequency: 'monthly', websitePart: false },
  { path: '/terms', priority: 0.28, changeFrequency: 'monthly', websitePart: false },
  { path: '/disclaimer', priority: 0.28, changeFrequency: 'monthly', websitePart: false },
]).map((route) => ({
  ...route,
  path: normalizePath(route.path),
})));

export const ROOT_SITEMAP_PATHS = Object.freeze(ROOT_SITEMAP_ROUTES.map((route) => route.path));

export const WEBSITE_ARCHITECTURE_PATHS = Object.freeze(
  ROOT_SITEMAP_ROUTES
    .filter((route) => route.websitePart)
    .map((route) => route.path),
);

export const SITEMAP_INDEX_PATHS = Object.freeze([
  '/sitemap.xml',
  '/calculators/sitemap.xml',
  '/economie/sitemap.xml',
  '/guides/sitemap.xml',
  '/holidays/sitemap.xml',
  '/time-difference/sitemap.xml',
  '/time-now/sitemap.xml',
  '/mwaqit-al-salat/sitemap.xml',
  '/date/sitemaps/static',
  '/date/sitemaps/countries',
  '/date/sitemaps/calendars',
]);

const FEATURE_ROUTE_FAMILIES = Object.freeze([
  {
    id: 'site',
    label: 'Site architecture',
    exactPaths: ROOT_SITEMAP_PATHS,
    prefixPaths: [],
    crawlScope: 'architecture',
  },
  {
    id: 'guides',
    label: 'Guides',
    exactPaths: ['/guides'],
    prefixPaths: ['/guides/'],
    crawlScope: 'full',
  },
  {
    id: 'holidays',
    label: 'Holidays and countdowns',
    exactPaths: ['/holidays'],
    prefixPaths: ['/holidays/'],
    crawlScope: 'canonical-and-aliases',
  },
  {
    id: 'time-now',
    label: 'Current time',
    exactPaths: ['/time-now'],
    prefixPaths: ['/time-now/'],
    crawlScope: 'priority-countries-and-cities',
  },
  {
    id: 'mwaqit-al-salat',
    label: 'Prayer times',
    exactPaths: ['/mwaqit-al-salat'],
    prefixPaths: ['/mwaqit-al-salat/'],
    crawlScope: 'priority-countries-and-cities',
  },
  {
    id: 'time-difference',
    label: 'Time difference',
    exactPaths: ['/time-difference'],
    prefixPaths: ['/time-difference/'],
    crawlScope: 'popular-pairs',
  },
  {
    id: 'date',
    label: 'Date tools',
    exactPaths: ['/date'],
    prefixPaths: ['/date/'],
    crawlScope: 'mixed-static-country-calendar',
  },
  {
    id: 'calculators',
    label: 'Calculators',
    exactPaths: ['/calculators'],
    prefixPaths: ['/calculators/'],
    crawlScope: 'full',
  },
  {
    id: 'economy',
    label: 'Economy',
    exactPaths: ['/economie'],
    prefixPaths: ['/economie/'],
    crawlScope: 'full',
  },
]);

export const SEO_ROUTE_FAMILIES = FEATURE_ROUTE_FAMILIES;

export function buildRootSitemapEntries({ base = getSiteUrl(), lastModified } = {}) {
  return ROOT_SITEMAP_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}

export function getSitemapIndexUrls(base = getSiteUrl()) {
  return SITEMAP_INDEX_PATHS.map((path) => `${base}${path}`);
}

export function findSeoRouteFamily(path) {
  const normalizedPath = normalizePath(path);

  for (const family of SEO_ROUTE_FAMILIES) {
    if (family.exactPaths.includes(normalizedPath)) return family;
    if (family.prefixPaths.some((prefix) => normalizedPath.startsWith(prefix))) return family;
  }

  return null;
}

export function isPathCoveredBySeoArchitecture(path) {
  return Boolean(findSeoRouteFamily(path));
}
