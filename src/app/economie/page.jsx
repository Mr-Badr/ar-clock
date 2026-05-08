// src/app/economie/page.jsx
import { Suspense } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { ECONOMY_SERVER_CONTENT } from '@/lib/economy/discovery-content';
import { buildEconomyPageSearchCoverage } from '@/lib/economy/page-helpers';
import { getEconomySeoEntry } from '@/lib/economy/seo-content';
import {
  getCachedEconomyPageSnapshot,
  getEconomyPageServerState,
} from '@/lib/economy/page-snapshots.server';
import { SITE_BRAND, SITE_ECONOMY_KEYWORDS, getSiteUrl } from '@/lib/site-config';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import EconomyLanding from '@/components/economy/EconomyLanding';
import EconomyLivePulse from '@/components/economy/EconomyLivePulse';
import { EconomyGuide, EconomyIntentCards, EconomySectionHeader, InsightCards } from '@/components/economy/common';

const SITE_URL = getSiteUrl();
const PAGE_CONTENT = ECONOMY_SERVER_CONTENT.landing;
const PAGE_SEO = getEconomySeoEntry('landing');
const SEARCH_COVERAGE = buildEconomyPageSearchCoverage('landing');

export const metadata = buildCanonicalMetadata({
  title: PAGE_SEO.metadata.title,
  description:
    PAGE_SEO.metadata.description.replace('ميقاتنا', SITE_BRAND),
  keywords: [
    ...SEARCH_COVERAGE.metadataKeywords,
    ...SITE_ECONOMY_KEYWORDS,
  ],
  url: `${SITE_URL}${PAGE_SEO.path}`,
});

async function EconomyLandingServerSections() {
  const { serverModel: landingModel } = await getEconomyPageServerState('landing');

  return (
    <section className="economy-section">
      <EconomySectionHeader
        title="كيف يساعدك هذا القسم خلال اليوم؟"
        lead="هنا ستجد طبقة مختصرة تشرح ماذا تفتح أولاً، وما الصفحة التالية الأنسب، وكيف تبقى القراءة عملية من غير حشو."
      />
      <EconomyGuide sections={landingModel.premiumSections} />
    </section>
  );
}

export default async function EconomyPage() {
  const {
    initialViewer,
    initialNowIso,
    liveSnapshot,
  } = await getCachedEconomyPageSnapshot('landing');
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الاقتصاد الحي',
    url: `${SITE_URL}/economie`,
    inLanguage: 'ar',
    description: 'صفحة تجمع أدوات حية ومسارات اقتصادية واضحة للسوق الأمريكي والذهب وجلسات الفوركس والبورصات العالمية بصياغة عربية مباشرة.',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الاقتصاد', item: `${SITE_URL}/economie` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `أدوات الاقتصاد في ${SITE_BRAND}`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ساعات الأسواق والتداول', url: `${SITE_URL}/economie/market-hours` },
      { '@type': 'ListItem', position: 2, name: 'متى يفتح السوق الأمريكي؟', url: `${SITE_URL}/economie/us-market-open` },
      { '@type': 'ListItem', position: 3, name: 'هل الذهب مفتوح الآن؟', url: `${SITE_URL}/economie/gold-market-hours` },
      { '@type': 'ListItem', position: 4, name: 'جلسات الفوركس الآن', url: `${SITE_URL}/economie/forex-sessions` },
      { '@type': 'ListItem', position: 5, name: 'هل البورصات العالمية مفتوحة الآن؟', url: `${SITE_URL}/economie/stock-markets` },
      { '@type': 'ListItem', position: 6, name: 'ساعة السوق الآن', url: `${SITE_URL}/economie/market-clock` },
      { '@type': 'ListItem', position: 7, name: 'ما أفضل وقت للتداول اليوم؟', url: `${SITE_URL}/economie/best-trading-time` },
    ],
  };

  return (
    <div className="bg-base" dir="rtl">
      <JsonLd data={[collectionSchema, breadcrumbSchema, itemListSchema]} />
      <EconomyAdLayout>
        <Suspense fallback={null}>
          <EconomyLivePulse
            scope="landing"
            initialSnapshot={liveSnapshot}
            title="الأسواق المرجعية الآن"
            lead="شريط حي يضع وول ستريت والذهب والأزواج الرئيسية في البداية حتى ترى حالة السوق بسرعة قبل أن تختار الصفحة التالية."
          />
        </Suspense>

        <Suspense fallback={null}>
          <EconomyLanding initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="ابدأ من السؤال الأقرب لك"
            lead="إذا كنت تريد وقت افتتاح السوق الأمريكي أو حالة الذهب أو جلسات الفوركس، فهذه هي نقاط البداية الأسرع داخل القسم."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="اختر المسار الأنسب الآن"
            lead="هذه البطاقات تختصر وظيفة كل صفحة حتى تصل مباشرة إلى الأداة الأقرب لما تريد معرفته."
          />
          <EconomyGuide sections={PAGE_CONTENT.intentCards} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="مسارات متابعة يومية"
            lead="إذا كنت تتابع السوق كل يوم، فهذه الروابط تساعدك على الانتقال بسرعة بين الافتتاح الأمريكي والذهب والجلسات وأفضل وقت للتداول."
          />
          <InsightCards cards={PAGE_CONTENT.journeyCards} />
        </section>

        <Suspense fallback={null}>
          <EconomyLandingServerSections />
        </Suspense>
      </EconomyAdLayout>
    </div>
  );
}
