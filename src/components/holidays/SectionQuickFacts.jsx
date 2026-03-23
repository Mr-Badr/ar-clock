/**
 * SectionQuickFacts — NEW section
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses three types of engine data that no competitor currently surfaces:
 *
 *   1. quickFacts[]      — structured facts table (Hijri date, Gregorian date,
 *                          duration, official holiday status, calculation method)
 *                          Source: holidays-engine.js RELIGIOUS_HOLIDAYS
 *
 *   2. history + significance — editorial depth content (E-E-A-T authority)
 *                          Only Ramadan and Eid al-Adha have this in the engine.
 *
 *   3. buildHistoricalDates() — 4-year historical dates table
 *                          Targets: "رمضان 2024 2025 2026 2027 موعد" queries
 *                          These compound year queries have significant volume
 *                          and zero competition from other Arabic sites.
 *
 * Layout: 2-column on md+ (facts table | history+significance)
 *         Full-width historical dates table below
 *
 * NUMERAL NOTE:
 *   quickFacts values from engine use nu-latn internally → English numerals ✓
 *   buildHistoricalDates returns strings like "2026م" and "1447 هـ" → English ✓
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Info } from 'lucide-react'
import { RELIGIOUS_HOLIDAYS, buildHistoricalDates, replaceTokens, approxHijriYear, HIJRI_MONTHS_AR, getNextEventDate } from '@/lib/holidays-engine'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'

const H2_ID = 'h2-quick-facts'

/* Pull the 3 events with quickFacts + history/significance data */
const RAM  = RELIGIOUS_HOLIDAYS.find(e => e.id === 'ramadan')
const FITR = RELIGIOUS_HOLIDAYS.find(e => e.id === 'eid-al-fitr')
const ADHA = RELIGIOUS_HOLIDAYS.find(e => e.id === 'eid-al-adha')

const resolveEvent = (ev) => {
  if (!ev) return null
  const gr = new Date().getFullYear();
  const hi = approxHijriYear(gr);
  return {
    ...ev,
    history: replaceTokens(ev.history || '', gr, hi),
    significance: replaceTokens(ev.significance || '', gr, hi),
    quickFacts: (ev.quickFacts || []).map(f => {
      let value = replaceTokens(f.value || '', gr, hi);
      if (f._dynamic === 'gregorian') {
        const d = getNextEventDate(ev);
        value = d ? d.toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      }
      if (f._dynamic === 'hijri') value = `${ev.hijriDay || 1} ${HIJRI_MONTHS_AR[ev.hijriMonth] || ''} ${hi} هـ`;
      return { label: replaceTokens(f.label || '', gr, hi), value };
    })
  }
}

const EVENTS_WITH_FACTS = [
  {
    ev:    resolveEvent(RAM),
    color: 'var(--warning)',
    icon:  '🌙',
  },
  {
    ev:    resolveEvent(ADHA),
    color: 'var(--success)',
    icon:  '🐑',
  },
].filter(item => item.ev?.quickFacts?.length)

const softOf   = (v) => v.replace(')', '-soft)')
const borderOf = (v) => v.replace(')', '-border)')

/** @param {{ nowIso?: string }} props */
export default function SectionQuickFacts({ nowIso }) {
  const nowDate = nowIso ? new Date(nowIso) : new Date()
  if (!EVENTS_WITH_FACTS.length) return null

  return (
    <SectionWrapper id="section-quick-facts" headingId={H2_ID}>
      {/* Glow */}
      <div
        className="pointer-events-none absolute top-0 end-0 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/4 rounded-full blur-3xl opacity-[0.06]"
        style={{ background: 'var(--warning)' }}
        aria-hidden="true"
      />

      {/* Header */}
      <header className="mb-10 space-y-3">
        <div className="flex justify-start">
          <SectionBadge><Info size={11} />معلومات سريعة</SectionBadge>
        </div>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          حقائق وتاريخ
          <span
            className="block"
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            الأعياد الإسلامية الكبرى
          </span>
        </h2>

        <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
          تواريخ دقيقة، حقائق مختصرة، وسياق تاريخي لأبرز المناسبات الإسلامية
        </p>
      </header>

      {/* Event cards */}
      <div className="space-y-8">
        {EVENTS_WITH_FACTS.map(({ ev, color, icon }) => {
          const historyTable = buildHistoricalDates(ev, nowDate)
          
          return (
            <div
              key={ev.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-surface-1)',
                border: `1px solid ${borderOf(color)}`,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Card header */}
              <div
                className="px-5 py-4 flex items-center gap-3"
                style={{
                  background: softOf(color),
                  borderBottom: `1px solid ${borderOf(color)}`,
                }}
              >
                <span className="text-2xl leading-none" aria-hidden="true">{icon}</span>
                <h3
                  className="text-base font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {ev.name}
                </h3>
              </div>

              <div className="p-5 grid md:grid-cols-2 gap-6">

                {/* ── Quick Facts table ── */}
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    معلومات أساسية
                  </p>
                  <dl className="space-y-2">
                    {(ev.quickFacts || []).map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-start justify-between gap-3 py-2 border-b last:border-0"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        <dt
                          className="text-xs font-semibold shrink-0"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {fact.label}
                        </dt>
                        <dd
                          className="text-xs font-bold text-end"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* ── History + Significance ── */}
                <div className="space-y-4">
                  {ev.history && (
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        من التاريخ
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {ev.history}
                      </p>
                    </div>
                  )}
                  {ev.significance && (
                    <div>
                      <p
                        className="text-xs font-bold uppercase tracking-wide mb-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        الأهمية والفضل
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {ev.significance}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Historical dates table ── */}
              {historyTable?.length > 0 && (
                <div className="px-5 pb-5">
                  <p
                    className="text-xs font-bold uppercase tracking-wide mb-3"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    مواعيد السنوات المتتالية
                  </p>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--info-border)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-3)' }}>
                          <th className="px-3 py-2 text-start font-semibold" style={{ color: 'var(--text-muted)' }}>السنة الميلادية</th>
                          <th className="px-3 py-2 text-start font-semibold" style={{ color: 'var(--text-muted)' }}>السنة الهجرية</th>
                          <th className="px-3 py-2 text-start font-semibold" style={{ color: 'var(--text-muted)' }}>ملاحظة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                        {historyTable.map((row, i) => (
                          <tr
                            key={i}
                            style={
                              row.current
                                ? {
                                    background: softOf(color),
                                    borderInlineStart: `2px solid ${color}`,
                                  }
                                : {}
                            }
                          >
                            <td
                              className="px-3 py-2.5 font-bold"
                              style={{ color: row.current ? color : 'var(--text-primary)' }}
                            >
                              {row.gregorian}
                            </td>
                            <td
                              className="px-3 py-2.5"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              {row.hijri || '—'}
                            </td>
                            <td
                              className="px-3 py-2.5"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {row.note}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
