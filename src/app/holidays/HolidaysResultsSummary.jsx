import {
  BookOpen,
  Briefcase,
  CalendarDays,
  CircleDollarSign,
  Flag,
  Globe2,
  GraduationCap,
  LayoutGrid,
  Moon,
  Search,
  Users,
} from 'lucide-react';

const CATEGORY_ICON_COMPONENTS = {
  all: LayoutGrid,
  islamic: Moon,
  national: Flag,
  school: GraduationCap,
  holidays: BookOpen,
  astronomy: Globe2,
  social: Users,
  business: Briefcase,
  support: CircleDollarSign,
};

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
    ? CATEGORY_ICON_COMPONENTS[selectedCategory.iconKey || selectedCategory.id] || LayoutGrid
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
  const summaryHint = isPending
    ? null
    : countryLabel
      ? `نعرض الآن المناسبات المحلية أو النسخ الخاصة بـ ${countryLabel} فقط. امسح الدولة إذا أردت رؤية المناسبات العامة لكل البلدان.`
      : hasActiveFilters
      ? `من أصل ${total} مناسبة يمكنك تعديل الدولة أو النوع أو المدة. إذا كنت تبحث عن إجازة رسمية، ابدأ بالدولة قبل الاسم.`
      : 'ابدأ بالأقرب زمنًا أو ابحث باسم المناسبة أو الدولة أو نوع الموعد للوصول إلى الصفحة التي تريدها مباشرة.';

  return (
    <div className="waqt-results-summary flex items-center justify-between flex-wrap" style={{ gap: 'var(--space-3)' }}>
      <div style={{ display: 'grid', gap: '0.22rem', minWidth: 0 }}>
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
        {summaryHint ? (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {summaryHint}
          </p>
        ) : null}
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
