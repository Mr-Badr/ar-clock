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
import { toast } from 'sonner';

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

import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';

import './SearchCity.css';

/* ── Constants ──────────────────────────────────────────────────────────── */
const LS_COUNTRY = 'waqt-preferred-country';
const DEBOUNCE_MS = 150;
const GEO_TIMEOUT_MS = 8000;
const RESULT_LIMIT = 50;
const GEO_TOAST_MS = 5000; /* auto-dismiss geo error after 5 s */

/* ── Module-level country cache (lives for the tab session) ─────────────── */
let _countriesCache = null;
async function loadCountries() {
  if (_countriesCache) return _countriesCache;
  _countriesCache = await getCountriesAction();
  return _countriesCache;
}

/* ── Module-level city cache per country ── */
const _countryCitiesCache = new Map();

async function loadCitiesForCountry(countrySlug) {
  if (!countrySlug) return [];
  if (_countryCitiesCache.has(countrySlug)) return _countryCitiesCache.get(countrySlug);
  try {
    const res = await fetch(`/api/cities-by-country?country=${countrySlug}`);
    if (res.status === 404) {
      // Country not in DB — cache empty so we don't retry on every keystroke
      _countryCitiesCache.set(countrySlug, []);
      return [];
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    _countryCitiesCache.set(countrySlug, data);
    return data;
  } catch (err) {
    console.warn(`[SearchCity] Could not load cities for "${countrySlug}":`, err.message);
    return [];
  }
}

/* ── Arabic Normalization & Flag Helper ─────────────────────────────────── */
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode === 'unknown') return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}

function normalizeArabic(s = '') {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    // Remove tashkeel (diacritics) and tatweel (kashida)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    // Remove all punctuation and symbols (typing mistakes)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"'?:؛،؟]/g, ' ')
    // Strip definite article 'ال' at start of ANY word
    .replace(/(^|\s)ال/g, '$1')
    .trim()
    // Collapse multiple spaces into one to avoid matching issues
    .replace(/\s+/g, ' ');
}

