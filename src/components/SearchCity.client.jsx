/**
 * SearchCity.client.jsx — WAQT Design System v4.0
 * Single Trigger → CommandDialog pattern
 *
 * Fixes applied (v3):
 *  1. ALL countries shown in chips strip and idle list (no more slice limits)
 *  2. Geo error is a floating toast anchored to the bar — zero layout shift,
 *     auto-dismisses after 5 s, user can also dismiss with ✕
 *  3. No visible "محدد:" text — selected city shown exclusively inside the trigger
 *  4. DialogTitle added (visually hidden) to silence the Radix a11y warning
 */

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useTransition,
  memo,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Navigation,
  Loader2,
  X,
  AlertCircle,
  Globe,
  CheckCircle2,
} from 'lucide-react';

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

/*
 * DialogTitle is required by Radix UI inside every DialogContent (which
 * CommandDialog uses internally). We render it visually hidden so it satisfies
 * the a11y requirement without appearing on screen.
 */
import { DialogTitle } from '@/components/ui/dialog';

import { 
  getCountriesAction, 
  searchCitiesAction, 
  getNearestCityAction 
} from '@/app/actions/location';

import './SearchCity.css';

/* ── Constants ──────────────────────────────────────────────────────────── */
const LS_COUNTRY      = 'waqt-preferred-country';
const DEBOUNCE_MS     = 250;
const GEO_TIMEOUT_MS  = 8000;
const RESULT_LIMIT    = 50;
const GEO_TOAST_MS    = 5000; /* auto-dismiss geo error after 5 s */

