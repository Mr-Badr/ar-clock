'use client';

import Link from 'next/link';
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpenText,
  BriefcaseBusiness,
  CalendarDays,
  Calculator,
  ChartNoAxesCombined,
  Clock3,
  Compass,
  FileText,
  Landmark,
  LayoutGrid,
  LayoutList,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DISCOVERY_RECENT_SEARCHES_KEY,
  DISCOVERY_RECENT_VISITS_KEY,
  getDiscoveryIconKey,
  pushDiscoveryHistory,
  readDiscoveryHistory,
} from '@/lib/site/discovery-history';
import { navigateToDiscoveryHref } from '@/lib/site/discovery-navigation';
import { OPEN_DISCOVERY_SEARCH_EVENT } from '@/lib/site/discovery-events';

import styles from './DiscoveryWorkspace.module.css';

const SECTION_ICONS = {
  time: Clock3,
  'calculators-hubs': LayoutList,
  'calculators-tools': Calculator,
  economy: ChartNoAxesCombined,
  guides: BookOpenText,
  holidays: PartyPopper,
  company: ShieldCheck,
};

const TYPE_ICONS = {
  tool: Calculator,
  article: BookOpenText,
  page: FileText,
  section: LayoutGrid,
};

const VISIT_ICONS = {
  calculator: Calculator,
  economy: ChartNoAxesCombined,
  guide: BookOpenText,
  holiday: PartyPopper,
  date: CalendarDays,
  prayer: Landmark,
  difference: Compass,
  clock: Clock3,
  page: BriefcaseBusiness,
};

const FILTER_TABS = [
  {
    id: 'all',
    label: 'الكل',
    description: 'عرض خريطة الموقع كاملة بكل المسارات والأدوات والمقالات.',
    shortDescription: 'كل المسارات',
    Icon: LayoutGrid,
  },
  {
    id: 'tools',
    label: 'أدوات',
    description: 'الحاسبات والأدوات العملية ذات النية البحثية المباشرة.',
    shortDescription: 'الأدوات العملية',
    Icon: Calculator,
  },
  {
    id: 'articles',
    label: 'مقالات',
    description: 'الأدلة والمقالات الشارحة التي تدعم القرار قبل استخدام الأداة.',
    shortDescription: 'الأدلة والمقالات',
    Icon: BookOpenText,
  },
  {
    id: 'sections',
    label: 'أقسام',
    description: 'الصفحات العليا التي تشرح بنية الموقع وتربط بين المسارات.',
    shortDescription: 'الصفحات العليا',
    Icon: LayoutList,
  },
  {
    id: 'featured',
    label: 'الأكثر',
    description: 'الصفحات الأعلى قيمة في الاكتشاف الداخلي والبحث اليومي.',
    shortDescription: 'المسارات الأهم',
    Icon: Star,
  },
];

function normalizeTab(value) {
  return FILTER_TABS.some((tab) => tab.id === value) ? value : 'all';
}

function isSectionLike(item) {
  return item.kind === 'section' || item.kind === 'page';
}

function matchesTab(item, tab, featuredHrefSet) {
  if (tab === 'all') return true;
  if (tab === 'tools') return item.kind === 'tool';
  if (tab === 'articles') return item.kind === 'article';
  if (tab === 'sections') return isSectionLike(item);
  if (tab === 'featured') return featuredHrefSet.has(item.href);
  return true;
}

function getMetricCount(allItems, featuredItems, tab) {
  const featuredHrefSet = new Set(featuredItems.map((item) => item.href));
  return allItems.filter((item) => matchesTab(item, tab, featuredHrefSet)).length;
}

function getCountLabel(sectionId) {
  if (sectionId === 'guides') return 'مقال';
  if (sectionId === 'calculators-hubs') return 'مسار';
  if (sectionId === 'company') return 'صفحة';
  return 'رابط';
}

function getItemIcon(item) {
  return SECTION_ICONS[item.sectionId] || TYPE_ICONS[item.kind] || BriefcaseBusiness;
}

function getVisitIcon(entry) {
  return VISIT_ICONS[getDiscoveryIconKey(entry?.href || '')] || BriefcaseBusiness;
}

