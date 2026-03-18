/**
 * SectionHolidays — Feature section 3
 *
 * Layout: Image RIGHT · Text LEFT  (same RTL pattern as Section 1)
 * Alternation: S1=ImgRight, S2=ImgLeft, S3=ImgRight ✓
 */

import { Moon, Star, Calendar, Bell } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'
import FeatureItem from './shared/FeatureItem'
import CtaLink from './shared/CtaLink'
import HolidaysMockup from './mockups/HolidaysMockup'

const H2_ID = 'h2-holidays'

export default function SectionHolidays() {
  return (
    <SectionWrapper
      id="section-holidays"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute bottom-0 start-0 h-[450px] w-[450px] -translate-x-1/4 translate-y-1/4 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'var(--warning)' }}
          aria-hidden="true"
        />
      }
    >
      {/* flex-row-reverse in RTL: Text LEFT, Mockup RIGHT */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* Text — LEFT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Calendar size={11} />المناسبات والأعياد</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            تقويم الأعياد والمناسبات
            <span
              className="block"
              style={{
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              الدينية والوطنية 2025
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            دليل شامل بـ
            <strong style={{ color: 'var(--text-primary)' }}> الأعياد الإسلامية</strong>{' '}
            كعيد الفطر وعيد الأضحى والمولد النبوي الشريف، إلى جانب{' '}
            <strong style={{ color: 'var(--text-primary)' }}>العطل الرسمية</strong>{' '}
            لجميع الدول العربية. يعرض التواريخ بالتقويمين{' '}
            <strong style={{ color: 'var(--text-primary)' }}>الهجري والميلادي</strong>{' '}
            معاً.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا قسم المناسبات">
            <FeatureItem icon={Moon}>
              <strong>المناسبات الإسلامية الكبرى:</strong> رمضان، عيد الفطر، عيد الأضحى،
              ليلة القدر، المولد النبوي، رأس السنة الهجرية
            </FeatureItem>
            <FeatureItem icon={Star}>
              <strong>العطل الوطنية</strong> لأكثر من 22 دولة عربية مُحدَّثة سنوياً
              بالتواريخ الرسمية المعلنة
            </FeatureItem>
            <FeatureItem icon={Calendar}>
              <strong>تحويل التواريخ</strong> بين التقويم الهجري والميلادي بنقرة واحدة —
              دقيق ومتزامن مع معايير أم القرى
            </FeatureItem>
            <FeatureItem icon={Bell}>
              <strong>تذكير المناسبات</strong> القادمة — خطّط لإجازاتك وأحداثك العائلية
              مسبقاً
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/holidays">استعرض المناسبات والأعياد</CtaLink>
          </div>
        </div>

        {/* Mockup — RIGHT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <HolidaysMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
