import { NextResponse } from 'next/server'
import { getCountryBySlug } from '@/lib/db/queries/countries'
import { getCitiesByCountry } from '@/lib/db/queries/cities'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const countrySlug = searchParams.get('country')

  if (!countrySlug) {
    return NextResponse.json({ error: 'Country slug is required' }, { status: 400 })
  }

  try {
    console.log(`[API] Fetching cities for country slug: ${countrySlug}`)
    const country = await getCountryBySlug(countrySlug)
    if (!country) {
      console.warn(`[API] Country not found for slug: ${countrySlug}`)
      return NextResponse.json({ error: 'Country not found' }, { status: 404 })
    }

    const cities = await getCitiesByCountry(country.country_code)
    console.log(`[API] Found ${cities?.length || 0} cities for ${country.country_code}`)

    // Map to the shape expected by SearchCity.client.jsx
    const formattedCities = (cities || []).map(city => ({
      city_slug: city.city_slug,
      city_name_ar: city.name_ar,
      city_name_en: city.name_en,
      country_slug: country.country_slug,
      country_code: country.country_code,
      country_name_ar: country.name_ar,
      timezone: city.timezone,
      lat: city.lat,
      lon: city.lon,
      is_capital: city.is_capital,
      population: city.population
    }))

    return NextResponse.json(formattedCities, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('[API] cities-by-country error:', error)
    return NextResponse.json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
