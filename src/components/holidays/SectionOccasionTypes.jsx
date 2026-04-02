/**
 * SectionOccasionTypes — Feature section 2
 * Layout: Image LEFT · Text RIGHT (RTL flex-row — DOM [Text, Mockup])
 *
 * SEO targets:
 *   "المناسبات الإسلامية" / "العطل الوطنية" / "المناسبات الدولية"
 *   "أنواع الأعياد" / "المناسبات الدينية والوطنية"
 *
 * Maps directly to the filter categories already shown in the holidays UI,
 * reinforcing the UX and adding SEO content for each category.
 */

import Link from 'next/link'
import { Moon, Flag, Globe2, GraduationCap, Briefcase, TreePine } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge, FeatureItem } from '@/components/shared/primitives'
import CtaLink from '@/components/shared/CtaLink'
import OccasionTypesMockup from './mockups/OccasionTypesMockup'

const H2_ID = 'h2-occasion-types'

export default function SectionOccasionTypes() {
  return (
    <SectionWrapper
      id="section-occasion-types"
      headingId={H2_ID}
      subtle
      glow={
        <div
          className="pointer-events-none absolute top-1/3 end-0 h-[450px] w-[450px] translate-x-1/3 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: 'var(--success)' }}
          aria-hidden="true"
        />
      }
    >
      {/* RTL flex-row → Text RIGHT (first DOM), Mockup LEFT (second DOM) */}
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

        {/* Text — RIGHT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Flag size={11} />أنواع المناسبات</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            دليل شامل للأعياد
            <span
              className="block"
              style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              والمناسبات الدينية والوطنية
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            يضمّ الموقع قاعدة بيانات شاملة تغطي جميع أنواع المناسبات:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>المناسبات الإسلامية</strong>{' '}
            المرتبطة بالتقويم الهجري،{' '}
            <strong style={{ color: 'var(--text-primary)' }}>العطل الوطنية</strong> للدول
            العربية والإسلامية، و
            <strong style={{ color: 'var(--text-primary)' }}>المناسبات المدرسية</strong>{' '}
            والإدارية — كلها في مكان واحد مع عداد تنازلي دقيق.
          </p>

          <ul className="space-y-3" role="list" aria-label="أنواع المناسبات المدعومة">
            <FeatureItem icon={Moon}>
              <strong>المناسبات الإسلامية:</strong> رمضان، عيد الفطر، عيد الأضحى، ليلة
              القدر، المولد النبوي، الإسراء والمعراج، عاشوراء، ويوم عرفة
            </FeatureItem>
            <FeatureItem icon={Flag}>
              <strong>الأعياد الوطنية:</strong> أيام الاستقلال والعطل الرسمية لأكثر من
              22 دولة عربية وإسلامية
            </FeatureItem>
            <FeatureItem icon={GraduationCap}>
              <strong>المناسبات المدرسية:</strong> بداية العام الدراسي، الإجازات الفصلية،
              وعطل منتصف الفصل — حسب كل دولة
            </FeatureItem>
            <FeatureItem icon={Briefcase}>
              <strong>مناسبات الأعمال:</strong> نهاية السنة المالية، العطل الرسمية المؤثرة
              على ساعات العمل والبورصات
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              <strong>التصفية الذكية:</strong> صفّح المناسبات حسب الدولة، النوع، أو
              الإطار الزمني — أسبوع أو شهر أو 3 أشهر
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <CtaLink href="/holidays">تصفّح المناسبات الآن</CtaLink>
          </div>
        </div>

        {/* Mockup — LEFT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <OccasionTypesMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
