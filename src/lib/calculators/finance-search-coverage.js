import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';

export function buildFinancePageSearchCoverage(page, content) {
  return buildPrincipalPageSearchCoverage({
    title: page?.heroTitle || page?.title,
    description: content?.hero?.description || page?.description,
    keywords: page?.keywords || [],
    faqItems: content?.faqItems || [],
    quickAnswers: content?.quickAnswers || [],
    searchProfile: content?.searchProfile || {},
  });
}