/* ── Module-level country cache (lives for the tab session) ─────────────── */
let _countriesCache = null;
async function loadCountries() {
  if (_countriesCache) return _countriesCache;
  _countriesCache = await getCountriesAction();
  return _countriesCache;
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function stripDiacritics(s = '') {
  return s.replace(/[\u064B-\u065F\u0670]/g, '');
}

function highlight(text, query) {
  if (!query || !text) return text;
  const nt  = stripDiacritics(text);
  const nq  = stripDiacritics(query);
  const idx = nt.indexOf(nq);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="sc-highlight" aria-hidden="true">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function cityHref(city, mode = 'prayer') {
  if (mode === 'time-now') return `/time-now/${city.country_slug}/${city.city_slug}`;
  return `/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`;
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

const SkeletonRows = memo(function SkeletonRows() {
  return (
    <>
      {[75, 60, 85, 50].map((w, i) => (
        <div
          key={i}
          className="sc-skeleton"
          style={{ width: `${w}%` }}
          aria-hidden="true"
        />
      ))}
    </>
  );
});

const CityRow = memo(function CityRow({ city, query, showCountry, onSelect, mode }) {
  const href = cityHref(city, mode);
  const handleClick = useCallback(
    (e) => { if (onSelect) { e.preventDefault(); onSelect(city); } },
    [city, onSelect]
  );
  return (
    <CommandItem
      value={`${city.city_name_ar} ${city.city_name_en ?? ''} ${city.country_name_ar ?? ''}`}
      onSelect={() => onSelect?.(city)}
      asChild
      className="sc-item"
      aria-label={`${city.city_name_ar}${city.country_name_ar ? `، ${city.country_name_ar}` : ''}`}
    >
      <a
        href={href}
        onClick={handleClick}
        lang="ar"
        title={`${city.city_name_ar}${city.country_name_ar ? ` — ${city.country_name_ar}` : ''}`}
      >
        <span className="sc-item__icon" aria-hidden="true"><MapPin size={13} /></span>

        <span className="sc-item__body">
          <span className="sc-item__name">{highlight(city.city_name_ar, query)}</span>
          {city.city_name_en && (
            <span className="sc-item__sub" lang="en">{city.city_name_en}</span>
          )}
        </span>

        <span className="sc-item__meta">
          {showCountry && city.country_name_ar && (
            <span className="sc-item__country">{city.country_name_ar}</span>
          )}
          {city.preview && (
            <span className="sc-item__preview" aria-label={`وقت الصلاة: ${city.preview}`}>
              {city.preview}
            </span>
          )}
        </span>
      </a>
    </CommandItem>
  );
});

/* ── Geo Toast — floats over the page, never shifts layout ─────────────── */
const GeoToast = memo(function GeoToast({ type, onDismiss }) {
  /* type: 'error' | 'success' */
  const isError = type === 'error';
  return (
    <div
      className={`sc-toast sc-toast--${type}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="sc-toast__icon" aria-hidden="true">
        {isError
          ? <AlertCircle size={14} />
          : <CheckCircle2 size={14} />
        }
      </span>
      <span className="sc-toast__msg">
        {isError
          ? 'تعذّر تحديد الموقع — تأكد من منح إذن الوصول أو ابحث يدوياً'
          : 'تم تحديد موقعك بنجاح'
        }
      </span>
      <button
        type="button"
        className="sc-toast__close"
        onClick={onDismiss}
        aria-label="إغلاق"
      >
        <X size={12} aria-hidden="true" />
      </button>
    </div>
  );
});

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function SearchCity({ onSelectCity = null, initialCity = null, mode = 'prayer' }) {
  const router = useRouter();

  const [open,            setOpen]           = useState(false);
  const [countries,       setCountries]      = useState([]);
  const [selectedCountry, setSelectedCountry]= useState(null);
  const [selectedCity,    setSelectedCity]   = useState(initialCity ?? null);
  const [query,           setQuery]          = useState('');
  const [results,         setResults]        = useState([]);
  const [isSearching,     setIsSearching]    = useState(false);

  /* Geo state — toast type is 'error' | 'success' | null */
  const [geoLoading,  setGeoLoading]  = useState(false);
  const [geoToast,    setGeoToast]    = useState(null); /* 'error' | 'success' | null */

  const [isPending, startTransition] = useTransition();

  const abortRef      = useRef(null);
  const debounceRef   = useRef(null);
  const toastTimerRef = useRef(null);

  /* ── Countries ───────────────────────────────────────────────────────── */
  useEffect(() => {
    loadCountries().then(data => {
      setCountries(data);
      if (initialCity?.country_slug) {
        const m = data.find(c => c.slug === initialCity.country_slug);
        if (m) setSelectedCountry(m);
        return;
      }
      try {
        const saved = localStorage.getItem(LS_COUNTRY);
        if (saved) {
          const f = data.find(c => c.slug === saved);
          if (f) setSelectedCountry(f);
        }
      } catch { /* private browsing */ }
    });
  }, [initialCity]);

  /* ── Auto-dismiss geo toast ──────────────────────────────────────────── */
  const showToast = useCallback((type) => {
    clearTimeout(toastTimerRef.current);
    setGeoToast(type);
    toastTimerRef.current = setTimeout(() => setGeoToast(null), GEO_TOAST_MS);
  }, []);

  const dismissToast = useCallback(() => {
    clearTimeout(toastTimerRef.current);
    setGeoToast(null);
  }, []);

  /* ── Search ──────────────────────────────────────────────────────────── */
  const performSearch = useCallback(async (q, countrySlug) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (!q.trim() && !countrySlug) {
      startTransition(() => setResults([]));
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const data = await searchCitiesAction(q, RESULT_LIMIT, countrySlug);
      // Skip updates if component unmounted or aborted
      if (abortRef.current?.signal.aborted) return;
      startTransition(() => setResults(data || []));
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Search error', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const onQueryChange = useCallback((val) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(val, selectedCountry?.slug);
    }, DEBOUNCE_MS);
  }, [performSearch, selectedCountry]);

  /* ── Geolocation ─────────────────────────────────────────────────────── */
  const handleGeoLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    setGeoToast(null);
    setOpen(false); /* close dialog first so user sees the trigger update */

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const city = await getNearestCityAction(coords.latitude, coords.longitude);
          if (city) {
            setSelectedCity(city);
            showToast('success');
            if (onSelectCity) onSelectCity(city);
            else router.push(cityHref(city, mode));
          } else {
            showToast('error');
          }
        } catch (err) {
          console.error('Geo lookup failed', err);
          showToast('error');
        } finally {
          setGeoLoading(false);
        }
      },
      () => { setGeoLoading(false); showToast('error'); },
      { timeout: GEO_TIMEOUT_MS }
    );
  }, [onSelectCity, router, showToast]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleOpenDialog = useCallback(() => {
    setOpen(true);
    setQuery('');
    startTransition(() => setResults([]));
  }, []);

  const handleSelectCountry = useCallback((country) => {
    setSelectedCountry(country);
    try {
      country
        ? localStorage.setItem(LS_COUNTRY, country.slug)
        : localStorage.removeItem(LS_COUNTRY);
    } catch { /* ignore */ }
    performSearch(query, country?.slug);
  }, [performSearch, query]);

  const handleSelectCity = useCallback((city) => {
    setSelectedCity(city);
    setOpen(false);
    setQuery('');
    startTransition(() => setResults([]));
    if (onSelectCity) onSelectCity(city);
    else router.push(cityHref(city, mode));
  }, [onSelectCity, router, mode]);

  const handleClearSelection = useCallback((e) => {
    e.stopPropagation();
    setSelectedCity(null);
    setSelectedCountry(null);
  }, []);

  /* ── Cleanup ─────────────────────────────────────────────────────────── */
  useEffect(() => () => {
    clearTimeout(debounceRef.current);
    clearTimeout(toastTimerRef.current);
    abortRef.current?.abort();
  }, []);

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const showSkeleton = isSearching || isPending;
  const hasResults   = results.length > 0;
  const showEmpty    = !showSkeleton && !hasResults && query.trim().length > 0;

  const cityRows = useMemo(() =>
    results.map(city => (
      <CityRow
        key={`${city.country_slug}-${city.city_slug}`}
        city={city}
        query={query}
        showCountry={!selectedCountry}
        onSelect={handleSelectCity}
        mode={mode}
      />
    )),
    [results, query, selectedCountry, handleSelectCity, mode]
  );

  const triggerLabel = selectedCity
    ? selectedCity.city_name_ar
    : mode === 'time-now'
      ? 'ابحث عن مدينة أو دولة لمعرفة الوقت…'
      : 'ابحث عن مدينة لعرض مواقيت الصلاة…';

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <search
      className="sc-root"
      dir="rtl"
      lang="ar"
      role="search"
      aria-label="البحث عن مدينة لمعرفة مواقيت الصلاة"
    >

      {/* ── Trigger bar — position:relative so toast anchors to it ─── */}
      <div className="sc-bar">

        {/* Single trigger button */}
        <button
          type="button"
          className={`sc-trigger${selectedCity ? ' sc-trigger--selected' : ''}`}
          onClick={handleOpenDialog}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={
            selectedCity
              ? `المدينة المختارة: ${selectedCity.city_name_ar}. اضغط للتغيير`
              : 'اضغط للبحث عن مدينة'
          }
        >
          {/* Icon: search or map-pin when selected */}
          {selectedCity
            ? <MapPin size={17} className="sc-trigger__icon sc-trigger__icon--selected" aria-hidden="true" />
            : <Search  size={17} className="sc-trigger__icon" aria-hidden="true" />
          }

          <span className="sc-trigger__label">{triggerLabel}</span>

          {/* Country badge */}
          {selectedCity?.country_name_ar && (
            <span className="sc-trigger__badge">
              {selectedCity.country_name_ar}
            </span>
          )}

          {/* Clear selection */}
          {selectedCity && (
            <span
              role="button"
              tabIndex={0}
              className="sc-trigger__clear"
              onClick={handleClearSelection}
              onKeyDown={e => e.key === 'Enter' && handleClearSelection(e)}
              aria-label="مسح الاختيار"
            >
              <X size={11} aria-hidden="true" />
            </span>
          )}
        </button>

        {/* Geo button */}
        <button
          type="button"
          onClick={handleGeoLocation}
          disabled={geoLoading}
          className={`sc-geo-btn${geoLoading ? ' sc-geo-btn--loading' : ''}`}
          aria-label={geoLoading ? 'جارٍ تحديد موقعك…' : 'استخدم موقعي الحالي'}
          title="استخدم موقعي"
        >
          {geoLoading
            ? <Loader2 size={16} className="sc-geo-spinner" aria-hidden="true" />
            : <Navigation size={16} aria-hidden="true" />
          }
          <span className="sc-geo-btn__label">موقعي</span>
        </button>

        {/* Floating geo toast — anchored to .sc-bar, zero layout shift */}
        {geoToast && (
          <GeoToast type={geoToast} onDismiss={dismissToast} />
        )}
      </div>


      {/* ── Command Dialog ───────────────────────────────────────────── */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="sc-dialog"
        overlayClassName="sc-dialog-overlay"
      >
        {/*
         * DialogTitle is required by Radix UI's DialogContent for accessibility.
         * We render it visually hidden (sr-only) so screen readers announce it
         * without it appearing on screen. This fixes the console warning:
         * "DialogContent requires a DialogTitle for screen reader users."
         */}
        <DialogTitle className="sr-only">
          {mode === 'time-now' ? 'البحث عن مدينة لمعرفة الوقت الحالي' : 'البحث عن مدينة لمعرفة مواقيت الصلاة'}
        </DialogTitle>

        {/* ── Dialog header: input + country chips ──────────────────── */}
        <div className="sc-dialog-header">

          {/* Single search input row */}
          <div className="sc-dialog-input-row">
            <Search size={18} className="sc-dialog-search-icon" aria-hidden="true" />

            <CommandInput
              value={query}
              onValueChange={onQueryChange}
              placeholder={
                selectedCountry
                  ? `ابحث في ${selectedCountry.name_ar}…`
                  : 'ابحث عن مدينة أو دولة…'
              }
              className="sc-dialog-input"
              aria-label="ابحث عن مدينة"
              aria-autocomplete="list"
            />

            {query ? (
              <button
                type="button"
                className="sc-dialog-clear"
                onClick={() => onQueryChange('')}
                aria-label="مسح البحث"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : (
              <kbd className="sc-dialog-kbd" aria-label="اضغط Escape للإغلاق">Esc</kbd>
            )}
          </div>

          {/* Country filter chips — ALL countries, horizontally scrollable */}
          {countries.length > 0 && (
            <div
              className="sc-chips-row"
              role="group"
              aria-label="تصفية حسب الدولة"
            >
              {/* "All" chip — visible only when a country is active */}
              {selectedCountry && (
                <button
                  type="button"
                  className="sc-chip sc-chip--all"
                  onClick={() => handleSelectCountry(null)}
                  aria-pressed={false}
                  aria-label="عرض جميع الدول"
                >
                  <Globe size={10} aria-hidden="true" />
                  الكل
                </button>
              )}

              {/* Every country as a chip */}
              {countries.map(c => (
                <button
                  key={c.slug}
                  type="button"
                  className={`sc-chip${selectedCountry?.slug === c.slug ? ' sc-chip--active' : ''}`}
                  onClick={() => handleSelectCountry(
                    selectedCountry?.slug === c.slug ? null : c
                  )}
                  aria-pressed={selectedCountry?.slug === c.slug}
                  aria-label={`تصفية بدولة ${c.name_ar}`}
                >
                  {c.name_ar}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Results list ────────────────────────────────────────────── */}
        <CommandList
          className="sc-dialog-list"
          aria-label="نتائج البحث"
          aria-busy={showSkeleton}
        >

          {/* GPS — first item when no query is typed */}
          {!query && (
            <CommandGroup>
              <CommandItem
                value="__gps__"
                onSelect={handleGeoLocation}
                className="sc-gps-item"
                aria-label="استخدم موقعي الحالي"
              >
                <span className="sc-gps-item__icon" aria-hidden="true">
                  {geoLoading
                    ? <Loader2 size={14} className="sc-geo-spinner" />
                    : <Navigation size={14} />
                  }
                </span>
                <span className="sc-gps-item__text">
                  استخدم موقعي الحالي
                  <span className="sc-gps-item__sub">تحديد الموقع تلقائياً</span>
                </span>
              </CommandItem>
            </CommandGroup>
          )}

          {/* Loading */}
          {showSkeleton && <SkeletonRows />}

          {/* Empty */}
          {showEmpty && (
            <CommandEmpty>
              <div className="sc-empty" role="status" aria-live="polite">
                <span className="sc-empty__icon" aria-hidden="true">🔍</span>
                <span>
                  لم تُعثر أي مدن لـ «{query}»
                  {selectedCountry ? ` في ${selectedCountry.name_ar}` : ''}
                </span>
              </div>
            </CommandEmpty>
          )}

          {/* Search results */}
          {!showSkeleton && hasResults && (
            <CommandGroup
              heading={selectedCountry ? selectedCountry.name_ar : 'المدن المقترحة'}
              className="sc-group-heading"
            >
              {cityRows}
            </CommandGroup>
          )}

          {/* Idle state: ALL countries as quick-select rows */}
          {!query && !showSkeleton && countries.length > 0 && (
            <CommandGroup heading="الدول" className="sc-group-heading">
              {countries.map(c => (
                <CommandItem
                  key={c.slug}
                  value={c.name_ar}
                  onSelect={() => handleSelectCountry(
                    selectedCountry?.slug === c.slug ? null : c
                  )}
                  className="sc-item"
                  aria-label={`بحث في دولة ${c.name_ar}`}
                  aria-selected={selectedCountry?.slug === c.slug}
                >
                  <span className="sc-item__icon" aria-hidden="true">
                    <Globe size={13} />
                  </span>
                  <span className="sc-item__body">
                    <span className="sc-item__name">{c.name_ar}</span>
                  </span>
                  {selectedCountry?.slug === c.slug && (
                    <span className="sc-item__meta">
                      <CheckCircle2 size={13} className="sc-item__check" aria-hidden="true" />
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer — keyboard hints */}
        <div className="sc-dialog-footer" aria-hidden="true">
          <span className="sc-dialog-footer__hint">
            <kbd className="sc-dialog-footer__kbd">↑↓</kbd> للتنقل
          </span>
          <span className="sc-dialog-footer__hint">
            <kbd className="sc-dialog-footer__kbd">↵</kbd> للاختيار
          </span>
          <span className="sc-dialog-footer__hint">
            <kbd className="sc-dialog-footer__kbd">Esc</kbd> للإغلاق
          </span>
        </div>
      </CommandDialog>

      {/* No-JS fallback */}
      <noscript>
        <form
          method="get"
          action="/search"
          style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}
          aria-label="بحث بدون جافاسكريبت"
        >
          <input type="search" name="q" placeholder="ابحث عن مدينة…" dir="rtl" lang="ar"
            style={{ flex:1, padding:'0.75rem 1rem', borderRadius:'0.75rem',
              border:'1px solid #363D5C', background:'#1F2438', color:'#F0F4FF',
              fontFamily:'Noto Kufi Arabic, sans-serif', direction:'rtl', fontSize:'1rem' }}
          />
          <button type="submit"
            style={{ padding:'0.75rem 1.5rem', borderRadius:'0.75rem', background:'#1D4ED8',
              color:'#fff', border:'none', cursor:'pointer',
              fontFamily:'Noto Kufi Arabic, sans-serif', fontWeight:600 }}
          >بحث</button>
        </form>
      </noscript>
    </search>
  );
}