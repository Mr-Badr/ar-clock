#!/usr/bin/env node
/**
 * scripts/importCities.cjs
 * CommonJS version - run with: node scripts/importCities.cjs
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
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

const seedPath = path.join(__dirname, '..', 'src', 'lib', 'seedCities.json');
const cities = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const BATCH_SIZE = 50;

async function run() {
  console.log(`\n🌍 Importing ${cities.length} cities to Supabase...`);
  console.log(`📡 URL: ${SUPABASE_URL}\n`);

  // Test connection first
  const { error: testErr } = await supabase.from('cities').select('count', { count: 'exact', head: true });
  if (testErr) {
    if (testErr.code === '42P01') {
      console.error('❌ Table "cities" does not exist!');
      console.error('');
      console.error('   Please run the SQL schema first:');
      console.error('   1. Open: https://supabase.com/dashboard/project/gcranjomerwilpjtcaoj/sql/new');
      console.error('   2. Paste the contents of: supabase-schema.sql');
      console.error('   3. Click "Run"');
      console.error('   4. Then run this script again\n');
    } else {
      console.error('❌ Connection error:', testErr.message);
    }
    process.exit(1);
  }

  let totalInserted = 0;

  for (let i = 0; i < cities.length; i += BATCH_SIZE) {
    const batch = cities.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('cities')
      .upsert(batch, { onConflict: 'country_slug,city_slug' });

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`, error.message);
    } else {
      totalInserted += batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} cities (total: ${totalInserted})`);
    }
  }

  // Final count
  const { count } = await supabase.from('cities').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Done! Total cities in Supabase: ${count}`);
}

run().catch(console.error);
