import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildEconomyBreadcrumbSchema,
  buildEconomyDatasetSchema,
  buildEconomyFaqSchema,
  buildEconomySpeakableSchema,
  buildEconomyToolSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import { EconomyReadingShelf } from '@/components/economy/common';
import { FAQ_ITEMS } from '@/components/economy/data/faqItems';
import UsMarketOpenLive from '@/components/economy/UsMarketOpenLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.usMarketOpen);



export const metadata = buildCanonicalMetadata({
  title: 'متى يفتح السوق الأمريكي اليوم؟ | كم باقي على افتتاح وول ستريت',
  description:
    'إذا كان سؤالك: متى يفتح السوق الأمريكي اليوم؟ فهذه الصفحة تعرض كم باقي على افتتاح وول ستريت، ووقت الافتتاح من مدينتك، وأول ساعة تداول، وحالة السوق الآن بشكل مباشر.',
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
    'متى يفتح السوق الأمريكي بتوقيت الكويت', 'متى يفتح السوق الأمريكي بتوقيت دبي',
    'متى يفتح السوق الأمريكي بتوقيت المغرب', 'هل السوق الأمريكي مفتوح اليوم أم عطلة',
    'عطل بورصة نيويورك 2026', 'ساعات ما قبل السوق الأمريكي وما بعد الإغلاق',
  ],
  url: `${SITE_URL}/economie/us-market-open`,
});

export default async function UsMarketOpenPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
    name: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'أداة عربية تجيب مباشرة عن وقت افتتاح السوق الأمريكي اليوم وكم بقي على الجرس الرسمي، مع توقيت مدينتك وحالة السوق الآن.',
    about: ['متى يفتح السوق الأمريكي', 'افتتاح ناسداك', 'افتتاح بورصة نيويورك', 'هل السوق الأمريكي مفتوح الآن'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'متى يفتح السوق الأمريكي اليوم؟',
    '/economie/us-market-open',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
    name: 'بيانات افتتاح السوق الأمريكي',
    description: 'بيانات مواعيد الجلسة الرسمية والجلسات الموسعة للسوق الأمريكي بعد تحويلها إلى توقيت المستخدم العربي.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
    items: FAQ_ITEMS.usMarketOpen,
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
        <UsMarketOpenLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        <EconomyReadingShelf
          title="اقرأ قبل متابعة الافتتاح"
          lead="هذه الأدلة تشرح معنى الافتتاح الأمريكي والساعة البصرية حتى لا تبقى الصفحة مجرد عد تنازلي من دون سياق."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
