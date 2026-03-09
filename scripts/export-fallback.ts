import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '../src/lib/db/constants'

/**
 * scripts/export-fallback.ts
 * Creates local JSON backups of DB data. Runs automatically before every build.
 * If Supabase is unreachable at runtime, query functions fall back to these files.
 */

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('[export-fallback] Starting...')
  mkdirSync('src/lib/db/fallback', { recursive: true })

  // 1. Export Countries (All countries, prioritized)
  const { data: countries, error: cErr } = await supabase
    .from('countries').select('*').order('name_ar')

  if (cErr) {
    console.error(`[export-fallback] ❌ countries: ${cErr.message}`)
  } else {
    writeFileSync('src/lib/db/fallback/countries.json', JSON.stringify(countries, null, 2))
    console.log(`[export-fallback] ✅ ${countries?.length} countries`)
  }

  // 2. Export Cities Index (Prioritized & Limited)
  // We fetch cities from priority countries + global popular + capitals
  // to keep the file size reasonable but high utility.
  const allPrioritySlugs = [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES];

  // Get all capitals first
  const { data: capitals, error: capErr } = await supabase
    .from('cities')
    .select('id,city_slug,country_code,name_ar,name_en,timezone,is_capital,lat,lon,priority,population,countries!inner(country_slug)')
    .eq('is_capital', true)

  // Get cities from priority countries
  const { data: priorityCities, error: priErr } = await supabase
    .from('cities')
    .select('id,city_slug,country_code,name_ar,name_en,timezone,is_capital,lat,lon,priority,population,countries!inner(country_slug)')
    .in('countries.country_slug', allPrioritySlugs)
    .order('priority', { ascending: false })
    .limit(2000)

  if (capErr || priErr) {
    console.error(`[export-fallback] ❌ cities: ${capErr?.message || priErr?.message}`)
  } else {
    // Merge and deduplicate
    const combined = [...(capitals || []), ...(priorityCities || [])];
    const uniqueMap = new Map();
    combined.forEach((c: any) => uniqueMap.set(c.id, c));

    const finalCities = Array.from(uniqueMap.values())
      .map((c: any) => {
        const { countries, ...rest } = c;
        return { ...rest, country_slug: countries.country_slug };
      })
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.population || 0) - (a.population || 0))
      .slice(0, 4000);

    writeFileSync('src/lib/db/fallback/cities-index.json', JSON.stringify(finalCities, null, 2))
    console.log(`[export-fallback] ✅ ${finalCities.length} cities (prioritized & limited)`)
  }

  console.log('[export-fallback] Done.')
}

run().catch(err => { console.error('[export-fallback] ❌ Fatal:', err); process.exit(1) })
