import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
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
    'جلسات الفوركس الآن',
    'هل سوق الفوركس مفتوح الآن',
    'متى تفتح جلسة لندن',
    'جلسة نيويورك الآن',
    'أوقات تداول الذهب',
    'نافذة السيولة العالية',
  ],
  url: `${SITE_URL}/economie/forex-sessions`,
});

export default async function ForexSessionsPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
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
        <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
      </main>
    </div>
  );
}
