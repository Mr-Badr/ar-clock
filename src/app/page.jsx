// app/page.jsx

import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import HeroV2 from '@/components/hero/HeroV2';
import HomeFeatureSections from '@/components/home/v2/HomeFeatureSections';
import FaqSection, { FAQ_ITEMS } from '@/components/home/v2/FaqSection';
import {
  SITE_BRAND,
  SITE_HOME_TITLE,
  SITE_DESCRIPTION,
  getSiteUrl,
} from '@/lib/site-config';

const SITE_URL = getSiteUrl();
// Reuse the site-wide identity strings (site-config.js, owner correction 2026-08-13: "we like to
// focus on tools and holidays as the main things") instead of the page's own stale copy — the
// homepage previously defined its own HOME_TITLE/HOME_DESCRIPTION/schema.about that never picked
// up that fix, so this page (and its H1 in CopyBlock.jsx) kept telling Google "time and date"
// first while every other page's Organization/WebSite JSON-LD already said "tools and holidays"
// first. Fixed 2026-08-18 — same root cause the owner flagged ("Google still sees our app as just
// about time"). Visual layout/hero component untouched — that redesign is still deferred.
const HOME_TITLE = SITE_HOME_TITLE;
const HOME_DESCRIPTION = SITE_DESCRIPTION;
const HOME_KEYWORDS = [
  'ميقاتنا',
  'أدوات وحاسبات عربية',
  'حاسبات عربية لكل مجال',
  'عداد المناسبات والأعياد',
  'مواعيد المناسبات',
  'التاريخ الهجري والميلادي اليوم',
  'محول التاريخ الهجري والميلادي',
  'الوقت الان في مدينتي',
  'فرق التوقيت بين المدن',
  'كم الساعة الان',
  'التاريخ اليوم هجري',
  'حاسبات مالية خليجية',
  'حاسبة الزكاة',
  'حاسبة تكلفة البناء',
  'إمساكية رمضان',
  'العطل الرسمية العربية',
  'كم باقي على العيد',
  'أدوات ومحولات وحاسبات عربية بموقع واحد',
  'موقع أدوات عربية مجاني',
];
const HOME_SECTIONS = [
  { path: '/tools', name: 'الأدوات والحاسبات' },
  { path: '/holidays', name: 'المناسبات والعد التنازلي' },
  { path: '/time-now', name: 'الوقت الان' },
  { path: '/date', name: 'التاريخ والتحويل' },
  { path: '/date/calendar', name: 'التقويم الميلادي والهجري' },
  { path: '/date/converter', name: 'محول التاريخ' },
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
    // Hand-picked, balanced subset of SITE_SCHEMA_TOPICS — a blind slice(0, N) front-loads
    // holidays/time again because the master list orders those first; this mixes in real tool
    // categories (finance, construction, car maintenance, health, Zakat) instead of repeating
    // generic entries. Previously led with a duplicated 'الوقت الان'/'الوقت الآن' pair and a
    // single generic 'الحاسبات العربية' entry despite 25+ real tool categories — fixed 2026-08-18.
    about: [
      'أدوات وحاسبات عربية',
      'المناسبات والإجازات',
      'عداد المناسبات',
      'التمويل الشخصي والحاسبات المالية',
      'البناء والإنشاء',
      'صيانة السيارات',
      'النوم والصحة',
      'الزكاة',
      'الوقت الان',
      'فرق التوقيت',
      'التاريخ الهجري',
      'التاريخ الميلادي',
    ],
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

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-base text-primary home-hub-page" dir="rtl">
      {/* Real bug found + fixed 2026-08-24 (SEO cleanup pass): this used to also render its own
          `websiteSearchSchema` (@type WebSite + SearchAction, target `/search?q=...`) — an exact
          duplicate of the WebSite+SearchAction block `SiteWideSchemas` (src/app/layout.tsx)
          already renders on every page including this one, just with fewer fields (no `@id`,
          `alternateName`, `inLanguage`, `about`, `publisher`). `JsonLd` does no deduplication (see
          its own source — it just maps every item to its own `<script>` tag), so the homepage was
          literally shipping two competing `WebSite` entities in one page's structured data. Removed
          the redundant local copy; the sitewide one already covers this page. */}
      <JsonLd
        data={[homeCollectionSchema, homeSectionsSchema, homeFaqSchema]}
      />
      <main>
        <HeroV2 />
        <HomeFeatureSections />
        <FaqSection />
      </main>
    </div>
  );
}
