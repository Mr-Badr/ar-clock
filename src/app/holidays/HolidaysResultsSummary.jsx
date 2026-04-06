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

  return (
    <div className="flex items-center justify-between flex-wrap" style={{ gap: 'var(--space-3)' }}>
      <p
        aria-live="polite"
        aria-atomic
        style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
      >
        {isPending ? 'جاري البحث…' : `${eventsCount} من ${total} مناسبة`}
      </p>

      {hasActiveFilters && (
        <div className="waqt-active-filters">
          {category !== 'all' && selectedCategory && (
            <span className="waqt-filter-tag">
              {selectedCategory.icon} {selectedCategory.label}
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
              {selectedCountry.flag} {selectedCountry.label}
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
              🗓 {selectedTimeRange.label}
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
              🔍 &quot;{search}&quot;
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
