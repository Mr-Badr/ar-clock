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
import MarketClockLive from '@/components/economy/MarketClockLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.marketClock);

export const metadata = buildCanonicalMetadata({
  title: 'أين السيولة الأعلى الآن؟ | ساعة السوق وذروة الفوركس والذهب',
  description:
    'إذا كان سؤالك: أين السيولة الأعلى الآن؟ فهذه الصفحة تعرض ساعة السوق على مدار 24 ساعة، وتوضح ذروة لندن ونيويورك وخريطة النشاط في الفوركس والذهب من مدينتك.',
  keywords: [
    // Short
    'ساعة التداول', 'مؤشر فوركس', 'سيولة', 'تداخل جلسات', 'تداول 24', 'market clock',
    // Medium
    'ساعة السوق الآن', 'خريطة سيولة الأسواق', 'تداخل لندن ونيويورك', 'أوقات سوق الفوركس',
    'مؤشر حركة الأسواق', 'تتبع سيولة الفوركس', 'حجم التداول اليومي', 'Market clock بالعربي',
    // Long
    'ساعة التداول العالمية لمعرفة سيولة الأسواق', 'أداة تتبع جلسات الفوركس على مدار 24 ساعة',
    'مؤشر تداخل جلسة لندن ونيويورك اللحظي', 'متى تبدأ وتنتهي جلسات التداول العالمية',
    'خريطة توضيحية لسيولة الفوركس بتوقيتك المحلي', 'أفضل أداة لمتابعة افتتاح وإغلاق البورصات',
    'تتبع حركة السوق المالي في الوقت الفعلي', 'كيفية قراءة ساعة تداول سوق العملات',
    'متى تكون ذروة لندن ونيويورك اليوم', 'ساعة سيولة الفوركس بتوقيت السعودية',
    'أفضل وقت الآن في السوق', 'خريطة نشاط الذهب اليوم', 'مقارنة اليوم وغداً في سيولة التداول',
  ],
  url: `${SITE_URL}/economie/market-clock`,
});

export default async function MarketClockPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    name: 'أين السيولة الأعلى الآن؟',
    description: 'أداة بصرية تجيب مباشرة عن مكان تركز السيولة الآن عبر جلسات الفوركس والذهب على مدار 24 ساعة من توقيت المستخدم المحلي.',
    about: ['ساعة السوق', 'سيولة الفوركس', 'تداخل لندن ونيويورك', 'خريطة نشاط الذهب'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'أين السيولة الأعلى الآن؟',
    '/economie/market-clock',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    name: 'بيانات ساعة التداول العالمية',
    description: 'بيانات بصرية لحركة الجلسات العالمية عبر 24 ساعة من منظور المنطقة الزمنية للمستخدم.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/market-clock',
    items: FAQ_ITEMS.marketClock,
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
        <MarketClockLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        <EconomyReadingShelf
          title="كيف تفهم الساعة لا الرقم فقط؟"
          lead="هذه الأدلة تشرح معنى ساعة السوق والسيولة والجلسات، ثم تعيد المستخدم إلى الأداة وهو يفهم القراءة البصرية بشكل أوضح."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
