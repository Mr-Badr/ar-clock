import { Suspense } from 'react';

import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildDiscoveryViewModel, normalizeDiscoveryQueryValue } from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const VALID_TABS = new Set(['all', 'tools', 'articles', 'sections', 'featured']);
const SEARCH_PAGE_TITLE = 'البحث داخل ميقاتنا | اعثر على الأداة أو المقال بسرعة';
const SEARCH_PAGE_DESCRIPTION =
  'استخدم البحث الداخلي في ميقاتنا للوصول إلى أدوات الوقت، مواقيت الصلاة، التاريخ، الحاسبات، المناسبات، والمقالات بصيغة سؤالك الطبيعي.';

const SEARCH_FAQ_ITEMS = [
  {
    question: 'كيف أبحث داخل ميقاتنا؟',
    answer:
      'اكتب السؤال كما تفكر فيه: كم الساعة في الرياض، تحويل هجري إلى ميلادي، حاسبة القسط، أو كم باقي على رمضان. صفحة البحث ترتب النتائج حسب الأقرب إلى نيتك.',
  },
  {
    question: 'ما الفرق بين صفحة البحث وصفحة الفهرس؟',
    answer:
      'صفحة البحث مفيدة عندما تعرف ما تريد تقريباً وتريد الوصول بسرعة. أما الفهرس فيناسبك عندما تريد استكشاف كل الأقسام والمسارات من دون عبارة بحث محددة.',
  },
  {
    question: 'ماذا أفعل إذا لم تظهر نتيجة مناسبة؟',
    answer:
      'جرّب عبارة أقصر، احذف الكلمات العامة، أو افتح الفهرس الكامل. مثال: بدلاً من “أريد أداة تساعدني في حساب القرض” اكتب “حاسبة القسط”.',
  },
];

const SEARCH_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'أسئلة البحث داخل ميقاتنا',
  url: `${SITE_URL}/search`,
  inLanguage: 'ar',
  mainEntity: SEARCH_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata = {
  ...buildCanonicalMetadata({
    title: SEARCH_PAGE_TITLE,
    description: SEARCH_PAGE_DESCRIPTION,
    keywords: [
      'البحث داخل ميقاتنا',
      'بحث ميقاتنا',
      'ابحث في الموقع',
      'أدوات وصفحات ميقاتنا',
      'بحث أدوات الوقت',
      'بحث مواقيت الصلاة',
      'بحث محول التاريخ',
      'بحث الحاسبات العربية',
      'البحث في مقالات ميقاتنا',
    ],
    url: `${SITE_URL}/search`,
  }),
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

function normalizeTabParam(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return VALID_TABS.has(normalized) ? normalized : 'all';
}

async function SearchDiscoveryContent({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);
  const viewModel = buildDiscoveryViewModel(query);

  return <DiscoveryWorkspace mode="search" viewModel={viewModel} initialTab={initialTab} />;
}

const SEARCH_DEFAULT_VIEW_MODEL = buildDiscoveryViewModel('');

export default function SearchPage({ searchParams }) {
  return (
    <>
      <JsonLd data={SEARCH_FAQ_SCHEMA} />
      <ErrorBoundary name="search-discovery-workspace">
        <Suspense
          fallback={<DiscoveryWorkspace mode="search" viewModel={SEARCH_DEFAULT_VIEW_MODEL} initialTab="all" />}
        >
          <SearchDiscoveryContent searchParams={searchParams} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
