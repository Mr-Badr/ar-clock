/**
 * SectionUseCases — 6 use-case cards
 *
 * Purpose: answers the implicit question "why do I need this tool?"
 * Converting casual visitors into engaged users by showing relatable scenarios.
 *
 * SEO value:
 *   - Covers long-tail queries about specific use-cases
 *   - "أفضل وقت للاجتماع" / "توقيت الرحلات" / "مكالمة مع الخارج"
 *   - Natural Arabic prose with keyword-rich card bodies
 *
 * Design: 1→2→3 col grid, each card with colored icon + h3 + prose.
 */

import { SectionWrapper, SectionBadge } from '@/components/shared/primitives'
import { USE_CASES }                     from './data/useCases'
import { Users }                         from 'lucide-react'

const H2_ID = 'h2-use-cases'

export default function SectionUseCases() {
  return (
    <SectionWrapper id="section-use-cases" headingId={H2_ID} subtle>

      {/* Header */}
      <header className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="flex justify-center">
          <SectionBadge><Users size={11} />من يستخدم الأداة؟</SectionBadge>
        </div>
        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          لماذا تحتاج إلى
          <span
            style={{
              background:           'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            {' '}حاسبة فرق التوقيت؟
          </span>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed mx-auto" style={{ color: 'var(--text-secondary)' }}>
          سواء كنت مسافراً أو رجل أعمال أو مغترباً أو تريد مشاهدة مباراة مباشرة —
          معرفة <strong style={{ color: 'var(--text-primary)' }}>فرق التوقيت الدقيق</strong> يوفّر
          عليك الحرج ويمنع الفوضى في المواعيد
        </p>
      </header>

      {/* Cards grid */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        role="list"
        aria-label="حالات استخدام أداة فرق التوقيت"
      >
        {USE_CASES.map((uc) => (
          <li
            key={uc.title}
            className="rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-surface-1)',
              border:     '1px solid var(--border-subtle)',
              boxShadow:  'var(--shadow-sm)',
            }}
          >
            {/* Icon */}
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: uc.softBg }}
              aria-hidden="true"
            >
              <uc.icon size={20} style={{ color: uc.color }} />
            </div>

            {/* Heading — h3 for keyword-rich heading structure */}
            <h3
              className="text-base font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {uc.title}
            </h3>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {uc.body}
            </p>
          </li>
        ))}
      </ul>

    </SectionWrapper>
  )
}
