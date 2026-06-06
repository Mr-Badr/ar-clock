function toText(value) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
}

function normalizeStringList(values, section, issueTracker) {
  if (values == null) {
    return [];
  }

  if (!Array.isArray(values)) {
    issueTracker.record(section);
    return [];
  }

  return values
    .map((value) => toText(value))
    .filter(Boolean);
}

function normalizeCollection(entries, section, normalizeEntry, issueTracker) {
  if (entries == null) {
    return [];
  }

  if (!Array.isArray(entries)) {
    issueTracker.record(section);
    return [];
  }

  const items = [];

  for (const entry of entries) {
    const normalizedEntry = normalizeEntry(entry);
    if (normalizedEntry) {
      items.push(normalizedEntry);
      continue;
    }

    issueTracker.record(section);
  }

  return items;
}

function normalizeQuickAnswer(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const question = toText(entry.question || entry.title);
  const answer = toText(entry.answer || entry.body || entry.description);
  const description = toText(entry.description);

  if (!question || !answer) {
    return null;
  }

  return {
    ...entry,
    question,
    answer,
    description,
  };
}

function normalizeStep(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const title = toText(entry.title);
  const description = toText(entry.description || entry.body);

  if (!title || !description) {
    return null;
  }

  return {
    ...entry,
    title,
    description,
  };
}

function normalizeInfoItem(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const title = toText(entry.title);
  const description = toText(entry.description);
  const content = toText(entry.content || entry.body);

  if (!title || !content) {
    return null;
  }

  return {
    ...entry,
    title,
    description,
    content,
  };
}

function normalizeSection(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const title = toText(entry.title);
  const description = toText(entry.description);
  const body = toText(entry.body || entry.answer || entry.content);

  if (!title || !body) {
    return null;
  }

  return {
    ...entry,
    title,
    description,
    body,
  };
}

function normalizeFaqItem(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const question = toText(entry.question || entry.q);
  const answer = toText(entry.answer || entry.a);

  if (!question || !answer) {
    return null;
  }

  return {
    question,
    answer,
  };
}

function normalizeChecklist(checklist, issueTracker) {
  if (checklist == null) {
    return null;
  }

  if (!checklist || typeof checklist !== 'object' || Array.isArray(checklist)) {
    issueTracker.record('checklist');
    return null;
  }

  const title = toText(checklist.title) || 'متى يفيدك هذا المقال؟';
  const description = toText(checklist.description);
  const items = normalizeStringList(checklist.items, 'checklistItems', issueTracker);

  if (!description && items.length === 0) {
    issueTracker.record('checklist');
    return null;
  }

  return {
    ...checklist,
    title,
    description,
    items,
  };
}

function normalizeComparisonRow(entry, expectedColumnsLength) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const label = toText(entry.label);
  const values = Array.isArray(entry.values)
    ? entry.values.map((value) => toText(value)).filter(Boolean)
    : [];

  if (!label || values.length === 0 || values.length !== expectedColumnsLength) {
    return null;
  }

  return {
    label,
    values,
  };
}

function normalizeComparison(comparison, issueTracker) {
  if (comparison == null) {
    return null;
  }

  if (!comparison || typeof comparison !== 'object' || Array.isArray(comparison)) {
    issueTracker.record('comparison');
    return null;
  }

  const title = toText(comparison.title);
  const description = toText(comparison.description);
  const columns = Array.isArray(comparison.columns)
    ? comparison.columns.map((value) => toText(value)).filter(Boolean)
    : [];

  if (!title || columns.length === 0) {
    issueTracker.record('comparison');
    return null;
  }

  const rows = normalizeCollection(
    comparison.rows,
    'comparisonRows',
    (entry) => normalizeComparisonRow(entry, columns.length),
    issueTracker,
  );

  if (rows.length === 0) {
    issueTracker.record('comparison');
    return null;
  }

  return {
    title,
    description,
    columns,
    rows,
  };
}

