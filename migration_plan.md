# 🏗️ Data Migration Plan — Next.js 16 + New Supabase DB
> **FOR THE AI IDE — Read every word before writing a single line of code.**

---

## 🧠 THE ONE RULE

```
KEEP:   All JSX structure, className, styling, HTML elements, design, layout
CHANGE: Every place that fetches, reads, or resolves data — use the new query functions
DELETE: Old data files, old Supabase clients, old JSON imports, old fetch helpers
```

If a file has no data fetching — do not open it.
If a file has data fetching — update only that part. Leave the JSX return untouched.

---

## 📋 FULL APP ANALYSIS — What Exists and What Changes

Based on the current file tree:

```
app/
├── actions/location.js              → HAS data logic   → UPDATE
├── api/ip-city/route.js             → HAS data logic   → UPDATE
├── api/revalidate/route.js          → HAS cache logic  → REWRITE (infra only)
├── api/search-city/                 → HAS data logic   → UPDATE
├── holidays/
│   ├── actions.js                   → HAS data logic   → UPDATE
│   ├── constants.js                 → inspect: may have hardcoded data → REVIEW
│   ├── HolidaysClient.jsx           → HAS data logic?  → REVIEW, update if yes
│   ├── loading.jsx                  → NO data          → DO NOT TOUCH
│   ├── page.jsx                     → HAS data logic   → UPDATE
│   └── [slug]/
│       ├── loading.jsx              → NO data          → DO NOT TOUCH
│       ├── not-found.jsx            → NO data          → DO NOT TOUCH
│       ├── opengraph-image.jsx      → HAS data logic   → UPDATE
│       └── page.jsx                 → HAS data logic   → UPDATE
├── mwaqit-al-salat/
│   ├── [country]/[city]/
│   │   ├── opengraph-image.jsx      → HAS data logic   → UPDATE
│   │   └── page.jsx                 → HAS data logic   → UPDATE
│   └── page.jsx                     → HAS data logic   → UPDATE
├── time-difference/
│   ├── [from]/[to]/page.jsx         → HAS data logic   → UPDATE
│   └── page.jsx                     → HAS data logic   → UPDATE (if it fetches)
├── time-now/
│   ├── [country]/[city]/page.jsx    → HAS data logic   → UPDATE
│   ├── [country]/page.jsx           → HAS data logic   → UPDATE
│   └── page.jsx                     → HAS data logic   → UPDATE
├── layout.tsx                       → REVIEW only
├── page.jsx                         → HAS data logic?  → REVIEW, update if yes
├── sitemap.js                       → HAS data logic   → UPDATE
├── robots.js                        → likely static    → DO NOT TOUCH
└── manifest.js                      → likely static    → DO NOT TOUCH
```

**BEFORE WRITING ANY CODE:** Open each file marked "REVIEW" and read it. Confirm whether it fetches data. Only then decide what to change.

---

## 🗄️ NEW DATABASE SCHEMA — The Only Source of Truth

```sql
-- EXTENSION FOR SEARCH
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- COUNTRIES TABLE
CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,
  country_code CHAR(2) UNIQUE NOT NULL, -- ISO code (MA, SA, FR)
  country_slug TEXT UNIQUE NOT NULL,
  name_en TEXT,
  name_ar TEXT NOT NULL,
  timezone TEXT
);

-- CITIES TABLE
CREATE TABLE cities (
  id BIGSERIAL PRIMARY KEY,
  country_code CHAR(2) NOT NULL REFERENCES countries(country_code) ON DELETE CASCADE,
  city_slug TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  timezone TEXT NOT NULL,
  population INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  is_capital BOOLEAN DEFAULT FALSE
);

-- UNIQUE CITY PER COUNTRY
CREATE UNIQUE INDEX cities_unique_slug
ON cities(country_code, city_slug);

-- FAST SEARCH INDEXES
CREATE INDEX idx_city_name_ar
ON cities(name_ar text_pattern_ops);

CREATE INDEX idx_city_population
ON cities(population DESC);

CREATE INDEX idx_city_country
ON cities(country_code);

-- TRIGRAM FOR AUTOCOMPLETE SEARCH
CREATE INDEX idx_city_name_ar_trgm
ON cities USING GIN (name_ar gin_trgm_ops);
```

