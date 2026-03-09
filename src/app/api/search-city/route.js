import { NextResponse } from 'next/server'
import { searchCities } from '@/lib/db/queries/cities'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  try {
    const cities = await searchCities(query, 10)

    // Map to the shape expected by SearchCity.client.jsx
    const formattedCities = cities.map(city => ({
      city_slug: city.city_slug,
      city_name_ar: city.name_ar,
      city_name_en: city.name_en,
      country_slug: city.countries.country_slug,
      country_code: city.country_code,
      country_name_ar: city.countries.name_ar,
      timezone: city.timezone,
      lat: city.lat,
      lon: city.lon,
      is_capital: city.is_capital,
      population: city.population
    }))

    return NextResponse.json(formattedCities)
  } catch (error) {
    console.error('[API] search-city error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
