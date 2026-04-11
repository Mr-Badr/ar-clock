import { z } from 'zod';

const publishStatusSchema = z.enum([
  'briefed',
  'drafted',
  'validated',
  'fact_checked',
  'editor_approved',
  'published',
  'monitored',
]);

const tierSchema = z.enum(['tier1', 'tier2', 'tier3']);
const countryScopeSchema = z.enum(['none', 'all', 'custom']);

const eventCoreSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(['hijri', 'fixed', 'estimated', 'monthly', 'easter', 'floating']),
  category: z.enum(['islamic', 'national', 'school', 'holidays', 'astronomy', 'business', 'support']),
  _countryCode: z.string().nullable().optional(),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  date: z.string().optional(),
  hijriMonth: z.number().int().min(1).max(12).optional(),
  hijriDay: z.number().int().min(1).max(30).optional(),
  weekday: z.number().int().min(0).max(6).optional(),
  nth: z.number().int().min(1).max(5).optional(),
  offsetDays: z.number().int().optional(),
}).passthrough();

const richContentSchema = z.object({}).passthrough();

const countryOverlaySchema = z
  .object({
    aliasSlugs: z.array(z.string().min(1)).optional(),
    seoTitle: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    quickFacts: z.union([z.record(z.string(), z.string()), z.array(z.any())]).optional(),
    countryDates: z.array(z.any()).optional(),
    sources: z.array(z.any()).optional(),
    seoMeta: z.record(z.string(), z.any()).optional(),
    notes: z.string().optional(),
  })
  .passthrough();

const keywordTemplateSetSchema = z.object({
  base: z.array(z.string()).default([]),
  country: z.array(z.string()).default([]),
}).optional();

export const eventPackageSchema = z.object({
  schemaVersion: z.number().int().default(1),
  core: eventCoreSchema,
  richContent: richContentSchema.default({}),
  countryOverrides: z.record(z.string(), countryOverlaySchema).default({}),
  aliasSlugs: z.array(z.string().min(1)).default([]),
  countryScope: countryScopeSchema.default('custom'),
  countryAliasTemplate: z.string().default('{{slug}}-in-{{countrySlug}}'),
  keywordTemplateSet: keywordTemplateSetSchema,
  tier: tierSchema.default('tier3'),
  publishStatus: publishStatusSchema.default('drafted'),
  canonicalPath: z.string().optional(),
  canonicalSource: z.string().default('internal'),
  sourceAuthority: z.string().optional(),
  queueOrder: z.number().int().positive().optional(),
  notes: z.string().optional(),
}).superRefine((value, ctx) => {
  if (value.core.slug && value.canonicalPath && value.canonicalPath !== `/holidays/${value.core.slug}`) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['canonicalPath'],
      message: `canonicalPath must be /holidays/${value.core.slug}`,
    });
  }
});

export function parseEventPackage(slug, raw) {
  const parsed = eventPackageSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`[event-package] Invalid package "${slug}": ${details}`);
  }
  return parsed.data;
}

export function inferSourceAuthority(core) {
  if (core?.type === 'hijri') return 'hijri-authority';
  if (core?.type === 'estimated') return 'official-announcement';
  if (core?.type === 'floating') return 'rule-based-calendar';
  return 'fixed-calendar';
}
