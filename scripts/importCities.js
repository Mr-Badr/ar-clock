#!/usr/bin/env node
/**
 * scripts/importCities.js
 * 
 * Reads seedCities.json and pushes ALL entries to Supabase.
 * Uses upsert so it's idempotent (safe to run multiple times).
 * 
 * Run: node scripts/importCities.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency needed)
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
});

// Load seed cities
const seedPath = join(__dirname, '..', 'src', 'lib', 'seedCities.json');
const cities = JSON.parse(readFileSync(seedPath, 'utf8'));

const BATCH_SIZE = 100;

async function run() {
  console.log(`🌍 Importing ${cities.length} cities to Supabase...`);
  console.log(`📡 URL: ${SUPABASE_URL}\n`);

  let totalInserted = 0;

  for (let i = 0; i < cities.length; i += BATCH_SIZE) {
    const batch = cities.slice(i, i + BATCH_SIZE);

    const { data, error } = await supabase
      .from('cities')
      .upsert(batch, {
        onConflict: 'country_slug,city_slug',
        ignoreDuplicates: false
      });

    if (error) {
      // Common case: table doesn't exist yet
      if (error.code === '42P01') {
        console.error('\n❌ Table "cities" does not exist in Supabase!');
        console.error('   Please run the SQL schema first:');
        console.error('   → supabase-schema.sql (in project root)');
        console.error('   → Go to: https://supabase.com/dashboard/project/_/sql/new\n');
        process.exit(1);
      }
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      totalInserted += batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} cities inserted (total: ${totalInserted})`);
    }
  }

  console.log(`\n🎉 Done! ${totalInserted} cities successfully seeded.`);

  // Verify by counting
  const { count } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });
  console.log(`📊 Total cities in Supabase DB: ${count}`);
}

run().catch(console.error);
