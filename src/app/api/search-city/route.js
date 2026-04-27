import { NextResponse } from 'next/server'
import { searchCities } from '@/lib/db/queries/cities'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = String(searchParams.get('q') || '').trim()

  if (!query || query.length < 2) {
    return NextResponse.json([])
  }

  // Short queries are served well enough from the local city indexes on the client.
  // Keeping the live API for longer-tail searches reduces database pressure.
  if (query.length < 4) {
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
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
    return NextResponse.json(formattedCities, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('[API] search-city error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