function filterCitiesLocally(cities, q) {
  if (!q.trim()) return cities.slice(0, 80); // Show more when idle
  const normalizedQuery = normalizeArabic(q);

  return cities
    .filter(city => {
      const cityAr = normalizeArabic(city.city_name_ar);
      const cityEn = (city.city_name_en || '').toLowerCase();
      const countryAr = normalizeArabic(city.country_name_ar || '');
      // Support English search terms but show Arabic
      const qLower = normalizedQuery.toLowerCase();
      // We check both Arabic and English normalized versions
      return cityAr.includes(normalizedQuery) || cityEn.includes(qLower) || countryAr.includes(normalizedQuery);
    })
    .sort((a, b) => {
      const aAr = normalizeArabic(a.city_name_ar);
      const bAr = normalizeArabic(b.city_name_ar);
      const aStarts = aAr.startsWith(normalizedQuery);
      const bStarts = bAr.startsWith(normalizedQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      if (a.is_capital && !b.is_capital) return -1;
      if (!a.is_capital && b.is_capital) return 1;

      return (b.priority || 0) - (a.priority || 0) || (b.population || 0) - (a.population || 0);
    })
    .slice(0, 80);
}

function filterCountriesLocally(countries, q) {
  if (!q.trim()) return [];
  const normalizedQuery = normalizeArabic(q);

  return countries
    .filter(c => {
      const cAr = normalizeArabic(c.name_ar);
      const cEn = (c.name_en || '').toLowerCase();
      const qLower = normalizedQuery.toLowerCase();
      return cAr.includes(normalizedQuery) || cEn.includes(qLower);
    })
    .sort((a, b) => {
      const aAr = normalizeArabic(a.name_ar);
      const bAr = normalizeArabic(b.name_ar);
      const aStarts = aAr.startsWith(normalizedQuery);
      const bStarts = bAr.startsWith(normalizedQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0; // Maintain original sorted order if both match similarly
    })
    .slice(0, 5); // Max 5 country suggestions
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
function stripDiacritics(s = '') {
  return s.replace(/[\u064B-\u065F\u0670]/g, '');
}

function highlight(text, query) {
  if (!query || !text) return text;
  const nt = stripDiacritics(text);
  const nq = stripDiacritics(query);
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
      value={`${city.city_name_ar} ${city.city_name_en ?? ''} ${city.country_name_ar ?? ''} ${city.city_slug} ${city.country_slug}`}
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
          <span className="sc-item__name">
            {city.country_code && (
              <span className="sc-item__flag" aria-hidden="true" style={{ marginLeft: '0.4rem', fontSize: '1.2em' }}>
                {getFlagEmoji(city.country_code)}
              </span>
            )}
            {highlight(city.city_name_ar, query)}
          </span>
          {/* We don't care if user searches in English, we only show Arabic names now */}
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

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function SearchCity({
  onSelectCity = null,
  initialCity = null,
  mode = 'prayer',
  preloadedCountries = null
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState(preloadedCountries || []);
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(initialCity ?? null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [countryMatches, setCountryMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchEverywhere, setSearchEverywhere] = useState(false);

  /* Geo state — toast type is 'error' | 'success' | null */
  const [geoLoading, setGeoLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  /* ── Derived Lists ───────────────────────────────────────────────────── */
  const mainCountriesSlugs = useMemo(() => [
    ...PRIORITY_COUNTRY_SLUGS,
    ...GLOBAL_POPULAR_COUNTRIES,
  ], []);

  const visibleCountries = useMemo(() => {
    if (showAllCountries) return countries;
    return countries.filter(c => mainCountriesSlugs.includes(c.slug));
  }, [countries, showAllCountries, mainCountriesSlugs]);

  /* ── Countries ───────────────────────────────────────────────────────── */
  useEffect(() => {
    async function initCountries() {
      // If we already have the countries (passed from Server Component), use them immediately
      let data = preloadedCountries;
      if (data && data.length > 0) {
        setCountries(data);
      } else {
        // Fallback: load them over the network
        data = await loadCountries();
        startTransition(() => {
          setCountries(data);
        });
      }

      // Check initial city or localStorage preferences
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
    }
    initCountries();
  }, [initialCity, preloadedCountries]);

  // Pre-warm priority countries silently in the background on mount
  useEffect(() => {
    mainCountriesSlugs.forEach(slug => {
      loadCitiesForCountry(slug);
    });
  }, [mainCountriesSlugs]);

  /* ── Search ──────────────────────────────────────────────────────────── */
  const performSearch = useCallback(async (q, countrySlug, forceGlobal = false) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (!q.trim() && !countrySlug && !forceGlobal) {
      startTransition(() => {
        setResults([]);
        setCountryMatches([]);
      });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchEverywhere(forceGlobal);

    // Filter countries if no specific country is selected
    if (!countrySlug && !forceGlobal) {
      startTransition(() => {
        setCountryMatches(filterCountriesLocally(countries, q));
      });
    } else {
      startTransition(() => {
        setCountryMatches([]);
      });
    }
    try {
      // MODE: Country selected -> Use local cache
      if (countrySlug && !forceGlobal) {
        const allCities = await loadCitiesForCountry(countrySlug);
        const filtered = filterCitiesLocally(allCities, q);
        startTransition(() => setResults(filtered));
        setIsSearching(false);
        return;
      }

      // MODE: Global search -> Hit API & Local Caches (Multi-Layer)

      // Layer 1: Search local caches immediately
      let localMatches = [];
      const allCachedCities = [];
      _countryCitiesCache.forEach(cities => {
        allCachedCities.push(...cities);
      });
      if (allCachedCities.length > 0) {
        localMatches = filterCitiesLocally(allCachedCities, q);
        // Show local matches immediately while API is fetching
        if (localMatches.length > 0) {
          startTransition(() => setResults(localMatches));
        }
      }

      // Layer 2: API Search
      const apiPromise = fetch(`/api/search-city?q=${encodeURIComponent(q)}`, {
        signal: abortRef.current.signal
      }).then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      }).catch(err => {
        if (err.name !== 'AbortError') console.error('Search error', err);
        return [];
      });

      const apiData = await apiPromise;

      // Merge and deduplicate
      const merged = [...localMatches];
      const seenSlugs = new Set(localMatches.map(c => c.city_slug));

      for (const city of (apiData || [])) {
        if (!seenSlugs.has(city.city_slug)) {
          seenSlugs.add(city.city_slug);
          merged.push(city);
        }
      }

      // Re-sort the merged list to ensure priority and population rank is preserved across local + API
      merged.sort((a, b) => {
        const nq = normalizeArabic(q);
        const aAr = normalizeArabic(a.city_name_ar);
        const bAr = normalizeArabic(b.city_name_ar);
        const aStarts = aAr.startsWith(nq);
        const bStarts = bAr.startsWith(nq);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        if (a.is_capital && !b.is_capital) return -1;
        if (!a.is_capital && b.is_capital) return 1;

        return (b.priority || 0) - (a.priority || 0) || (b.population || 0) - (a.population || 0);
      });

      startTransition(() => setResults(merged.slice(0, 80)));
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
    setOpen(false); /* close dialog first so user sees the trigger update */

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const city = await getNearestCityAction(coords.latitude, coords.longitude);
          if (city) {
            setSelectedCity(city);
            toast.success('تم تحديد موقعك بنجاح');
            if (onSelectCity) onSelectCity(city);
            else router.push(cityHref(city, mode));
          } else {
            toast.error('تعذّر تحديد الموقع — تأكد من منح إذن الوصول أو ابحث يدوياً');
          }
        } catch (err) {
          console.error('Geo lookup failed', err);
          toast.error('تعذّر تحديد الموقع — تأكد من منح إذن الوصول أو ابحث يدوياً');
        } finally {
          setGeoLoading(false);
        }
      },
      () => { setGeoLoading(false); toast.error('تعذّر تحديد الموقع — تأكد من منح إذن الوصول أو ابحث يدوياً'); },
      { timeout: GEO_TIMEOUT_MS }
    );
  }, [onSelectCity, router, mode]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const handleOpenDialog = useCallback(() => {
    setOpen(true);
    setQuery('');
    startTransition(() => {
      setResults([]);
      setSearchEverywhere(false);
    });
  }, []);

  const handleSelectCountry = useCallback(async (country) => {
    setSelectedCountry(country);
    try {
      country
        ? localStorage.setItem(LS_COUNTRY, country.slug)
        : localStorage.removeItem(LS_COUNTRY);
    } catch { /* ignore */ }

    // Trigger load and search
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
    abortRef.current?.abort();
  }, []);

  /* ── Derived ─────────────────────────────────────────────────────────── */
  const showSkeleton = isSearching || isPending;
  const hasResults = results.length > 0;
  const showEmpty = !showSkeleton && !hasResults && query.trim().length > 0 && !searchEverywhere;

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
    : mode === 'mwaqit-al-salat'
      ? 'ابحث عن مدينة لعرض مواقيت الصلاة…'
      : 'ابحث عن مدينة أو دولة لمعرفة الوقت…';

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
            : <Search size={17} className="sc-trigger__icon" aria-hidden="true" />
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
      </div>


      {/* ── Command Dialog ───────────────────────────────────────────── */}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
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

          {/* Country filter chips — horizontal strip */}
          {visibleCountries.length > 0 && (
            <div
              className="sc-chips-row"
              role="group"
              aria-label="تصفية حسب الدولة"
            >
              {/* "All" chip — visible only when a country is active or showAllCountries is false */}
              {(selectedCountry || showAllCountries) && (
                <button
                  type="button"
                  className="sc-chip sc-chip--all"
                  onClick={() => {
                    handleSelectCountry(null);
                    setShowAllCountries(false);
                  }}
                  aria-pressed={false}
                  aria-label="عرض جميع الدول"
                >
                  <Globe size={10} aria-hidden="true" />
                  {showAllCountries ? 'الرئيسية' : 'جميع الدول'}
                </button>
              )}

              {/* Every visible country as a chip */}
              {visibleCountries.map(c => (
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
                  <span style={{ marginLeft: '0.4rem' }}>{getFlagEmoji(c.country_code)}</span>
                  {c.name_ar}
                </button>
              ))}

              {!showAllCountries && (
                <button
                  type="button"
                  className="sc-chip sc-chip--more"
                  onClick={() => setShowAllCountries(true)}
                  aria-label="عرض المزيد من الدول"
                >
                  المزيد...
                </button>
              )}
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

          {/* Empty state with "Search Database" button */}
          {showEmpty && (
            <CommandEmpty>
              <div className="sc-empty" role="status" aria-live="polite">
                <span className="sc-empty__icon" aria-hidden="true">📍</span>
                <p className="sc-empty__text">
                  {selectedCountry
                    ? `عذراً، لم نجد نتائج في ${selectedCountry.name_ar}.`
                    : `عذراً، لم نجد نتائج تطابق «${query}»`
                  }
                </p>
                <p className="sc-empty__sub">
                  تأكد من كتابة الاسم بشكل صحيح أو ابحث في قاعدة البيانات الشاملة.
                </p>
                <button
                  type="button"
                  className="sc-search-global-btn"
                  onClick={() => performSearch(query, null, true)}
                >
                  البحث في قاعدة البيانات الشاملة
                </button>
              </div>
            </CommandEmpty>
          )}

          {/* Country Matches */}
          {!showSkeleton && countryMatches.length > 0 && (
            <CommandGroup heading="دول مطابقة" className="sc-group-heading">
              {countryMatches.map(c => (
                <CommandItem
                  key={`match-${c.slug}`}
                  value={c.name_ar}
                  onSelect={() => handleSelectCountry(c)}
                  className="sc-item"
                  aria-label={`تحديد دولة ${c.name_ar}`}
                >
                  <span className="sc-item__icon" aria-hidden="true">
                    {getFlagEmoji(c.country_code)}
                  </span>
                  <span className="sc-item__body">
                    <span className="sc-item__name">{highlight(c.name_ar, query)}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Search results */}
          {!showSkeleton && hasResults && (
            <CommandGroup
              heading={selectedCountry ? selectedCountry.name_ar : 'النتائج'}
              className="sc-group-heading"
            >
              {cityRows}
            </CommandGroup>
          )}


          {/* Idle state: prioritized list of countries */}
          {!query && !showSkeleton && visibleCountries.length > 0 && (
            <CommandGroup heading={showAllCountries ? "جميع الدول" : "الدول والأماكن الأكثر بحثاً"} className="sc-group-heading">
              {visibleCountries.map(c => (
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
                    {getFlagEmoji(c.country_code)}
                  </span>
                  <span className="sc-item__body">
                    <span className="sc-item__name">{c.name_ar}</span>
                    <span className="sc-item__sub" lang="en" style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                      {mainCountriesSlugs.includes(c.slug) ? 'وصول سريع' : ''}
                    </span>
                  </span>
                  {selectedCountry?.slug === c.slug && (
                    <span className="sc-item__meta">
                      <CheckCircle2 size={13} className="sc-item__check" aria-hidden="true" />
                    </span>
                  )}
                </CommandItem>
              ))}
              {!showAllCountries && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowAllCountries(true)}
                  onKeyDown={(e) => e.key === 'Enter' && setShowAllCountries(true)}
                  className="sc-browse-all-btn"
                  aria-label="تصفح جميع دول العالم"
                >
                  <Globe size={15} style={{ marginLeft: '0.4rem', flexShrink: 0 }} />
                  <span>تصفح جميع دول العالم ({countries.length})</span>
                </div>
              )}
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
            style={{
              flex: 1, padding: '0.75rem 1rem', borderRadius: '0.75rem',
              border: '1px solid #363D5C', background: '#1F2438', color: '#F0F4FF',
              fontFamily: 'Noto Kufi Arabic, sans-serif', direction: 'rtl', fontSize: '1rem'
            }}
          />
          <button type="submit"
            style={{
              padding: '0.75rem 1.5rem', borderRadius: '0.75rem', background: '#1D4ED8',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'Noto Kufi Arabic, sans-serif', fontWeight: 600
            }}
          >بحث</button>
        </form>
      </noscript>
    </search>
  );
}