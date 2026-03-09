/**
 * app/mwaqit-al-salat/[country]/page.jsx
 * 
 * Country-level prayer times page.
 * Displays a list of cities in the country and redirects to the capital by default.
 */

import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin } from 'lucide-react';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { getCitiesByCountry, getCapitalCity } from '@/lib/db/queries/cities';
import SearchCity from '@/components/SearchCity.client';

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

  const [cities, capital] = await Promise.all([
    getCitiesByCountry(country.country_code),
    getCapitalCity(country.country_code),
  ]);

  const countryAr = country.name_ar || country.name_en;

  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl" lang="ar">
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">

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

        <div className="max-w-xl mx-auto mb-12">
          <SearchCity mode="mwaqit-al-salat" />
        </div>

        {capital && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-accent" />
              العاصمة
            </h2>
            <Link
              href={`/mwaqit-al-salat/${countrySlug}/${capital.city_slug}`}
              className="block p-6 bg-glass border border-border rounded-2xl hover:border-accent transition-all group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold group-hover:text-accent transition-colors">{capital.name_ar}</h3>
                  <p className="text-muted text-sm mt-1">عرض مواقيت الصلاة في العاصمة</p>
                </div>
                <ChevronLeft className="text-muted group-hover:text-accent transition-all rotate-180" />
              </div>
            </Link>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-6">كافة المدن في {countryAr}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city.city_slug}
                href={`/mwaqit-al-salat/${countrySlug}/${city.city_slug}`}
                className="p-4 bg-surface border border-border rounded-xl hover:border-accent hover:bg-accent-soft transition-all text-center"
              >
                <span className="font-bold">{city.name_ar}</span>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
