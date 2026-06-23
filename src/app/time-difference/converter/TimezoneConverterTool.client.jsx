'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { Plus, X, Clock, ChevronLeft, ChevronRight, Briefcase, Moon } from 'lucide-react';

// ── City presets ──────────────────────────────────────────────────────────────
const ALL_CITIES = [
  { id: 'riyadh',    nameAr: 'الرياض',         country: 'السعودية',       tz: 'Asia/Riyadh' },
  { id: 'cairo',     nameAr: 'القاهرة',         country: 'مصر',            tz: 'Africa/Cairo' },
  { id: 'dubai',     nameAr: 'دبي',             country: 'الإمارات',       tz: 'Asia/Dubai' },
  { id: 'casablanca',nameAr: 'الدار البيضاء',  country: 'المغرب',         tz: 'Africa/Casablanca' },
  { id: 'baghdad',   nameAr: 'بغداد',           country: 'العراق',         tz: 'Asia/Baghdad' },
  { id: 'beirut',    nameAr: 'بيروت',           country: 'لبنان',          tz: 'Asia/Beirut' },
  { id: 'algiers',   nameAr: 'الجزائر',         country: 'الجزائر',        tz: 'Africa/Algiers' },
  { id: 'tunis',     nameAr: 'تونس',            country: 'تونس',           tz: 'Africa/Tunis' },
  { id: 'tripoli',   nameAr: 'طرابلس',          country: 'ليبيا',          tz: 'Africa/Tripoli' },
  { id: 'amman',     nameAr: 'عمّان',           country: 'الأردن',         tz: 'Asia/Amman' },
  { id: 'kuwait',    nameAr: 'الكويت',          country: 'الكويت',         tz: 'Asia/Kuwait' },
  { id: 'doha',      nameAr: 'الدوحة',          country: 'قطر',            tz: 'Asia/Qatar' },
  { id: 'muscat',    nameAr: 'مسقط',            country: 'عُمان',          tz: 'Asia/Muscat' },
  { id: 'paris',     nameAr: 'باريس',           country: 'فرنسا',          tz: 'Europe/Paris' },
  { id: 'london',    nameAr: 'لندن',            country: 'بريطانيا',       tz: 'Europe/London' },
  { id: 'berlin',    nameAr: 'برلين',           country: 'ألمانيا',        tz: 'Europe/Berlin' },
  { id: 'amsterdam', nameAr: 'أمستردام',        country: 'هولندا',         tz: 'Europe/Amsterdam' },
  { id: 'madrid',    nameAr: 'مدريد',           country: 'إسبانيا',        tz: 'Europe/Madrid' },
  { id: 'rome',      nameAr: 'روما',            country: 'إيطاليا',        tz: 'Europe/Rome' },
  { id: 'stockholm', nameAr: 'ستوكهولم',        country: 'السويد',         tz: 'Europe/Stockholm' },
  { id: 'istanbul',  nameAr: 'إسطنبول',         country: 'تركيا',          tz: 'Europe/Istanbul' },
  { id: 'newyork',   nameAr: 'نيويورك',         country: 'الولايات المتحدة', tz: 'America/New_York' },
  { id: 'losangeles',nameAr: 'لوس أنجلوس',     country: 'الولايات المتحدة', tz: 'America/Los_Angeles' },
  { id: 'toronto',   nameAr: 'تورنتو',          country: 'كندا',           tz: 'America/Toronto' },
  { id: 'sydney',    nameAr: 'سيدني',           country: 'أستراليا',       tz: 'Australia/Sydney' },
];

const CITY_BY_ID = Object.fromEntries(ALL_CITIES.map((c) => [c.id, c]));
const DEFAULT_SELECTED = ['riyadh', 'cairo', 'paris', 'newyork'];

// ── UTC-offset computation (accounts for DST) ─────────────────────────────────
function getUtcOffsetMinutes(tz, referenceMs) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date(referenceMs));

    const get = (type) => parseInt(parts.find((p) => p.type === type)?.value ?? '0', 10);
    const localMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));
    return Math.round((localMs - referenceMs) / 60000);
  } catch {
    return 0;
  }
}

function getLocalHour(tz, referenceMs) {
  try {
    const h = parseInt(
      new Intl.DateTimeFormat('en', { timeZone: tz, hour: '2-digit', hour12: false })
        .formatToParts(new Date(referenceMs))
        .find((p) => p.type === 'hour')?.value ?? '0',
      10,
    );
    return h % 24;
  } catch {
    return 0;
  }
}

