/**
 * lib/hijri-utils.js
 *
 * Shared Hijri calendar utilities — zero external dependencies.
 *
 * ── WHY NOT moment-hijri ──────────────────────────────────────────────────────
 * moment-hijri requires moment.js as a peer dependency.
 * moment = 290 KB minified / 72 KB gzipped, not tree-shakeable, officially
 * deprecated by its own maintainers ("discourage Moment from being used in
 * new projects going forward" — momentjs.com/docs).
 *
 * Native Intl.DateTimeFormat with ca-islamic-umalqura:
 *   ✅  0 KB  — built into Node.js 13+ and every modern browser
 *   ✅  Same Umm al-Qura calculation engine (both use ICU data tables)
 *   ✅  nu-latn extension forces English (Latin) numerals — critical for this app
 *   ✅  Works identically on server (Next.js RSC) and client
 *   ✅  Already used throughout this codebase (time-engine.js, prayer.js)
 *
 * Your existing code: time-engine.js uses Luxon, prayer.js uses adhan.js —
 * neither uses moment.js. moment-hijri would be a new 300 KB addition with
 * no accuracy benefit.
 *
 * ── NUMERAL RULE ─────────────────────────────────────────────────────────────
 * Arabic app standard: English (Western) numerals for all numbers,
 * Arabic text for all month/day names.
 *
 * Achieved via:
 *   'ar-EG-u-nu-latn'                          → Arabic months, English year
 *   'ar-SA-u-ca-islamic-umalqura-nu-latn'       → Arabic Hijri month names, English digits
 *   'en' with hour12:false                       → English time digits (HH:MM)
 *   Raw JS integer (date.getDate())              → English day number
 *
 * ── SERVER / CLIENT SAFE ─────────────────────────────────────────────────────
 * Pure JS, no imports — safe in any Next.js context.
 */

// ─── Arabic Hijri month names (1-indexed array) ───────────────────────────────
/**
 * Hardcoded because Intl month names from 'ar-SA-u-ca-islamic-umalqura'
 * include diacritics in some Node.js/V8 versions that differ across environments.
 * Hardcoding guarantees consistent Arabic spelling across server and client,
 * across all Node.js versions, and is always correct regardless of ICU locale data.
 *
 * Index 0 = محرم (month 1), Index 11 = ذو الحجة (month 12)
 */
export const HIJRI_MONTHS_AR = [
  'محرم',          // 1
  'صفر',           // 2
  'ربيع الأول',    // 3
  'ربيع الآخر',    // 4
  'جمادى الأولى',  // 5
  'جمادى الآخرة',  // 6
  'رجب',           // 7
  'شعبان',         // 8
  'رمضان',         // 9
  'شوال',          // 10
  'ذو القعدة',     // 11
  'ذو الحجة',      // 12
];

// ─── Intl formatters (module-level singletons for performance) ────────────────
// Creating Intl.DateTimeFormat is expensive. Reusing the same instance is
// significantly faster when called 31 times for a month calendar.
// These run in module scope so they are created once and reused.
const _hijriNumFmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
  day: 'numeric', month: 'numeric', year: 'numeric',
});

// ─── getDaysInCurrentMonth ────────────────────────────────────────────────────
/**
 * Returns a Date[] for every day in the current Gregorian month.
 * Used by MonthlyPrayerCalendar and Hijri span calculations.
 *
 * @returns {Date[]}
 */
export function getDaysInCurrentMonth() {
  const now   = new Date();
  const y     = now.getFullYear();
  const m     = now.getMonth();
  const count = new Date(y, m + 1, 0).getDate();
  return Array.from({ length: count }, (_, i) => new Date(y, m, i + 1));
}

// ─── getHijriParts ────────────────────────────────────────────────────────────
/**
 * Extracts Hijri date parts for one Gregorian date.
 * All numeric values use English (Latin) digits via nu-latn.
 *
 * @param  {Date} date
 * @returns {{
 *   hijriDay:       number,   — day of Hijri month (1–30), English numeral
 *   hijriMonthNum:  number,   — Hijri month 1–12 (for comparison across rows)
 *   hijriMonthName: string,   — Arabic month name from HIJRI_MONTHS_AR
 *   hijriYear:      number    — full Hijri year e.g. 1447, English numeral
 * }}
 */
export function getHijriParts(date) {
  try {
    const parts = _hijriNumFmt.formatToParts(date);
    const get   = (type) => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);

    const monthNum = get('month');          // 1–12, always English via nu-latn
    return {
      hijriDay:       get('day'),
      hijriMonthNum:  monthNum,
      hijriMonthName: HIJRI_MONTHS_AR[monthNum - 1] ?? '',   // Arabic name
      hijriYear:      get('year'),
    };
  } catch {
    return { hijriDay: 0, hijriMonthNum: 0, hijriMonthName: '', hijriYear: 0 };
  }
}

// ─── getHijriMonthSpan ────────────────────────────────────────────────────────
/**
 * Returns an Arabic Hijri span label for an array of Gregorian dates.
 * A Gregorian month almost always crosses two Hijri months.
 *
 * @param  {Date[]} days — one Date per calendar day
 * @returns {string}     — e.g. "شعبان — رمضان 1447 هـ"  or  "رمضان 1447 هـ"
 *
 * Year is always taken from the last day so e.g. January spanning
 * two Hijri years shows the later year (more intuitive for users).
 */
export function getHijriMonthSpan(days) {
  if (!days.length) return '';
  try {
    const first  = getHijriParts(days[0]);
    const last   = getHijriParts(days[days.length - 1]);
    const sameMonth = first.hijriMonthNum === last.hijriMonthNum
                   && first.hijriYear     === last.hijriYear;
    return sameMonth
      ? `${first.hijriMonthName} ${last.hijriYear} هـ`
      : `${first.hijriMonthName} — ${last.hijriMonthName} ${last.hijriYear} هـ`;
  } catch {
    return '';
  }
}

// ─── getHijriMonthSpanFromDate ────────────────────────────────────────────────
/**
 * Server-side shortcut: Hijri span label for the Gregorian month of `date`.
 * Call with `now` inside PrayerTimesContent — no extra computation needed.
 *
 * @param  {Date} date — any date in the target Gregorian month
 * @returns {string}
 */
export function getHijriMonthSpanFromDate(date) {
  const y     = date.getFullYear();
  const m     = date.getMonth();
  const count = new Date(y, m + 1, 0).getDate();
  return getHijriMonthSpan(
    Array.from({ length: count }, (_, i) => new Date(y, m, i + 1))
  );
}

// ─── formatGregorianLabel ─────────────────────────────────────────────────────
/**
 * Returns the Gregorian month+year label in Arabic with English numerals.
 * e.g. "مارس 2026"  (Arabic month name, English year)
 *
 * @param  {Date} date
 * @returns {string}
 */
export function formatGregorianLabel(date) {
  // ar-EG-u-nu-latn:
  //   ar-EG   → Arabic locale (Egyptian Arabic — most widely understood)
  //   nu-latn → Latin/English numerals (0-9) for the year
  //   Result:  "مارس 2026"  not  "مارس ٢٠٢٦"
  return date.toLocaleDateString('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' });
}