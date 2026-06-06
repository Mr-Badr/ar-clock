// app/page.jsx

import HomeSections from '@/components/home';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import TimeCinematicHero from '@/components/hero/TimeCinematicHero';
import {
  SITE_BRAND,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const HOME_TITLE = 'ميقاتنا يجيبك: الوقت والصلاة والتاريخ والحسابات اليومية';
const HOME_DESCRIPTION =
  'ابدأ من سؤال واحد وافتح جوابك اليومي في ميقاتنا: الوقت الان، مواقيت الصلاة، التاريخ، فرق التوقيت، الحاسبات، والمناسبات من واجهة عربية واضحة.';
const HOME_KEYWORDS = [
  'ميقاتنا',
  'الوقت الان في مدينتي',
  'الوقت الآن في مدينتي',
  'مواقيت الصلاة اليوم',
  'التاريخ الهجري والميلادي اليوم',
  'محول التاريخ الهجري والميلادي',
  'حاسبات عربية يومية',
  'فرق التوقيت بين المدن',
  'عداد المناسبات والأعياد',
];
const HOME_SECTIONS = [
  { path: '/fahras', name: 'استكشف الصفحات' },
  { path: '/blog', name: 'المدونة' },
  { path: '/time-now', name: 'الوقت الان' },
  { path: '/mwaqit-al-salat', name: 'مواقيت الصلاة' },
  { path: '/date', name: 'التاريخ والتحويل' },
  { path: '/date/calendar', name: 'التقويم الميلادي والهجري' },
  { path: '/date/converter', name: 'محول التاريخ' },
  { path: '/holidays', name: 'المناسبات والعد التنازلي' },
  { path: '/calculators', name: 'الحاسبات' },
  { path: '/time-difference', name: 'فرق التوقيت' },
];

export const metadata = buildCanonicalMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: HOME_KEYWORDS,
  url: SITE_URL,
});

export default function HomePage() {
  const homeCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: HOME_TITLE,
    url: SITE_URL,
    description: HOME_DESCRIPTION,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL,
      name: SITE_BRAND,
    },
    about: [
      'الوقت الان',
      'الوقت الآن',
      'مواقيت الصلاة',
      'التاريخ الهجري والميلادي',
      'فرق التوقيت',
      'الحاسبات العربية',
      'المناسبات والأعياد',
    ],
    hasPart: HOME_SECTIONS.map((section) => ({
      '@type': 'WebPage',
      name: section.name,
      url: `${SITE_URL}${section.path}`,
    })),
  };

  const websiteSearchSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_BRAND,
    url: SITE_URL,
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/fahras?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const homeSectionsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'الأقسام الرئيسية في الصفحة الرئيسية',
    itemListElement: HOME_SECTIONS.map((section, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: section.name,
      url: `${SITE_URL}${section.path}`,
    })),
  };

  return (
    <div className="min-h-screen bg-base text-primary home-hub-page" dir="rtl">
      <JsonLd data={[homeCollectionSchema, homeSectionsSchema, websiteSearchSchema]} />
      <main>
        <TimeCinematicHero cityNameAr="توقيتك المحلي" />
        <HomeSections />
      </main>
    </div>
  );
}
