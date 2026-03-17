/**
 * components/mwaqit/CalendarSeoBlock.jsx
 *
 * Server component — rendered in the initial HTML, fully crawlable by Google.
 * Zero client JS. Placed directly above <MonthlyPrayerCalendar> in both pages.
 *
 * ── HOW TO USE — CITY PAGE ───────────────────────────────────────────────────
 * In PrayerTimesContent (app/mwaqit-al-salat/[country]/[city]/page.jsx):
 *
 *   import CalendarSeoBlock from '@/components/mwaqit/CalendarSeoBlock';
 *   import { getHijriMonthSpanFromDate, formatGregorianLabel } from '@/lib/hijri-utils';
 *
 *   // `now` is already defined in PrayerTimesContent
 *   <CalendarSeoBlock
 *     cityNameAr={cityNameAr}
 *     countryNameAr={countryNameAr}
 *     gregorianLabel={formatGregorianLabel(now)}
 *     hijriLabel={getHijriMonthSpanFromDate(now)}
 *     methodLabel={methodInfo.label}
 *   />
 *   <MonthlyPrayerCalendar ... />
 *
 * ── HOW TO USE — COUNTRY PAGE ────────────────────────────────────────────────
 * PrayerTimesContent in the country page receives country={countrySlug} (a STRING).
 * countryAr only exists in the parent CountryPrayerPage.
 *
 * ADD to the <PrayerTimesContent> call in CountryPrayerPage:
 *   countryNameAr={countryAr}     // string, e.g. "المغرب"
 *
 * UPDATE the function signature:
 *   async function PrayerTimesContent({ country, city, cityData, countryCode, countryNameAr })
 *
 * Then:
 *   <CalendarSeoBlock
 *     cityNameAr={cityData.name_ar || cityData.name_en}
 *     countryNameAr={countryNameAr}
 *     gregorianLabel={formatGregorianLabel(now)}
 *     hijriLabel={getHijriMonthSpanFromDate(now)}
 *     methodLabel={methodInfo.label}
 *   />
 *
 * ── CSS COMPLIANCE (new.css) ─────────────────────────────────────────────────
 *   .card-nested   — L2 card (bg-surface-3, border-subtle, radius-lg, shadow-xs)
 *   .badge-accent  — accent blue badge
 *   .badge-default — neutral badge
 *   .badge-info    — info badge
 *   var(--text-*)  var(--space-*)  var(--font-*)  var(--leading-*)  — all tokens
 *   No hard-coded colours or spacing.
 */

const PRAYER_BADGES = [
  { key: 'fajr',    label: 'وقت الفجر'    },
  { key: 'dhuhr',   label: 'وقت الظهر'    },
  { key: 'asr',     label: 'وقت العصر'    },
  { key: 'maghrib', label: 'وقت المغرب'   },
  { key: 'isha',    label: 'وقت العشاء'   },
  { key: 'adhan',   label: 'مواعيد الأذان' },
];

/**
 * @param {string}  props.cityNameAr      — e.g. "الرياض"
 * @param {string}  [props.countryNameAr] — e.g. "المملكة العربية السعودية"
 * @param {string}  props.gregorianLabel  — e.g. "مارس 2026"  (from formatGregorianLabel)
 * @param {string}  props.hijriLabel      — e.g. "شعبان — رمضان 1447 هـ"
 * @param {string}  props.methodLabel     — e.g. "أم القرى — المملكة العربية السعودية"
 */
