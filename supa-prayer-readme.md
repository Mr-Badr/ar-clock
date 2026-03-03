# README: Global Arabic-First Prayer Times Architecture

A production-quality prototype targeting #1 rankings on Arabic Google SERPs for queries like "مواقيت الصلاة في الرياض". 

## System Architecture

1. **Seed JSON:** Fast in-memory resolution (`src/lib/seedCities.json`) for massive traffic volume queries (e.g. Mecca, Dubai).
2. **Supabase Postgres Cache:** `cities` table queried when the user requests a mid-tier rural city.
3. **Nominatim Fallback:** Free geographical API queried for completely unknown cities. Data is formatted, calculating prayers immediately, and simultaneously written back to Supabase to expand the database permanently.
4. **Server Components:** `getPrayerTimes` runs totally within Next.js Node layers, meaning robots instantly see HTML table times.
5. **Autosuggest UX:** Seamless, debounced combobox querying memory and DB simultaneously.

## Supabase Database Setup

Run these commands in your Supabase SQL Editor:

```sql
-- 1. Create Core Cities Table
CREATE TABLE cities (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  country_slug TEXT NOT NULL,
  country_name_ar TEXT NOT NULL,
  city_slug TEXT NOT NULL,
  city_name_ar TEXT NOT NULL,
  lat FLOAT8 NOT NULL,
  lon FLOAT8 NOT NULL,
  timezone TEXT NOT NULL,
  population BIGINT DEFAULT 0,
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicates globally
  UNIQUE(country_slug, city_slug)
);

-- 2. Performance Indexes targeting the Next.js API lookup logic
CREATE INDEX idx_cities_slugs ON cities(country_slug, city_slug);
CREATE INDEX idx_cities_search ON cities USING gin (city_name_ar gin_trgm_ops); -- for ilike autocomplete
CREATE INDEX idx_cities_population ON cities(population DESC);
```

## Running Locally

1. Setup environment variables `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_admin_key
```

2. Run `npm run dev`.
3. Test the dynamic routing chain:
   - Hit `/mwaqit-al-salat/saudi-arabia/riyadh` (Instantly hits seed JSON).
   - Hit `/mwaqit-al-salat/unknown/city` (Demonstrates Nomimatim fallback and inserts into your DB organically).

## Sitemap Expansion
Periodically run `node scripts/generateSitemap.js` prior to triggering external builds to generate robust `sitemap-x.xml` trees from your aggregated Supabase records and ping Google Webmaster Tools.
