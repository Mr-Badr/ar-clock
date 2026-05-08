import { prisma } from '../src/lib/db/prisma'
import { writeFileSync, mkdirSync } from 'fs'
import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '../src/lib/db/constants'

/**
 * scripts/export-fallback.ts
 * Creates local JSON backups of DB data. Runs automatically before every build.
 * If Supabase is unreachable at runtime, query functions fall back to these files.
 */



async function run() {
  console.log('[export-fallback] Starting...')
  mkdirSync('src/lib/db/fallback', { recursive: true })

  // 1. Export Countries (All countries, prioritized)
  try {
    const countries = await prisma.country.findMany({
      orderBy: { nameAr: 'asc' }
    })
    
    const formattedCountries = countries.map((c) => ({
      id: Number(c.id),
      country_code: c.countryCode,
      country_slug: c.countrySlug,
      name_en: c.nameEn,
      name_ar: c.nameAr,
      timezone: c.timezone
    }))

    writeFileSync('src/lib/db/fallback/countries.json', JSON.stringify(formattedCountries, null, 2))
    console.log(`[export-fallback] ✅ ${formattedCountries.length} countries`)
  } catch (cErr: any) {
    console.error(`[export-fallback] ❌ countries: ${cErr.message}`)
  }

  // 2. Export Cities Index (Prioritized & Limited)
  // We fetch cities from priority countries + global popular + capitals
  // to keep the file size reasonable but high utility.
  const allPrioritySlugs = [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES];

  try {
    // Get all capitals first
    const capitals = await prisma.city.findMany({
      where: { isCapital: true },
      include: { country: true }
    })

    // Get cities from priority countries
    const priorityCities = await prisma.city.findMany({
      where: { country: { countrySlug: { in: allPrioritySlugs } } },
      orderBy: { priority: 'desc' },
      take: 2000,
      include: { country: true }
    })

    // Merge and deduplicate
    const combined = [...capitals, ...priorityCities];
    const uniqueMap = new Map();
    combined.forEach((c) => uniqueMap.set(Number(c.id), c));

    const finalCities = Array.from(uniqueMap.values())
      .map((c: any) => ({
        id: Number(c.id),
        city_slug: c.citySlug,
        country_code: c.countryCode,
        name_ar: c.nameAr,
        name_en: c.nameEn,
        timezone: c.timezone,
        is_capital: c.isCapital,
        lat: c.lat,
        lon: c.lon,
        priority: c.priority,
        population: c.population,
        country_slug: c.country.countrySlug
      }))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0) || (b.population || 0) - (a.population || 0))
      .slice(0, 4000);

    writeFileSync('src/lib/db/fallback/cities-index.json', JSON.stringify(finalCities, null, 2))
    console.log(`[export-fallback] ✅ ${finalCities.length} cities (prioritized & limited)`)
  } catch (err: any) {
    console.error(`[export-fallback] ❌ cities: ${err.message}`)
  }

  console.log('[export-fallback] Done.')
  await prisma.$disconnect()
}

run().catch(async (err) => { 
  console.error('[export-fallback] ❌ Fatal:', err); 

  process.exit(1) 
})