function getItemMetaLabel(item) {
  if (item.badge) return item.badge;
  if (item.kind === 'tool') return 'أداة';
  if (item.kind === 'article') return 'مقال';
  if (item.kind === 'section') return 'قسم';
  if (item.kind === 'page') return 'صفحة';
  return item.sectionTitle || 'رابط';
}

function groupPaletteResults(items = []) {
  return [
    { id: 'pages', title: 'صفحات', items: items.filter((item) => isSectionLike(item)) },
    { id: 'tools', title: 'أدوات', items: items.filter((item) => item.kind === 'tool') },
    { id: 'articles', title: 'مقالات', items: items.filter((item) => item.kind === 'article') },
  ].filter((group) => group.items.length);
}

function renderHeroCopy(mode, hasQuery, query) {
  if (mode === 'search' && hasQuery) {
    return {
      eyebrow: 'البحث الذكي داخل ميقاتنا',
      title: `نتائج أقرب إلى ${query}`,
      lead: 'هذه الواجهة تجمع بين البحث السريع وخريطة الموقع نفسها، حتى ترى الصفحة الأقرب لسؤالك ثم المسارات المرتبطة بها داخل المنتج.',
    };
  }

  if (mode === 'search') {
    return {
      eyebrow: 'البحث الذكي داخل ميقاتنا',
      title: 'ابحث عن أي صفحة أو أداة أو دليل من مكان واحد',
      lead: 'اكتب كما يتحدث الناس فعلاً: كم عمري، هل الذهب مفتوح الآن، أو كيف أحول التاريخ. سنعطيك الصفحة الأقرب ثم الروابط المكملة حولها.',
    };
  }

  if (hasQuery) {
    return {
      eyebrow: 'فهرس ميقاتنا + نتائج مترابطة',
      title: `فهرس الموقع مع نتائج مرتبطة بـ ${query}`,
      lead: 'النتائج هنا تُبنى على نفس فهرس الصفحات والأدوات، لذلك يبقى المستخدم داخل خريطة واضحة بدل أن ينتهي في صفحة منفصلة ومعزولة.',
    };
  }

  return {
    eyebrow: 'فهرس ميقاتنا',
    title: 'لوحة واحدة توضّح بنية الموقع بالكامل خلال ثوانٍ',
    lead: 'الفهرس هنا ليس قائمة HTML طويلة، بل دليل بصري يربط بين الوقت، الصلاة، التاريخ، الحاسبات، الاقتصاد، المناسبات، والأدلة في تجربة أوضح وأسهل للمستخدم ولمحركات البحث.',
  };
}

function buildBreadcrumbItems(activeSectionTitle, hasQuery, basePath) {
  return [
    { label: 'الرئيسية', href: '/' },
    { label: basePath === '/search' ? 'البحث الذكي' : 'الفهرس', href: basePath },
    { label: hasQuery ? 'نتائج البحث' : activeSectionTitle || 'خريطة الموقع' },
  ];
}

function buildFilteredSections(sectionMap, activeTab, featuredItems) {
  const featuredHrefSet = new Set(featuredItems.map((item) => item.href));

  return sectionMap
    .map((section) => {
      const filteredItems = section.items.filter((item) => matchesTab(item, activeTab, featuredHrefSet));

      return {
        ...section,
        filteredItems,
        sectionCards: filteredItems.slice(0, 3),
        quietItems: filteredItems.slice(3),
      };
    })
    .filter((section) => section.filteredItems.length);
}

function getDefaultOpenSections(sections, { limit = 2 } = {}) {
  return sections.slice(0, limit).map((section) => section.id);
}

function getActiveTabConfig(activeTab) {
  return FILTER_TABS.find((tab) => tab.id === activeTab) || FILTER_TABS[0];
}

function buildDiscoveryHref(pathname, query, tab) {
  return updatePathParams(pathname, '', {
    q: query || '',
    tab: tab === 'all' ? '' : tab,
  });
}

function updatePathParams(pathname, searchParams, nextParams) {
  const params = new URLSearchParams(searchParams?.toString() || '');

  Object.entries(nextParams).forEach(([key, value]) => {
    if (!value) params.delete(key);
    else params.set(key, value);
  });

  const nextQuery = params.toString();
  return nextQuery ? `${pathname}?${nextQuery}` : pathname;
}

