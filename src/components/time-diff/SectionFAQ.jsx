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

function isValidFaqItem(item) {
  return Boolean(
    item
      && typeof item === 'object'
      && typeof item.q === 'string'
      && item.q.trim().length > 0
      && typeof item.a === 'string'
      && item.a.trim().length > 0,
  )
}

const SAFE_FAQ_ITEMS = Array.isArray(FAQ_ITEMS) ? FAQ_ITEMS.filter(isValidFaqItem) : []

function FAQSchema() {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'FAQPage',
    mainEntity: SAFE_FAQ_ITEMS.map((item) => ({
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

      <header className="section-head section-head--center">
        <SectionBadge><CheckCircle2 size={11} />قبل ضبط الموعد</SectionBadge>
        <h2
          id={H2_ID}
          className="section-title"
        >
          أسئلة تمنع أخطاء
          <span className="text-accent"> فرق التوقيت والمناطق الزمنية</span>
        </h2>
        <p className="section-copy">
          افهم الفرق بين UTC وGMT والتوقيت الصيفي قبل تثبيت اجتماع أو رحلة أو موعد
          مع شخص في دولة أخرى.
        </p>
      </header>

      <div
        className="faq-list"
      >
        {SAFE_FAQ_ITEMS.length > 0 ? SAFE_FAQ_ITEMS.map((item, idx) => (
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

            <div
              className="faq-item__body"
            >
              <p
                className="feature-tile__copy"
              >
                {item.a}
              </p>
            </div>
          </details>
        )) : (
          <div className="faq-item" role="status">
            <div className="faq-item__body">
              <p className="feature-tile__copy">
                لم تتوفر الأسئلة التفصيلية الآن. ابدأ بالحاسبة في أعلى الصفحة، ثم راجع قسم التوقيت الصيفي لأن معظم أخطاء فرق التوقيت تحدث عند تغيّر الساعة موسمياً.
              </p>
            </div>
          </div>
        )}
      </div>

    </SectionWrapper>
  )
}
