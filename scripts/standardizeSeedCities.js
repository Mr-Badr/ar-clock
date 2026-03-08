// scripts/standardizeSeedCities.js
const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../src/lib/seedCities.json');

// Read current data
let data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// Explicit schema mapping
data = data.map(city => {
  return {
    country_slug: city.country_slug || '',
    country_name_ar: city.country_name_ar || '',
    country_name_en: city.country_name_en || '',
    country_code: city.country_code || '',
    city_slug: city.city_slug || '',
    city_name_ar: city.city_name_ar || '',
    city_name_en: city.city_name_en || '',
    lat: typeof city.lat === 'number' ? city.lat : 0,
    lon: typeof city.lon === 'number' ? city.lon : 0,
    timezone: city.timezone || 'UTC',
    population: typeof city.population === 'number' ? city.population : 0,
    priority: typeof city.priority === 'number' ? city.priority : 0,
    is_capital: typeof city.is_capital === 'boolean' ? city.is_capital : false
  };
});

fs.writeFileSync(seedPath, JSON.stringify(data, null, 2));
console.log('✅ Standardized seedCities.json to definitive schema');