**Important facts about this schema:**
- `countries.timezone` is nullable — always prefer the capital city's timezone
- `cities.timezone` is never null — always reliable
- `city_slug` is unique per country, not globally — always look up with both `country_code` + `city_slug`
- `country_slug` is globally unique — safe to use as the sole URL parameter for countries

---

## 🔑 ENVIRONMENT VARIABLES

Your `.env.local` must have exactly these 4 keys:

```bash
# Supabase Dashboard → Project Settings → API

# Project URL
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co

# "anon / public" key — used in server-side query functions (safe, read-only)
SUPABASE_ANON_KEY=eyJ...

# "service_role" key — used ONLY in scripts and API route admin operations
# NEVER prefix with NEXT_PUBLIC_ — must never reach the browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Random secret for the revalidation webhook
# Generate: openssl rand -base64 32
REVALIDATE_SECRET=your-random-secret-here
```

Add all 4 to your production hosting environment (Vercel → Settings → Environment Variables) as well.

---

## ⚙️ STEP 1 — next.config.ts

Open the file. Add exactly these two keys inside the config object. Touch nothing else.

```typescript
cacheComponents: true,  // enables 'use cache', cacheTag, cacheLife (Next.js 16)
reactCompiler: true,    // stable in N16 — automatic memoization, no side effects
```

---

## 📦 STEP 2 — Dependencies

```bash
npm install @supabase/supabase-js
npm install tsx --save-dev
```

Do not add any other packages. Do not upgrade existing packages.

---

## 📦 STEP 3 — package.json scripts

Add only these. Do not change existing scripts.

```json
"export-fallback": "tsx --env-file=.env.local scripts/export-fallback.ts",
"build": "npm run export-fallback && next build"
```

---

## 📁 STEP 4 — Create the Data Layer

These are all brand new files. Nothing existing is touched in this step.

---

### `lib/db/types.ts`

```typescript
// Countries and cities — matches DB schema exactly
export type Country = {
  id: number
  country_code: string       // "MA"
  country_slug: string       // "morocco"
  name_ar: string
  name_en: string | null
  timezone: string | null    // nullable — fall back to capital city timezone
}

export type City = {
  id: number
  country_code: string
  city_slug: string
  name_ar: string
  name_en: string | null
  lat: number
  lon: number
  timezone: string           // always present
  population: number
  priority: number
  is_capital: boolean
}

export type CityWithCountry = City & {
  country: Pick<Country, 'name_ar' | 'name_en' | 'country_slug' | 'country_code'>
}

// Shape for generateStaticParams on nested routes
export type CityParams = {
  country: string  // country_slug
  city: string     // city_slug
}
```

---

### `lib/supabase/server.ts`

Used in all query functions. Never import in client components.

```typescript
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)
```

---

### `lib/supabase/admin.ts`

Used only in `api/revalidate/route` and `scripts/export-fallback.ts`. Nowhere else.

```typescript
import 'server-only'
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
```

---

### `lib/db/queries/countries.ts`

```typescript
import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { Country } from '@/lib/db/types'
import fallback from '@/lib/db/fallback/countries.json'

export async function getAllCountries(): Promise<Country[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase.from('countries').select('*').order('name_ar')
    if (error || !data?.length) throw new Error(error?.message ?? 'empty')
    return data as Country[]
  } catch (err) {
    console.error('[DB] getAllCountries → fallback:', err)
    return fallback as Country[]
  }
}

export async function getCountryBySlug(slug: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-${slug}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('countries').select('*').eq('country_slug', slug).single()
    if (error) throw new Error(error.message)
    return data as Country
  } catch {
    return (fallback as Country[]).find(c => c.country_slug === slug) ?? null
  }
}

export async function getCountryByCode(code: string): Promise<Country | null> {
  'use cache'
  cacheTag('countries', `country-code-${code}`)
  cacheLife('days')
  try {
    const { data, error } = await supabase
      .from('countries').select('*').eq('country_code', code.toUpperCase()).single()
    if (error) throw new Error(error.message)
    return data as Country
  } catch {
    return (fallback as Country[]).find(c => c.country_code === code.toUpperCase()) ?? null
  }
}

export async function getAllCountrySlugs(): Promise<string[]> {
  'use cache'
  cacheTag('countries')
  cacheLife('days')
  try {
    const { data, error } = await supabase.from('countries').select('country_slug')
    if (error) throw new Error(error.message)
    return (data ?? []).map(c => c.country_slug)
  } catch {
    return (fallback as Country[]).map(c => c.country_slug)
  }
}
```

