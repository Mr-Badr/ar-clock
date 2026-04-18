// src/app/economie/page.jsx
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, SITE_ECONOMY_KEYWORDS, getSiteUrl } from '@/lib/site-config';

import EconomyAdLayout from '@/components/ads/EconomyAdLayout';
import EconomyLanding from '@/components/economy/EconomyLanding';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'هل السوق الأمريكي أو الذهب مفتوح الآن؟ | جلسات الفوركس والبورصات',
  description:
    `تحقق فوراً هل السوق الأمريكي أو الذهب أو الفوركس مفتوح الآن، ومتى تبدأ جلسة لندن ونيويورك، وهل البورصات العالمية مفتوحة، من صفحات عربية سريعة داخل ${SITE_BRAND}.`,
  keywords: [
    // Short
    'اقتصاد', 'اقتصاديات', 'تداول', 'فوركس', 'بورصة', 'ذهب', 'أسواق', 'مؤشرات', 
    // Medium
    'أوقات التداول', 'ساعات الفوركس', 'جلسات التداول', 'تداول الذهب', 'السوق الأمريكي', 
    'البورصة اليوم', 'سيولة السوق', 'أوقات البورصات', 'الأسواق العالمية',
    // Long
    'تتبع حركة الأسواق العالمية مباشر', 'متى يفتح السوق الأمريكي اليوم بتوقيت السعودية', 
    'هل بورصة الذهب مفتوحة الآن', 'ساعات جلسات الفوركس العالمية الان', 'أفضل وأسوأ أوقات التداول خلال اليوم',
    'خريطة سيولة الأسواق المالية اليومية', 'مواعيد إغلاق وافتتاح البورصات العالمية 2026',
    'ساعة التداول لأسواق الفوركس والذهب', 'أدوات التداول الحي اللحظية', 'متابعة اقتصادية يومية دقيقة',
    'تقويم اقتصادي عربي مباشر', 'أقرب حدث اقتصادي مهم اليوم', 'البورصات العربية والخليجية اليوم',
    'أفضل وقت للتداول من مدينتك', 'هل تداول السعودية مفتوح الآن', 'هل الذهب مفتوح الآن بتوقيت الرياض',
    ...SITE_ECONOMY_KEYWORDS,
  ],
  url: `${SITE_URL}/economie`,
});

export default function EconomyPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الاقتصاد الحي',
    url: `${SITE_URL}/economie`,
    inLanguage: 'ar',
    description: 'صفحة تجمع أدوات حية للسوق الأمريكي والذهب وجلسات الفوركس والبورصات العالمية بصياغة عربية مباشرة.',
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الاقتصاد', item: `${SITE_URL}/economie` },
    ],
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `أدوات الاقتصاد في ${SITE_BRAND}`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'متى يفتح السوق الأمريكي؟', url: `${SITE_URL}/economie/us-market-open` },
      { '@type': 'ListItem', position: 2, name: 'هل الذهب مفتوح الآن؟', url: `${SITE_URL}/economie/gold-market-hours` },
      { '@type': 'ListItem', position: 3, name: 'جلسات الفوركس الآن', url: `${SITE_URL}/economie/forex-sessions` },
      { '@type': 'ListItem', position: 4, name: 'هل البورصات العالمية مفتوحة الآن؟', url: `${SITE_URL}/economie/stock-markets` },
      { '@type': 'ListItem', position: 5, name: 'ساعة السوق الآن', url: `${SITE_URL}/economie/market-clock` },
      { '@type': 'ListItem', position: 6, name: 'ما أفضل وقت للتداول اليوم؟', url: `${SITE_URL}/economie/best-trading-time` },
    ],
  };

  return (
    <div className="bg-base" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <EconomyAdLayout>
        <EconomyLanding />
      </EconomyAdLayout>
    </div>
  );
}
