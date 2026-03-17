# waqt.app — Engineering Task Brief
## Codebase Audit & Modernisation: Prayer Engine, Date/Time, Moment.js Migration

**Assigned to:** Antigravity AI  
**Priority:** Critical — Production Correctness  
**Scope:** Full codebase audit + targeted fixes — do not rewrite working logic, only correct what is wrong or missing

---

## 1. Context — What This App Is

`waqt.app` is a production Arabic Islamic web app built with **Next.js App Router + Tailwind CSS 4 + shadcn/ui**. It is designed to become the top Arabic Islamic website globally. It currently serves:

- **Prayer times** for hundreds of cities across all countries, with real-time countdown to the next prayer
- **Monthly prayer calendar** (تقويم مواقيت الصلاة) per city
- **Hijri / Gregorian dual-calendar display**
- **Countdown events** in different Islamic categories and countries
- **Multiple madhab support** (Shafi, Maliki, Hanbali, Hanafi)

The app is RTL Arabic with **English (Latin) numerals for all digits** and **Arabic text for all month/day names**. This is a hard rule throughout.

---

## 2. Current Tech Stack (Do Not Change These)

| Concern | Library | Status |
|---|---|---|
| Prayer time calculation | `adhan` (npm) | ✅ Keep — industry standard |
| Time zone formatting | `Luxon` (via `time-engine.js`) | ✅ Keep |
| Hijri dates | `Intl.DateTimeFormat` with `ca-islamic-umalqura-nu-latn` | ✅ Correct — see Section 4 |
| Date arithmetic / countdown | `moment.js` | ❌ **Must be migrated** — see Section 5 |
| UI | Next.js + Tailwind 4 + shadcn/ui | ✅ Keep |

---

## 3. Prayer Engine — adhan.js — Critical Fixes Required

### 3.1 What adhan.js Is and Why It Is Correct

`adhan` is the standard JavaScript library for Islamic prayer time calculation. It is:
- Based on *Astronomical Algorithms* by Jean Meeus (recommended by the U.S. Naval Observatory)
- Used internally by AlAdhan.com
- The only library that correctly implements all recognised calculation methods: `UmmAlQura`, `Egyptian`, `Karachi`, `Dubai`, `Qatar`, `Kuwait`, `Singapore`, `Turkey`, `Tehran`, `MoonsightingCommittee`, `NorthAmerica`, `MuslimWorldLeague`
- Supports all four Sunni madhabs for Asr: `Madhab.Shafi` (= Maliki, Hanbali) and `Madhab.Hanafi`

**Do not replace adhan.js with any other library.**

---

### 3.2 Fix 1 — Polar Circle Resolution (CRITICAL — currently missing)

**The bug:** For cities above approximately **48° N latitude**, the sun never sets (summer) or never rises (winter) on certain days. Without handling this, adhan.js returns `undefined` or wildly incorrect times for Fajr and Isha.

**Affected cities in your database:** Any city in the UK, Norway, Sweden, Finland, Denmark, Iceland, Russia, Canada, northern Germany, northern France, Belgium, Netherlands, and similar latitudes.

**The fix:** In your `prayerEngine.js` (or wherever `CalculationParameters` is constructed), add both `polarCircleResolution` AND `highLatitudeRule` based on the city's latitude.

```js
import {
  Coordinates, PrayerTimes, CalculationMethod,
  Madhab, PolarCircleResolution, HighLatitudeRule
} from 'adhan';

function buildParams(method, madhab, lat) {
  const params = CalculationMethod[method]
    ? CalculationMethod[method]()
    : CalculationMethod.MuslimWorldLeague();

  // Madhab for Asr — only Hanafi differs; Shafi covers Maliki and Hanbali
  params.madhab = madhab === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;

  // Polar circle: above 48°N, sun may not cross the prayer angle threshold
  // AqrabYaum = use nearest day where normal sunrise/sunset occurs (most widely accepted)
  // This MUST be set before PolarCircleResolution matters at runtime
  if (Math.abs(lat) >= 48) {
    params.polarCircleResolution = PolarCircleResolution.AqrabYaum;
  }

  // High latitude rule: prevents impossibly early Fajr or late Isha
  // HighLatitudeRule.recommended() reads the coordinates and picks the best rule automatically
  // Apply for all cities above 48° — the recommended() function handles the exact threshold
  if (Math.abs(lat) >= 48) {
    params.highLatitudeRule = HighLatitudeRule.recommended(new Coordinates(lat, 0));
  }

  return params;
}
```

