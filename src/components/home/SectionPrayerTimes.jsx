/**
 * SectionPrayerTimes — Feature section 1  (async Server Component)
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout : Image RIGHT · Text LEFT  (RTL flex-row-reverse)
 *
 * LOCATION DETECTION — 3-tier cascade, stops at the first hit:
 *
 *  Tier 1 — IP address  (most accurate: real city from our DB)
 *    • Read `x-forwarded-for` header → extract client IP
 *    • Fetch ip-api.com to get lat/lon (same source used in /api/ip-city)
 *    • Call getNearestCityAction(lat, lon) → geodesic DB lookup
 *    • Result: exact city slug + Arabic name + real timezone
 *    • Cached: ip-api response revalidates every hour per unique IP
 *
 *  Tier 2 — IANA timezone header  (good: nearest city per timezone)
 *    • Read `x-timezone` (middleware) or `cf-timezone` (Cloudflare)
 *    • Call mapTimezoneToCityAction(tz) → seed-file city lookup
 *    • Covers users behind proxies or CDN edge nodes
 *
 *  Tier 3 — Riyadh, Saudi Arabia  (safe default)
 *    • Used when both Tier 1 and Tier 2 fail (rare, e.g. localhost dev)
 *    • Riyadh is the most searched city for prayer times in Arabic search
 *
 * DATA SERIALISATION RULE:
 *   Only ISO strings + primitives cross the server→client boundary.
 *   Never pass Date objects — they are not serialisable.
 *
 * SEO: text column is unchanged — all keyword density preserved.
 */

import { headers }               from 'next/headers'
import Link                      from 'next/link'
import { Qibla, Coordinates }    from 'adhan'
import { Clock, Compass, BookOpen, Bell, Globe2, Moon } from 'lucide-react'

import { calculatePrayerTimes, getNextPrayer } from '@/lib/prayerEngine'
import { resolveRequestLocationFromHeaders } from '@/lib/locationService'

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

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/**
 * Normalise any city object returned from DB actions into a consistent shape.
 * Accepts the raw shape from both getNearestCityAction and mapTimezoneToCityAction.
 */
function normaliseCity(raw, fallbackTz) {
  if (!raw?.lat || !raw?.lon) return null
  return {
    lat:          Number(raw.lat),
    lon:          Number(raw.lon),
    timezone:     raw.timezone     || raw.tz          || fallbackTz || 'Asia/Riyadh',
    city_name_ar: raw.city_name_ar || raw.name_ar     || raw.name   || RIYADH.city_name_ar,
    city_slug:    raw.city_slug    || raw.slug        || 'unknown',
    country_code: raw.country_code || raw.countryCode || 'SA',
    country_slug: raw.country_slug || '',
  }
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
  const h   = await headers()
  let city  = { ...RIYADH }

  /* Shared server-side resolver: headers → IP lookup → timezone/country fallback */
  try {
    const resolvedCity = await resolveRequestLocationFromHeaders(h)
    if (resolvedCity) city = normaliseCity(resolvedCity, resolvedCity.timezone)
  } catch {
    /* Any unexpected error: keep RIYADH default */
  }

  /* ── Prayer times & next prayer ─────────────────────────────────────── */
  const nowIso = new Date().toISOString()

  const times = calculatePrayerTimes({
    lat:         city.lat,
    lon:         city.lon,
    timezone:    city.timezone,
    date:        new Date(),
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
      glow={
        <div
          className="pointer-events-none absolute top-0 start-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full blur-3xl opacity-[0.07]"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      }
    >
      {/* RTL flex-row-reverse: DOM [Text, Card] → Text LEFT, Card RIGHT ✓ */}
      <div className="flex flex-col md:flex-row-reverse items-center gap-10 lg:gap-16">

        {/* ── Text column — LEFT on desktop ──────────────────────────── */}
        <div className="w-full md:w-1/2 space-y-5">
          <SectionBadge><Moon size={11} />مواقيت الصلاة</SectionBadge>

          <h2
            id={H2_ID}
            className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            مواقيت الصلاة الدقيقة
            <span
              className="block"
              style={{
                background:           'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}
            >
              لأي مدينة في العالم
            </span>
          </h2>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            احصل على{' '}
            <strong style={{ color: 'var(--text-primary)' }}>أوقات الصلاة اليوم</strong>{' '}
            بدقة فلكية متناهية لأي مدينة. سواء كنت تبحث عن{' '}
            <strong style={{ color: 'var(--text-primary)' }}>أذان الفجر في الرياض</strong>،
            أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>موعد صلاة المغرب في القاهرة</strong>،
            أو{' '}
            <strong style={{ color: 'var(--text-primary)' }}>وقت العشاء في دبي</strong> —
            الموقع يحتسب المواقيت وفق إحداثياتك الجغرافية الدقيقة.
          </p>

          <ul className="space-y-3" role="list" aria-label="مزايا مواقيت الصلاة">
            <FeatureItem icon={Clock}>
              <strong>الصلوات الخمس كاملةً:</strong> الفجر والشروق والظهر والعصر والمغرب
              والعشاء — مع وقت الإمساك والإفطار في رمضان
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
              تغطية{' '}
              <strong>أكثر من 3 ملايين مدينة</strong> حول العالم مع 12 طريقة حساب وبيانات
              محدَّثة آنياً
            </FeatureItem>
          </ul>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Deep-link to the user's exact city page */}
            <CtaLink href={prayerHref}>
              اعرف مواقيت الصلاة في {city.city_name_ar}
            </CtaLink>
            <Link
              href="/mwaqit-al-salat"
              className="text-sm font-semibold transition-colors"
              style={{ color: 'var(--accent-alt)' }}
            >
              تصفّح جميع المدن  ←
            </Link>
          </div>
        </div>

        {/* ── Live prayer times card — RIGHT on desktop ──────────────── */}
        <div className="w-full md:w-1/2 flex justify-center">
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
