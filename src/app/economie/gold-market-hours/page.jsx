import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import GoldMarketHoursLive from '@/components/economy/GoldMarketHoursLive';

const SITE_URL = getSiteUrl();

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'هل الذهب مفتوح الآن؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يفتح الذهب العالمي خلال معظم أيام الأسبوع مع استراحة يومية قصيرة وعطلة نهاية أسبوع. وتحوّل هذه الصفحة الحالة الحالية إلى توقيت المستخدم المحلي مباشرة.',
      },
    },
    {
      '@type': 'Question',
      name: 'ما أفضل وقت لتداول الذهب؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'أفضل وقت لتداول الذهب غالباً يكون أثناء تداخل لندن ونيويورك، لأن هذه الفترة تجمع أعلى سيولة وتأثيراً أوضح للأخبار الأمريكية.',
      },
    },
    {
      '@type': 'Question',
      name: 'هل هذه الصفحة تعرض ساعات محلات الذهب؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'لا، هذه الصفحة تتحدث عن السوق العالمي للذهب وجلسات السيولة المرتبطة به، لا عن ساعات دوام المتاجر المحلية أو البنوك.',
      },
    },
  ],
};

export const metadata = buildCanonicalMetadata({
  title: 'هل الذهب مفتوح الآن؟ | أوقات تداول الذهب بتوقيتك',
  description:
    'اعرف هل الذهب مفتوح الآن، ومتى يفتح سوق الذهب اليوم بتوقيتك المحلي، وما أفضل نافذة للتداول، مع جداول السعودية والإمارات ومصر والمغرب.',
  keywords: [
    'هل الذهب مفتوح الآن',
    'متى يفتح سوق الذهب',
    'متى يفتح الذهب بتوقيت السعودية',
    'أفضل وقت لتداول الذهب',
    'هل سوق الذهب مفتوح الآن',
    'أوقات تداول الذهب',
  ],
  url: `${SITE_URL}/economie/gold-market-hours`,
});

export default async function GoldMarketHoursPage() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/gold-market-hours',
    name: 'هل الذهب مفتوح الآن؟',
    description: 'أداة عربية لمعرفة حالة سوق الذهب العالمي وأفضل نافذة للسيولة اليومية بتوقيت المستخدم المحلي.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'هل الذهب مفتوح الآن؟',
    '/economie/gold-market-hours',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="economy-shell">
        <GoldMarketHoursLive initialViewer={initialViewer} initialNowIso={initialNowIso} />
      </main>
    </div>
  );
}
