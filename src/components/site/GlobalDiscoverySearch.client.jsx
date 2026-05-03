'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpenText,
  BriefcaseBusiness,
  Calculator,
  ChartNoAxesCombined,
  Clock3,
  Compass,
  FileText,
  Landmark,
  LayoutGrid,
  PartyPopper,
  Search,
  Sparkles,
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
import {
  DISCOVERY_RECENT_SEARCHES_KEY,
  DISCOVERY_RECENT_VISITS_KEY,
  getDiscoveryIconKey,
  pushDiscoveryHistory,
  readDiscoveryHistory,
} from '@/lib/site/discovery-history';
import { navigateToDiscoveryHref } from '@/lib/site/discovery-navigation';
import { OPEN_DISCOVERY_SEARCH_EVENT } from '@/lib/site/discovery-events';
import { logger, serializeError } from '@/lib/logger';

import styles from './DiscoveryWorkspace.module.css';

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
  date: Clock3,
  prayer: Landmark,
  difference: Compass,
  clock: Clock3,
  page: BriefcaseBusiness,
};

const SEARCH_GROUPS = [
  { id: 'pages', title: 'صفحات' },
  { id: 'tools', title: 'أدوات' },
  { id: 'articles', title: 'مقالات' },
];

const TAB_SHORTCUTS = [
  { id: 'tools', label: 'أدوات' },
  { id: 'articles', label: 'مقالات' },
  { id: 'sections', label: 'أقسام' },
  { id: 'featured', label: 'الأكثر' },
];

