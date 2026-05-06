import { getCountryByCode } from '@/lib/events/country-dictionary';

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const ARABIC_TATWEEL_REGEX = /\u0640/g;
const NON_SEARCH_TEXT_REGEX = /[^\p{L}\p{N}\s-]+/gu;

export function normalizeHolidaySearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .replace(ARABIC_TATWEEL_REGEX, '')
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ء/g, '')
    .replace(NON_SEARCH_TEXT_REGEX, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeHolidaySearchText(value) {
  const normalized = normalizeHolidaySearchText(value);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}

function buildSearchDocument(raw) {
  const country = getCountryByCode(raw.__aliasCountryCode || raw._countryCode || null);
  const displayName = raw.__isAlias && country?.nameAr
    ? `${raw.name} في ${country.nameAr}`
    : raw.name;
  const keywords = Array.isArray(raw.keywords) ? raw.keywords : [];
  const preferredFields = [
    displayName,
    raw.name,
    raw.seoTitle,
    country?.nameAr,
    String(raw.slug || '').replace(/-/g, ' '),
  ]
    .map(normalizeHolidaySearchText)
    .filter(Boolean);
  const supportingFields = [
    raw.description,
    raw.seoTitle,
    ...keywords,
    country?.nameAr,
    String(raw.slug || '').replace(/-/g, ' '),
  ]
    .map(normalizeHolidaySearchText)
    .filter(Boolean);

  return {
    displayName: normalizeHolidaySearchText(displayName),
    preferredFields: Array.from(new Set(preferredFields)),
    supportingFields: Array.from(new Set(supportingFields)),
  };
}

export function scoreHolidaySearchMatch(raw, query) {
  const normalizedQuery = normalizeHolidaySearchText(query);
  if (!normalizedQuery) return 0;

  const queryTokens = tokenizeHolidaySearchText(normalizedQuery);
  const document = buildSearchDocument(raw);
  const exactFields = document.preferredFields;
  const allFields = [...document.preferredFields, ...document.supportingFields];

  if (exactFields.includes(normalizedQuery)) return 1400;

  let bestScore = 0;
  let matched = false;

  for (const field of allFields) {
    if (!field) continue;
    if (field.startsWith(normalizedQuery)) {
      matched = true;
      bestScore = Math.max(bestScore, field === document.displayName ? 1200 : 1050);
      continue;
    }
    if (field.includes(normalizedQuery)) {
      matched = true;
      bestScore = Math.max(bestScore, field === document.displayName ? 950 : 820);
    }
  }

  if (!queryTokens.length) {
    return matched ? bestScore : 0;
  }

  for (const field of allFields) {
    if (!field) continue;
    const fieldTokens = field.split(' ').filter(Boolean);
    if (!fieldTokens.length) continue;

    const sharedTokens = queryTokens.reduce(
      (count, token) => count + Number(fieldTokens.some((fieldToken) => fieldToken.includes(token))),
      0,
    );
    if (!sharedTokens) continue;

    matched = true;
    const tokenCoverage = sharedTokens / queryTokens.length;
    const tokenScore = Math.round(tokenCoverage * 520) + (sharedTokens * 80);
    bestScore = Math.max(bestScore, tokenScore);
  }

  return matched ? bestScore : 0;
}

export function compareHolidayEventsByTargetDate(left, right, targetTimeBySlug) {
  const leftTarget = targetTimeBySlug.get(left.slug) || Number.MAX_SAFE_INTEGER;
  const rightTarget = targetTimeBySlug.get(right.slug) || Number.MAX_SAFE_INTEGER;
  if (leftTarget !== rightTarget) return leftTarget - rightTarget;
  return String(left.name || '').localeCompare(String(right.name || ''), 'ar');
}
