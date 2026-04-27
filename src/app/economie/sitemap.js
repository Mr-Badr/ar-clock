import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';
import { ECONOMY_SEO_ROUTES } from '@/lib/seo/economy-route-manifest';

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();

  return ECONOMY_SEO_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
