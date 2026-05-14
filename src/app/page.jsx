// app/page.jsx

import HomeSections from '@/components/home';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import TimeCinematicHero from '@/components/hero/TimeCinematicHero';
import {
  SITE_BRAND,
  SITE_DESCRIPTION,
  SITE_HOME_TITLE,
  SITE_KEYWORDS,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const HOME_SECTIONS = [
  { path: '/fahras', name: 'الفهرس الشامل' },
  { path: '/guides', name: 'الأدلة العملية' },
  { path: '/time-now', name: 'الوقت الآن' },
  { path: '/mwaqit-al-salat', name: 'مواقيت الصلاة' },
  { path: '/date', name: 'التاريخ والتحويل' },
  { path: '/holidays', name: 'المناسبات والعد التنازلي' },
  { path: '/calculators', name: 'الحاسبات' },
  { path: '/economie', name: 'أدوات الاقتصاد' },
  { path: '/time-difference', name: 'فرق التوقيت' },
];

export const metadata = buildCanonicalMetadata({
  title: SITE_HOME_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  url: SITE_URL,
});

export default function HomePage() {
  const homeCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: SITE_HOME_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    isPartOf: {
      '@type': 'WebSite',
      url: SITE_URL,
      name: SITE_BRAND,
    },
    hasPart: HOME_SECTIONS.map((section) => ({
      '@type': 'WebPage',
      name: section.name,
      url: `${SITE_URL}${section.path}`,
    })),
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
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <JsonLd data={[homeCollectionSchema, homeSectionsSchema]} />
      <main>
        <TimeCinematicHero cityNameAr="توقيتك المحلي" />

        <HomeSections className="container-col" />
      </main>
    </div>
  );
}
