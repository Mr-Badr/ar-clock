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
import ForexSessionsLive from '@/components/economy/ForexSessionsLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.forexSessions);

export const metadata = buildCanonicalMetadata({
  title: 'متى تبدأ جلسة لندن ونيويورك اليوم؟ | هل سوق الفوركس مفتوح الآن',
  description:
    'إذا كان سؤالك: متى تبدأ جلسة لندن ونيويورك اليوم؟ فهذه الصفحة تعطيك جواباً مباشراً: هل سوق الفوركس مفتوح الآن، متى تفتح الجلسات الأربع، وأين تقع نافذة السيولة الأعلى بتوقيتك المحلي.',
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

export default async function ForexSessionsPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/forex-sessions',
    name: 'متى تبدأ جلسة لندن ونيويورك اليوم؟',
    description: 'أداة حية تجيب مباشرة عن وقت جلسات لندن ونيويورك وطوكيو وسيدني، وهل سوق الفوركس مفتوح الآن، وأين تقع ذروة السيولة بتوقيت المستخدم المحلي.',
    about: ['جلسة لندن', 'جلسة نيويورك', 'ساعات الفوركس', 'هل سوق الفوركس مفتوح الآن'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'متى تبدأ جلسة لندن ونيويورك اليوم؟',
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
        <ForexSessionsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        <EconomyReadingShelf
          title="اقرأ قبل الاعتماد على الجلسات"
          lead="هذه الأدلة تشرح معنى الجلسات والتداخل والسيولة وساعة السوق، ثم تعيد الزائر إلى الأداة الحية وهو يفهم ما يراه بشكل أفضل."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
