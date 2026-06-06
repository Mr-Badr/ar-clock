/**
 * SectionPrayerTimes — Feature section 1  (async Server Component)
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout : Image RIGHT · Text LEFT  (RTL flex-row-reverse)
 *
 * Bridge mode: render this section from a stable default city so the home page
 * stays cacheable. Any viewer-specific location hint happens client-side only.
 */

import Link                      from 'next/link'
import { Qibla, Coordinates }    from 'adhan'
import { Clock, Compass, BookOpen, Bell, Globe2, Moon } from 'lucide-react'

import { calculatePrayerTimes, getNextPrayer } from '@/lib/prayerEngine'
import { getCachedNowIso } from '@/lib/date-utils'

import { SectionWrapper, SectionBadge, FeatureItem } from '@/components/shared/primitives'
import CtaLink             from '@/components/shared/CtaLink'
import PrayerTimesLiveCard from './mockups/PrayerTimesLiveCard.client'

const H2_ID = 'h2-prayer-times'

/* ── Tier 3 fallback: Riyadh ─────────────────────────────────────────────────
 * Why Riyadh (not Mecca):
 *   - Riyadh is the #1 searched city for prayer times in Arabic Google
 *   - It is the capital and most populated Saudi city
 *   - Mecca coordinates are reserved for Qibla (0° = pointing at Mecca)
 */
const RIYADH = {
  lat:          24.6877,
  lon:          46.7219,
  timezone:     'Asia/Riyadh',
  city_name_ar: 'الرياض',
  city_slug:    'riyadh',
  country_code: 'SA',
  country_slug: 'saudi-arabia',
}

/**
 * Arabic compass label for a bearing angle (0–360°).
 * Western digit used for the degree number (numeral rule).
 */
function bearingLabel(deg) {
  const d = ((deg % 360) + 360) % 360
  if (d < 22.5  || d >= 337.5) return 'شمال'
  if (d < 67.5)                 return 'شمال شرق'
  if (d < 112.5)                return 'شرق'
  if (d < 157.5)                return 'جنوب شرق'
  if (d < 202.5)                return 'جنوب'
  if (d < 247.5)                return 'جنوب غرب'
  if (d < 292.5)                return 'غرب'
  return 'شمال غرب'
}

/** Returns e.g. "157° جنوب غرب" or null on error. */
function getQiblaText(lat, lon) {
  try {
    const deg = Math.round(new Qibla(new Coordinates(lat, lon)).direction)
    return `${deg}° ${bearingLabel(deg)}`
  } catch {
    return null
  }
}

function emptyTimes(iso) {
  return { fajr: iso, sunrise: iso, dhuhr: iso, asr: iso, maghrib: iso, isha: iso }
}

/* ── Server Component ─────────────────────────────────────────────────────── */

export default async function SectionPrayerTimes() {
  const city = { ...RIYADH }

  /* ── Prayer times & next prayer ─────────────────────────────────────── */
  const nowIso = await getCachedNowIso()
  const now = new Date(nowIso)

  const times = calculatePrayerTimes({
    lat:         city.lat,
    lon:         city.lon,
    timezone:    city.timezone,
    date:        now,
    countryCode: city.country_code,
    // cacheKey scoped to city so simultaneous users in different cities
    // each get their own cached result
    cacheKey:    `home::prayer::${city.city_slug}`,
  })

  const { nextKey, nextIso } = times
    ? getNextPrayer(times, nowIso)
    : { nextKey: 'dhuhr', nextIso: nowIso }

  /* ── Qibla ───────────────────────────────────────────────────────────── */
  const qiblaText = getQiblaText(city.lat, city.lon)
  const safeTimes = times ?? emptyTimes(nowIso)

  /* ── Build the deep link: /mwaqit-al-salat/[country]/[city] ─────────── */
  const prayerHref = city.country_slug && city.city_slug !== 'unknown'
    ? `/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`
    : '/mwaqit-al-salat'

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <SectionWrapper
      id="section-prayer-times"
      headingId={H2_ID}
    >
      <div className="media-split media-split--reverse">
        <div className="media-split__content">
          <SectionBadge><Moon size={11} />مواقيت الصلاة</SectionBadge>

          <h2
            id={H2_ID}
            className="section-title"
          >
            مواقيت الصلاة الدقيقة
            <span className="text-accent"> لأي مدينة في العالم</span>
          </h2>

          <p className="feature-copy">
            اعرف{' '}
            <strong>أوقات الصلاة اليوم</strong>{' '}
            لمدينتك من غير أن تبحث في أكثر من صفحة. سواء كنت تريد{' '}
            <strong>أذان الفجر في الرياض</strong>،
            أو{' '}
            <strong>موعد صلاة المغرب في القاهرة</strong>،
            أو{' '}
            <strong>وقت العشاء في دبي</strong>،
            ستجد الوقت التالي، جدول اليوم، واتجاه القبلة في نفس المسار.
          </p>

          <ul className="feature-list" role="list" aria-label="مزايا مواقيت الصلاة">
            <FeatureItem icon={Clock}>
              <strong>الصلوات الخمس كاملةً:</strong> الفجر والشروق والظهر والعصر والمغرب
              والعشاء، مع وقت الإمساك والإفطار في رمضان عندما تحتاجه
            </FeatureItem>
            <FeatureItem icon={Compass}>
              <strong>اتجاه القبلة</strong> المحسوب من موقعك بالدرجة والاتجاه الجغرافي الدقيق
            </FeatureItem>
            <FeatureItem icon={BookOpen}>
              دعم كامل لـ<strong> المذاهب الأربعة:</strong> الحنفي، المالكي، الشافعي، الحنبلي
            </FeatureItem>
            <FeatureItem icon={Bell}>
              <strong>تنبيه أذان الصلاة</strong> قبل كل صلاة مباشرةً داخل المتصفح
            </FeatureItem>
            <FeatureItem icon={Globe2}>
              ابحث عن المدينة التي تهمك، ثم راجع طريقة الحساب والتوقيت المحلي قبل الاعتماد على الجدول
            </FeatureItem>
          </ul>

          <div className="action-row">
            <CtaLink href={prayerHref}>
              اعرف مواقيت الصلاة في {city.city_name_ar}
            </CtaLink>
            <Link
              href="/mwaqit-al-salat"
              className="text-link"
            >
              تصفّح جميع المدن ←
            </Link>
          </div>
        </div>

        <div className="media-split__visual">
          <PrayerTimesLiveCard
            cityNameAr={city.city_name_ar}
            times={safeTimes}
            nextKey={nextKey}
            nextIso={nextIso}
            timezone={city.timezone}
            qiblaText={qiblaText}
          />
        </div>

      </div>
    </SectionWrapper>
  )
}
