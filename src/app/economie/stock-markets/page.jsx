// src/app/economie/best-trading-time/page.jsx
import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
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
import StockMarketsLive from '@/components/economy/StockMarketsLive';
import { getGuideCardsBySlugs } from '@/lib/guides/data';
import { TOOL_GUIDE_GROUPS } from '@/lib/guides/tools-and-economy-guides';

const SITE_URL = getSiteUrl();
const RELATED_GUIDES = getGuideCardsBySlugs(TOOL_GUIDE_GROUPS.stockMarkets);

export const metadata = buildCanonicalMetadata({
  title: 'هل البورصات العالمية مفتوحة الآن؟ | أمريكا ولندن وتاسي في شاشة واحدة',
  description:
    'إذا كنت تريد أن تعرف هل البورصات العالمية مفتوحة الآن، فهذه الصفحة تعرض فوراً حالة السوق الأمريكي وتاسي ولندن وطوكيو وباريس، مع أوقات الفتح والإغلاق والجلسات الموسعة من مدينتك.',
  keywords: [
    // Short
    'البورصات العالمية', 'تداول البورصة', 'أسواق المال', 'ساعات البورصة',
    'بورصة نيويورك', 'بورصة لندن', 'تداول', 'تاسي', 'سوق الأسهم',
    // Medium
    'مواعيد البورصات العالمية', 'الأسهم اليوم اللحظية', 'موعد افتتاح بورصة لندن وطوكيو',
    'أوقات دوام البورصات', 'جلسة التداول الممتدة', 'تداول السوق السعودي تاسي', 
    'موعد إغلاق البورصة الأمريكية', 'خريطة جلسات بورصات العالم',
    // Long
    'مواعيد وأوقات عمل وافتتاح البورصات العالمية بتوقيتك المحلي', 'هل السوق الأمريكي للأسهم والبورصة العالمية مفتوح الآن',
    'أوقات الفتح والإغلاق لخريطة البورصات العالمية الكبرى', 'متى تفتح أسواق الأسهم في طوكيو باريس لندن ونيويورك',
    'جلسات ما قبل الافتتاح وما بعد الإغلاق للبورصات (Pre-market)', 'أوقات تداول السوق السعودي تاسي وحالة السوق اليوم',
    'دليل ساعات تداول البورصات العالمية وجلسات وول ستريت', 'متابعة حية لمعرفة هل البورصات العالمية الكبرى مفتوحة',
    'بورصة دبي اليوم مفتوحة أم مغلقة', 'بورصة أبوظبي اليوم بتوقيتك',
    'بورصة الكويت الآن', 'بورصة قطر اليوم', 'البورصة المصرية اليوم مفتوحة أم مغلقة',
    'عطل البورصات العربية 2026', 'هل تاسي مفتوح الآن',
  ],
  url: `${SITE_URL}/economie/stock-markets`,
});

export default function StockMarketsPage() {
  const toolSchema = buildEconomyToolSchema({
    siteUrl: SITE_URL,
    path: '/economie/stock-markets',
    name: 'هل البورصات العالمية مفتوحة الآن؟',
    description: 'أداة حية تجيب مباشرة عن حالة البورصات العالمية والعربية الآن، مع أوقات الفتح والإغلاق والجلسات الموسعة بتوقيت المستخدم المحلي.',
    about: ['بورصة نيويورك', 'بورصة لندن', 'البورصات العربية', 'هل السوق مفتوح الآن'],
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'هل البورصات العالمية مفتوحة الآن؟',
    '/economie/stock-markets',
  );
  const datasetSchema = buildEconomyDatasetSchema({
    siteUrl: SITE_URL,
    path: '/economie/stock-markets',
    name: 'بيانات البورصات العالمية والعربية',
    description: 'بيانات أوقات الفتح والإغلاق والجلسات الموسعة لأهم البورصات العالمية والعربية بتحويلها إلى توقيت المستخدم.',
  });
  const speakableSchema = buildEconomySpeakableSchema({
    siteUrl: SITE_URL,
    path: '/economie/stock-markets',
  });
  const faqSchema = buildEconomyFaqSchema({
    siteUrl: SITE_URL,
    path: '/economie/stock-markets',
    items: FAQ_ITEMS.stockMarkets,
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
        <EconomyReadingShelf
          title="اقرأ لفهم السوق قبل الشاشة"
          lead="هذه الأدلة تضيف طبقة تفسيرية حول السوق الأمريكي وساعة السوق حتى لا تبقى متابعة البورصات مجرد جدول فتح وإغلاق."
          items={RELATED_GUIDES}
        />
      </EconomyAdLayout>
    </div>
  );
}

async function StockMarketsRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <StockMarketsLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
