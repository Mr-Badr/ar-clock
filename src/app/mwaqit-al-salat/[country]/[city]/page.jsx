/**
 * app/mwaqit-al-salat/[country]/[city]/page.jsx
 *
 * ─── Why the page was showing ƒ (Dynamic) instead of ● (Static) ───────────
 *
 * `headers()` was being called in BOTH `generateMetadata` AND the page shell.
 * Calling `headers()` anywhere in a route — including metadata — opts the
 * ENTIRE route into dynamic rendering, overriding `generateStaticParams`.
 *
 * Fix:
 *  - `generateMetadata`: removed `await headers()`. Metadata is computed from
 *    `cityData` alone (no request-time headers needed for SEO values).
 *  - Page shell `PrayerTimesPage`: no headers() call here either.
 *  - `PrayerTimesContent` (sub-component): `headers()` stays here ONLY.
 *    This sub-component is inside <Suspense> so Next.js can stream it
 *    dynamically while the shell remains statically cached.
 *
 * Result: shell is statically generated at build time (● Static ISR),
 * prayer times content streams in per-request for freshness.
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import { findCityBySlug, getTopSeedCities } from '@/lib/cityService';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCity.client';
import TimezoneBanner from '@/components/TimezoneBanner.client';

// ─── ISR: pre-build top 100 cities, revalidate every 60s ─────────────────────

export const revalidate = 60;

export function generateStaticParams() {
  return getTopSeedCities(100).map(c => ({
    country: c.country_slug,
    city:    c.city_slug,
  }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
// No headers() call here — keeps the route statically cacheable

export async function generateMetadata({ params }) {
  const { country, city } = await params;
  const cityData = await findCityBySlug(country, city);
  if (!cityData) return {};

  // Compute prayer times using a fixed "now" snapshot for metadata
  // (exact time doesn't matter for SEO — city name + prayer names matter)
  const now = new Date();
  now.setMilliseconds(0);

  const times = calculatePrayerTimes({
    lat:      cityData.lat,
    lon:      cityData.lon,
    timezone: cityData.timezone,
    date:     now,
    cacheKey: `meta::${country}::${city}`,
  });

  let nextPrayerHint = '';
  if (times) {
    const { nextKey, nextIso } = getNextPrayer(times, now.toISOString());
    const AR = {
      fajr: 'الفجر', dhuhr: 'الظهر',
      asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء',
    };
    nextPrayerHint = ` — ${AR[nextKey] ?? nextKey}: ${formatTime(nextIso, cityData.timezone)}`;
  }

  const title       = `مواقيت الصلاة في ${cityData.city_name_ar}، ${cityData.country_name_ar} — اليوم`;
  const description = `أوقات الصلاة الدقيقة في ${cityData.city_name_ar} اليوم${nextPrayerHint}. الفجر والظهر والعصر والمغرب والعشاء.`;
  const canonical   = `https://waqt.app/mwaqit-al-salat/${country}/${city}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type:   'website',
      locale: 'ar_SA',
      url:    canonical,
    },
    twitter: {
      card:        'summary',
      title,
      description,
    },
  };
}

// ─── JSON-LD structured data ──────────────────────────────────────────────────

function PrayerTimesJsonLd({ cityData }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'Place',
    name:       cityData.city_name_ar,
    address: {
      '@type':          'PostalAddress',
      addressLocality:  cityData.city_name_ar,
      addressCountry:   cityData.country_name_ar,
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:   cityData.lat,
      longitude:  cityData.lon,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Prayer labels ────────────────────────────────────────────────────────────

const PRAYER_AR = {
  fajr:    'الفجر',
  sunrise: 'الشروق',
  dhuhr:   'الظهر',
  asr:     'العصر',
  maghrib: 'المغرب',
  isha:    'العشاء',
};

// ─── Page shell (statically cached) ──────────────────────────────────────────
// No headers() here — this function must stay free of dynamic APIs
// so Next.js can cache it at build time via generateStaticParams.

export default async function PrayerTimesPage({ params }) {
  const { country, city } = await params;
  const cityData = await findCityBySlug(country, city);
  if (!cityData) notFound();

  return (
    <div className="min-h-screen bg-base" dir="rtl">
      <TimezoneBanner />
      <main className="max-w-[600px] mx-auto px-4 pt-24 pb-32">

        {/* Static parts render immediately from cache */}
        <PrayerTimesJsonLd cityData={cityData} />

        <nav
          aria-label="مسار التنقل"
          className="text-xs text-muted mb-6 hidden sm:flex items-center gap-1"
        >
          <a href="/" className="hover:text-accent transition-colors">الرئيسية</a>
          <span aria-hidden="true">›</span>
          <span>{cityData.country_name_ar}</span>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{cityData.city_name_ar}</span>
        </nav>

        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2 leading-tight">
            مواقيت الصلاة في{' '}
            <span className="text-accent">{cityData.city_name_ar}</span>
          </h1>
          <p className="text-muted text-sm">{cityData.country_name_ar}</p>
        </header>

        <div className="mb-8">
          <SearchCity
            placeholder="البحث عن مدينة أخرى..."
            initialCity={cityData}
          />
          <p className="mt-2 text-[10px] font-bold text-[var(--accent)] pr-1">
            محدد حالياً: {cityData.city_name_ar}، {cityData.country_name_ar}
          </p>
        </div>

        {/* Dynamic content streams in per-request inside Suspense */}
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-72 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
              <div className="h-64 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
            </div>
          }
        >
          <PrayerTimesContent country={country} city={city} cityData={cityData} />
        </Suspense>

      </main>
    </div>
  );
}

