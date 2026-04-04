import 'server-only';

import { cache } from 'react';

import { PRIORITY_COUNTRY_SLUGS, GLOBAL_POPULAR_COUNTRIES } from '@/lib/db/constants';
import { getCitiesByCountry } from '@/lib/db/queries/cities';
import { getAllCountries } from '@/lib/db/queries/countries';
import { ALL_RAW_EVENTS } from '@/lib/events';

const POPULAR_TIME_NOW_CITY_PRIORITY = [
  ['saudi-arabia', 'riyadh'],
  ['saudi-arabia', 'jeddah'],
  ['saudi-arabia', 'makkah'],
  ['saudi-arabia', 'madinah'],
  ['saudi-arabia', 'dammam'],
  ['egypt', 'cairo'],
  ['egypt', 'alexandria'],
  ['egypt', 'giza'],
  ['united-arab-emirates', 'dubai'],
  ['united-arab-emirates', 'abu-dhabi'],
  ['united-arab-emirates', 'sharjah'],
  ['united-arab-emirates', 'al-ain-city'],
  ['morocco', 'casablanca'],
  ['morocco', 'rabat'],
  ['morocco', 'tangier'],
  ['morocco', 'marrakesh'],
  ['morocco', 'fes'],
  ['qatar', 'doha'],
  ['kuwait', 'kuwait-city'],
  ['kuwait', 'al-ahmadi'],
  ['jordan', 'amman'],
  ['jordan', 'irbid'],
  ['jordan', 'zarqa'],
  ['iraq', 'baghdad'],
  ['iraq', 'mosul'],
  ['iraq', 'erbil'],
  ['iraq', 'basrah'],
  ['oman', 'muscat'],
  ['oman', 'seeb'],
  ['bahrain', 'manama'],
  ['tunisia', 'tunis'],
  ['algeria', 'algiers'],
  ['algeria', 'oran'],
  ['algeria', 'constantine'],
  ['libya', 'tripoli'],
  ['libya', 'benghazi'],
  ['syria', 'damascus'],
  ['syria', 'aleppo'],
  ['syria', 'latakia'],
  ['lebanon', 'beirut'],
  ['yemen', 'sanaa'],
  ['yemen', 'aden'],
  ['yemen', 'taiz'],
  ['sudan', 'khartoum'],
  ['sudan', 'omdurman'],
  ['sudan', 'port-sudan'],
  ['turkey', 'istanbul'],
  ['turkey', 'ankara'],
  ['turkey', 'izmir'],
  ['united-kingdom', 'london'],
  ['united-kingdom', 'manchester'],
  ['france', 'paris'],
  ['france', 'marseille'],
  ['france', 'lyon'],
  ['germany', 'berlin'],
  ['germany', 'hamburg'],
  ['germany', 'munich'],
  ['germany', 'frankfurt-am-main'],
  ['united-states', 'new-york-city'],
  ['united-states', 'washington'],
  ['united-states', 'los-angeles'],
  ['united-states', 'chicago'],
  ['canada', 'toronto'],
  ['canada', 'ottawa'],
  ['canada', 'montreal'],
];

const COUNTRY_PRIORITY = [...PRIORITY_COUNTRY_SLUGS, ...GLOBAL_POPULAR_COUNTRIES];
const COUNTRY_PRIORITY_INDEX = new Map(
  COUNTRY_PRIORITY.map((countrySlug, index) => [countrySlug, index]),
);
const CITY_PRIORITY_INDEX = new Map(
  POPULAR_TIME_NOW_CITY_PRIORITY.map(([countrySlug, citySlug], index) => [
    `${countrySlug}:${citySlug}`,
    index,
  ]),
);

function sortCountries(a, b) {
  const aRank = COUNTRY_PRIORITY_INDEX.get(a.country_slug) ?? Number.MAX_SAFE_INTEGER;
  const bRank = COUNTRY_PRIORITY_INDEX.get(b.country_slug) ?? Number.MAX_SAFE_INTEGER;

  return aRank - bRank
    || String(a.name_ar || a.name_en || a.country_slug).localeCompare(
      String(b.name_ar || b.name_en || b.country_slug),
      'ar',
    );
}

