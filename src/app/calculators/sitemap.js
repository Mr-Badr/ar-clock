import { getSiteUrl } from '@/lib/site-config';
import { ALL_CALCULATOR_SEO_ROUTES } from '@/lib/seo/calculator-route-manifest';

export default async function sitemap() {
  const base = getSiteUrl();

  return ALL_CALCULATOR_SEO_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
