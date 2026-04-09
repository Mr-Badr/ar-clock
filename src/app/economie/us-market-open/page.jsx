import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import UsMarketOpenLive from '@/components/economy/UsMarketOpenLive';

const SITE_URL = getSiteUrl();



export const metadata = buildCanonicalMetadata({
  title: 'متى يفتح السوق الأمريكي اليوم؟ | العد التنازلي بتوقيتك',
  description:
    'اعرف متى يفتح السوق الأمريكي اليوم بتوقيتك المحلي، وكم باقي على الافتتاح، وأول ساعة تداول، مع جداول السعودية والإمارات ومصر والمغرب.',
  keywords: [
    // Short
    'السوق الأمريكي', 'بورصة نيويورك', 'وول ستريت', 'تداول أسهم', 'السوق المفتوح',
    'مؤشرات أمريكية', 'ناسداك', 'داو جونز',
    // Medium
    'متى يفتح السوق الأمريكي', 'أوقات عمل بورصة نيويورك', 'العد التنازلي للسوق الأمريكي',
    'هل السوق الأمريكي مفتوح الآن', 'تداول وول ستريت اليوم', 'السوق الموازي الأمريكي',
    'جلسة التداول في نيويورك', 'افتتاح البورصة الأمريكية',
    // Long
    'كم باقي على افتتاح السوق الأمريكي الآن', 'متى يفتح السوق الأمريكي بتوقيت السعودية اليوم',
    'أوقات تداول السوق الأمريكي بتوقيت مصر والمغرب والمحلي', 'هل السوق الأمريكي للأسهم مفتوح اليوم أم إجازة',
    'العد التنازلي لافتتاح بورصة نيويورك ووول ستريت', 'موعد بداية ونهاية جلسة تداول السوق الأمريكي',
    'تتبع افتتاح مؤشرات السوق الأمريكي ناسداك وداو جونز', 'أوقات تداول الأسهم الأمريكية قبل وبعد الإغلاق',
  ],
  url: `${SITE_URL}/economie/us-market-open`,
});

export default function UsMarketOpenPage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
    name: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'أداة عربية لمعرفة وقت افتتاح السوق الأمريكي والعد التنازلي للجرس الرسمي بتوقيت المستخدم المحلي.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'متى يفتح السوق الأمريكي اليوم؟',
    '/economie/us-market-open',
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
            <UsMarketOpenLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <UsMarketOpenRequestContent />
        </Suspense>
      </main>
    </div>
  );
}

async function UsMarketOpenRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <UsMarketOpenLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
