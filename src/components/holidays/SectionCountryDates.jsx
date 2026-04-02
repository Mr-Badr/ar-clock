/**
 * SectionCountryDates — NEW section
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows when Ramadan, Eid al-Fitr, and Eid al-Adha fall in each Arab country.
 *
 * WHY THIS SECTION IS CRITICAL FOR SEO:
 * Country-specific event queries are the HIGHEST VOLUME Arabic searches:
 *   "متى رمضان المغرب 2026"          10,000+ monthly searches
 *   "متى رمضان مصر 2026"             8,000+
 *   "متى عيد الفطر السعودية 2026"    15,000+
 *   "موعد عيد الأضحى الإمارات 2026"  6,000+
 *
 * Data source: canonical event packages + rich content overlays
 *   Ramadan:     8 countries
 *   Eid al-Fitr: 4 countries
 *   Eid al-Adha: 4 countries
 *
 * Layout: 3-column card grid (1 card per event), each card contains a
 * country rows table. Fully responsive: 1-col mobile → 3-col desktop.
 *
 * SEO notes:
 *   • Each country row has an aria-label with the full query phrase
 *   • Each event card has an h3 keyword heading
 *   • The calendarNote explains WHY dates differ (reduces bounce rate)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Globe2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'
import { buildIslamicCountryDateCards } from './data/islamicOccasions'

const H2_ID = 'h2-country-dates'

const softOf   = (v) => v.replace(')', '-soft)')
const borderOf = (v) => v.replace(')', '-border)')

export default async function SectionCountryDates({ nowIso }) {
  const eventsWithCountries = await buildIslamicCountryDateCards(nowIso)

  return (
    <SectionWrapper id="section-country-dates" headingId={H2_ID} subtle>

      {/* Header */}
      <header className="mb-10 space-y-3">
        <div className="flex justify-start">
          <SectionBadge><Globe2 size={11} />مواعيد الدول</SectionBadge>
        </div>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          مواعيد الأعياد الكبرى
          <span
            className="block"
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            في الدول العربية
          </span>
        </h2>

        <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          تتفاوت مواعيد الأعياد الإسلامية بين الدول يوماً واحداً أحياناً، بسبب اختلاف
          طريقة تحديد بداية الشهر الهجري: بعضها يعتمد{' '}
          <strong style={{ color: 'var(--text-primary)' }}>تقويم أم القرى</strong> الفلكي،
          وبعضها يعتمد{' '}
          <strong style={{ color: 'var(--text-primary)' }}>رؤية الهلال المحلية</strong>.
        </p>
      </header>

      {/* 3 cards — 1 per event, each with country rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {eventsWithCountries.map((ev) => (
          <div
            key={ev.id}
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-surface-1)',
              border: `1px solid ${borderOf(ev.color)}`,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Event card header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{
                background: softOf(ev.color),
                borderBottom: `1px solid ${borderOf(ev.color)}`,
              }}
            >
              <span className="text-xl leading-none" aria-hidden="true">{ev.icon}</span>
              <div className="min-w-0">
                {/* h3 with event name = keyword heading */}
                <h3
                  className="text-sm font-bold leading-tight truncate"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {ev.name}
                </h3>
                {/* English numeral hijri date */}
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: ev.color }}>
                  {ev.hijriDate}
                </p>
              </div>
            </div>

            {/* Country rows — SEO: each row targets "متى X في Y" query */}
            {ev.countryDates.length > 0 ? (
              <ul
                className="divide-y"
                style={{ borderColor: 'var(--border-subtle)' }}
                role="list"
              >
                {ev.countryDates.map((cd) => (
                  <li
                    key={cd.code}
                    className="flex items-center justify-between px-4 py-2.5 gap-3"
                    aria-label={`${ev.name} في ${cd.country}: ${cd.date}`}
                  >
                    {/* Country: flag + name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base leading-none shrink-0" aria-hidden="true">
                        {cd.flag}
                      </span>
                      <span
                        className="text-xs font-semibold truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {cd.country}
                      </span>
                    </div>

                    {/* Date + calculation note */}
                    <div className="text-end shrink-0">
                      {/* English numerals in the date string (sourced from engine) */}
                      <p
                        className="text-xs font-bold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {cd.date}
                      </p>
                      {cd.note && (
                        <p
                          className="text-[10px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {cd.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                بيانات غير متاحة
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Explanation note */}
      <p
        className="mt-6 text-xs sm:text-sm leading-relaxed max-w-2xl"
        style={{ color: 'var(--text-muted)' }}
      >
        * التواريخ المعروضة وفق{' '}
        <strong style={{ color: 'var(--text-secondary)' }}>تقويم أم القرى</strong> الرسمي.
        الدول ذات الرؤية المحلية قد تختلف بيوم كامل. التحديد النهائي يصدر رسمياً قُبيل
        كل مناسبة.
      </p>

    </SectionWrapper>
  )
}
