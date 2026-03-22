# 📅 Arabic Date Feature Architecture

This document describes the architecture, data flow, and component structure of the Arabic Date feature located in `src/app/date`.

---

## 1. ⚙️ Core Engine: The Date Adapter
All date logic is centralized in `src/lib/date-adapter.ts`. 

- **Library:** Uses `@internationalized/date` by Adobe.
- **Why?** It is the most accurate library for the **Umm al-Qura calendar** (Saudi official), along with support for Tabular/Civil and Astronomical methods.
- **Pattern:** No component calls the date library directly. They all use `convertDate()` from the adapter.
- **Output:** The adapter returns a standardized object with:
    - Arabic month names (`ISLAMIC_MONTH_NAMES_AR`).
    - Weekday names (`DAYS_AR`).
    - Pre-formatted strings (Indic and Western numerals).
    - Julian Day counts and Leap Year detections.

## 2. 📁 Route Architecture (`src/app/date`)

The feature uses a **nested route structure** to maximize SEO for highly competitive keywords like "تاريخ اليوم" and "تحويل التاريخ".

### Key Route Groups:
| Route | Purpose | Tech Stack |
|---|---|---|
| `/date` | **Date Hub** — Main entry point for all date tools. | Static + 1h Revalidate |
| `/date/today` | **Today Overview** — Real-time snapshot in both calendars. | ISR (1h) |
| `/date/converter` | **Date Converter** — Interactive transformation tool. | Client-side Form + Server Actions |
| `/date/calendar/[year]` | **Yearly Calendars** — Complete yearly grids. | Static Params (±3 yrs) + ISR |
| `/date/country/[slug]` | **Country Specific** — Dates adjusted for regional methods. | Supabase query + Timezone formatting |

### Programmatic SEO Pages:
- **`src/app/date/[year]/[month]/[day]`:** Dedicated Gregorian date pages.
- **`src/app/date/hijri/[year]/[month]/[day]`:** Dedicated Hijri date pages.
- **Strategy:** 
  - **Tier A (±5 years):** Pre-built at deploy time via `generateStaticParams`.
  - **Tier B (Historical):** Generated via ISR on-demand (first request).

## 3. 🔄 Data Fetching & Next.js 16 Patterns
- **Async Params:** In Next.js 16, all `params` are Promises. They are consistently awaited: `const { year } = await params;`.
- **Cache Components:** Many server components use the `'use cache';` directive to speed up re-rendering for high-traffic dates.
- **Safe Build-time Dates:** OG Image routes and dynamic pages use `await connection()` to safely access runtime-only data during the build process.
- **Supabase Integration:** Country pages query the `countries` table to determine:
    - The local **IANA Timezone**.
    - The officially adopted **Hijri Method** (e.g., Maghreb vs. Gulf).

## 4. 🧩 Component System (`src/components/date`)

Components are strictly **React Server Components (RSC)** by default.

- **`DateShareActions` (Client):** Handles copying formatted dates, sharing via Navigator API, and downloading `.ics` files. Now upgraded with **Lucide icons** and visual "Done" feedback.
- **`MethodComparisonTable`:** Shows differences between Umm al-Qura, Astronomical, and Civil dates — vital for Islamic religious accuracy.
- **`YearlyCalendar`:** High-performance grid rendering for whole years.
- **`JsonLd`:** Dynamically injects specialized schema for Google:
    - `FAQPage`: Captures common questions like "When is Ramadan?".
    - `BreadcrumbList`: Shows clean navigation in search results.
    - `WebPage`: Standard metadata.

## 5. 🎨 Design & Layout
- **Ad-Ready Layout:** All pages are wrapped in `AdLayoutWrapper` which sets up a three-column grid.
- **Sidebars:** Ad slots (sidebars) automatically appear on screens wider than 1280px.
- **Responsive Main Column:** Uses the `.content-col` class from `new.css` for a perfectly centered 900px content area.
- **Mobile First:** All grids and cards collapse gracefully for a premium touch-first mobile experience.

---

*This architecture ensures that the Date suite is fast (SSR), accurate (Adobe library), and SEO-dominant for the Arabic web.*

---

## 🔗 Example Links (Development)

You can click or copy these links into your browser to explore the different parts of the Date feature:

### 🏠 Main Hub & Tools
- **Date Hub:** [http://localhost:3000/date](http://localhost:3000/date)
- **Date Converter:** [http://localhost:3000/date/converter](http://localhost:3000/date/converter)
- **Today Overall:** [http://localhost:3000/date/today](http://localhost:3000/date/today)
- **Today Hijri:** [http://localhost:3000/date/today/hijri](http://localhost:3000/date/today/hijri)
- **Today Gregorian:** [http://localhost:3000/date/today/gregorian](http://localhost:3000/date/today/gregorian)

### 📅 Programmatic Date Pages
- **Specific Gregorian Date:** [http://localhost:3000/date/2025/05/29](http://localhost:3000/date/2025/05/29) (Dhul-Hijjah 01)
- **Specific Hijri Date:** [http://localhost:3000/date/hijri/1446/12/10](http://localhost:3000/date/hijri/1446/12/10) (Eid al-Adha)
- **Specific Hijri Date (Ramadan):** [http://localhost:3000/date/hijri/1446/09/01](http://localhost:3000/date/hijri/1446/09/01)

### 🗓️ Yearly Calendars
- **Gregorian 2025:** [http://localhost:3000/date/calendar/2025](http://localhost:3000/date/calendar/2025)
- **Hijri 1446:** [http://localhost:3000/date/calendar/hijri/1446](http://localhost:3000/date/calendar/hijri/1446)

### 🌍 Country Specific
- **Saudi Arabia:** [http://localhost:3000/date/country/saudi-arabia](http://localhost:3000/date/country/saudi-arabia)
- **Egypt:** [http://localhost:3000/date/country/egypt](http://localhost:3000/date/country/egypt)
- **Morocco:** [http://localhost:3000/date/country/morocco](http://localhost:3000/date/country/morocco)
