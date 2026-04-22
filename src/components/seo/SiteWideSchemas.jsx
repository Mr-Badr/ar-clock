// src/components/seo/SiteWideSchemas.jsx
import {
  SITE_BRAND,
  SITE_BRAND_EN,
  SITE_CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_SCHEMA_TOPICS,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const ORG_ID = `${SITE_URL}#organization`;
const WEBSITE_ID = `${SITE_URL}#website`;
const WEBSITE_PARTS = [
  '/time-now',
  '/mwaqit-al-salat',
  '/time-difference',
  '/fahras',
  '/calculators',
  '/calculators/sleep',
  '/calculators/sleep/bedtime',
  '/calculators/sleep/wake-time',
  '/calculators/sleep/sleep-duration',
  '/calculators/sleep/nap-calculator',
  '/calculators/sleep/sleep-debt',
  '/calculators/sleep/sleep-needs-by-age',
  '/calculators/personal-finance',
  '/calculators/personal-finance/emergency-fund',
  '/calculators/personal-finance/debt-payoff',
  '/calculators/personal-finance/savings-goal',
  '/calculators/personal-finance/net-worth',
  '/calculators/age',
  '/calculators/age/calculator',
  '/calculators/age/hijri',
  '/calculators/age/difference',
  '/calculators/age/milestones',
  '/calculators/building/cement',
  '/calculators/building/rebar',
  '/calculators/building/tiles',
  '/calculators/end-of-service-benefits',
  '/calculators/monthly-installment',
  '/calculators/vat',
  '/calculators/percentage',
  '/calculators/building',
  '/date',
  '/date/converter',
  '/date/today/hijri',
  '/date/today/gregorian',
  '/holidays',
  '/economie',
  '/economie/market-hours',
  '/economie/us-market-open',
  '/economie/gold-market-hours',
  '/economie/forex-sessions',
  '/economie/stock-markets',
  '/economie/market-clock',
  '/economie/best-trading-time',
  '/about',
  '/privacy',
  '/disclaimer',
  '/contact',
  '/guides/emergency-fund',
  '/guides/what-is-a-sleep-cycle',
  '/guides/how-many-hours-of-sleep-do-i-need',
  '/guides/best-nap-length',
  '/guides/sleep-debt-explained',
  '/guides/why-am-i-tired-after-sleeping',
  '/guides/how-long-does-it-take-to-fall-asleep',
  '/guides/rem-vs-deep-sleep',
  '/guides/sleep-hygiene-basics',
  '/guides/debt-payoff-methods',
  '/guides/how-much-save-monthly',
  '/guides/net-worth-explained',
  '/guides/how-many-months-emergency-fund',
  '/guides/how-to-pay-off-debt-fast',
  '/guides/save-for-goal',
  '/guides/assets-vs-liabilities',
  '/terms',
  '/editorial-policy',
];

export default function SiteWideSchemas() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_BRAND,
    alternateName: SITE_BRAND_EN,
    url: SITE_URL,
    email: SITE_CONTACT_EMAIL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/icon-512.png`,
      width: 512,
      height: 512,
    },
    description: SITE_DESCRIPTION,
    areaServed: [
      'SA', 'AE', 'EG', 'IQ', 'KW', 'QA', 'JO', 'LB',
      'MA', 'DZ', 'TN', 'LY', 'SD', 'SY', 'YE', 'OM', 'BH', 'MR',
    ],
    knowsAbout: SITE_SCHEMA_TOPICS,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE_CONTACT_EMAIL,
        availableLanguage: ['ar', 'en'],
        url: `${SITE_URL}/contact`,
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_BRAND,
    alternateName: SITE_BRAND_EN,
    description: SITE_DESCRIPTION,
    inLanguage: 'ar',
    publisher: { '@id': ORG_ID },
    about: SITE_SCHEMA_TOPICS.map((topic) => ({
      '@type': 'Thing',
      name: topic,
    })),
    hasPart: WEBSITE_PARTS.map((path) => ({
      '@type': 'WebPage',
      url: `${SITE_URL}${path}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