**Rules:**
- `polarCircleResolution` = what to do when the sun literally never crosses the prayer angle (arctic/extreme latitudes)
- `highLatitudeRule` = a softer constraint that caps Fajr/Isha to reasonable windows even before the polar extreme
- Both should be applied together above 48°N/S
- `HighLatitudeRule.recommended(coords)` is the official adhan.js function — always use it over hardcoding a rule

---

### 3.3 Fix 2 — Date Passed to adhan.js Must Be Local Calendar Date

**The bug:** adhan.js uses only the year/month/day of the `Date` object you pass in. If you pass `new Date()` on a server in UTC, at midnight UTC the local date in e.g. Tokyo (+9) is already the next day. This produces off-by-one prayer times.

**The fix:** Always derive the **local calendar date** in the city's timezone before passing to adhan.js:

```js
function getLocalDateForCity(date, timezone) {
  // Extract year/month/day AS SEEN in the city's timezone
  const fmt = new Intl.DateTimeFormat('en-CA', {  // en-CA = YYYY-MM-DD format
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const [year, month, day] = fmt.format(date).split('-').map(Number);
  // Return a plain Date with correct y/m/d — time portion is irrelevant to adhan.js
  return new Date(year, month - 1, day);
}

// Usage in prayer engine:
const localDate = getLocalDateForCity(now, cityData.timezone);
const prayerTimes = new PrayerTimes(coordinates, localDate, params);
```

**Why this matters:** The prayer engine is called server-side from Next.js. The server is in UTC. A user in Auckland viewing prayer times at 11 PM UTC is actually on the next calendar day locally. Without this fix, midnight-area requests return wrong times.

---

### 3.4 Fix 3 — ISO String Output Contract (Already Good — Verify It Stays)

adhan.js returns `Date` objects with UTC values. Your `prayerEngine.js` correctly converts these to ISO strings (`.toISOString()`) for serialisation across the server/client boundary. **Verify this is consistent everywhere.** Never pass raw `Date` objects as props or through JSON — always ISO strings.

```js
// ✅ Correct pattern
return {
  fajr:    pt.fajr.toISOString(),
  sunrise: pt.sunrise.toISOString(),
  dhuhr:   pt.dhuhr.toISOString(),
  asr:     pt.asr.toISOString(),
  maghrib: pt.maghrib.toISOString(),
  isha:    pt.isha.toISOString(),
};
```

---

### 3.5 Fix 4 — All Four Madhabs: Display vs Calculation

The app shows all four Sunni schools. Adhan.js only accepts two engine values: `Madhab.Shafi` and `Madhab.Hanafi`. This is correct fiqh — not a library limitation:

| School | Asr Rule | adhan.js value |
|---|---|---|
| Shafi | Shadow × 1 | `Madhab.Shafi` |
| Maliki | Shadow × 1 (same start time as Shafi) | `Madhab.Shafi` |
| Hanbali | Shadow × 1 (same start time as Shafi) | `Madhab.Shafi` |
| Hanafi | Shadow × 2 (~45–90 min later) | `Madhab.Hanafi` |

**Never create a fourth calculation path.** Pass `Madhab.Shafi` for Shafi, Maliki, and Hanbali. Pass `Madhab.Hanafi` for Hanafi. Keep `school` as a UI display field only (used in `MADHAB_INFO` for display strings).

