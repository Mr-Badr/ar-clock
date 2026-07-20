import { Suspense } from 'react';

import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildDiscoveryViewModel,
  normalizeDiscoveryQueryValue,
  POPULAR_SITE_SEARCHES,
} from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const VALID_TABS = new Set(['all', 'tools', 'articles', 'sections', 'featured']);
const DISCOVERY_BASE_TITLE = 'فهرس ميقاتنا: ابدأ من سؤالك وافتح الأداة المناسبة';
const DISCOVERY_BASE_DESCRIPTION =
  'افتح فهرس ميقاتنا عندما لا تعرف اسم الصفحة: اكتب سؤالك وانتقل إلى أداة الوقت أو الصلاة أو التاريخ أو الحاسبة أو المقال المناسب.';

const BASE_KEYWORDS = [
  'استكشف صفحات ميقاتنا',
  'صفحات ميقاتنا',
  'فهرس ميقاتنا',
  'فهرس أدوات عربية',
  'كل أدوات ميقاتنا',
  'البحث في ميقاتنا',
  'دليل أدوات الوقت',
  'دليل مواقيت الصلاة',
  'دليل محول التاريخ',
  'المدونة العربية في ميقاتنا',
  'الحاسبات العربية',
  'حاسبات أونلاين عربية',
  'الوقت الان ومواقيت الصلاة',
  'مسارات ميقاتنا',
  'أدوات ميقاتنا',
  'كل صفحات ميقاتنا',
  ...POPULAR_SITE_SEARCHES.slice(0, 14),
];

const DISCOVERY_FAQ_ITEMS = [
  {
    question: 'ما فائدة فهرس ميقاتنا؟',
    answer:
      'فهرس ميقاتنا يجمع أدوات الوقت، مواقيت الصلاة، التاريخ، الحاسبات، المناسبات، والمقالات في صفحة واحدة، حتى تبدأ من السؤال المناسب بدلاً من تجربة روابط كثيرة.',
  },
  {
    question: 'هل أبدأ من الأداة أم من المقال؟',
    answer:
      'ابدأ من الأداة عندما تريد رقماً أو موعداً فورياً، مثل الوقت الان أو حاسبة القسط. وابدأ من المقال عندما تحتاج شرحاً أو أمثلة أو حدوداً قبل الاعتماد على النتيجة.',
  },
  {
    question: 'هل الفهرس يغني عن التحقق الرسمي؟',
    answer:
      'لا. الفهرس يساعدك على الوصول إلى الصفحة المناسبة داخل ميقاتنا، لكن القرارات الرسمية أو الدينية أو المالية تحتاج مراجعة الجهة المعتمدة أو المصدر الرسمي عند الحاجة.',
  },
  {
    question: 'كيف أبحث داخل الفهرس؟',
    answer:
      'اكتب السؤال كما تفكر فيه: كم الساعة في دبي، تحويل هجري إلى ميلادي، حاسبة الضريبة، أو كم باقي على رمضان. سيعرض الفهرس أقرب الصفحات والأدوات والمقالات.',
  },
];

const FAHRAS_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'أسئلة فهرس ميقاتنا',
  url: `${SITE_URL}/fahras`,
  inLanguage: 'ar',
  mainEntity: DISCOVERY_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata = buildCanonicalMetadata({
  title: DISCOVERY_BASE_TITLE,
  description: DISCOVERY_BASE_DESCRIPTION,
  keywords: BASE_KEYWORDS,
  url: `${SITE_URL}/fahras`,
});

function normalizeTabParam(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return VALID_TABS.has(normalized) ? normalized : 'all';
}

async function FahrasDiscoveryContent({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);
  const viewModel = buildDiscoveryViewModel(query);

  return <DiscoveryWorkspace mode="map" viewModel={viewModel} initialTab={initialTab} />;
}

const FAHRAS_DEFAULT_VIEW_MODEL = buildDiscoveryViewModel('');

export default function FahrasPage({ searchParams }) {
  return (
    <>
      <JsonLd data={FAHRAS_FAQ_SCHEMA} />
      <h1 className="sr-only">فهرس ميقاتنا للوصول إلى الأداة أو المقال من أول مرة</h1>
      <ErrorBoundary name="fahras-discovery-workspace">
        <Suspense
          fallback={<DiscoveryWorkspace mode="map" viewModel={FAHRAS_DEFAULT_VIEW_MODEL} initialTab="all" />}
        >
          <FahrasDiscoveryContent searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
