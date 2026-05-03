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
        title="لماذا يعود المستخدم إلى هذا القسم يومياً؟"
        lead="بدلاً من الاكتفاء بالوصف العام، تعرض هذه الطبقة الثابتة ما يجعل التجربة عملية: إيقاع السوق، المسار التالي، واللوحة التي تختصر اليوم."
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
            lead="شريط حي يضع وول ستريت والذهب والأزواج الرئيسية في أول الصفحة حتى يشعر الزائر من اللحظة الأولى أن قسم الاقتصاد أداة متابعة يومية لا مجرد صفحة تعريفية."
          />
        </Suspense>

        <Suspense fallback={null}>
          <EconomyLanding initialViewer={initialViewer} initialNowIso={initialNowIso} />
        </Suspense>

        <section className="economy-section">
          <EconomySectionHeader
            title="صيغ البحث الرئيسية التي يجمعها القسم"
            lead="هذه الطبقة تحوّل قسم الاقتصاد إلى صفحة نية بحث واضحة: أسئلة مباشرة، صيغ مقارنة، وصيغ محلية وزمنية يكتبها المستخدم العربي فعلاً."
          />
          <EconomyIntentCards groups={SEARCH_COVERAGE.queryClusters} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="أسئلة يغطيها القسم قبل أن يفتح الزائر أي صفحة فرعية"
            lead="هذه الفقرة موجودة في HTML نفسه لتوضيح نية القسم بعبارات يبحث بها الناس فعلاً، وليس فقط عبر بطاقات تفاعلية أو عناوين عامة."
          />
          <EconomyGuide sections={PAGE_CONTENT.intentCards} />
        </section>

        <section className="economy-section">
          <EconomySectionHeader
            title="مسارات تجعل الزائر يعود يومياً بدل زيارة واحدة"
            lead="بدلاً من أن تنتهي الرحلة بعد سؤال واحد، هذه الروابط تبني سلوك متابعة يومية بين افتتاح السوق الأمريكي والذهب والجلسات وأفضل وقت للتداول."
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
