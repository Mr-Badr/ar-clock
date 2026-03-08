// scripts/patchSeedCities.js
const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../src/lib/seedCities.json');
const worldDataPath = path.join(__dirname, '../src/lib/world-data.js'); // just reference for manual lookup though it's ES6

// country mapping for names
const countryEnglishNames = {
  'saudi-arabia': 'Saudi Arabia',
  'egypt': 'Egypt',
  'uae': 'United Arab Emirates',
  'morocco': 'Morocco',
  'iraq': 'Iraq',
  'kuwait': 'Kuwait',
  'qatar': 'Qatar',
  'bahrain': 'Bahrain',
  'oman': 'Oman',
  'jordan': 'Jordan',
  'lebanon': 'Lebanon',
  'syria': 'Syria',
  'palestine': 'Palestine',
  'algeria': 'Algeria',
  'tunisia': 'Tunisia',
  'libya': 'Libya',
  'sudan': 'Sudan',
  'yemen': 'Yemen',
  'turkey': 'Turkey'
};

const capitals = [
  'riyadh', 'cairo', 'abu-dhabi', 'rabat', 'baghdad', 'kuwait-city', 'doha', 'manama', 'muscat',
  'amman', 'beirut', 'damascus', 'jerusalem', 'algiers', 'tunis', 'tripoli', 'khartoum', 'sanaa', 'ankara'
];

let data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

data = data.map(city => {
  return {
    ...city,
    country_name_en: countryEnglishNames[city.country_slug] || city.country_slug.replace(/-/g, ' '),
    is_capital: capitals.includes(city.city_slug) || city.priority === 100
  };
});

fs.writeFileSync(seedPath, JSON.stringify(data, null, 2));
console.log('✅ Patched seedCities.json with country_name_en and is_capital');
