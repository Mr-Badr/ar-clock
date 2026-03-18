/**
 * SectionTimeDifference — Feature section 2
 *
 * Layout: Image LEFT · Text RIGHT  ← alternates with Section 1
 *
 * BUG-1 FIX (from v1.0):
 * RTL flex-row (NO flex-row-reverse, NO order-* classes):
 *   - RTL flow = right → left
 *   - First DOM child (Text) lands on the RIGHT
 *   - Second DOM child (Mockup) lands on the LEFT ✓
 * v1.0 wrongly used md:order-1 on Text which, combined with RTL flex-row,
 * placed the mockup on the right — identical to Section 1. Now fixed.
 */

import Link from 'next/link'
import { Clock, Sun, Globe2, Users, MapPin } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'
import FeatureItem from './shared/FeatureItem'
import CtaLink from './shared/CtaLink'
import TimeDifferenceMockup from './mockups/TimeDifferenceMockup'

const H2_ID = 'h2-time-difference'

export default function SectionTimeDifference() {
  return (
    <SectionWrapper
      id="section-time-difference"
      headingId={H2_ID}
      subtle
      glow={
        <div
          className="pointer-events-none absolute top-1/4 end-0 h-[400px] w-[400px] translate-x-1/3 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: 'var(--info)' }}
          aria-hidden="true"
        />
      }
    >
      {/* RTL flex-row: Text (first DOM) → RIGHT, Mockup (second DOM) → LEFT ✓ */}
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

        {/* Text — RIGHT on desktop (first DOM child in RTL flex-row) */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Globe2 size={11} />فرق التوقيت</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            احسب فارق الوقت بين
            <span
              className="block"
              style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              أي مدينتين في ثوانٍ
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            أداة{' '}
            <strong style={{ color: 'var(--text-primary)' }}>حساب فرق التوقيت</strong>{' '}
            الأسرع والأدق. تريد تعرف{' '}
            <strong style={{ color: 'var(--text-primary)' }}>كم الساعة الآن في لندن</strong>{' '}
            وأنت في الرياض؟ أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>التوقيت الحالي في نيويورك</strong>{' '}
            مقارنةً بدبي؟ أداتنا تُجيب في لحظة مع مراعاة{' '}
            <strong style={{ color: 'var(--text-primary)' }}>التوقيت الصيفي</strong>{' '}
            تلقائياً.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا حساب فرق التوقيت">
            <FeatureItem icon={Clock}>
              <strong>الفارق الزمني الدقيق</strong> بالساعة والدقيقة بين أي مدينتين — حتى
              المدن ذات النصف ساعة كالهند وإيران
            </FeatureItem>
            <FeatureItem icon={Sun}>
              احتساب{' '}
              <strong>التوقيت الصيفي DST</strong> تلقائياً لكل دولة دون أي إعداد يدوي
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              <strong>توقيت غرينتش GMT/UTC</strong> كمرجع عالمي مع عرض جميع المناطق الزمنية
            </FeatureItem>
            <FeatureItem icon={Users}>
              مثالية لـ<strong>تنسيق اجتماعات العمل</strong> عبر الدول والمسافرين وذوي
              العائلات في الخارج
            </FeatureItem>
            <FeatureItem icon={MapPin}>
              <strong>جدول توقيتات المدن</strong> التفاعلي — قارن ١٢ مدينة دفعةً واحدة
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/time-difference">احسب فرق التوقيت الآن</CtaLink>
            <Link
              href="/time-now"
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--accent-alt)' }}
            >
              الوقت الآن حول العالم →
            </Link>
          </div>
        </div>

        {/* Mockup — LEFT on desktop (second DOM child in RTL flex-row) */}
        <div className="w-full md:w-1/2 flex justify-center">
          <TimeDifferenceMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
