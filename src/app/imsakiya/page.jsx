/**
 * /imsakiya — Imsakiya hub: links to top cities per country.
 * Server-rendered, static. No dynamic data needed — just city links.
 */

import Link from 'next/link';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';
import { getUpcomingRamadanHijriYear, getRamadanGregorianStart } from '@/lib/imsakiyaEngine';

const SITE_URL = getSiteUrl();

// Precompute Ramadan year at module load (build time) — avoids new Date() in render
const _hijriYear = getUpcomingRamadanHijriYear();
const _ramadanStart = getRamadanGregorianStart(_hijriYear);
const _gregYear = _ramadanStart.year;

// Top cities with Arabic names — static, curated list
const TOP_IMSAKIYA_CITIES = [
  // Saudi Arabia
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'riyadh', cityAr: 'الرياض' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'jeddah', cityAr: 'جدة' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'makkah', cityAr: 'مكة المكرمة' },
  { country: 'saudi-arabia', countryAr: 'السعودية', city: 'medina', cityAr: 'المدينة المنورة' },
  // Egypt
  { country: 'egypt', countryAr: 'مصر', city: 'cairo', cityAr: 'القاهرة' },
  { country: 'egypt', countryAr: 'مصر', city: 'alexandria', cityAr: 'الإسكندرية' },
  { country: 'egypt', countryAr: 'مصر', city: 'giza', cityAr: 'الجيزة' },
  // UAE
  { country: 'uae', countryAr: 'الإمارات', city: 'dubai', cityAr: 'دبي' },
  { country: 'uae', countryAr: 'الإمارات', city: 'abu-dhabi', cityAr: 'أبو ظبي' },
  // Kuwait
  { country: 'kuwait', countryAr: 'الكويت', city: 'kuwait-city', cityAr: 'الكويت' },
  // Qatar
  { country: 'qatar', countryAr: 'قطر', city: 'doha', cityAr: 'الدوحة' },
  // Morocco
  { country: 'morocco', countryAr: 'المغرب', city: 'casablanca', cityAr: 'الدار البيضاء' },
  { country: 'morocco', countryAr: 'المغرب', city: 'rabat', cityAr: 'الرباط' },
  { country: 'morocco', countryAr: 'المغرب', city: 'fez', cityAr: 'فاس' },
  // Algeria
  { country: 'algeria', countryAr: 'الجزائر', city: 'algiers', cityAr: 'الجزائر العاصمة' },
  { country: 'algeria', countryAr: 'الجزائر', city: 'oran', cityAr: 'وهران' },
  // Tunisia
  { country: 'tunisia', countryAr: 'تونس', city: 'tunis', cityAr: 'تونس' },
  // Jordan
  { country: 'jordan', countryAr: 'الأردن', city: 'amman', cityAr: 'عمّان' },
  // Iraq
  { country: 'iraq', countryAr: 'العراق', city: 'baghdad', cityAr: 'بغداد' },
  // Libya
  { country: 'libya', countryAr: 'ليبيا', city: 'tripoli', cityAr: 'طرابلس' },
  // Sudan
  { country: 'sudan', countryAr: 'السودان', city: 'khartoum', cityAr: 'الخرطوم' },
  // Bahrain
  { country: 'bahrain', countryAr: 'البحرين', city: 'manama', cityAr: 'المنامة' },
  // Oman
  { country: 'oman', countryAr: 'عُمان', city: 'muscat', cityAr: 'مسقط' },
];