For the Asr comparison widget (shows both Shafi and Hanafi times side by side), calculate twice:
```js
// Shafi/Maliki/Hanbali Asr
paramsShafi.madhab = Madhab.Shafi;
const shafi = new PrayerTimes(coords, date, paramsShafi);

// Hanafi Asr
paramsHanafi.madhab = Madhab.Hanafi;
const hanafi = new PrayerTimes(coords, date, paramsHanafi);
```

---

### 3.6 Fix 5 — SunnahTimes (Optional but Valuable)

adhan.js includes `SunnahTimes` for free. Given a `PrayerTimes` instance, it provides:
- `middleOfTheNight` — Qiyam start
- `lastThirdOfTheNight` — Tahajjud start

```js
import { SunnahTimes } from 'adhan';
const sunnah = new SunnahTimes(prayerTimes);
// sunnah.middleOfTheNight → ISO string
// sunnah.lastThirdOfTheNight → ISO string
```

Consider adding these to your prayer engine output for future Qiyam/Tahajjud features.

---

## 4. Hijri Dates — Native Intl (No moment-hijri Needed)

### 4.1 Decision — Keep Native Intl, Remove Any moment-hijri Usage

`Intl.DateTimeFormat` with `ca-islamic-umalqura` uses the **same underlying ICU Umm al-Qura calculation tables** as `moment-hijri`. They are identical in accuracy. Native Intl is:
- 0 KB (built into Node.js 13+ and all modern browsers)
- Already used throughout this codebase (Luxon and your prayer formatting both use Intl)
- Server + client safe in Next.js App Router

`moment-hijri` requires `moment.js` as a peer dependency = **290 KB minified / 72 KB gzipped**, not tree-shakeable, officially deprecated by its own maintainers.

**Decision: Use native Intl for all Hijri date operations. If moment-hijri currently exists in the codebase, replace it.**

---

### 4.2 The Correct Intl Locale String

```
ar-SA-u-ca-islamic-umalqura-nu-latn
│  │  │               │           └─ nu-latn = Latin/English numerals (1, 2, 3 not ١, ٢, ٣)
│  │  │               └─ ca-islamic-umalqura = Umm al-Qura calendar (Saudi standard)
│  │  └─ u = Unicode extension prefix
│  └─ SA = Saudi Arabia (provides Arabic month names)
└─ ar = Arabic language
```

**Why `nu-latn` is mandatory:** Without it, digits are rendered as Eastern Arabic numerals (١٤٤٧). This app uses English digits throughout — enforce `nu-latn` on every Hijri formatter.

---

### 4.3 Canonical Implementation (lib/hijri-utils.js)

The file `lib/hijri-utils.js` has been created and should be used as the single source of truth for all Hijri operations. It exports:

```js
// All Hijri month names in Arabic — hardcoded for reliability across Node.js versions
export const HIJRI_MONTHS_AR

// Returns Date[] for every day in the current Gregorian month
export function getDaysInCurrentMonth()

// Extracts { hijriDay, hijriMonthNum, hijriMonthName, hijriYear } from a Date
// All numbers are English digits via nu-latn
export function getHijriParts(date)

// Returns "شعبان — رمضان 1447 هـ" span label for an array of dates
export function getHijriMonthSpan(days)

// Server shortcut: span label for the month containing `date`
export function getHijriMonthSpanFromDate(date)

// Returns "مارس 2026" — Arabic month name, English year
export function formatGregorianLabel(date)
```

**All Hijri operations in the codebase must import from `lib/hijri-utils.js`.** No inline Hijri logic in components.

---

### 4.4 Singleton Formatters Pattern (Performance)

`new Intl.DateTimeFormat()` is expensive to construct. For operations called 31 times (one per calendar day), always cache the formatter:

```js
// ✅ Create once at module level, reuse for all 31 calls
const _hijriFmt = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', {
  day: 'numeric', month: 'numeric', year: 'numeric',
});

// ❌ Never create inside a loop or useMemo that runs per-row
days.map(date => {
  const fmt = new Intl.DateTimeFormat(...); // WRONG — 31 constructions
  return fmt.formatToParts(date);
});
```

