/**
 * SectionFAQ — Frequently asked questions
 *
 * Dual schema strategy:
 *  1. JSON-LD FAQPage  — machine-readable, picked up by Google's crawler
 *  2. itemScope/itemProp microdata — redundant signal for older crawlers
 *
 * Accordion: native <details>/<summary> — zero JS, keyboard-accessible,
 * works before hydration.
 *
 * Fixes applied (from v1.0 audit):
 *  BUG-3: ChevronDown + group-open:rotate-180 (RTL-safe — pure rotation)
 *  BUG-7: رمضان question updated to 2026
 *  BUG-8: Plain <span> inside <summary>, NOT <h3> — heading inside an
 *          interactive element is invalid HTML per spec
 */

import Link from 'next/link'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'
import { FAQ_ITEMS } from './data/faqItems'

const H2_ID = 'h2-faq'

function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
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
    <SectionWrapper id="section-faq" headingId={H2_ID} subtle>

      {/* JSON-LD — renders in <body>, Google picks it up fine */}
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
          إجابات عن{' '}
          <span
            style={{
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            أكثر الأسئلة شيوعاً
          </span>
        </h2>

        <p className="text-sm sm:text-base mx-auto" style={{ color: 'var(--text-secondary)' }}>
          إجابات مفصّلة حول مواقيت الصلاة، فروق التوقيت، والمناسبات الدينية
        </p>
      </header>

      {/* Accordion list — microdata + native details */}
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
              border: '1px solid var(--border-subtle)',
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
              {/*
                BUG-8 FIX: <span> not <h3> — heading inside interactive element
                is invalid HTML (causes parsing errors in some browsers).
                The accessible name comes from aria-label on <details>.
              */}
              <span
                className="text-sm sm:text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
                itemProp="name"
              >
                {item.q}
              </span>

              {/*
                BUG-3 FIX: ChevronDown + group-open:rotate-180
                Closed = ↓  |  Open = ↑
                RTL-safe: the rotation is axis-symmetric, looks correct in both
                text directions unlike ChevronLeft which flips meaning in RTL.
              */}
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
