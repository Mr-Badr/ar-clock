-- ============================================================
-- Supabase Schema: ar-clock — New Production Schema
-- Run in: Supabase Dashboard > SQL Editor > New Query
--
-- Tables: countries + cities (normalized, FK-linked)
-- This is the NEW schema. If you are migrating from the old
-- cities-only schema, run this to create the countries table
-- first, then migrate city rows to reference country_code.
-- ============================================================

-- Required extension for Arabic fuzzy / trigram search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- COUNTRIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS countries (
  id           BIGSERIAL PRIMARY KEY,
  country_code CHAR(2)   UNIQUE NOT NULL,   -- ISO 3166-1 alpha-2 (MA, SA, FR …)
  country_slug TEXT      UNIQUE NOT NULL,   -- URL-safe slug (morocco, france …)
  name_ar      TEXT      NOT NULL,          -- Arabic name
  name_en      TEXT,                        -- English name (nullable)
  timezone     TEXT                         -- Nullable — prefer capital city timezone
);

-- ============================================================
-- CITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id           BIGSERIAL PRIMARY KEY,
  country_code CHAR(2)          NOT NULL REFERENCES countries(country_code) ON DELETE CASCADE,
  city_slug    TEXT             NOT NULL,   -- URL-safe slug, unique per country
  name_ar      TEXT             NOT NULL,
  name_en      TEXT,
  lat          DOUBLE PRECISION NOT NULL,
  lon          DOUBLE PRECISION NOT NULL,
  timezone     TEXT             NOT NULL,   -- Never null — always reliable
  population   INTEGER          DEFAULT 0,
  priority     INTEGER          DEFAULT 0,
  is_capital   BOOLEAN          DEFAULT FALSE,
  CONSTRAINT cities_unique_slug UNIQUE (country_code, city_slug)
);

-- ============================================================
-- PERFORMANCE INDEXES
-- ============================================================
-- Countries
CREATE INDEX IF NOT EXISTS idx_countries_slug ON countries(country_slug);
CREATE INDEX IF NOT EXISTS idx_countries_code ON countries(country_code);

-- Cities — fast slug lookup (used in every page route)
CREATE INDEX IF NOT EXISTS idx_cities_slug        ON cities(country_code, city_slug);
CREATE INDEX IF NOT EXISTS idx_cities_priority    ON cities(priority DESC);
CREATE INDEX IF NOT EXISTS idx_cities_population  ON cities(population DESC);
CREATE INDEX IF NOT EXISTS idx_cities_capital     ON cities(country_code, is_capital);

-- Cities — Arabic / English trigram search (autocomplete)
CREATE INDEX IF NOT EXISTS idx_cities_name_ar_trgm ON cities USING GIN (name_ar gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_name_en_trgm ON cities USING GIN (name_en gin_trgm_ops);

-- Countries — Arabic trigram search
CREATE INDEX IF NOT EXISTS idx_countries_name_ar_trgm ON countries USING GIN (name_ar gin_trgm_ops);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities    ENABLE ROW LEVEL SECURITY;

-- Countries: allow anon reads (public data)
CREATE POLICY IF NOT EXISTS "anon_read_countries" ON countries
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "service_role_full_countries" ON countries
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Cities: allow anon reads (public data)
CREATE POLICY IF NOT EXISTS "anon_read_cities" ON cities
  FOR SELECT TO anon USING (true);

CREATE POLICY IF NOT EXISTS "service_role_full_cities" ON cities
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- SAFE AUTOCOMPLETE RPC (limited — prevents table scan abuse)
-- ============================================================
CREATE OR REPLACE FUNCTION search_cities_limited(q TEXT, lim INT DEFAULT 10)
RETURNS TABLE (
  city_slug     TEXT,
  name_ar       TEXT,
  name_en       TEXT,
  country_code  CHAR(2),
  country_slug  TEXT,
  country_name  TEXT,
  timezone      TEXT,
  population    INTEGER
)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT
    c.city_slug,
    c.name_ar,
    c.name_en,
    c.country_code,
    co.country_slug,
    co.name_ar AS country_name,
    c.timezone,
    c.population
  FROM cities c
  JOIN countries co ON co.country_code = c.country_code
  WHERE
    c.name_ar ILIKE '%' || q || '%' OR
    c.name_en ILIKE '%' || q || '%' OR
    c.city_slug ILIKE '%' || q || '%'
  ORDER BY c.priority DESC, c.population DESC
  LIMIT LEAST(lim, 20);
$$;

-- Grant anon access to autocomplete RPC only (tables remain behind RLS)
GRANT EXECUTE ON FUNCTION search_cities_limited(TEXT, INT) TO anon;

-- ============================================================
-- NOTES
-- ============================================================
-- Column semantics:
--   countries.timezone     → nullable; always prefer capital city's timezone
--   cities.timezone        → never null; single source of truth for city time
--   city_slug              → unique per country, not globally
--   country_slug           → globally unique; safe as sole URL parameter
--
-- Key rotation:
--   Supabase Dashboard → Settings → API → Regenerate service_role key
--   Update SUPABASE_SERVICE_ROLE_KEY in .env.local + Vercel env vars
--   Redeploy. The anon key can be rotated independently.
-- ============================================================