function DirectoryCard({ item, accentId, onVisit }) {
  const Icon = getItemIcon(item);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={styles.directoryCard}
          data-tone={accentId}
          onClick={() => onVisit?.(item)}
        >
          <span className={styles.directoryCardIcon}>
            <Icon size={18} />
          </span>
          <div className={styles.directoryCardCopy}>
            <strong>{item.title}</strong>
            <span>{getItemMetaLabel(item)}</span>
          </div>
          <ArrowLeft size={16} className={styles.directoryArrow} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className={styles.tooltipContent}>
        {item.description}
      </TooltipContent>
    </Tooltip>
  );
}

function CompactItemRow({ item, accentId, onVisit }) {
  const Icon = getItemIcon(item);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={styles.compactRow}
          data-tone={accentId}
          onClick={() => onVisit?.(item)}
        >
          <span className={styles.compactRowIcon}>
            <Icon size={16} />
          </span>
          <span className={styles.compactRowTitle}>{item.title}</span>
          <span className={styles.compactRowMeta}>{getItemMetaLabel(item)}</span>
          <ArrowLeft size={15} className={styles.compactRowArrow} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className={styles.tooltipContent}>
        {item.description}
      </TooltipContent>
    </Tooltip>
  );
}

export default function DiscoveryWorkspaceClient({
  mode = 'map',
  viewModel,
  routePath,
  initialTab = 'all',
}) {
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState(viewModel.query || '');
  const [activeTab, setActiveTab] = useState(normalizeTab(initialTab));
  const [openSections, setOpenSections] = useState(() => getDefaultOpenSections(viewModel.sectionMap));
  const [activeSectionId, setActiveSectionId] = useState(viewModel.sectionMap[0]?.id || '');
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);

  const discoveryPath = routePath || (mode === 'search' ? '/search' : '/fahras');
  const deferredPaletteQuery = useDeferredValue(paletteQuery);
  const heroCopy = renderHeroCopy(mode, viewModel.hasQuery, viewModel.query);
  const calculatorItemsCount = viewModel.allItems.filter((item) => item.href.startsWith('/calculators/')).length;
  const featuredHrefSet = useMemo(
    () => new Set(viewModel.featuredItems.map((item) => item.href)),
    [viewModel.featuredItems],
  );
  const filteredSections = useMemo(
    () => buildFilteredSections(viewModel.sectionMap, activeTab, viewModel.featuredItems),
    [activeTab, viewModel.sectionMap, viewModel.featuredItems],
  );
  const searchResults = useMemo(
    () => viewModel.searchModel.results.filter((item) => matchesTab(item, activeTab, featuredHrefSet)),
    [activeTab, featuredHrefSet, viewModel.searchModel.results],
  );
  const paletteModel = useMemo(() => {
    if (!paletteOpen || !deferredPaletteQuery) {
      return { normalizedQuery: '', results: [] };
    }
    return searchDirectoryIndex(viewModel.allItems, deferredPaletteQuery, { limit: 24 });
  }, [deferredPaletteQuery, paletteOpen, viewModel.allItems]);
  const paletteGroups = useMemo(() => groupPaletteResults(paletteModel.results), [paletteModel.results]);
  const activeTabConfig = useMemo(() => getActiveTabConfig(activeTab), [activeTab]);
  const activeSectionTitle = filteredSections.find((section) => section.id === activeSectionId)?.title;
  const breadcrumbItems = useMemo(
    () => buildBreadcrumbItems(activeSectionTitle, viewModel.hasQuery, discoveryPath),
    [activeSectionTitle, discoveryPath, viewModel.hasQuery],
  );

  useEffect(() => {
    setActiveTab(normalizeTab(initialTab));
  }, [initialTab]);

  useEffect(() => {
    setRecentSearches(readDiscoveryHistory(DISCOVERY_RECENT_SEARCHES_KEY));
    setRecentVisits(
      readDiscoveryHistory(DISCOVERY_RECENT_VISITS_KEY).filter(
        (item) => item?.href && item.href !== '/fahras' && item.href !== '/search',
      ),
    );
  }, [discoveryPath, activeTab, paletteOpen, viewModel.query]);

  useEffect(() => {
    setOpenSections(getDefaultOpenSections(filteredSections));
    setActiveSectionId(filteredSections[0]?.id || '');
  }, [filteredSections]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    const handleExternalOpen = () => setPaletteOpen(true);
    window.addEventListener(OPEN_DISCOVERY_SEARCH_EVENT, handleExternalOpen);
    return () => window.removeEventListener(OPEN_DISCOVERY_SEARCH_EVENT, handleExternalOpen);
  }, []);

  useEffect(() => {
    if (!filteredSections.length || typeof IntersectionObserver === 'undefined') return undefined;

    const nodes = filteredSections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSectionId((current) => (
            current === visibleEntry.target.id ? current : visibleEntry.target.id
          ));
        }
      },
      {
        rootMargin: '-14% 0px -68% 0px',
        threshold: [0.2],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filteredSections]);

  function handleTabChange(nextTab) {
    const normalizedTab = normalizeTab(nextTab);
    if (normalizedTab === activeTab) return;

    const nextHref = buildDiscoveryHref(discoveryPath, viewModel.query, normalizedTab);
    setActiveTab(normalizedTab);

    if (typeof window !== 'undefined') {
      const currentHref = `${window.location.pathname}${window.location.search}`;
      if (currentHref === nextHref) return;
    }

    startTransition(() => {
      router.replace(nextHref, { scroll: false });
    });
  }

  function rememberSearch(query) {
    const normalized = normalizeDiscoveryQueryValue(query);
    if (!normalized) return;

    const nextEntries = pushDiscoveryHistory(
      DISCOVERY_RECENT_SEARCHES_KEY,
      { value: normalized },
      { max: 6, idKey: 'value' },
    );
    setRecentSearches(nextEntries);
  }

  function handleVisit(item) {
    if (!item?.href) return;

    setRecentVisits(
      readDiscoveryHistory(DISCOVERY_RECENT_VISITS_KEY).filter(
        (entry) => entry?.href && entry.href !== '/fahras' && entry.href !== '/search',
      ),
    );
  }

  function handleResultNavigation(href, title) {
    if (deferredPaletteQuery) {
      rememberSearch(deferredPaletteQuery);
    }
    setPaletteOpen(false);

    const didNavigate = navigateToDiscoveryHref({
      router,
      rawHref: href,
      source: 'discovery-workspace-palette',
      context: {
        title: title || null,
        discoveryPath,
        activeTab,
        deferredPaletteQuery: deferredPaletteQuery || null,
      },
    });

    if (didNavigate && title) {
      handleVisit({ href, title });
    }
  }

  function handleShowSearchView(query) {
    const normalized = normalizeDiscoveryQueryValue(query);
    rememberSearch(normalized);
    setPaletteOpen(false);

    const nextHref = buildDiscoveryHref(discoveryPath, normalized, activeTab);
    navigateToDiscoveryHref({
      router,
      rawHref: nextHref,
      source: 'discovery-workspace-search-view',
      context: {
        discoveryPath,
        activeTab,
        query: normalized,
      },
    });
  }

  const tabCounts = {
    all: viewModel.allItems.length,
    tools: getMetricCount(viewModel.allItems, viewModel.featuredItems, 'tools'),
    articles: getMetricCount(viewModel.allItems, viewModel.featuredItems, 'articles'),
    sections: getMetricCount(viewModel.allItems, viewModel.featuredItems, 'sections'),
    featured: viewModel.featuredItems.length,
  };

  return (
    <TooltipProvider delayDuration={160}>
      <main className={styles.page}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <span key={`${item.label}-${index}`} className={styles.breadcrumbItem}>
                {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
                {index < breadcrumbItems.length - 1 ? <span className={styles.breadcrumbDivider}>/</span> : null}
              </span>
            ))}
          </nav>

          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>
                <Sparkles size={15} />
                {heroCopy.eyebrow}
              </span>
              <h1 className={styles.title}>{heroCopy.title}</h1>
              <p className={styles.lead}>{heroCopy.lead}</p>

              <button type="button" className={styles.searchTrigger} onClick={() => setPaletteOpen(true)}>
                <span className={styles.searchTriggerIcon}>
                  <Search size={18} />
                </span>
                <span className={styles.searchTriggerCopy}>
                  <strong>{viewModel.query || 'ابحث عن أي صفحة أو أداة أو دليل...'}</strong>
                  <span>يفتح بحثاً سريعاً يجمع الصفحات والأدوات والمقالات في نافذة واحدة</span>
                </span>
                <span className={styles.searchTriggerHint}>⌘K / Ctrl K</span>
              </button>

            </div>

            <div className={styles.heroAside}>
              <div className={styles.metricsGrid}>
                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricBody}>
                    <span>المسارات الرئيسية</span>
                    <strong>{viewModel.sectionCounts.sections}</strong>
                  </CardContent>
                </Card>
                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricBody}>
                    <span>صفحات وأدوات مفهرسة</span>
                    <strong>{viewModel.allItems.length}+</strong>
                  </CardContent>
                </Card>
                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricBody}>
                    <span>الحاسبات المغطاة</span>
                    <strong>{calculatorItemsCount}</strong>
                  </CardContent>
                </Card>
                <Card className={styles.metricCard}>
                  <CardContent className={styles.metricBody}>
                    <span>الأدلة والمقالات</span>
                    <strong>{viewModel.sectionCounts.guides}</strong>
                  </CardContent>
                </Card>
              </div>

              <Card className={styles.featuredPanel}>
                <CardHeader className={styles.panelHeader}>
                  <CardTitle className={styles.panelTitle}>
                    <Star size={16} />
                    {viewModel.bestResult ? 'أفضل نتيجة الآن' : 'ابدأ من هذه المسارات'}
                  </CardTitle>
                </CardHeader>
                <CardContent className={styles.panelBody}>
                  {(viewModel.bestResult ? [viewModel.bestResult] : viewModel.featuredItems.slice(0, 4)).map((item) => (
                    <DirectoryCard key={item.href} item={item} accentId={item.sectionId} onVisit={handleVisit} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          <section className={styles.recentStrip}>
            <div className={styles.stripHeader}>
              <span className={styles.stripEyebrow}>
                <TrendingUp size={15} />
                آخر ما زرت
              </span>
              <span className={styles.stripMeta}>{Math.min(recentVisits.length, 5)} من آخر الصفحات</span>
            </div>
            <div className={styles.recentChips}>
              {(recentVisits.length ? recentVisits.slice(0, 5) : viewModel.featuredItems.slice(0, 5)).map((item) => {
                const Icon = recentVisits.length ? getVisitIcon(item) : getItemIcon(item);
                const href = item.href;
                const label = item.title || item.label || 'صفحة';

                return (
                  <Link key={`${href}-${label}`} href={href} className={styles.recentChip}>
                    <Icon size={15} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={styles.controlBar}>
            <div className={styles.controlHeader}>
              <div className={styles.controlHeaderMain}>
                <span className={styles.stripEyebrow}>
                  <LayoutGrid size={15} />
                  تصفح حسب النوع
                </span>
                <h2 className={styles.controlTitle}>اختر منظور التصفح الأنسب لك ثم ادخل إلى العمق</h2>
                <p className={styles.controlLead}>
                  بدلاً من قائمة واحدة طويلة، تستطيع الآن تضييق العرض إلى أدوات أو مقالات أو أقسام أو المسارات الأكثر قيمة.
                </p>
              </div>

              <div className={styles.controlHeaderStat} data-tab={activeTabConfig.id}>
                <span className={styles.controlHeaderStatLabel}>العرض الحالي</span>
                <strong className={styles.controlHeaderStatValue}>{activeTabConfig.label}</strong>
                <span className={styles.controlHeaderStatHint}>{tabCounts[activeTabConfig.id]} عنصر جاهز للتصفح الآن</span>
              </div>
            </div>

            <div className={styles.tabsFrame}>
              <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabsRoot}>
                <TabsList className={styles.tabsList}>
                {FILTER_TABS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className={styles.tabTrigger} data-tab={tab.id}>
                    <span className={styles.tabTriggerInner}>
                      <span className={styles.tabTriggerTop}>
                        <span className={styles.tabIcon}>
                          <tab.Icon size={15} />
                        </span>
                        <span className={styles.tabCount}>{tabCounts[tab.id]}</span>
                      </span>
                      <span className={styles.tabLabelGroup}>
                        <strong>{tab.label}</strong>
                        <span>{tab.shortDescription}</span>
                      </span>
                    </span>
                  </TabsTrigger>
                ))}
                </TabsList>
              </Tabs>
            </div>

            <div className={styles.tabSummary} data-tab={activeTabConfig.id}>
              <span className={styles.tabSummaryIcon}>
                <activeTabConfig.Icon size={16} />
              </span>
              <div className={styles.tabSummaryCopy}>
                <strong>{activeTabConfig.label}</strong>
                <span>{activeTabConfig.description}</span>
              </div>
              <span className={styles.tabSummaryCount}>{tabCounts[activeTabConfig.id]} عنصر</span>
            </div>
          </section>

          <section className={styles.sectionOverview}>
            <div className={styles.sectionOverviewHead}>
              <div>
                <span className={styles.stripEyebrow}>
                  <Compass size={15} />
                  خريطة سريعة
                </span>
                <h2 className={styles.sectionOverviewTitle}>افهم بنية الموقع قبل أن تدخل إلى التفاصيل</h2>
              </div>
            </div>

            <div className={styles.sectionOverviewGrid}>
              {filteredSections.map((section) => {
                const Icon = SECTION_ICONS[section.id] || BriefcaseBusiness;

                return (
                  <a key={section.id} href={`#${section.id}`} className={styles.sectionOverviewCard} data-tone={section.id}>
                    <span className={styles.sectionOverviewIcon}>
                      <Icon size={18} />
                    </span>
                    <strong>{section.title}</strong>
                    <span>{section.filteredItems.length} {getCountLabel(section.id)}</span>
                  </a>
                );
              })}
            </div>
          </section>

          {viewModel.hasQuery ? (
            <section className={styles.resultsZone}>
              <div className={styles.zoneHead}>
                <div>
                  <span className={styles.stripEyebrow}>
                    <Search size={15} />
                    نتائج مرتبطة
                  </span>
                  <h2 className={styles.zoneTitle}>النتائج الأقرب لعبارة البحث الحالية</h2>
                </div>
                <span className={styles.zoneMeta}>{searchResults.length} نتيجة مناسبة</span>
              </div>

              <div className={styles.resultsGrid}>
                {searchResults.slice(0, 9).map((item) => (
                  <DirectoryCard key={item.href} item={item} accentId={item.sectionId} onVisit={handleVisit} />
                ))}
              </div>
            </section>
          ) : null}

          <div className={styles.contentLayout}>
            <div className={styles.contentMain}>
              <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className={styles.sectionAccordion}>
                {filteredSections.map((section) => {
                  const Icon = SECTION_ICONS[section.id] || BriefcaseBusiness;

                  return (
                    <AccordionItem key={section.id} value={section.id} id={section.id} className={styles.sectionItem} data-tone={section.id}>
                      <AccordionTrigger className={styles.sectionTrigger}>
                        <div className={styles.sectionTriggerCopy}>
                          <span className={styles.sectionBadge}>
                            <Icon size={16} />
                            {section.title}
                          </span>
                          <div>
                            <h3 className={styles.sectionTitle}>{section.title}</h3>
                            <p className={styles.sectionDescription}>{section.description}</p>
                          </div>
                        </div>
                        <span className={styles.sectionCount}>{section.filteredItems.length} {getCountLabel(section.id)}</span>
                      </AccordionTrigger>

                      <AccordionContent className={styles.sectionContent}>
                        {openSections.includes(section.id) ? (
                          <>
                            <div className={styles.primaryCardGrid}>
                              {section.sectionCards.map((item) => (
                                <DirectoryCard key={item.href} item={item} accentId={section.id} onVisit={handleVisit} />
                              ))}
                            </div>

                            {section.quietItems.length ? (
                              <div className={styles.compactGrid}>
                                {section.quietItems.map((item) => (
                                  <CompactItemRow key={item.href} item={item} accentId={section.id} onVisit={handleVisit} />
                                ))}
                              </div>
                            ) : null}
                          </>
                        ) : null}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sidebarCard}>
                <div className={styles.sidebarHead}>
                  <span className={styles.stripEyebrow}>
                    <Compass size={15} />
                    جدول المحتوى
                  </span>
                  <p className={styles.sidebarLead}>يتحرك المؤشر معك أثناء التمرير حتى تعرف أين أنت داخل الفهرس الآن.</p>
                </div>
                <nav className={styles.tocList} aria-label="أقسام الفهرس">
                  {filteredSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`${styles.tocLink} ${activeSectionId === section.id ? styles.tocLinkActive : ''}`}
                    >
                      <span>{section.title}</span>
                      <span>{section.filteredItems.length}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </div>
        </div>

        <CommandDialog
          open={paletteOpen}
          onOpenChange={setPaletteOpen}
          shouldFilter={false}
          showCloseButton={false}
          contentClassName={styles.commandDialog}
          title="البحث الذكي داخل الفهرس"
          description="ابحث داخل صفحات ميقاتنا وأدواته ومقالاته من لوحة واحدة."
        >
          <CommandInput
            value={paletteQuery}
            onValueChange={setPaletteQuery}
            placeholder="ابحث عن صفحة أو أداة أو دليل..."
            className={styles.commandInput}
            wrapperClassName={styles.commandInputWrap}
          />

          <CommandList className={styles.commandList}>
            {deferredPaletteQuery ? (
              <>
                <CommandGroup heading="إجراء سريع">
                  <CommandItem onSelect={() => handleShowSearchView(deferredPaletteQuery)} className={styles.commandActionItem}>
                    <Search size={16} />
                    <span>اعرض كل النتائج داخل الفهرس</span>
                    <CommandShortcut>Enter</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />

                {paletteGroups.map((group) => (
                  <CommandGroup key={group.id} heading={group.title}>
                    {group.items.map((item) => {
                      const Icon = getItemIcon(item);

                      return (
                        <CommandItem
                          key={`${group.id}-${item.href}`}
                          value={`${item.title} ${item.searchQueries.join(' ')}`}
                          onSelect={() => handleResultNavigation(item.href, item.title)}
                          className={styles.commandResultItem}
                        >
                          <span className={styles.commandResultIcon}>
                            <Icon size={16} />
                          </span>
                          <div className={styles.commandResultCopy}>
                            <strong>{item.title}</strong>
                            <span>{getItemMetaLabel(item)}</span>
                          </div>
                          <CommandShortcut>{group.title}</CommandShortcut>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
                <CommandEmpty>لا توجد نتائج مطابقة. جرّب عبارة أقصر أو افتح أحد الأقسام مباشرة.</CommandEmpty>
              </>
            ) : (
              <div className={styles.commandEmptyState}>
                {recentSearches.length ? (
                  <div className={styles.commandBlock}>
                    <h3>عمليات البحث الأخيرة</h3>
                    <div className={styles.commandPillRow}>
                      {recentSearches.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          className={styles.commandPill}
                          onClick={() => setPaletteQuery(item.value)}
                        >
                          {item.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={styles.commandBlock}>
                  <h3>اختصارات سريعة</h3>
                  <div className={styles.commandShortcutList}>
                    {(recentVisits.length ? recentVisits : viewModel.featuredItems).slice(0, 5).map((item) => {
                      const Icon = recentVisits.length ? getVisitIcon(item) : getItemIcon(item);
                      const label = item.title || 'صفحة';

                      return (
                        <button
                          key={`${item.href}-${label}`}
                          type="button"
                          className={styles.commandShortcutCard}
                          onClick={() => handleResultNavigation(item.href, label)}
                        >
                          <Icon size={16} />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.commandBlock}>
                  <h3>تصفح حسب القسم</h3>
                  <div className={styles.commandPillRow}>
                    {FILTER_TABS.filter((tab) => tab.id !== 'all').map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={styles.commandPill}
                        onClick={() => {
                          setPaletteOpen(false);
                          handleTabChange(tab.id);
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CommandList>
        </CommandDialog>
      </main>
    </TooltipProvider>
  );
}

function normalizeArabicDigits(value) {
  return String(value || '')
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)));
}

function normalizeSearchText(value) {
  return normalizeArabicDigits(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0640]/g, '')
    .replace(/[\u0610-\u061a\u064b-\u065f\u06d6-\u06ed]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ؤ]/g, 'و')
    .replace(/[ئ]/g, 'ي')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[^\p{L}\p{N}\s/-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDiscoveryQueryValue(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

function keepTokens(tokens) {
  return tokens.filter(Boolean);
}

function tokenize(value) {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

function addTokenVariant(variants, tokens) {
  const phrase = keepTokens(tokens).join(' ').trim();
  if (phrase.length >= 2) variants.add(phrase);
}

function buildPhraseVariants(value) {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];

  const tokens = tokenize(normalized);
  const variants = new Set([normalized]);
  addTokenVariant(variants, tokens);
  addTokenVariant(variants, tokens.filter((token) => token.length > 2));
  addTokenVariant(variants, tokens.map((token) => (token.startsWith('ال') ? token.slice(2) : token)));

  return Array.from(variants);
}

function scoreTextVariants(value, variants, { exact = 0, includes = 0, reverseIncludes = 0 } = {}) {
  if (!value) return 0;

  let best = 0;
  for (const variant of variants) {
    if (!variant) continue;
    if (value === variant) {
      best = Math.max(best, exact);
      continue;
    }
    if (value.includes(variant)) {
      best = Math.max(best, includes);
      continue;
    }
    if (reverseIncludes && variant.length >= 4 && variant.includes(value)) {
      best = Math.max(best, reverseIncludes);
    }
  }

  return best;
}

function scoreQueryGroup(values, variants, scores) {
  return (values || []).reduce(
    (best, value) => Math.max(best, scoreTextVariants(value, variants, scores)),
    0,
  );
}

function countSharedTokens(indexTokens, queryTokens) {
  if (!indexTokens?.length || !queryTokens?.length) return 0;

  const tokenSet = new Set(indexTokens);
  return queryTokens.reduce((count, token) => count + Number(tokenSet.has(token)), 0);
}

function searchDirectoryIndex(index, query, { limit = 24 } = {}) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return { normalizedQuery: '', results: [] };
  }

  const tokens = tokenize(normalizedQuery).filter((token) => token.length > 1);
  const expandedQueries = buildPhraseVariants(normalizedQuery);

  const results = index
    .map((item) => {
      let relevanceScore = 0;

      relevanceScore += scoreTextVariants(item.titleNormalized, expandedQueries, { exact: 220, includes: 150, reverseIncludes: 74 });
      relevanceScore += scoreTextVariants(item.heroTitleNormalized, expandedQueries, { exact: 170, includes: 112, reverseIncludes: 56 });
      relevanceScore += scoreQueryGroup(item.normalizedPrimaryQueries, expandedQueries, { exact: 260, includes: 180, reverseIncludes: 88 });
      relevanceScore += scoreQueryGroup(item.normalizedSupportQueries, expandedQueries, { exact: 150, includes: 92, reverseIncludes: 42 });
      relevanceScore += scoreTextVariants(item.badgeNormalized, expandedQueries, { exact: 80, includes: 48, reverseIncludes: 24 });
      relevanceScore += scoreTextVariants(item.descriptionNormalized, expandedQueries, { exact: 66, includes: 38, reverseIncludes: 18 });
      relevanceScore += scoreTextVariants(item.sectionTitleNormalized, expandedQueries, { exact: 42, includes: 18, reverseIncludes: 8 });
      relevanceScore += scoreTextVariants(item.searchableText, expandedQueries, { exact: 28, includes: 22, reverseIncludes: 10 });

      const primaryTokenMatches = countSharedTokens(item.primaryTokens, tokens);
      const supportTokenMatches = countSharedTokens(item.supportTokens, tokens);
      const searchableTokenMatches = countSharedTokens(item.searchableTokens, tokens);

      relevanceScore += primaryTokenMatches * 34;
      relevanceScore += supportTokenMatches * 16;
      relevanceScore += searchableTokenMatches * 9;

      const score = relevanceScore > 0 ? relevanceScore + (item.searchPriority || 0) : 0;
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score
        || (right.searchPriority || 0) - (left.searchPriority || 0)
        || left.title.localeCompare(right.title, 'ar'),
    )
    .slice(0, limit);

  return {
    normalizedQuery,
    results,
  };
}
