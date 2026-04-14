import { getSiteUrl } from '@/lib/site-config';

const CALCULATOR_ROUTES = [
  { path: '/calculators', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/calculators/age', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/age/calculator', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/calculators/age/hijri', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/calculators/age/difference', priority: 0.84, changeFrequency: 'weekly' },
  { path: '/calculators/age/birth-day', priority: 0.82, changeFrequency: 'weekly' },
  { path: '/calculators/age/milestones', priority: 0.82, changeFrequency: 'weekly' },
  { path: '/calculators/age/planets', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/calculators/age/countdown', priority: 0.86, changeFrequency: 'weekly' },
  { path: '/calculators/age/retirement', priority: 0.76, changeFrequency: 'weekly' },
  { path: '/calculators/end-of-service-benefits', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/monthly-installment', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/calculators/vat', priority: 0.88, changeFrequency: 'weekly' },
  { path: '/calculators/percentage', priority: 0.88, changeFrequency: 'weekly' },
];

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = new Date().toISOString();

  return CALCULATOR_ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
