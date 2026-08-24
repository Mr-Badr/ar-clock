'use client';

import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpenText,
  BriefcaseBusiness,
  Calculator,
  FileText,
  LayoutGrid,
  Search,
  X,
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
import { navigateToDiscoveryHref } from '@/lib/site/discovery-navigation';
import { logger, serializeError } from '@/lib/logger';

import styles from './DiscoveryWorkspace.module.css';

// Empty-state redesign, 2026-08-20 (owner directive): the dialog used to greet an empty query
// with recent-searches pills, "popular searches" pills, recent-visit shortcut cards, and a
// type-tab row — four separate blocks of text before the user typed anything. Owner: "not
// showing those random suggestions, just clean search... more modern and calmer." All of that
// (and the history-reading it required) is gone. The empty state is now one calm line; typing
// is the only path to results. Don't re-add recent/popular/featured blocks here without asking.

const TYPE_ICONS = {
  tool: Calculator,
  article: BookOpenText,
  page: FileText,
  section: LayoutGrid,
};

const SEARCH_GROUPS = [
  { id: 'pages', title: 'صفحات' },
  { id: 'tools', title: 'أدوات' },
  { id: 'articles', title: 'مقالات' },
];

function normalizeClientQuery(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function isSectionLike(item) {
  return item?.kind === 'section' || item?.kind === 'page';
}

function groupSearchResults(items) {
  const safeItems = Array.isArray(items) ? items : [];

  return SEARCH_GROUPS.map((group) => {
    if (group.id === 'pages') {
      return { ...group, items: safeItems.filter((item) => isSectionLike(item)) };
    }
    if (group.id === 'tools') {
      return { ...group, items: safeItems.filter((item) => item?.kind === 'tool') };
    }
    return { ...group, items: safeItems.filter((item) => item?.kind === 'article') };
  }).filter((group) => group.items.length);
}

function getItemIcon(item) {
  return TYPE_ICONS[item?.kind] || BriefcaseBusiness;
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

export default function GlobalDiscoverySearchDialog({ open, onOpenChange }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [resolvedQuery, setResolvedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const requestAbortRef = useRef(null);

  const groupedResults = useMemo(() => groupSearchResults(searchResults), [searchResults]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSearchResults([]);
      setResolvedQuery('');
      requestAbortRef.current?.abort?.();
    }
  }, [open]);

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
          component: 'GlobalDiscoverySearchDialog',
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
  }, [deferredQuery, open, pathname]);

  function navigateTo(href, options) {
    const resolvedOptions = options && typeof options === 'object' ? options : {};
    const title = resolvedOptions.title || '';
    const searchValue = resolvedOptions.searchValue || '';

    onOpenChange(false);

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
  }

  const effectiveSearchValue = resolvedQuery || normalizeClientQuery(query);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      shouldFilter={false}
      showCloseButton={false}
      contentClassName={styles.commandDialog}
      title="ابحث داخل ميقاتنا"
      description="ابحث عن صفحة أو أداة أو مقال من أي مكان داخل الموقع."
    >
      <div className={styles.commandHeader}>
        <div>
          <p className={styles.commandKicker}>بحث سريع</p>
          <p className={styles.commandTitle}>ابحث داخل ميقاتنا</p>
        </div>
        <button
          type="button"
          className={styles.commandClose}
          onClick={() => onOpenChange(false)}
          aria-label="إغلاق البحث"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder="ابحث عن صفحة أو أداة أو مقال..."
        className={styles.commandInput}
        wrapperClassName={styles.commandInputWrap}
      />

      <CommandList className={styles.commandList}>
        {effectiveSearchValue ? (
          <>
            <CommandGroup heading="إجراء سريع">
              <CommandItem
                onSelect={() => navigateTo(`/search?q=${encodeURIComponent(effectiveSearchValue)}`, { searchValue: effectiveSearchValue })}
                className={styles.commandActionItem}
              >
                <Search size={16} />
                <span>اعرض كل النتائج في صفحة واحدة</span>
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
          <div className={styles.commandIdleState}>
            <Search size={20} className={styles.commandIdleIcon} aria-hidden="true" />
            <p>اكتب اسم أداة أو مناسبة أو صفحة لعرض النتائج</p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
