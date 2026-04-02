export const CANONICAL_ALIAS_RULES = {
  ramadan: [
    { slug: 'ramadan-in-saudi', countryCode: 'sa' },
    { slug: 'ramadan-in-egypt', countryCode: 'eg' },
    { slug: 'ramadan-in-morocco', countryCode: 'ma' },
    { slug: 'ramadan-in-algeria', countryCode: 'dz' },
    { slug: 'ramadan-in-uae', countryCode: 'ae' },
    { slug: 'ramadan-in-tunisia', countryCode: 'tn' },
    { slug: 'ramadan-in-kuwait', countryCode: 'kw' },
    { slug: 'ramadan-in-qatar', countryCode: 'qa' },
  ],
  'eid-al-fitr': [
    { slug: 'eid-al-fitr-in-saudi', countryCode: 'sa' },
    { slug: 'eid-al-fitr-in-egypt', countryCode: 'eg' },
    { slug: 'eid-al-fitr-in-morocco', countryCode: 'ma' },
    { slug: 'eid-al-fitr-in-algeria', countryCode: 'dz' },
    { slug: 'eid-al-fitr-in-uae', countryCode: 'ae' },
    { slug: 'eid-al-fitr-in-tunisia', countryCode: 'tn' },
    { slug: 'eid-al-fitr-in-kuwait', countryCode: 'kw' },
    { slug: 'eid-al-fitr-in-qatar', countryCode: 'qa' },
  ],
  'eid-al-adha': [
    { slug: 'eid-al-adha-in-saudi', countryCode: 'sa' },
    { slug: 'eid-al-adha-in-egypt', countryCode: 'eg' },
    { slug: 'eid-al-adha-in-morocco', countryCode: 'ma' },
    { slug: 'eid-al-adha-in-algeria', countryCode: 'dz' },
    { slug: 'eid-al-adha-in-uae', countryCode: 'ae' },
    { slug: 'eid-al-adha-in-tunisia', countryCode: 'tn' },
    { slug: 'eid-al-adha-in-kuwait', countryCode: 'kw' },
    { slug: 'eid-al-adha-in-qatar', countryCode: 'qa' },
  ],
};

export const ALIAS_SLUG_SET = new Set(
  Object.values(CANONICAL_ALIAS_RULES).flat().map((entry) => entry.slug),
);
