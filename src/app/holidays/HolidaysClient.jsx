'use client';
/**
 * app/holidays/HolidaysClient.jsx
 */
import { useState, useTransition, useCallback, useDeferredValue } from 'react';
import {
  LayoutGrid, Moon, Flag, GraduationCap, Palmtree, Globe, Briefcase,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { loadMoreEvents } from './actions';
import { PAGE_SIZE }      from './constants';
import EventCard, { EventGridSkeleton } from '@/components/events/EventCard';
import { CATEGORIES }     from '@/lib/holidays-engine';
import { COUNTRY_META }   from '@/lib/calendar-config';

/* ── Static data ──────────────────────────────────────────────────────── */

const COUNTRIES = [
  { value: 'all', label: 'كل الدول', flag: '' },
  ...Object.entries(COUNTRY_META)
    .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
    .map(([code, meta]) => ({
      value: code,
      label: meta.name,
      flag: meta.flag
    }))
];

const TIME_RANGES = [
  { id: 'all',     label: 'الكل'   },
  { id: 'week',    label: 'أسبوع'  },
  { id: 'month',   label: 'شهر'    },
  { id: '3months', label: '3 أشهر' },
];

const SORT_OPTIONS = [
  { value: 'daysLeft',     label: 'الأقرب أولاً' },
  { value: 'daysLeftDesc', label: 'الأبعد أولاً' },
  { value: 'name',         label: 'أبجدي'        },
];

/* Lucide icons mapped to category ids — mirrors CategoryScroll from Lovable */
const CAT_ICONS = {
  all:       LayoutGrid,
  islamic:   Moon,
  national:  Flag,
  school:    GraduationCap,
  holidays:  Palmtree,
  astronomy: Globe,
  business:  Briefcase,
};

/* ── Helpers ──────────────────────────────────────────────────────────── */

/** Client-side sort on the already-loaded events (server handles pagination) */
function sortEvents(events, mode) {
  const sorted = [...events];
  if (mode === 'daysLeft')     return sorted.sort((a, b) => a._daysLeft - b._daysLeft);
  if (mode === 'daysLeftDesc') return sorted.sort((a, b) => b._daysLeft - a._daysLeft);
  return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function HolidaysClient({ initialEvents, initialNextCursor, initialTotal }) {
  /* Server-synced state */
  const [events,  setEvents]  = useState(initialEvents);
  const [cursor,  setCursor]  = useState(initialNextCursor);
  const [total,   setTotal]   = useState(initialTotal);

  /* Filter state */
  const [category,  setCategory]  = useState('all');
  const [country,   setCountry]   = useState('all');
  const [search,    setSearch]    = useState('');
  const [timeRange, setTimeRange] = useState('all');

  /* Display-only state (no server round-trip) */
  const [sortMode, setSortMode] = useState('daysLeft');

  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  /* ── Server action wrapper ──────────────────────────────────────────── */
  /**
   * applyFilter — resets pagination and re-fetches from page 0.
   * NOTE: `timeRange` is passed as an extra filter param.
   *       Update your loadMoreEvents server action to handle it if needed.
   */
  const applyFilter = useCallback((cat, co, q, tr) => {
    startTransition(async () => {
      const r = await loadMoreEvents(0, {
        category: cat,
        countryCode: co,
        search: q,
        timeRange: tr,   // ← new param; server action can ignore if not yet supported
      });
      setEvents(r.events);
      setCursor(r.nextCursor);
      setTotal(r.total);
    });
  }, []);

  /* ── Handlers ──────────────────────────────────────────────────────── */
  const handleCategory  = (v) => { setCategory(v);  applyFilter(v, country, deferredSearch, timeRange); };
  const handleCountry   = (v) => { setCountry(v);   applyFilter(category, v, deferredSearch, timeRange); };
  const handleSearch    = (v) => { setSearch(v);    applyFilter(category, country, v, timeRange); };
  const handleTimeRange = (v) => { setTimeRange(v); applyFilter(category, country, deferredSearch, v); };

  const clearAll = () => {
    setCategory('all'); setCountry('all'); setSearch(''); setTimeRange('all'); setSortMode('daysLeft');
    applyFilter('all', 'all', '', 'all');
  };

  const handleLoadMore = () => {
    if (!cursor) return;
    startTransition(async () => {
      const r = await loadMoreEvents(cursor, {
        category, countryCode: country, search: deferredSearch, timeRange,
      });
      setEvents(prev => [...prev, ...r.events]);
      setCursor(r.nextCursor);
    });
  };

  /* ── Derived display values ─────────────────────────────────────────── */
  const displayEvents     = sortEvents(events, sortMode);
  const hasActiveFilters  = category !== 'all' || country !== 'all' || search !== '' || timeRange !== 'all';

  const selectedCat     = CATEGORIES.find(c => c.id === category);
  const selectedCountry = COUNTRIES.find(c => c.value === country);
  const selectedTime    = TIME_RANGES.find(t => t.id === timeRange);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-6)' }}>

      {/* ═══════════════════════════════════════════════════════════════
          Unified Filter Panel
          ═══════════════════════════════════════════════════════════════ */}
      <div className="waqt-panel">

        {/* Search ─────────────────────────────────────────────────── */}
        <div className="waqt-panel__search">
          <input
            id="ev-search"
            type="search"
            className="waqt-panel__search-input"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="ابحث عن مناسبة…"
            aria-label="البحث في المناسبات"
          />
          <span className="waqt-panel__search-icon" aria-hidden>🔍</span>
        </div>

        <div className="waqt-panel__divider" />

        {/* Categories ─────────────────────────────────────────────── */}
        <div className="waqt-panel__section">
          <p className="waqt-panel__label">التصنيف</p>
          {/* Inlined CategoryScroll — grid of icon+label cells */}
          <div className="waqt-cat-grid" role="tablist" aria-label="تصفية حسب التصنيف">
            {CATEGORIES.map(cat => {
              const Icon     = CAT_ICONS[cat.id] || LayoutGrid;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategory(cat.id)}
                  className={`waqt-cat-cell ${isActive ? 'waqt-cat-cell--active' : ''}`}
                >
                  <Icon
                    className="waqt-cat-cell__icon"
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    aria-hidden
                  />
                  <span className="waqt-cat-cell__label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="waqt-panel__divider" />

        {/* Countries ──────────────────────────────────────────────── */}
        <div className="waqt-panel__section">
          <p className="waqt-panel__label">الدولة</p>
          <div
            role="group"
            aria-label="تصفية حسب الدولة"
            className="waqt-panel__row no-scrollbar"
            style={{ overflowX: 'auto', paddingBottom: 'var(--space-1)' }}
          >
            {COUNTRIES.map(c => (
              <button
                key={c.value}
                aria-pressed={country === c.value}
                onClick={() => handleCountry(c.value)}
                className={`waqt-pill flex-shrink-0 ${country === c.value ? 'waqt-pill--active' : ''}`}
              >
                {c.flag && <span className="waqt-pill__flag" aria-hidden>{c.flag}</span>}
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="waqt-panel__divider" />

        {/* Sort + Time range ──────────────────────────────────────── */}
        <div className="waqt-panel__section">
          <div className="waqt-panel__inline">

            {/* Sort dropdown */}
            <div className="waqt-panel__col">
              <p className="waqt-panel__label">الترتيب</p>
              <Select value={sortMode} onValueChange={v => setSortMode(v)}>
                <SelectTrigger className="waqt-select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time range pills */}
            <div className="waqt-panel__col" style={{ flex: 1 }}>
              <p className="waqt-panel__label">المدة</p>
              <div className="waqt-panel__row waqt-panel__row--align">
                {TIME_RANGES.map(t => (
                  <button
                    key={t.id}
                    aria-pressed={timeRange === t.id}
                    onClick={() => handleTimeRange(t.id)}
                    className={`waqt-pill waqt-pill--sm ${timeRange === t.id ? 'waqt-pill--active' : ''}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Results count + Active filter tags
          ═══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between flex-wrap" style={{ gap: 'var(--space-3)' }}>
        <p
          aria-live="polite"
          aria-atomic
          style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}
        >
          {isPending ? 'جاري البحث…' : `${events.length} من ${total} مناسبة`}
        </p>

        {hasActiveFilters && (
          <div className="waqt-active-filters">
            {category !== 'all' && selectedCat && (
              <span className="waqt-filter-tag">
                {selectedCat.icon} {selectedCat.label}
                <button
                  className="waqt-filter-tag__x"
                  aria-label={`إزالة تصفية: ${selectedCat.label}`}
                  onClick={() => handleCategory('all')}
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
                  onClick={() => handleCountry('all')}
                >
                  ✕
                </button>
              </span>
            )}
            {timeRange !== 'all' && selectedTime && (
              <span className="waqt-filter-tag">
                🗓 {selectedTime.label}
                <button
                  className="waqt-filter-tag__x"
                  aria-label={`إزالة تصفية المدة: ${selectedTime.label}`}
                  onClick={() => handleTimeRange('all')}
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
                  onClick={() => handleSearch('')}
                >
                  ✕
                </button>
              </span>
            )}
            <button className="waqt-clear-btn" onClick={clearAll}>مسح الكل</button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Events Grid
          ═══════════════════════════════════════════════════════════════ */}
      {isPending && events.length === 0 ? (
        <EventGridSkeleton count={PAGE_SIZE} />
      ) : displayEvents.length === 0 ? (
        <div className="waqt-empty">
          <p style={{ fontSize: '3rem', opacity: 0.28 }}>🔍</p>
          <p
            className="font-semibold"
            style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}
          >
            لا توجد نتائج
          </p>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              maxWidth: '300px',
              lineHeight: 1.75,
            }}
          >
            جرّب البحث بكلمة مختلفة أو تغيير الفلاتر.
          </p>
        </div>
      ) : (
        <div
          className="waqt-grid"
          aria-busy={isPending}
          style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity var(--transition-base)' }}
        >
          {displayEvents.map((ev, i) => (
            <EventCard key={ev.slug} event={ev} priority={i < 6} index={i} />
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Load More
          ═══════════════════════════════════════════════════════════════ */}
      {cursor !== null && !isPending && (
        <div
          className="flex flex-col items-center"
          style={{ marginTop: 'var(--space-8)', gap: 'var(--space-2)' }}
        >
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="waqt-btn waqt-btn-surface"
          >
            تحميل المزيد
            <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 'var(--font-regular)',
                marginRight: 'var(--space-1)',
              }}
            >
              ({total - events.length} مناسبة أخرى)
            </span>
          </button>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            يُحمَّل من الخادم مباشرةً بدون إعادة تحميل الصفحة
          </p>
        </div>
      )}

      {/* Loading skeleton rows appended during load-more pagination */}
      {isPending && cursor !== null && (
        <div className="waqt-grid" style={{ marginTop: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="waqt-ev"
              style={{ minHeight: '200px', opacity: 0.45 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}