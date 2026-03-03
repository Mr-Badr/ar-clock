#!/usr/bin/env node
/**
 * scripts/setupSupabase.js
 * 
 * Creates the Supabase tables and indexes needed for the prayer times feature.
 * Uses the Supabase REST/SQL endpoint directly with the service role key.
 * 
 * Run: node scripts/setupSupabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim();
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

const SQL_SCHEMA = `
-- Enable pg_trgm for fuzzy Arabic text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- Cities table (core entity)
CREATE TABLE IF NOT EXISTS cities (
  id          BIGSERIAL PRIMARY KEY,
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

-- Indexes for fast API reads
CREATE INDEX IF NOT EXISTS idx_cities_slugs ON cities(country_slug, city_slug);
CREATE INDEX IF NOT EXISTS idx_cities_priority ON cities(priority DESC);
CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population DESC);
CREATE INDEX IF NOT EXISTS idx_cities_ar_trgm ON cities USING gin(city_name_ar gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_en_trgm ON cities USING gin(city_name_en gin_trgm_ops);

-- Allow anonymous reads (used by the API routes)
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow anon reads on cities" ON cities
  FOR SELECT TO anon USING (true);

-- Allow service role full access for seed import
CREATE POLICY IF NOT EXISTS "Allow service role all on cities" ON cities
  FOR ALL TO service_role USING (true);
`;

async function executeSql(sql) {
  // Use the Supabase SQL endpoint via service role key
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'apikey': SERVICE_KEY
    },
    body: JSON.stringify({ sql })
  });

  if (!response.ok) {
    // Try alternative approach: use pg connection directly
    return false;
  }
  return true;
}

async function run() {
  console.log('🔌 Connecting to Supabase...');
  console.log(`📦 URL: ${SUPABASE_URL}`);

  // Test connection
  const { data: testData, error: testError } = await supabase
    .from('cities')
    .select('count', { count: 'exact', head: true });

  if (testError && testError.code === '42P01') {
    console.log('⚠️  Table "cities" does not exist. Please run this SQL in your Supabase Dashboard > SQL Editor:\n');
    console.log('='.repeat(80));
    console.log(SQL_SCHEMA);
    console.log('='.repeat(80));
    console.log('\n  → Go to: https://supabase.com/dashboard/project/_/sql/new');
    console.log('  → Paste the SQL above and click Run');
    console.log('  → Then rerun this script\n');

    // Save SQL to file for easy access
    const sqlPath = join(__dirname, '..', 'supabase-schema.sql');
    fs.writeFileSync(sqlPath, SQL_SCHEMA);
    console.log(`✅ SQL saved to: supabase-schema.sql`);
    return false;
  }

  if (testError && testError.code !== '42P01') {
    console.error('❌ Connection error:', testError.message);
    return false;
  }

  // Table exists
  console.log('✅ Supabase connection successful!');
  const { count } = await supabase.from('cities').select('*', { count: 'exact', head: true });
  console.log(`📊 Current cities in DB: ${count ?? 0}`);
  return true;
}

run().catch(console.error);
