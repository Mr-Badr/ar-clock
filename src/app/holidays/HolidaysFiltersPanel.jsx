import {
  LayoutGrid,
  Moon,
  Flag,
  GraduationCap,
  Palmtree,
  Globe,
  Briefcase,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORY_ICON_COMPONENTS = {
  all: LayoutGrid,
  islamic: Moon,
  national: Flag,
  school: GraduationCap,
  holidays: Palmtree,
  astronomy: Globe,
  business: Briefcase,
};

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
  onSearchChange,
  onCategoryChange,
  onCountryChange,
  onTimeRangeChange,
  onSortModeChange,
}) {
  return (
    <div className="waqt-panel">
      <div className="waqt-panel__search">
        <input
          id="ev-search"
          type="search"
          className="waqt-panel__search-input"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث عن مناسبة…"
          aria-label="البحث في المناسبات"
        />
        <span className="waqt-panel__search-icon" aria-hidden>🔍</span>
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <p className="waqt-panel__label">التصنيف</p>
        <div className="waqt-cat-grid" role="tablist" aria-label="تصفية حسب التصنيف">
          {categoryOptions.map((option) => {
            const Icon = CATEGORY_ICON_COMPONENTS[option.iconKey] || LayoutGrid;
            const isActive = category === option.id;

            return (
              <button
                key={option.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onCategoryChange(option.id)}
                className={`waqt-cat-cell ${isActive ? 'waqt-cat-cell--active' : ''}`}
              >
                <Icon
                  className="waqt-cat-cell__icon"
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  aria-hidden
                />
                <span className="waqt-cat-cell__label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <p className="waqt-panel__label">الدولة</p>
        <div
          role="group"
          aria-label="تصفية حسب الدولة"
          className="waqt-panel__row no-scrollbar"
          style={{ overflowX: 'auto', paddingBottom: 'var(--space-1)' }}
        >
          {countryOptions.map((option) => (
            <button
              key={option.value}
              aria-pressed={country === option.value}
              onClick={() => onCountryChange(option.value)}
              className={`waqt-pill flex-shrink-0 ${country === option.value ? 'waqt-pill--active' : ''}`}
            >
              {option.flag && <span className="waqt-pill__flag" aria-hidden>{option.flag}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="waqt-panel__divider" />

      <div className="waqt-panel__section">
        <div className="waqt-panel__inline">
          <div className="waqt-panel__col">
            <p className="waqt-panel__label">الترتيب</p>
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
            <p className="waqt-panel__label">المدة</p>
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