Same pattern applies to the prayer time formatter:
```js
// Create once per timezone, reuse for all 6 prayers × 31 days
const timeFmt = new Intl.DateTimeFormat('en', {
  timeZone: timezone, hour: 'numeric', minute: '2-digit', hour12: false,
});
```

---

## 5. Moment.js Migration — Full Replacement Guide

### 5.1 Why Migrate

| Issue | Detail |
|---|---|
| Bundle size | 290 KB minified / 72 KB gzipped, not tree-shakeable |
| Officially deprecated | momentjs.com: *"We would like to discourage Moment from being used in new projects"* |
| Arabic locale bugs | Known issues with `ar-SA` locale in moment (GitHub issues #4448, #5773) — format strings return incorrect output for Arabic |
| Global mutation | `moment.locale('ar')` mutates global state — causes race conditions in Next.js SSR |
| Mutable objects | All Moment objects are mutable — a known source of subtle bugs |

### 5.2 Replacement Map — Exact Equivalents

Go through every file that imports `moment` or `moment-hijri` or `moment-timezone` and apply this map:

---

#### Formatting a date to display string
```js
// ❌ moment
moment(date).format('YYYY-MM-DD')
moment(date).tz('Asia/Riyadh').format('HH:mm')

// ✅ Native
date.toISOString().slice(0, 10)  // YYYY-MM-DD
new Intl.DateTimeFormat('en', {
  timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false
}).format(date)  // "17:30"
```

---

#### Getting current time in a timezone
```js
// ❌ moment-timezone
moment().tz('Africa/Casablanca').format('HH:mm:ss')

// ✅ Luxon (already in time-engine.js)
DateTime.now().setZone('Africa/Casablanca').toFormat('HH:mm:ss')

// ✅ Native Intl (simpler for display-only)
new Intl.DateTimeFormat('en', {
  timeZone: 'Africa/Casablanca',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
}).format(new Date())
```

---

#### Countdown / time difference (for prayer countdown and events)
```js
// ❌ moment
const diff = moment(targetIso).diff(moment(), 'seconds')
const duration = moment.duration(diff, 'seconds')
const h = duration.hours()
const m = duration.minutes()
const s = duration.seconds()

// ✅ Native — no library needed
const diffMs = new Date(targetIso).getTime() - Date.now();
const totalSec = Math.max(0, Math.floor(diffMs / 1000));
const h = Math.floor(totalSec / 3600);
const m = Math.floor((totalSec % 3600) / 60);
const s = totalSec % 60;
```

---

#### Relative time ("منذ 5 دقائق" / "بعد ساعتين")
```js
// ❌ moment
moment(date).fromNow()
moment(date).locale('ar').fromNow()

// ✅ Native Intl.RelativeTimeFormat (well-supported in all browsers + Node.js)
const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
// rtf.format(-5, 'minute')  → "منذ 5 دقائق"
// rtf.format(2, 'hour')     → "خلال ساعتين"
// rtf.format(-1, 'day')     → "أمس"

// Helper function to create human-readable relative time:
function formatRelativeTime(date, locale = 'ar') {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const thresholds = [
    { unit: 'year',   secs: 31536000 },
    { unit: 'month',  secs: 2592000  },
    { unit: 'week',   secs: 604800   },
    { unit: 'day',    secs: 86400    },
    { unit: 'hour',   secs: 3600     },
    { unit: 'minute', secs: 60       },
    { unit: 'second', secs: 1        },
  ];
  for (const { unit, secs } of thresholds) {
    if (Math.abs(diffSec) >= secs) {
      return rtf.format(Math.round(diffSec / secs), unit);
    }
  }
  return rtf.format(0, 'second');
}
```

---

#### Arabic date display
```js
// ❌ moment locale
moment(date).locale('ar').format('dddd، D MMMM YYYY')

// ✅ Native — Arabic weekday + month + English year
new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}).format(date)
// → "الثلاثاء، 17 مارس 2026"
```

---

#### Parsing a date string
```js
// ❌ moment
moment('2026-03-17', 'YYYY-MM-DD').toDate()

// ✅ Native — ISO strings always parse correctly
new Date('2026-03-17T00:00:00')
// For time in a specific timezone, use the prayer engine ISO output directly
```

---

#### Adding/subtracting time
```js
// ❌ moment
moment(date).add(1, 'day')
moment(date).subtract(30, 'minutes')

// ✅ Native
new Date(date.getTime() + 24 * 60 * 60 * 1000)   // +1 day
new Date(date.getTime() - 30 * 60 * 1000)          // -30 minutes

// ✅ Luxon (already in stack — use for complex arithmetic)
DateTime.fromISO(isoString).plus({ days: 1 })
DateTime.fromISO(isoString).minus({ minutes: 30 })
```

---

#### Start/end of day in a timezone
```js
// ❌ moment-timezone
moment().tz('Asia/Dubai').startOf('day')

// ✅ Luxon
DateTime.now().setZone('Asia/Dubai').startOf('day')
DateTime.now().setZone('Asia/Dubai').endOf('day')
```

---

#### Hijri date formatting (previously moment-hijri)
```js
// ❌ moment-hijri
import moment from 'moment-hijri';
moment(date).locale('ar').format('iD iMMMM iYYYY')  // FRAGILE — depends on global locale

// ✅ lib/hijri-utils.js (already created)
import { getHijriParts, getHijriMonthSpanFromDate } from '@/lib/hijri-utils';
const { hijriDay, hijriMonthName, hijriYear } = getHijriParts(date);
// → { hijriDay: 17, hijriMonthName: "رمضان", hijriYear: 1447 }
```

---

### 5.3 Audit Checklist — Files to Check

Search the entire codebase for these patterns and apply the replacement map above:

```
grep -rn "from 'moment'" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"
grep -rn "require('moment')" --include="*.js" --include="*.jsx"
grep -rn "moment-hijri" --include="*.js" --include="*.jsx"
grep -rn "moment-timezone" --include="*.js" --include="*.jsx"
grep -rn "import moment" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"
```

For each occurrence:
1. Identify the operation (format, diff, add, parse, hijri, relative time)
2. Apply the exact replacement from Section 5.2
3. Remove the `moment` import from the file
4. Verify the output is identical

---

## 6. Countdown Events — Cross-Timezone Architecture

### 6.1 The Problem

The app has countdown timers to events in different countries/categories (e.g., Ramadan start in Saudi Arabia, Eid in Egypt). The naive approach — storing event times as local strings — breaks across timezones and DST.

### 6.2 The Correct Architecture

**Rule: All event times stored and computed in UTC as ISO strings. Convert to local time only at display.**

```js
// ✅ Store in database
{
  eventName: "رمضان 1448",
  country_code: "SA",
  timezone: "Asia/Riyadh",
  startsAtUtc: "2026-02-17T21:00:00.000Z"  // ISO string, UTC
}

// ✅ Countdown calculation — pure arithmetic, no libraries
function getCountdownSeconds(utcIsoString) {
  return Math.max(0, Math.floor(
    (new Date(utcIsoString).getTime() - Date.now()) / 1000
  ));
}

// ✅ Display in local time
function formatEventTime(utcIsoString, timezone, locale = 'ar-EG-u-nu-latn') {
  return new Intl.DateTimeFormat(locale, {
    timeZone:  timezone,
    weekday:   'long',
    day:       'numeric',
    month:     'long',
    year:      'numeric',
    hour:      'numeric',
    minute:    '2-digit',
    hour12:    false,
  }).format(new Date(utcIsoString));
}
```

### 6.3 Prayer Countdown Specifics

The prayer countdown runs client-side and ticks every second. Pattern:

```js
// In your countdown client component
useEffect(() => {
  const interval = setInterval(() => {
    const now = Date.now();
    const targetMs = new Date(nextPrayerIso).getTime();
    const diffSec = Math.max(0, Math.floor((targetMs - now) / 1000));

    const h = Math.floor(diffSec / 3600);
    const m = Math.floor((diffSec % 3600) / 60);
    const s = diffSec % 60;

    setTimeLeft({ h, m, s });

    if (diffSec === 0) {
      // Prayer time has arrived — refresh to get next prayer
      router.refresh();  // Next.js App Router: re-runs the server component
    }
  }, 1000);

  return () => clearInterval(interval);
}, [nextPrayerIso]);
```

**Never use `moment.duration()` for the countdown display.** Pure arithmetic is faster, zero-dependency, and numerically identical.

---

## 7. Numeral Rule — Absolute App Standard

This app is Arabic but uses **English (Latin) digits everywhere**. This must be enforced at every data output point.

### 7.1 The Four Controlled Paths

| Data | Method | Output |
|---|---|---|
| Prayer times (HH:MM) | `Intl.DateTimeFormat('en', { hour12: false })` | `"05:30"` |
| Day number in calendar | Raw `date.getDate()` integer → JSX `{row.dayNumber}` | `17` |
| Hijri day + year | `nu-latn` extension in Intl locale string | `17`, `1447` |
| Gregorian label | `'ar-EG-u-nu-latn'` for month label | `"مارس 2026"` |
| Countdown digits | Raw JS arithmetic → `String(h).padStart(2, '0')` | `"05"` |

### 7.2 Anti-Patterns to Find and Fix

```js
// ❌ Arabic numerals will appear
new Intl.DateTimeFormat('ar-SA', { ... })  // Missing nu-latn → ٢٠٢٦

// ❌ moment with ar locale outputs Eastern Arabic digits
moment(date).locale('ar').format('D')  // → "١٧" not "17"

// ✅ Always specify nu-latn for Arabic locale strings
new Intl.DateTimeFormat('ar-EG-u-nu-latn', { ... })
new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-latn', { ... })
```

Search for any `Intl.DateTimeFormat('ar` or `locale('ar')` that is **missing `-u-nu-latn`** and add it.

---

## 8. Next.js App Router — Server/Client Boundary Rules

### 8.1 What Runs Where

| Location | Context | Rules |
|---|---|---|
| `page.jsx` async functions | Server | Can call DB, prayer engine, hijri utils — no `useState`, no `window` |
| `PrayerTimesContent` | Server (inside Suspense) | Same as above; calling `headers()` makes it dynamic |
| `*.client.jsx` | Client | Prayer times received as ISO props; countdown, interactive UI |
| `lib/hijri-utils.js` | Universal | Pure functions — safe anywhere |
| `lib/prayerEngine.js` | Server-preferred | Heavy computation; results serialised as ISO strings |

### 8.2 Props Across the Boundary

Never pass `Date` objects as props to client components. Always ISO strings:

```js
// ✅ Server passes ISO strings
<CountdownClient nextPrayerIso={times.fajr} />  // times.fajr = "2026-03-17T03:45:00.000Z"

// ❌ Never pass Date objects
<CountdownClient nextPrayerDate={new Date(times.fajr)} />
```

### 8.3 Hydration Safety

Any component that reads the current time must use `useEffect` + `useState` to prevent hydration mismatch:

```js
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return <Skeleton />;
// Now safe to use Date.now(), new Date(), etc.
```

---

## 9. Performance Checklist

| Item | Check |
|---|---|
| Intl formatters created at module level (not inside loops) | All files using Intl in a loop |
| Prayer engine results cached by `cacheKey` | `prayerEngine.js` |
| Monthly calendar computes 31 days via `useMemo` | `MonthlyPrayerCalendar.client.jsx` |
| No `moment` import remains anywhere | `grep -rn "import moment"` returns nothing |
| No `moment-hijri` import remains anywhere | `grep -rn "moment-hijri"` returns nothing |
| Countdown uses `setInterval` not `requestAnimationFrame` | All countdown components |
| PDF route closes browser in finally block | `api/pdf-calendar/route.js` |

---

## 10. File Map — Where to Make Changes

```
lib/
├── prayerEngine.js        ← [FIX] Add polarCircleResolution + highLatitudeRule + getLocalDateForCity
├── hijri-utils.js         ← [CREATE/VERIFY] Canonical Hijri utils using native Intl
├── prayer-methods.js      ← [NO CHANGE] Already correct
├── prayer.js              ← [VERIFY] ISO string output contract
├── time-engine.js         ← [KEEP] Luxon usage is correct
├── country-utils.js       ← [KEEP] getSafeTimezone is correct
└── calendar-config.js     ← [KEEP] Per-country config is correct

components/mwaqit/
├── MonthlyPrayerCalendar.client.jsx  ← [VERIFY] Uses lib/hijri-utils, no moment
├── CalendarSeoBlock.jsx              ← [VERIFY] Server component, no moment
└── [all countdown components]        ← [FIX] Replace moment.duration with native arithmetic

app/
├── mwaqit-al-salat/[country]/page.jsx        ← [FIX] Pass countryNameAr to PrayerTimesContent
├── mwaqit-al-salat/[country]/[city]/page.jsx ← [VERIFY] CalendarSeoBlock integration
└── api/pdf-calendar/route.js                  ← [VERIFY] No moment usage

[ALL OTHER FILES]  ← Run grep audit for moment imports and replace per Section 5.2
```

---

## 11. Verification Steps After Changes

Run these checks before marking the task complete:

### 11.1 Prayer time correctness
Test these specific edge cases:
- **Reykjavik, Iceland** (lat: 64.1°N) — June/July: verify Fajr and Isha are not `undefined` or `NaN`
- **Oslo, Norway** (lat: 59.9°N) — Verify times are reasonable in summer
- **Cairo, Egypt** — Verify method is Egyptian, times match official Egyptian prayer schedule
- **Karachi, Pakistan** — Verify method is Karachi, Hanafi Asr is ~45-90 min later than Shafi
- **Casablanca, Morocco** — Verify method is Egyptian, Maliki school

### 11.2 Numeral correctness
Inspect DOM output for these elements:
- Prayer times in the table → must show `05:30` not `٠٥:٣٠`
- Hijri day in the calendar column → must show `17` not `١٧`
- Countdown digits → must show `02:45:30` not `٠٢:٤٥:٣٠`

### 11.3 Moment removal
```bash
grep -rn "from 'moment'" src/ lib/ app/ components/
# Must return no results
```

### 11.4 No Date objects across server/client boundary
```bash
grep -rn "new Date(" app/ components/ --include="*.jsx" | grep "prop\|return"
# Review each result — should be ISO string conversion, not raw Date passing
```

---

## 12. Summary — Priority Order

Execute in this order:

1. **`lib/prayerEngine.js`** — Add polar circle fix + `getLocalDateForCity` (Section 3.2 + 3.3)
2. **`lib/hijri-utils.js`** — Verify/create with singleton formatters (Section 4.3)
3. **`grep` audit** — Find all `moment` imports across the entire codebase (Section 5.3)
4. **Replace moment** — Apply replacement map per file (Section 5.2)
5. **Countdown components** — Replace `moment.duration` with native arithmetic (Section 6.3)
6. **Numeral audit** — Find any `ar-*` Intl locale missing `nu-latn` (Section 7.2)
7. **Country page fix** — Pass `countryNameAr` prop to `PrayerTimesContent` (Section 10)
8. **Verification** — Run all checks in Section 11

---

*This brief was prepared based on deep research of adhan.js official documentation, moment.js deprecation notice, MDN Intl API, Next.js App Router architecture, and Islamic prayer time calculation standards. All code examples are production-ready.*