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
import { Moon, Globe2, Calendar, Heart, BarChart3, Calculator, TrendingUp } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/primitives'
import { SectionBadge } from '@/components/shared/primitives'

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
        <strong style={{ color: 'var(--text-primary)' }}>متى موعد عيد الفطر؟</strong>{' '}
        و
        <strong style={{ color: 'var(--text-primary)' }}>
          {' '}موعد عيد الأضحى المبارك
        </strong>{' '}
        و
        <strong style={{ color: 'var(--text-primary)' }}>
          {' '}كم يوماً شهر رمضان؟
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
    icon: Calculator,
    title: 'حاسبات تخدم نية البحث مباشرة',
    body: (
      <>
        عندما يكتب المستخدم{' '}
        <strong style={{ color: 'var(--text-primary)' }}>حاسبة العمر</strong> أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>حاسبة القسط الشهري</strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>حساب الضريبة 15%</strong>{' '}
        فهو لا يريد مقالاً عاماً، بل نتيجة فورية مع شرح واضح. لهذا صممنا قسم{' '}
        <Link
          href="/calculators"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          الحاسبات
        </Link>{' '}
        ليربط بين الحاسبة والمحتوى المساعد والأسئلة الشائعة، ويقودك بسرعة إلى صفحات مثل{' '}
        <Link
          href="/calculators/age/calculator"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          حاسبة العمر
        </Link>{' '}
        و{' '}
        <Link
          href="/calculators/vat"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          حاسبة ضريبة القيمة المضافة
        </Link>
        .
      </>
    ),
  },
  {
    icon: TrendingUp,
    title: 'اقتصاد حي بلغة يفهمها المتداول العربي',
    body: (
      <>
        كثير من عمليات البحث الاقتصادية تأتي بصيغة وقتية مثل{' '}
        <strong style={{ color: 'var(--text-primary)' }}>هل الذهب مفتوح الآن</strong>{' '}
        أو{' '}
        <strong style={{ color: 'var(--text-primary)' }}>
          متى يفتح السوق الأمريكي بتوقيت السعودية
        </strong>
        . قسم{' '}
        <Link
          href="/economie"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          الاقتصاد
        </Link>{' '}
        يعرض هذه الإجابات مباشرة ويقودك إلى صفحات متخصصة مثل{' '}
        <Link
          href="/economie/us-market-open"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          السوق الأمريكي
        </Link>{' '}
        و{' '}
        <Link
          href="/economie/gold-market-hours"
          style={{ color: 'var(--accent-alt)' }}
          className="font-semibold hover:underline underline-offset-2"
        >
          ساعات الذهب
        </Link>{' '}
        بدل أن يضيع المستخدم بين مواقع أجنبية أو صفحات مبهمة.
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
            الوقت والأدوات اليومية في مكان واحد
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
