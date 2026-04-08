import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
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

export default async function StockMarketsPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
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
        <StockMarketsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
      </main>
    </div>
  );
}
