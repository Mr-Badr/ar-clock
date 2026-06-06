// src/components/seo/SiteWideSchemas.jsx
import { JsonLd } from '@/components/seo/JsonLd';
import { WEBSITE_ARCHITECTURE_PATHS } from '@/lib/seo/site-architecture';
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
const WEBSITE_PARTS = WEBSITE_ARCHITECTURE_PATHS;
const CORE_SECTION_PAGES = [
  { path: '/fahras', name: 'استكشف الصفحات' },
  { path: '/blog', name: 'المدونة' },
  { path: '/time-now', name: 'الوقت الان' },
  { path: '/mwaqit-al-salat', name: 'مواقيت الصلاة' },
  { path: '/date', name: 'التاريخ والتحويل' },
  { path: '/holidays', name: 'المناسبات والعد التنازلي' },
  { path: '/calculators', name: 'الحاسبات' },
  { path: '/time-difference', name: 'فرق التوقيت' },
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
      {
        '@type': 'ContactPoint',
        contactType: 'editorial corrections',
        email: SITE_CONTACT_EMAIL,
        availableLanguage: ['ar'],
        url: `${SITE_URL}/editorial-policy`,
      },
    ],
    subjectOf: [
      {
        '@type': 'WebPage',
        url: `${SITE_URL}/about`,
        name: 'من نحن',
      },
      {
        '@type': 'WebPage',
        url: `${SITE_URL}/contact`,
        name: 'اتصل بنا',
      },
      {
        '@type': 'WebPage',
        url: `${SITE_URL}/editorial-policy`,
        name: 'السياسة التحريرية',
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
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    hasPart: WEBSITE_PARTS.map((path) => ({
      '@type': 'WebPage',
      url: `${SITE_URL}${path}`,
    })),
  };

  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}#site-sections`,
    name: 'الأقسام الرئيسية في ميقاتنا',
    itemListElement: CORE_SECTION_PAGES.map((section, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: section.name,
      url: `${SITE_URL}${section.path}`,
    })),
  };

  return (
    <JsonLd data={[organizationSchema, websiteSchema, navigationSchema]} />
  );
}
