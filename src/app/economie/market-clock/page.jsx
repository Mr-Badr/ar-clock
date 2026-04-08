import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import MarketClockLive from '@/components/economy/MarketClockLive';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'ساعة التداول العالمية | السوق على مدار 24 ساعة',
  description:
    'ساعة تداول بصرية تُظهر جلسات الفوركس العالمية على مدار 24 ساعة بتوقيتك المحلي، مع تداخل لندن ونيويورك وخريطة السيولة.',
  keywords: [
    'ساعة سوق الفوركس',
    'market clock بالعربي',
    'جلسات الفوركس 24 ساعة',
    'خريطة سيولة الفوركس',
    'تداخل لندن ونيويورك',
  ],
  url: `${SITE_URL}/economie/market-clock`,
});

export default async function MarketClockPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
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
        <MarketClockLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
      </main>
    </div>
  );
}
