# Date Feature — Complete Build Plan
## Arabic-First Hijri/Gregorian Date Tools | Next.js 16 + Supabase + Shadcn

---

## BRIEFING FOR AI DEVELOPER (Read this entirely before touching any code)

### What is this project?

This is an Arabic-first web application built with **Next.js 16, Tailwind CSS v4, shadcn/ui, and Supabase**. The app is already live and has existing pages — including time pages for countries and cities. It has a working Supabase database with a full table of countries and cities (including timezones, coordinates, country codes, slugs, and names in Arabic and English). It also has existing utility functions for fetching countries and cities, an existing Supabase client setup (both server-side and client-side), and a global CSS file called `new.css` that defines the design system. There is also a custom Arabic font already installed and configured.

### What are we building now?

We are adding a **completely new feature**: a full suite of Arabic date tools covering:
- Displaying today's date in both Hijri and Gregorian calendars
- Converting any date between Hijri and Gregorian
- Programmatic SEO pages for every individual date (tens of thousands of pages)
- Yearly/monthly calendar views
- Country-specific date pages

The **business goal** is to become the #1 Arabic website for all date-related search queries on Google, including: تاريخ اليوم, تاريخ اليوم هجري, تحويل التاريخ, تحويل ميلادي الى هجري, and thousands of long-tail queries like "1 رمضان 1447 كم ميلادي".

### How you should approach this — Step by Step

**Step 1 — Explore before you build. This is mandatory, not optional.**
Before writing any code, you must thoroughly explore the existing codebase. Do every single one of the following:

- Read the full project folder structure top-to-bottom to understand how routes, layouts, and components are organized
- Find the existing Supabase client setup (there will be a server-side client and a browser/client-side client) — **read both files completely** before anything else. Understand exactly how they initialize the client, what helpers they expose, and how they are imported in other files. You will use this exact same pattern — do not create a new Supabase client under any circumstances
- Find every existing component that fetches data from Supabase or the database. Read them. Understand the pattern: how they call the client, how they handle loading and errors, how they pass data to child components. **Your new components must follow the exact same pattern.**
- Find and read the existing countries and cities data-fetching utilities in full. These functions already query the Supabase countries/cities tables. You will call these same functions (or the same query pattern) for country pages — do not write new raw Supabase queries if a utility already does what you need
- Find any existing API route handlers or Server Actions in the codebase. Read them to understand the pattern used (how they validate input, how they return responses, how errors are handled). Your converter Server Action must follow the same pattern
- Find and read `new.css` completely. Note every CSS variable, color token, spacing value, font definition, and utility class. Every component you create must use these variables — never hardcode colors or spacing that conflicts with the existing design system
- Find the existing font setup — where the font is declared, how it is loaded, and how it is referenced in components. Do not add a new font import or a new `@font-face` declaration
- Find every existing layout file (root layout and any segment layouts). Read them. Understand what wraps every page. Add the new `date/layout.tsx` only as a thin additional wrapper — it must not duplicate anything the parent layouts already provide
- Find any existing i18n, locale, or language-routing setup. If the app has locale-prefixed routes (`/ar/`, `/en/`), the date routes must follow the same structure
- Find the existing `robots.txt` and any existing sitemap files. Read them before creating new sitemaps — your additions must extend them, not replace or conflict with them
- Find the existing `not-found.tsx` and `error.tsx` files (if any). Your date segment's error and not-found pages must visually match these

**After this exploration, write a short internal summary** (just for your own context) of what you found: the Supabase pattern used, the data-fetching pattern, the CSS variable names in use, and the layout chain. Use this summary to guide every decision that follows.

Only after completing this full exploration should you write a single line of new code.

**Step 2 — Install the one new dependency.**
```bash
npm install @internationalized/date
```
This is the only new package needed. Everything else reuses what exists.

**Step 3 — Build the conversion adapter first (most critical piece).**
Before any page exists, create the single conversion utility that all pages will import. This file wraps `@internationalized/date` and is the only place in the entire codebase that touches the date library directly. Every page and component receives already-converted data — they never call the library themselves.

**Step 4 — Build Phase 1 pages in order (see Section 14).**
Start with the Hub page, then Today, then Converter. Do not jump ahead to programmatic pages until the core tools work perfectly.

**Step 5 — After each page: verify before moving on.**
After building each page, confirm:
- The page renders server-side (view HTML source — content must be present, not JavaScript)
- JSON-LD is in the `<head>` of the rendered HTML
- The canonical tag is correct
- No TypeScript errors

**Step 6 — Build the programmatic engine (Phase 3).**
Only after Phase 1 and 2 are complete and working, build the `[year]/[month]/[day]` dynamic routes with `generateStaticParams` for Tier A pages.

**Step 7 — Sitemaps last.**
Sitemaps should be built after all pages exist. Do not build sitemaps for pages that do not yet exist.

### The single most important rule

**Do not modify any existing page, route, layout, component, or utility.** This feature lives entirely under the `/date` route segment and in `components/date/`. Everything else in the codebase must remain exactly as it is. If you need to share something with existing pages (like a Supabase query pattern), copy the pattern — do not modify the original.

### How to handle ambiguity

If you find that the existing codebase uses a different pattern than what this document suggests (for example, a different way of fetching from Supabase, or a different folder convention), **always follow the existing codebase pattern, not this document**. This document describes intent and structure — your job is to implement that intent using the patterns already established in the project.

### The reuse hierarchy — follow this order every time you need something

1. **Does an existing utility, function, or component already do this?** → Use it as-is. Import it directly.
2. **Does something close exist but needs a small addition to support your use case?** → Extend it carefully. Add the new capability without changing or removing any existing behavior. Every existing caller must still work identically after your change. Think through this before touching the file.
3. **Does nothing exist for this?** → Only then create something new. Build it following the exact same patterns, naming conventions, and file structure as the closest existing equivalent.

**Never duplicate logic that already exists.** If a function already fetches countries from Supabase, you call that function — you do not write a second function that also fetches countries. Duplication creates inconsistency bugs when the original is updated later.

### Safety rule for modifying any existing file

If you must touch an existing file (to extend a utility, add an export, or fix a conflict), follow this exact procedure:
1. Read the entire file first
2. Identify every place in the codebase that imports from or depends on this file
3. Make only the minimum change needed — no refactoring, no style fixes, no "while I'm here" improvements
4. Confirm mentally that every existing import and usage still compiles and behaves identically
5. Place your new export or function below all existing code, never interleaved with it

---

## 0. Research Findings & Competitive Gaps

After deep research across all competing Arabic date sites (datehijri.com, islamicfinder.org, ihijri.com, hijri-gregorian.com, timesprayer.com, time.now/islamic-calendar-converter), the following gaps were identified that this build will exploit:

| Gap | What competitors do | What we will do |
|---|---|---|
| Conversion method | Single method, no choice | 3 methods: Umm al-Qura, Astronomical, Civil/Tabular |
| Programmatic pages | None or very few | Thousands of date pages via ISR |
| Mobile UX | Outdated, cramped | Mobile-first shadcn design |
| Page speed | 4-6s TTFB | <1s from Edge CDN |
| Schema markup | Missing or wrong | Full FAQPage + HowTo + SoftwareApplication |
| Country differences | Ignored | Per-country date adjustments |
| Internal linking | Weak or absent | Every page linked to hub + prev/next |
| Content depth | 200 words max | 600-1000 words per core page |
| Thin content on dynamic pages | N/A | Unique contextual data per page |
| OG/social sharing | Generic | Dynamic OG images per date |
| Copy/export | None | Copy Arabic text + .ics download |

---

## 1. Date Library Decision

**Use `@internationalized/date`** — the most accurate JavaScript calendar library.

```bash
npm install @internationalized/date
```

### Why this library:
- Has `IslamicUmalquraCalendar` (official Saudi calendar, most widely used)
- Has `IslamicCivilCalendar` (tabular/arithmetic, consistent)
- Has standard `CalendarDate` API that works cleanly in server components
- No browser-only dependencies — works in Node and Edge runtime

### Adapter to create (one file, reuse everywhere):

Create a single conversion utility file that exposes this interface:

