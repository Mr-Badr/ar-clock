'use client';

import { useEffect, useRef, useState, useCallback, useDeferredValue } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { loadMoreEvents } from './actions';
import HolidaysFiltersPanel from './HolidaysFiltersPanel';
import HolidaysResultsSummary from './HolidaysResultsSummary';
import HolidaysEventsGrid from './HolidaysEventsGrid';
import {
  buildHolidayQueryString,
  normalizeHolidayFilter,
  readFiltersFromSearchParams,
  sameHolidayFilters,
  sortHolidayEvents,
} from './holidays-filter-utils';

const SEARCH_DEBOUNCE_MS = 180;

export default function HolidaysClientInteractive({
  initialEvents,
  initialNextCursor,
  initialTotal,
  initialFilters,
  categoryOptions,
  countryOptions,
  timeRangeOptions,
  sortOptions,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pendingQueryRef = useRef(null);
  const latestFilterRequestRef = useRef(0);
  const filtersRef = useRef(normalizeHolidayFilter(initialFilters));
  const lastAppliedFiltersRef = useRef(normalizeHolidayFilter(initialFilters));

  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(initialNextCursor);
  const [total, setTotal] = useState(initialTotal);

  const [category, setCategory] = useState(initialFilters?.category || 'all');
  const [country, setCountry] = useState(initialFilters?.countryCode || 'all');
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [timeRange, setTimeRange] = useState(initialFilters?.timeRange || 'all');

  const [sortMode, setSortMode] = useState('daysLeft');
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const deferredSearch = useDeferredValue(search);

  const syncUrl = useCallback((filters) => {
    const query = buildHolidayQueryString(filters);
    pendingQueryRef.current = query;
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  const applyFilter = useCallback(async (nextFilters, options = {}) => {
    const normalized = normalizeHolidayFilter(nextFilters);
    const requestId = latestFilterRequestRef.current + 1;
    latestFilterRequestRef.current = requestId;
    lastAppliedFiltersRef.current = normalized;

    if (options.syncUrl !== false) {
      syncUrl(normalized);
    }

    setIsFiltering(true);
    try {
      const result = await loadMoreEvents(0, normalized);
      if (latestFilterRequestRef.current !== requestId) return;
      setEvents(result.events);
      setCursor(result.nextCursor);
      setTotal(result.total);
    } catch (error) {
      if (latestFilterRequestRef.current === requestId) {
        console.error('[holidays] failed to refresh filtered events', error);
      }
    } finally {
      if (latestFilterRequestRef.current === requestId) {
        setIsFiltering(false);
      }
    }
  }, [syncUrl]);

  const handleCategory = useCallback((value) => {
    setCategory(value);
    filtersRef.current = normalizeHolidayFilter({
      category: value,
      countryCode: country,
      search,
      timeRange,
    });
    applyFilter({
      category: value,
      countryCode: country,
      search,
      timeRange,
    });
  }, [applyFilter, country, search, timeRange]);

  const handleCountry = useCallback((value) => {
    setCountry(value);
    filtersRef.current = normalizeHolidayFilter({
      category,
      countryCode: value,
      search,
      timeRange,
    });
    applyFilter({
      category,
      countryCode: value,
      search,
      timeRange,
    });
  }, [applyFilter, category, search, timeRange]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    filtersRef.current = normalizeHolidayFilter({
      category,
      countryCode: country,
      search: value,
      timeRange,
    });
  }, [category, country, timeRange]);

  const handleTimeRange = useCallback((value) => {
    setTimeRange(value);
    filtersRef.current = normalizeHolidayFilter({
      category,
      countryCode: country,
      search,
      timeRange: value,
    });
    applyFilter({
      category,
      countryCode: country,
      search,
      timeRange: value,
    });
  }, [applyFilter, category, country, search]);

  const clearAll = useCallback(() => {
    setCategory('all');
    setCountry('all');
    setSearch('');
    setTimeRange('all');
    setSortMode('daysLeft');
    filtersRef.current = normalizeHolidayFilter({
      category: 'all',
      countryCode: 'all',
      search: '',
      timeRange: 'all',
    });
    applyFilter({
      category: 'all',
      countryCode: 'all',
      search: '',
      timeRange: 'all',
    });
  }, [applyFilter]);

  const handleLoadMore = useCallback(async () => {
    if (!cursor || isFiltering || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const result = await loadMoreEvents(cursor, lastAppliedFiltersRef.current);
      setEvents((prev) => [...prev, ...result.events]);
      setCursor(result.nextCursor);
      setTotal(result.total);
    } catch (error) {
      console.error('[holidays] failed to load more events', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, isFiltering, isLoadingMore]);

  useEffect(() => {
    const currentQuery = searchParams?.toString() || '';
    if (pendingQueryRef.current !== null) {
      if (pendingQueryRef.current === currentQuery) {
        pendingQueryRef.current = null;
      }
      return;
    }

    const urlFilters = readFiltersFromSearchParams(searchParams);
    const currentFilters = filtersRef.current;
    if (sameHolidayFilters(urlFilters, currentFilters)) return;

    setCategory(urlFilters.category);
    setCountry(urlFilters.countryCode);
    setSearch(urlFilters.search);
    setTimeRange(urlFilters.timeRange);
    filtersRef.current = urlFilters;

    if (sameHolidayFilters(urlFilters, lastAppliedFiltersRef.current)) return;
    applyFilter(urlFilters, { syncUrl: false });
  }, [applyFilter, searchParams]);

  useEffect(() => {
    const nextFilters = normalizeHolidayFilter({
      category,
      countryCode: country,
      search: deferredSearch,
      timeRange,
    });
    filtersRef.current = nextFilters;

    if (sameHolidayFilters(nextFilters, lastAppliedFiltersRef.current)) return;

    const delay = deferredSearch.trim() ? SEARCH_DEBOUNCE_MS : 0;
    const timeoutId = window.setTimeout(() => {
      applyFilter(nextFilters);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [applyFilter, category, country, deferredSearch, timeRange]);

  const displayEvents = sortHolidayEvents(events, sortMode);
  const hasActiveFilters = category !== 'all' || country !== 'all' || search !== '' || timeRange !== 'all';

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>
      <HolidaysFiltersPanel
        search={search}
        category={category}
        country={country}
        timeRange={timeRange}
        sortMode={sortMode}
        categoryOptions={categoryOptions}
        countryOptions={countryOptions}
        timeRangeOptions={timeRangeOptions}
        sortOptions={sortOptions}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategory}
        onCountryChange={handleCountry}
        onTimeRangeChange={handleTimeRange}
        onSortModeChange={setSortMode}
      />

      <HolidaysResultsSummary
        eventsCount={events.length}
        total={total}
        isPending={isFiltering}
        hasActiveFilters={hasActiveFilters}
        category={category}
        country={country}
        timeRange={timeRange}
        search={search}
        categoryOptions={categoryOptions}
        countryOptions={countryOptions}
        timeRangeOptions={timeRangeOptions}
        onClearCategory={() => handleCategory('all')}
        onClearCountry={() => handleCountry('all')}
        onClearTimeRange={() => handleTimeRange('all')}
        onClearSearch={() => handleSearch('')}
        onClearAll={clearAll}
      />

      <HolidaysEventsGrid
        eventsCount={events.length}
        total={total}
        displayEvents={displayEvents}
        isFiltering={isFiltering}
        isLoadingMore={isLoadingMore}
        cursor={cursor}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
