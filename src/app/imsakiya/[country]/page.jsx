/**
 * /imsakiya/[country] — Country-level imsakiya listing.
 * Lists cities in that country with links to city-level imsakiya pages.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountryBySlug, getPriorityCountrySlugs } from '@/lib/db/queries/countries';
import { getCitiesByCountry } from '@/lib/db/queries/cities';
import { isRouteSlug, buildNoindexRouteMetadata } from '@/lib/route-param-validation';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getUpcomingRamadanHijriYear, getRamadanGregorianStart, GREGORIAN_MONTHS_AR } from '@/lib/imsakiyaEngine';

const SITE_URL = getSiteUrl();

// Precomputed at module load (build time) — avoids new Date() during render
const _hijriYear = getUpcomingRamadanHijriYear();
const _gregYear = getRamadanGregorianStart(_hijriYear).year;

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [{ country: 'saudi-arabia' }, { country: 'egypt' }, { country: 'morocco' }];
  }
  const slugs = await getPriorityCountrySlugs(20);
  return slugs.map(country => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) {
    return buildNoindexRouteMetadata({ title: 'رابط غير صالح', description: '', canonical: '/imsakiya' });
  }
  const country = await getCountryBySlug(countrySlug);
  if (!country) {
    return buildNoindexRouteMetadata({ title: 'دولة غير موجودة', description: '', canonical: '/imsakiya' });
  }

  const hijriYear = _hijriYear;
  const gregYear = _gregYear;
  const countryAr = country.name_ar || countrySlug;

  return buildCanonicalMetadata({
    title: `إمساكية رمضان ${hijriYear} هـ / ${gregYear} في ${countryAr} — أوقات السحور والإفطار`,
    description: `اختر مدينتك في ${countryAr} لعرض إمساكية رمضان ${gregYear} الكاملة — أوقات السحور والإفطار لكل يوم محسوبة فلكياً.`,
    keywords: [`إمساكية رمضان ${countryAr}`, `إمساكية ${countryAr}`, `مواقيت رمضان ${countryAr}`, `وقت الإفطار ${countryAr}`],
    url: `${SITE_URL}/imsakiya/${countrySlug}`,
  });
}

export default async function ImsakiyaCountryPage({ params }) {
  const { country: countrySlug } = await params;
  if (!isRouteSlug(countrySlug)) notFound();

  const country = await getCountryBySlug(countrySlug);
  if (!country) notFound();

  const cities = await getCitiesByCountry(country.country_code);
  const hijriYear = _hijriYear;
  const gregYear = _gregYear;
  const ramadanStart = getRamadanGregorianStart(hijriYear);
  const countryAr = country.name_ar || countrySlug;

  // Sort by population desc, limit to 40 cities
  const topCities = [...cities]
    .sort((a, b) => (b.population || 0) - (a.population || 0))
    .slice(0, 40)
    .filter(c => c.city_slug);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
      { '@type': 'ListItem', position: 3, name: countryAr, item: `${SITE_URL}/imsakiya/${countrySlug}` },
    ],
  };

  return (
    <main className="imsakiya-country bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="container mx-auto px-4 pt-10 pb-8">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span className="mx-2">›</span>
          <Link href="/imsakiya">إمساكية رمضان</Link>
          <span className="mx-2">›</span>
          <span>{countryAr}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
          إمساكية رمضان {hijriYear} هـ / {gregYear} في {countryAr}
        </h1>
        <p className="text-muted-foreground text-base mb-4">
          اختر مدينتك لعرض جدول أوقات السحور والإفطار لكل يوم من رمضان {gregYear}.
        </p>
        <p className="text-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-amber-800 dark:text-amber-300">
          <strong>أول رمضان المتوقع:</strong> {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} وفق تقويم أم القرى — قد يتقدم أو يتأخر يوماً برؤية الهلال.
        </p>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <h2 className="text-lg font-semibold mb-4">مدن {countryAr}</h2>
        {topCities.length === 0 ? (
          <p className="text-muted-foreground">لا توجد مدن متاحة لهذه الدولة حالياً.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {topCities.map(city => (
              <Link
                key={city.city_slug}
                href={`/imsakiya/${countrySlug}/${city.city_slug}`}
                className="flex items-center justify-between bg-card border rounded-lg px-4 py-3 hover:bg-muted/50 hover:border-primary/40 transition-colors text-sm font-medium"
              >
                <span>{city.name_ar || city.city_slug}</span>
                <span className="text-muted-foreground text-xs">←</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 pb-8">
        <Link href="/imsakiya" className="text-sm text-primary underline underline-offset-2">
          ← عرض جميع الدول
        </Link>
      </section>
    </main>
  );
}
