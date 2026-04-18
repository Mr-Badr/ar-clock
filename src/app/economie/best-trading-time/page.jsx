// src/app/economie/best-trading-time/page.jsx
import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyDatasetSchema,
  buildEconomyFaqSchema,
  buildEconomySpeakableSchema,
  buildEconomyToolSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import BestTradingTimeLive from '@/components/economy/BestTradingTimeLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'ما أفضل وقت للتداول اليوم؟ | الفوركس والذهب من مدينتك',
  description:
    'اعرف أفضل وقت للتداول اليوم من مدينتك: نافذة لندن ونيويورك، أول ساعة أمريكية، وخريطة السيولة اليومية والأسبوعية للفوركس والذهب.',
  keywords: [
    // Short
    'أفضل أوقات التداول', 'تداول العملات', 'وقت الذروة', 'نافذة التداول', 'متى أتداول',
    'سيولة السوق', 'أوقات الذروة تداول',
    // Medium
    'أفضل وقت لتداول الفوركس والذهب', 'متى أتداول EURUSD', 'السيولة العالية في التداول',
    'أسوأ أيام وأوقات التداول', 'جلسات التداول النشطة المتقاطعة', 'أفضل ساعات عمل السوق الأمريكي',
    'أنسب وقت للمضاربة اليومية',
    // Long
    'ما هو أفضل وقت وساعة لتداول الفوركس والذهب بتوقيتك المحلي', 'أفضل وأسوأ الأيام والأوقات لفتح صفقات تداول أسبوعية',
    'تداخل ونشاط الجلسات الأوروبية والأمريكية للتداول اللحظي', 'أفضل استراتيجية لاختيار وقت الذروة في تداول العملات',
    'خريطة السيولة والتقلبات العالية لمعرفة أنسب موعد للتداول والدخول', 'متى أتداول في بورصة نيويورك ولندن للحصول على أكبر سيولة',
    'دليل معرفة أوقات سيولة الفوركس العالية والمخاطرة المنخفضة', 'ساعات الذروة الذهبية للتداول والمضاربة في الأسواق العالمية',
    'أسوأ أوقات التداول في الفوركس', 'أفضل وقت لتداول الذهب من السعودية',
    'أفضل وقت لتداول EURUSD', 'أفضل وقت لتداول XAUUSD',
    'مقارنة أفضل وقت للتداول بين الرياض ودبي', 'متى أتجنب التداول وقت الأخبار',
  ],
  url: `${SITE_URL}/economie/best-trading-time`,
});

export default function BestTradingTimePage() {
  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    name: 'ما أفضل وقت للتداول اليوم؟',
    description: 'أداة عربية لحساب أفضل نوافذ التداول اليومية والأسبوعية من مدينة المستخدم.',
    about: ['أفضل وقت للتداول', 'أفضل وقت لتداول الذهب', 'أفضل وقت لتداول الفوركس', 'سيولة السوق'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'ما أفضل وقت للتداول اليوم؟',
    '/economie/best-trading-time',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    name: 'بيانات أفضل وقت للتداول',
    description: 'بيانات نوافذ السيولة والتداخلات اليومية والأسبوعية للمتداول العربي من مدينته الحالية.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    items: FAQ_ITEMS.bestTradingTime,
  });

  return (
    <div className="bg-base" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
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
            <BestTradingTimeLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <BestTradingTimeRequestContent />
        </Suspense>
      </EconomyAdLayout>
    </div>
  );
}

async function BestTradingTimeRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <BestTradingTimeLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
