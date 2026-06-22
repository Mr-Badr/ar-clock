import { notFound } from 'next/navigation';

import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import BlogArticleView from '@/components/blog/BlogArticleView';
import { getCalculatorRouteBySlug } from '@/lib/calculators/data';
import {
  ALL_GUIDES,
  getGuideBySlug,
  getRelatedGuidesBySlugs,
  getSuggestedGuides,
} from '@/lib/guides/data';
import { logBlogArticleFailure } from '@/lib/blog/observability';
import { countBlogArticleWords } from '@/lib/blog/read-time';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

function buildGuideIdentitySchema(name) {
  if (!name) {
    return {
      '@type': 'Organization',
      name: SITE_BRAND,
      url: SITE_URL,
    };
  }

  if (name === SITE_BRAND || name.includes('فريق')) {
    return {
      '@type': 'Organization',
      name,
      url: SITE_URL,
    };
  }

  return {
    '@type': 'Person',
    name,
  };
}

export function getBlogArticleStaticParams() {
  return ALL_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateBlogArticleMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const metadata = buildCanonicalMetadata({
    title: guide.metaTitle,
    description: guide.description,
    keywords: [...(guide.keywords || []), ...(guide.intentKeywords || [])],
    url: `${SITE_URL}${guide.href}`,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      ...(guide.publishedAt ? { publishedTime: guide.publishedAt } : {}),
      ...(guide.updatedAt ? { modifiedTime: guide.updatedAt } : {}),
      authors: [guide.authorName || SITE_BRAND],
    },
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  if (guide.contentHealth?.degraded) {
    logBlogArticleFailure('blog-article-content-normalized', {
      slug: guide.slug,
      section: 'content-model',
      degraded: true,
      contentHealth: guide.contentHealth,
      extraContext: {
        href: guide.href,
      },
    });
  }

  const faqItems = Array.isArray(guide.faqItems) ? guide.faqItems : [];
  const howToSteps = Array.isArray(guide.steps) ? guide.steps : [];
  const sourceLinks = Array.isArray(guide.sourceLinks) ? guide.sourceLinks : [];
  const authorSchema = buildGuideIdentitySchema(guide.authorName || SITE_BRAND);
  const editorSchema = guide.reviewedBy ? buildGuideIdentitySchema(guide.reviewedBy) : null;

  const relatedCalculatorSlugs = Array.isArray(guide.relatedCalculatorSlugs) ? guide.relatedCalculatorSlugs : [];
  const relatedGuideSlugs = Array.isArray(guide.relatedGuideSlugs) ? guide.relatedGuideSlugs : [];
  const relatedPages = Array.isArray(guide.relatedPageLinks) ? guide.relatedPageLinks : [];
  const relatedCalculators = relatedCalculatorSlugs
    .map((itemSlug) => getCalculatorRouteBySlug(itemSlug))
    .filter(Boolean);
  const relatedGuides = getRelatedGuidesBySlugs(relatedGuideSlugs);
  const topicGuides = getSuggestedGuides(guide, 4);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'المدونة', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}${guide.href}` },
    ],
  };
  const faqSchema = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: guide.metaTitle || guide.title,
    alternativeHeadline: guide.title,
    description: guide.description,
    inLanguage: 'ar',
    mainEntityOfPage: `${SITE_URL}${guide.href}`,
    keywords: guide.keywords,
    wordCount: countBlogArticleWords(guide),
    articleSection: guide.category || guide.cluster || guide.hubTitle || 'المدونة العربية',
    ...(guide.publishedAt ? { datePublished: guide.publishedAt } : {}),
    ...(guide.updatedAt ? { dateModified: guide.updatedAt } : {}),
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'مدونة ميقاتنا',
      url: `${SITE_URL}/blog`,
    },
    isAccessibleForFree: true,
    audience: {
      '@type': 'Audience',
      audienceType: guide.hubTitle || 'من يريد شرحاً عربياً عملياً وواضحاً',
    },
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: SITE_BRAND,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
    ...(editorSchema ? { editor: editorSchema } : {}),
    ...(sourceLinks.length ? { citation: sourceLinks.map((item) => item.href) } : {}),
    about: guide.intentKeywords?.map((item) => ({
      '@type': 'Thing',
      name: item,
    })),
  };
  const topicListSchema = topicGuides.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: guide.hubTitle
          ? `مسار قراءة يكمل ${guide.hubTitle}`
          : 'مسار قراءة يكمل هذا المقال',
        itemListElement: topicGuides.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `${SITE_URL}${item.href}`,
        })),
      }
    : null;
  const howToSchema = howToSteps.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: guide.metaTitle || guide.title,
        description: guide.description,
        inLanguage: 'ar',
        step: howToSteps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: step.title,
          text: step.description,
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {topicListSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(topicListSchema) }} />
      ) : null}
      {howToSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      ) : null}
      <AdLayoutWrapper sidebarMode="dual">
        <BlogArticleView
          guide={guide}
          relatedCalculators={relatedCalculators}
          relatedGuides={relatedGuides}
          topicGuides={topicGuides}
          relatedPages={relatedPages}
        />
      </AdLayoutWrapper>
    </>
  );
}
