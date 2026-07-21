/**
 * /imsakiya/[country]/[city] — Per-city Ramadan imsakiya (suhoor + iftar table).
 *
 * Fully server-rendered. Uses Adhan.js via prayerEngine + Hijri conversion via date-adapter.
 * Times computed from the next upcoming Ramadan; cached at the route level.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getPriorityCityParams } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { isRouteSlug, buildNoindexRouteMetadata, isRenderableCityData } from '@/lib/route-param-validation';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import {
  generateImsakiya,
  getUpcomingRamadanHijriYear,
  GREGORIAN_MONTHS_AR,
} from '@/lib/imsakiyaEngine';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';

const SITE_URL = getSiteUrl();

// Precomputed at module load (build time) — avoids new Date() during render
const _hijriYear = getUpcomingRamadanHijriYear();

const HIJRI_MONTHS_AR = [
  '', 'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

export async function generateStaticParams() {
  if (process.env.NODE_ENV === 'development') {
    return [
      { country: 'saudi-arabia', city: 'riyadh' },
      { country: 'egypt',        city: 'cairo'   },
      { country: 'uae',          city: 'dubai'   },
    ];
  }
  return getPriorityCityParams(24);
}

async function resolveCity(countrySlug, citySlug) {
  const country = await getCountryBySlug(countrySlug);
  if (!country) return null;
  const city = await getCityBySlug(country.country_code, citySlug);
  if (!city || !isRenderableCityData(city)) return null;
  return { country, city };
}

export async function generateMetadata({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) {
    return buildNoindexRouteMetadata({
      title: 'رابط غير صالح',
      description: 'رابط الإمساكية غير صالح.',
      canonical: '/imsakiya',
    });
  }

  const resolved = await resolveCity(countrySlug, citySlug);
  if (!resolved) {
    return buildNoindexRouteMetadata({
      title: 'مدينة غير موجودة',
      description: 'لم يتم العثور على بيانات المدينة.',
      canonical: '/imsakiya',
    });
  }

  const { country, city } = resolved;
  const hijriYear = _hijriYear;
  const { gregYear } = generateImsakiya(city, hijriYear);
  const cityAr = city.name_ar || city.city_slug;
  const countryAr = country.name_ar || country.country_slug;

  const title = `إمساكية رمضان ${hijriYear} هـ / ${gregYear} في ${cityAr} — أوقات السحور والإفطار`;
  const description = `إمساكية رمضان ${gregYear} في ${cityAr}، ${countryAr}: جدول كامل بأوقات السحور والإفطار وعدد ساعات الصيام لكل يوم — محسوبة فلكياً بدقة.`;
  const url = `${SITE_URL}/imsakiya/${countrySlug}/${citySlug}`;
  const keywords = [
    `إمساكية رمضان ${gregYear} ${cityAr}`,
    `إمساكية ${cityAr}`,
    `وقت الإفطار ${cityAr}`,
    `وقت السحور ${cityAr}`,
    `إمساكية رمضان ${hijriYear} هـ`,
    `مواقيت الصيام ${cityAr}`,
    `متى الإفطار في ${cityAr}`,
    `متى السحور في ${cityAr}`,
    `إمساكية رمضان ${countryAr}`,
    `جدول رمضان ${cityAr}`,
  ];

  return buildCanonicalMetadata({ title, description, keywords, url });
}

export default async function ImsakiyaCityPage({ params }) {
  const { country: countrySlug, city: citySlug } = await params;
  if (!isRouteSlug(countrySlug) || !isRouteSlug(citySlug)) notFound();

  const resolved = await resolveCity(countrySlug, citySlug);
  if (!resolved) notFound();

  const { country, city } = resolved;
  const hijriYear = _hijriYear;
  const imsakiya = generateImsakiya(city, hijriYear);

  const cityAr = city.name_ar || city.city_slug;
  const countryAr = country.name_ar || country.country_slug;
  const { gregYear, ramadanStart, dayCount, days } = imsakiya;

  const canonicalUrl = `${SITE_URL}/imsakiya/${countrySlug}/${citySlug}`;
  const prayerUrl = `/mwaqit-al-salat/${countrySlug}/${citySlug}`;

  // Compute average fasting hours from middle of month
  const midDays = days.filter(d => d.ramadanDay >= 10 && d.ramadanDay <= 20);
  const sampleDay = midDays[Math.floor(midDays.length / 2)];

  // JSON-LD schemas
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
      { '@type': 'ListItem', position: 3, name: countryAr, item: `${SITE_URL}/imsakiya/${countrySlug}` },
      { '@type': 'ListItem', position: 4, name: cityAr, item: canonicalUrl },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `متى أول يوم رمضان ${gregYear} في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `أول يوم رمضان ${hijriYear} هـ / ${gregYear} في ${cityAr} هو ${ramadanStart.day} ${GREGORIAN_MONTHS_AR[ramadanStart.month]} ${gregYear} وفق التقويم الأمّ القرى — قد يتقدم يوماً أو يتأخر برؤية الهلال.`,
        },
      },
      {
        '@type': 'Question',
        name: `كم عدد ساعات الصيام في رمضان ${gregYear} في ${cityAr}؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `تتراوح ساعات الصيام في ${cityAr} خلال رمضان ${gregYear} حول ${sampleDay?.fastingHours || '—'} يومياً في منتصف الشهر — وتتفاوت من أول الشهر لآخره بحسب موعد الشروق والغروب.`,
        },
      },
      {
        '@type': 'Question',
        name: `كيف تُحسب أوقات السحور والإفطار؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `تُحسب أوقات الإمساكية باستخدام موقع المدينة الجغرافي (خط العرض وخط الطول) مع معادلات الفلك الدقيقة المعتمدة. وقت السحور = وقت الفجر (بداية الإمساك)، ووقت الإفطار = وقت المغرب.`,
        },
      },
      {
        '@type': 'Question',
        name: `هل يختلف وقت الإفطار من يوم لآخر؟`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `نعم، يتغير وقت المغرب والفجر كل يوم بضع دقائق بحسب موضع الشمس، لذلك تختلف مواعيد الإمساكية يومياً. راجع الجدول الكامل أدناه لأوقات كل يوم بدقة.`,
        },
      },
    ],
  };

  const tableRows = days.map(d => ({
    '@type': 'ListItem',
    position: d.ramadanDay,
    name: `${d.ramadanDay} رمضان — سحور: ${d.suhoorAr} — إفطار: ${d.iftarAr}`,
  }));

  return (
    <main className="imsakiya-page bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: tableRows }) }} />

      {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
      <AdTopBanner slotId="imsakiya-city-top" />

      {/* Hero */}
      <section className="imsakiya-hero container mx-auto px-4 py-8">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span className="mx-2">›</span>
          <Link href="/imsakiya">إمساكية رمضان</Link>
          <span className="mx-2">›</span>
          <span>{cityAr}</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
          إمساكية رمضان {hijriYear} هـ / {gregYear} في {cityAr}
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          جدول أوقات السحور والإفطار لكل يوم من أيام رمضان في {cityAr}، {countryAr}
        </p>
        <p className="text-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-amber-800 dark:text-amber-300 mt-4">
          <strong>تنبيه:</strong> الأوقات محسوبة فلكياً وفق تقويم أم القرى. قد يتقدم أول رمضان يوماً أو يتأخر يوماً بحسب رؤية الهلال في {countryAr}.
        </p>

        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <div className="bg-card border rounded-lg px-4 py-3">
            <div className="text-muted-foreground">أول رمضان</div>
            <div className="font-bold text-base">{ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear}</div>
          </div>
          <div className="bg-card border rounded-lg px-4 py-3">
            <div className="text-muted-foreground">عدد أيام الشهر</div>
            <div className="font-bold text-base">{dayCount} يوماً</div>
          </div>
          <div className="bg-card border rounded-lg px-4 py-3">
            <div className="text-muted-foreground">السنة الهجرية</div>
            <div className="font-bold text-base">{hijriYear} هـ</div>
          </div>
          {sampleDay && (
            <div className="bg-card border rounded-lg px-4 py-3">
              <div className="text-muted-foreground">متوسط ساعات الصيام</div>
              <div className="font-bold text-base">{sampleDay.fastingHours}</div>
            </div>
          )}
        </div>
      </section>

      {/* Imsakiya Table */}
      <section className="imsakiya-table-section container mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4">جدول إمساكية رمضان {gregYear} — {cityAr}</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="text-right px-3 py-3 font-semibold border-b">اليوم</th>
                <th className="text-right px-3 py-3 font-semibold border-b">التاريخ الميلادي</th>
                <th className="text-right px-3 py-3 font-semibold border-b">وقت السحور (الفجر)</th>
                <th className="text-right px-3 py-3 font-semibold border-b">وقت الإفطار (المغرب)</th>
                <th className="text-right px-3 py-3 font-semibold border-b hidden md:table-cell">ساعات الصيام</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d, i) => {
                const isLaylat = d.ramadanDay === 27;
                return (
                  <tr
                    key={d.ramadanDay}
                    className={[
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                      isLaylat ? 'ring-1 ring-amber-400 dark:ring-amber-600' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <td className="px-3 py-2 font-medium">
                      {d.ramadanDay}
                      {isLaylat && <span className="me-1 text-amber-600 dark:text-amber-400 text-xs"> ✦ ليلة القدر</span>}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {d.weekdayAr} {d.gregDay} {GREGORIAN_MONTHS_AR[d.gregMonth]}
                    </td>
                    <td className="px-3 py-2 font-bold text-blue-700 dark:text-blue-300">
                      {d.suhoorAr}
                    </td>
                    <td className="px-3 py-2 font-bold text-orange-600 dark:text-orange-400">
                      {d.iftarAr}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground hidden md:table-cell">
                      {d.fastingHours}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Info Section */}
      <section className="imsakiya-info-section bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-xl font-semibold mb-6">كيف تُحسب الإمساكية؟</h2>
          <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
            <p>
              <strong>وقت السحور = وقت الفجر:</strong> هو الوقت الذي يجب على الصائم الإمساك عنده. محسوب من موقع {cityAr} الجغرافي بدقة ({city.lat.toFixed(2)}° شمالاً، {city.lon.toFixed(2)}° شرقاً).
            </p>
            <p>
              <strong>وقت الإفطار = وقت المغرب:</strong> هو الوقت الذي يحل فيه الإفطار ببداية غروب الشمس. يختلف كل يوم بضع دقائق بحسب تحرك الشمس.
            </p>
            <p>
              <strong>طريقة الحساب:</strong> تعتمد الأوقات على المعادلات الفلكية المعتمدة في {countryAr}. قد تختلف دقيقة أو دقيقتين عن الإمساكية الرسمية المطبوعة بسبب اختلاف طريقة التقريب.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href={prayerUrl}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              مواقيت الصلاة اليومية في {cityAr} ←
            </Link>
          </div>
        </div>
      </section>

      <AdInArticle slotId="imsakiya-city-mid" />

      {/* FAQ */}
      <section className="imsakiya-faq-section container mx-auto px-4 py-10 max-w-3xl">
        <h2 className="text-xl font-semibold mb-6">أسئلة شائعة عن إمساكية رمضان {gregYear} في {cityAr}</h2>
        <div className="space-y-5">
          <div>
            <h3 className="font-semibold text-base mb-1">متى أول يوم رمضان {gregYear} في {cityAr}؟</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              أول يوم رمضان {hijriYear} هـ في {cityAr} هو {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} وفق التقويم الأمّ القرى — قد يتقدم يوماً أو يتأخر يوماً برؤية الهلال في {countryAr}.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-1">كم عدد ساعات الصيام في رمضان {gregYear} في {cityAr}؟</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              تتراوح ساعات الصيام في {cityAr} خلال رمضان {gregYear} حول {sampleDay?.fastingHours || '—'} يومياً في منتصف الشهر. تتفاوت الأوقات من أول الشهر لآخره بحسب مسار الشمس.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-1">هل وقت السحور ووقت الفجر هو نفسه؟</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              نعم. وقت السحور هو الوقت الفاصل قبل الفجر — بمجرد دخول وقت الفجر يجب الإمساك. لذلك تُقدّر بعض الإمساكيات الورقية وقت الإمساك بنحو 10–15 دقيقة قبل الفجر احتياطاً، لكن الصحيح الفقهي هو دخول وقت الفجر.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-1">كيف أتحقق من وقت الإفطار في {cityAr} هذا الشهر؟</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              وقت الإفطار في {cityAr} هو وقت المغرب. يمكنك مراجعة الجدول أعلاه ليوم صيامك، أو زيارة صفحة <Link href={prayerUrl} className="underline underline-offset-2">مواقيت الصلاة في {cityAr}</Link> للوقت الحي اليومي.
            </p>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <AdMultiplex slotId="imsakiya-city-bottom" />

      <section className="container mx-auto px-4 pb-10 max-w-3xl">
        <div className="border rounded-xl p-5 bg-card">
          <h2 className="font-semibold text-base mb-3">صفحات ذات صلة</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={prayerUrl} className="text-primary underline underline-offset-2 hover:text-primary/80">
                مواقيت الصلاة في {cityAr} — توقيت حي يومي
              </Link>
            </li>
            <li>
              <Link href="/holidays/ramadan" className="text-primary underline underline-offset-2 hover:text-primary/80">
                كم باقي على رمضان {gregYear}؟ — عداد تنازلي
              </Link>
            </li>
            <li>
              <Link href="/holidays/eid-al-fitr" className="text-primary underline underline-offset-2 hover:text-primary/80">
                كم باقي على عيد الفطر {gregYear}؟ — عداد تنازلي
              </Link>
            </li>
            <li>
              <Link href="/imsakiya" className="text-primary underline underline-offset-2 hover:text-primary/80">
                إمساكيات مدن أخرى ←
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
