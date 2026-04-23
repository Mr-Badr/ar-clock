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
import GoldMarketHoursLive from '@/components/economy/GoldMarketHoursLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.goldMarketHours);



export const metadata = buildCanonicalMetadata({
  title: 'هل الذهب مفتوح الآن؟ | متى يفتح سوق الذهب اليوم من مدينتك',
  description:
    'إذا كان سؤالك: هل الذهب مفتوح الآن؟ فهذه الصفحة تعطيك فوراً حالة سوق الذهب، ومتى يفتح اليوم من مدينتك، وأفضل نافذة لتداول XAU/USD، مع جداول عربية واضحة.',
  keywords: [
    // Short
    'سوق الذهب', 'بورصة الذهب', 'تداول الذهب', 'الذهب الآن', 'أسعار الذهب',
    'أوقات الذهب', 'نشاط الذهب',
    // Medium
    'متى يفتح سوق الذهب', 'هل الذهب مفتوح الآن', 'أوقات تداول الذهب التداول',
    'إغلاق سوق الذهب أسبوعياً', 'شاشة تداول الذهب مباشر', 'أفضل أوقات تداول الذهب',
    'بورصة الذهب العالمية اليوم',
    // Long
    'هل سوق الذهب العالمي مفتوح الآن للتداول', 'متى تفتح بورصة الذهب اليوم بتوقيت السعودية ومصر',
    'أفضل أوقات وساعات نشاط تداول الذهب عالمياً والمحلي', 'متى يغلق سوق تداول الذهب العالمي يوم الجمعة',
    'تتبع ساعات عمل وأوقات نشاط بورصة الذهب الحية', 'أوقات سيولة تداول الذهب خلال جلسات لندن ونيويورك',
    'متابعة حية لمواعيد فتح وإغلاق تداول الذهب XAUUSD', 'متى يفتح تداول الذهب بعد العطلة الأسبوعية',
    'هل الذهب مفتوح الآن بتوقيت السعودية', 'هل الذهب مفتوح الآن بتوقيت دبي',
    'أفضل وقت لتداول الذهب في رمضان', 'الفرق بين COMEX وLBMA بالعربي',
    'الذهب العالمي مقابل محلات الذهب', 'متى يتوقف الذهب يومياً',
  ],
  url: `${SITE_URL}/economie/gold-market-hours`,
});

export default async function GoldMarketHoursPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    name: 'هل الذهب مفتوح الآن؟',
    description: 'أداة عربية تجيب مباشرة عن حالة سوق الذهب الآن، ومتى يفتح اليوم، وأفضل نافذة للسيولة اليومية بتوقيت المستخدم المحلي.',
    about: ['هل الذهب مفتوح الآن', 'متى يفتح سوق الذهب', 'أوقات تداول الذهب', 'تداول XAUUSD'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'هل الذهب مفتوح الآن؟',
    '/economie/gold-market-hours',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    name: 'بيانات جلسات الذهب العالمية',
    description: 'بيانات جلسات الذهب ونوافذ السيولة والاستراحة اليومية بعد تحويلها إلى المنطقة الزمنية للمستخدم.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    items: FAQ_ITEMS.goldMarketHours,
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
        <GoldMarketHoursLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        <EconomyReadingShelf
          title="اقرأ قبل متابعة الذهب"
          lead="هذه الأدلة تضيف قيمة فوق سؤال هل الذهب مفتوح الآن: متى تكون النافذة الأفضل، وما علاقة الجلسات، وكيف تفصل بين السوق العالمي والمتاجر المحلية."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