function normalizeRelatedPageLink(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const href = toText(entry.href);
  const title = toText(entry.title);
  const description = toText(entry.description);
  const ctaLabel = toText(entry.ctaLabel);

  if (!href || !title || !description) {
    return null;
  }

  return {
    ...entry,
    href,
    title,
    description,
    ctaLabel,
  };
}

function normalizeSourceLink(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const href = toText(entry.href);
  const label = toText(entry.label);
  const description = toText(entry.description);

  if (!href || !label || !description) {
    return null;
  }

  return {
    ...entry,
    href,
    label,
    description,
  };
}

function normalizeDateValue(value) {
  const normalizedValue = toText(value);

  if (!normalizedValue) {
    return '';
  }

  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString();
}

function createGuideIssueTracker() {
  const invalidSections = {};

  return {
    record(section) {
      const currentCount = invalidSections[section] || 0;
      invalidSections[section] = currentCount + 1;
    },
    build() {
      const issueEntries = Object.entries(invalidSections)
        .filter(([, count]) => count > 0)
        .map(([section, count]) => ({ section, count }));

      return {
        degraded: issueEntries.length > 0,
        invalidSections,
        issueEntries,
      };
    },
  };
}

export function normalizeGuideRecord(rawGuide) {
  const issueTracker = createGuideIssueTracker();

  const quickAnswers = normalizeCollection(rawGuide?.quickAnswers, 'quickAnswers', normalizeQuickAnswer, issueTracker);
  const steps = normalizeCollection(rawGuide?.steps, 'steps', normalizeStep, issueTracker);
  const infoItems = normalizeCollection(rawGuide?.infoItems, 'infoItems', normalizeInfoItem, issueTracker);
  const sections = normalizeCollection(rawGuide?.sections, 'sections', normalizeSection, issueTracker);
  const faqItems = normalizeCollection(rawGuide?.faqItems, 'faqItems', normalizeFaqItem, issueTracker);
  const checklist = normalizeChecklist(rawGuide?.checklist, issueTracker);
  const comparison = normalizeComparison(rawGuide?.comparison, issueTracker);
  const highlights = normalizeStringList(rawGuide?.highlights, 'highlights', issueTracker);
  const intentKeywords = normalizeStringList(rawGuide?.intentKeywords, 'intentKeywords', issueTracker);
  const keywords = normalizeStringList(rawGuide?.keywords, 'keywords', issueTracker);
  const relatedPageLinks = normalizeCollection(
    rawGuide?.relatedPageLinks,
    'relatedPageLinks',
    normalizeRelatedPageLink,
    issueTracker,
  );
  const sourceLinks = normalizeCollection(
    rawGuide?.sourceLinks,
    'sourceLinks',
    normalizeSourceLink,
    issueTracker,
  );
  const authorName = toText(rawGuide?.authorName);
  const authorRole = toText(rawGuide?.authorRole);
  const authorBio = toText(rawGuide?.authorBio);
  const reviewedBy = toText(rawGuide?.reviewedBy);
  const publishedAt = normalizeDateValue(rawGuide?.publishedAt);
  const updatedAt = normalizeDateValue(rawGuide?.updatedAt);

  if (rawGuide?.publishedAt && !publishedAt) {
    issueTracker.record('publishedAt');
  }

  if (rawGuide?.updatedAt && !updatedAt) {
    issueTracker.record('updatedAt');
  }

  const contentHealth = issueTracker.build();

  return {
    ...rawGuide,
    quickAnswers,
    steps,
    infoItems,
    sections,
    faqItems,
    checklist,
    comparison,
    highlights,
    intentKeywords,
    keywords,
    relatedPageLinks,
    sourceLinks,
    authorName,
    authorRole,
    authorBio,
    reviewedBy,
    publishedAt,
    updatedAt,
    contentHealth,
  };
}

export function normalizeGuideCollection(rawGuides) {
  if (!Array.isArray(rawGuides)) {
    return [];
  }

  return rawGuides
    .map((guide) => normalizeGuideRecord(guide))
    .filter((guide) => guide && guide.slug && guide.href && guide.title);
}
