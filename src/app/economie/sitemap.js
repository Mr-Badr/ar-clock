import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';

const ECONOMY_SITEMAP_ROUTES = [
  { path: '/economie', priority: 0.9, changeFrequency: 'daily' },
  { path: '/economie/market-hours', priority: 0.92, changeFrequency: 'daily' },
  { path: '/economie/us-market-open', priority: 0.95, changeFrequency: 'daily' },
  { path: '/economie/gold-market-hours', priority: 0.95, changeFrequency: 'daily' },
  { path: '/economie/forex-sessions', priority: 0.9, changeFrequency: 'daily' },
  { path: '/economie/stock-markets', priority: 0.9, changeFrequency: 'daily' },
  { path: '/economie/market-clock', priority: 0.8, changeFrequency: 'daily' },
  { path: '/economie/best-trading-time', priority: 0.85, changeFrequency: 'daily' },
];

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();

  return ECONOMY_SITEMAP_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
