/**
 * SectionHijriCalendar — Feature section 1
 * Layout: Image RIGHT · Text LEFT (RTL flex-row-reverse)
 *
 * SEO targets:
 *   "التقويم الهجري" / "التقويم الإسلامي" / "الأشهر الهجرية"
 *   "الفرق بين التقويم الهجري والميلادي"
 */

import Link from 'next/link'
import { Moon, Calendar, RefreshCcw, Globe2, BookOpen } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import { SectionBadge, FeatureItem } from './shared/primitives'
import CtaLink from './shared/CtaLink'
import HijriCalendarMockup from './mockups/HijriCalendarMockup'

const H2_ID = 'h2-hijri-calendar'

export default function SectionHijriCalendar() {
  return (
    <SectionWrapper
      id="section-hijri-calendar"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute top-0 start-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      {/* flex-row-reverse in RTL → Text LEFT, Mockup RIGHT */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* Text — LEFT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Moon size={11} />التقويم الهجري</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            التقويم الهجري — أساس
            <span
              className="block"
              style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              المناسبات الإسلامية
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>التقويم الهجري</strong> هو
            التقويم القمري الرسمي للمسلمين، يتكوّن من{' '}
            <strong style={{ color: 'var(--text-primary)' }}>12 شهراً هجرياً</strong> قمرياً
            مجموعها 354–355 يوماً. يبدأ من شهر{' '}
            <strong style={{ color: 'var(--text-primary)' }}>محرم</strong> وينتهي بشهر{' '}
            <strong style={{ color: 'var(--text-primary)' }}>ذو الحجة</strong>، وعليه تدور
            جميع{' '}
            <strong style={{ color: 'var(--text-primary)' }}>المناسبات الإسلامية</strong>{' '}
            من رمضان والأعياد والحج.
          </p>

          <ul className="space-y-3" role="list" aria-label="معلومات التقويم الهجري">
            <FeatureItem icon={Moon}>
              <strong>قمري بالكامل:</strong> كل شهر هجري يبدأ برؤية هلال القمر الجديد —
              لهذا تتحرك المناسبات الإسلامية نحو 11 يوماً مبكراً كل عام ميلادي
            </FeatureItem>
            <FeatureItem icon={Calendar}>
              <strong>12 شهراً</strong> بدءاً من محرم حتى ذي الحجة، كل شهر 29 أو 30 يوماً
              حسب الرؤية
            </FeatureItem>
            <FeatureItem icon={RefreshCcw}>
              <strong>الفرق مع الميلادي:</strong> السنة الهجرية أقصر بـ11 يوماً من
              الميلادية — تُكمل دورتها الكاملة في الفصول الأربعة كل 33 سنة ميلادية
            </FeatureItem>
            <FeatureItem icon={BookOpen}>
              <strong>4 أشهر حرم:</strong> محرم، رجب، ذو القعدة، وذو الحجة — أشهر عظّمها
              الله وأشار إليها في القرآن الكريم
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              <strong>تحويل فوري</strong> بين التاريخ الهجري والميلادي لأي يوم في أداة
              تحويل التاريخ
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/holidays">استعرض المناسبات الهجرية</CtaLink>
            <Link href="/holidays" className="text-sm font-semibold transition-colors" style={{ color: 'var(--accent-alt)' }}>
              الأشهر الهجرية الاثنا عشر ↓
            </Link>
          </div>
        </div>

        {/* Mockup — RIGHT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <HijriCalendarMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
