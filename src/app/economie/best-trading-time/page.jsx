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
import BestTradingTimeLive from '@/components/economy/BestTradingTimeLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.bestTradingTime);

export const metadata = buildCanonicalMetadata({
  title: 'ما أفضل وقت للتداول اليوم؟ | متى تدخل الفوركس أو الذهب من مدينتك',
  description:
    'إذا كان سؤالك: ما أفضل وقت للتداول اليوم؟ فهذه الصفحة تعرض أفضل نافذة من مدينتك لدخول الفوركس أو الذهب، مع نافذة لندن ونيويورك وأول ساعة أمريكية وخريطة السيولة اليومية والأسبوعية.',
  keywords: [
    // Short
    'أفضل أوقات التداول', 'تداول العملات', 'وقت الذروة', 'نافذة التداول', 'متى أتداول',
    'سيولة السوق', 'أوقات الذروة تداول',
    // Medium
    'أفضل وقت لتداول الفوركس والذهب', 'متى أتداول EURUSD', 'السيولة العالية في التداول',
    'أسوأ أيام وأوقات التداول', 'جلسات التداول النشطة المتقاطعة', 'أفضل ساعات عمل السوق الأمريكي',
    'أنسب وقت للمضاربة اليومية',
    // Long
    'ما هو أفضل وقت وساعة لتداول الفوركس والذهب بتوقيتك المحلي', 'أفضل وأسوأ الأيام والأوقات لفتح صفقات تداول أسبوعية',
    'تداخل ونشاط الجلسات الأوروبية والأمريكية للتداول اللحظي', 'أفضل استراتيجية لاختيار وقت الذروة في تداول العملات',
    'خريطة السيولة والتقلبات العالية لمعرفة أنسب موعد للتداول والدخول', 'متى أتداول في بورصة نيويورك ولندن للحصول على أكبر سيولة',
    'دليل معرفة أوقات سيولة الفوركس العالية والمخاطرة المنخفضة', 'ساعات الذروة الذهبية للتداول والمضاربة في الأسواق العالمية',
    'أسوأ أوقات التداول في الفوركس', 'أفضل وقت لتداول الذهب من السعودية',
    'أفضل وقت لتداول EURUSD', 'أفضل وقت لتداول XAUUSD',
    'مقارنة أفضل وقت للتداول بين الرياض ودبي', 'متى أتجنب التداول وقت الأخبار',
  ],
  url: `${SITE_URL}/economie/best-trading-time`,
});

export default async function BestTradingTimePage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();

  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    name: 'ما أفضل وقت للتداول اليوم؟',
    description: 'أداة عربية تجيب مباشرة عن أفضل نوافذ التداول اليومية والأسبوعية من مدينة المستخدم للفوركس والذهب.',
    about: ['أفضل وقت للتداول', 'أفضل وقت لتداول الذهب', 'أفضل وقت لتداول الفوركس', 'سيولة السوق'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'ما أفضل وقت للتداول اليوم؟',
    '/economie/best-trading-time',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    name: 'بيانات أفضل وقت للتداول',
    description: 'بيانات نوافذ السيولة والتداخلات اليومية والأسبوعية للمتداول العربي من مدينته الحالية.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/best-trading-time',
    items: FAQ_ITEMS.bestTradingTime,
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
        <BestTradingTimeLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
        <EconomyReadingShelf
          title="أدلة تساعدك على قراءة التوقيت"
          lead="هذه الأدلة تضيف طبقة فهم فوق التوصية الزمنية نفسها: كيف تقرأ الساعة، ومتى ينشط الذهب، وكيف ترتبط الجلسات بالنافذة الأفضل."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}
