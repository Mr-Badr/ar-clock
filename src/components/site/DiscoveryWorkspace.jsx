import Link from 'next/link';
import styles from './DiscoveryWorkspace.module.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-config';

import DiscoveryWorkspaceClient from './DiscoveryWorkspaceClient';

const SITE_URL = getSiteUrl();

function renderHeroCopy(mode, hasQuery, query) {
  if (mode === 'search' && hasQuery) {
    return {
      title: `نتائج أقرب إلى ${query}`,
      lead: 'ابدأ من الصفحة الأقرب لسؤالك، ثم انتقل إلى أداة للحساب أو مقال يشرح السياق إذا احتجت إلى فهم أعمق قبل القرار.',
    };
  }

  if (mode === 'search') {
    return {
      title: 'ابحث عن أي صفحة أو أداة أو مقال من مكان واحد',
      lead: 'ابحث داخل ميقاتنا بصيغة السؤال التي تستخدمها فعلاً: وقت مدينة، صلاة اليوم، تحويل تاريخ، حاسبة، مناسبة، أو مقال يشرح الفكرة.',
    };
  }

  if (hasQuery) {
    return {
      title: `صفحات مرتبطة بـ ${query}`,
      lead: 'هذه الصفحة تجمع لك أقرب النتائج والمسارات التي تكملها حتى تصل إلى الصفحة المناسبة من أول مرة.',
    };
  }

  return {
    title: 'فهرس ميقاتنا للوصول إلى الأداة أو المقال من أول مرة',
    lead: 'ابدأ من نيتك الآن: نتيجة سريعة، شرح قبل القرار، أو قسم يجمع المسارات القريبة. الفهرس يربط الوقت والصلاة والتاريخ والحاسبات والمناسبات والمدونة دون أن يحوّلها إلى قائمة مربكة.',
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
  return routePath === '/search' ? 'البحث' : 'استكشف الصفحات';
}

const FAHRAS_CATEGORIES = [
  { cat: 'time',        emoji: '⏰', title: 'الوقت الآن',         desc: '196 دولة · ساعة حية',         href: '/time-now' },
  { cat: 'prayer',      emoji: '🕌', title: 'مواقيت الصلاة',      desc: '5 أوقات + اتجاه القبلة',       href: '/mwaqit-al-salat' },
  { cat: 'date',        emoji: '📅', title: 'التاريخ والتقويم',   desc: 'هجري · ميلادي · تحويل',        href: '/date' },
  { cat: 'calculators', emoji: '🧮', title: 'الحاسبات',           desc: '58+ أداة مالية ومعيشية',        href: '/calculators' },
  { cat: 'holidays',    emoji: '🎉', title: 'المناسبات والأعياد', desc: 'عداد تنازلي لكل مناسبة',        href: '/holidays' },
  { cat: 'blog',        emoji: '📝', title: 'المدونة',            desc: 'مقالات وشروحات معمّقة',         href: '/blog' },
];

function FahraCategoryHub() {
  return (
    <nav aria-label="أقسام الموقع الرئيسية" className={styles.catHub}>
      <div className={styles.catGrid}>
        {FAHRAS_CATEGORIES.map(({ cat, emoji, title, desc, href }) => (
          <Link key={cat} href={href} className={styles.catCard} data-cat={cat}>
            <span className={styles.catIcon} aria-hidden="true">{emoji}</span>
            <span className={styles.catCopy}>
              <strong>{title}</strong>
              <span>{desc}</span>
            </span>
            <svg className={styles.catArrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default function DiscoveryWorkspace({
  mode,
  viewModel,
  initialTab,
}) {
  const resolvedMode = mode ?? 'map';
  const resolvedInitialTab = initialTab ?? 'all';
  const routePath = resolvedMode === 'search' ? '/search' : '/fahras';
  const heroCopy = renderHeroCopy(resolvedMode, viewModel.hasQuery, viewModel.query);
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
        mode={resolvedMode}
        viewModel={viewModel}
        routePath={routePath}
        initialTab={resolvedInitialTab}
      >
        {resolvedMode === 'map' && !viewModel.hasQuery && <FahraCategoryHub />}
      </DiscoveryWorkspaceClient>
    </div>
  );
}
