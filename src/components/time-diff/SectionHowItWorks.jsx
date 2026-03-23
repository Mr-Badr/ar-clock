/**
 * SectionHowItWorks — Feature section 1  (Server Component)
 * Layout: Image RIGHT · Text LEFT  (RTL flex-row-reverse)
 *
 * UPGRADES vs v1:
 *  - HowTo JSON-LD schema added (critical for voice search + Google "How to" cards)
 *  - CTA button uses .td-cta class (not inline style= — BUG-5 fix)
 *  - Richer SEO paragraph covering "الفارق الزمني", "حاسبة التوقيت", "تحويل التوقيت"
 *  - Added "كم ساعة بين" keyword naturally in body text
 *
 * SEO targets:
 *   "كيف يُحسب فرق التوقيت" / "ما هو UTC" / "ما هو خط غرينتش"
 *   "الفارق الزمني" / "حاسبة التوقيت" / "تحويل التوقيت بين المدن"
 *   "كم ساعة بين مدينتين" / "المناطق الزمنية"
 */

import Link from 'next/link'
import { Globe2, Clock, Zap, MapPin, Calculator } from 'lucide-react'
import { SectionWrapper, SectionBadge, FeatureItem } from '@/components/shared/primitives'
import CtaLink from '@/components/shared/CtaLink'
import HowItWorksMockup from './mockups/HowItWorksMockup'

const H2_ID = 'h2-how-it-works'

/** HowTo JSON-LD — targets Google "How to" rich results + voice search */
function HowToSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'HowTo',
    name:       'كيف تحسب فرق التوقيت بين مدينتين؟',
    description:
      'طريقة حساب الفارق الزمني بين أي مدينتين في العالم مع مراعاة التوقيت الصيفي DST',
    totalTime: 'PT1M',
    tool: [
      {
        '@type': 'HowToTool',
        name: 'حاسبة فرق التوقيت — وقت عربي',
      },
    ],
    step: [
      {
        '@type':   'HowToStep',
        position:  1,
        name:      'ابحث عن UTC لكل مدينة',
        text:      'اعرف إزاحة UTC لكل مدينة — مثلاً الرياض UTC+3 ولندن UTC+0.',
      },
      {
        '@type':   'HowToStep',
        position:  2,
        name:      'اطرح الإزاحتين',
        text:      'اطرح UTC المدينة الثانية من UTC المدينة الأولى: 3 − 0 = 3 ساعات.',
      },
      {
        '@type':   'HowToStep',
        position:  3,
        name:      'راعِ التوقيت الصيفي',
        text:      'إن كانت إحدى المدينتين تُطبّق DST، أضف ساعة على إزاحتها الصيفية.',
      },
      {
        '@type':   'HowToStep',
        position:  4,
        name:      'استخدم الأداة للدقة الكاملة',
        text:      'استخدم حاسبة فرق التوقيت في موقعنا لتجنّب أي خطأ — تراعي DST تلقائياً.',
      },
    ],
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export default function SectionHowItWorks() {
  return (
    <SectionWrapper
      id="section-how-it-works"
      headingId={H2_ID}
      glow={
        <div
          className="pointer-events-none absolute top-0 start-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      <HowToSchema />

      {/* RTL flex-row-reverse → Text LEFT, Mockup RIGHT */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* Text — LEFT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Calculator size={11} />كيف تعمل الحاسبة</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            كيف يُحسب الفارق الزمني
            <span
              className="block"
              style={{
                background:           'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              بين أي مدينتين في العالم؟
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            حاسبة{' '}
            <strong style={{ color: 'var(--text-primary)' }}>فرق التوقيت</strong> — وتُسمّى أيضاً
            <strong style={{ color: 'var(--text-primary)' }}> حاسبة الوقت</strong> — تعمل بطرح
            إزاحة{' '}
            <strong style={{ color: 'var(--text-primary)' }}>UTC</strong> لمدينة من إزاحة الأخرى.
            مثال: تريد تعرف{' '}
            <strong style={{ color: 'var(--text-primary)' }}>كم ساعة بين الرياض ولندن؟</strong> الجواب:
            الرياض (UTC+3) ناقص لندن (UTC+0) = فارق 3 ساعات. أداتنا تراعي{' '}
            <strong style={{ color: 'var(--text-primary)' }}>التوقيت الصيفي DST</strong>{' '}
            تلقائياً من قاعدة بيانات IANA.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا حاسبة فرق التوقيت">
            <FeatureItem icon={Globe2}>
              <strong>UTC — التوقيت العالمي الموحّد:</strong> مرجع جميع مناطق العالم من
              UTC−12 إلى UTC+14 — يُعرف أيضاً بـ توقيت غرينتش GMT
            </FeatureItem>
            <FeatureItem icon={Clock}>
              <strong>دقة بالدقيقة:</strong> نحسب الفوارق النصفية كإيران (UTC+3:30) والهند
              (UTC+5:30) بالدقيقة — لا بالساعة فقط
            </FeatureItem>
            <FeatureItem icon={Zap}>
              <strong>التوقيت الصيفي DST تلقائي:</strong> قاعدة بيانات IANA المحدَّثة —
              لا تحتاج إعداداً، الأداة تجيب بالفارق الصحيح وفق تاريخ اليوم
            </FeatureItem>
            <FeatureItem icon={MapPin}>
              <strong>3 ملايين مدينة:</strong> ابحث عن أي مدينة أو بلدة في العالم
              لتحويل التوقيت ومعرفة الفارق الزمني فورياً
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

        {/* Mockup — RIGHT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <HowItWorksMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
