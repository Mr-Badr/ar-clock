import { getSiteUrl } from '@/lib/site-config';
import { getSitemapLastModified } from '@/lib/sitemap';
import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

const CALCULATOR_ROUTES = [
  { path: '/calculators', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/calculators/sleep', priority: 0.93, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/bedtime', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/wake-time', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/sleep-duration', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/nap-calculator', priority: 0.89, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/sleep-debt', priority: 0.89, changeFrequency: 'weekly' },
  { path: '/calculators/sleep/sleep-needs-by-age', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/personal-finance', priority: 0.92, changeFrequency: 'weekly' },
  { path: '/calculators/personal-finance/emergency-fund', priority: 0.91, changeFrequency: 'weekly' },
  { path: '/calculators/personal-finance/debt-payoff', priority: 0.91, changeFrequency: 'weekly' },
  { path: '/calculators/personal-finance/savings-goal', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/personal-finance/net-worth', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/calculators/finance', priority: 0.89, changeFrequency: 'weekly' },
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
  { path: '/calculators/building', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/calculators/building/cement', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/calculators/building/rebar', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/calculators/building/tiles', priority: 0.8, changeFrequency: 'monthly' },
];

export default async function sitemap() {
  const base = getSiteUrl();
  const lastModified = getSitemapLastModified();
  const countryRoutes = COUNTRY_LIST.map((country) => ({
    url: `${base}/calculators/building/${country.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    ...CALCULATOR_ROUTES.map((route) => ({
      url: `${base}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...countryRoutes,
  ];
}
