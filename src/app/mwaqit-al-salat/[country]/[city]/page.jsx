/**
 * app/mwaqit-al-salat/[country]/[city]/page.jsx
 *
 * Production Arabic-first prayer times page.
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { findCityBySlug, getTopSeedCities } from '@/lib/cityService';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCity.client';
import TimezoneBanner from '@/components/TimezoneBanner.client';
import { Suspense } from 'react';

// ─── ISR Config ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getTopSeedCities(100).map(c => ({
    country: c.country_slug,
    city: c.city_slug,
  }));
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { country, city } = await params;
  const cityData = await findCityBySlug(country, city);
  if (!cityData) return {};

  await headers();
  const now = new Date();
  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now,
    cacheKey: `${country}::${city}`
  });

  let nextPrayerHint = '';
  if (times) {
    const { nextKey, nextIso } = getNextPrayer(times, now.toISOString());
    const AR = { fajr: 'الفجر', dhuhr: 'الظهر', asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء' };
    const timeStr = formatTime(nextIso, cityData.timezone);
    nextPrayerHint = ` — ${AR[nextKey] || nextKey}: ${timeStr}`;
  }

  const title = `مواقيت الصلاة في ${cityData.city_name_ar}، ${cityData.country_name_ar} — اليوم`;
  const description = `أوقات الصلاة الدقيقة في ${cityData.city_name_ar} اليوم${nextPrayerHint}.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
  };
}

const PRAYER_AR = {
  fajr: 'الفجر', sunrise: 'الشروق', dhuhr: 'الظهر',
  asr: 'العصر', maghrib: 'المغرب', isha: 'العشاء'
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PrayerTimesPage({ params }) {
  const { country, city } = await params;
  const cityData = await findCityBySlug(country, city);
  if (!cityData) notFound();

  return (
    <div className="min-h-screen bg-base" dir="rtl">
      <TimezoneBanner />
      <main className="max-w-[600px] mx-auto px-4 pt-24 pb-32">
        <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />}>
          <DynamicPrayerTimes params={params} cityData={cityData} />
        </Suspense>
      </main>
    </div>
  );
}

// ─── Dynamic Sub-component ───
async function DynamicPrayerTimes({ params, cityData }) {
  const { country, city } = await params;
  await headers();
  const now = new Date();
  const times = calculatePrayerTimes({
    lat: cityData.lat, lon: cityData.lon,
    timezone: cityData.timezone, date: now,
    cacheKey: `${country}::${city}`
  });

  if (!times) {
    return <p className="text-danger text-center">عذراً، تعذّر حساب أوقات الصلاة.</p>;
  }

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, now.toISOString());
  const fajrStr = formatTime(times.fajr, cityData.timezone);
  const maghribStr = formatTime(times.maghrib, cityData.timezone);

  return (
    <>
      <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 hidden sm:flex items-center gap-1">
        <a href="/" className="hover:text-accent transition-colors">الرئيسية</a>
        <span>›</span>
        <span>{cityData.country_name_ar}</span>
        <span>›</span>
        <span className="text-secondary">{cityData.city_name_ar}</span>
      </nav>

      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-primary mb-2 leading-tight">
          مواقيت الصلاة في <span className="text-accent">{cityData.city_name_ar}</span>
        </h1>
        <p className="text-muted text-sm">{cityData.country_name_ar}</p>
      </header>

      <div className="mb-8">
        <SearchCity placeholder={`البحث عن مدينة أخرى...`} />
      </div>

      <section className="card card--accent mb-6">
        <PrayerHeroClient
          nextPrayerKey={nextKey}
          nextPrayerIso={nextIso}
          prevPrayerIso={prevIso}
          timezone={cityData.timezone}
        />
      </section>

      <section className="card mb-6">
        <div className="card__header">
          <h2 className="card__title">مواقيت الصلاة اليوم</h2>
          <span className="badge badge-accent">
            {now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {Object.entries(times).map(([key, isoStr]) => {
            const isNext = key === nextKey;
            const timeStr = formatTime(isoStr, cityData.timezone, false);
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--space-4) var(--space-2)', borderRadius: 'var(--radius-md)',
                background: isNext ? 'var(--accent-soft)' : 'transparent',
                borderRight: isNext ? '3px solid var(--accent)' : '3px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {isNext && <span className="badge badge-accent">القادمة</span>}
                  <span style={{ color: isNext ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-lg)' }}>
                    {PRAYER_AR[key]}
                  </span>
                </div>
                <time dateTime={isoStr} dir="ltr" style={{ color: isNext ? 'var(--accent)' : 'var(--text-primary)', fontFamily: 'monospace', fontWeight: 'var(--font-bold)', fontSize: 'var(--text-xl)' }}>
                  {timeStr}
                </time>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-nested mb-6 text-sm text-secondary">
        <p>تُعرض مواقيت الصلاة في {cityData.city_name_ar} بناءً على الإحداثيات ({cityData.lat.toFixed(4)}°، {cityData.lon.toFixed(4)}°) والمنطقة الزمنية {cityData.timezone}.</p>
      </section>

      <section className="card mb-6">
        <h2 className="card__title mb-4">أسئلة شائعة</h2>
        <div className="flex flex-col gap-4">
          <details className="card-nested">
            <summary className="cursor-pointer font-semibold">متى وقت الفجر اليوم؟</summary>
            <p className="mt-2">وقت الفجر هو {fajrStr}.</p>
          </details>
          <details className="card-nested">
            <summary className="cursor-pointer font-semibold">متى وقت المغرب اليوم؟</summary>
            <p className="mt-2">وقت المغرب هو {maghribStr}.</p>
          </details>
        </div>
      </section>
    </>
  );
}
