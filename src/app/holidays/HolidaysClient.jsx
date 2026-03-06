'use client';
/**
 * app/holidays/HolidaysClient.jsx
 * WAQT design tokens: .tabs .tab .tab--active .chip .chip--active .input .btn .btn-surface
 * 7 categories · country filter · load-more Server Action · useTransition
 */
import { useState, useTransition, useCallback, useDeferredValue } from 'react';
import { loadMoreEvents } from './actions';
import { PAGE_SIZE } from './constants';
import EventCard, { EventGridSkeleton } from '@/components/events/EventCard';
import { CATEGORIES } from '@/lib/holidays-engine';

const COUNTRIES = [
  { value:'all', label:'كل الدول', flag:'' },
  { value:'sa',  label:'السعودية', flag:'🇸🇦' },
  { value:'eg',  label:'مصر',      flag:'🇪🇬' },
  { value:'ma',  label:'المغرب',   flag:'🇲🇦' },
  { value:'dz',  label:'الجزائر',  flag:'🇩🇿' },
  { value:'ae',  label:'الإمارات', flag:'🇦🇪' },
  { value:'tn',  label:'تونس',     flag:'🇹🇳' },
  { value:'kw',  label:'الكويت',   flag:'🇰🇼' },
  { value:'qa',  label:'قطر',      flag:'🇶🇦' },
];

export default function HolidaysClient({ initialEvents, initialNextCursor, initialTotal }) {
  const [events,      setEvents]      = useState(initialEvents);
  const [cursor,      setCursor]      = useState(initialNextCursor);
  const [total,       setTotal]       = useState(initialTotal);
  const [category,    setCategory]    = useState('all');
  const [country,     setCountry]     = useState('all');
  const [search,      setSearch]      = useState('');
  const [isPending,   startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);

  const applyFilter = useCallback((cat, co, q) => {
    startTransition(async () => {
      const r = await loadMoreEvents(0, { category: cat, countryCode: co, search: q });
      setEvents(r.events);
      setCursor(r.nextCursor);
      setTotal(r.total);
    });
  }, []);

  const handleCategory = (v) => { setCategory(v); applyFilter(v, country, deferredSearch); };
  const handleCountry  = (v) => { setCountry(v);  applyFilter(category, v, deferredSearch); };
  const handleSearch   = (v) => { setSearch(v);   applyFilter(category, country, v); };

  const handleLoadMore = () => {
    if (!cursor) return;
    startTransition(async () => {
      const r = await loadMoreEvents(cursor, { category, countryCode: country, search: deferredSearch });
      setEvents(prev => [...prev, ...r.events]);
      setCursor(r.nextCursor);
    });
  };

  return (
    <div>
      {/* ── Category tabs ─────────────────────────────────────────────────── */}
      <nav aria-label="تصفية حسب التصنيف" style={{ marginBottom:'var(--space-5)' }}>
        <div className="tabs" role="tablist">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={category === cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`tab ${category === cat.id ? 'tab--active' : ''}`}
            >
              <span aria-hidden>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Country chips ─────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="تصفية حسب الدولة"
        className="no-scrollbar"
        style={{ display:'flex', gap:'var(--space-2)', overflowX:'auto', paddingBottom:'var(--space-1)', marginBottom:'var(--space-5)' }}
      >
        {COUNTRIES.map(c => (
          <button
            key={c.value}
            aria-pressed={country === c.value}
            onClick={() => handleCountry(c.value)}
            className={`chip flex-shrink-0 ${country === c.value ? 'chip--active' : ''}`}
          >
            {c.flag && <span aria-hidden>{c.flag}</span>}
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div className="input-group" style={{ marginBottom:'var(--space-6)' }}>
        <label htmlFor="ev-search" className="input-label">البحث في المناسبات</label>
        <div style={{ position:'relative' }}>
          <input
            id="ev-search"
            type="search"
            className="input"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="ابحث: رمضان، استقلال، بكالوريا…"
          />
          <span
            aria-hidden
            style={{ position:'absolute', top:'50%', insetInlineEnd:'var(--space-4)', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}
          >
            🔍
          </span>
        </div>
      </div>

      {/* ── Results count ─────────────────────────────────────────────────── */}
      <p
        aria-live="polite"
        aria-atomic
        style={{ fontSize:'var(--text-sm)', color:'var(--text-muted)', marginBottom:'var(--space-5)' }}
      >
        {isPending ? 'جاري البحث…' : `${events.length} من ${total} مناسبة`}
      </p>

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      {isPending && events.length === 0 ? (
        <EventGridSkeleton count={PAGE_SIZE} />
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__icon">🔍</p>
          <p className="empty-state__title">لا توجد نتائج</p>
          <p className="empty-state__description">جرّب البحث بكلمة مختلفة أو تغيير التصنيف.</p>
        </div>
      ) : (
        <div
          className="grid-auto"
          aria-busy={isPending}
          style={{ opacity: isPending ? 0.6 : 1, transition:'opacity var(--transition-base)' }}
        >
          {events.map((ev, i) => <EventCard key={ev.slug} event={ev} priority={i < 6} />)}
        </div>
      )}

      {/* ── Load More ─────────────────────────────────────────────────────── */}
      {cursor !== null && !isPending && (
        <div style={{ marginTop:'var(--space-10)', display:'flex', flexDirection:'column', alignItems:'center', gap:'var(--space-2)' }}>
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="btn btn-surface"
          >
            تحميل المزيد
            <span style={{ color:'var(--text-muted)', fontWeight:'var(--font-regular)', marginRight:'var(--space-1)' }}>
              ({total - events.length} مناسبة أخرى)
            </span>
          </button>
          <p style={{ fontSize:'var(--text-xs)', color:'var(--text-muted)' }}>
            يُحمَّل من الخادم مباشرةً بدون إعادة تحميل الصفحة
          </p>
        </div>
      )}

      {/* Loading skeleton rows appended during load-more */}
      {isPending && cursor !== null && (
        <div className="grid-auto" style={{ marginTop:'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="card"
              style={{ minHeight:'200px', background:'var(--bg-surface-2)', animation:'none', opacity:0.5 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}