/**
 * SectionFAQ — Holidays page
 *
 * v1 PROBLEM:
 *   Used generic, evergreen questions ("ما الفرق بين التقويم الهجري والميلادي")
 *   that are topically correct but NOT the queries users actually search.
 *
 * v2 IMPROVEMENT:
 *   Uses FAQ_ITEMS from data/faqItems.js which aggregates from the engine's
 *   per-event faqItems arrays. These are EXACT high-volume search queries:
 *     "متى يبدأ رمضان 2026؟"
 *     "كم يوم رمضان 2026؟"
 *     "متى ليلة القدر في رمضان 2026؟"
 *     "متى عيد الفطر 2026؟"
 *     "متى عيد الأضحى 2026؟"
 *     "متى يوم عرفة 2026؟"
 *   Each = a Google featured-snippet candidate + "People Also Ask" box.
 *
 * Dual schema: JSON-LD FAQPage + itemScope microdata
 * Accordion: native <details>/<summary> — zero JS, SSR-safe, keyboard accessible
 */

import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'
import { getFaqItems } from './data/faqItems'

const H2_ID = 'h2-holidays-faq'

function FAQSchema({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
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

export default async function SectionFAQ() {
  const faqItems = await getFaqItems()

  return (
    <SectionWrapper id="section-holidays-faq" headingId={H2_ID} subtle>

      <FAQSchema items={faqItems} />

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
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            حول الأعياد والمناسبات الإسلامية
          </span>
        </h2>

        <p className="text-sm sm:text-base mx-auto" style={{ color: 'var(--text-secondary)' }}>
          إجابات دقيقة وموثوقة عن المواعيد المتوقعة للأعياد، كيفية حسابها، وما يتعلق
          بها من أحكام وفضائل
        </p>
      </header>

      {/* Accordion — dual-schema: JSON-LD above + microdata here */}
      <div
        className="max-w-3xl mx-auto space-y-2"
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        {faqItems.map((item, idx) => (
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
              {/* Plain <span> — NOT <h3>. Heading inside interactive = invalid HTML spec */}
              <span
                className="text-sm sm:text-base font-semibold leading-snug"
                style={{ color: 'var(--text-primary)' }}
                itemProp="name"
              >
                {item.q}
              </span>
              {/*
                ChevronDown + group-open:rotate-180 — RTL-safe:
                ↓ = closed  |  ↑ = open
                Pure rotation = same visual in both LTR and RTL.
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
