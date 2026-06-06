/**
 * SectionFAQ — Frequently asked questions
 *
 * Schema strategy:
 *  1. JSON-LD FAQPage  — machine-readable, picked up by Google's crawler
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

import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionBadge, SectionWrapper } from '@/components/shared/primitives'
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

      <FAQSchema />

      <header className="section-head section-head--center">
        <SectionBadge><CheckCircle2 size={11} />قبل أن تعتمد النتيجة</SectionBadge>

        <h2
          id={H2_ID}
          className="section-title"
        >
          أسئلة تساعدك على استخدام{' '}
          <span className="text-accent">الوقت والصلاة والتاريخ بثقة</span>
        </h2>

        <p className="section-copy">
          إجابات قصيرة توضّح متى تكفي نتيجة ميقاتنا للاستخدام اليومي، ومتى تحتاج
          مراجعة طريقة الحساب أو البلد أو الجهة الرسمية قبل اتخاذ قرار مهم.
        </p>
      </header>

      <div className="faq-list">
        {FAQ_ITEMS.map((item, idx) => (
          <details
            key={idx}
            className="faq-item"
            aria-label={item.q}
          >
            <summary
              className="faq-item__summary"
            >
              <span
                className="faq-item__question"
              >
                {item.q}
              </span>

              <ChevronDown
                size={18}
                className="faq-item__chevron"
                aria-hidden="true"
              />
            </summary>

            <div className="faq-item__body">
              <p className="feature-tile__copy">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>

    </SectionWrapper>
  )
}
