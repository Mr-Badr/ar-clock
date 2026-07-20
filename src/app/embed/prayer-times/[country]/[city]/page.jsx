/**
 * app/embed/prayer-times/[country]/[city]/page.jsx
 *
 * A chrome-free prayer-times widget meant to be <iframe>-embedded on other
 * sites (mosque pages, forums, Arabic blogs). No nav/footer/ads — those are
 * hidden globally via the `embed-mode` class (see ClientRuntimeMounts.client.jsx
 * + globals.css). This route is intentionally noindex: it's a widget
 * fragment, not a content page competing with the canonical prayer city page.
 *
 * `params` is read inside the Suspense-wrapped child (`EmbedPrayerContent`),
 * never in the page component directly — reading it at the top level blocks
 * the whole route outside Suspense under cacheComponents (see the site-wide
 * PPR "postponed empty page" lesson).
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import { getCachedNowIso } from '@/lib/date-utils';
import { isRenderableCityData } from '@/lib/route-param-validation';
import { getSiteUrl } from '@/lib/site-config';

export const metadata = {
  robots: { index: false, follow: false },
};

const PRAYER_LABELS = [
  { key: 'fajr', label: 'الفجر' },
  { key: 'dhuhr', label: 'الظهر' },
  { key: 'asr', label: 'العصر' },
  { key: 'maghrib', label: 'المغرب' },
  { key: 'isha', label: 'العشاء' },
];

async function EmbedPrayerContent({ params }) {
  const { country: countrySlug, city: citySlug } = await params;

  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const cityData = await getCityBySlug(country.country_code, citySlug);
  if (!cityData || !isRenderableCityData(cityData)) notFound();

  const nowIso = await getCachedNowIso();
  const now = new Date(nowIso);

  const times = calculatePrayerTimes({
    lat: cityData.lat,
    lon: cityData.lon,
    timezone: cityData.timezone,
    date: now,
    countryCode: country.country_code,
    cacheKey: `embed::${countrySlug}::${citySlug}`,
  });

  if (!times) notFound();

  const { nextKey } = getNextPrayer(times, nowIso);
  const siteUrl = getSiteUrl();
  const fullPageHref = `${siteUrl}/mwaqit-al-salat/${countrySlug}/${citySlug}`;

  return (
    <div className="embed-prayer-widget" dir="rtl" lang="ar">
      <div className="embed-prayer-widget__header">
        <span className="embed-prayer-widget__city">{cityData.name_ar}</span>
        <span className="embed-prayer-widget__country">{country.name_ar}</span>
      </div>

      <ul className="embed-prayer-widget__list">
        {PRAYER_LABELS.map(({ key, label }) => (
          <li
            key={key}
            className={`embed-prayer-widget__row${key === nextKey ? ' embed-prayer-widget__row--next' : ''}`}
          >
            <span className="embed-prayer-widget__label">{label}</span>
            <span className="embed-prayer-widget__time">{formatTime(times[key], cityData.timezone)}</span>
          </li>
        ))}
      </ul>

      <a
        className="embed-prayer-widget__attribution"
        href={fullPageHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        مواقيت الصلاة الكاملة من ميقاتنا
      </a>
    </div>
  );
}

function EmbedPrayerFallback() {
  return (
    <div className="embed-prayer-widget" aria-hidden="true">
      <div className="embed-prayer-widget__header">
        <span className="embed-prayer-widget__city">···</span>
      </div>
      <ul className="embed-prayer-widget__list">
        {PRAYER_LABELS.map(({ key }) => (
          <li key={key} className="embed-prayer-widget__row">
            <span className="embed-prayer-widget__label">···</span>
            <span className="embed-prayer-widget__time">--:--</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrayerTimesEmbedPage({ params }) {
  return (
    <Suspense fallback={<EmbedPrayerFallback />}>
      <EmbedPrayerContent params={params} />
    </Suspense>
  );
}
