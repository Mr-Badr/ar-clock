/**
 * SectionHolidays — Feature section 3  (async Server Component)
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout : Image RIGHT · Text LEFT  (RTL flex-row-reverse)
 *
 * DESIGN DECISION — Universal Islamic occasions only:
 *   This section intentionally does NOT detect the user's country.
 *   Reason: national holidays (e.g. Saudi National Day, UAE National Day)
 *   are only relevant to residents of that specific country.
 *
 *   Instead, we show the 5 Islamic occasions that EVERY Arabic-speaking
 *   Muslim knows and searches for, regardless of nationality:
 *     1. عيد الفطر   — most searched Arabic Islamic query globally
 *     2. عيد الأضحى  — #2 most searched
 *     3. شهر رمضان   — #3 most searched ("كم باقي على رمضان")
 *     4. يوم عرفة    — closely tied to Hajj, very high search volume
 *     5. المولد النبوي — widely observed across all Arab countries
 *
 *   All 5 use `_countryCode: 'SA'` (Umm al-Qura method) as the calendar
 *   calculation method — this gives the highest-accuracy Islamic dates
 *   while remaining neutral across all nationalities.
 *
 * DATA FLOW:
 *   resolveAllHijriEvents (hijri-resolver.js) → AlAdhan API → cached 24h
 *   → serialisable props → HolidaysLiveCard (Client Component)
 *   → days-remaining computed in browser via JS arithmetic
 *
 * FALLBACK: API failure → static far-future dates (section never breaks).
 */

import { Moon, Star, Calendar, Bell } from 'lucide-react'

import { resolveAllHijriEvents } from '@/lib/hijri-resolver'

import { SectionWrapper, SectionBadge, FeatureItem } from '@/components/shared/primitives'
import CtaLink          from '@/components/shared/CtaLink'
import HolidaysLiveCard from './mockups/HolidaysLiveCard.client'

const H2_ID = 'h2-holidays'

/* ── Universal Islamic occasions ─────────────────────────────────────────────
 *
 * These 5 occasions are deliberately country-agnostic — every Arabic-speaking
 * Muslim searches for these regardless of where they live.
 *
 * `_countryCode: 'SA'` is the CALCULATION METHOD selector (Umm al-Qura),
 * not a filter for Saudi users. It produces the most accurate Hijri dates
 * and is the internationally accepted reference for Islamic calendars.
 *
 * Note on `accuracy`:
 *   The AlAdhan API returns accuracy metadata. For countries that use local
 *   moon sighting instead of Umm al-Qura, dates may differ by ±1 day.
 *   The HolidaysLiveCard shows a note for 'medium' accuracy dates.
 */
const OCCASION_DEFS = [
  {
    slug:         'eid-fitr',
    type:         'hijri',
    hijriMonth:   10,
    hijriDay:     1,
    _countryCode: 'SA',            // Umm al-Qura calculation method
    name:         'عيد الفطر المبارك',
    hijriLabel:   '1 شوال',
    badgeType:    'عيد',
    icon:         '🎉',
    color:        'var(--success)',
    softBg:       'var(--success-soft)',
  },
  {
    slug:         'eid-adha',
    type:         'hijri',
    hijriMonth:   12,
    hijriDay:     10,
    _countryCode: 'SA',
    name:         'عيد الأضحى المبارك',
    hijriLabel:   '10 ذو الحجة',
    badgeType:    'عيد',
    icon:         '🐑',
    color:        'var(--success)',
    softBg:       'var(--success-soft)',
  },
  {
    slug:         'ramadan',
    type:         'hijri',
    hijriMonth:   9,
    hijriDay:     1,
    _countryCode: 'SA',
    name:         'شهر رمضان المبارك',
    hijriLabel:   '1 رمضان',
    badgeType:    'صيام',
    icon:         '🌙',
    color:        'var(--warning)',
    softBg:       'var(--warning-soft)',
  },
  {
    slug:         'arafat',
    type:         'hijri',
    hijriMonth:   12,
    hijriDay:     9,
    _countryCode: 'SA',
    name:         'يوم عرفة',
    hijriLabel:   '9 ذو الحجة',
    badgeType:    'حج',
    icon:         '🕋',
    color:        'var(--accent-alt)',
    softBg:       'var(--accent-alt-soft)',
  },
  {
    slug:         'mawlid',
    type:         'hijri',
    hijriMonth:   3,
    hijriDay:     12,
    _countryCode: 'SA',
    name:         'المولد النبوي الشريف',
    hijriLabel:   '12 ربيع الأول',
    badgeType:    'ديني',
    icon:         '🌹',
    color:        'var(--info)',
    softBg:       'var(--info-soft)',
  },
]

