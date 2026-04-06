'use client';

import { useEffect, useRef, useState, useTransition, useCallback, useDeferredValue } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { loadMoreEvents } from './actions';
import HolidaysFiltersPanel from './HolidaysFiltersPanel';
import HolidaysResultsSummary from './HolidaysResultsSummary';
import HolidaysEventsGrid from './HolidaysEventsGrid';
import {
  buildHolidayQueryString,
  readFiltersFromSearchParams,
  sameHolidayFilters,
  sortHolidayEvents,
} from './holidays-filter-utils';

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

  const [events, setEvents] = useState(initialEvents);
  const [cursor, setCursor] = useState(initialNextCursor);
  const [total, setTotal] = useState(initialTotal);

  const [category, setCategory] = useState(initialFilters?.category || 'all');
  const [country, setCountry] = useState(initialFilters?.countryCode || 'all');
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [timeRange, setTimeRange] = useState(initialFilters?.timeRange || 'all');

  const [sortMode, setSortMode] = useState('daysLeft');

  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const syncUrl = useCallback((filters) => {
    const query = buildHolidayQueryString(filters);
    pendingQueryRef.current = query;
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

  const applyFilter = useCallback((nextFilters) => {
    syncUrl(nextFilters);
    startTransition(async () => {
      const result = await loadMoreEvents(0, nextFilters);
      setEvents(result.events);
      setCursor(result.nextCursor);
      setTotal(result.total);
    });
  }, [syncUrl]);

  const handleCategory = useCallback((value) => {
    setCategory(value);
    applyFilter({
      category: value,
      countryCode: country,
      search: deferredSearch,
      timeRange,
    });
  }, [applyFilter, country, deferredSearch, timeRange]);

  const handleCountry = useCallback((value) => {
    setCountry(value);
    applyFilter({
      category,
      countryCode: value,
      search: deferredSearch,
      timeRange,
    });
  }, [applyFilter, category, deferredSearch, timeRange]);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    applyFilter({
      category,
      countryCode: country,
      search: value,
      timeRange,
    });
  }, [applyFilter, category, country, timeRange]);

  const handleTimeRange = useCallback((value) => {
    setTimeRange(value);
    applyFilter({
      category,
      countryCode: country,
      search: deferredSearch,
      timeRange: value,
    });
  }, [applyFilter, category, country, deferredSearch]);

  const clearAll = useCallback(() => {
    setCategory('all');
    setCountry('all');
    setSearch('');
    setTimeRange('all');
    setSortMode('daysLeft');
    applyFilter({
      category: 'all',
      countryCode: 'all',
      search: '',
      timeRange: 'all',
    });
  }, [applyFilter]);

  const handleLoadMore = useCallback(() => {
    if (!cursor) return;

    startTransition(async () => {
      const result = await loadMoreEvents(cursor, {
        category,
        countryCode: country,
        search: deferredSearch,
        timeRange,
      });
      setEvents((prev) => [...prev, ...result.events]);
      setCursor(result.nextCursor);
    });
  }, [category, country, cursor, deferredSearch, timeRange]);

  useEffect(() => {
    const currentQuery = searchParams?.toString() || '';
    if (pendingQueryRef.current !== null) {
      if (pendingQueryRef.current === currentQuery) {
        pendingQueryRef.current = null;
      }
      return;
    }

    const urlFilters = readFiltersFromSearchParams(searchParams);
    const currentFilters = {
      category,
      countryCode: country,
      search,
      timeRange,
    };

    if (sameHolidayFilters(urlFilters, currentFilters)) return;

    setCategory(urlFilters.category);
    setCountry(urlFilters.countryCode);
    setSearch(urlFilters.search);
    setTimeRange(urlFilters.timeRange);

    startTransition(async () => {
      const result = await loadMoreEvents(0, urlFilters);
      setEvents(result.events);
      setCursor(result.nextCursor);
      setTotal(result.total);
    });
  }, [category, country, search, searchParams, timeRange]);

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
        isPending={isPending}
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
        isPending={isPending}
        cursor={cursor}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
