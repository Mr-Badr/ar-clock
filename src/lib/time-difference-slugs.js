const CITY_SLUG_ALIASES = {
  'united-states:new-york': 'new-york-city',
};

function normalizeSlugPart(value) {
  return String(value || '').trim().replace(/^-+|-+$/g, '');
}

function uniqueStrings(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function getTimeDifferenceCitySlugCandidates(countrySlug, citySlug) {
  const normalizedCountry = normalizeSlugPart(countrySlug);
  const normalizedCity = normalizeSlugPart(citySlug);

  if (!normalizedCountry || !normalizedCity) return [];

  return uniqueStrings([
    normalizedCity,
    CITY_SLUG_ALIASES[`${normalizedCountry}:${normalizedCity}`],
    normalizedCity.endsWith('-city')
      ? normalizedCity.replace(/-city$/, '')
      : `${normalizedCity}-city`,
  ]);
}