---

### `lib/db/queries/cities.ts`

```typescript
import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { City, CityParams } from '@/lib/db/types'

export async function getCitiesByCountry(countryCode: string): Promise<City[]> {
  'use cache'
  cacheTag('cities', `cities-${countryCode}`)
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('priority', { ascending: false })
    .order('population', { ascending: false })
  if (error) { console.error(`[DB] getCitiesByCountry(${countryCode}):`, error); return [] }
  return (data ?? []) as City[]
}

export async function getTopCitiesByCountry(countryCode: string, limit = 20): Promise<City[]> {
  'use cache'
  cacheTag('cities', `top-cities-${countryCode}`)
  cacheLife('days')
  const { data } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .order('is_capital', { ascending: false })
    .order('priority',   { ascending: false })
    .order('population', { ascending: false })
    .limit(limit)
  return (data ?? []) as City[]
}

export async function getCityBySlug(countryCode: string, citySlug: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `city-${countryCode}-${citySlug}`)
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('city_slug', citySlug)
    .single()
  if (error) return null
  return data as City
}

export async function getCapitalCity(countryCode: string): Promise<City | null> {
  'use cache'
  cacheTag('cities', `capital-${countryCode}`)
  cacheLife('days')
  const { data } = await supabase
    .from('cities').select('*')
    .eq('country_code', countryCode.toUpperCase())
    .eq('is_capital', true)
    .single()
  return (data as City) ?? null
}

// For generateStaticParams — returns all {country_slug, city_slug} pairs
export async function getAllCityParams(): Promise<CityParams[]> {
  'use cache'
  cacheTag('cities', 'countries')
  cacheLife('days')
  const { data, error } = await supabase
    .from('cities')
    .select('city_slug, country_code, countries!inner(country_slug)')
    .order('population', { ascending: false })
  if (error) { console.error('[DB] getAllCityParams:', error); return [] }
  return (data ?? []).map((row: any) => ({
    country: row.countries.country_slug,
    city: row.city_slug,
  }))
}

// Dynamic search — NOT cached (real-time autocomplete)
export async function searchCities(query: string, limit = 10): Promise<City[]> {
  if (!query || query.trim().length < 2) return []
  const { data } = await supabase
    .from('cities')
    .select('*, countries!inner(country_slug, name_ar, name_en)')
    .ilike('name_ar', `%${query.trim()}%`)
    .order('population', { ascending: false })
    .limit(limit)
  return (data ?? []) as City[]
}
```

---

### `scripts/export-fallback.ts`

Creates local JSON backups of DB data. Runs automatically before every build.
If Supabase is unreachable at runtime, query functions fall back to these files.

```typescript
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('[export-fallback] Starting...')
  mkdirSync('lib/db/fallback', { recursive: true })

  const { data: countries, error: cErr } = await supabase
    .from('countries').select('*').order('name_ar')
  if (cErr) throw new Error(`countries: ${cErr.message}`)
  writeFileSync('lib/db/fallback/countries.json', JSON.stringify(countries, null, 2))
  console.log(`[export-fallback] ✅ ${countries?.length} countries`)

  const { data: cities, error: citErr } = await supabase
    .from('cities')
    .select('id,city_slug,country_code,name_ar,name_en,timezone,is_capital,lat,lon,priority,population')
  if (citErr) throw new Error(`cities: ${citErr.message}`)
  writeFileSync('lib/db/fallback/cities-index.json', JSON.stringify(cities, null, 2))
  console.log(`[export-fallback] ✅ ${cities?.length} cities`)

  console.log('[export-fallback] Done.')
}

run().catch(err => { console.error('[export-fallback] ❌', err); process.exit(1) })
```

**Run this right now before anything else:** `npm run export-fallback`
Commit the generated JSON files to git — they are your production safety net.

---

## 🔄 STEP 5 — Update Every File That Fetches Data

### How to handle each file:

