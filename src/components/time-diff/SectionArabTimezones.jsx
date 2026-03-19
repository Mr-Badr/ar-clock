/**
 * SectionArabTimezones  — Server Component
 *
 * Renders the static shell (heading, sub-copy, SEO schema) then hydrates
 * ArabTimezonesLiveClient for all interactive logic.
 *
 * SEO targets:
 *   توقيت الدول العربية · توقيت العالم · UTC الدول العربية · GMT الدول العربية
 *   توقيت السعودية · توقيت مصر · توقيت الأردن · توقيت لندن · توقيت باكستان
 *   توقيت باريس · توقيت الهند · توقيت نيويورك · فرق التوقيت مع المغرب …
 */

import { Suspense }                        from 'react'
import Link                                from 'next/link'
import { Globe2, Info }                    from 'lucide-react'
import { SectionWrapper, SectionBadge }   from './shared/primitives'
import { TIMEZONE_GROUPS }                 from './data/arabTimezones'
import ArabTimezonesLiveClient             from './ArabTimezonesLiveClient'

const H2_ID = 'h2-arab-timezones'

export default function SectionArabTimezones() {
  return (
    <SectionWrapper id="section-arab-timezones" headingId={H2_ID}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

          <div className="space-y-2">
            <SectionBadge>
              <Globe2 size={11} />
              المناطق الزمنية
            </SectionBadge>

            <h2
              id={H2_ID}
              className="text-2xl sm:text-3xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              توقيت الدول العربية والعالم{' '}
              <span
                style={{
                  background:           'var(--accent-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                }}
              >
                نسبةً لـ UTC / GMT
              </span>
            </h2>

            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              جدول مرجعي شامل بتوقيت جميع الدول العربية والدول الأكثر بحثاً — الأوقات
              تتحدث تلقائياً · اضغط على أي دولة لعرض توقيتها الكامل
            </p>
          </div>

          {/* DST legend */}
          <div
            className="flex items-center gap-2 shrink-0 rounded-xl px-3 py-2 self-start sm:self-end"
            style={{
              background: 'var(--bg-surface-2)',
              border:     '1px solid var(--border-subtle)',
            }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: 'var(--warning)' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              DST = تُطبّق التوقيت الصيفي
            </span>
          </div>
        </div>
      </header>

      {/* ── Live interactive section ────────────────────────────────── */}
      <Suspense
        fallback={
          <div
            className="animate-pulse rounded-2xl"
            style={{
              height: '320px',
              background: 'var(--bg-surface-2)',
            }}
            aria-label="جارٍ تحميل جدول التوقيت…"
          />
        }
      >
        <ArabTimezonesLiveClient groups={TIMEZONE_GROUPS} />
      </Suspense>

      {/* ── Explanatory note ────────────────────────────────────────── */}
      <div
        className="mt-8 flex items-start gap-3 rounded-2xl p-4"
        style={{
          background: 'var(--bg-surface-2)',
          border:     '1px solid var(--border-subtle)',
        }}
      >
        <Info
          size={16}
          className="shrink-0 mt-0.5"
          style={{ color: 'var(--info)' }}
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>ملاحظة:</strong>{' '}
          إزاحة UTC المعروضة هي القيمة القياسية (الشتوية). الدول المُعلَّمة بـ{' '}
          <strong style={{ color: 'var(--warning)' }}>DST</strong> تزيد ساعةً في الصيف.
          المغرب يعود لـ UTC+0 خلال رمضان رغم تطبيق DST بقية العام.
          الأردن وسوريا ثبّتا توقيتهما على UTC+3 نهائياً منذ 2022.
          <Link
            href="/time-difference"
            className="font-semibold me-1 transition-colors"
            style={{ color: 'var(--accent-alt)' }}
          >
            {' '}احسب فرق التوقيت الصحيح ←
          </Link>
        </p>
      </div>

    </SectionWrapper>
  )
}