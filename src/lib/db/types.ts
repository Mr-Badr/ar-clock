// Countries and cities — matches DB schema exactly
export type Country = {
  id: number
  country_code: string       // "MA"
  country_slug: string       // "morocco"
  name_ar: string
  name_en: string | null
  timezone: string | null    // nullable — fall back to capital city timezone
}

export type City = {
  id: number
  country_code: string
  city_slug: string
  name_ar: string
  name_en: string | null
  lat: number
  lon: number
  timezone: string           // always present
  population: number
  priority: number
  is_capital: boolean
}

export type CityWithCountry = City & {
  country: Pick<Country, 'name_ar' | 'name_en' | 'country_slug' | 'country_code'>
}

// Shape for generateStaticParams on nested routes
export type CityParams = {
  country: string  // country_slug
  city: string     // city_slug
}
