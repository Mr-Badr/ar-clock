import { Suspense } from 'react';

import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  STATIC_ECONOMY_PAGE_STATE,
  buildEconomyBreadcrumbSchema,
  buildEconomyWebApplicationSchema,
  getInitialEconomyPageState,
} from '@/lib/economy/page-helpers';
import { getSiteUrl } from '@/lib/site-config';

import UsMarketOpenLive from '@/components/economy/UsMarketOpenLive';

const SITE_URL = getSiteUrl();

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'متى يفتح السوق الأمريكي؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يفتح السوق الأمريكي في الجلسة الرسمية عند 9:30 صباحاً بتوقيت نيويورك في أيام التداول المعتادة. وتحوّل هذه الصفحة الموعد تلقائياً إلى توقيت المستخدم المحلي.',
      },
    },
    {
      '@type': 'Question',
      name: 'هل توجد جلسة ما قبل السوق؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'نعم، توجد جلسة ما قبل السوق قبل الافتتاح الرسمي، كما توجد جلسة ما بعد الإغلاق. وهاتان الفترتان أقل سيولة من الجلسة الرسمية غالباً.',
      },
    },
    {
      '@type': 'Question',
      name: 'لماذا يتغير توقيت السوق الأمريكي بين الصيف والشتاء؟',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'يتغير توقيت السوق الأمريكي لأن نيويورك تعتمد التوقيت الصيفي، بينما لا تتبعه كل الدول العربية بنفس النمط أو في نفس التواريخ.',
      },
    },
  ],
};

export const metadata = buildCanonicalMetadata({
  title: 'متى يفتح السوق الأمريكي اليوم؟ | العد التنازلي بتوقيتك',
  description:
    'اعرف متى يفتح السوق الأمريكي اليوم بتوقيتك المحلي، وكم باقي على الافتتاح، وأول ساعة تداول، مع جداول السعودية والإمارات ومصر والمغرب.',
  keywords: [
    'متى يفتح السوق الأمريكي',
    'كم باقي على افتتاح السوق الأمريكي',
    'متى يفتح السوق الأمريكي بتوقيت السعودية',
    'متى يفتح السوق الأمريكي بتوقيت مصر',
    'متى يفتح السوق الأمريكي بتوقيت المغرب',
    'هل السوق الأمريكي مفتوح الآن',
  ],
  url: `${SITE_URL}/economie/us-market-open`,
});

export default function UsMarketOpenPage() {
  const webApplicationSchema = buildEconomyWebApplicationSchema({
    siteUrl: SITE_URL,
    path: '/economie/us-market-open',
    name: 'متى يفتح السوق الأمريكي اليوم؟',
    description: 'أداة عربية لمعرفة وقت افتتاح السوق الأمريكي والعد التنازلي للجرس الرسمي بتوقيت المستخدم المحلي.',
  });
  const breadcrumbSchema = buildEconomyBreadcrumbSchema(
    SITE_URL,
    'متى يفتح السوق الأمريكي اليوم؟',
    '/economie/us-market-open',
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
        <Suspense
          fallback={(
            <UsMarketOpenLive
              initialViewer={STATIC_ECONOMY_PAGE_STATE.initialViewer}
              initialNowIso={STATIC_ECONOMY_PAGE_STATE.initialNowIso}
            />
          )}
        >
          <UsMarketOpenRequestContent />
        </Suspense>
      </main>
    </div>
  );
}

async function UsMarketOpenRequestContent() {
  const { initialViewer, initialNowIso } = await getInitialEconomyPageState();
  return <UsMarketOpenLive initialViewer={initialViewer} initialNowIso={initialNowIso} />;
}
