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
    hasPart: [
      '/time-now',
      '/mwaqit-al-salat',
      '/time-difference',
      '/date',
      '/holidays',
      '/economie',
      '/about',
      '/privacy',
      '/disclaimer',
      '/contact',
      '/terms',
      '/editorial-policy',
    ].map((path) => ({
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