1. **Read the entire file first**
2. **Identify all data-fetching code** — JSON imports, `fetch()`, old Supabase calls, `getServerSideProps`, old actions
3. **Replace only those lines** with calls to the new query functions
4. **Verify the data shape matches** what the existing JSX already expects — adjust variable names if needed
5. **Delete old imports** that are now unused
6. **Never touch the JSX return block** unless a variable was renamed

---

### `app/time-now/page.jsx`

**Find:** Import or fetch for countries list
**Replace with:**
```javascript
import { getAllCountries } from '@/lib/db/queries/countries'
// ...
const countries = await getAllCountries()
// countries: Array<{ id, country_code, country_slug, name_ar, name_en, timezone }>
```

**Also add** `generateStaticParams` equivalent if this page needs to be static, or confirm it already is.

---

### `app/time-now/[country]/page.jsx`

**Find:** Old data fetch for single country + its cities
**Replace with:**
```javascript
import { getAllCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries'
import { getTopCitiesByCountry } from '@/lib/db/queries/cities'

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []
  const slugs = await getAllCountrySlugs()
  return slugs.map(slug => ({ country: slug }))
}

// In the page function — params is async in Next.js 16:
const { country: countrySlug } = await params
const country = await getCountryBySlug(countrySlug)
if (!country) notFound()
const cities = await getTopCitiesByCountry(country.country_code, 30)
```

**Remove:** Any `export const revalidate = ...`

---

### `app/time-now/[country]/[city]/page.jsx`

**Find:** Old country + city data fetch
**Replace with:**
```javascript
import { getCountryBySlug } from '@/lib/db/queries/countries'
import { getAllCityParams, getCityBySlug } from '@/lib/db/queries/cities'

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []
  return getAllCityParams()
}

const { country: countrySlug, city: citySlug } = await params
const country = await getCountryBySlug(countrySlug)
if (!country) notFound()
const city = await getCityBySlug(country.country_code, citySlug)
if (!city) notFound()
// city.timezone, city.lat, city.lon are available directly — no external API needed
```

**Remove:** Any `export const revalidate = ...`

---

### `app/mwaqit-al-salat/page.jsx`

**Find:** Countries list fetch
**Replace with:**
```javascript
import { getAllCountries } from '@/lib/db/queries/countries'
const countries = await getAllCountries()
```

---

### `app/mwaqit-al-salat/[country]/[city]/page.jsx`

**Find:** Old country + city data fetch (prayer times currently rely on external API + lat/lon)
**Replace with:**
```javascript
import { getCountryBySlug } from '@/lib/db/queries/countries'
import { getAllCityParams, getCityBySlug } from '@/lib/db/queries/cities'

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []
  return getAllCityParams()
}

const { country: countrySlug, city: citySlug } = await params
const country = await getCountryBySlug(countrySlug)
if (!country) notFound()
const city = await getCityBySlug(country.country_code, citySlug)
if (!city) notFound()
// city.lat and city.lon are now from DB — pass them to prayer time logic as-is
// city.timezone from DB — pass to existing timezone display as-is
```

**Note:** If the page currently calls an external API for prayer times using lat/lon from the old source — keep the prayer time API call. Only replace the part that resolves the city's lat/lon/timezone — that now comes from the DB.

---

### `app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`

**Find:** Data fetch for city/country names
**Replace with:**
```javascript
import { getCountryBySlug } from '@/lib/db/queries/countries'
import { getCityBySlug } from '@/lib/db/queries/cities'

const { country: countrySlug, city: citySlug } = await props.params
const country = await getCountryBySlug(countrySlug)
const city = await getCityBySlug(country.country_code, citySlug)
```

Keep all OG image rendering code exactly as-is.

---

### `app/time-difference/page.jsx`

**Find:** Any data fetch (if it loads countries for a selector UI)
**Replace with:**
```javascript
import { getAllCountries } from '@/lib/db/queries/countries'
const countries = await getAllCountries()
```

If this page has no data fetch, do not touch it.

---

### `app/time-difference/[from]/[to]/page.jsx`

