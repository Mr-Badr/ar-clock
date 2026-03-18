/**
 * data/faqItems.js — holidays page FAQ
 * ─────────────────────────────────────────────────────────────────────────────
 * Aggregates the most SEO-valuable FAQ items from ALL_EVENTS.
 *
 * IMPROVED v3:
 *   1. Dynamically resolves each event to its NEXT occurrence using the engine.
 *   2. Replaces years automatically (e.g. "Ramadan 2026" -> "2027" if 2026 passed).
 *   3. Expands topics: Islamic, National, School, and Business (Salaries).
 */

import { ALL_EVENTS, getNextEventDate, resolveEventMeta } from '@/lib/holidays-engine'

/**
 * Resolve an event by slug and pick its FAQ items.
 * Ensures the year is current/future.
 */
function resolveAndPick(slug, n = 2) {
  const ev = ALL_EVENTS.find(e => e.slug === slug)
  if (!ev) return []
  
  // Resolve for next occurrence
  const nextDate = getNextEventDate(ev)
  const meta = resolveEventMeta(ev, nextDate)
  
  return (meta.faqItems || []).slice(0, n)
}

/**
 * FAQ_ITEMS
 * Aggregated from major Islamic, National, School, and Salary events.
 */
export const FAQ_ITEMS = [
  // ── Islamic ──
  ...resolveAndPick('ramadan',          2),
  ...resolveAndPick('eid-al-fitr',      2),
  ...resolveAndPick('eid-al-adha',      2),
  ...resolveAndPick('day-of-arafa',     1),
  ...resolveAndPick('ashura',           1),
  
  // ── National & Seasonal ──
  ...resolveAndPick('saudi-national-day', 1),
  ...resolveAndPick('new-year',           1),
  
  // ── School ──
  ...resolveAndPick('school-start-saudi', 1),
  ...resolveAndPick('back-to-school',     1),
  
  // ── Business / Salary ──
  ...resolveAndPick('salary-day-saudi',   1),
  ...resolveAndPick('salary-day-egypt',   1),
  
  // ── Support ──
  ...resolveAndPick('citizen-account-sa', 1),
  ...resolveAndPick('social-security-sa', 1),
]
