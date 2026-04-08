import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import StockMarketsLive from '@/components/economy/StockMarketsLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'البورصات العالمية الآن | هل السوق مفتوح بتوقيتك؟',
  description:
    'تابع أهم البورصات العالمية بتوقيتك المحلي: السوق الأمريكي، تداول السعودي، لندن، طوكيو وباريس، مع أوقات الفتح والإغلاق والجلسات الموسعة.',
  keywords: [
    'هل السوق الأمريكي مفتوح الآن',
    'أوقات البورصات العالمية',
    'بورصة نيويورك بتوقيت السعودية',
    'تداول السعودي الآن',
    'متى تفتح البورصة الأمريكية',
    'pre market بالعربي',
  ],
  url: `${SITE_URL}/economie/stock-markets`,
});

export default function StockMarketsPage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/stock-markets',
    name: 'البورصات العالمية الآن',
    description: 'أداة حية لعرض البورصات العالمية بتوقيت المستخدم المحلي.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'البورصات العالمية الآن',
    '/economie/stock-markets',
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
            <StockMarketsLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <StockMarketsRequestContent />
        </Suspense>
      </main>
    </div>
  );
}

async function StockMarketsRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <StockMarketsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