function getLocalDayName(tz, referenceMs) {
  try {
    return new Intl.DateTimeFormat('ar', { timeZone: tz, weekday: 'short' }).format(new Date(referenceMs));
  } catch {
    return '';
  }
}

function formatLocalTime(tz, referenceMs) {
  try {
    return new Intl.DateTimeFormat('ar-u-nu-latn', {
      timeZone: tz,
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(referenceMs));
  } catch {
    return '--:--';
  }
}

function formatOffsetLabel(tz, referenceMs) {
  try {
    return new Intl.DateTimeFormat('en', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date(referenceMs)).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

function isBusiness(localHour) {
  return localHour >= 9 && localHour < 17;
}

function isNight(localHour) {
  return localHour < 7 || localHour >= 22;
}

// ── Reference MS from reference city + chosen hour ────────────────────────────
function buildReferenceMs(refTz, baseDate, sliderHour) {
  // We want: when it's sliderHour:00 in refTz on baseDate's date
  // Approximate: find today midnight UTC then adjust
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const day = baseDate.getDate();
  // Guess: UTC midnight of today, then get offset of that moment for refTz
  const utcMidnight = Date.UTC(year, month, day, 0, 0, 0);
  const offsetAtMidnight = getUtcOffsetMinutes(refTz, utcMidnight);
  // When it's sliderHour:00 in refTz: UTC = sliderHour*60 - offsetAtMidnight (both in minutes from midnight UTC)
  const utcMinutes = sliderHour * 60 - offsetAtMidnight;
  return utcMidnight + utcMinutes * 60000;
}

// ── City card ──────────────────────────────────────────────────────────────────
function CityCard({ city, referenceMs, onRemove, isReference }) {
  const localTime = formatLocalTime(city.tz, referenceMs);
  const localHour = getLocalHour(city.tz, referenceMs);
  const dayName = getLocalDayName(city.tz, referenceMs);
  const offset = formatOffsetLabel(city.tz, referenceMs);
  const business = isBusiness(localHour);
  const night = isNight(localHour);

  return (
    <div className={`tz-card ${isReference ? 'tz-card--ref' : ''} ${business ? 'tz-card--business' : ''} ${night ? 'tz-card--night' : ''}`}>
      <div className="tz-card__header">
        <div className="tz-card__city">
          <span className="tz-card__name">{city.nameAr}</span>
          <span className="tz-card__country">{city.country}</span>
        </div>
        <div className="tz-card__meta">
          <span className="tz-card__offset">{offset}</span>
          {!isReference && (
            <button
              className="tz-card__remove"
              onClick={() => onRemove(city.id)}
              aria-label={`إزالة ${city.nameAr}`}
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="tz-card__time">{localTime}</div>
      <div className="tz-card__footer">
        <span className="tz-card__day">{dayName}</span>
        <span className={`tz-card__status ${business ? 'tz-card__status--ok' : night ? 'tz-card__status--night' : ''}`}>
          {business ? (
            <><Briefcase size={11} /> وقت العمل</>
          ) : night ? (
            <><Moon size={11} /> وقت النوم</>
          ) : null}
        </span>
      </div>
    </div>
  );
}

// ── Hour timeline bar ──────────────────────────────────────────────────────────
function HourBar({ label, tz, referenceMs }) {
  return (
    <div className="tz-hourbar" aria-hidden="true">
      <span className="tz-hourbar__label">{label}</span>
      <div className="tz-hourbar__slots">
        {Array.from({ length: 24 }, (_, h) => {
          const slotMs = referenceMs + (h - getLocalHour(tz, referenceMs)) * 3600000;
          const slotHour = getLocalHour(tz, slotMs);
          const business = isBusiness(slotHour);
          const night = isNight(slotHour);
          const current = slotHour === getLocalHour(tz, referenceMs);
          return (
            <div
              key={h}
              className={`tz-slot ${business ? 'tz-slot--biz' : ''} ${night ? 'tz-slot--night' : ''} ${current ? 'tz-slot--current' : ''}`}
              title={`${slotHour}:00`}
            >
              {(slotHour % 6 === 0) && (
                <span className="tz-slot__label">{slotHour === 0 ? 'منتصف ليل' : slotHour === 12 ? 'ظهر' : `${slotHour}`}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── City picker modal / dropdown ───────────────────────────────────────────────
function CityPicker({ selectedIds, onSelect }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const available = ALL_CITIES.filter(
    (c) => !selectedIds.includes(c.id) &&
      (filter === '' || c.nameAr.includes(filter) || c.country.includes(filter)),
  );

  return (
    <div className="tz-picker">
      <button
        className="tz-picker__trigger"
        onClick={() => setOpen((o) => !o)}
        disabled={selectedIds.length >= 4}
        type="button"
      >
        <Plus size={16} />
        <span>إضافة مدينة</span>
      </button>

      {open && (
        <div className="tz-picker__dropdown">
          <input
            className="tz-picker__search"
            placeholder="ابحث عن مدينة..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
            dir="rtl"
          />
          <div className="tz-picker__list">
            {available.map((city) => (
              <button
                key={city.id}
                className="tz-picker__option"
                type="button"
                onClick={() => { onSelect(city.id); setOpen(false); setFilter(''); }}
              >
                <span className="tz-picker__option-name">{city.nameAr}</span>
                <span className="tz-picker__option-country">{city.country}</span>
              </button>
            ))}
            {available.length === 0 && (
              <p className="tz-picker__empty">لا نتائج</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main tool ──────────────────────────────────────────────────────────────────
export default function TimezoneConverterTool() {
  const today = useMemo(() => new Date(), []);

  const [selectedIds, setSelectedIds] = useState(DEFAULT_SELECTED);
  const [refId, setRefId] = useState(DEFAULT_SELECTED[0]);
  const [sliderHour, setSliderHour] = useState(() => {
    const refCity = CITY_BY_ID[DEFAULT_SELECTED[0]];
    return getLocalHour(refCity.tz, Date.now());
  });

  const refCity = CITY_BY_ID[refId] ?? ALL_CITIES[0];

  const referenceMs = useMemo(
    () => buildReferenceMs(refCity.tz, today, sliderHour),
    [refCity.tz, today, sliderHour],
  );

  const addCity = useCallback((id) => {
    setSelectedIds((prev) => prev.length < 4 ? [...prev, id] : prev);
  }, []);

  const removeCity = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = prev.filter((s) => s !== id);
      if (id === refId && next.length > 0) setRefId(next[0]);
      return next;
    });
  }, [refId]);

  const stepHour = useCallback((delta) => {
    setSliderHour((h) => ((h + delta + 24) % 24));
  }, []);

  const selectedCities = selectedIds.map((id) => CITY_BY_ID[id]).filter(Boolean);

  return (
    <div className="tz-converter" dir="rtl">
      {/* Reference picker + hour stepper */}
      <div className="tz-controls">
        <div className="tz-controls__ref">
          <Clock size={16} />
          <span>توقيت</span>
          <select
            className="tz-controls__ref-select"
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            aria-label="المدينة المرجعية"
          >
            {selectedCities.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </select>
        </div>

        <div className="tz-controls__stepper">
          <button
            className="tz-controls__step-btn"
            onClick={() => stepHour(-1)}
            aria-label="ساعة أقل"
            type="button"
          >
            <ChevronRight size={18} />
          </button>
          <span className="tz-controls__hour">
            {sliderHour === 0 ? 'منتصف الليل' : sliderHour === 12 ? 'الظهر' : sliderHour < 12 ? `${sliderHour}:00 ص` : `${sliderHour - 12}:00 م`}
          </span>
          <button
            className="tz-controls__step-btn"
            onClick={() => stepHour(1)}
            aria-label="ساعة أكثر"
            type="button"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        <input
          className="tz-controls__slider"
          type="range"
          min={0}
          max={23}
          value={sliderHour}
          onChange={(e) => setSliderHour(Number(e.target.value))}
          aria-label="اختر الساعة"
          dir="ltr"
        />
      </div>

      {/* Hour timeline bars */}
      <div className="tz-timelines">
        {selectedCities.map((city) => (
          <HourBar
            key={city.id}
            label={city.nameAr}
            tz={city.tz}
            referenceMs={referenceMs}
          />
        ))}
      </div>

      {/* City cards */}
      <div className="tz-cards">
        {selectedCities.map((city) => (
          <CityCard
            key={city.id}
            city={city}
            referenceMs={referenceMs}
            onRemove={removeCity}
            isReference={city.id === refId}
          />
        ))}

        {selectedIds.length < 4 && (
          <CityPicker selectedIds={selectedIds} onSelect={addCity} />
        )}
      </div>

      {/* Legend */}
      <div className="tz-legend">
        <span className="tz-legend__item tz-legend__item--biz">وقت العمل (9ص–5م)</span>
        <span className="tz-legend__item tz-legend__item--night">وقت نوم (10م–7ص)</span>
        <span className="tz-legend__item">غير محدد</span>
      </div>
    </div>
  );
}
