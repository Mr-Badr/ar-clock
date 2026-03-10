/**
 * app/mwaqit-al-salat/[country]/page.jsx
 * 
 * Country-level prayer times page.
 * Displays a list of cities in the country and redirects to the capital by default.
 */

import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getCountryBySlug, getAllCountrySlugs } from '@/lib/db/queries/countries';
import { getCitiesByCountry, getCapitalCity } from '@/lib/db/queries/cities';
import { getCountriesAction } from '@/app/actions/location';
import { calculatePrayerTimes, getNextPrayer, formatTime } from '@/lib/prayerEngine';
import PrayerHeroClient from '@/components/PrayerHero.client';
import SearchCity from '@/components/SearchCityWrapper.client';
import CityPrayerCardsGrid from '@/components/mwaqit/CityPrayerCardsGrid.client';
import MonthlyPrayerCalendar from '@/components/mwaqit/MonthlyPrayerCalendar.client';

export async function generateStaticParams() {
  const slugs = await getAllCountrySlugs();
  return slugs.map(slug => ({ country: slug }));
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) return { title: 'مواقيت الصلاة' };

  const countryAr = country.name_ar || country.name_en;

  return {
    title: `مواقيت الصلاة في ${countryAr} — مواعيد الأذان اليوم`,
    description: `تعرف على مواقيت الصلاة في كافة مدن ${countryAr} اليوم. الفجر، الظهر، العصر، المغرب والعشاء بدقة عالية.`,
    alternates: {
      canonical: `/mwaqit-al-salat/${countrySlug}`,
    }
  };
}

export default async function CountryPrayerPage({ params }) {
  const { country: countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const [cities, capital, allCountries] = await Promise.all([
    getCitiesByCountry(country.country_code),
    getCapitalCity(country.country_code),
    getCountriesAction(),
  ]);

  const countryAr = country.name_ar || country.name_en;

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <main className="mx-auto px-4 pt-24 pb-20 max-w-[600px]">

        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-8 flex items-center gap-1">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/mwaqit-al-salat" className="hover:text-accent transition-colors">مواقيت الصلاة</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{countryAr}</span>
        </nav>

        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            مواقيت الصلاة في <span className="text-accent">{countryAr}</span>
          </h1>
          <p className="text-muted text-lg">
            اختر المدينة لعرض مواقيت الصلاة الدقيقة اليوم
          </p>
        </header>

        <div className="mb-12">
          <SearchCity mode="mwaqit-al-salat" preloadedCountries={allCountries} />
        </div>

        {capital && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-accent" />
              أوقات الصلاة في العاصمة ({capital.name_ar})
            </h2>

            <Suspense
              fallback={
                <div className="space-y-4">
                  <div className="h-72 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
                  <div className="h-64 animate-pulse bg-[var(--bg-surface-2)] rounded-3xl" />
                </div>
              }
            >
              <PrayerTimesContent country={countrySlug} city={capital.city_slug} cityData={capital} />
            </Suspense>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-6">كافة المدن في {countryAr}</h2>
          <CityPrayerCardsGrid cities={cities} countrySlug={countrySlug} />
        </section>

      </main>
    </div>
  );
}

// ─── Dynamic content (opts into per-request rendering via headers()) ──────────
const PRAYER_AR = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

async function PrayerTimesContent({ country, city, cityData }) {
  await headers(); // opts this sub-tree into dynamic rendering only

  const now = new Date();

  const times = calculatePrayerTimes({
    lat: cityData.lat,
    lon: cityData.lon,
    timezone: cityData.timezone,
    date: now,
    cacheKey: `${country}::${city}`,
  });

  if (!times) {
    return (
      <p className="text-danger text-center py-12">
        عذراً، تعذّر حساب أوقات الصلاة للعاصمة.
      </p>
    );
  }

  const { nextKey, nextIso, prevIso } = getNextPrayer(times, now.toISOString());
  const fajrStr = formatTime(times.fajr, cityData.timezone);
  const maghribStr = formatTime(times.maghrib, cityData.timezone);
  const todayLabel = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
      <section className="card mb-6" aria-label={`مواقيت الصلاة اليوم في ${cityData.name_ar}`}>
        <div className="card__header flex flex-wrap justify-between items-center gap-4">
          <h3 className="card__title m-0 text-xl font-bold">مواقيت الصلاة اليوم</h3>
          <span className="badge badge-accent">{todayLabel}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {Object.entries(times).map(([key, isoStr]) => {
            const isNext = key === nextKey;
            const timeStr = formatTime(isoStr, cityData.timezone, false);
            return (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4) var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  background: isNext ? 'var(--accent-soft)' : 'transparent',
                  borderRight: isNext ? '3px solid var(--accent)' : '3px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  {isNext && <span className="badge badge-accent">القادمة</span>}
                  <span style={{
                    color: isNext ? 'var(--accent)' : 'var(--text-primary)',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'var(--text-lg)',
                  }}>
                    {PRAYER_AR[key] ?? key}
                  </span>
                </div>
                <time
                  dateTime={isoStr}
                  dir="ltr"
                  style={{
                    color: isNext ? 'var(--accent)' : 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontWeight: 'var(--font-bold)',
                    fontSize: 'var(--text-xl)',
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
          تُعرض مواقيت الصلاة بناءً على الإحداثيات ({cityData.lat?.toFixed(4)}°،{' '}
          {cityData.lon?.toFixed(4)}°) والمنطقة الزمنية {cityData.timezone}.
        </p>
      </section>

      {/* Monthly Prayer Calendar */}
      <section className="mb-6">
        <MonthlyPrayerCalendar
          lat={cityData.lat}
          lon={cityData.lon}
          timezone={cityData.timezone}
          cityNameAr={cityData.name_ar || cityData.name_en}
        />
      </section>
    </>
  );
}
