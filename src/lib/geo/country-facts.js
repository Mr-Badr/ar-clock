/**
 * lib/geo/country-facts.js
 *
 * Reference facts about each country (region, area, currency, official
 * language, international calling code) — sourced once from the public
 * domain "mledoze/countries" dataset (2026-08-24) and vendored locally as
 * `src/data/geo/country-facts.json`, keyed by ISO 3166-1 alpha-2 code.
 *
 * Deliberately NOT a live third-party API call: this data changes on the
 * order of years, not days, and a country/city page is hot SEO surface that
 * must never depend on an external service's uptime. Same philosophy as the
 * `public/geo/*.json` snapshots (CLAUDE.md: "static snapshot ... public
 * routes read snapshot by default").
 *
 * Coverage: 250 of 252 country codes the app knows about. The 2 misses are
 * dissolved/legacy codes (AN — Netherlands Antilles, CS — Serbia and
 * Montenegro) with effectively zero traffic. `getCountryFacts()` returns
 * `null` for any unknown code — every caller must treat that as "omit the
 * fact, don't render a broken card," never as an error.
 */
import countryFactsRaw from '@/data/geo/country-facts.json';

const REGION_AR = {
  Africa: 'أفريقيا',
  Europe: 'أوروبا',
  Asia: 'آسيا',
  Americas: 'الأمريكتان',
  Oceania: 'أوقيانوسيا',
  Antarctic: 'القارة القطبية الجنوبية',
};

const SUBREGION_AR = {
  'Australia and New Zealand': 'أستراليا ونيوزيلندا',
  Caribbean: 'منطقة الكاريبي',
  'Central America': 'أمريكا الوسطى',
  'Central Asia': 'آسيا الوسطى',
  'Central Europe': 'وسط أوروبا',
  'Eastern Africa': 'شرق أفريقيا',
  'Eastern Asia': 'شرق آسيا',
  'Eastern Europe': 'شرق أوروبا',
  Melanesia: 'ميلانيزيا',
  Micronesia: 'ميكرونيزيا',
  'Middle Africa': 'وسط أفريقيا',
  'North America': 'أمريكا الشمالية',
  'Northern Africa': 'شمال أفريقيا',
  'Northern Europe': 'شمال أوروبا',
  Polynesia: 'بولينيزيا',
  'South America': 'أمريكا الجنوبية',
  'South-Eastern Asia': 'جنوب شرق آسيا',
  'Southeast Europe': 'جنوب شرق أوروبا',
  'Southern Africa': 'جنوب أفريقيا',
  'Southern Asia': 'جنوب آسيا',
  'Southern Europe': 'جنوب أوروبا',
  'Western Africa': 'غرب أفريقيا',
  'Western Asia': 'غرب آسيا',
  'Western Europe': 'غرب أوروبا',
};

