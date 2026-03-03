#!/usr/bin/env node
/**
 * scripts/fetchMissingCity.cjs
 *
 * Given a country slug and city slug, fetches city data from OpenStreetMap Nominatim,
 * normalizes it, and inserts into Supabase.
 *
 * Usage:
 *   node scripts/fetchMissingCity.cjs <country-slug> <city-slug>
 *
 * Example:
 *   node scripts/fetchMissingCity.cjs morocco taounate
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eq = trimmed.indexOf('=');
  if (eq > 0) process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

async function run() {
  const [, , countrySlug, citySlug] = process.argv;
  if (!countrySlug || !citySlug) {
    console.error('Usage: node fetchMissingCity.cjs <country-slug> <city-slug>');
    process.exit(1);
  }

  console.log(`\n🔍 Geocoding: ${citySlug}, ${countrySlug}...`);

  const q = `${citySlug.replace(/-/g, ' ')}, ${countrySlug.replace(/-/g, ' ')}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=ar&addressdetails=1`;

  const res = await fetch(url, { headers: { 'User-Agent': 'MwaqitAlSalat/1.0' } });
  if (!res.ok) { console.error('❌ Nominatim request failed'); process.exit(1); }

  const data = await res.json();
  if (!data.length) { console.error('❌ City not found in Nominatim'); process.exit(1); }

  const hit = data[0];
  const cityRecord = {
    country_slug: countrySlug,
    country_name_ar: hit.address?.country || countrySlug,
    city_slug: citySlug,
    city_name_ar: hit.display_name.split(',')[0].trim(),
    city_name_en: hit.display_name.split(',')[0].trim(),
    lat: parseFloat(hit.lat),
    lon: parseFloat(hit.lon),
    timezone: 'UTC', // Note: use geo-tz package for actual timezone lookup
    population: 0,
    priority: 0,
  };

  console.log('📍 Found:', cityRecord.city_name_ar, `(${cityRecord.lat}, ${cityRecord.lon})`);

  const { error } = await supabase
    .from('cities')
    .upsert(cityRecord, { onConflict: 'country_slug,city_slug' });

  if (error) {
    console.error('❌ Insert failed:', error.message);
  } else {
    console.log('✅ City inserted into Supabase!');
    console.log(`   Test: http://localhost:3000/mwaqit-al-salat/${countrySlug}/${citySlug}`);
  }
}

run().catch(console.error);
