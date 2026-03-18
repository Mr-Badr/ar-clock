/**
 * SectionWhyUs — Feature cards section
 * Six benefit cards in a responsive 1→2→3 column grid.
 * Includes a short SEO paragraph targeting long-tail queries.
 */

import { Star } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'
import { WHY_FEATURES } from './data/whyFeatures'

const H2_ID = 'h2-why-us'

export default function SectionWhyUs() {
  return (
    <SectionWrapper id="section-why-us" headingId={H2_ID} subtle>

      {/* Header */}
      <header className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="flex justify-center">
          <SectionBadge><Star size={11} />مزايا الموقع</SectionBadge>
        </div>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          بوابتك الأولى لكل ما يتعلق
          <span
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {' '}بالوقت والمواقيت
          </span>
        </h2>

        <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          موقع متخصص يجمع بين دقة العلم وسهولة الاستخدام، ليكون المرجع الأول لكل
          مسلم يبحث عن{' '}
          <strong style={{ color: 'var(--text-primary)' }}>أوقات الأذان</strong>، أو
          مسافر يريد معرفة{' '}
          <strong style={{ color: 'var(--text-primary)' }}>الساعة كم الآن</strong> في
          وجهته، أو عائلة تخطط وفق{' '}
          <strong style={{ color: 'var(--text-primary)' }}>التقويم الهجري</strong>.
        </p>
      </header>

      {/* Cards grid */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        role="list"
        aria-label="مزايا موقع وقت عربي"
      >
        {WHY_FEATURES.map((feat) => (
          <li
            key={feat.title}
            className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: `${feat.color}18` }}
              aria-hidden="true"
            >
              <feat.icon size={20} style={{ color: feat.color }} />
            </div>
            <h3
              className="text-base font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {feat.title}
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {feat.body}
            </p>
          </li>
        ))}
      </ul>

    </SectionWrapper>
  )
}
