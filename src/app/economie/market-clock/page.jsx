// src/app/economie/best-trading-time/page.jsx
import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyDatasetSchema,
  buildEconomyFaqSchema,
  buildEconomySpeakableSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import MarketClockLive from '@/components/economy/MarketClockLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'ساعة التداول العالمية | السوق على مدار 24 ساعة',
  description:
    'ساعة تداول بصرية تُظهر جلسات الفوركس العالمية على مدار 24 ساعة بتوقيتك المحلي، مع تداخل لندن ونيويورك وخريطة السيولة.',
  keywords: [
    // Short
    'ساعة التداول', 'مؤشر فوركس', 'سيولة', 'تداخل جلسات', 'تداول 24', 'market clock',
    // Medium
    'ساعة السوق الآن', 'خريطة سيولة الأسواق', 'تداخل لندن ونيويورك', 'أوقات سوق الفوركس',
    'مؤشر حركة الأسواق', 'تتبع سيولة الفوركس', 'حجم التداول اليومي', 'Market clock بالعربي',
    // Long
    'ساعة التداول العالمية لمعرفة سيولة الأسواق', 'أداة تتبع جلسات الفوركس على مدار 24 ساعة',
    'مؤشر تداخل جلسة لندن ونيويورك اللحظي', 'متى تبدأ وتنتهي جلسات التداول العالمية',
    'خريطة توضيحية لسيولة الفوركس بتوقيتك المحلي', 'أفضل أداة لمتابعة افتتاح وإغلاق البورصات',
    'تتبع حركة السوق المالي في الوقت الفعلي', 'كيفية قراءة ساعة تداول سوق العملات',
    'متى تكون ذروة لندن ونيويورك اليوم', 'ساعة سيولة الفوركس بتوقيت السعودية',
    'أفضل وقت الآن في السوق', 'خريطة نشاط الذهب اليوم', 'مقارنة اليوم وغداً في سيولة التداول',
  ],
  url: `${SITE_URL}/economie/market-clock`,
});

export default function MarketClockPage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    name: 'ساعة التداول العالمية',
    description: 'أداة بصرية لقراءة جلسات الفوركس العالمية على مدار 24 ساعة بتوقيت المستخدم.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'ساعة التداول العالمية',
    '/economie/market-clock',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    name: 'بيانات ساعة التداول العالمية',
    description: 'بيانات بصرية لحركة الجلسات العالمية عبر 24 ساعة من منظور المنطقة الزمنية للمستخدم.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    items: FAQ_ITEMS.marketClock,
  });

  return (
    <div className="bg-base" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <EconomyAdLayout>
        <Suspense
          fallback={(
            <MarketClockLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <MarketClockRequestContent />
        </Suspense>
      </EconomyAdLayout>
    </div>
  );
}

async function MarketClockRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <MarketClockLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
