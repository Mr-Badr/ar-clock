import { z } from 'zod';
import { buildCompiledFaqContent } from '@/lib/holidays/faq-normalizer';

const faqItemSchema = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  q: z.string().min(1).optional(),
  a: z.string().min(1).optional(),
});

const quickFactSchema = z.union([
  z.object({
    label: z.string().min(1),
    value: z.string().optional(),
    _dynamic: z.string().optional(),
  }),
  z.object({
    label: z.string().min(1),
    value: z.number(),
  }),
]);

const richContentSchema = z
  .object({
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    answerSummary: z.string().optional(),
    quickFacts: z.union([z.record(z.string(), z.string()), z.array(quickFactSchema)]).optional(),
    about: z
      .object({
        heading: z.string().optional(),
        paragraphs: z.array(z.string()).optional(),
      })
      .optional(),
    aboutEvent: z.record(z.string(), z.string()).optional(),
    faq: z.array(faqItemSchema).optional(),
    faqItems: z.array(faqItemSchema).optional(),
    intentCards: z.array(z.record(z.string(), z.any())).optional(),
    engagementContent: z.array(z.record(z.string(), z.any())).optional(),
    seoMeta: z.record(z.string(), z.any()).optional(),
    recurringYears: z.record(z.string(), z.any()).optional(),
    schemaData: z.record(z.string(), z.any()).optional(),
    relatedSlugs: z.array(z.string()).optional(),
  })
  .passthrough();

const CURRENT_YEAR = new Date().getUTCFullYear();
const LIKELY_DYNAMIC_YEAR_RE = /\b20\d{2}\b/g;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
const URL_RE = /^https?:\/\//i;
const META_DATE_KEYS = new Set(['datePublished', 'dateModified', 'updatedAt', 'generatedAt', 'lastModified']);

function normalizeFaq(content) {
  return buildCompiledFaqContent(content);
}

function hasHardcodedYear(content) {
  const stack = [{ key: '', value: content }];
  while (stack.length) {
    const next = stack.pop();
    if (!next) continue;
    if (
      typeof next.value === 'string' &&
      !next.value.includes('{{year}}') &&
      !next.value.includes('{{nextYear}}') &&
      !ISO_DATE_RE.test(next.value) &&
      !URL_RE.test(next.value) &&
      !META_DATE_KEYS.has(next.key)
    ) {
      const matches = next.value.match(LIKELY_DYNAMIC_YEAR_RE) || [];
      const hasLikelyDynamicYear = matches.some((match) => Number(match) >= CURRENT_YEAR - 1);
      if (hasLikelyDynamicYear) return true;
    }
    if (Array.isArray(next.value)) {
      for (const item of next.value) stack.push({ key: next.key, value: item });
      continue;
    }
    if (typeof next.value === 'object') {
      for (const [key, value] of Object.entries(next.value)) stack.push({ key, value });
    }
  }
  return false;
}

export function parseRichContent(slug, raw) {
  const parsed = richContentSchema.safeParse(raw || {});
  if (!parsed.success) {
    console.warn(`[event-content] invalid content schema for "${slug}"`, parsed.error.flatten().fieldErrors);
    return { content: {}, flags: { hasHardcodedYear: false, isValid: false } };
  }

  const normalized = normalizeFaq(parsed.data);
  return {
    content: normalized,
    flags: {
      hasHardcodedYear: hasHardcodedYear(normalized),
      isValid: true,
    },
  };
}