**Find:** Old country data fetch + timezone resolution
**Replace with:**
```javascript
import { getCountryBySlug } from '@/lib/db/queries/countries'
import { getCapitalCity } from '@/lib/db/queries/cities'

export const dynamicParams = true

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []
  return [
    { from: 'morocco', to: 'saudi-arabia' },
    { from: 'morocco', to: 'france' },
    { from: 'morocco', to: 'united-states' },
    { from: 'saudi-arabia', to: 'united-arab-emirates' },
    { from: 'egypt', to: 'saudi-arabia' },
    // expand based on your analytics
  ]
}

const { from, to } = await params
const [fromCountry, toCountry] = await Promise.all([
  getCountryBySlug(from),
  getCountryBySlug(to),
])
if (!fromCountry || !toCountry) notFound()

const [fromCapital, toCapital] = await Promise.all([
  getCapitalCity(fromCountry.country_code),
  getCapitalCity(toCountry.country_code),
])

const fromTimezone = fromCapital?.timezone ?? fromCountry.timezone
const toTimezone   = toCapital?.timezone   ?? toCountry.timezone
```

---

### `app/holidays/page.jsx`

⚠️ **Holidays are special — read this carefully.**

Holidays are NOT in the new DB. The new DB only has `countries` and `cities`.
Holiday data stays in its current source (Supabase old table, JSON, or API — wherever it currently is).

**What you change:**
- If the page also fetches countries or cities (e.g. for a country selector) → replace those with `getAllCountries()` or `getCitiesByCountry()`
- If the page fetches holidays from the old Supabase client → keep fetching holidays the same way, but update the Supabase client import to use `lib/supabase/server.ts`
- If the page has `export const revalidate = ...` → remove it, and instead add `'use cache'` to the holiday-fetching function

**Pattern for the holidays query — create `lib/db/queries/holidays.ts`:**
```typescript
import 'server-only'
import { cacheTag, cacheLife } from 'next/cache'
import { supabase } from '@/lib/supabase/server'

export async function getAllHolidays() {
  'use cache'
  cacheTag('holidays')
  cacheLife('days')
  // Keep your exact existing Supabase query here — just wrap it in 'use cache'
  const { data, error } = await supabase
    .from('YOUR_EXISTING_HOLIDAYS_TABLE')
    .select('*')
  if (error) throw error
  return data ?? []
}

export async function getHolidayBySlug(slug: string) {
  'use cache'
  cacheTag('holidays', `holiday-${slug}`)
  cacheLife('days')
  const { data, error } = await supabase
    .from('YOUR_EXISTING_HOLIDAYS_TABLE')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}
```

Then in `holidays/page.jsx` and `holidays/[slug]/page.jsx`, replace old fetching calls with these functions. Keep all JSX as-is.

---

### `app/holidays/actions.js`

**Find:** Any Server Action that fetches holiday or country data
**Replace:** Supabase client with `lib/supabase/server.ts`. Wrap data fetches with `'use cache'` if they are read-only. Keep mutation actions (if any) as dynamic — do not cache writes.

---

### `app/holidays/constants.js`

**Review this file.** It may contain:
- Hardcoded arrays of holiday data → if this data should come from DB, plan to migrate it there and fetch it. If it's configuration (not actual content), keep it as-is.
- Country/city lists → replace with calls to `getAllCountries()` at the point of use.

---

### `app/holidays/HolidaysClient.jsx`

**Review this file.** It is a Client Component (`'use client'`).
- If it fetches data via `fetch()` or a custom hook that hits an API → update the API route it calls (see api/search-city below)
- If it receives data as props from the server page → the fix is in `holidays/page.jsx`, not here
- If it has its own `useEffect` + `fetch` for holidays → keep the fetch, update the API endpoint it calls if you create one

---

### `app/holidays/[slug]/page.jsx`

**Find:** Old holiday fetch
**Replace with:**
```javascript
import { getHolidayBySlug } from '@/lib/db/queries/holidays'

export const dynamicParams = true

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') return []
  // Fetch slugs of all published holidays
  const holidays = await getAllHolidays()
  return holidays.map(h => ({ slug: h.slug }))
}

const { slug } = await params
const holiday = await getHolidayBySlug(slug)
if (!holiday) notFound()
```

Keep all JSX, all conditional rendering, all UI as-is.

---

### `app/holidays/[slug]/opengraph-image.jsx`

**Find:** Holiday data fetch
**Replace with:**
```javascript
import { getHolidayBySlug } from '@/lib/db/queries/holidays'
const { slug } = await props.params
const holiday = await getHolidayBySlug(slug)
```

Keep all OG image rendering as-is.

---

### `app/actions/location.js`

