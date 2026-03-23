/**
 * SectionSEOArticle — Holidays page editorial long-copy
 *
 * 4 article cards covering the main keyword clusters unique to /holidays:
 *   1. Hijri calendar basics + date conversion (entity: التقويم الهجري)
 *   2. Major Islamic occasions + how dates are set (entity: المناسبات الإسلامية)
 *   3. National holidays across Arab world (entity: العطل الوطنية)
 *   4. Countdown feature value + planning use-cases (entity: عداد تنازلي)
 *
 * Dialectal synonyms embedded naturally:
 *   كم باقي / كم يوم متبقي / كم يوم على / متى موعد / أيام متبقية
 *
 * SEO note: This block is the richest keyword surface on /holidays.
 * Written as genuine editorial — not stuffed. Google's NLP rewards density
 * within semantic coherence.
 */

import Link from 'next/link'
import { Moon, Globe2, Flag, Clock, BarChart3 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'

const H2_ID = 'h2-holidays-about'

const CARDS = [
  {
    icon: Moon,
    title: 'التقويم الهجري — أساس الأعياد الإسلامية',
    body: (
      <>
        يُعدّ{' '}
        <strong style={{ color: 'var(--text-primary)' }}>التقويم الهجري القمري</strong>{' '}
        المرجع الرسمي لتحديد مواعيد جميع{' '}
        <strong style={{ color: 'var(--text-primary)' }}>المناسبات الإسلامية</strong>؛ إذ
        يعتمد دورة القمر بدلاً من الشمس، مما يجعل سنته أقصر بـ11 يوماً من السنة
        الميلادية. لهذا تتقدّم الأعياد الإسلامية على التقويم الميلادي كل عام، ويمرّ{' '}
        <strong style={{ color: 'var(--text-primary)' }}>عيد الفطر وعيد الأضحى</strong> على
        جميع الفصول الأربعة خلال 33 سنة ميلادية. يتيح موقعنا{' '}
        <Link href="/holidays" style={{ color: 'var(--accent-alt)' }} className="font-semibold hover:underline underline-offset-2">
          تحويل التواريخ
        </Link>{' '}
        بين الهجري والميلادي بدقة كاملة.
      </>
    ),
  },
  {
    icon: Clock,
    title: 'عداد تنازلي دقيق لكل مناسبة',
    body: (
      <>
        تتساءل:{' '}
        <strong style={{ color: 'var(--text-primary)' }}>كم يوم باقي على عيد الفطر؟</strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>كم يوم على رمضان؟</strong> أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>متى موعد عيد الأضحى؟</strong> —
        العداد التنازلي في كل بطاقة مناسبة يُجيب في لحظة. يُحسب العد بناءً على
        التاريخ الهجري الفلكي المتوقع، ويُحدَّث تلقائياً كل يوم. جميع المناسبات
        الإسلامية الكبرى مرتّبة حسب الأقرب لتسهيل التخطيط.
      </>
    ),
  },
  {
    icon: Flag,
    title: 'العطل الوطنية والمناسبات الرسمية',
    body: (
      <>
        إلى جانب{' '}
        <strong style={{ color: 'var(--text-primary)' }}>المناسبات الدينية الإسلامية</strong>،
        يضمّ الموقع قاعدة بيانات شاملة بـ
        <strong style={{ color: 'var(--text-primary)' }}> العطل الرسمية والوطنية</strong> لأكثر
        من 22 دولة عربية وإسلامية — أيام الاستقلال، والأعياد الوطنية، والإجازات
        المدرسية والإدارية. تُصفَّح المناسبات بسهولة حسب الدولة أو نوع المناسبة أو
        الإطار الزمني (أسبوع / شهر / 3 أشهر).
      </>
    ),
  },
  {
    icon: Globe2,
    title: 'التواريخ بالهجري والميلادي معاً',
    body: (
      <>
        يعرض كل{' '}
        <strong style={{ color: 'var(--text-primary)' }}>عداد مناسبة</strong> التاريخ
        المزدوج بالتقويمين{' '}
        <strong style={{ color: 'var(--text-primary)' }}>الهجري والميلادي</strong> جنباً إلى
        جنب، مما يُيسّر التخطيط سواء كنت تستخدم التاريخ الميلادي في العمل أو الهجري في
        العبادات. يرتكز الحساب على{' '}
        <strong style={{ color: 'var(--text-primary)' }}>معيار أم القرى</strong> والحسابات
        الفلكية المعتمدة (تقويم أم القرى). لهذا تُعرض التواريخ بمستوى دقة مرئي: 'عالي'
        للدول التي تتبع أم القرى مباشرةً، و'متوسط' للدول التي تعتمد رؤية الهلال المحلية
        حيث قد يتفاوت التاريخ يوماً واحداً.
      </>
    ),
  },
]

export default function SectionSEOArticle() {
  return (
    <SectionWrapper id="section-holidays-about" headingId={H2_ID}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex justify-center">
            <SectionBadge><BarChart3 size={11} />عن عداد المواعيد</SectionBadge>
          </div>
          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            كل ما تحتاج معرفته عن
            <span
              style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {' '}الأعياد والمناسبات الإسلامية
            </span>
          </h2>
          <p className="text-sm sm:text-base mx-auto" style={{ color: 'var(--text-secondary)' }}>
            مرجعك الشامل لفهم التقويم الهجري، كيفية تحديد مواعيد الأعياد، وأدوات التخطيط
            المسبق للمناسبات
          </p>
        </div>

        {/* 2×2 article cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <card.icon size={16} style={{ color: 'var(--accent-alt)' }} aria-hidden="true" />
                <h3 className="text-sm sm:text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>
              </div>
              <p className="text-sm leading-loose" style={{ color: 'var(--text-secondary)' }}>
                {card.body}
              </p>
            </article>
          ))}
        </div>

      </div>
    </SectionWrapper>
  )
}
