function toText(value) {
  return typeof value === 'string' ? value.trim() : String(value || '').trim();
}

function normalizeFaqEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const question = toText(entry.question || entry.q);
  const answer = toText(entry.answer || entry.a);
  if (!question || !answer) return null;
  return { question, answer };
}

export function normalizeFaqEntries(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map(normalizeFaqEntry).filter(Boolean);
}

export function pickFaqEntries(content = {}) {
  const sources = [
    content?.faq,
    content?.faqItems,
    content?.schemaData?.faqSchemaItems,
  ];

  for (const source of sources) {
    const normalized = normalizeFaqEntries(source);
    if (normalized.length > 0) return normalized;
  }

  return [];
}

export function buildFaqItems(entries) {
  return normalizeFaqEntries(entries).map(({ question, answer }) => ({
    q: question,
    a: answer,
  }));
}

export function buildFaqSchemaItems(entries) {
  return normalizeFaqEntries(entries).map(({ question, answer }) => ({
    question,
    answer,
  }));
}

export function buildAuthoringFaqContent(content = {}) {
  const faq = pickFaqEntries(content);
  const next = { ...content };

  if (faq.length > 0) {
    next.faq = faq;
  } else {
    delete next.faq;
  }

  delete next.faqItems;

  if (next.schemaData && typeof next.schemaData === 'object' && !Array.isArray(next.schemaData)) {
    const { faqSchemaItems, ...rest } = next.schemaData;
    if (Object.keys(rest).length > 0) {
      next.schemaData = rest;
    } else {
      delete next.schemaData;
    }
  }

  return next;
}

export function buildCompiledFaqContent(content = {}) {
  const faq = pickFaqEntries(content);
  if (faq.length === 0) return { ...content };

  return {
    ...content,
    faq,
    faqItems: buildFaqItems(faq),
    schemaData: {
      ...(content?.schemaData && typeof content.schemaData === 'object' && !Array.isArray(content.schemaData)
        ? content.schemaData
        : {}),
      faqSchemaItems: buildFaqSchemaItems(faq),
    },
  };
}