**Find:** Any lookup that resolves a location from a country code or IP — likely reads from JSON files or old Supabase
**Replace with:**
```javascript
import { getCountryByCode } from '@/lib/db/queries/countries'
import { getCitiesByCountry, getCityBySlug } from '@/lib/db/queries/cities'
```

Keep all action logic (parameter handling, response shaping) as-is.

---

### `app/page.jsx` (home page)

**Review.** If it fetches countries, cities, or any data:
**Replace** with appropriate query function from `lib/db/queries/`.
If it has no data fetch, do not touch it.

---

## 🔌 STEP 6 — Update API Routes

### `app/api/search-city/route.js`

**Find:** Old search implementation (JSON scan, old Supabase query)
**Replace the data call:**
```javascript
import { searchCities } from '@/lib/db/queries/cities'

// In the GET handler:
const results = await searchCities(query, 10)
```

Keep all request parsing (`req.nextUrl.searchParams.get('q')`), response formatting, and error handling exactly as-is.
Keep the response headers for edge caching if they exist.

---

### `app/api/ip-city/route.js`

**Review.** This route detects city from IP.
- The IP geolocation part (external API call) → keep it, no change
- Any subsequent lookup of country/city data from local JSON or old DB → replace with `getCountryByCode()` or `getCitiesByCountry()`
- Keep request/response format identical — client code depends on it

---

### `app/api/revalidate/route.js`

Rewrite the handler body only. Keep the file and exports the same:

```javascript
import { revalidateTag } from 'next/cache'

export async function POST(req) {
  try {
    const { secret, tag } = await req.json()
    if (secret !== process.env.REVALIDATE_SECRET) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const valid = ['countries', 'cities', 'holidays']
    if (tag === 'all') {
      revalidateTag('countries', 'max')
      revalidateTag('cities',    'max')
      revalidateTag('holidays',  'max')
    } else if (valid.includes(tag)) {
      revalidateTag(tag, 'max')
    } else {
      return Response.json({ error: `Invalid tag: ${tag}` }, { status: 400 })
    }
    return Response.json({ ok: true, tag, at: new Date().toISOString() })
  } catch {
    return Response.json({ error: 'Bad request' }, { status: 400 })
  }
}
```

---

## 🗺️ STEP 7 — Update sitemap.js

**Find:** Old country/city data fetches
**Replace:**
```javascript
import { getAllCountries } from '@/lib/db/queries/countries'
import { getCitiesByCountry } from '@/lib/db/queries/cities'

const countries = await getAllCountries()
// For each country, call getCitiesByCountry(country.country_code)
```

Keep all URL construction, priority, changeFrequency, and lastModified logic exactly as-is.

---

## 🔄 STEP 8 — Rename middleware.ts → proxy.ts (if it exists)

If `middleware.ts` exists at the root:
1. Rename the file to `proxy.ts`
2. Rename the export from `function middleware` to `function proxy`
3. Change absolutely nothing else inside

---

## 🧹 STEP 9 — Safe Cleanup (only after build passes)

**Do not delete anything until `npm run build` succeeds and the site is manually verified.**

After verification, search for and remove:

```bash
# These should all return zero results after migration:
grep -r "unstable_cache" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"
grep -r "export const revalidate" . --include="*.tsx" --include="*.jsx"

# Old data import patterns — find and remove:
grep -r "from '@/data/" .
grep -r "from '../data/" .
grep -r "require.*data.*\.json" .

# Old Supabase patterns — ensure only lib/supabase/server.ts and admin.ts remain:
grep -r "createClient" . --include="*.ts" --include="*.js"
# Should only appear in: lib/supabase/server.ts, lib/supabase/admin.ts, scripts/export-fallback.ts

# Old table references — make sure none remain:
grep -r "old_table_name" .   # replace with your actual old table names
```

**Files safe to delete after verification:**
- Any `/data/*.json` files that were the old local data source
- Any old Supabase helper files that have been replaced by `lib/supabase/server.ts`
- Any old fetch utility functions that no page uses anymore

**Files to keep:**
- `lib/db/fallback/countries.json` — auto-generated, keep and commit
- `lib/db/fallback/cities-index.json` — auto-generated, keep and commit
- `lib/db/queries/holidays.ts` — holidays stay in their own table, keep this

---

