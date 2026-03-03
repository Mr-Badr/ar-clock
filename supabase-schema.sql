-- ============================================================
-- Supabase Schema: Arabic Prayer Times — Safe Production Version
-- Run in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Required extension for Arabic fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- CITIES TABLE (keep existing table, do NOT drop)
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
  id                BIGSERIAL PRIMARY KEY,
  country_slug      TEXT NOT NULL,
  country_name_ar   TEXT NOT NULL DEFAULT '',
  city_slug         TEXT NOT NULL,
  city_name_ar      TEXT NOT NULL,
  city_name_en      TEXT NOT NULL DEFAULT '',
  lat               FLOAT8 NOT NULL,
  lon               FLOAT8 NOT NULL,
  timezone          TEXT NOT NULL DEFAULT 'UTC',
  population        BIGINT DEFAULT 0,
  priority          INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_slug, city_slug)
);

-- ============================================================
-- PERFORMANCE INDEXES (safe: IF NOT EXISTS)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cities_slugs      ON cities(country_slug, city_slug);
CREATE INDEX IF NOT EXISTS idx_cities_priority   ON cities(priority DESC);
CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population DESC);
CREATE INDEX IF NOT EXISTS idx_cities_ar_trgm   ON cities USING gin(city_name_ar gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_en_trgm   ON cities USING gin(city_name_en gin_trgm_ops);

-- ============================================================
-- ROW LEVEL SECURITY (tight, no anon full table access)
-- ============================================================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Remove any existing permissive policy (safe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='cities' AND policyname='Allow anon reads') THEN
    DROP POLICY "Allow anon reads" ON cities;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename='cities' AND policyname='Allow service role all') THEN
    DROP POLICY "Allow service role all" ON cities;
  END IF;
END
$$;

-- Allow service_role full access for imports + server API
CREATE POLICY IF NOT EXISTS "service_role_full_access" ON cities
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- SAFE SEARCH FUNCTION (limited RPC for public use)
-- ============================================================
CREATE OR REPLACE FUNCTION search_cities_limited(q TEXT, lim INT DEFAULT 10)
RETURNS TABLE(
  city_slug TEXT, city_name_ar TEXT, city_name_en TEXT,
  country_slug TEXT, country_name_ar TEXT, timezone TEXT, population BIGINT
)
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT city_slug, city_name_ar, city_name_en, country_slug, country_name_ar, timezone, population
  FROM cities
  WHERE
    city_name_ar ILIKE '%' || q || '%' OR
    city_name_en ILIKE '%' || q || '%' OR
    city_slug    ILIKE '%' || q || '%'
  ORDER BY priority DESC, population DESC
  LIMIT LEAST(lim, 10);  -- hard cap at 10 even if caller requests more
$$;

-- Grant anonymous access to the RPC only (table is secure)
GRANT EXECUTE ON FUNCTION search_cities_limited(TEXT, INT) TO anon;

-- ============================================================
-- NOTES: Key rotation & safety
-- ============================================================
-- 1. Supabase Dashboard → Settings → API → Regenerate service_role key
-- 2. Update SUPABASE_SERVICE_ROLE_KEY in .env.local + hosting env vars
-- 3. Redeploy your Next.js app
-- 4. The anon key can be rotated independently
-- ============================================================