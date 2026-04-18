import { notFound } from 'next/navigation';

import GuidePage from '@/components/guides/GuidePage';
import { getCalculatorRouteBySlug } from '@/lib/calculators/data';
import { ALL_GUIDES, getGuideBySlug, getRelatedGuidesBySlugs } from '@/lib/guides/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();

export function generateStaticParams() {
  return ALL_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  return buildCanonicalMetadata({
    title: guide.metaTitle,
    description: guide.description,
    keywords: guide.keywords || [guide.title, guide.metaTitle],
    url: `${SITE_URL}${guide.href}`,
  });
}

export default async function GuideEntryPage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedCalculators = (guide.relatedCalculatorSlugs || [])
    .map((slug) => getCalculatorRouteBySlug(slug))
    .filter(Boolean);
  const relatedGuides = getRelatedGuidesBySlugs(guide.relatedGuideSlugs || []);
  const relatedPages = guide.relatedPageLinks || [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: guide.hubTitle || 'الأدلة', item: `${SITE_URL}${guide.hubHref || '/guides'}` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${SITE_URL}${guide.href}` },
    ],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.metaTitle || guide.title,
    description: guide.description,
    inLanguage: 'ar',
    mainEntityOfPage: `${SITE_URL}${guide.href}`,
    keywords: guide.keywords,
    about: guide.intentKeywords?.map((item) => ({
      '@type': 'Thing',
      name: item,
    })),
  };
  const howToSchema = guide.steps?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: guide.metaTitle || guide.title,
        description: guide.description,
        inLanguage: 'ar',
        step: guide.steps.map((step, index) => ({
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {howToSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      ) : null}
      <GuidePage
        guide={guide}
        relatedCalculators={relatedCalculators}
        relatedGuides={relatedGuides}
        relatedPages={relatedPages}
      />
    </>
  );
}
