import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import ForexSessionsLive from '@/components/economy/ForexSessionsLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'جلسات الفوركس والذهب الآن | ساعات السوق بتوقيتك',
  description:
    'تابع جلسات الفوركس الأربع والذهب بتوقيتك المحلي الآن. اعرف هل السوق مفتوح، ومتى تبدأ لندن ونيويورك، وأين تقع نافذة السيولة العالية.',
  keywords: [
    // Short
    'جلسات الفوركس', 'سوق العملات', 'الفوركس الآن', 'تداخل الجلسات', 'سيولة فوركس',
    'جلسة لندن', 'جلسة نيويورك', 'جلسة آسيا',
    // Medium
    'أوقات جلسات الفوركس', 'متى تفتح جلسة لندن', 'جلسة نيويورك وسيدني',
    'هل سوق الفوركس مفتوح الآن', 'ساعات عمل سوق العملات', 'السيولة العالية في الفوركس',
    'أوقات افتتاح وإغلاق الفوركس',
    // Long
    'مواعيد وتوقيت جلسات الفوركس الأربع بتوقيت السعودية والمحلي', 'متى تفتح وتغلق جلسات التداول في لندن ونيويورك',
    'خريطة تداخل جلسات الفوركس لمعرفة أوقات السيولة العالية', 'حالة سوق العملات والفوركس هل هو مفتوح أم مغلق الآن',
    'أفضل الأوقات للتداول في سوق الفوركس وجلسات آسيا', 'جدول ساعات العمل لاهم جلسات الفوركس وتداخلاتها',
    'تتبع حركة جلسات تداول سيدني طوكيو لندن نيويورك', 'الساعة وتوقيت سوق الفوركس الحي واللحظي',
  ],
  url: `${SITE_URL}/economie/forex-sessions`,
});

export default function ForexSessionsPage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
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
      <main className="economy-shell">
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
      </main>
    </div>
  );
}

async function ForexSessionsRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
