import { Suspense } from 'react';
import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildDiscoveryViewModel, normalizeDiscoveryQueryValue } from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const VALID_TABS = new Set(['all', 'tools', 'articles', 'sections', 'featured']);
export const metadata = {
  ...buildCanonicalMetadata({
    title: 'البحث داخل ميقاتنا | ابحث عن أي أداة أو صفحة أو موضوع',
    description: 'ابحث داخل ميقاتنا عن أي أداة أو صفحة أو موضوع: الوقت، الصلاة، التاريخ، الحاسبات، الاقتصاد، المناسبات، والأدلة.',
    keywords: [
      'البحث داخل ميقاتنا',
      'بحث ميقاتنا',
      'ابحث في الموقع',
      'أدوات وصفحات ميقاتنا',
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

async function SearchResults({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);
  const viewModel = buildDiscoveryViewModel(query);

  return <DiscoveryWorkspace mode="search" viewModel={viewModel} initialTab={initialTab} />;
}

export default function SearchPage({ searchParams }) {
  const fallbackViewModel = buildDiscoveryViewModel('');

  return (
    <Suspense fallback={<DiscoveryWorkspace mode="search" viewModel={fallbackViewModel} initialTab="all" />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
