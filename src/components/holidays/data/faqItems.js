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

import {
  ALL_EVENTS,
  formatGregorianAr,
  getNextEventDate,
  getTimeRemaining,
  replaceTokens,
  resolveEventMeta,
} from '@/lib/holidays-engine'
import { getRichContent } from '@/lib/event-content'
import { getCachedNowIso } from '@/lib/date-utils'
import { resolveAllHijriEvents } from '@/lib/hijri-resolver'

/**
 * Resolve an event by slug and pick its FAQ items.
 * Ensures the year is current/future.
 */
async function resolveAndPick(slug, nowMs, n = 2) {
  const evRaw = ALL_EVENTS.find(e => e.slug === slug)
  if (!evRaw) return []

  const rich = getRichContent(slug) || {}
  const ev = { ...evRaw, ...rich }
  const resolved = ev.type === 'hijri' ? await resolveAllHijriEvents([ev]) : {}
  const cal = resolved[ev.slug] || null

  // Resolve for next occurrence
  const nextDate = getNextEventDate(ev, resolved, nowMs)
  const meta = resolveEventMeta(
    ev,
    nextDate,
    ev.type === 'hijri' && cal?.hijriYear ? cal.hijriYear : null,
  )
  const remaining = getTimeRemaining(nextDate, nowMs)
  const tokenContext = {
    ...ev,
    ...meta,
    eventName: ev.name,
    formattedDate: formatGregorianAr(nextDate),
    daysRemaining: remaining.days,
  }

  return (meta.faqItems || []).slice(0, n).map((item) => ({
    q: replaceTokens(item.q || item.question || '', tokenContext),
    a: replaceTokens(item.a || item.answer || '', tokenContext),
  }))
}

/**
 * getFaqItems
 * Aggregated from major Islamic, National, School, and Salary events.
 */
export async function getFaqItems() {
  const nowIso = await getCachedNowIso()
  const nowMs = new Date(nowIso).getTime()

  const groups = await Promise.all([
    // ── Islamic ──
    resolveAndPick('ramadan', nowMs, 2),
    resolveAndPick('eid-al-fitr', nowMs, 2),
    resolveAndPick('eid-al-adha', nowMs, 2),
    resolveAndPick('day-of-arafa', nowMs, 1),
    resolveAndPick('ashura', nowMs, 1),

    // ── National & Seasonal ──
    resolveAndPick('saudi-national-day', nowMs, 1),
    resolveAndPick('new-year', nowMs, 1),

    // ── School ──
    resolveAndPick('school-start-saudi', nowMs, 1),
    resolveAndPick('back-to-school', nowMs, 1),

    // ── Business / Salary ──
    resolveAndPick('salary-day-saudi', nowMs, 1),
    resolveAndPick('salary-day-egypt', nowMs, 1),

    // ── Support ──
    resolveAndPick('citizen-account-sa', nowMs, 1),
    resolveAndPick('social-security-sa', nowMs, 1),
  ])

  return groups.flat()
}

// [HMR] trigger reload