function normalizeClientQuery(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function isSectionLike(item) {
  return item?.kind === 'section' || item?.kind === 'page';
}

function groupSearchResults(items = []) {
  return SEARCH_GROUPS.map((group) => {
    if (group.id === 'pages') {
      return { ...group, items: items.filter((item) => isSectionLike(item)) };
    }
    if (group.id === 'tools') {
      return { ...group, items: items.filter((item) => item?.kind === 'tool') };
    }
    return { ...group, items: items.filter((item) => item?.kind === 'article') };
  }).filter((group) => group.items.length);
}

function getItemIcon(item) {
  return TYPE_ICONS[item?.kind] || BriefcaseBusiness;
}

function getVisitIcon(entry) {
  return VISIT_ICONS[getDiscoveryIconKey(entry?.href || '')] || BriefcaseBusiness;
}

function getItemMetaLabel(item) {
  if (item?.badge) return item.badge;
  if (item?.kind === 'tool') return 'أداة';
  if (item?.kind === 'article') return 'مقال';
  if (item?.kind === 'section') return 'قسم';
  if (item?.kind === 'page') return 'صفحة';
  return item?.sectionTitle || 'رابط';
}

async function fetchDiscoveryJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load discovery search (${response.status})`);
  }

  return response.json();
}

export default function GlobalDiscoverySearch() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [topSearches, setTopSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [resolvedQuery, setResolvedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const hasPrimedRef = useRef(false);
  const requestAbortRef = useRef(null);

  const groupedResults = useMemo(() => groupSearchResults(searchResults), [searchResults]);

  const primeDiscoveryData = useCallback(async () => {
    if (hasPrimedRef.current) return;
    hasPrimedRef.current = true;
    setIsLoading(true);

    try {
      const data = await fetchDiscoveryJson('/api/discovery-search', undefined);
      setFeaturedItems(Array.isArray(data?.featuredItems) ? data.featuredItems : []);
      setTopSearches(Array.isArray(data?.topSearches) ? data.topSearches : []);
    } catch (error) {
      hasPrimedRef.current = false;
      logger.warn('global-discovery-search-prime-failed', {
        component: 'GlobalDiscoverySearch',
        pathname,
        error: serializeError(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSearchResults([]);
      setResolvedQuery('');
      requestAbortRef.current?.abort?.();
      return;
    }

    setRecentSearches(readDiscoveryHistory(DISCOVERY_RECENT_SEARCHES_KEY));
    setRecentVisits(
      readDiscoveryHistory(DISCOVERY_RECENT_VISITS_KEY).filter(
        (item) => item?.href && item.href !== '/fahras' && item.href !== '/search',
      ),
    );
    void primeDiscoveryData();
  }, [open, primeDiscoveryData]);

  useEffect(() => {
    if (!open) return undefined;

    const trimmedQuery = normalizeClientQuery(deferredQuery);
    if (!trimmedQuery) {
      setSearchResults([]);
      setResolvedQuery('');
      requestAbortRef.current?.abort?.();
      return undefined;
    }

    const controller = new AbortController();
    requestAbortRef.current?.abort?.();
    requestAbortRef.current = controller;
    setIsLoading(true);

    fetchDiscoveryJson(`/api/discovery-search?q=${encodeURIComponent(trimmedQuery)}&limit=24`, controller.signal)
      .then((data) => {
        setSearchResults(Array.isArray(data?.results) ? data.results : []);
        setResolvedQuery(data?.normalizedQuery || trimmedQuery);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        logger.warn('global-discovery-search-query-failed', {
          component: 'GlobalDiscoverySearch',
          pathname,
          query: trimmedQuery,
          error: serializeError(error),
        });
        setSearchResults([]);
        setResolvedQuery(trimmedQuery);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [deferredQuery, open]);

  function rememberSearch(value) {
    const normalized = normalizeClientQuery(value);
    if (!normalized) return;

    const nextEntries = pushDiscoveryHistory(
      DISCOVERY_RECENT_SEARCHES_KEY,
      { value: normalized },
      { max: 6, idKey: 'value' },
    );
    setRecentSearches(nextEntries);
  }

  function refreshRecentVisits() {
    setRecentVisits(
      readDiscoveryHistory(DISCOVERY_RECENT_VISITS_KEY).filter(
        (entry) => entry?.href && entry.href !== '/fahras' && entry.href !== '/search',
      ),
    );
  }

  function navigateTo(href, { title, searchValue } = {}) {
    if (searchValue) rememberSearch(searchValue);
    setOpen(false);

    navigateToDiscoveryHref({
      router,
      rawHref: href,
      source: 'header-global-discovery-search',
      context: {
        title: title || null,
        pathname,
        searchValue: searchValue || null,
      },
    });

    if (title) {
      refreshRecentVisits();
    }
  }

  async function openSearch() {
    if (pathname === '/fahras' || pathname === '/search') {
      window.dispatchEvent(new CustomEvent(OPEN_DISCOVERY_SEARCH_EVENT));
      return;
    }

    setOpen(true);
    void primeDiscoveryData();
  }

  function handleOpenChange(nextOpen) {
    setOpen(nextOpen);
    if (nextOpen) {
      void primeDiscoveryData();
    }
  }

  const effectiveSearchValue = resolvedQuery || normalizeClientQuery(query);

  return (
    <>
      <button
        type="button"
        aria-label="ابحث عن أي أداة أو صفحة داخل ميقاتنا"
        aria-haspopup="dialog"
        className="header-search-link"
        onClick={openSearch}
        onMouseEnter={() => void primeDiscoveryData()}
        onFocus={() => void primeDiscoveryData()}
      >
        <Search size={16} />
        <span className="header-search-link__label">البحث الذكي</span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        shouldFilter={false}
        showCloseButton={false}
        contentClassName={styles.commandDialog}
        title="البحث الذكي داخل ميقاتنا"
        description="ابحث عن صفحة أو أداة أو دليل من أي مكان داخل الموقع."
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="ابحث عن صفحة أو أداة أو دليل..."
          className={styles.commandInput}
          wrapperClassName={styles.commandInputWrap}
        />

        <CommandList className={styles.commandList}>
          {isLoading && !searchResults.length && !effectiveSearchValue ? (
            <div className={styles.commandEmptyState}>
              <div className={styles.commandBlock}>
                <h3>جاري تجهيز البحث</h3>
                <p>نحمّل فهرس الصفحات والأدوات الآن حتى تظهر لك النتائج فور الكتابة.</p>
              </div>
            </div>
          ) : effectiveSearchValue ? (
            <>
              <CommandGroup heading="إجراء سريع">
                <CommandItem
                  onSelect={() => navigateTo(`/search?q=${encodeURIComponent(effectiveSearchValue)}`, { searchValue: effectiveSearchValue })}
                  className={styles.commandActionItem}
                >
                  <Search size={16} />
                  <span>اعرض كل النتائج داخل البحث الذكي</span>
                  <CommandShortcut>Enter</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />

              {groupedResults.map((group) => (
                <CommandGroup key={group.id} heading={group.title}>
                  {group.items.map((item) => {
                    const Icon = getItemIcon(item);

                    return (
                      <CommandItem
                        key={`${group.id}-${item.href}`}
                        value={item.title}
                        onSelect={() => navigateTo(item.href, { title: item.title, searchValue: effectiveSearchValue })}
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

              {!isLoading ? (
                <CommandEmpty>لا توجد نتائج مطابقة. جرّب عبارة أقصر أو افتح البحث الكامل.</CommandEmpty>
              ) : null}
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
                        onClick={() => setQuery(item.value)}
                      >
                        {item.value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {topSearches.length ? (
                <div className={styles.commandBlock}>
                  <h3>عمليات شائعة</h3>
                  <div className={styles.commandPillRow}>
                    {topSearches.slice(0, 6).map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={styles.commandPill}
                        onClick={() => setQuery(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={styles.commandBlock}>
                <h3>{recentVisits.length ? 'آخر ما زرته' : 'اختصارات سريعة'}</h3>
                <div className={styles.commandShortcutList}>
                  {(recentVisits.length ? recentVisits : featuredItems).slice(0, 5).map((item) => {
                    const Icon = recentVisits.length ? getVisitIcon(item) : getItemIcon(item);
                    const label = item.title || 'صفحة';

                    return (
                      <button
                        key={`${item.href}-${label}`}
                        type="button"
                        className={styles.commandShortcutCard}
                        onClick={() => navigateTo(item.href, { title: label })}
                      >
                        <Icon size={16} />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.commandBlock}>
                <h3>تصفح حسب النوع</h3>
                <div className={styles.commandPillRow}>
                  {TAB_SHORTCUTS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={styles.commandPill}
                      onClick={() => navigateTo(`/search?tab=${tab.id}`)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.commandBlock}>
                <button
                  type="button"
                  className={styles.commandShortcutCard}
                  onClick={() => navigateTo('/search')}
                >
                  <Sparkles size={16} />
                  <span>افتح صفحة البحث الكاملة</span>
                  <ArrowLeft size={15} className={styles.directoryArrow} />
                </button>
              </div>
            </div>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
