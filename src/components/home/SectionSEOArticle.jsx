/**
 * SectionSEOArticle — Editorial long-copy section
 *
 * Purpose: richest keyword surface on the homepage.
 * Four article cards covering all main topic clusters with:
 *  - Exact-match keywords (مواقيت الصلاة اليوم، فرق التوقيت)
 *  - Dialectal synonyms (كم الساعة / الساعة كم / الوقت الآن / التوقيت الآن)
 *  - Long-tail queries embedded as natural prose
 *  - Internal links with descriptive anchor text
 *
 * Written as genuine editorial copy — not keyword stuffing.
 * Google's NLP rewards natural semantic density.
 */

import Link from 'next/link'
import { Moon, Globe2, Calendar, Heart, BarChart3 } from 'lucide-react'
import SectionWrapper from './shared/SectionWrapper'
import SectionBadge from './shared/SectionBadge'

const H2_ID = 'h2-about'

const CARDS = [
  {
    icon: Moon,
    title: 'مواقيت الصلاة — الدقة أولاً',
    body: (
      <>
        يتساءل الكثيرون:{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          ما هو وقت الفجر اليوم في مدينتي؟
        </strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          كم باقٍ على أذان المغرب؟
        </strong>{' '}
        موقعنا يجيب بحسابات فلكية دقيقة تعتمد مكتبة <em>Adhan.js</em>{' '}
        المعتمدة، مع مراعاة الارتفاع الجغرافي والانكسار الضوئي. ندعم طريقة{' '}
        <strong style={{ color: 'var(--text-primary)' }}>رابطة العالم الإسلامي</strong>،{' '}
        <strong style={{ color: 'var(--text-primary)' }}>هيئة الإمارات للمساحة</strong>،
        وطريقة{' '}
        <strong style={{ color: 'var(--text-primary)' }}>كراتشي</strong> للمذهب
        الحنفي. كما نعرض{' '}
        <strong style={{ color: 'var(--text-primary)' }}>اتجاه القبلة</strong> بالدرجة
        الجغرافية من موقعك أينما كنت في العالم.
      </>
    ),
  },
  {
    icon: Globe2,
    title: 'الساعة الآن حول العالم',
    body: (
      <>
        سواء أردت معرفة{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          كم الساعة الآن في لندن
        </strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          التوقيت الحالي في إسطنبول
        </strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>الوقت في باريس الآن</strong>{' '}
        — قسم{' '}
        <Link
          href="/time-now"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          الوقت الآن
        </Link>{' '}
        يمنحك إجابة فورية. وإن أردت{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          فرق التوقيت بين السعودية وأمريكا
        </strong>{' '}
        أو بين{' '}
        <strong style={{ color: 'var(--text-primary)' }}>الإمارات وأستراليا</strong>،
        أداتنا تحسب الفارق مع مراعاة{' '}
        <strong style={{ color: 'var(--text-primary)' }}>التوقيت الصيفي</strong>{' '}
        تلقائياً.
      </>
    ),
  },
  {
    icon: Calendar,
    title: 'تقويم الأعياد والإجازات',
    body: (
      <>
        يبحث ملايين المستخدمين كل عام عن:{' '}
        <strong style={{ color: 'var(--text-primary)' }}>متى عيد الفطر 2025؟</strong>{' '}
        و
        <strong style={{ color: 'var(--text-primary)' }}>
          {' '}موعد عيد الأضحى المبارك
        </strong>{' '}
        و
        <strong style={{ color: 'var(--text-primary)' }}>
          {' '}كم يوم رمضان 2026؟
        </strong>{' '}
        قسم{' '}
        <Link
          href="/holidays"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          المناسبات والأعياد
        </Link>{' '}
        يجمع العطل الرسمية لأكثر من 22 دولة عربية مع التواريخ المزدوجة
        بالتقويمين الهجري والميلادي وإمكانية{' '}
        <strong style={{ color: 'var(--text-primary)' }}>تحويل التاريخ</strong> بين
        النظامين بنقرة واحدة.
      </>
    ),
  },
  {
    icon: Heart,
    title: 'مصمَّم للمستخدم العربي',
    body: (
      <>
        الفارق الجوهري بيننا وبين المواقع المترجمة: محتوانا مكتوب بالعربية من
        البداية ويفهم طريقة بحث المستخدم العربي — سواء كتب{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          &quot;الساعة كم في الرياض&quot;
        </strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          &quot;كم الوقت الآن في دبي&quot;
        </strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          &quot;موعد أذان الفجر القاهرة&quot;
        </strong>
        . تصميم RTL أصيل، سرعة تحميل عالية، وتجربة متكاملة على الجوال — لأن
        معظم زوارنا يصلون من هواتفهم.
      </>
    ),
  },
]

export default function SectionSEOArticle() {
  return (
    <SectionWrapper id="section-about" headingId={H2_ID}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="flex justify-center">
            <SectionBadge><BarChart3 size={11} />عن الموقع</SectionBadge>
          </div>
          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl font-extrabold"
            style={{ color: 'var(--text-primary)' }}
          >
            كل ما تحتاجه عن الوقت في مكان واحد
          </h2>
        </div>

        {/* Article cards — 2-column on md+ */}
        <div className="grid md:grid-cols-2 gap-5">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <card.icon
                  size={16}
                  style={{ color: 'var(--accent-alt)' }}
                  aria-hidden="true"
                />
                <h3
                  className="text-base font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {card.title}
                </h3>
              </div>
              <p
                className="text-sm leading-loose"
                style={{ color: 'var(--text-secondary)' }}
              >
                {card.body}
              </p>
            </article>
          ))}
        </div>

      </div>
    </SectionWrapper>
  )
}