```typescript
type ConversionMethod = 'umalqura' | 'civil' | 'astronomical'

interface ConvertDateInput {
  date: Date | string          // JS Date or ISO string
  toCalendar: 'hijri' | 'gregorian'
  method?: ConversionMethod    // default: 'umalqura'
}

interface ConvertDateResult {
  year: number
  month: number
  day: number
  monthNameAr: string
  monthNameEn: string
  dayNameAr: string
  dayNameEn: string
  formatted: {
    ar: string        // "١٤ رمضان ١٤٤٧"
    en: string        // "14 Ramadan 1447"
    iso: string       // "1447-09-14"
    arIndic: string   // Arabic-Indic numerals version
  }
  isLeapYear: boolean
  dayOfYear: number
  julianDay: number
}
```

This adapter wraps `@internationalized/date` internally. All pages import from this single adapter — never call the library directly in page components.

### Islamic Month Names (include in adapter):
```
1: محرم / Muharram
2: صفر / Safar
3: ربيع الأول / Rabi al-Awwal
4: ربيع الثاني / Rabi al-Thani
5: جمادى الأولى / Jumada al-Awwal
6: جمادى الثانية / Jumada al-Thani
7: رجب / Rajab
8: شعبان / Sha'ban
9: رمضان / Ramadan
10: شوال / Shawwal
11: ذو القعدة / Dhu al-Qi'dah
12: ذو الحجة / Dhu al-Hijjah
```

### Sacred & Special Months data (include in adapter or constants file):
- Sacred months (haram): Muharram(1), Rajab(7), Dhu al-Qi'dah(11), Dhu al-Hijjah(12)
- Month of fasting: Ramadan(9)
- Month of Hajj: Dhu al-Hijjah(12)

---

## 2. Route Architecture

All routes live under `/date` as a segment. **Do not assume any existing file names.** Map these abstract routes to whatever folder structure exists.

```
/date
├── /                           → Hub page
├── /today                      → Today: Hijri + Gregorian snapshot
├── /today/hijri                → Today: Hijri focused, with method toggle
├── /today/gregorian            → Today: Gregorian focused
├── /converter                  → Full converter tool
├── /hijri-to-gregorian         → Standalone direction page
├── /gregorian-to-hijri         → Standalone direction page
├── /calendar
│   ├── /[year]                 → Gregorian year calendar
│   └── /hijri/[year]           → Hijri year calendar
├── /country/[countrySlug]      → Country-specific date page
└── /[year]/[month]/[day]       → Programmatic Gregorian date pages
    └── (+ hijri variant below)
/date/hijri/[year]/[month]/[day] → Programmatic Hijri date pages
```

### Next.js 16 Critical Pattern — Async Params:

In Next.js 15/16, `params` is a Promise. Always await it:

```typescript
// CORRECT in Next.js 15/16
export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>
}) {
  const { year, month, day } = await params
  // ...
}
```

### Dynamic Route Segments to create:

```
app/
  date/
    page.tsx                          → Hub
    today/
      page.tsx                        → Today combined
      hijri/page.tsx                  → Today Hijri
      gregorian/page.tsx              → Today Gregorian
    converter/page.tsx                → Converter tool
    hijri-to-gregorian/page.tsx       → Direction page
    gregorian-to-hijri/page.tsx       → Direction page
    calendar/
      [year]/page.tsx                 → Gregorian calendar
      hijri/[year]/page.tsx           → Hijri calendar
    country/
      [countrySlug]/page.tsx          → Country date page
    [year]/
      [month]/
        [day]/page.tsx                → Gregorian programmatic
    hijri/
      [year]/
        [month]/
          [day]/page.tsx              → Hijri programmatic
```

---

## 3. Programmatic Pages Strategy (Tiered)

### Page Count Calculation:

| Type | Range | Pages |
|---|---|---|
| Gregorian dates | 1924–2077 (±25 years from now, expanding) | ~55,000 |
| Hijri dates | 1343 AH–1500 AH (matches Umm al-Qura range) | ~55,000 |
| Country date pages | ~50 countries | 50 |
| Gregorian year calendars | 1924–2077 | 153 |
| Hijri year calendars | 1343–1500 | 157 |
| **Total** | | **~110,000+** |

### Tier A — Pre-built at deploy (fast, always static):
- Gregorian: today ±5 years = ~3,650 pages
- Hijri: current year ± 5 Hijri years = ~1,800 pages
- All country pages (50)
- Current year ± 2 calendars

### Tier B — ISR on first request:
- Gregorian: today ±25 years (beyond Tier A)
- Hijri: all within library range
- `dynamicParams = true` + `revalidate = 86400` (24 hours)

### Tier C — Server rendered + background cache:
- Historical dates outside the ±25 year range
- `dynamic = 'force-dynamic'` with CDN `Cache-Control: s-maxage=604800`

### In `[year]/[month]/[day]/page.tsx`:

```typescript
export const dynamicParams = true  // allow beyond generateStaticParams
export const revalidate = 86400    // ISR: regenerate after 24h

export async function generateStaticParams() {
  // Tier A only — generates at build time
  const dates = generateDateRange(
    subYears(new Date(), 5),
    addYears(new Date(), 5)
  )
  return dates.map(d => ({
    year: d.year.toString(),
    month: d.month.toString().padStart(2, '0'),
    day: d.day.toString().padStart(2, '0'),
  }))
}
```

---

## 4. Supabase Integration

The existing codebase has Supabase with countries and cities. Use the existing client/server patterns already in the codebase. Do not create a new Supabase client if one already exists.

### What to query from Supabase for date pages:

**Country pages** — query existing countries table for:
- `name_ar` (Arabic name)
- `name_en` (English name)
- `slug` (URL slug)
- `timezone` (IANA timezone string, e.g., "Asia/Riyadh")
- `capital_city` (for timezone fallback)
- `country_code` (ISO 2-letter)
- `hijri_method` (which method this country officially uses — add this column if not present: enum 'umalqura' | 'astronomical' | 'local')

**Country-specific Hijri method mapping** (hardcode as config if not in DB):
```typescript
const COUNTRY_HIJRI_METHODS = {
  'SA': 'umalqura',      // Saudi Arabia — official Umm al-Qura
  'AE': 'umalqura',      // UAE
  'KW': 'umalqura',      // Kuwait
  'QA': 'umalqura',      // Qatar
  'BH': 'umalqura',      // Bahrain
  'OM': 'umalqura',      // Oman
  'MA': 'astronomical',  // Morocco — local astronomical
  'EG': 'astronomical',  // Egypt
  'JO': 'astronomical',  // Jordan
  'DZ': 'astronomical',  // Algeria
  'TN': 'astronomical',  // Tunisia
  'IQ': 'astronomical',  // Iraq
  'LB': 'astronomical',  // Lebanon
  'SY': 'astronomical',  // Syria
  // default: 'umalqura'
} as const
```

---

## 5. Components Folder Structure

Create all components inside the existing `components` folder. Suggested sub-folder: `components/date/`

```
components/date/
├── DateHero.tsx              → Today's date snapshot (server component)
├── ConverterForm.tsx         → 'use client' — form with date pickers
├── ConverterResult.tsx       → Result display card (can be server)
├── MethodToggle.tsx          → 'use client' — 3-method switcher
├── MethodComparisonTable.tsx → Shows all 3 method results
├── DateCalendarGrid.tsx      → Month/year grid (server)
├── DateNavigation.tsx        → Prev/Next day links (server)
├── CountryDateCard.tsx       → Country-specific date display
├── DateShareActions.tsx      → 'use client' — copy/share/ics buttons
├── ProgrammaticRelated.tsx   → Related dates section (server)
├── DateFAQBlock.tsx          → FAQ section with schema (server)
├── JsonLd.tsx                → Generic JSON-LD injector (server)
├── DateBreadcrumb.tsx        → Breadcrumb navigation (server)
├── CalendarDayCell.tsx       → Single day in calendar grid
├── HijriMonthBadge.tsx       → Badge showing if sacred/special month
└── DateEmbedWidget.tsx       → 'use client' — embeddable iframe code
```

