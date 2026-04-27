function normalizeTerm(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function uniqTerms(values) {
  return Array.from(new Set(values.map(normalizeTerm).filter(Boolean)));
}

function pickQuestions(items = []) {
  return items.map((item) => item?.question).filter(Boolean);
}

function buildCluster(title, items, limit = 6) {
  const normalizedItems = uniqTerms(items).slice(0, limit);
  if (!normalizedItems.length) return null;

  return {
    title,
    items: normalizedItems,
  };
}

/**
 * @param {{
 *   title?: string;
 *   keywords?: string[];
 *   faqItems?: Array<{question?: string}>;
 *   quickAnswers?: Array<{question?: string}>;
 *   searchProfile?: {
 *     priorityQueries?: string[];
 *     questionQueries?: string[];
 *     comparisonQueries?: string[];
 *     regionalQueries?: string[];
 *     temporalQueries?: string[];
 *     schemaAbout?: string[];
 *   };
 *   maxMetadataKeywords?: number;
 *   maxIntentChips?: number;
 *   maxSchemaAbout?: number;
 * }} input
 */
export function buildPrincipalPageSearchCoverage({
  title = '',
  keywords = [],
  faqItems = [],
  quickAnswers = [],
  searchProfile = {},
  maxMetadataKeywords = 48,
  maxIntentChips = 24,
  maxSchemaAbout = 12,
} = {}) {
  const priorityQueries = uniqTerms(searchProfile.priorityQueries || []);
  const questionQueries = uniqTerms([
    ...(searchProfile.questionQueries || []),
    ...pickQuestions(quickAnswers),
    ...pickQuestions(faqItems),
  ]);
  const comparisonQueries = uniqTerms(searchProfile.comparisonQueries || []);
  const regionalQueries = uniqTerms(searchProfile.regionalQueries || []);
  const temporalQueries = uniqTerms(searchProfile.temporalQueries || []);
  const baseKeywords = uniqTerms([title, ...keywords]);
  const metadataKeywords = uniqTerms([
    ...priorityQueries,
    ...baseKeywords,
    ...questionQueries,
    ...comparisonQueries,
    ...regionalQueries,
    ...temporalQueries,
  ]).slice(0, maxMetadataKeywords);
  const intentChips = uniqTerms([
    ...priorityQueries,
    ...questionQueries,
    ...comparisonQueries,
    ...regionalQueries,
    ...temporalQueries,
    ...keywords,
  ]).slice(0, maxIntentChips);
  const schemaAbout = uniqTerms([
    ...(searchProfile.schemaAbout || []),
    ...priorityQueries,
    ...comparisonQueries,
    ...baseKeywords,
  ]).slice(0, maxSchemaAbout);
  const queryClusters = [
    buildCluster('العبارات الأساسية', priorityQueries),
    buildCluster('أسئلة مباشرة', questionQueries),
    buildCluster('صيغ المقارنة والقرار', comparisonQueries),
    buildCluster('صيغ محلية وزمنية', [...regionalQueries, ...temporalQueries]),
  ].filter(Boolean);

  return {
    metadataKeywords,
    intentChips,
    schemaAbout,
    queryClusters,
  };
}