export default function CalendarSeoBlock({
  cityNameAr,
  countryNameAr,
  gregorianLabel,
  hijriLabel,
  methodLabel,
}) {
  const locationStr = countryNameAr
    ? `${cityNameAr}، ${countryNameAr}`
    : cityNameAr;

  return (
    /*
      .card-nested: bg-surface-3, border-subtle, radius-lg, shadow-xs, padding-4/5
      cursor:default suppresses the :hover border-color transition — static block.
    */
    <div
      className="card-nested mb-4"
      style={{ cursor: 'default' }}
      aria-label={`تقويم مواقيت الصلاة الشهري في ${locationStr}`}
    >

      {/* ── H2 — primary keyword: تقويم مواقيت الصلاة الشهري ─────────── */}
      {/*
        H-level:
          City page:    H1=page → H2=this → H3=prayer list card
          Country page: H1=page → H2=capital section → H2=this
      */}
      <h2
        style={{
          fontSize:     'var(--text-base)',
          fontWeight:   'var(--font-bold)',
          color:        'var(--text-primary)',
          lineHeight:   'var(--leading-tight)',
          marginBottom: 'var(--space-2)',
        }}
      >
        تقويم مواقيت الصلاة الشهري في {cityNameAr}
        {gregorianLabel && (
          <span
            style={{
              color:      'var(--text-secondary)',
              fontWeight: 'var(--font-regular)',
            }}
          >
            {' '}— {gregorianLabel}
          </span>
        )}
      </h2>

      {/* ── Badge row: Gregorian + Hijri + Method ────────────────────── */}
      {(gregorianLabel || hijriLabel || methodLabel) && (
        <div
          style={{
            display:      'flex',
            flexWrap:     'wrap',
            gap:          'var(--space-2)',
            marginBottom: 'var(--space-3)',
            alignItems:   'center',
          }}
        >
          {gregorianLabel && (
            <span className="badge badge-accent">
              {gregorianLabel} ميلادي
            </span>
          )}
          {hijriLabel && (
            <span className="badge badge-default">
              {/* Tier-3: التقويم الهجري الميلادي */}
              {hijriLabel}
            </span>
          )}
          {methodLabel && (
            <span className="badge badge-info">
              {methodLabel}
            </span>
          )}
        </div>
      )}

      {/* ── Body paragraph — all keyword tiers, natural density ──────── */}
      {/*
        Tier 1: مواقيت الصلاة · أوقات الصلاة
        Tier 2: تقويم مواقيت الصلاة · جدول مواقيت الصلاة
        Tier 3: تحميل تقويم الصلاة PDF · طباعة تقويم الصلاة
                التقويم الهجري والميلادي · جدول أوقات الأذان
      */}
      <p
        style={{
          fontSize:     'var(--text-sm)',
          color:        'var(--text-secondary)',
          lineHeight:   'var(--leading-relaxed)',
          marginBottom: 'var(--space-3)',
          maxWidth:     'none',
        }}
      >
        يعرض هذا الجدول{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          تقويم مواقيت الصلاة
        </strong>{' '}
        الشهري الكامل في {locationStr}، ويشمل أوقات الصلاة الخمس اليومية طوال الشهر:
        الفجر والظهر والعصر والمغرب والعشاء، إلى جانب وقت الشروق.
        يجمع الجدول بين{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          التقويم الهجري والميلادي
        </strong>{' '}
        في عمودين متجاورين لسهولة المراجعة.
        يمكنك{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          تحميل تقويم الصلاة
        </strong>{' '}
        بصيغة PDF أو طباعته مباشرةً للاستخدام اليومي والمسجد.
        جميع{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          مواعيد الأذان
        </strong>{' '}
        محسوبة فلكياً بدقة عالية وفق الطريقة المعتمدة رسمياً في{' '}
        {countryNameAr || cityNameAr}.
      </p>

      {/* ── Keyword chips — long-tail search terms as visible badges ───── */}
      <div
        role="list"
        aria-label="أوقات الصلاة في الجدول"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1-5)' }}
      >
        {PRAYER_BADGES.map(({ key, label }) => (
          <span
            key={key}
            role="listitem"
            className="badge badge-default"
            style={{ fontSize: 'var(--text-2xs)' }}
          >
            {label}
          </span>
        ))}
        <span className="badge badge-default" style={{ fontSize: 'var(--text-2xs)' }}>
          التقويم الهجري
        </span>
        <span className="badge badge-default" style={{ fontSize: 'var(--text-2xs)' }}>
          جدول شهري
        </span>
      </div>

    </div>
  );
}