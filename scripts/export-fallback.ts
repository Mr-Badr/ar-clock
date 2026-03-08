import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync } from 'fs'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('[export-fallback] Starting...')
  mkdirSync('src/lib/db/fallback', { recursive: true })

  const { data: countries, error: cErr } = await supabase
    .from('countries').select('*').order('name_ar')
  if (cErr) throw new Error(`countries: ${cErr.message}`)
  writeFileSync('src/lib/db/fallback/countries.json', JSON.stringify(countries, null, 2))
  console.log(`[export-fallback] ✅ ${countries?.length} countries`)

  const { data: cities, error: citErr } = await supabase
    .from('cities')
    .select('id,city_slug,country_code,name_ar,name_en,timezone,is_capital,lat,lon,priority,population')
  if (citErr) throw new Error(`cities: ${citErr.message}`)
  writeFileSync('src/lib/db/fallback/cities-index.json', JSON.stringify(cities, null, 2))
  console.log(`[export-fallback] ✅ ${cities?.length} cities`)

  console.log('[export-fallback] Done.')
}

run().catch(err => { console.error('[export-fallback] ❌', err); process.exit(1) })