## 📐 STEP 10 — Connect Supabase Revalidation Webhook

In Supabase Dashboard → Database → Webhooks, create:

| Event | Table | HTTP Method | URL | Body |
|---|---|---|---|---|
| INSERT / UPDATE / DELETE | `countries` | POST | `https://your-domain.com/api/revalidate` | `{"secret":"YOUR_SECRET","tag":"countries"}` |
| INSERT / UPDATE / DELETE | `cities` | POST | `https://your-domain.com/api/revalidate` | `{"secret":"YOUR_SECRET","tag":"cities"}` |

This means whenever you update data in Supabase, all affected cached pages automatically rebuild within seconds.

---

## ✅ FINAL CHECKLIST

**Config:**
- [ ] `next.config.ts` has `cacheComponents: true` and `reactCompiler: true`
- [ ] `.env.local` has all 4 keys
- [ ] Production environment also has all 4 keys

**Packages & scripts:**
- [ ] `@supabase/supabase-js` installed
- [ ] `tsx` installed as dev dependency
- [ ] `export-fallback` and updated `build` scripts in `package.json`

**New data layer files created:**
- [ ] `lib/db/types.ts`
- [ ] `lib/supabase/server.ts`
- [ ] `lib/supabase/admin.ts`
- [ ] `lib/db/queries/countries.ts`
- [ ] `lib/db/queries/cities.ts`
- [ ] `lib/db/queries/holidays.ts`
- [ ] `scripts/export-fallback.ts`
- [ ] `npm run export-fallback` ran and succeeded
- [ ] `lib/db/fallback/countries.json` has real data
- [ ] `lib/db/fallback/cities-index.json` has real data

**Every file reviewed and updated:**
- [ ] `app/page.jsx`
- [ ] `app/time-now/page.jsx`
- [ ] `app/time-now/[country]/page.jsx`
- [ ] `app/time-now/[country]/[city]/page.jsx`
- [ ] `app/mwaqit-al-salat/page.jsx`
- [ ] `app/mwaqit-al-salat/[country]/[city]/page.jsx`
- [ ] `app/mwaqit-al-salat/[country]/[city]/opengraph-image.jsx`
- [ ] `app/time-difference/page.jsx`
- [ ] `app/time-difference/[from]/[to]/page.jsx`
- [ ] `app/holidays/page.jsx`
- [ ] `app/holidays/actions.js`
- [ ] `app/holidays/constants.js`
- [ ] `app/holidays/HolidaysClient.jsx`
- [ ] `app/holidays/[slug]/page.jsx`
- [ ] `app/holidays/[slug]/opengraph-image.jsx`
- [ ] `app/actions/location.js`
- [ ] `app/api/search-city/route.js`
- [ ] `app/api/ip-city/route.js`
- [ ] `app/api/revalidate/route.js`
- [ ] `app/sitemap.js`

**Quality verification:**
- [ ] `unstable_cache` — zero results in codebase
- [ ] `export const revalidate` — zero results in page files
- [ ] Old JSON data imports — zero results
- [ ] `createClient` — only appears in `lib/supabase/` and `scripts/`
- [ ] `npm run build` passes with zero errors
- [ ] Every route renders correctly
- [ ] Search autocomplete works
- [ ] Prayer times load correctly
- [ ] Holidays load with full data
- [ ] Supabase webhooks configured for auto-revalidation
- [ ] Old data files deleted

---

## 📐 Next.js 16 — Caching API Quick Reference

| Old Pattern | New Pattern |
|---|---|
| `unstable_cache(fn, keys, opts)` | `'use cache'` + `cacheTag()` + `cacheLife()` inside the async function |
| `{ revalidate: 86400 }` | `cacheLife('days')` — profiles: `seconds` `minutes` `hours` `days` `weeks` `max` |
| `{ tags: ['x', 'y'] }` | `cacheTag('x', 'y')` |
| `export const revalidate = N` on page | Remove — caching belongs in the data function, not the page |
| `revalidateTag('x')` | `revalidateTag('x', 'max')` — second argument required in N16 |
| `middleware.ts` + `export default function middleware` | `proxy.ts` + `export default function proxy` |
| `props.params.country` | `(await props.params).country` — params is async in N16 |
| `props.searchParams.q` | `(await props.searchParams).q` — searchParams is also async |