/**
 * scripts/geo-enrich.ts
 *
 * Detects cities with bad geo data in public/geo/cities/ and optionally fixes them
 * using Nominatim (OpenStreetMap) for coordinates and timeapi.io for timezone.
 *
 * Usage:
 *   npm run geo:check           – dry-run: detect and report bad cities, exit 1 if any found
 *   npm run geo:fix             – detect, query APIs, fix snapshots, exit 1 if any remain unfixed
 *   npm run geo:fix -- --country=united-states  – fix only one country file
 *
 * Rate limits respected: 1 req/sec to Nominatim, 2 req/sec to timeapi.io
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const GEO_DIR    = path.join(__dirname, '..', 'public', 'geo', 'cities');

const FIX_MODE     = process.argv.includes('--fix');
const VERBOSE      = process.argv.includes('--verbose');
const COUNTRY_ARG  = process.argv.find(a => a.startsWith('--country='))?.replace('--country=', '');

// ── Country → expected timezone prefix(es) ────────────────────────────────────
// Used to catch continent-level mismatches (e.g. an Egyptian city with America/* timezone).
// If a country is not listed we skip the region check (too many exceptions to enumerate).
const COUNTRY_TZ_REGION: Record<string, string[]> = {
  // Gulf
  SA: ['Asia/'], AE: ['Asia/'], KW: ['Asia/'], QA: ['Asia/'], BH: ['Asia/'], OM: ['Asia/'], YE: ['Asia/'],
  // North Africa
  EG: ['Africa/'], MA: ['Africa/'], DZ: ['Africa/'], TN: ['Africa/'], LY: ['Africa/'],
  SD: ['Africa/'], SO: ['Africa/'], MR: ['Africa/'],
  // Levant / Mesopotamia
  JO: ['Asia/'], LB: ['Asia/'], SY: ['Asia/'], IQ: ['Asia/'], PS: ['Asia/'],
  // Greater Middle East
  IR: ['Asia/'], TR: ['Europe/', 'Asia/'], IL: ['Asia/'],
  // South / SE Asia
  PK: ['Asia/'], IN: ['Asia/'], BD: ['Asia/'], LK: ['Asia/'],
  // East Asia
  CN: ['Asia/'], JP: ['Asia/'], KR: ['Asia/'],
  // Southeast Asia
  MY: ['Asia/'], ID: ['Asia/'], PH: ['Asia/'], TH: ['Asia/'],
  // Europe
  GB: ['Europe/', 'Atlantic/'], FR: ['Europe/'], DE: ['Europe/'], BE: ['Europe/'],
  NL: ['Europe/'], ES: ['Europe/', 'Atlantic/'], IT: ['Europe/'], PT: ['Europe/', 'Atlantic/'],
  SE: ['Europe/'], NO: ['Europe/'], DK: ['Europe/'], FI: ['Europe/'],
  AT: ['Europe/'], CH: ['Europe/'], PL: ['Europe/'], GR: ['Europe/'],
  RO: ['Europe/'], HU: ['Europe/'], CZ: ['Europe/'],
  // Americas
  US: ['America/'], CA: ['America/'], MX: ['America/'],
  BR: ['America/'], AR: ['America/'], CL: ['America/'], CO: ['America/'],
  PE: ['America/'], VE: ['America/'], EC: ['America/'],
  // Sub-Saharan Africa
  NG: ['Africa/'], KE: ['Africa/'], TZ: ['Africa/'], ET: ['Africa/'],
  ZA: ['Africa/'], GH: ['Africa/'], SN: ['Africa/'], CM: ['Africa/'],
  // Oceania
  AU: ['Australia/', 'Pacific/'], NZ: ['Pacific/'],
  // Russia / Central Asia
  RU: ['Europe/', 'Asia/'], KZ: ['Asia/'], UZ: ['Asia/'],
};

// Rough bounding boxes [minLat, maxLat, minLon, maxLon] for basic coordinate sanity check.
// If a city falls outside its country's box, it's very likely wrong data.
// Boxes are intentionally loose to avoid false positives.
const COUNTRY_BOUNDS: Record<string, [number, number, number, number]> = {
  SA: [16.0, 32.5,  34.5,  55.7], AE: [22.6, 26.2,  51.5,  56.4],
  KW: [28.5, 30.1,  46.5,  48.5], QA: [24.5, 26.2,  50.7,  51.7],
  BH: [25.8, 26.4,  50.3,  50.8], OM: [16.6, 26.5,  51.8,  60.0],
  YE: [12.1, 19.1,  41.8,  55.0],
  EG: [21.7, 31.8,  24.6,  37.0], MA: [27.6, 36.0,  -17.1,  -1.0],
  DZ: [18.9, 37.1,  -8.7,   9.0], TN: [30.2, 37.6,   7.5,  11.6],
  LY: [19.5, 33.3,   9.3,  25.2], SD: [3.5,  22.2,  21.8,  38.6],
  JO: [29.1, 33.4,  35.0,  39.3], LB: [33.0, 34.7,  35.1,  36.7],
  SY: [32.3, 37.3,  35.6,  42.4], IQ: [29.0, 37.4,  38.7,  48.7],
  IR: [25.0, 39.8,  44.0,  63.3], TR: [35.8, 42.2,  25.7,  44.8],
  IN: [6.5,  35.7,  68.0,  97.4], PK: [23.5, 37.1,  60.8,  77.0],
  CN: [18.0, 53.5,  73.5, 135.1], JP: [24.0, 45.6, 122.9, 153.9],
  GB: [49.8, 61.0, -14.0,   2.0], FR: [41.3, 51.2,  -5.2,   9.6],
  DE: [47.3, 55.1,   5.9,  15.0], ES: [27.6, 43.8, -18.2,   4.3],
  IT: [36.6, 47.1,   6.6,  18.6], NL: [50.7, 53.6,   3.3,   7.2],
  US: [18.0, 72.0,-179.0, -65.0], CA: [41.7, 83.0,-141.0, -52.6],
  MX: [14.5, 32.7,-117.1, -86.7], BR: [-33.8, 5.3, -73.9, -28.8],
  AR: [-55.1, -21.8, -73.6, -53.6], AU: [-43.7, -10.7, 113.1, 153.6],
  NG: [4.2,  13.9,   2.7,  14.7], ZA: [-34.9, -22.1,  16.5,  32.9],
  KE: [-4.7,   4.6,  33.9,  41.9], ET: [3.4,  15.0,  32.9,  48.0],
};

// ── Types ─────────────────────────────────────────────────────────────────────

type CityRecord = Record<string, unknown> & {
  city_slug: string;
  city_name_ar?: string;
  city_name_en?: string;
  country_code: string;
  country_slug?: string;
  timezone: string;
  lat: number;
  lon: number;
};

type IssueKind =
  | 'invalid_timezone'
  | 'invalid_lat'
  | 'invalid_lon'
  | 'zero_coordinates'
  | 'timezone_region_mismatch'
  | 'coordinates_outside_country';

type CityIssue = {
  countryFile: string;
  city: CityRecord;
  issues: IssueKind[];
};

type FixResult = {
  issue: CityIssue;
  nominatimLat: number | null;
  nominatimLon: number | null;
  resolvedTimezone: string | null;
  distanceKm: number | null;
  fixApplied: boolean;
  error?: string;
};

// ── Validation helpers ────────────────────────────────────────────────────────

function isValidTimezone(tz: unknown): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; }
  catch { return false; }
}

function isValidLat(lat: unknown): boolean {
  const n = Number(lat);
  return isFinite(n) && n >= -90 && n <= 90;
}

function isValidLon(lon: unknown): boolean {
  const n = Number(lon);
  return isFinite(n) && n >= -180 && n <= 180;
}

function detectIssues(city: CityRecord): IssueKind[] {
  const issues: IssueKind[] = [];

  if (!isValidTimezone(city.timezone)) issues.push('invalid_timezone');
  if (!isValidLat(city.lat)) issues.push('invalid_lat');
  if (!isValidLon(city.lon)) issues.push('invalid_lon');

  if (issues.length === 0) {
    if (city.lat === 0 && city.lon === 0) issues.push('zero_coordinates');

    // Timezone region mismatch (continent-level check)
    const expectedPrefixes = COUNTRY_TZ_REGION[city.country_code?.toUpperCase()];
    if (expectedPrefixes && !expectedPrefixes.some(p => city.timezone.startsWith(p))) {
      issues.push('timezone_region_mismatch');
    }

    // Bounding box check
    const bounds = COUNTRY_BOUNDS[city.country_code?.toUpperCase()];
    if (bounds) {
      const [minLat, maxLat, minLon, maxLon] = bounds;
      if (city.lat < minLat || city.lat > maxLat || city.lon < minLon || city.lon > maxLon) {
        issues.push('coordinates_outside_country');
      }
    }
  }

  return issues;
}

// ── Haversine distance ─────────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── API calls ─────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function nominatimSearch(
  cityNameEn: string | undefined,
  cityNameAr: string | undefined,
  countryCode: string,
): Promise<{ lat: number; lon: number; displayName: string } | null> {
  const name = cityNameEn || cityNameAr;
  if (!name) return null;

  const url = `https://nominatim.openstreetmap.org/search?` + new URLSearchParams({
    city: name,
    country: countryCode,
    format: 'json',
    limit: '3',
    addressdetails: '0',
  });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'miqatona.com geo-enrich script (haribadr35@gmail.com)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const results = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
    if (!results?.length) return null;
    const best = results[0];
    return { lat: parseFloat(best.lat), lon: parseFloat(best.lon), displayName: best.display_name };
  } catch (err) {
    if (VERBOSE) console.warn(`  [nominatim] failed for "${name}" in ${countryCode}:`, err);
    return null;
  }
}

async function getTimezoneForCoords(lat: number, lon: number): Promise<string | null> {
  const url = `https://timeapi.io/api/TimeZone/coordinate?` + new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
  });

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'miqatona.com geo-enrich script' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { timeZone?: string };
    return data.timeZone && isValidTimezone(data.timeZone) ? data.timeZone : null;
  } catch (err) {
    if (VERBOSE) console.warn(`  [timeapi] failed for ${lat},${lon}:`, err);
    return null;
  }
}

// ── Scan and detect ───────────────────────────────────────────────────────────

function scanForIssues(): CityIssue[] {
  const files = fs.readdirSync(GEO_DIR)
    .filter(f => f.endsWith('.json'))
    .filter(f => !COUNTRY_ARG || f === `${COUNTRY_ARG}.json`);

  const allIssues: CityIssue[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(GEO_DIR, file), 'utf8');
    let cities: CityRecord[];
    try {
      cities = JSON.parse(raw);
      if (!Array.isArray(cities)) continue;
    } catch { continue; }

    for (const city of cities) {
      const issues = detectIssues(city as CityRecord);
      if (issues.length > 0) {
        allIssues.push({ countryFile: file, city: city as CityRecord, issues });
      }
    }
  }

  return allIssues;
}

// ── Fix pipeline ──────────────────────────────────────────────────────────────

async function fixIssues(issues: CityIssue[]): Promise<FixResult[]> {
  const results: FixResult[] = [];

  for (const issue of issues) {
    const { city } = issue;
    const label = `${issue.countryFile.replace('.json', '')}/${city.city_slug}`;
    console.log(`\n[geo:fix] Querying: ${label}`);

    // 1. Get canonical coordinates from Nominatim
    await sleep(1100); // respect 1 req/sec TOS
    const nominatim = await nominatimSearch(
      city.city_name_en as string | undefined,
      city.city_name_ar as string | undefined,
      city.country_code,
    );

    if (!nominatim) {
      console.warn(`  ✗ Nominatim: no result for "${city.city_name_en || city.city_name_ar}" in ${city.country_code}`);
      results.push({ issue, nominatimLat: null, nominatimLon: null, resolvedTimezone: null, distanceKm: null, fixApplied: false, error: 'nominatim_no_result' });
      continue;
    }

    const distKm = haversineKm(city.lat || 0, city.lon || 0, nominatim.lat, nominatim.lon);
    console.log(`  Nominatim: ${nominatim.lat}, ${nominatim.lon} (${nominatim.displayName.slice(0, 60)})`);
    console.log(`  Current:   ${city.lat}, ${city.lon} — distance: ${Math.round(distKm)} km`);

    // 2. Decide whether to use the Nominatim coordinates
    const useNominatim = distKm > 10 || issue.issues.includes('invalid_lat') || issue.issues.includes('invalid_lon') || issue.issues.includes('zero_coordinates');
    const finalLat = useNominatim ? nominatim.lat : city.lat;
    const finalLon = useNominatim ? nominatim.lon : city.lon;

    // 3. Get timezone for the resolved coordinates
    await sleep(600);
    const resolvedTz = await getTimezoneForCoords(finalLat, finalLon);
    if (resolvedTz) {
      console.log(`  Timezone:  ${city.timezone} → ${resolvedTz}${resolvedTz === city.timezone ? ' (unchanged)' : ' ✓ fixed'}`);
    } else {
      console.warn(`  ✗ timeapi: could not resolve timezone for ${finalLat},${finalLon}`);
    }

    const result: FixResult = {
      issue,
      nominatimLat: nominatim.lat,
      nominatimLon: nominatim.lon,
      resolvedTimezone: resolvedTz,
      distanceKm: distKm,
      fixApplied: false,
    };

    if (FIX_MODE) {
      if (!resolvedTz) {
        result.error = 'timezone_unresolved';
        results.push(result);
        continue;
      }

      // Apply fix to the snapshot file
      const filePath = path.join(GEO_DIR, issue.countryFile);
      const raw = fs.readFileSync(filePath, 'utf8');
      const cities: CityRecord[] = JSON.parse(raw);
      let changed = false;

      for (const c of cities) {
        if (c.city_slug === city.city_slug) {
          if (useNominatim) {
            c.lat = finalLat;
            c.lon = finalLon;
          }
          if (resolvedTz !== c.timezone) {
            c.timezone = resolvedTz;
          }
          changed = true;
          break;
        }
      }

      if (changed) {
        fs.writeFileSync(filePath, `${JSON.stringify(cities, null, 2)}\n`, 'utf8');
        result.fixApplied = true;
        console.log(`  ✅ Fixed and written to ${issue.countryFile}`);
      }
    }

    results.push(result);
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const mode = FIX_MODE ? 'fix' : 'check';
  const scope = COUNTRY_ARG ? `country=${COUNTRY_ARG}` : 'all countries';
  console.log(`[geo:${mode}] Scanning ${scope}...\n`);

  const issues = scanForIssues();

  if (issues.length === 0) {
    console.log(`[geo:${mode}] ✅ No issues found — all city data looks correct.`);
    process.exit(0);
  }

  console.log(`[geo:${mode}] Found ${issues.length} city/cities with suspicious data:\n`);
  for (const issue of issues) {
    const city = issue.city;
    const name = city.city_name_en || city.city_name_ar || city.city_slug;
    console.log(`  ${issue.countryFile.replace('.json', '')}/${city.city_slug} (${name})`);
    for (const iss of issue.issues) {
      const detail = iss === 'invalid_timezone' ? `: "${city.timezone}"`
        : iss === 'invalid_lat' ? `: lat=${city.lat}`
        : iss === 'invalid_lon' ? `: lon=${city.lon}`
        : iss === 'timezone_region_mismatch' ? `: "${city.timezone}" unexpected for country ${city.country_code}`
        : iss === 'coordinates_outside_country' ? `: lat=${city.lat}, lon=${city.lon} is outside ${city.country_code} bounding box`
        : '';
      console.log(`    • ${iss}${detail}`);
    }
  }

  if (!FIX_MODE) {
    console.log(`\n[geo:check] Run "npm run geo:fix" to attempt automatic repair using OpenStreetMap + timeapi.io.`);
    process.exit(1);
  }

  console.log('\n[geo:fix] Querying OpenStreetMap (Nominatim) and timeapi.io for correct data...');
  const results = await fixIssues(issues);

  const fixed = results.filter(r => r.fixApplied).length;
  const failed = results.filter(r => !r.fixApplied).length;

  console.log(`\n[geo:fix] Summary: ${fixed} fixed, ${failed} could not be repaired automatically.`);

  if (failed > 0) {
    console.error('\n[geo:fix] FAILED — the following cities need manual intervention:');
    for (const r of results.filter(r => !r.fixApplied)) {
      const city = r.issue.city;
      const name = city.city_name_en || city.city_name_ar || city.city_slug;
      console.error(`  ${r.issue.countryFile.replace('.json', '')}/${city.city_slug} (${name}): ${r.error || 'unknown'}`);
      console.error(`    Issues: ${r.issue.issues.join(', ')}`);
      if (r.nominatimLat != null) {
        console.error(`    Nominatim found: lat=${r.nominatimLat}, lon=${r.nominatimLon} (${Math.round(r.distanceKm ?? 0)} km away)`);
      }
      console.error(`    Fix: edit public/geo/cities/${r.issue.countryFile} and update this city's lat/lon/timezone.`);
    }
    process.exit(1);
  }

  console.log('[geo:fix] ✅ All issues repaired. Run "npm run validate:geo" to confirm.');
  process.exit(0);
}

main().catch(err => {
  console.error('[geo:enrich] Fatal error:', err);
  process.exit(1);
});
