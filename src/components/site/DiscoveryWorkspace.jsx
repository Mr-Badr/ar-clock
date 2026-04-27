import styles from './DiscoveryWorkspace.module.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-config';

import DiscoveryWorkspaceClient from './DiscoveryWorkspaceClient';

const SITE_URL = getSiteUrl();

function renderHeroCopy(mode, hasQuery, query) {
  if (mode === 'search' && hasQuery) {
    return {
      title: `نتائج أقرب إلى ${query}`,
      lead: 'هذه الواجهة تجمع بين البحث السريع وخريطة الموقع نفسها، حتى يرى المستخدم الصفحة الأقرب ثم المسارات المرتبطة بها داخل المنتج.',
    };
  }

  if (mode === 'search') {
    return {
      title: 'ابحث عن أي صفحة أو أداة أو دليل من مكان واحد',
      lead: 'ابحث داخل ميقاتنا عن صفحات الوقت والصلاة والتاريخ والحاسبات والاقتصاد والأدلة والمناسبات من مركز واحد.',
    };
  }

  if (hasQuery) {
    return {
      title: `فهرس الموقع مع نتائج مرتبطة بـ ${query}`,
      lead: 'النتائج هنا مبنية على نفس فهرس الصفحات والأدوات، لذلك يبقى المستخدم داخل خريطة واضحة بدل صفحة بحث معزولة.',
    };
  }

  return {
    title: 'فهرس ميقاتنا الكامل',
    lead: 'دليل بصري يربط بين الوقت، الصلاة، التاريخ، الحاسبات، الاقتصاد، المناسبات، والأدلة في صفحة واحدة قابلة للزحف والفهم السريع.',
  };
}

function buildSectionSchemaItems(routePath, sectionMap) {
  return sectionMap.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'WebPage',
      name: item.title,
      url: `${SITE_URL}${item.href}`,
      isPartOf: `${SITE_URL}${routePath}`,
      ...(item.sectionTitle ? { about: [{ '@type': 'Thing', name: item.sectionTitle }] } : {}),
    })),
  );
}

function buildSchemas({ routePath, title, description, viewModel }) {
  const { featuredItems, bestResult, hasQuery, query, searchModel, sectionMap } = viewModel;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    url: `${SITE_URL}${routePath}`,
    inLanguage: 'ar',
    description,
    hasPart: buildSectionSchemaItems(routePath, sectionMap),
  };

  const featuredItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'أهم الصفحات والأدوات داخل ميقاتنا',
    itemListElement: featuredItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: modeLabel(routePath), item: `${SITE_URL}${routePath}` },
    ],
  };

  const searchResultsSchema = hasQuery
    ? {
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        name: `نتائج البحث داخل ميقاتنا عن ${query}`,
        url: `${SITE_URL}${routePath}?q=${encodeURIComponent(query)}`,
        inLanguage: 'ar',
        about: bestResult
          ? [{
              '@type': 'Thing',
              name: bestResult.title,
            }]
          : undefined,
      }
    : null;

  const resultListSchema = hasQuery
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: searchModel.results.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          url: `${SITE_URL}${item.href}`,
        })),
      }
    : null;

  return [collectionSchema, featuredItemListSchema, breadcrumbSchema, searchResultsSchema, resultListSchema].filter(Boolean);
}

function modeLabel(routePath) {
  return routePath === '/search' ? 'البحث الذكي' : 'الفهرس';
}

export default function DiscoveryWorkspace({
  mode = 'map',
  viewModel,
  initialTab = 'all',
}) {
  const routePath = mode === 'search' ? '/search' : '/fahras';
  const heroCopy = renderHeroCopy(mode, viewModel.hasQuery, viewModel.query);
  const schemas = buildSchemas({
    routePath,
    title: heroCopy.title,
    description: heroCopy.lead,
    viewModel,
  });

  return (
    <div className={styles.stylesAnchor}>
      <JsonLd data={schemas} />
      <DiscoveryWorkspaceClient
        mode={mode}
        viewModel={viewModel}
        routePath={routePath}
        initialTab={initialTab}
      />
    </div>
  );
}
