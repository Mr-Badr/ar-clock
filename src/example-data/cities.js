export const CITIES_DB = {
  'saudi-arabia': {
    'riyadh': {
      name: 'الرياض',
      countryName: 'السعودية',
      lat: 24.7136,
      lon: 46.6753,
      timezone: 'Asia/Riyadh',
      method: 'UmmAlQura' // Adhan.js CalculationMethod
    }
  },
  'morocco': {
    'rabat': {
      name: 'الرباط',
      countryName: 'المغرب',
      lat: 34.0209,
      lon: -6.8416,
      timezone: 'Africa/Casablanca',
      method: 'Egyptian' // Fallback/approximation
    }
  },
  'egypt': {
    'cairo': {
      name: 'القاهرة',
      countryName: 'مصر',
      lat: 30.0444,
      lon: 31.2357,
      timezone: 'Africa/Cairo',
      method: 'Egyptian'
    }
  }
};

export function getCityData(country, city) {
  return CITIES_DB[country]?.[city] || null;
}
