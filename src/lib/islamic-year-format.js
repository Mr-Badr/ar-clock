function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatIslamicYearPair(year = '{{year}}', hijriYear = '{{hijriYear}}') {
  return `${year} - ${hijriYear} هـ`;
}

export function ensureIslamicYearPair(
  value,
  {
    year = '{{year}}',
    hijriYear = '{{hijriYear}}',
    eventName = '',
  } = {},
) {
  if (typeof value !== 'string' || !value.trim()) return value;

  const label = formatIslamicYearPair(year, hijriYear);
  let next = value;

  const pairPatterns = [
    new RegExp(
      `${escapeRegExp(year)}\\s*(?:-|–|—|/)\\s*${escapeRegExp(hijriYear)}(?:\\s*هـ)?`,
      'g',
    ),
    new RegExp(
      `${escapeRegExp(year)}\\s*\\(\\s*${escapeRegExp(hijriYear)}(?:\\s*هـ)?\\s*\\)`,
      'g',
    ),
  ];

  for (const pattern of pairPatterns) {
    next = next.replace(pattern, label);
  }

  if (next.includes(label)) return next;

  if (next.includes(year)) {
    return next.replace(year, label);
  }

  if (eventName && next.includes(eventName)) {
    return next.replace(eventName, `${eventName} ${label}`);
  }

  return `${label} ${next}`.trim();
}

export function normalizeIslamicRichContentYears(
  richContent,
  {
    year = '{{year}}',
    hijriYear = '{{hijriYear}}',
    eventName = '',
  } = {},
) {
  if (!richContent || typeof richContent !== 'object') return richContent;

  const next = {
    ...richContent,
    seoTitle: ensureIslamicYearPair(richContent.seoTitle, { year, hijriYear, eventName }),
    description: ensureIslamicYearPair(richContent.description, { year, hijriYear, eventName }),
  };

  if (richContent.seoMeta && typeof richContent.seoMeta === 'object') {
    next.seoMeta = {
      ...richContent.seoMeta,
      titleTag: ensureIslamicYearPair(richContent.seoMeta.titleTag, { year, hijriYear, eventName }),
      metaDescription: ensureIslamicYearPair(richContent.seoMeta.metaDescription, {
        year,
        hijriYear,
        eventName,
      }),
      h1: ensureIslamicYearPair(richContent.seoMeta.h1, { year, hijriYear, eventName }),
      ogTitle: ensureIslamicYearPair(richContent.seoMeta.ogTitle, { year, hijriYear, eventName }),
      ogDescription: ensureIslamicYearPair(richContent.seoMeta.ogDescription, {
        year,
        hijriYear,
        eventName,
      }),
    };
  }

  if (richContent.schemaData && typeof richContent.schemaData === 'object') {
    next.schemaData = {
      ...richContent.schemaData,
      eventName: ensureIslamicYearPair(richContent.schemaData.eventName, { year, hijriYear, eventName }),
      eventDescription: ensureIslamicYearPair(richContent.schemaData.eventDescription, {
        year,
        hijriYear,
        eventName,
      }),
      articleHeadline: ensureIslamicYearPair(richContent.schemaData.articleHeadline, {
        year,
        hijriYear,
        eventName,
      }),
    };
  }

  return next;
}
