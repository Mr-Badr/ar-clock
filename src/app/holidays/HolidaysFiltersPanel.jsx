'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, History } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import { CATEGORY_ICON_COMPONENTS } from './category-icons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  pushDiscoveryHistory,
  readDiscoveryHistory,
} from '@/lib/site/discovery-history';

const RECENT_SEARCHES_KEY = 'miqatona:holidays:recent-searches';

export default function HolidaysFiltersPanel({
  search,
  category,
  country,
  timeRange,
  sortMode,
  categoryOptions,
  countryOptions,
  timeRangeOptions,
  sortOptions,
  facetCounts,
  onSearchChange,
  onCategoryChange,
  onCountryChange,
  onTimeRangeChange,
  onSortModeChange,
}) {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    setRecentSearches(readDiscoveryHistory(RECENT_SEARCHES_KEY));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const commitSearchToHistory = (term) => {
    const trimmed = term.trim();
    if (trimmed.length < 2) return;
    const next = pushDiscoveryHistory(RECENT_SEARCHES_KEY, { term: trimmed }, { max: 6, idKey: 'term' });
    setRecentSearches(next);
  };

  const showRecentSearches = isSearchFocused && !search.trim() && recentSearches.length > 0;

  return (
    <div className="waqt-panel">
      <div className="waqt-panel__search" ref={searchWrapRef}>
        <Search className="waqt-panel__search-icon" size={18} strokeWidth={2} aria-hidden />
        <input
          id="ev-search"
          type="text"
          className="waqt-panel__search-input"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={(event) => commitSearchToHistory(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitSearchToHistory(event.currentTarget.value);
          }}
          placeholder="ابحث: رمضان، عيد الأضحى، السعودية، راتب، مدرسة…"
          aria-label="البحث في المناسبات"
          autoComplete="off"
        />
        {search ? (
          <button
            type="button"
            className="waqt-panel__search-clear"
            aria-label="مسح البحث"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        ) : null}

        {showRecentSearches ? (
          <div className="waqt-recent-searches" role="listbox" aria-label="عمليات بحث سابقة">
            <span className="waqt-recent-searches__label">
              <History size={12} strokeWidth={1.8} aria-hidden />
              بحثت عنها سابقاً
            </span>
            <div className="waqt-recent-searches__chips">
              {recentSearches.map((entry) => (
                <button
                  key={entry.term}
                  type="button"
                  role="option"
                  className="waqt-recent-searches__chip"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onSearchChange(entry.term);
                    setIsSearchFocused(false);
                  }}
                >
                  {entry.term}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <p className="waqt-panel__label">اختر نوع المناسبة</p>
        <div className="waqt-cat-grid" role="tablist" aria-label="تصفية حسب التصنيف">
          {categoryOptions.map((option) => {
            const Icon = CATEGORY_ICON_COMPONENTS[option.iconKey] || LayoutGrid;
            const isActive = category === option.id;
            const count = facetCounts?.categoryCounts?.[option.id];
            const isEmpty = Number.isFinite(count) && count === 0 && !isActive;

            return (
              <button
                key={option.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(option.id)}
                className={`waqt-cat-cell waqt-cat-cell--${option.id} ${isActive ? 'waqt-cat-cell--active' : ''} ${isEmpty ? 'waqt-cat-cell--empty' : ''}`}
              >
                <span className="waqt-cat-cell__icon" aria-hidden>
                  <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />
                </span>
                <span className="waqt-cat-cell__label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <p className="waqt-panel__label">اختر الدولة لعرض المناسبات المرتبطة بها فقط</p>
        <div
          role="group"
          aria-label="تصفية حسب الدولة"
          className="waqt-panel__row no-scrollbar"
          style={{ overflowX: 'auto', paddingBottom: 'var(--space-1)' }}
        >
          {countryOptions.map((option) => {
            const count = facetCounts?.countryCounts?.[option.value];
            const isActive = country === option.value;
            const isEmpty = Number.isFinite(count) && count === 0 && !isActive;

            return (
              <button
                key={option.value}
                aria-pressed={isActive}
                onClick={() => onCountryChange(option.value)}
                className={`waqt-pill flex-shrink-0 ${isActive ? 'waqt-pill--active' : ''} ${isEmpty ? 'waqt-pill--empty' : ''}`}
              >
                {option.value !== 'all' && <CountryFlag code={option.value} className="waqt-pill__flag" />}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <div className="waqt-panel__inline">
          <div className="waqt-panel__col">
            <p className="waqt-panel__label">رتّب النتائج</p>
            <Select value={sortMode} onValueChange={onSortModeChange}>
              <SelectTrigger className="waqt-select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="waqt-panel__col" style={{ flex: 1 }}>
            <p className="waqt-panel__label">الفترة</p>
            <div className="waqt-panel__row waqt-panel__row--align">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.id}
                  aria-pressed={timeRange === option.id}
                  onClick={() => onTimeRangeChange(option.id)}
                  className={`waqt-pill waqt-pill--sm ${timeRange === option.id ? 'waqt-pill--active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
