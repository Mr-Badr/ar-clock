/**
 * data/islamicOccasions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Sources from lib/holidays-engine.js RELIGIOUS_HOLIDAYS.
 *
 * NUMERAL RULE (per hijri-utils.js):
 *   All numbers → English (Western) digits: 1 2 3 …
 *   All month/day names → Arabic text: رمضان شوال …
 *
 * WHAT WE GAIN vs the old static file:
 *   ✅ quickFacts already have English numerals (engine uses nu-latn internally)
 *   ✅ 20+ keywords per event (engine-optimised, year-injected)
 *   ✅ 4–8 FAQ items per event (featured-snippet optimised)
 *   ✅ countryDates for 3 main events (country-specific query targets)
 *   ✅ history + significance for rich content sections
 *   ✅ replaceYears() will keep dates fresh automatically at render time
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { RELIGIOUS_HOLIDAYS, HIJRI_MONTHS_AR } from '@/lib/holidays-engine'

/* ── Visual config (id → icon / color / badge) ─────────────────────────────── */
const ICONS = {
  ramadan:            '🌙',
  'eid-al-fitr':      '🎉',
  'eid-al-adha':      '🐑',
  'laylat-al-qadr':   '⭐',
  'isra-miraj':       '🕌',
  mawlid:             '🌹',
  ashura:             '📅',
  'day-of-arafa':     '🕋',
  'hajj-start':       '🏔',
  'islamic-new-year': '🗓',
  'nisf-shaban':      '✨',
  'first-dhul-hijjah':'📿',
}

const COLORS = {
  ramadan:            'var(--warning)',
  'eid-al-fitr':      'var(--success)',
  'eid-al-adha':      'var(--success)',
  'laylat-al-qadr':   'var(--accent-alt)',
  'isra-miraj':       'var(--info)',
  mawlid:             'var(--warning)',
  ashura:             'var(--danger)',
  'day-of-arafa':     'var(--accent-alt)',
  'hajj-start':       'var(--info)',
  'islamic-new-year': 'var(--accent-alt)',
  'nisf-shaban':      'var(--accent-alt)',
  'first-dhul-hijjah':'var(--warning)',
}

const BADGES = {
  ramadan:            'صيام',
  'eid-al-fitr':      'عيد',
  'eid-al-adha':      'عيد',
  'laylat-al-qadr':   'روحاني',
  'isra-miraj':       'ديني',
  mawlid:             'ديني',
  ashura:             'هجري',
  'day-of-arafa':     'حج',
  'hajj-start':       'حج',
  'islamic-new-year': 'هجري',
  'nisf-shaban':      'ديني',
  'first-dhul-hijjah':'ديني',
}

/** Section 3 (SectionIslamicOccasions) shows 8 cards */
const FEATURED_IDS = [
  'ramadan',
  'eid-al-fitr',
  'eid-al-adha',
  'laylat-al-qadr',
  'isra-miraj',
  'mawlid',
  'ashura',
  'day-of-arafa',
]

/**
 * Build the hijriDate label with English numerals:
 * 1. Use quickFacts 'التاريخ الهجري' field — engine already formats it with nu-latn
 * 2. Fallback: compose from hijriDay (JS number = English) + Arabic month name
 */
function buildHijriDate(ev) {
  const qf = (ev.quickFacts || []).find(f => f.label === 'التاريخ الهجري')
  if (qf?.value) return qf.value          // e.g. "1 رمضان 1447 هـ"
  // Fallback — hijriDay is a JS number (English digit)
  const monthName = HIJRI_MONTHS_AR[ev.hijriMonth] || ''
  return ev.hijriDay ? `${ev.hijriDay} ${monthName}` : monthName
}

function buildDuration(ev) {
  return (ev.quickFacts || []).find(f => f.label === 'المدة')?.value || 'يوم واحد'
}

export const ISLAMIC_OCCASIONS = RELIGIOUS_HOLIDAYS
  .filter(ev => FEATURED_IDS.includes(ev.id))
  .sort((a, b) => FEATURED_IDS.indexOf(a.id) - FEATURED_IDS.indexOf(b.id))
  .map(ev => ({
    id:           ev.id,
    slug:         ev.slug,
    name:         ev.name,
    hijriDate:    buildHijriDate(ev),      // English numerals guaranteed
    duration:     buildDuration(ev),
    badge:        BADGES[ev.id]  || 'ديني',
    description:  ev.details    || ev.description,
    keywords:     ev.keywords   || [],
    color:        COLORS[ev.id] || 'var(--accent-alt)',
    icon:         ICONS[ev.id]  || '🌙',
    // Pass-through engine fields for richer downstream sections
    quickFacts:   ev.quickFacts   || [],
    faqItems:     ev.faqItems     || [],
    countryDates: ev.countryDates || [],
    history:      ev.history      || null,
    significance: ev.significance || null,
  }))
