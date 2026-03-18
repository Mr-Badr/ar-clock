/**
 * SectionPrayerTimes — Feature section 1
 *
 * Layout: Image RIGHT · Text LEFT
 * RTL flex-row-reverse: DOM order [Text, Mockup]
 *   → RTL reverses flow → Text appears LEFT, Mockup appears RIGHT ✓
 */

import Link from 'next/link'
import { Clock, Compass, BookOpen, Bell, Globe2, Moon } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'
import FeatureItem from './shared/FeatureItem'
import CtaLink from './shared/CtaLink'
import PrayerTimesMockup from './mockups/PrayerTimesMockup'

const H2_ID = 'h2-prayer-times'

export default function SectionPrayerTimes() {
  return (
    <SectionWrapper
      id="section-prayer-times"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute top-0 start-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      {/* flex-row-reverse in RTL: first DOM child (Text) → LEFT, second (Mockup) → RIGHT */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* Text — LEFT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Moon size={11} />مواقيت الصلاة</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            مواقيت الصلاة الدقيقة
            <span
              className="block"
              style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              لأي مدينة في العالم
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            احصل على{' '}
            <strong style={{ color: 'var(--text-primary)' }}>أوقات الصلاة اليوم</strong>{' '}
            بدقة فلكية متناهية لأي مدينة. سواء كنت تبحث عن{' '}
            <strong style={{ color: 'var(--text-primary)' }}>أذان الفجر في الرياض</strong>،
            أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>موعد صلاة المغرب في القاهرة</strong>،
            أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>وقت العشاء في دبي</strong> —
            الموقع يحتسب المواقيت وفق إحداثياتك الجغرافية الدقيقة.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا مواقيت الصلاة">
            <FeatureItem icon={Clock}>
              <strong>الصلوات الخمس كاملةً:</strong> الفجر والشروق والظهر والعصر والمغرب
              والعشاء — مع وقت الإمساك والإفطار في رمضان
            </FeatureItem>
            <FeatureItem icon={Compass}>
              <strong>اتجاه القبلة</strong> المحسوب من موقعك بالدرجة والاتجاه الجغرافي الدقيق
            </FeatureItem>
            <FeatureItem icon={BookOpen}>
              دعم كامل لـ<strong> المذاهب الأربعة:</strong> الحنفي، المالكي، الشافعي، الحنبلي
            </FeatureItem>
            <FeatureItem icon={Bell}>
              <strong>تنبيه أذان الصلاة</strong> قبل كل صلاة مباشرةً داخل المتصفح
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              تغطية{' '}
              <strong>أكثر من ٣ ملايين مدينة</strong> حول العالم مع بيانات محدَّثة آنياً
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/mwaqit-al-salat">اعرف مواقيت الصلاة الآن</CtaLink>
            <Link
              href="/mwaqit-al-salat"
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--accent-alt)' }}
            >
              تصفّح المدن →
            </Link>
          </div>
        </div>

        {/* Mockup — RIGHT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <PrayerTimesMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
