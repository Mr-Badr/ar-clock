import Link from 'next/link'
import { ArrowLeft, BookOpenText, CalendarDays } from 'lucide-react'
import { SectionBadge, SectionWrapper } from '@/components/shared/primitives'
import { ALL_GUIDES } from '@/lib/guides/data'

const H2_ID = 'h2-latest-guides'
const ARABIC_DATE_FORMATTER = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function getGuideTimestamp(guide) {
  const rawTimestamp = guide.updatedAt || guide.publishedAt
  const timestamp = rawTimestamp ? Date.parse(rawTimestamp) : Number.NaN

  if (Number.isNaN(timestamp)) {
    return 0
  }

  return timestamp
}

function formatGuideDate(guide) {
  const rawTimestamp = guide.updatedAt || guide.publishedAt

  if (!rawTimestamp) {
    return 'من دون تاريخ مراجعة ظاهر'
  }

  const parsedDate = new Date(rawTimestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'من دون تاريخ مراجعة ظاهر'
  }

  return ARABIC_DATE_FORMATTER.format(parsedDate)
}

const LATEST_GUIDES = [...ALL_GUIDES]
  .sort((leftGuide, rightGuide) => getGuideTimestamp(rightGuide) - getGuideTimestamp(leftGuide))
  .slice(0, 4)

export default function SectionSEOArticle() {
  if (LATEST_GUIDES.length === 0) {
    return (
      <SectionWrapper id="section-latest-guides" headingId={H2_ID} subtle>
        <div className="section-head section-head--center">
          <SectionBadge><BookOpenText size={11} />أحدث المقالات</SectionBadge>
          <h2 id={H2_ID} className="section-title">
            سنضيف هنا المقالات العملية الأحدث
          </h2>
          <p className="section-copy">
            عندما تكتمل مسارات المقالات ستظهر هنا أحدث الصفحات التي تشرح السؤال
            ثم تنقلك إلى الأداة المناسبة.
          </p>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="section-latest-guides" headingId={H2_ID} subtle>
      <div className="content-measure-wide">
        <header className="section-head section-head--center">
          <SectionBadge><BookOpenText size={11} />أحدث المقالات</SectionBadge>
          <h2
            id={H2_ID}
            className="section-title"
          >
            ابدأ من المقال حين تحتاج
            <span className="text-accent"> فهماً أوضح قبل استخدام الأداة</span>
          </h2>
          <p className="section-copy">
            هذه القراءات تبدأ من سؤال شائع ثم تشرح الفكرة بلغة مباشرة وتربطك بالأداة
            أو المسار العملي الذي يكمل القرار أو المهمة.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {LATEST_GUIDES.map((guide) => (
            <article key={guide.href} className="feature-card">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                <span className="badge badge-default">{guide.badge || 'مقال عملي'}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={12} aria-hidden="true" />
                  {formatGuideDate(guide)}
                </span>
              </div>

              <h3 className="section-card-title mb-2">{guide.title}</h3>
              <p className="section-card-copy mb-4">{guide.description}</p>

              {guide.summary?.value ? (
                <p className="mb-4 text-sm leading-8 text-secondary">
                  <strong className="text-primary">{guide.summary.label || 'الجواب السريع'}:</strong>{' '}
                  {guide.summary.value}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                <span>{guide.hubTitle || 'مسار عملي'}</span>
                {guide.authorName ? <span>{guide.authorName}</span> : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link href={guide.href} className="text-link">
                  اقرأ المقال
                </Link>
                {guide.hubHref ? (
                  <Link href={guide.hubHref} className="section-card-action">
                    افتح المسار المرتبط
                    <ArrowLeft size={15} aria-hidden="true" />
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
