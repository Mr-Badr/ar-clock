/**
 * src/lib/events/index.js
 * Assembles and deduplicates ALL_RAW_EVENTS from all source files.
 * This is the raw source of truth for event definitions.
 */

import { RELIGIOUS_HOLIDAYS } from './islamic.js';
import { SEASONAL_EVENTS }  from './seasonal.js';
import { SA_EVENTS }         from './sa.js';
import { EG_EVENTS }         from './eg.js';
import { DZ_EVENTS }         from './dz.js';
import { MA_EVENTS }         from './ma.js';
import { AE_EVENTS }         from './ae.js';
import { TN_EVENTS }         from './tn.js';
import { KW_EVENTS }         from './kw.js';
import { QA_EVENTS }         from './qa.js';

const _seen = new Set();

/**
 * Deduplicate events by slug.
 * @param {Array} arr - Array of event objects
 * @param {string|null} countryCode - Optional country code to inject
 * @returns {Array} Deduplicated raw events
 */
function dedup(arr, countryCode = null) {
  return arr
    .map(e => (countryCode ? { ...e, _countryCode: countryCode } : e))
    .filter(e => {
      if (!e?.slug) { console.warn('[events/index] event missing slug', e); return false; }
      if (_seen.has(e.slug)) {
        console.warn(`[events/index] Duplicate slug skipped: ${e.slug}`);
        return false;
      }
      _seen.add(e.slug);
      return true;
    });
}

/**
 * ALL_RAW_EVENTS — flat, deduplicated array of all raw events.
 * Will be enriched by holidays-engine.js
 */
export const ALL_RAW_EVENTS = [
  ...dedup(RELIGIOUS_HOLIDAYS),
  ...dedup(SEASONAL_EVENTS),
  ...dedup(SA_EVENTS, 'sa'),
  ...dedup(EG_EVENTS, 'eg'),
  ...dedup(DZ_EVENTS, 'dz'),
  ...dedup(MA_EVENTS, 'ma'),
  ...dedup(AE_EVENTS, 'ae'),
  ...dedup(TN_EVENTS, 'tn'),
  ...dedup(KW_EVENTS, 'kw'),
  ...dedup(QA_EVENTS, 'qa'),
];
