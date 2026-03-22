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

import { ISLAMIC_CONTENT }        from './islamic.js'
import { SEASONAL_CONTENT }       from './seasonal.js'
import { SA_CONTENT }             from './countries/sa.js'
import { EG_CONTENT }             from './countries/eg.js'
import { DZ_CONTENT }             from './countries/dz.js'
import { MA_CONTENT }             from './countries/ma.js'
import { AE_CONTENT }             from './countries/ae.js'
import { TN_CONTENT }             from './countries/tn.js'
import { KW_CONTENT }             from './countries/kw.js'
import { QA_CONTENT }             from './countries/qa.js'
import { SHARED_CONTENT }         from './countries/shared.js'

/** Fields owned by holidays-engine.js — never override */
const PROTECTED_FIELDS = new Set([
  'category', '_countryCode', 'type', 'slug', 'id',
  'hijriMonth', 'hijriDay', 'month', 'day', 'date', '__enriched',
])

const ALL_RICH_CONTENT = {
  ...ISLAMIC_CONTENT,
  ...SEASONAL_CONTENT,
  ...SA_CONTENT,
  ...EG_CONTENT,
  ...DZ_CONTENT,
  ...MA_CONTENT,
  ...AE_CONTENT,
  ...TN_CONTENT,
  ...KW_CONTENT,
  ...QA_CONTENT,
  ...SHARED_CONTENT,
}

/**
 * getRichContent(slug)
 * Returns rich content for a slug, with protected fields stripped.
 * Always safe to spread over enrichEvent() output.
 */
export function getRichContent(slug) {
  const raw = ALL_RICH_CONTENT[slug]
  if (!raw) return {}

  const safe = { ...raw }
  for (const field of PROTECTED_FIELDS) {
    delete safe[field]
  }
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