const LANGUAGE_AR = {
  Afrikaans: 'الأفريكانية',
  Albanian: 'الألبانية',
  Amharic: 'الأمهرية',
  Arabic: 'العربية',
  Armenian: 'الأرمينية',
  'Austro-Bavarian German': 'الألمانية (البافارية)',
  Aymara: 'الأيمارا',
  Azerbaijani: 'الأذرية',
  Belarusian: 'البيلاروسية',
  'Belizean Creole': 'الكريولية (بليز)',
  Bengali: 'البنغالية',
  Berber: 'الأمازيغية',
  Bislama: 'البيسلامية',
  Bosnian: 'البوسنية',
  Bulgarian: 'البلغارية',
  Burmese: 'البورمية',
  Carolinian: 'الكارولينية',
  Catalan: 'الكتالانية',
  Chamorro: 'التشامورو',
  Chibarwe: 'التشيبارويّة',
  Chinese: 'الصينية',
  Croatian: 'الكرواتية',
  Czech: 'التشيكية',
  Danish: 'الدنماركية',
  Dari: 'الدارية',
  Dutch: 'الهولندية',
  Dzongkha: 'الدزونغخا',
  English: 'الإنجليزية',
  Estonian: 'الإستونية',
  Finnish: 'الفنلندية',
  French: 'الفرنسية',
  Georgian: 'الجورجية',
  German: 'الألمانية',
  Greek: 'اليونانية',
  Greenlandic: 'الغرينلاندية',
  'Guaraní': 'الغوارانية',
  Hungarian: 'الهنغارية',
  Icelandic: 'الآيسلندية',
  Indonesian: 'الإندونيسية',
  Italian: 'الإيطالية',
  Japanese: 'اليابانية',
  Kazakh: 'الكازاخية',
  Khmer: 'الخميرية',
  Korean: 'الكورية',
  Kyrgyz: 'القيرغيزية',
  Lao: 'اللاوية',
  Latvian: 'اللاتفية',
  Lithuanian: 'الليتوانية',
  Macedonian: 'المقدونية',
  Malay: 'الملايوية',
  Maldivian: 'المالديفية',
  Moldavian: 'المولدوفية',
  Mongolian: 'المنغولية',
  Montenegrin: 'المونتينيغرية',
  Nepali: 'النيبالية',
  Norwegian: 'النرويجية',
  'Norwegian Nynorsk': 'النرويجية (نينورسك)',
  'Persian (Farsi)': 'الفارسية',
  Polish: 'البولندية',
  Portuguese: 'البرتغالية',
  Romanian: 'الرومانية',
  Russian: 'الروسية',
  Serbian: 'الصربية',
  'Seychellois Creole': 'الكريولية السيشيلية',
  Sinhala: 'السنهالية',
  Slovak: 'السلوفاكية',
  Slovene: 'السلوفينية',
  Spanish: 'الإسبانية',
  Swedish: 'السويدية',
  Thai: 'التايلاندية',
  Turkish: 'التركية',
  Ukrainian: 'الأوكرانية',
  Vietnamese: 'الفيتنامية',
};

function translateLanguage(name) {
  if (!name || typeof name !== 'string') return null;
  return LANGUAGE_AR[name] || name;
}

/**
 * @param {string} countryCode ISO 3166-1 alpha-2, e.g. "MA"
 * @returns {{
 *   regionAr: string|null,
 *   subregionAr: string|null,
 *   areaKm2: number|null,
 *   currencyCode: string|null,
 *   currencySymbol: string|null,
 *   languagesAr: string[],
 *   callingCode: string|null,
 *   landlocked: boolean,
 * }|null} null when the country code isn't in the dataset — callers must
 *   treat that as "omit this content," never as an error.
 */
export function getCountryFacts(countryCode) {
  if (!countryCode || typeof countryCode !== 'string') return null;
  const raw = countryFactsRaw[countryCode.trim().toUpperCase()];
  if (!raw) return null;

  const languagesAr = Array.isArray(raw.languages)
    ? raw.languages.map(translateLanguage).filter(Boolean)
    : [];

  return {
    regionAr: raw.region ? (REGION_AR[raw.region] || null) : null,
    subregionAr: raw.subregion ? (SUBREGION_AR[raw.subregion] || null) : null,
    areaKm2: typeof raw.area === 'number' && raw.area > 0 ? Math.round(raw.area) : null,
    currencyCode: raw.currencyCode || null,
    currencySymbol: raw.currencySymbol || null,
    languagesAr,
    callingCode: raw.calling || null,
    landlocked: Boolean(raw.landlocked),
  };
}

/** Latin-digit thousands formatting (house rule: no Arabic-Indic numerals). */
export function formatCountAr(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

/** "2.4 مليون نسمة" / "890 ألف نسمة" / "12,000 نسمة" — approximate, rounded. */
export function formatPopulationAr(value) {
  if (!Number.isFinite(value) || value <= 0) return null;
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded = millions >= 10 ? Math.round(millions) : Math.round(millions * 10) / 10;
    return `${new Intl.NumberFormat('en-US').format(rounded)} مليون نسمة تقريباً`;
  }
  if (value >= 1_000) {
    return `${new Intl.NumberFormat('en-US').format(Math.round(value / 1000))} ألف نسمة تقريباً`;
  }
  return `${formatCountAr(value)} نسمة`;
}

export function formatAreaAr(areaKm2) {
  const formatted = formatCountAr(areaKm2);
  return formatted ? `${formatted} كم²` : null;
}
