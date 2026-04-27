import { COUNTRY_LIST } from '@/lib/calculators/building/country-data';

export const STATIC_CALCULATOR_SEO_ROUTES = Object.freeze([
  { path: '/calculators', priority: 0.85, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep', priority: 0.93, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/bedtime', priority: 0.92, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/wake-time', priority: 0.92, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/sleep-duration', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/nap-calculator', priority: 0.89, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/sleep-debt', priority: 0.89, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/sleep/sleep-needs-by-age', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance', priority: 0.92, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance/emergency-fund', priority: 0.91, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance/debt-payoff', priority: 0.91, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance/savings-goal', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/personal-finance/net-worth', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/finance', priority: 0.89, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/calculator', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/hijri', priority: 0.84, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/difference', priority: 0.84, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/birth-day', priority: 0.82, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/milestones', priority: 0.82, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/planets', priority: 0.8, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/countdown', priority: 0.86, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/age/retirement', priority: 0.76, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/end-of-service-benefits', priority: 0.9, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/monthly-installment', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/vat', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/percentage', priority: 0.88, changeFrequency: 'weekly', websitePart: true },
  { path: '/calculators/building', priority: 0.85, changeFrequency: 'monthly', websitePart: true },
  { path: '/calculators/building/cement', priority: 0.8, changeFrequency: 'monthly', websitePart: true },
  { path: '/calculators/building/rebar', priority: 0.8, changeFrequency: 'monthly', websitePart: true },
  { path: '/calculators/building/tiles', priority: 0.8, changeFrequency: 'monthly', websitePart: true },
]);

export const BUILDING_COUNTRY_CALCULATOR_SEO_ROUTES = Object.freeze(
  COUNTRY_LIST.map((country) => ({
    path: `/calculators/building/${country.slug}`,
    priority: 0.78,
    changeFrequency: 'monthly',
    websitePart: true,
  })),
);

export const ALL_CALCULATOR_SEO_ROUTES = Object.freeze([
  ...STATIC_CALCULATOR_SEO_ROUTES,
  ...BUILDING_COUNTRY_CALCULATOR_SEO_ROUTES,
]);
