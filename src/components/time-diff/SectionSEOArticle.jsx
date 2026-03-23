/**
 * SectionSEOArticle — Time-difference editorial long-copy  (Server Component)
 *
 * UPGRADES vs v1:
 *  - JSX removed from data arrays (was an anti-pattern causing SSR issues)
 *  - Body text rendered directly in component — clean and maintainable
 *  - Added missing keyword clusters:
 *    "الفارق الزمني" / "حاسبة الوقت" / "تحويل الوقت" / "ساعات العمل المشتركة"
 *  - Internal links include the specific pair pages (كثافة روابط داخلية)
 *
 * SEO targets across 4 cards:
 *   Card 1: UTC/GMT explainer  → "ما هو UTC" / "ما هو خط غرينتش" / "الفارق الزمني"
 *   Card 2: Manual calculation → "كيف أحسب فرق التوقيت" / "حاسبة الوقت"
 *   Card 3: Arab TZ landscape  → "توقيت الدول العربية" / "المنطقة الزمنية"
 *   Card 4: Meeting planning   → "أفضل وقت للاجتماع" / "ساعات العمل المشتركة"
 */

import Link from 'next/link'
import { Globe2, Calculator, Clock, Users, BarChart3 } from 'lucide-react'
import { SectionWrapper, SectionBadge } from '@/components/shared/primitives'

const H2_ID = 'h2-td-about'

export default function SectionSEOArticle() {
  return (
    <SectionWrapper id="section-td-about" headingId={H2_ID} subtle>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex justify-center">
            <SectionBadge><BarChart3 size={11} />دليل فرق التوقيت</SectionBadge>
          </div>
          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            كل ما تحتاجه عن
            <span
              style={{
                background:           'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              {' '}فروق التوقيت والمناطق الزمنية
            </span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
            مرجعك الشامل لفهم UTC وGMT والتوقيت الصيفي وطريقة حساب الفارق الزمني بين أي مدينتين
          </p>
        </div>

        {/* 2×2 article cards — JSX inline (not in data array) for clean SSR */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Card 1 — UTC/GMT */}
          <article
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe2 size={16} style={{ color: 'var(--accent-alt)' }} aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                UTC و GMT — المرجع العالمي للتوقيت
              </h3>
            </div>
            <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>UTC (التوقيت العالمي المنسّق)</strong> هو
              المعيار الذي تستند إليه جميع{' '}
              <strong style={{ color: 'var(--text-primary)' }}>المناطق الزمنية</strong> حول العالم.
              يُشار إليه أيضاً بـ{' '}
              <strong style={{ color: 'var(--text-primary)' }}>GMT (توقيت غرينتش)</strong> نسبةً لمرصد
              غرينتش حيث يمرّ خط الطول 0°. السعودية{' '}
              <strong style={{ color: 'var(--text-primary)' }}>UTC+3</strong> والإمارات{' '}
              <strong style={{ color: 'var(--text-primary)' }}>UTC+4</strong> ونيويورك{' '}
              <strong style={{ color: 'var(--text-primary)' }}>UTC−5</strong> — هذا هو
              أساس أي{' '}
              <strong style={{ color: 'var(--text-primary)' }}>حساب فارق زمني</strong> بين مدينتين.
            </p>
          </article>

          {/* Card 2 — Manual calculation */}
          <article
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={16} style={{ color: 'var(--accent-alt)' }} aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                كيف أحسب الفارق الزمني يدوياً؟
              </h3>
            </div>
            <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
              اطرح إزاحة UTC للمدينة الأولى من الثانية. مثال:{' '}
              <strong style={{ color: 'var(--text-primary)' }}>كم ساعة بين دبي ولندن؟</strong>{' '}
              دبي UTC+4 ولندن UTC+0 → الفارق 4 ساعات. لكن انتبه: حين تُطبّق لندن{' '}
              <strong style={{ color: 'var(--text-primary)' }}>التوقيت الصيفي</strong> يُصبح UTC+1
              ويتقلّص الفارق إلى 3 ساعات. لهذا تستخدم{' '}
              <Link href="/time-difference" style={{ color: 'var(--accent-alt)' }} className="font-semibold hover:underline underline-offset-2">
                حاسبة الوقت
              </Link>{' '}
              لتجنّب هذه التعقيدات تلقائياً.
            </p>
          </article>

          {/* Card 3 — Arab TZ landscape */}
          <article
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} style={{ color: 'var(--accent-alt)' }} aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                خريطة التوقيت في العالم العربي
              </h3>
            </div>
            <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
              تمتد الدول العربية عبر 4 مناطق زمنية رئيسية: دول المغرب (المغرب، الجزائر، تونس) على
              <strong style={{ color: 'var(--text-primary)' }}> UTC+0 أو UTC+1</strong>، دول الشام
              ومصر على <strong style={{ color: 'var(--text-primary)' }}>UTC+2</strong>، دول الخليج
              والعراق على <strong style={{ color: 'var(--text-primary)' }}>UTC+3</strong>، والإمارات
              وعُمان على <strong style={{ color: 'var(--text-primary)' }}>UTC+4</strong>. أقصى فارق
              بين دولتين عربيتين هو{' '}
              <Link href="/time-difference/morocco-rabat/united-arab-emirates-dubai" style={{ color: 'var(--accent-alt)' }} className="font-semibold hover:underline underline-offset-2">
                4 ساعات بين المغرب والإمارات
              </Link>.
            </p>
          </article>

          {/* Card 4 — Meeting planning */}
          <article
            className="rounded-2xl p-5 sm:p-6"
            style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} style={{ color: 'var(--accent-alt)' }} aria-hidden="true" />
              <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                أفضل وقت للاجتماع بين الرياض والقاهرة
              </h3>
            </div>
            <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
              الفارق الزمني بين الرياض والقاهرة ساعة واحدة. أفضل{' '}
              <strong style={{ color: 'var(--text-primary)' }}>ساعات العمل المشتركة</strong> هي
              9:00–12:00 بتوقيت الرياض (8:00–11:00 القاهرة). ابدأ بـ{' '}
              <Link href="/time-difference/saudi-arabia-riyadh/egypt-cairo" style={{ color: 'var(--accent-alt)' }} className="font-semibold hover:underline underline-offset-2">
                أداة مقارنة الوقت بين الرياض والقاهرة
              </Link>{' '}
              للحصول على جدول ساعي كامل ومعرفة أفضل وقت لتنظيم أي اجتماع دولي.
            </p>
          </article>

        </div>
      </div>
    </SectionWrapper>
  )
}