// ─── Dynamic content (opts into per-request rendering via headers()) ──────────
// Isolated in its own async component so only this sub-tree is dynamic.
// The page shell above remains statically cached.

async function PrayerTimesContent({ country, city, cityData }) {
  await headers(); // opts this sub-tree into dynamic rendering only

  const now = new Date();

  const times = calculatePrayerTimes({
    lat:      cityData.lat,
    lon:      cityData.lon,
    timezone: cityData.timezone,
    date:     now,
    cacheKey: `${country}::${city}`,
  });

  if (!times) {
    return (
      <p className="text-danger text-center py-12">
        عذراً، تعذّر حساب أوقات الصلاة.
      </p>
    );
  }

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, now.toISOString());
  const fajrStr    = formatTime(times.fajr,    cityData.timezone);
  const maghribStr = formatTime(times.maghrib, cityData.timezone);
  const todayLabel = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  return (
    <>
      {/* Countdown hero */}
      <section className="card card--accent mb-6">
        <PrayerHeroClient
          nextPrayerKey={nextKey}
          nextPrayerIso={nextIso}
          prevPrayerIso={prevIso}
          timezone={cityData.timezone}
        />
      </section>

      {/* Prayer times list */}
      <section className="card mb-6" aria-label="مواقيت الصلاة اليوم">
        <div className="card__header">
          <h2 className="card__title">مواقيت الصلاة اليوم</h2>
          <span className="badge badge-accent">{todayLabel}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {Object.entries(times).map(([key, isoStr]) => {
            const isNext  = key === nextKey;
            const timeStr = formatTime(isoStr, cityData.timezone, false);
            return (
              <div
                key={key}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'space-between',
                  padding:        'var(--space-4) var(--space-2)',
                  borderRadius:   'var(--radius-md)',
                  background:     isNext ? 'var(--accent-soft)' : 'transparent',
                  borderRight:    isNext ? '3px solid var(--accent)' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {isNext && <span className="badge badge-accent">القادمة</span>}
                  <span style={{
                    color:      isNext ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: 'var(--font-bold)',
                    fontSize:   'var(--text-lg)',
                  }}>
                    {PRAYER_AR[key] ?? key}
                  </span>
                </div>
                <time
                  dateTime={isoStr}
                  dir="ltr"
                  style={{
                    color:      isNext ? 'var(--accent)' : 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontWeight: 'var(--font-bold)',
                    fontSize:   'var(--text-xl)',
                  }}
                >
                  {timeStr}
                </time>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coordinates note */}
      <section className="card-nested mb-6 text-sm text-secondary">
        <p>
          تُعرض مواقيت الصلاة في {cityData.city_name_ar} بناءً على
          الإحداثيات ({cityData.lat.toFixed(4)}°،{' '}
          {cityData.lon.toFixed(4)}°) والمنطقة الزمنية {cityData.timezone}.
        </p>
      </section>

      {/* FAQ */}
      <section className="card mb-6" aria-label="أسئلة شائعة">
        <h2 className="card__title mb-4">أسئلة شائعة</h2>
        <div className="flex flex-col gap-4">
          <details className="card-nested">
            <summary className="cursor-pointer font-semibold">
              متى وقت الفجر في {cityData.city_name_ar} اليوم؟
            </summary>
            <p className="mt-2">
              وقت الفجر في {cityData.city_name_ar} اليوم هو {fajrStr}.
            </p>
          </details>
          <details className="card-nested">
            <summary className="cursor-pointer font-semibold">
              متى وقت المغرب في {cityData.city_name_ar} اليوم؟
            </summary>
            <p className="mt-2">
              وقت المغرب في {cityData.city_name_ar} اليوم هو {maghribStr}.
            </p>
          </details>
          <details className="card-nested">
            <summary className="cursor-pointer font-semibold">
              كيف تُحسب مواقيت الصلاة؟
            </summary>
            <p className="mt-2">
              تُحسب مواقيت الصلاة بناءً على إحداثيات المدينة وزاوية الشمس
              وفق المعايير الفلكية المعتمدة من رابطة العالم الإسلامي
              والهيئات الدينية المعتمدة.
            </p>
          </details>
        </div>
      </section>
    </>
  );
}