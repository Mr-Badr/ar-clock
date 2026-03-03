#!/usr/bin/env node
/**
 * scripts/createTables.js
 * 
 * Direct Postgres connection to Supabase to create the cities table and indexes.
 * Supabase provides a direct Postgres connection at:
 *   postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
 * 
 * Run: node scripts/createTables.js
 */

import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  // Derive from project ref
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const ref = url.replace('https://', '').replace('.supabase.co', '');
  const password = process.env.SUPABASE_DB_PASSWORD || '';

  if (!password) {
    console.error('❌ SUPABASE_DB_URL or SUPABASE_DB_PASSWORD not set in .env.local');
    console.error('   Add either:');
    console.error('   SUPABASE_DB_URL=postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres');
    console.error('   or');
    console.error('   SUPABASE_DB_PASSWORD=your-db-password');
    process.exit(1);
  }

  process.env.SUPABASE_DB_URL = `postgresql://postgres.${ref}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
}

const sql = postgres(process.env.SUPABASE_DB_URL, { ssl: 'require' });

async function run() {
  console.log('🔌 Connecting to Supabase Postgres directly...');

  try {
    // Enable extensions
    await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
    console.log('✅ pg_trgm extension enabled');

    // Create cities table
    await sql`
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
      )
    `;
    console.log('✅ Table "cities" created');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_slugs ON cities(country_slug, city_slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_priority ON cities(priority DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_population ON cities(population DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_ar_trgm ON cities USING gin(city_name_ar gin_trgm_ops)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_cities_en_trgm ON cities USING gin(city_name_en gin_trgm_ops)`;
    console.log('✅ Indexes created');

    // RLS
    await sql`ALTER TABLE cities ENABLE ROW LEVEL SECURITY`;
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename='cities' AND policyname='Allow anon reads'
        ) THEN
          CREATE POLICY "Allow anon reads" ON cities FOR SELECT TO anon USING (true);
        END IF;
      END $$
    `;
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE tablename='cities' AND policyname='Allow service role all'
        ) THEN
          CREATE POLICY "Allow service role all" ON cities FOR ALL TO service_role USING (true);
        END IF;
      END $$
    `;
    console.log('✅ Row Level Security policies set');

    console.log('\n🎉 Schema creation complete! Now run: node scripts/importCities.js');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await sql.end();
  }
}

run();
