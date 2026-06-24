/**
 * scripts/audit-geo-snapshots.ts
 *
 * Validates all city geo snapshot files in public/geo/cities/.
 * Checks: valid IANA timezone, coordinate ranges, non-zero coords, required fields,
 * country-timezone region consistency, and country bounding box plausibility.
 *
 * Exit 1 if any city has bad data — gates CI via "npm run validate:geo".
 * To auto-fix detected issues: "npm run geo:fix"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const GEO_DIR    = path.join(__dirname, '..', 'public', 'geo', 'cities');

// ── Country → expected timezone prefix(es) ────────────────────────────────────
// Catches continent-level mismatches (e.g. Gulf city with America/* timezone).
const COUNTRY_TZ_REGION: Record<string, string[]> = {
  SA: ['Asia/'], AE: ['Asia/'], KW: ['Asia/'], QA: ['Asia/'], BH: ['Asia/'], OM: ['Asia/'], YE: ['Asia/'],
  EG: ['Africa/'], MA: ['Africa/'], DZ: ['Africa/'], TN: ['Africa/'], LY: ['Africa/'], SD: ['Africa/'],
  SO: ['Africa/'], MR: ['Africa/'],
  JO: ['Asia/'], LB: ['Asia/'], SY: ['Asia/'], IQ: ['Asia/'], PS: ['Asia/'],
  IR: ['Asia/'], TR: ['Europe/', 'Asia/'], IL: ['Asia/'],
  PK: ['Asia/'], IN: ['Asia/'], BD: ['Asia/'],
  CN: ['Asia/'], JP: ['Asia/'], KR: ['Asia/'],
  MY: ['Asia/'], ID: ['Asia/'], PH: ['Asia/'], TH: ['Asia/'],
  GB: ['Europe/', 'Atlantic/'], FR: ['Europe/'], DE: ['Europe/'], BE: ['Europe/'],
  NL: ['Europe/'], ES: ['Europe/', 'Atlantic/'], IT: ['Europe/'], PT: ['Europe/', 'Atlantic/'],
  SE: ['Europe/'], NO: ['Europe/'], DK: ['Europe/'], FI: ['Europe/'],
  AT: ['Europe/'], CH: ['Europe/'], PL: ['Europe/'], GR: ['Europe/'],
  US: ['America/'], CA: ['America/'], MX: ['America/'],
  BR: ['America/'], AR: ['America/'], CL: ['America/'], CO: ['America/'],
  NG: ['Africa/'], KE: ['Africa/'], TZ: ['Africa/'], ET: ['Africa/'], ZA: ['Africa/'],
  AU: ['Australia/', 'Pacific/'], NZ: ['Pacific/'],
  RU: ['Europe/', 'Asia/'],
};

// ── Rough country bounding boxes [minLat, maxLat, minLon, maxLon] ─────────────
const COUNTRY_BOUNDS: Record<string, [number, number, number, number]> = {
  SA: [16.0, 32.5,  34.5,  55.7], AE: [22.6, 26.2,  51.5,  56.4],
  KW: [28.5, 30.1,  46.5,  48.5], QA: [24.5, 26.2,  50.7,  51.7],
  BH: [25.8, 26.4,  50.3,  50.8], OM: [16.6, 26.5,  51.8,  60.0],
  YE: [12.1, 19.1,  41.8,  55.0],
  EG: [21.7, 31.8,  24.6,  37.0], MA: [27.6, 36.0, -17.1,  -1.0],
  DZ: [18.9, 37.1,  -8.7,   9.0], TN: [30.2, 37.6,   7.5,  11.6],
  LY: [19.5, 33.3,   9.3,  25.2], SD: [3.5,  22.2,  21.8,  38.6],
  JO: [29.1, 33.4,  35.0,  39.3], LB: [33.0, 34.7,  35.1,  36.7],
  SY: [32.3, 37.3,  35.6,  42.4], IQ: [29.0, 37.4,  38.7,  48.7],
  IR: [25.0, 39.8,  44.0,  63.3], TR: [35.8, 42.2,  25.7,  44.8],
  IN: [6.5,  35.7,  68.0,  97.4], PK: [23.5, 37.1,  60.8,  77.0],
  CN: [18.0, 53.5,  73.5, 135.1], JP: [24.0, 45.6, 122.9, 153.9],
  GB: [49.8, 61.0, -14.0,   2.0], FR: [41.3, 51.2,  -5.2,   9.6],
  DE: [47.3, 55.1,   5.9,  15.0], ES: [27.6, 43.8, -18.2,   4.3],
  IT: [36.6, 47.1,   6.6,  18.6],
  US: [18.0, 72.0,-179.0, -65.0], CA: [41.7, 83.0,-141.0, -52.6],
  MX: [14.5, 32.7,-117.1, -86.7], BR: [-33.8, 5.3, -73.9, -28.8],
  AU: [-43.7,-10.7, 113.1, 153.6], NG: [4.2,  13.9,   2.7,  14.7],
  ZA: [-34.9,-22.1,  16.5,  32.9], KE: [-4.7,   4.6,  33.9,  41.9],
};

type AuditIssue = { country: string; slug: string; issues: string[] };

function isValidTimezone(tz: unknown): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true; }
  catch { return false; }
}

function isValidLat(lat: unknown): boolean {
  const n = Number(lat);
  return !isNaN(n) && n >= -90 && n <= 90 && n !== 0;
}

function isValidLon(lon: unknown): boolean {
  const n = Number(lon);
  return !isNaN(n) && n >= -180 && n <= 180 && n !== 0;
}

function auditCity(city: Record<string, unknown>): string[] {
  const issues: string[] = [];

  if (!city.city_slug || typeof city.city_slug !== 'string') issues.push('missing_city_slug');
  if (!isValidTimezone(city.timezone)) issues.push(`invalid_timezone:${city.timezone ?? 'null'}`);
  if (!isValidLat(city.lat)) issues.push(`invalid_lat:${city.lat ?? 'null'}`);
  if (!isValidLon(city.lon)) issues.push(`invalid_lon:${city.lon ?? 'null'}`);
  if (!city.city_name_ar && !city.city_name_en) issues.push('missing_name');
  if (!city.country_code || typeof city.country_code !== 'string') issues.push('missing_country_code');

  // Only run geo-plausibility checks if basic fields passed
  if (issues.length === 0) {
    const cc  = String(city.country_code).toUpperCase();
    const lat = Number(city.lat);
    const lon = Number(city.lon);
    const tz  = String(city.timezone);

    if (lat === 0 && lon === 0) {
      issues.push('zero_coordinates:likely_missing_data');
    } else {
      // Timezone region check
      const expectedPrefixes = COUNTRY_TZ_REGION[cc];
      if (expectedPrefixes && !expectedPrefixes.some(p => tz.startsWith(p))) {
        issues.push(`timezone_region_mismatch:${tz}_unexpected_for_${cc}`);
      }

      // Bounding box check
      const bounds = COUNTRY_BOUNDS[cc];
      if (bounds) {
        const [minLat, maxLat, minLon, maxLon] = bounds;
        if (lat < minLat || lat > maxLat || lon < minLon || lon > maxLon) {
          issues.push(`coordinates_outside_country:lat=${lat},lon=${lon}`);
        }
      }
    }
  }

  return issues;
}

function main() {
  const files = fs.readdirSync(GEO_DIR).filter(f => f.endsWith('.json'));
  const allIssues: AuditIssue[] = [];
  let totalCities = 0;

  for (const file of files) {
    const country = file.replace('.json', '');
    const raw = fs.readFileSync(path.join(GEO_DIR, file), 'utf8');
    let cities: Record<string, unknown>[];
    try {
      cities = JSON.parse(raw);
    } catch {
      allIssues.push({ country, slug: '__parse__', issues: ['json_parse_error'] });
      continue;
    }

    if (!Array.isArray(cities)) {
      allIssues.push({ country, slug: '__format__', issues: ['not_an_array'] });
      continue;
    }

    totalCities += cities.length;
    for (const city of cities) {
      const issues = auditCity(city);
      if (issues.length > 0) {
        allIssues.push({ country, slug: String(city.city_slug ?? '(no-slug)'), issues });
      }
    }
  }

  console.log(`[validate:geo] Checked ${files.length} country files, ${totalCities} cities`);

  if (allIssues.length === 0) {
    console.log('[validate:geo] ✅ All geo snapshot data is valid.');
    process.exit(0);
  }

  console.error(`[validate:geo] FAILED — ${allIssues.length} cities have bad data:\n`);
  for (const issue of allIssues) {
    console.error(`  ${issue.country}/${issue.slug}:`);
    for (const iss of issue.issues) console.error(`    • ${iss}`);
  }
  console.error('\nFix options:');
  console.error('  npm run geo:fix              — auto-repair using OpenStreetMap + timeapi.io');
  console.error('  npm run geo:fix -- --country=<slug>  — fix a single country file');
  console.error('  Or edit public/geo/cities/<country>.json directly, then re-run validate:geo.');
  process.exit(1);
}

main();
