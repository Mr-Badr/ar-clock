#!/usr/bin/env node
/**
 * scripts/migrateCities.cjs
 * Node script to unify 'time_now_cities' data into 'cities'
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(line => {
  const t = line.trim(); if (!t || t.startsWith('#')) return;
  const eq = t.indexOf('='); if (eq > 0) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
});

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function run() {
  console.log('🔄 Starting migration from "time_now_cities" to "cities"...');

  // 1. Fetch all records from time_now_cities
  const { data: timeNowCities, error: fetchErr } = await sb.from('time_now_cities').select('*');
  
  if (fetchErr) {
    console.error('❌ Error fetching time_now_cities:', fetchErr.message);
    process.exit(1);
  }

  console.log(`📦 Found ${timeNowCities.length} records in time_now_cities.`);

  const BATCH = 50;
  let total = 0;

  for (let i = 0; i < timeNowCities.length; i += BATCH) {
    const batch = timeNowCities.slice(i, i + BATCH);
    
    // Map time_now_cities schema into cities schema
    // The cities table uses city_slug, time_now_cities uses slug
    const upsertPayload = batch.map(c => ({
      country_slug: c.country_slug,
      country_name_ar: c.country_name_ar,
      country_name_en: c.country_name_en || null,
      country_code: c.country_code || null,
      city_slug: c.slug, // Maps from 'slug' to 'city_slug'
      city_name_ar: c.name_ar,
      city_name_en: c.name_en,
      lat: c.lat || 0,
      lon: c.lon || 0,
      timezone: c.timezone,
      population: c.population || 0,
      priority: c.priority || 0,
      is_capital: c.is_capital || false,
    }));

    // Upsert into cities matching country_slug and city_slug
    const { error: upsertErr } = await sb.from('cities').upsert(upsertPayload, { onConflict: 'country_slug,city_slug' });
    
    if (upsertErr) {
      console.error(`❌ Batch ${Math.floor(i / BATCH) + 1} error:`, upsertErr.message);
    } else {
      total += batch.length;
      process.stdout.write(`\r✅ Upserted ${total}/${timeNowCities.length} cities...`);
    }
  }

  console.log('\n🎉 Migration complete!');
}

run().catch(console.error);