function sortCountryCities(countrySlug, a, b) {
  const aRank = CITY_PRIORITY_INDEX.get(`${countrySlug}:${a.city_slug}`) ?? Number.MAX_SAFE_INTEGER;
  const bRank = CITY_PRIORITY_INDEX.get(`${countrySlug}:${b.city_slug}`) ?? Number.MAX_SAFE_INTEGER;

  return aRank - bRank
    || Number(Boolean(b.is_capital)) - Number(Boolean(a.is_capital))
    || (b.priority || 0) - (a.priority || 0)
    || (b.population || 0) - (a.population || 0)
    || String(a.name_ar || a.name_en || a.city_slug).localeCompare(
      String(b.name_ar || b.name_en || b.city_slug),
      'ar',
    );
}

function buildTimeNowCityLink(country, city) {
  if (!country?.country_slug || !city?.city_slug) return null;

  const cityName = city.name_ar || city.name_en;
  const countryName = country.name_ar || country.name_en;

  if (!cityName || !countryName) return null;

  return {
    href: `/time-now/${country.country_slug}/${city.city_slug}`,
    countrySlug: country.country_slug,
    citySlug: city.city_slug,
    label: `الوقت الآن في ${cityName}`,
    description: `اعرف الساعة الآن في ${cityName}، ${countryName} مع التاريخ اليوم والمنطقة الزمنية الدقيقة.`,
  };
}

function buildTimeNowCountryLink(country) {
  if (!country?.country_slug) return null;

  const countryName = country.name_ar || country.name_en;
  if (!countryName) return null;

  return {
    href: `/time-now/${country.country_slug}`,
    countrySlug: country.country_slug,
    label: `الوقت الآن في ${countryName}`,
    description: `صفحة الوقت الآن في ${countryName} مع المدن الرئيسية والتوقيت المحلي والروابط الداخلية.`,
  };
}

function dedupeLinks(links) {
  const seen = new Set();
  return links.filter((link) => {
    if (!link?.href || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

async function getCountryBuckets(limit) {
  const countries = (await getAllCountries()).slice().sort(sortCountries);
  const focusCountries = countries.slice(0, Math.max(18, Math.ceil(limit / 2)));
  const cityBuckets = await Promise.all(
    focusCountries.map(async (country) => ({
      country,
      cities: (await getCitiesByCountry(country.country_code)).slice(),
    })),
  );

  for (const bucket of cityBuckets) {
    bucket.cities.sort((a, b) => sortCountryCities(bucket.country.country_slug, a, b));
  }

  return cityBuckets;
}

export const getPopularTimeNowCountryLinks = cache(async (limit = 32) => {
  const countries = (await getAllCountries()).slice().sort(sortCountries);
  return countries
    .map((country) => buildTimeNowCountryLink(country))
    .filter(Boolean)
    .slice(0, limit);
});

export const getPopularTimeNowCityLinks = cache(async (limit = 60) => {
  const buckets = await getCountryBuckets(limit);
  const bucketsByCountry = new Map(
    buckets.map((bucket) => [bucket.country.country_slug, bucket]),
  );

  const links = [];

  for (const [countrySlug, citySlug] of POPULAR_TIME_NOW_CITY_PRIORITY) {
    const bucket = bucketsByCountry.get(countrySlug);
    if (!bucket) continue;
    const city = bucket.cities.find((item) => item.city_slug === citySlug);
    if (!city) continue;
    const link = buildTimeNowCityLink(bucket.country, city);
    if (link) links.push(link);
  }

  for (const bucket of buckets) {
    for (const city of bucket.cities) {
      const link = buildTimeNowCityLink(bucket.country, city);
      if (link) links.push(link);
      if (links.length >= limit * 3) break;
    }
    if (links.length >= limit * 3) break;
  }

  return dedupeLinks(links).slice(0, limit);
});

function buildHolidayQueryLabel(eventName) {
  if (!eventName) return '';

  if (/(نتيجة|نتائج|راتب|الراتب|صرف|حساب|الربع|اختبار|اختبارات|امتحان|امتحانات)/.test(eventName)) {
    return `موعد ${eventName}`;
  }

  return `كم باقي على ${eventName}`;
}

function buildHolidayEventLink(event) {
  if (!event?.slug || !event?.name) return null;

  const label = buildHolidayQueryLabel(event.name);

  return {
    href: `/holidays/${event.slug}`,
    label,
    description: `${label} مع العد التنازلي والتاريخ والمعلومات الكاملة عن المناسبة.`,
  };
}

export const ALL_HOLIDAY_EVENT_LINKS = ALL_RAW_EVENTS
  .map((event) => buildHolidayEventLink(event))
  .filter(Boolean);

export const FEATURED_COUNTDOWN_LINKS = ALL_HOLIDAY_EVENT_LINKS;
