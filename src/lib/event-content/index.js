/**
 * lib/event-content/index.js
 * ─────────────────────────────────────────────────────────────────────────
 * Content layer router — maps event slugs to rich content objects.
 *
 * DESIGN CONTRACT:
 *   - getRichContent(slug) returns {} for unknown slugs (safe default)
 *   - The returned object NEVER contains filter-critical fields
 *   - Spreading the result over enrichEvent() output is always safe
 *
 * PROTECTED FIELDS (stripped automatically before return):
 *   category, _countryCode, type, slug, id,
 *   hijriMonth, hijriDay, month, day, date, __enriched
 * ─────────────────────────────────────────────────────────────────────────
 */

import { parseRichContent }       from './schema.js'
import { GENERATED_CONTENT_BY_SLUG } from './generated-index.js'
import { featureFlags }           from '@/lib/feature-flags'
import { resolveEventSlug }       from '@/lib/events'
import LEGACY_RICH_CONTENT from '@/data/holidays/legacy-content/content-map.json';

/** Fields owned by holidays-engine.js — never override */
const PROTECTED_FIELDS = new Set([
  'category', '_countryCode', 'type', 'slug', 'id',
  'hijriMonth', 'hijriDay', 'month', 'day', 'date', '__enriched',
])

const hasGeneratedContent =
  GENERATED_CONTENT_BY_SLUG &&
  typeof GENERATED_CONTENT_BY_SLUG === 'object' &&
  Object.keys(GENERATED_CONTENT_BY_SLUG).length > 0;

const ACTIVE_RICH_CONTENT =
  featureFlags.eventsShardIndex && hasGeneratedContent
    ? GENERATED_CONTENT_BY_SLUG
    : LEGACY_RICH_CONTENT;

const OVERLAY_FIELDS = new Set([
  'seoTitle',
  'description',
  'keywords',
  'quickFacts',
  'countryDates',
  'sources',
  'seoMeta',
]);

function mergeKeywords(baseKeywords, overlayKeywords) {
  const merged = [
    ...(Array.isArray(baseKeywords) ? baseKeywords : []),
    ...(Array.isArray(overlayKeywords) ? overlayKeywords : []),
  ].map((value) => String(value || '').trim()).filter(Boolean);
  return Array.from(new Set(merged));
}

function applyCountryOverlay(content, countryCode) {
  if (!countryCode) return content;
  const variant = content?.countrySeoVariants?.[countryCode];
  const overlay = content?.countryOverrides?.[countryCode];
  if (!variant && (!overlay || typeof overlay !== 'object')) return content;

  const merged = { ...content };

  if (variant && typeof variant === 'object') {
    if (variant.seoTitle) merged.seoTitle = variant.seoTitle;
    if (variant.description) merged.description = variant.description;
    if (variant.keywords) merged.keywords = mergeKeywords(merged.keywords, variant.keywords);
    if (variant.seoMeta && typeof variant.seoMeta === 'object') {
      merged.seoMeta = {
        ...(merged.seoMeta || {}),
        ...variant.seoMeta,
      };
    }
    if (variant.quickFacts && !overlay?.quickFacts) {
      merged.quickFacts = variant.quickFacts;
    }
  }

  if (overlay && typeof overlay === 'object') {
    for (const key of Object.keys(overlay)) {
      if (!OVERLAY_FIELDS.has(key)) continue;
      if (key === 'keywords') {
        merged.keywords = mergeKeywords(merged.keywords, overlay[key]);
      } else if (key === 'seoMeta' && overlay[key] && typeof overlay[key] === 'object') {
        merged.seoMeta = {
          ...(merged.seoMeta || {}),
          ...overlay[key],
        };
      } else {
        merged[key] = overlay[key];
      }
    }
  }
  return merged;
}

/**
 * getRichContent(slug)
 * Returns rich content for a slug, with protected fields stripped.
 * Always safe to spread over enrichEvent() output.
 */
export function getRichContent(slug) {
  const resolved = resolveEventSlug(slug);
  const canonicalSlug = resolved?.canonicalSlug || slug;
  const raw = ACTIVE_RICH_CONTENT[canonicalSlug]
  if (!raw) return {}

  const parsed = featureFlags.holidaysNewContentResolver
    ? parseRichContent(slug, raw)
    : { content: raw, flags: { hasHardcodedYear: false, isValid: true } };

  const withOverlay = applyCountryOverlay(parsed.content, resolved?.countryCode || null);
  const safe = { ...withOverlay, __contentFlags: parsed.flags }
  for (const field of PROTECTED_FIELDS) {
    delete safe[field]
  }
  delete safe.countryOverrides;
  delete safe.countrySeoVariants;
  return safe
}

/** Tier 1 — highest traffic, full rich content required */
export const TIER_1_SLUGS = [
  'ramadan', 'eid-al-fitr', 'eid-al-adha', 'hajj-season',
  'bac-results-algeria', 'thanaweya-results', 'day-of-arafa',
  'saudi-national-day', 'laylat-al-qadr', 'mawlid',
]

/** Tier 2 — medium traffic, enhanced content */
export const TIER_2_SLUGS = [
  'islamic-new-year', 'ashura', 'isra-miraj', 'nisf-shaban',
  'first-dhul-hijjah', 'bac-results-morocco', 'bac-results-tunisia',
  'bac-exams-algeria', 'thanaweya-exams', 'school-start-egypt',
  'school-start-algeria', 'school-start-morocco', 'kuwait-national-day',
  'uae-national-day', 'independence-day-algeria', 'revolution-day-algeria',
  'independence-day-morocco', 'throne-day-morocco', 'sham-nessim',
  'salary-day-egypt', 'salary-day-saudi', 'citizen-account-saudi',
  'new-year', 'ramadan-in-saudi', 'ramadan-in-morocco', 'ramadan-in-egypt',
]
