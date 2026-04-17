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
import ForexSessionsLive from '@/components/economy/ForexSessionsLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'جلسات الفوركس الآن | متى تبدأ لندن ونيويورك بتوقيتك؟',
  description:
    'تابع جلسات الفوركس الأربع الآن بتوقيتك المحلي. اعرف هل السوق مفتوح، ومتى تبدأ لندن ونيويورك، وأين تقع نافذة السيولة العالية للتداول.',
  keywords: [
    // Short
    'جلسات الفوركس', 'سوق العملات', 'الفوركس الان', 'تداخل الجلسات', 'سيولة فوركس',
    'جلسة لندن', 'جلسة نيويورك', 'جلسة آسيا',
    // Medium
    'أوقات جلسات الفوركس', 'متى تفتح جلسة لندن', 'جلسة نيويورك وسيدني',
    'هل سوق الفوركس مفتوح الان', 'ساعات عمل سوق العملات', 'السيولة العالية في الفوركس',
    'أوقات افتتاح وإغلاق الفوركس',
    // Long
    'مواعيد وتوقيت جلسات الفوركس الأربع بتوقيت السعودية والمحلي', 'متى تفتح وتغلق جلسات التداول في لندن ونيويورك',
    'خريطة تداخل جلسات الفوركس لمعرفة أوقات السيولة العالية', 'حالة سوق العملات والفوركس هل هو مفتوح أم مغلق الان',
    'أفضل الأوقات للتداول في سوق الفوركس وجلسات آسيا', 'جدول ساعات العمل لاهم جلسات الفوركس وتداخلاتها',
    'تتبع حركة جلسات تداول سيدني طوكيو لندن نيويورك', 'الساعة وتوقيت سوق الفوركس الحي واللحظي',
    'جلسات الفوركس بتوقيت الرياض', 'جلسات الفوركس بتوقيت الكويت',
    'جلسة لندن بتوقيت السعودية', 'جلسة نيويورك بتوقيت الإمارات',
    'أفضل أزواج كل جلسة فوركس', 'موعد NFP داخل جلسة نيويورك',
  ],
  url: `${SITE_URL}/economie/forex-sessions`,
});

export default function ForexSessionsPage() {
  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/forex-sessions',
    name: 'جلسات الفوركس والذهب الآن',
    description: 'أداة حية لحساب جلسات الفوركس والذهب بتوقيت المستخدم المحلي.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'جلسات الفوركس والذهب الآن',
    '/economie/forex-sessions',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/forex-sessions',
    name: 'بيانات جلسات الفوركس',
    description: 'بيانات مواعيد جلسات سيدني وطوكيو ولندن ونيويورك مع تحويلها إلى توقيت المستخدم العربي.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/forex-sessions',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/forex-sessions',
    items: FAQ_ITEMS.forexSessions,
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
            <ForexSessionsLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <ForexSessionsRequestContent />
        </Suspense>
      </EconomyAdLayout>
    </div>
  );
}

async function ForexSessionsRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
