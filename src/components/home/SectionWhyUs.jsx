/**
 * SectionWhyUs — Feature cards section
 *
 * SERVER COMPONENT BUG FIX:
 *   v1 used onMouseEnter / onMouseLeave on <li> elements.
 *   In Next.js App Router, event handlers on elements in Server Components
 *   cause: "Event handlers cannot be passed to Client Component props"
 *   or a serialization error at runtime — the page breaks.
 *
 *   FIX: Remove the event handlers entirely. Use a .feat-card CSS class
 *   with :hover rules in a <style> tag (same technique as CtaLink).
 *   The <style> tag is rendered once server-side; the browser deduplicates
 *   identical blocks. No JS needed, no hydration, no bundle cost.
 *
 *   Before: onMouseEnter sets style.transform + style.boxShadow imperatively
 *   After:  .feat-card:hover { transform: translateY(-2px); box-shadow: ... }
 */

import { Star } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'
import { WHY_FEATURES } from './data/whyFeatures'

const H2_ID = 'h2-why-us'

export default function SectionWhyUs() {
  return (
    <SectionWrapper id="section-why-us" headingId={H2_ID} subtle>

      {/* CSS for card hover — replaces the broken onMouseEnter/onMouseLeave */}
      <style>{`
        .feat-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .feat-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
      `}</style>

      {/* Header */}
      <header className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="flex justify-center">
          <SectionBadge><Star size={11} />دليلك الشامل</SectionBadge>
        </div>

        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          بوابتك الشاملة لكل ما يتعلق
          <span
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {' '}بالوقت والتقويم الهجري
          </span>
        </h2>

        <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          تطبيق متخصص يجمع بين دقة العلم وسهولة الاستخدام، ليكون المرجع الأول لكل
          مسلم يبحث عن{' '}
          <strong style={{ color: 'var(--text-primary)' }}>أوقات الأذان</strong>، أو
          مسافر يريد معرفة{' '}
          <strong style={{ color: 'var(--text-primary)' }}>الساعة كم الآن</strong> في
          وجهته، أو عائلة تخطط وفق{' '}
          <strong style={{ color: 'var(--text-primary)' }}>التقويم الهجري</strong>.
        </p>
      </header>

      {/* Cards grid — CSS hover only, no JS event handlers */}
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        role="list"
        aria-label="مزايا تطبيق ميقاتنا"
      >
        {WHY_FEATURES.map((feat) => (
          <li
            key={feat.title}
            /* feat-card class handles hover via CSS — no onMouseEnter/onMouseLeave */
            className="feat-card rounded-2xl p-5 sm:p-6"
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: feat.color.replace(')', '-soft)') }}
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
