/**
 * SectionDST — Daylight Saving Time education section  (Server Component)
 * Layout: Image LEFT · Text RIGHT  (RTL flex-row)
 *
 * UPGRADES vs v1:
 *  - CTA button uses CtaLink component (BUG-5 fix — no inline gradient style)
 *  - Richer keyword coverage: "توقيت صيفي"، "تغيّر التوقيت"، "مصر والسعودية"
 *  - Added note about Morocco Ramadan special case (unique competitor gap)
 *
 * SEO targets:
 *   "التوقيت الصيفي" / "DST" / "لماذا يختلف فرق التوقيت بين الصيف والشتاء"
 *   "هل مصر تُطبّق التوقيت الصيفي" / "دول التوقيت الصيفي العربية"
 *   "توقيت مصر والسعودية" / "تغيّر التوقيت الصيفي"
 */

import { Sun, Info, Globe2, RefreshCcw, Shield } from 'lucide-react'
import { SectionWrapper, SectionBadge, FeatureItem } from './shared/primitives'
import CtaLink from './shared/CtaLink'
import DSTMockup from './mockups/DSTMockup'

const H2_ID = 'h2-dst'

export default function SectionDST() {
  return (
    <SectionWrapper
      id="section-dst"
      headingId={H2_ID}
      subtle
      glow={
        <div
          className="pointer-events-none absolute top-1/3 end-0 h-[450px] w-[450px] translate-x-1/3 rounded-full blur-3xl opacity-[0.06]"
          style={{ background: 'var(--warning)' }}
          aria-hidden="true"
        />
      }
    >
      {/* RTL flex-row: Text (first DOM) → RIGHT, Mockup (second DOM) → LEFT ✓ */}
      <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">

        {/* Text — RIGHT on desktop */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Sun size={11} />التوقيت الصيفي DST</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            لماذا يتغيّر فرق التوقيت
            <span
              className="block"
              style={{
                background:           'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              بين الصيف والشتاء؟
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>التوقيت الصيفي (DST)</strong> هو
            تقديم الساعة الرسمية ساعةً في فصل الصيف. حين تُطبّقه مصر أو المغرب ولا تُطبّقه السعودية
            أو الإمارات — يتغيّر{' '}
            <strong style={{ color: 'var(--text-primary)' }}>الفارق الزمني</strong> بين البلدين
            ساعةً كاملة تلقائياً{' '}
            <strong style={{ color: 'var(--text-primary)' }}>دون أي إشعار مسبق!</strong>{' '}
            هذا يُربك المسافرين ورجال الأعمال الذين يعتمدون على فارق ثابت طوال السنة.
          </p>

          <ul className="space-y-3" role="list" aria-label="تفاصيل التوقيت الصيفي">
            <FeatureItem icon={Sun}>
              <strong>70 دولة تُطبّق DST</strong> حول العالم — أوروبا، أمريكا الشمالية،
              مصر، المغرب، الأردن، لبنان، وسوريا أبرزها
            </FeatureItem>
            <FeatureItem icon={Shield}>
              <strong>الخليج لا يُطبّقه:</strong> السعودية، الإمارات، الكويت، قطر، البحرين،
              وعُمان — توقيتها ثابت طوال العام لا يتغيّر
            </FeatureItem>
            <FeatureItem icon={RefreshCcw}>
              <strong>مصر والسعودية:</strong> الفارق بينهما ساعة في الشتاء (مصر UTC+2،
              السعودية UTC+3) — يتحوّل إلى صفر في الصيف حين تُطبّق مصر DST
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              <strong>أداتنا تراعيه تلقائياً:</strong> تستخدم قاعدة بيانات IANA المحدَّثة
              لعرض الفارق الصحيح وفق تاريخ اليوم الفعلي
            </FeatureItem>
            <FeatureItem icon={Info}>
              <strong>حالة المغرب الخاصة:</strong> المغرب يُوقف العمل بالتوقيت الصيفي خلال
              شهر رمضان المبارك ثم يستأنفه — مما يجعل حسابه يدوياً مستحيلاً بدون أداة
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* CtaLink uses .td-cta CSS class — no inline gradient style (BUG-5 fix) */}
            <CtaLink href="/time-difference">
              احسب فرق التوقيت مع مراعاة DST
            </CtaLink>
          </div>
        </div>

        {/* Mockup — LEFT on desktop */}
        <div className="w-full md:w-1/2 flex justify-center">
          <DSTMockup />
        </div>

      </div>
    </SectionWrapper>
  )
}