### Component Rules:
- **Server by default.** Only add `'use client'` if the component needs: `useState`, `useEffect`, event handlers, browser APIs
- **Server components:** DateHero, ConverterResult, DateCalendarGrid, DateNavigation, ProgrammaticRelated, DateFAQBlock, JsonLd, DateBreadcrumb, CalendarDayCell, HijriMonthBadge
- **Client components (minimal):** ConverterForm, MethodToggle, DateShareActions, DateEmbedWidget

---

## 6. Page-by-Page Specification

---

### PAGE 1: Hub — `/date`

**Target keywords:** تاريخ اليوم, تاريخ اليوم هجري, تحويل التاريخ

**Rendering:** Static with `revalidate = 3600` (refreshes today's date every hour)

**Sections & Layout:**

```
┌─────────────────────────────────────────────────────┐
│  HERO SECTION (full-width, prominent)               │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │  التاريخ الهجري  │  │ التاريخ الميلادي │           │
│  │  ١٤ رمضان ١٤٤٧  │  │  19 March 2026  │           │
│  │  [month badge]  │  │   Thursday      │           │
│  └─────────────────┘  └─────────────────┘           │
│  [ محول التاريخ ←  ]  [ التقويم الشهري ← ]           │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  QUICK CONVERTER (inline, lightweight)              │
│  [From] [Date Input] [To] [Convert Button]          │
│  → Result appears below inline                      │
└─────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  FEATURE CARDS GRID (3 cols on desktop)           │
│  [تاريخ اليوم هجري] [محول التاريخ] [التقويم]      │
│  [التاريخ في دولتك] [هجري←ميلادي] [ميلادي←هجري]  │
└───────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  SEO CONTENT SECTION                               │
│  H2: ما هو تاريخ اليوم بالهجري والميلادي؟          │
│  H2: لماذا يختلف التاريخ الهجري بين الدول؟         │
│  H2: الفرق بين طرق حساب التاريخ الهجري            │
│  (600-800 words total, authoritative Arabic)       │
└─────────────────────────────────────────────────────┘

┌───────────────────────────┐
│  FAQ SECTION (5 Q&As)    │
│  (FAQPage JSON-LD)        │
└───────────────────────────┘
```

**Shadcn components:**
- `Card` + `CardContent` for date display panels and feature cards
- `Button` for CTAs (variant="default" and variant="outline")
- `Select` + `Input` for quick converter
- `Badge` for month type labels (رمضان / شعبان / etc.)
- `Separator` between sections

**JSON-LD on this page:**
- `WebSite` (with `SearchAction` if search exists)
- `WebPage`
- `BreadcrumbList`
- `FAQPage`

**`generateMetadata()`:**
```typescript
title: 'تاريخ اليوم — هجري وميلادي | [Brand]'       // ≤60 chars
description: 'تاريخ اليوم الهجري والميلادي مع محول فوري...'  // 120-155 chars
```

---

### PAGE 2: Today Combined — `/date/today`

**Target keywords:** تاريخ اليوم, كم تاريخ اليوم, ما هو تاريخ اليوم

**Rendering:** `revalidate = 3600` (ISR, refreshes every hour — critical for a "today" page)

**Note:** This page reads the current date on the **server** at render time. Use `new Date()` server-side, convert via the adapter to get both calendar representations.

**Sections:**

```
┌─────────────────────────────────────────────────────┐
│  MAIN DATE DISPLAY                                  │
│  ┌──────────────────────────────────────────┐       │
│  │  اليوم: الخميس                           │       │
│  │  ┌─────────────┐    ┌─────────────────┐  │       │
│  │  │   هجري      │    │    ميلادي       │  │       │
│  │  │ ١٤ رمضان   │    │  19 March 2026  │  │       │
│  │  │   ١٤٤٧      │    │                 │  │       │
│  │  └─────────────┘    └─────────────────┘  │       │
│  └──────────────────────────────────────────┘       │
│  [نسخ التاريخ] [مشاركة] [تحويل تاريخ آخر]         │
└─────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│  DATE FACTS ROW                               │
│  [اليوم 79 من عام 2026] [تبقى 10 أيام لعيد الفطر] │
│  [الأسبوع 12] [Julian Day: 2461119]           │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│  METHOD COMPARISON TABLE (3 rows)             │
│  طريقة الحساب | التاريخ الهجري                │
│  أم القرى     | ١٤ رمضان ١٤٤٧                │
│  فلكي         | ١٤ رمضان ١٤٤٧                │
│  مدني/حسابي   | ١٣ رمضان ١٤٤٧                │
└───────────────────────────────────────────────┘

[SEO Content Sections — written separately by content team]
[FAQ Block — 5 questions with FAQPage schema]
```

**Shadcn components:**
- `Card` for main date display
- `Table` for method comparison
- `Badge` for date facts
- `Button` with icons for actions
- `Tooltip` on method names explaining what each means

**JSON-LD:** `WebPage` + `BreadcrumbList` + `FAQPage`

---

### PAGE 3: Today Hijri — `/date/today/hijri`

**Target keywords:** التاريخ الهجري اليوم, تاريخ اليوم هجري, كم التاريخ الهجري اليوم

**Rendering:** `revalidate = 3600`

**Key differentiator:** This is the most-searched specific query (~77k/month). This page must be the best Arabic Hijri date page on the internet.

**Sections:**

```
┌─────────────────────────────────────────────────────┐
│  HIJRI DATE HERO                                    │
│  [Islamic crescent icon]                            │
│  ١٤ رمضان ١٤٤٧ هجري                               │
│  رمضان المبارك — شهر الصيام                         │
│  [Month progress bar if Ramadan/special month]      │
│  الموافق: 19 March 2026                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  METHOD TOGGLE (client component — MethodToggle)    │
│  [أم القرى ✓] [فلكي] [مدني]                       │
│  → switches which result is "primary"               │
│  → shows note about which countries use which       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DETAILS TABLE                                      │
│  اليوم من الشهر الهجري: ١٤                         │
│  اليوم من السنة الهجرية: ٢٦٤                        │
│  الشهر: التاسع (رمضان)                              │
│  نوع الشهر: شهر فضيل                               │
│  عدد أيام الشهر: ٢٩ أو ٣٠ يوماً                    │
└─────────────────────────────────────────────────────┘

[SEO Content — why Hijri differs by country, how it's calculated]
[FAQ with FAQPage schema]
[Internal links → Converter, Calendar, Gregorian Today]
```

**Shadcn components:**
- Large `Card` with rich content for hero
- `Tabs` for method toggle (or custom `MethodToggle` client component with shadcn `Button` variants)
- `Table` for details
- `Progress` for month progress (day X of 29/30)
- `Alert` for special month notices (Ramadan, sacred months)

**JSON-LD:** `WebPage` + `FAQPage` + `HowTo` (steps to find today's Hijri date)

---

### PAGE 4: Today Gregorian — `/date/today/gregorian`

**Target keywords:** التاريخ الميلادي اليوم, تاريخ اليوم ميلادي

**Rendering:** `revalidate = 3600`

**Sections:**

```
┌──────────────────────────────────────────────┐
│  GREGORIAN DATE HERO                         │
│  Thursday, 19 March 2026                     │
│  الموافق: ١٤ رمضان ١٤٤٧ هجري               │
│  [Week number] [Day of year] [Days until EOY]│
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  DATE FACTS GRID (4 cards)                   │
│  [اليوم 79 من 2026] [الأسبوع 12]            │
│  [Julian Day 2461119] [ISO: 2026-03-19]      │
└──────────────────────────────────────────────┘

[SEO content — month details, Gregorian calendar facts]
[FAQ]
[Link to Hijri equivalent]
```

**Shadcn components:**
- `Card` grid for date facts
- `Badge` for weekday
- `Separator`

---

### PAGE 5: Converter — `/date/converter`

**Target keywords:** تحويل التاريخ, تحويل ميلادي الى هجري, تحويل هجري الى ميلادي, محول التاريخ

**Rendering:** Static page shell, converter logic via Server Action

**This is the most important interactive page. Architecture:**

The page renders server-side with today's date pre-converted (SSR). The form is a client component that calls a **Server Action** (not an API route) for conversion. This keeps the page static but results fast.

```
┌─────────────────────────────────────────────────────────┐
│  CONVERTER LAYOUT (2-col desktop, stack on mobile)      │
│                                                         │
│  LEFT: INPUT PANEL (ConverterForm — 'use client')       │
│  ┌─────────────────────────────────────────────┐        │
│  │  Direction Toggle:                          │        │
│  │  [ميلادي ← هجري] [هجري ← ميلادي]           │        │
│  │                                             │        │
│  │  Date Input:                                │        │
│  │  [shadcn Calendar / DatePicker]            │        │
│  │  Or manual: [Day ▼] [Month ▼] [Year input] │        │
│  │                                             │        │
│  │  Method:                                    │        │
│  │  [أم القرى ●] [فلكي ○] [مدني ○]            │        │
│  │                                             │        │
│  │  Country (optional):                        │        │
│  │  [Select from existing countries API ▼]    │        │
│  │                                             │        │
│  │  [تحويل التاريخ →] (Button, full width)    │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  RIGHT: RESULT PANEL (ConverterResult)                  │
│  ┌─────────────────────────────────────────────┐        │
│  │  النتيجة                                    │        │
│  │  ┌───────────────────────────────────────┐  │        │
│  │  │  ١٤ رمضان ١٤٤٧ هجري                 │  │        │
│  │  │  14 Ramadan 1447 AH                  │  │        │
│  │  │  ISO: 1447-09-14                     │  │        │
│  │  │  Julian Day: 2461119                 │  │        │
│  │  └───────────────────────────────────────┘  │        │
│  │  [نسخ النص] [مشاركة] [تحميل .ics] [تضمين]  │        │
│  └─────────────────────────────────────────────┘        │
│                                                         │
│  ADDITIONAL RESULT INFO                                 │
│  طريقة الحساب المستخدمة: أم القرى                      │
│  الشهر: رمضان (شهر الصيام)                             │
│  ملاحظة: قد يختلف التاريخ يوماً في بعض الدول           │
└─────────────────────────────────────────────────────────┘

[SEO Content: How-it-works section with HowTo schema]
[Method explanation cards — 3 cards, one per method]
[FAQ — 5 questions with FAQPage schema]
[Common conversions table — pre-computed popular dates]
```

**Server Action for conversion:**
```typescript
'use server'
async function convertDateAction(formData: FormData) {
  // runs on server/edge, uses adapter
  // returns ConvertDateResult
}
```

**Shadcn components:**
- `Calendar` (shadcn date picker) for date input
- `Select` for day/month/year dropdowns (mobile-friendly alternative)
- `RadioGroup` for direction and method selection
- `Combobox` for country selector (reuse existing country data)
- `Button` for convert action
- `Card` for result display
- `Tabs` for showing alternate method results
- `Separator`
- `CopyButton` (custom, uses shadcn `Button` + clipboard API)
- `Tooltip` explaining each method

**JSON-LD:** `SoftwareApplication` + `HowTo` + `FAQPage`

**`.ics` download:** Generate on client side (pure JS, no server needed):
```typescript
// ICS file content for a converted date
const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART;VALUE=DATE:${iso}\nSUMMARY:${arabicDate}\nEND:VEVENT\nEND:VCALENDAR`
```

**Embed widget:** Generate an iframe code string:
```html
<iframe src="https://yoursite.com/date/converter?embed=1&date=..." width="400" height="300"></iframe>
```

---

### PAGE 6: Hijri-to-Gregorian Direction Page — `/date/hijri-to-gregorian`

**Target keywords:** تحويل هجري الى ميلادي, من هجري الى ميلادي

**Why separate page from /converter:** Different keyword, different search intent (user already knows direction), gets its own ranking.

**Layout:** Same as converter but with direction pre-set to Hijri→Gregorian and locked, with dedicated H1 and SEO content for this specific direction.

**Pre-fill:** Hijri input fields by default. Show today's Hijri date pre-filled.

---

### PAGE 7: Gregorian-to-Hijri Direction Page — `/date/gregorian-to-hijri`

**Target keywords:** تحويل ميلادي الى هجري, من ميلادي الى هجري

Same as Page 6 but opposite direction, own H1, own SEO content.

---

### PAGE 8: Gregorian Year Calendar — `/date/calendar/[year]`

**Target keywords:** التقويم الميلادي [year], تقويم [year] ميلادي

**Rendering:** `generateStaticParams` for current year ±3, ISR for rest

**Sections:**

```
┌─────────────────────────────────────────────────────┐
│  YEAR HEADER                                        │
│  التقويم الميلادي 2026                             │
│  [ ← 2025 ] [ اذهب إلى سنة: [input] ] [ 2027 → ] │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  12-MONTH GRID                                      │
│  Each month = Card with:                            │
│  - Month name + year in header                      │
│  - 7-col day grid (Sa-Fr for Arabic RTL start)      │
│  - Each day = link to /date/[year]/[month]/[day]    │
│  - Highlighted: today, Islamic holidays             │
│  - Badge on days that start a new Hijri month       │
└─────────────────────────────────────────────────────┘

┌──────────────────────────────────┐
│  ISLAMIC EVENTS THIS YEAR        │
│  List of key dates with links    │
└──────────────────────────────────┘

[Year facts: leap year?, total weeks, etc.]
[Print / Download .ics (full year)]
```

**Shadcn components:**
- `Card` per month
- `Button` for navigation and actions
- `Badge` for special days
- `Select` for year jump

---

### PAGE 9: Hijri Year Calendar — `/date/calendar/hijri/[year]`

**Target keywords:** التقويم الهجري [year], تقويم [year] هجري

Same structure as Gregorian calendar but:
- Grid organized by Hijri months
- Shows Gregorian equivalents in each cell
- Highlights: Ramadan, Eid al-Fitr, Eid al-Adha, Mawlid, Islamic New Year
- Mark sacred months header in a distinct color

**JSON-LD:** `WebPage` + `BreadcrumbList` + `Event` objects for Islamic holidays

---

### PAGE 10: Country Date Page — `/date/country/[countrySlug]`

**Target keywords:** التاريخ الهجري اليوم في [country], تاريخ اليوم في [country]

**Rendering:** `generateStaticParams` for all countries from existing DB, `revalidate = 3600`

**Data source:** Existing Supabase countries table. Query by slug.

**Sections:**

```
┌─────────────────────────────────────────────────────┐
│  COUNTRY HEADER                                     │
│  [Country flag emoji/icon]                          │
│  التاريخ اليوم في المغرب                           │
│  [Local time from existing time data if available]  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DATE DISPLAY                                       │
│  Hijri: ١٤ رمضان ١٤٤٧                             │
│  طريقة الحساب: الرصد الفلكي (المغرب)               │
│  ميلادي: 19 March 2026                            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  METHOD NOTE CARD                                   │
│  "يعتمد المغرب الحساب الفلكي في تحديد..."          │
│  (country-specific 80-120 word explanation)         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  COMPARISON WITH OTHER COUNTRIES                    │
│  Table: Country | Method | Today's Hijri Date       │
│  السعودية | أم القرى | ١٤ رمضان                   │
│  المغرب   | فلكي     | ١٤ رمضان                   │
│  مصر      | فلكي     | ١٤ رمضان                   │
└─────────────────────────────────────────────────────┘

[Related Programmatic Links]
[FAQ with FAQPage schema]
```

**Shadcn components:** `Card`, `Table`, `Badge`, `Alert` (for method explanations)

---

### PAGE 11: Programmatic Gregorian Date — `/date/[year]/[month]/[day]`

**This is the SEO engine. Every page must be unique. Follow these rules strictly.**

**Target keywords:** [day] [month] [year] كم هجري, [day] [month] كم يوافق هجري

**Example URL:** `/date/2026/03/19`

**Rendering:** Tier A static (±5 years), Tier B ISR `revalidate = 86400`

**Page structure:**

```
┌─────────────────────────────────────────────────────┐
│  MAIN CONVERSION RESULT (above fold, prominent)     │
│  19 مارس 2026                                      │
│  الموافق: ١٤ رمضان ١٤٤٧ هجري                     │
│  اليوم: الخميس                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  3-METHOD COMPARISON TABLE                          │
│  أم القرى:   ١٤ رمضان ١٤٤٧                        │
│  فلكي:       ١٤ رمضان ١٤٤٧                        │
│  مدني:       ١٣ رمضان ١٤٤٧                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DATE FACTS (unique data — prevents thin content)   │
│  اليوم من السنة: 78 من 365                         │
│  رقم الأسبوع: 12                                   │
│  Julian Day Number: 2461119                        │
│  ISO 8601: 2026-03-19                               │
│  ربع السنة: Q1                                     │
│  أيام حتى نهاية السنة: 287                         │
│  [IF special day]: نبذة عن هذا اليوم...           │
└─────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  NAVIGATION                                       │
│  [ ← 18 مارس 2026 ] [ 20 مارس 2026 → ]          │
│  [ نفس اليوم العام الماضي ] [ نفس اليوم القادم ]  │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│  UNIQUE CONTEXTUAL BLOCK (CRITICAL for SEO)       │
│  Generated programmatically using date facts:     │
│  - If Ramadan: note about fasting day count       │
│  - If Eid: celebration note                       │
│  - If start of month: new Hijri month note        │
│  - If leap year / special astronomical event:     │
│    mention it                                     │
│  - If within ±3 days of a major Islamic event:    │
│    contextual link                                │
│  Minimum: 60 words of unique content per page    │
└───────────────────────────────────────────────────┘

[Convert Another Date — inline mini-converter]
[Related Dates: Same day last year, Same Hijri day next year]
[FAQ — 3 Qs specific to this date]
[Country Differences — if methods differ for this date]
```

**Unique content generation strategy (critical — prevents Google "thin content" penalty):**

```typescript
function generateUniqueContext(gregorianDate: Date, hijriResult: ConvertDateResult): string {
  const facts = []

  // Day of year
  facts.push(`يوم ${getDayOfYear(gregorianDate)} من أيام السنة الميلادية ${gregorianDate.getFullYear()}`)

  // Hijri month special notes
  if (hijriResult.month === 9) facts.push('— يصادف هذا اليوم شهر رمضان المبارك')
  if (hijriResult.month === 12) facts.push('— يقع في ذي الحجة، شهر الحج')
  if ([1, 7, 11, 12].includes(hijriResult.month)) facts.push('— من الأشهر الحرم')

  // First/last of month
  if (hijriResult.day === 1) facts.push('— مطلع هلال شهر جديد')
  if (hijriResult.day >= 28) facts.push('— قرب نهاية الشهر الهجري')

  // Leap year
  if (isLeapYear(gregorianDate.getFullYear())) facts.push('— السنة الميلادية كبيسة (366 يوماً)')

  return facts.join(' ')
}
```

**Metadata generation:**
```typescript
export async function generateMetadata({ params }) {
  const { year, month, day } = await params
  const hijri = convertDate({ date: `${year}-${month}-${day}`, toCalendar: 'hijri' })
  return {
    title: `${day} ${getGregorianMonthAr(month)} ${year} — ${hijri.formatted.ar} | [Brand]`,
    description: `تاريخ ${day} ${getGregorianMonthAr(month)} ${year} بالهجري هو ${hijri.formatted.ar}. تحويل فوري بثلاث طرق حساب.`,
    alternates: { canonical: `/date/${year}/${month}/${day}` },
    openGraph: { ... }
  }
}
```

**JSON-LD:**
```json
{
  "@type": "WebPage",
  "name": "19 مارس 2026 — 14 رمضان 1447",
  "breadcrumb": { ... },
  "mainEntity": {
    "@type": "FAQPage",
    "mainEntity": [
      { "name": "كم يوافق 19 مارس 2026 بالهجري؟", "acceptedAnswer": { ... } },
      { "name": "ما هو اليوم الموافق 14 رمضان 1447؟", "acceptedAnswer": { ... } }
    ]
  }
}
```

---

### PAGE 12: Programmatic Hijri Date — `/date/hijri/[year]/[month]/[day]`

**Target keywords:** [day] [month hijri] [year] كم ميلادي, [day] رمضان [year] كم ميلادي

Mirror of Page 11 but starting from Hijri. Same structure, different primary data direction.

Key difference: primary display shows Hijri date prominently, with Gregorian below. Multiple Gregorian results shown if methods differ.

---

## 7. SEO Technical Implementation

### 7.1 Metadata API Pattern (every page)

```typescript
// In every page file
export async function generateMetadata({
  params,
}: {
  params: Promise<Record<string, string>>
}): Promise<Metadata> {
  const resolvedParams = await params
  // compute title, description, canonical, og from resolvedParams
  return {
    title: '...', // ≤60 chars
    description: '...', // 120-155 chars
    alternates: {
      canonical: 'https://yoursite.com/date/...',
      languages: {
        'ar': 'https://yoursite.com/ar/date/...',
        'en': 'https://yoursite.com/en/date/...',
      }
    },
    openGraph: {
      title: '...',
      description: '...',
      url: '...',
      images: [{ url: '/api/og?...', width: 1200, height: 630 }],
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary_large_image',
      title: '...',
      description: '...',
      images: ['/api/og?...'],
    },
    robots: { index: true, follow: true },
  }
}
```

### 7.2 Dynamic OG Image Route

Create a route handler for dynamic Open Graph images: `/api/og/date`

Use `@vercel/og` (ImageResponse) to generate images server-side:
```typescript
// Shows the date in both calendars as a beautiful card image
// 1200x630px, Arabic text, brand colors from new.css
```

### 7.3 JSON-LD Component

Create a reusable `JsonLd` server component:
```typescript
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

Use in `<head>` via `layout.tsx` or directly in page return. **Never in client components.**

### 7.4 Breadcrumbs (every page)

Structure:
```
الرئيسية > تاريخ > اليوم > هجري
الرئيسية > تاريخ > محول > ميلادي إلى هجري
الرئيسية > تاريخ > 2026 > 03 > 19
```

Use shadcn `Breadcrumb` component + generate BreadcrumbList JSON-LD.

### 7.5 Canonical & hreflang

Every page must include:
```typescript
alternates: {
  canonical: absoluteUrl,
  languages: { 'ar': arUrl, 'en': enUrl }
}
```

Redirect slug variants to canonical (e.g., `/date/2026/3/19` → `/date/2026/03/19`).

---

## 8. Sitemap Strategy

### 8.1 Sitemap Index (maximum Google crawl efficiency)

Because total pages exceed 50,000 (Google's per-sitemap limit), use a **sitemap index**:

```
/sitemap.xml                → Sitemap index listing all sitemaps below
/sitemap-core.xml           → Hub, today pages, converter, directions (priority 1.0-0.9)
/sitemap-gregorian-recent.xml  → Gregorian dates current year ±3 (priority 0.9)
/sitemap-gregorian-mid.xml  → Gregorian dates ±10 years (priority 0.7)
/sitemap-gregorian-old.xml  → All other Gregorian dates (priority 0.4)
/sitemap-hijri-recent.xml   → Hijri current year ±3 (priority 0.9)
/sitemap-hijri-old.xml      → All other Hijri dates (priority 0.4)
/sitemap-calendars.xml      → Calendar pages (priority 0.7)
/sitemap-countries.xml      → Country pages (priority 0.6)
```

### 8.2 Priority Values:

| Page Type | Priority | Changefreq |
|---|---|---|
| Hub `/date` | 1.0 | daily |
| `/date/today` | 1.0 | daily |
| `/date/today/hijri` | 1.0 | daily |
| `/date/today/gregorian` | 1.0 | daily |
| `/date/converter` | 0.95 | weekly |
| `/date/hijri-to-gregorian` | 0.9 | weekly |
| `/date/gregorian-to-hijri` | 0.9 | weekly |
| Gregorian dates ±1 year | 0.85 | weekly |
| Gregorian dates ±5 years | 0.75 | monthly |
| Gregorian dates ±25 years | 0.6 | monthly |
| Gregorian dates historical | 0.4 | yearly |
| Hijri current year ±2 | 0.85 | weekly |
| Calendar current year ±2 | 0.8 | monthly |
| Country pages | 0.7 | daily |

### 8.3 Sitemap Implementation in Next.js 16:

Option A: Use `app/sitemap.ts` (built-in, auto-merged):
```typescript
// app/sitemap.ts — for core pages only
import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: '/date', lastModified: new Date(), priority: 1.0, changeFrequency: 'daily' },
    // ...
  ]
}
```

Option B: Use route handlers for dynamic sitemaps:
```typescript
// app/sitemap-gregorian-recent.xml/route.ts
export async function GET() {
  const dates = generateDateRange(subYears(now, 3), addYears(now, 3))
  const xml = buildSitemapXml(dates.map(d => ({
    url: `/date/${d.year}/${d.month}/${d.day}`,
    priority: 0.85,
    lastmod: today,
    changefreq: 'weekly'
  })))
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
```

**Use Option B for all large sitemaps.** Max 50,000 URLs per sitemap file.

### 8.4 robots.txt additions:

```
Sitemap: https://yoursite.com/sitemap.xml
Sitemap: https://yoursite.com/sitemap-core.xml
Sitemap: https://yoursite.com/sitemap-gregorian-recent.xml
# ... etc
```

---

## 9. Performance Rules (Non-Negotiable)

### 9.1 Rendering strategy per page:

| Page | Strategy | Rationale |
|---|---|---|
| Hub | `revalidate = 3600` | Shows today's date, needs hourly refresh |
| Today pages | `revalidate = 3600` | Same |
| Converter shell | `force-static` | Shell is static, data via Server Action |
| Direction pages | `force-static` | Static content, tool is client |
| Programmatic Tier A | `generateStaticParams` + no revalidate | Build-time static |
| Programmatic Tier B | `dynamicParams = true` + `revalidate = 86400` | ISR |
| Calendar pages | `generateStaticParams` for current ±2, ISR for rest | |
| Country pages | `generateStaticParams` + `revalidate = 3600` | |

### 9.2 Bundle size rules:

- **Never** import the full `@internationalized/date` library in client components — only use the adapter in server components
- The converter form client component should only import shadcn components + React hooks
- Dynamic import heavy components (calendar grid) with `next/dynamic` + skeleton loading
- Target: <80KB client JS per page

### 9.3 'use cache' directive (Next.js 15/16 feature):

For expensive computations (generating a full year calendar), use the new `'use cache'` directive:
```typescript
async function getYearCalendarData(year: number) {
  'use cache'
  // This result is cached at the server/CDN level
  return computeFullYearCalendar(year)
}
```

### 9.4 Image optimization:

- Dynamic OG images via `@vercel/og` (edge-compatible)
- Use `next/image` for any static images
- Use SVG icons (lucide-react) — zero loading cost
- No image carousels or heavy media on date pages

### 9.5 Font loading:

Follow the site's existing font configuration in `new.css`. Ensure:
```css
@font-face {
  font-family: 'YourArabicFont';
  font-display: swap; /* prevents FOIT */
}
```

In `<head>` (via layout): `<link rel="preload" as="font" type="font/woff2" href="/fonts/arabic.woff2" crossOrigin="anonymous">`

---

## 10. Internal Linking Rules

Every page must include these internal links (critical for PageRank flow):

| Page | Must link to |
|---|---|
| Hub | today, converter, hijri-to-gregorian, gregorian-to-hijri, current year calendar (both), top 5 country pages |
| Today combined | today/hijri, today/gregorian, converter, yesterday, tomorrow |
| Today hijri | today/gregorian, converter, hub, hijri-to-gregorian, current hijri calendar |
| Today gregorian | today/hijri, converter, hub, gregorian-to-hijri, current gregorian calendar |
| Converter | hub, today, hijri-to-gregorian, gregorian-to-hijri |
| Programmatic date | hub, converter, prev day, next day, same day last year, same Hijri day next year, country page (if relevant) |
| Calendar | hub, converter, each day → programmatic page, prev/next year |
| Country | hub, today/hijri, converter, programmatic dates for local holidays |

**Anchor text must contain keywords.** Never use "اضغط هنا" or "اقرأ المزيد" alone. Use "تحويل 19 مارس 2026 إلى هجري" style anchors.

---

## 11. Schema Markup Reference

### Per page type:

```typescript
// CONVERTER PAGE
const converterSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'محول التاريخ الهجري والميلادي',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'تحويل فوري بين التاريخ الهجري والميلادي بثلاث طرق حساب',
  url: 'https://yoursite.com/date/converter',
}

// PROGRAMMATIC DATE PAGE
const datePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: '19 مارس 2026 — 14 رمضان 1447 هجري',
  description: '...',
  breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [...] },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'كم يوافق 19 مارس 2026 بالهجري؟',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '19 مارس 2026 يوافق 14 رمضان 1447 هجري وفق حساب أم القرى.'
        }
      }
    ]
  }
}

// CALENDAR PAGE — Islamic holiday events
const ramadanEventSchema = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'رمضان 1447 هجري',
  startDate: '2026-03-01',
  endDate: '2026-03-30',
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  location: { '@type': 'Place', name: 'العالم الإسلامي' }
}
```

---

## 12. Copy/Share/Export Functionality

### Copy Arabic text (DateShareActions client component):
```typescript
// Copy formats to offer:
const formats = {
  'full': '١٩ مارس ٢٠٢٦ — ١٤ رمضان ١٤٤٧ هجري',
  'hijri_only': '١٤ رمضان ١٤٤٧ هـ',
  'gregorian_only': '19 March 2026',
  'both_numeric': '2026/03/19 — 1447/09/14'
}
```

### Share via Web Share API (with fallback):
```typescript
if (navigator.share) {
  navigator.share({ title, text, url })
} else {
  // fallback: copy URL to clipboard
}
```

### .ics download (client-side, no server needed):
```typescript
function downloadIcs(date: string, titleAr: string) {
  const content = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${date.replace(/-/g, '')}`,
    `SUMMARY:${titleAr}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n')
  
  const blob = new Blob([content], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  // trigger download
}
```

### Embed widget code (iframe):
```typescript
const embedCode = `<iframe 
  src="https://yoursite.com/date/converter?embed=1" 
  width="360" height="280" 
  frameborder="0" 
  title="محول التاريخ الهجري والميلادي"
></iframe>`
```

---

## 13. What NOT To Do (Critical Constraints)

1. **Do not break existing pages.** This feature adds new routes only under `/date`. Do not modify any existing routes, layouts, or global components.

2. **Do not create a new Supabase client.** The existing codebase already has both a server-side and client-side Supabase client. Find them, read them, and import from them. Creating a duplicate client causes connection inconsistencies and hard-to-debug auth issues.

3. **Do not duplicate existing data-fetching functions.** If the codebase already has a function to fetch countries, or cities, or any other shared data — call that function. Do not write a second version of it. If you need it to return a slightly different shape, either pass a parameter to the existing function (if the change is backward-compatible) or transform the result after calling it.

4. **Do not import `@internationalized/date` in client components.** All conversion logic stays server-side in the adapter. Client components only receive the already-converted result as props.

4. **Do not use `searchParams` on static programmatic pages.** `searchParams` forces dynamic rendering and destroys static generation. Use path params only for programmatic routes.

5. **Do not generate all 110,000+ pages at build time.** Use Tier A/B/C strategy. Build only Tier A (±5 years ~3,650 pages). ISR handles the rest.

6. **Do not ship heavy JS to programmatic pages.** These are pure informational pages. They should load in <1 second on mobile 4G. Only the copy/share button needs client JS.

7. **Do not create duplicate content.** Each programmatic page MUST include the unique contextual block. Without it, Google may de-index as thin content.

8. **Do not hardcode file paths from the existing codebase.** Reference existing utilities by exploring and finding them during Step 1 — not by guessing filenames. This document intentionally does not name existing files because they may differ from expectations.

9. **Do not refactor or "improve" existing code while adding new features.** Even if you see something in the existing codebase that looks like it could be written better, leave it exactly as it is. Your only job is to add new functionality under `/date`. Refactoring existing code during a feature addition is how bugs get introduced silently.

10. **Do not add tracking pixels or heavy analytics on every date page.** Use the site's existing privacy-first analytics setup only — find how it is implemented in existing pages and follow the same pattern.

11. **Do not block the main thread on conversion.** Conversion via the adapter is synchronous and fast. But if generating a full-year calendar, use `'use cache'` to avoid re-computing on every request.

---

## 14. Implementation Priority Order

Complete in this exact order to get SEO value as fast as possible:

### Phase 1 — Core traffic pages (Week 1):
1. Install `@internationalized/date` and build the conversion adapter
2. Hub page `/date` — server rendered, today's dates, feature cards, SEO content shell
3. Today combined `/date/today` — method comparison table, share actions
4. Today Hijri `/date/today/hijri` — full content, method toggle
5. Converter `/date/converter` — Server Action, full UX with all inputs

### Phase 2 — Direction pages + Hijri Today (Week 1-2):
6. `/date/gregorian-to-hijri` and `/date/hijri-to-gregorian`
7. `/date/today/gregorian`
8. Dynamic OG image route `/api/og/date`
9. JSON-LD on all Phase 1-2 pages
10. Core sitemap

### Phase 3 — Programmatic engine (Week 2-3):
11. `/date/[year]/[month]/[day]` with Tier A `generateStaticParams`
12. `/date/hijri/[year]/[month]/[day]` with Tier A `generateStaticParams`
13. Unique context generation logic
14. Internal linking on all programmatic pages
15. Sharded sitemaps for date pages

### Phase 4 — Calendars + Country pages (Week 3-4):
16. `/date/calendar/[year]` — Gregorian calendar grid
17. `/date/calendar/hijri/[year]` — Hijri calendar grid with event markers
18. `/date/country/[countrySlug]` using existing countries DB
19. Country pages sitemap
20. Submit all sitemaps to Google Search Console

---

## 15. Quick Reference: Shadcn Components Per Page

| Page | Key Shadcn Components |
|---|---|
| Hub | Card, Button, Badge, Separator |
| Today | Card, Table, Badge, Button, Tooltip |
| Today Hijri | Card, Tabs, Progress, Alert, Table, Badge |
| Today Gregorian | Card, Badge, Separator |
| Converter | Calendar, Select, RadioGroup, Combobox, Button, Card, Tabs, Tooltip |
| Direction pages | (same as Converter, simplified) |
| Programmatic date | Card, Table, Button, Badge, Separator |
| Calendar | Card, Button, Badge, Select |
| Country | Card, Table, Badge, Alert |

---

## 16. Environment Variables Needed

```bash
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_SITE_NAME=YourSiteName
# Supabase — use existing variables already in .env
```

---

## 17. Testing Checklist (run before deploy)

- [ ] All programmatic pages render server-side (check page source — content must be in HTML, not JS)
- [ ] JSON-LD appears in `<head>` on every page (use Google Rich Results Test)
- [ ] Canonical tags present on all pages
- [ ] hreflang tags present
- [ ] No duplicate titles or descriptions (check sitemap + spot check 10 random pages)
- [ ] Conversion results match reference (test 10 known dates against islamicfinder.org)
- [ ] Mobile layout renders correctly (RTL, no overflow)
- [ ] Copy button works
- [ ] .ics download opens in calendar app
- [ ] Prev/Next navigation works on programmatic pages
- [ ] Country pages load and show correct method
- [ ] Lighthouse score ≥ 90 performance on main pages (run on `/date`, `/date/today`, `/date/converter`)
- [ ] Core Web Vitals: LCP < 1.5s, CLS < 0.1
- [ ] Sitemap returns valid XML (validate with sitemap validator)
- [ ] robots.txt lists all sitemaps

---

---

## 18. Final Analysis — Gaps Identified & Patched

After a full review of this plan, the following issues were found and must be handled during implementation. These are **not optional** — each one will cause a real problem if missed.

---

### GAP 1: The "Today" Timezone Problem (Critical UX Bug)

**The problem:** The server renders "today's date" using UTC time. A user in Saudi Arabia (UTC+3) visiting at 11:30 PM UTC is actually at 2:30 AM their time — the next calendar day. They will see the wrong date.

**The fix:** The Today pages must detect the user's local timezone on the client side and, if it differs from the server-rendered date, update the display. Use this pattern:

```typescript
// In a small 'use client' wrapper component around the date display:
// On mount, check if the client's local date differs from the server-rendered date.
// If yes, re-render the date using the client's local timezone.
// This is a progressive enhancement — server renders UTC, client corrects silently.

const clientDate = new Date()
const clientDateString = clientDate.toLocaleDateString('en-CA') // 'YYYY-MM-DD' format
// Compare with the server-rendered date and update if different
```

The server component still renders a date (good for SEO bots which are UTC). The client component hydrates silently and corrects for the real user. This keeps both SEO correctness and UX accuracy.

---

### GAP 2: Route Conflict Between Static and Dynamic Segments

**The problem:** The route structure has both `/date/converter` (static) and `/date/[year]/[month]/[day]` (dynamic). The dynamic route also has `/date/hijri/[...]`. The segment `hijri` could match `[year]` if someone visits `/date/hijri/...`.

**The fix:** In Next.js App Router, **static segments always win over dynamic segments**. So `/date/converter` will always resolve correctly before `[year]`. However, explicitly verify this by checking that all static route folders (`converter`, `today`, `calendar`, `country`, `hijri-to-gregorian`, `gregorian-to-hijri`) are direct subfolders of `date/` — they will take priority. The `hijri` folder under `date/` also takes priority over `[year]`. Document this priority in a comment in the route folders.

---

### GAP 3: Invalid Date Handling — `not-found` and Validation

**The problem:** A user can visit `/date/2026/13/99` (invalid date). Without validation, the adapter will either throw or return garbage data, breaking the page.

**The fix:** Add date validation at the start of every programmatic page component, before calling the converter:

```typescript
// At the top of the page component, after awaiting params:
const isValidDate = isValid(new Date(`${year}-${month}-${day}`))
if (!isValidDate || month > 12 || day > 31) {
  notFound() // renders the nearest not-found.tsx — clean 404
}

// Also validate range — redirect out-of-range dates to converter:
const dateYear = parseInt(year)
if (dateYear < 1924 || dateYear > 2077) {
  redirect('/date/converter')
}
```

Create a `not-found.tsx` inside the date segment that shows a helpful message and links back to the converter and hub.

---

### GAP 4: Zero-Padding Canonical Redirect (Duplicate Content Risk)

**The problem:** `/date/2026/3/9` and `/date/2026/03/09` are technically different URLs but show the same content. Google may see both and split ranking signals.

**The fix:** Inside the programmatic page, check if params have proper zero-padding and redirect if not:

```typescript
const { year, month, day } = await params
// Redirect to canonical zero-padded version
if (month.length < 2 || day.length < 2) {
  redirect(`/date/${year}/${month.padStart(2,'0')}/${day.padStart(2,'0')}`)
}
```

This is a permanent redirect pattern — handle it in the page itself, not middleware, to avoid adding middleware latency to all routes.

---

### GAP 5: Shared Date Layout File

**The problem:** The plan doesn't define a shared layout for the `/date` segment. Without it, every date page needs to repeat breadcrumb and metadata setup.

**The fix:** Create a `date/layout.tsx` (Server Component) that:
- Applies `dir="rtl"` to the date section wrapper if not already global
- Provides a shared `<DateBreadcrumb />` base
- Does **not** add `<html>` or `<body>` — just a wrapping `<div>` or `<section>` with appropriate classes from `new.css`
- Does **not** include any page-specific content — only structural shell

```typescript
// date/layout.tsx
export default function DateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="date-feature-root"> {/* class defined in new.css */}
      {children}
    </div>
  )
}
```

---

### GAP 6: `loading.tsx` Skeleton Files (Prevents Layout Shift)

**The problem:** The calendar grid and programmatic pages have heavy server-computed content. Without loading skeletons, the user sees a blank page while the server renders — increasing perceived load time and CLS score.

**The fix:** Create `loading.tsx` files next to the heaviest pages using shadcn `Skeleton`:

```
date/calendar/[year]/loading.tsx     → 12-month grid skeleton
date/[year]/[month]/[day]/loading.tsx → Conversion result skeleton
date/converter/loading.tsx           → Form skeleton
```

Each loading file uses shadcn `Skeleton` component to show the shape of the page while React streams the server content.

---

### GAP 7: `@internationalized/date` Library Range Limitation

**The problem:** `IslamicUmalquraCalendar` in `@internationalized/date` only has precomputed data for approximately **1300 AH to 1600 AH** (roughly 1882–2174 CE). Dates outside this range will throw.

**The fix:** Add a range guard in the conversion adapter:

```typescript
const HIJRI_MIN_YEAR = 1300
const HIJRI_MAX_YEAR = 1599
const GREGORIAN_MIN_YEAR = 1882
const GREGORIAN_MAX_YEAR = 2174

// In convertDate():
if (toCalendar === 'hijri' && (inputGregorianYear < GREGORIAN_MIN_YEAR || inputGregorianYear > GREGORIAN_MAX_YEAR)) {
  throw new RangeError(`Date out of supported range for Hijri conversion`)
}
```

Document these limits clearly in the adapter file and in the converter UI (show a note to users when they pick an out-of-range date).

---

### GAP 8: Arabic vs Western Numerals — User Preference

**The problem:** Some Arabic users prefer Western numerals (1, 2, 3) and some prefer Arabic-Indic (١, ٢, ٣). The current plan defaults to Arabic-Indic without a toggle.

**The fix:** The adapter already outputs both formats in `formatted.ar` and `formatted.arIndic`. Add a simple numeral preference toggle to the converter and Today pages — store preference in `localStorage` (client-side only, since it's a display preference and not SEO-relevant). Default to Arabic-Indic numerals for Arabic locale users.

---

### GAP 9: Server Action Rate Limiting on Converter

**The problem:** The converter's Server Action could be called in a loop (abuse or bots), causing unnecessary server load.

**The fix:** Use Next.js `headers()` to check rate limiting, or simply add a response cache for the Server Action result. Since all date conversions are deterministic (same input → same output), consider caching the Server Action response using Next.js `'use cache'`:

```typescript
'use server'
async function convertDateAction(input: ConvertDateInput) {
  'use cache'
  // Result is cached — identical inputs return immediately
  return convertDate(input)
}
```

This also dramatically speeds up the converter for repeated or common queries.

---

### GAP 10: `generateStaticParams` for Calendar Pages

**The problem:** The calendar pages `[year]` only need a year param, but the plan didn't specify the exact range for `generateStaticParams`.

**The fix:**

```typescript
// date/calendar/[year]/page.tsx
export async function generateStaticParams() {
  const currentYear = new Date().getFullYear()
  // Pre-build: current year ± 3 = 7 years of calendars
  return Array.from({ length: 7 }, (_, i) => ({
    year: String(currentYear - 3 + i)
  }))
}

// date/calendar/hijri/[year]/page.tsx
export async function generateStaticParams() {
  // Pre-build current Hijri year ± 3
  const currentHijriYear = getCurrentHijriYear() // from adapter
  return Array.from({ length: 7 }, (_, i) => ({
    year: String(currentHijriYear - 3 + i)
  }))
}
```

---

### GAP 11: Prefetching Prev/Next Navigation Links

**The problem:** Prev/Next day navigation on programmatic pages is critical UX — users browse date by date. Without prefetching, each click triggers a full page load.

**The fix:** Wrap the `DateNavigation` component links in Next.js `<Link prefetch={true}>`. Since Tier A pages (±5 years) are pre-built static pages, prefetching them is instant (loads from CDN). This makes day-by-day browsing feel like a single-page app.

```typescript
// In DateNavigation.tsx — these are standard Next.js Link components
// Next.js automatically prefetches static pages on hover in production
// For ISR pages, add explicit prefetch
<Link href={prevDayUrl} prefetch={true}>← {prevDayLabel}</Link>
<Link href={nextDayUrl} prefetch={true}>{nextDayLabel} →</Link>
```

---

### GAP 12: OG Image Route Must Be Edge-Compatible

**The problem:** The plan mentions `/api/og/date` for dynamic OG images but doesn't specify the runtime.

**The fix:** The OG image route must use Edge Runtime and `@vercel/og`:

```typescript
// app/api/og/date/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gregorian = searchParams.get('g') // e.g., "19 March 2026"
  const hijri = searchParams.get('h')     // e.g., "14 رمضان 1447"
  
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '1200px', height: '630px', /* brand styles */ }}>
        <div>{hijri}</div>
        <div>{gregorian}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Pass the values as URL query params from `generateMetadata()`:
```typescript
openGraph: {
  images: [`/api/og/date?g=${encodeURIComponent(gregorianFormatted)}&h=${encodeURIComponent(hijriFormatted)}`]
}
```

---

### GAP 13: Missing `date/hijri` Route Priority in App Router

**The problem:** The route `/date/hijri/[year]/[month]/[day]` has the segment `hijri` as a static folder. But `/date/[year]/[month]/[day]` has `[year]` as a dynamic catch-all. If someone navigates to `/date/hijri/1447/09/14`, does it match the static `hijri` folder or the dynamic `[year]` folder?

**The fix:** In Next.js App Router, **a static folder segment always wins over a dynamic segment at the same level.** So `date/hijri/` will always beat `date/[year]/`. This is safe. But add a comment inside `date/[year]/page.tsx` noting this so future developers don't accidentally remove the `hijri` folder thinking it's unreachable.

---

### GAP 14: Islamic Holidays Constant File

**The problem:** Multiple pages (calendar, programmatic date pages, country pages) all need to reference key Islamic dates (Ramadan start, Eid al-Fitr, Eid al-Adha, Islamic New Year, Mawlid). These are currently scattered.

**The fix:** Create a single constants file (inside the date utilities folder) with Islamic holidays for the pre-built year range, computed from the Hijri calendar via the adapter at build time:

```typescript
// Key Islamic events per Hijri year — used by calendar, programmatic pages, and JSON-LD
interface IslamicEvent {
  hijriYear: number
  hijriMonth: number
  hijriDay: number
  nameAr: string
  nameEn: string
  gregorianDate: string // ISO
}

// Compute these at build time using the adapter
// Store as static JSON or a constants object for fast lookup
```

Pages then do a simple lookup: `getIslamicEventsForDate(hijriYear, hijriMonth, hijriDay)` to get event context — powering the unique contextual block on programmatic pages, event markers on calendars, and Event JSON-LD.

---

## 19. Final Checklist Before Handing to AI

Run through this list to confirm the plan is complete:

- [x] AI briefing intro with step-by-step instructions
- [x] Codebase exploration instructions before any coding
- [x] Competitive gaps analysis
- [x] Library decision with justification
- [x] Full route architecture with Next.js 16 async params pattern
- [x] Tiered programmatic page strategy (A/B/C)
- [x] Supabase integration using existing client
- [x] Country Hijri method mapping (hardcoded config)
- [x] Components folder structure with server/client split
- [x] Page-by-page layout specs with shadcn components
- [x] Timezone "today" problem and fix (GAP 1)
- [x] Route conflict resolution (GAP 2)
- [x] Invalid date `notFound()` handling (GAP 3)
- [x] Canonical zero-padding redirect (GAP 4)
- [x] Shared date layout file (GAP 5)
- [x] Loading skeleton files (GAP 6)
- [x] Library date range limits documented (GAP 7)
- [x] Arabic vs Western numeral toggle (GAP 8)
- [x] Server Action caching/rate limiting (GAP 9)
- [x] Calendar `generateStaticParams` range (GAP 10)
- [x] Prev/next prefetching (GAP 11)
- [x] Edge-compatible OG image route (GAP 12)
- [x] Static vs dynamic segment priority documented (GAP 13)
- [x] Islamic holidays constants file (GAP 14)
- [x] SEO technical: metadata API, canonical, hreflang, OG
- [x] Sharded sitemap index strategy with priorities
- [x] Performance rules and rendering strategy table
- [x] Internal linking rules with keyword anchor text
- [x] Schema markup reference for all page types
- [x] Copy/Share/.ics/Embed functionality
- [x] "What NOT to do" constraints
- [x] Phase-by-phase implementation order
- [x] Testing checklist before deploy
- [x] Codebase exploration requirements before first line of code
- [x] Reuse hierarchy (use existing → extend carefully → create new)
- [x] Safety procedure for modifying existing files
- [x] Explicit ban on duplicating Supabase client or data-fetching utilities
- [x] Explicit ban on refactoring existing code during this feature addition

---

*This plan is based on: competitive analysis of top Arabic date tools, Next.js 15/16 official documentation, programmatic SEO case studies, @internationalized/date library documentation, Google Search Central guidance on sitemaps and duplicate content, and direct inspection of what the current top-ranked Arabic date pages are missing.*