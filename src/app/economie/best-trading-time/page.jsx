import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import BestTradingTimeLive from '@/components/economy/BestTradingTimeLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'أفضل وقت للتداول | نافذة الفوركس والذهب من مدينتك',
  description:
    'اعرف أفضل وقت لتداول الفوركس والذهب من مدينتك: نافذة لندن ونيويورك، أول ساعة أمريكية، وخريطة السيولة اليومية والأسبوعية.',
  keywords: [
    'أفضل وقت للتداول',
    'أفضل وقت لتداول الذهب',
    'أفضل وقت لتداول الفوركس',
    'متى أتداول EURUSD',
    'أفضل ساعات السوق الأمريكي',
  ],
  url: `${SITE_URL}/economie/best-trading-time`,
});

export default function BestTradingTimePage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    name: 'أفضل وقت للتداول',
    description: 'أداة عربية لحساب أفضل نوافذ التداول اليومية والأسبوعية من مدينة المستخدم.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'أفضل وقت للتداول',
    '/economie/best-trading-time',
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
            <BestTradingTimeLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <BestTradingTimeRequestContent />
        </Suspense>
      </main>
    </div>
  );
}

async function BestTradingTimeRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <BestTradingTimeLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