/* Static fallback — rendered if AlAdhan API is unreachable */
const FALLBACK_OCCASIONS = OCCASION_DEFS.map((def) => ({
  slug:      def.slug,
  name:      def.name,
  isoDate:   '2099-01-01',   // far future — obviously a loading state
  hijriDate: def.hijriLabel,
  type:      def.badgeType,
  icon:      def.icon,
  color:     def.color,
  softBg:    def.softBg,
  accuracy:  'low',
  note:      'تعذّر الاتصال بالخادم — التاريخ تقديري.',
}))

/* ── Server Component ─────────────────────────────────────────────────────── */

export default async function SectionHolidays() {
  let occasions = FALLBACK_OCCASIONS

  try {
    /* resolveAllHijriEvents is cached 24h via cacheTag('hijri-events')
     * in hijri-resolver.js — no redundant API calls on every request. */
    const resolved = await resolveAllHijriEvents(OCCASION_DEFS)

    const built = OCCASION_DEFS.map((def) => {
      const r = resolved[def.slug]
      if (!r?.isoString) {
        return FALLBACK_OCCASIONS.find((f) => f.slug === def.slug) ?? null
      }

      /* Approximate Hijri year from Gregorian year.
       * hijri-utils.js formula: (G - 622) × (365.25 / 354.37)
       * Western digits — numeral rule. */
      const gYear     = new Date(r.isoString).getFullYear()
      const hYear     = Math.round((gYear - 622) * (365.25 / 354.37))
      const hijriDate = `${def.hijriLabel} ${hYear}`

      return {
        slug:      def.slug,
        name:      def.name,
        isoDate:   r.isoString,      // 'YYYY-MM-DD'
        hijriDate,
        type:      def.badgeType,
        icon:      def.icon,
        color:     def.color,
        softBg:    def.softBg,
        accuracy:  r.accuracy ?? 'high',
        note:      r.note     ?? null,
      }
    }).filter(Boolean)

    /* Sort nearest first — most useful card ordering for the user */
    built.sort(
      (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime(),
    )

    if (built.length > 0) occasions = built
  } catch {
    /* API unavailable — fallback already set */
  }

  /* ─────────────────────────────────────────────────────────────────────── */
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
      {/* RTL flex-row-reverse: DOM [Text, Card] → Text LEFT, Card RIGHT ✓ */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* ── Text column — LEFT on desktop ──────────────────────────── */}
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
                background:           'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              الدينية والإسلامية
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            دليل شامل بـ
            <strong style={{ color: 'var(--text-primary)' }}> الأعياد الإسلامية الكبرى</strong>{' '}
            التي يعرفها كل مسلم — عيد الفطر، عيد الأضحى، رمضان، يوم عرفة، والمولد
            النبوي. مع{' '}
            <strong style={{ color: 'var(--text-primary)' }}>عداد تنازلي دقيق</strong>{' '}
            بالتاريخين{' '}
            <strong style={{ color: 'var(--text-primary)' }}>الهجري والميلادي</strong>{' '}
            لكل مناسبة.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا قسم المناسبات">
            <FeatureItem icon={Moon}>
              <strong>المناسبات الإسلامية الكبرى:</strong> رمضان، عيد الفطر، عيد الأضحى،
              يوم عرفة، ليلة القدر، والمولد النبوي الشريف
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
            <CtaLink href="/holidays">استعرض جميع المناسبات والأعياد</CtaLink>
          </div>
        </div>

        {/* ── Live holidays card — RIGHT on desktop ──────────────────── */}
        <div className="w-full md:w-1/2 flex justify-center">
          <HolidaysLiveCard occasions={occasions} />
        </div>

      </div>
    </SectionWrapper>
  )
}
