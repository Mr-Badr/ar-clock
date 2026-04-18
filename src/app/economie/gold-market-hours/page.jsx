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
import GoldMarketHoursLive from '@/components/economy/GoldMarketHoursLive';

const SITE_URL = getSiteUrl();



export const metadata = buildCanonicalMetadata({
  title: 'هل الذهب مفتوح الآن؟ | أوقات الذهب اليوم بتوقيت السعودية ومدينتك',
  description:
    'اعرف هل الذهب مفتوح الآن، ومتى يفتح سوق الذهب اليوم بتوقيت السعودية أو مدينتك، وما أفضل نافذة للتداول، مع جداول السعودية والإمارات ومصر والمغرب.',
  keywords: [
    // Short
    'سوق الذهب', 'بورصة الذهب', 'تداول الذهب', 'الذهب الآن', 'أسعار الذهب',
    'أوقات الذهب', 'نشاط الذهب',
    // Medium
    'متى يفتح سوق الذهب', 'هل الذهب مفتوح الآن', 'أوقات تداول الذهب التداول',
    'إغلاق سوق الذهب أسبوعياً', 'شاشة تداول الذهب مباشر', 'أفضل أوقات تداول الذهب',
    'بورصة الذهب العالمية اليوم',
    // Long
    'هل سوق الذهب العالمي مفتوح الآن للتداول', 'متى تفتح بورصة الذهب اليوم بتوقيت السعودية ومصر',
    'أفضل أوقات وساعات نشاط تداول الذهب عالمياً والمحلي', 'متى يغلق سوق تداول الذهب العالمي يوم الجمعة',
    'تتبع ساعات عمل وأوقات نشاط بورصة الذهب الحية', 'أوقات سيولة تداول الذهب خلال جلسات لندن ونيويورك',
    'متابعة حية لمواعيد فتح وإغلاق تداول الذهب XAUUSD', 'متى يفتح تداول الذهب بعد العطلة الأسبوعية',
    'هل الذهب مفتوح الآن بتوقيت السعودية', 'هل الذهب مفتوح الآن بتوقيت دبي',
    'أفضل وقت لتداول الذهب في رمضان', 'الفرق بين COMEX وLBMA بالعربي',
    'الذهب العالمي مقابل محلات الذهب', 'متى يتوقف الذهب يومياً',
  ],
  url: `${SITE_URL}/economie/gold-market-hours`,
});

export default function GoldMarketHoursPage() {
  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    name: 'هل الذهب مفتوح الآن؟',
    description: 'أداة عربية لمعرفة حالة سوق الذهب العالمي وأفضل نافذة للسيولة اليومية بتوقيت المستخدم المحلي.',
    about: ['هل الذهب مفتوح الآن', 'متى يفتح سوق الذهب', 'أوقات تداول الذهب', 'تداول XAUUSD'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'هل الذهب مفتوح الآن؟',
    '/economie/gold-market-hours',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    name: 'بيانات جلسات الذهب العالمية',
    description: 'بيانات جلسات الذهب ونوافذ السيولة والاستراحة اليومية بعد تحويلها إلى المنطقة الزمنية للمستخدم.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    items: FAQ_ITEMS.goldMarketHours,
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
            <GoldMarketHoursLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <GoldMarketHoursRequestContent />
        </Suspense>
      </EconomyAdLayout>
    </div>
  );
}

async function GoldMarketHoursRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <GoldMarketHoursLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
