import { Suspense } from 'react';
import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildDiscoveryViewModel,
  normalizeDiscoveryQueryValue,
  POPULAR_SITE_SEARCHES,
} from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const VALID_TABS = new Set(['all', 'tools', 'articles', 'sections', 'featured']);

const BASE_KEYWORDS = [
  'فهرس ميقاتنا',
  'خريطة ميقاتنا',
  'مسارات ميقاتنا',
  'أدوات ميقاتنا',
  'كل أدوات الموقع',
  ...POPULAR_SITE_SEARCHES.slice(0, 14),
];

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);

  return {
    ...buildCanonicalMetadata({
      title: query
        ? `نتائج البحث عن ${query} داخل فهرس ميقاتنا`
        : 'فهرس ميقاتنا | خريطة واضحة لكل الأدوات والمسارات الرئيسية',
      description: query
        ? `نتائج مرتبطة بعبارة ${query} داخل فهرس ميقاتنا، مع روابط لأقرب الأدوات والصفحات والمقالات المرتبطة بها.`
        : 'خريطة ميقاتنا الكاملة: الوقت، الصلاة، التاريخ، الحاسبات، الاقتصاد، المناسبات، والأدلة في صفحة واحدة واضحة وسريعة.',
      keywords: BASE_KEYWORDS,
      url: `${SITE_URL}/fahras`,
    }),
    robots: query
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
  };
}

function normalizeTabParam(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return VALID_TABS.has(normalized) ? normalized : 'all';
}

async function FahrasContent({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);
  const viewModel = buildDiscoveryViewModel(query);

  return <DiscoveryWorkspace mode="map" viewModel={viewModel} initialTab={initialTab} />;
}

export default function FahrasPage({ searchParams }) {
  const fallbackViewModel = buildDiscoveryViewModel('');

  return (
    <Suspense fallback={<DiscoveryWorkspace mode="map" viewModel={fallbackViewModel} initialTab="all" />}>
      <FahrasContent searchParams={searchParams} />
    </Suspense>
  );
}
