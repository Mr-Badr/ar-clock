import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

import EconomyLanding from '@/components/economy/EconomyLanding';

const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title: 'أوقات الأسواق العالمية والذهب والفوركس اليوم',
  description:
    `صفحة عربية تجمع أدوات الأسواق العالمية داخل ${SITE_BRAND}: مواعيد السوق الأمريكي، الذهب، جلسات الفوركس، والبورصات العالمية بتوقيت المستخدم المحلي.`,
  keywords: [
    'متى يفتح السوق الأمريكي',
    'هل الذهب مفتوح الآن',
    'جلسات الفوركس الآن',
    'البورصات العالمية الآن',
    'هل السوق مفتوح الآن',
    'أوقات تداول الذهب',
    'ساعة التداول العربية',
    'أفضل وقت للتداول',
  ],
  url: `${SITE_URL}/economie`,
});

export default function EconomyPage() {
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الاقتصاد الحي',
    url: `${SITE_URL}/economie`,
    inLanguage: 'ar',
    description: 'صفحة تجمع أدوات حية لجلسات الفوركس والذهب والبورصات العالمية.',
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
      { '@type': 'ListItem', position: 4, name: 'البورصات العالمية الآن', url: `${SITE_URL}/economie/stock-markets` },
      { '@type': 'ListItem', position: 5, name: 'ساعة التداول', url: `${SITE_URL}/economie/market-clock` },
      { '@type': 'ListItem', position: 6, name: 'أفضل وقت للتداول', url: `${SITE_URL}/economie/best-trading-time` },
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="economy-shell">
        <EconomyLanding />
      </main>
    </div>
  );
}
