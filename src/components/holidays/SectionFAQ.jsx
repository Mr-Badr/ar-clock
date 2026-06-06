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
 * Schema: JSON-LD FAQPage
 * Accordion: native <details>/<summary> — zero JS, SSR-safe, keyboard accessible
 */

import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionBadge, SectionWrapper } from '@/components/shared/primitives'
import { getFaqItems } from './data/faqItems'

const H2_ID = 'h2-holidays-faq'


export default async function SectionFAQ() {
  const faqItems = await getFaqItems()

  return (
    <SectionWrapper id="section-holidays-faq" headingId={H2_ID} subtle>

      <header className="section-head section-head--center">
        <SectionBadge><CheckCircle2 size={11} />قبل التخطيط</SectionBadge>

        <h2
          id={H2_ID}
          className="section-title"
        >
          أسئلة تحتاج جواباً
          <span className="text-accent"> قبل أن تعتمد على موعد مناسبة</span>
        </h2>

        <p className="section-copy">
          هنا نجيب عن الأسئلة التي تظهر عادة قبل رمضان والأعياد والمواعيد الهجرية:
          متى يبدأ الموعد، لماذا قد يختلف، وما الذي يجب مراجعته قبل السفر أو ترتيب الإجازة.
        </p>
      </header>

      <div className="faq-list">
        {faqItems.map((item, idx) => (
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
              <p
                className="feature-tile__copy"
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
