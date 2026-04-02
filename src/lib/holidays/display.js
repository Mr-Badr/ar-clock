import { getCountryByCode } from '@/lib/events/country-dictionary';

function normalizeText(value) {
  return String(value || '').trim();
}

export function getHolidayCountryContext(event) {
  const countryCode = event?._countryCode || event?.__aliasCountryCode || null;
  if (!countryCode) return null;
  const country = getCountryByCode(countryCode);
  if (!country) return null;
  return {
    code: country.code,
    name: country.nameAr,
    authority: country.authority,
  };
}

export function localizeEventLabel(value, event) {
  const text = normalizeText(value);
  const country = getHolidayCountryContext(event);
  if (!text || !country?.name) return text;
  if (text.includes(country.name)) return text;
  const punctuationMatch = text.match(/([؟!.,،؛]+)$/);
  if (punctuationMatch) {
    const punctuation = punctuationMatch[1];
    const base = text.slice(0, -punctuation.length).trim();
    return `${base} في ${country.name}${punctuation}`;
  }
  return `${text} في ${country.name}`;
}

export function ensureCountryContextSentence(value, event) {
  const text = normalizeText(value);
  const country = getHolidayCountryContext(event);
  if (!text || !country?.name) return text;
  if (text.includes(country.name)) return text;
  return `${text} وتعرض هذه الصفحة الموعد والمعلومات الخاصة بـ${country.name}.`;
}
