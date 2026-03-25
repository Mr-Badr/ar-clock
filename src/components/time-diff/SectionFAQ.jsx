/**
 * SectionFAQ — Time-difference page FAQ
 *
 * Dual schema strategy:
 *   1. FAQPage JSON-LD → Google rich results / People Also Ask boxes
 *   2. itemScope/itemProp microdata → redundant signal for older crawlers
 *
 * 8 evergreen questions targeting People Also Ask boxes in Arabic SERPs.
 *
 * BUG fixes carried over from home audit:
 *   - ChevronDown + group-open:rotate-180 (RTL-safe)
 *   - Plain <span> inside <summary>, NOT <h3>
 *   - aria-label on <details> for accessible name
 */

import Link from 'next/link'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionWrapper, SectionBadge } from '@/components/shared/primitives'
import { FAQ_ITEMS }                     from './data/faqItems'

const H2_ID = 'h2-td-faq'

function FAQSchema() {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name:    item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function SectionFAQ() {
  return (
    <SectionWrapper id="section-td-faq" headingId={H2_ID}>
      <FAQSchema />

      {/* Header */}
      <header className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="flex justify-center">
          <SectionBadge><CheckCircle2 size={11} />الأسئلة الشائعة</SectionBadge>
        </div>
        <h2
          id={H2_ID}
          className="text-2xl sm:text-3xl font-extrabold"
          style={{ color: 'var(--text-primary)' }}
        >
          إجابات عن أكثر الأسئلة شيوعاً
          <span
            className="block text-xl sm:text-2xl mt-1"
            style={{
              background:           'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor:  'transparent',
              backgroundClip:       'text',
            }}
          >
            حول فرق التوقيت والمناطق الزمنية
          </span>
        </h2>
        <p className="text-sm sm:text-base mx-auto" style={{ color: 'var(--text-secondary)' }}>
          إجابات مفصّلة حول UTC وGMT والتوقيت الصيفي وكيفية حساب فرق التوقيت بدقة
        </p>
      </header>

      {/* FAQ Accordion */}
      <div
        className="max-w-3xl mx-auto space-y-2"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={idx}
            className="group rounded-2xl overflow-hidden"
            style={{
              background: 'var(--bg-surface-1)',
              border:     '1px solid var(--border-subtle)',
            }}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
            aria-label={item.q}
          >
            <summary
              className="flex cursor-pointer list-none select-none items-center justify-between gap-4 px-5 py-4
                         [&::-webkit-details-marker]:hidden hover:bg-[color:var(--accent-soft)] transition-colors"
            >
              <span
                className="text-sm sm:text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
                itemProp="name"
              >
                {item.q}
              </span>
              {/* RTL-safe: ChevronDown + rotate-180 on open */}
              <ChevronDown
                size={18}
                className="shrink-0 transition-transform duration-200 group-open:rotate-180"
                style={{ color: 'var(--text-muted)' }}
                aria-hidden="true"
              />
            </summary>

            <div
              className="px-5 pb-5 pt-2"
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <p
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                itemProp="text"
              >
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>

    </SectionWrapper>
  )
}
