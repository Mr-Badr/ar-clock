import { CalendarDays, Search } from 'lucide-react';
import CountryFlag from '@/components/shared/CountryFlag';
import { CATEGORY_ICON_COMPONENTS } from './category-icons';

export default function HolidaysResultsSummary({
  eventsCount,
  total,
  isPending,
  hasActiveFilters,
  category,
  country,
  timeRange,
  search,
  categoryOptions,
  countryOptions,
  timeRangeOptions,
  onClearCategory,
  onClearCountry,
  onClearTimeRange,
  onClearSearch,
  onClearAll,
}) {
  const selectedCategory = categoryOptions.find((option) => option.id === category);
  const selectedCountry = countryOptions.find((option) => option.value === country);
  const selectedTimeRange = timeRangeOptions.find((option) => option.id === timeRange);
  const SelectedCategoryIcon = selectedCategory
    ? CATEGORY_ICON_COMPONENTS[selectedCategory.iconKey || selectedCategory.id] || CATEGORY_ICON_COMPONENTS.all
    : null;
  const countryLabel = country !== 'all' && selectedCountry?.label
    ? selectedCountry.label
    : '';
  const resultCount = hasActiveFilters || countryLabel ? eventsCount : total;
  const summaryPrefix = isPending
    ? null
    : countryLabel
      ? 'مناسبة مرتبطة بـ'
      : hasActiveFilters
        ? 'مناسبة توافق ما اخترته'
        : 'مناسبة متاحة الآن';

  return (
    <div className="waqt-results-summary flex items-center justify-between flex-wrap" style={{ gap: 'var(--space-3)' }}>
      <div style={{ minWidth: 0 }}>
        <p
          aria-live="polite"
          aria-atomic
          className="waqt-results-summary__line"
        >
          {isPending ? (
            'نرتّب النتائج المناسبة لك الآن…'
          ) : (
            <>
              <span className="waqt-results-summary__count">{resultCount}</span>
              {' '}
              {summaryPrefix}
              {countryLabel ? ` ${countryLabel}` : ''}
            </>
          )}
        </p>
      </div>

      {hasActiveFilters && (
        <div className="waqt-active-filters">
          {category !== 'all' && selectedCategory && (
            <span className="waqt-filter-tag">
              {SelectedCategoryIcon ? (
                <SelectedCategoryIcon size={13} strokeWidth={1.8} aria-hidden="true" />
              ) : null}
              {selectedCategory.label}
              <button
                className="waqt-filter-tag__x"
                aria-label={`إزالة تصفية: ${selectedCategory.label}`}
                onClick={onClearCategory}
              >
                ✕
              </button>
            </span>
          )}

          {country !== 'all' && selectedCountry && (
            <span className="waqt-filter-tag">
              <CountryFlag code={selectedCountry.value} /> {selectedCountry.label}
              <button
                className="waqt-filter-tag__x"
                aria-label={`إزالة تصفية: ${selectedCountry.label}`}
                onClick={onClearCountry}
              >
                ✕
              </button>
            </span>
          )}

          {timeRange !== 'all' && selectedTimeRange && (
            <span className="waqt-filter-tag">
              <CalendarDays size={13} strokeWidth={1.8} aria-hidden="true" />
              {selectedTimeRange.label}
              <button
                className="waqt-filter-tag__x"
                aria-label={`إزالة تصفية المدة: ${selectedTimeRange.label}`}
                onClick={onClearTimeRange}
              >
                ✕
              </button>
            </span>
          )}

          {search && (
            <span className="waqt-filter-tag">
              <Search size={13} strokeWidth={1.8} aria-hidden="true" />
              &quot;{search}&quot;
              <button
                className="waqt-filter-tag__x"
                aria-label="مسح البحث"
                onClick={onClearSearch}
              >
                ✕
              </button>
            </span>
          )}

          <button className="waqt-clear-btn" onClick={onClearAll}>مسح الكل</button>
        </div>
      )}
    </div>
  );
}