const GREGORIAN_MONTHS_AR = [
  '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

// Group by country
function groupByCountry(cities) {
  const map = new Map();
  for (const c of cities) {
    if (!map.has(c.country)) map.set(c.country, { countryAr: c.countryAr, country: c.country, cities: [] });
    map.get(c.country).cities.push(c);
  }
  return Array.from(map.values());
}

export const metadata = buildCanonicalMetadata({
  title: `إمساكية رمضان ${_hijriYear} هـ / ${_gregYear} — أوقات السحور والإفطار لجميع المدن`,
  description: `إمساكيات رمضان ${_gregYear} لأكثر من 20 مدينة عربية: الرياض، القاهرة، دبي، الكويت، الدار البيضاء وغيرها — أوقات السحور والإفطار يومياً محسوبة فلكياً.`,
  keywords: [
    `إمساكية رمضان ${_gregYear}`,
    `إمساكية رمضان ${_hijriYear} هـ`,
    'إمساكية رمضان',
    'وقت الإفطار',
    'وقت السحور',
    'مواقيت رمضان',
    'إمساكية السعودية',
    'إمساكية مصر',
    'إمساكية الإمارات',
    'إمساكية المغرب',
    `رمضان ${_gregYear}`,
  ],
  url: `${SITE_URL}/imsakiya`,
});

export default function ImsakiyaHubPage() {
  const hijriYear = _hijriYear;
  const ramadanStart = _ramadanStart;
  const gregYear = _gregYear;
  const groups = groupByCountry(TOP_IMSAKIYA_CITIES);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'إمساكية رمضان', item: `${SITE_URL}/imsakiya` },
    ],
  };

  return (
    <main className="imsakiya-hub bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* Hero */}
      <section className="container mx-auto px-4 pt-10 pb-8">
        <nav className="text-sm text-muted-foreground mb-4" aria-label="مسار التنقل">
          <Link href="/">الرئيسية</Link>
          <span className="mx-2">›</span>
          <span>إمساكية رمضان</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-3">
          إمساكية رمضان {hijriYear} هـ / {gregYear}
        </h1>
        <p className="text-muted-foreground text-lg">
          أوقات السحور والإفطار لكل يوم من رمضان — اختر مدينتك لرؤية جدول كامل محسوب فلكياً بدقة.
        </p>
        <p className="text-sm bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-3 text-amber-800 dark:text-amber-300 mt-4">
          <strong>تنبيه:</strong> أول رمضان المتوقع وفق تقويم أم القرى: {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear}. قد يتقدم يوماً أو يتأخر برؤية الهلال.
        </p>
      </section>

      {/* Country Groups */}
      <section className="container mx-auto px-4 pb-12">
        <div className="space-y-8">
          {groups.map(({ country, countryAr, cities }) => (
            <div key={country}>
              <h2 className="text-lg font-semibold mb-3 border-b pb-2">إمساكية رمضان {gregYear} في {countryAr}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {cities.map(({ city, cityAr }) => (
                  <Link
                    key={city}
                    href={`/imsakiya/${country}/${city}`}
                    className="flex items-center justify-between bg-card border rounded-lg px-4 py-3 hover:bg-muted/50 hover:border-primary/40 transition-colors text-sm font-medium"
                  >
                    <span>{cityAr}</span>
                    <span className="text-muted-foreground text-xs">←</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info block */}
      <section className="bg-muted/30 py-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-lg font-semibold mb-4">عن هذه الإمساكيات</h2>
          <div className="space-y-3 text-sm text-foreground/80 leading-relaxed">
            <p>
              الأوقات محسوبة باستخدام بيانات الموقع الجغرافي الدقيق لكل مدينة ومعادلات الفلك الإسلامية المعتمدة إقليمياً.
              وقت السحور = وقت الفجر، ووقت الإفطار = وقت المغرب.
            </p>
            <p>
              رمضان {hijriYear} هـ يبدأ المتوقع {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear} — هذا التاريخ مبني على تقويم أم القرى ويعتمد عملياً في السعودية وكثير من دول الخليج.
              قد تعتمد دول أخرى التقويم المحلي أو الرؤية المحلية للهلال.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="container mx-auto px-4 py-10 max-w-2xl">
        <h2 className="text-lg font-semibold mb-5">أسئلة شائعة عن إمساكية رمضان {gregYear}</h2>
        <div className="space-y-4">
          <details className="bg-card border rounded-lg px-4 py-3">
            <summary className="font-medium cursor-pointer">ما الفرق بين وقت الإمساك ووقت الفجر؟</summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              وقت الإمساك هو الوقت الذي يُوصى فيه بالتوقف عن الأكل والشرب احتياطاً، وعادةً يسبق الأذان بعشر دقائق. أما وقت الفجر (السحور) فهو أذان الفجر الصادق، وهو الوقت الحقيقي لبداية الصيام وفق الفقه الإسلامي. كثير من الإمساكيات تعتمد وقت الفجر مباشرةً دون إمساك إضافي.
            </p>
          </details>
          <details className="bg-card border rounded-lg px-4 py-3">
            <summary className="font-medium cursor-pointer">لماذا يختلف وقت الإفطار بين المدن في نفس الدولة؟</summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              يتحدد وقت الإفطار بغروب الشمس فلكياً، وهذا يختلف من موقع لآخر بحسب خط الطول. في الدول الكبيرة كالسعودية ومصر والمغرب، قد يصل الفرق بين أقصى الشرق وأقصى الغرب إلى 15-20 دقيقة. لهذا يُنصح دائماً باستخدام إمساكية مدينتك تحديداً.
            </p>
          </details>
          <details className="bg-card border rounded-lg px-4 py-3">
            <summary className="font-medium cursor-pointer">هل يمكن الاعتماد على هذه الإمساكيات للصيام؟</summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              هذه الأوقات محسوبة فلكياً بدقة عالية وهي صالحة للاستخدام. للتأكد، يمكنك مقارنتها مع إمساكية المسجد المحلي في مدينتك أو توقيت دار الإفتاء في بلدك. الاختلافات الصغيرة (دقيقة أو دقيقتان) مقبولة فقهياً، ولا تؤثر على صحة الصيام.
            </p>
          </details>
          <details className="bg-card border rounded-lg px-4 py-3">
            <summary className="font-medium cursor-pointer">كيف أعرف أول يوم رمضان {gregYear}؟</summary>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              وفق الحسابات الفلكية وتقويم أم القرى، يُتوقع أن يبدأ رمضان {gregYear} في {ramadanStart.day} {GREGORIAN_MONTHS_AR[ramadanStart.month]} {gregYear}. غير أن الإعلان الرسمي يعتمد على رؤية هلال رمضان، وقد يختلف من دولة لأخرى بيوم كامل. تابع إعلانات وزارة الأوقاف أو دار الإفتاء في بلدك للتأكيد.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
