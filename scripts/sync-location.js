#!/usr/bin/env node
/**
 * scripts/sync-location.js
 *
 * A single, unified CLI tool to fetch a city from Nominatim, format it exactly
 * to the definitive schema, and insert it into Supabase.
 *
 * Usage:
 *   node scripts/sync-location.js --city "paris" --country "france"
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq > 0) process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  });
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

async function run() {
  const args = process.argv.slice(2);
  let cityRaw = '';
  let countryRaw = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--city') cityRaw = args[i + 1];
    if (args[i] === '--country') countryRaw = args[i + 1];
  }

  if (!cityRaw || !countryRaw) {
    console.error('Usage: node scripts/sync-location.js --city "<city-name>" --country "<country-name>"');
    process.exit(1);
  }

  const citySlug = slugify(cityRaw);
  const countrySlug = slugify(countryRaw);

  console.log(`\n🔍 Syncing: ${cityRaw}, ${countryRaw}...`);

  try {
    const q = `${cityRaw}, ${countryRaw}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=ar&addressdetails=1`;
    
    const res = await fetch(url, { headers: { 'User-Agent': 'ArClock/2.0' } });
    if (!res.ok) throw new Error('Nominatim API failed');
    
    const data = await res.json();
    if (!data.length) throw new Error('City not found in Nominatim');

    const hit = data[0];
    const countryCode = hit.address?.country_code?.toUpperCase() || '';
    
    // Attempt local timezone mapping if possible or default to UTC until updated client-side
    // For a robust sync script, you might incorporate `geo-tz` but for this scope UTC fallback is fine.

    const cityRecord = {
      country_slug: countrySlug,
      country_name_ar: hit.address?.country || countryRaw,
      city_slug: citySlug,
      city_name_ar: hit.display_name.split(',')[0].trim(),
      city_name_en: hit.display_name.split(',')[0].trim(),
      lat: parseFloat(hit.lat),
      lon: parseFloat(hit.lon),
      timezone: 'UTC',
      population: 0,
      priority: 0,
    };

    console.log(`   Found: ${cityRecord.city_name_ar} (Lat: ${cityRecord.lat}, Lon: ${cityRecord.lon})`);

    const { error } = await supabase
      .from('cities')
      .upsert(cityRecord, { onConflict: 'country_slug,city_slug' });

    if (error) throw error;

    console.log(`✅ Success! Inserted ${citySlug} into Supabase.`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

run();
