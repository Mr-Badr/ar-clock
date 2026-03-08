import React from 'react';
import TimeDiffCalculator from '@/components/TimeDifference/TimeDiffCalculatorV2.client';
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { notFound } from 'next/navigation';
import { cache } from 'react';

// ─── City Resolution (seed → Supabase → Nominatim) ───────────────────────────
async function resolveCityFromSegment(segment) {
  if (!segment) return null;
  const parts = segment.split('-');
  for (let i = 0; i < parts.length - 1; i++) {
    const countrySlug = parts.slice(0, i + 1).join('-');
    const citySlug = parts.slice(i + 1).join('-');
    if (!countrySlug || !citySlug) continue;
    
    const country = await getCountryBySlug(countrySlug);
    if (!country) continue;
    
    const city = await getCityBySlug(country.country_code, citySlug);
    if (city && city.timezone && city.timezone !== 'UTC') {
      return {
        country_slug: country.country_slug,
        country_name_ar: country.name_ar,
        city_slug: city.city_slug,
        city_name_ar: city.name_ar || city.name_en,
        timezone: city.timezone,
      };
    }
  }
  // Final fallback: simple first-dash split
  const countryFallback = await getCountryBySlug(parts[0]);
  if (!countryFallback) return null;
  const cityFallback = await getCityBySlug(countryFallback.country_code, parts.slice(1).join('-'));
  if (cityFallback) return {
    country_slug: countryFallback.country_slug,
    country_name_ar: countryFallback.name_ar,
    city_slug: cityFallback.city_slug,
    city_name_ar: cityFallback.name_ar || cityFallback.name_en,
    timezone: cityFallback.timezone || 'UTC',
  };
  return null;
}
const resolveCity = cache(resolveCityFromSegment);

// ─── Reliable server-safe timezone helpers ────────────────────────────────────

/** Returns offset in minutes vs UTC, correctly handling midnight boundary */
function getOffsetMinutes(tz) {
  try {
    const now = new Date();
    // Parse a "local" date string by forcing en-US locale with explicit fields
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const utc   = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round((local.getTime() - utc.getTime()) / 60000);
  } catch { return 0; }
}

/**
 * Detects whether a timezone is currently observing DST.
 * Strategy: compare Jan offset (winter) vs Jul offset (summer).
 * If current offset differs from winter offset → DST active.
 */
function isDSTActive(tz) {
  try {
    const now = new Date();
    const jan = new Date(now.getFullYear(), 0, 15); // mid-Jan (winter)
    const jul = new Date(now.getFullYear(), 6, 15); // mid-Jul (summer)

    const offsetNow = getOffsetMinutes(tz);
    const localJan  = new Date(jan.toLocaleString('en-US', { timeZone: tz }));
    const utcJan    = new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetJan = Math.round((localJan.getTime() - utcJan.getTime()) / 60000);

    // If timezone never changes (Jan=Jul offset), it's not a DST zone
    const localJul = new Date(jul.toLocaleString('en-US', { timeZone: tz }));
    const utcJul   = new Date(jul.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetJul = Math.round((localJul.getTime() - utcJul.getTime()) / 60000);
    if (offsetJan === offsetJul) return false; // no DST

    // DST is active if current offset differs from winter (lower) offset
    return offsetNow !== Math.min(offsetJan, offsetJul);
  } catch { return false; }
}

/** Returns whether this timezone observes DST at all (any time of year) */
function observesDST(tz) {
  try {
    const now = new Date();
    const jan = new Date(now.getFullYear(), 0, 15);
    const jul = new Date(now.getFullYear(), 6, 15);
    const lJan = new Date(jan.toLocaleString('en-US', { timeZone: tz }));
    const uJan = new Date(jan.toLocaleString('en-US', { timeZone: 'UTC' }));
    const lJul = new Date(jul.toLocaleString('en-US', { timeZone: tz }));
    const uJul = new Date(jul.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round((lJan - uJan) / 60000) !== Math.round((lJul - uJul) / 60000);
  } catch { return false; }
}

/** Format offset as "+3:00" or "-5:30" */
function formatUTCOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '-';
  const abs  = Math.abs(minutes);
  const h    = Math.floor(abs / 60);
  const m    = abs % 60;
  return `UTC${sign}${h}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}`;
}

/** Format 24h number (can be < 0 or > 23) to Arabic 12h string */
function fmtAr(h24) {
  const totalMins = Math.round(h24 * 60);
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const p = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${p}`;
}

/** Day indicator string if conversion crosses midnight */
function dayNote(srcH, diffH) {
  const dest = srcH + diffH;
  if (dest >= 24) return '(اليوم التالي)';
  if (dest < 0)   return '(اليوم السابق)';
  return '';
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  const { from, to } = await params;
  const [fromCity, toCity] = await Promise.all([resolveCity(from), resolveCity(to)]);
  if (!fromCity || !toCity) return { title: 'فرق التوقيت | وقت', description: 'احسب فرق التوقيت بين أي مدينتين في العالم.' };

  const title = `فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} الآن | الساعة الآن`;
  const description = `كم الفرق الزمني بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟ تحويل فوري للوقت، معلومات التوقيت الصيفي، وساعات العمل المشتركة. محدّث لحظيًا.`;
  const keywords = [
    `فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    `الساعة الآن في ${fromCity.city_name_ar}`,
    `الساعة الآن في ${toCity.city_name_ar}`,
    `تحويل التوقيت ${fromCity.city_name_ar} ${toCity.city_name_ar}`,
    `كم الفرق بين ${fromCity.country_name_ar} و${toCity.country_name_ar}`,
    `توقيت ${toCity.city_name_ar}`,
    'فرق التوقيت',
    'تحويل الوقت',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/time-difference/${from}/${to}` },
    openGraph: { title, description, url: `/time-difference/${from}/${to}`, locale: 'ar_SA', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ComparisonPage({ params }) {
  const { from, to } = await params;
  const [fromCity, toCity] = await Promise.all([resolveCity(from), resolveCity(to)]);
  if (!fromCity || !toCity) notFound();

  // ── Compute offsets & DST info (server-safe) ──
  const fromOffsetMin  = getOffsetMinutes(fromCity.timezone);
  const toOffsetMin    = getOffsetMinutes(toCity.timezone);
  const diffMinutes    = toOffsetMin - fromOffsetMin;
  const diffHours      = diffMinutes / 60;
  const fromDST        = isDSTActive(fromCity.timezone);
  const toDST          = isDSTActive(toCity.timezone);
  const fromObservesDST = observesDST(fromCity.timezone);
  const toObservesDST   = observesDST(toCity.timezone);
  const fromOffsetStr  = formatUTCOffset(fromOffsetMin);
  const toOffsetStr    = formatUTCOffset(toOffsetMin);

  const absDiffH    = Math.floor(Math.abs(diffHours));
  const absDiffM    = Math.abs(diffMinutes) % 60;
  const diffLabel   = absDiffH > 0
    ? `${absDiffH} ساعة${absDiffM > 0 ? ` و${absDiffM} دقيقة` : ''}`
    : `${absDiffM} دقيقة`;
  const ahead  = diffMinutes > 0 ? toCity.city_name_ar  : fromCity.city_name_ar;
  const behind = diffMinutes > 0 ? fromCity.city_name_ar : toCity.city_name_ar;

  // ── Time conversion example groups ──
  const timeGroups = [
    { icon: '🌅', label: 'الصباح الباكر', hours: [6, 7, 8, 9] },
    { icon: '🌞', label: 'منتصف النهار', hours: [10, 12, 14, 15] },
    { icon: '🌆', label: 'المساء', hours: [17, 18, 20, 22] },
  ];

  // ── FAQs (13 dynamic) ──
  const faqs = [
    {
      q: `كم ساعة الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: diffMinutes === 0
        ? `لا يوجد فرق توقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} — كلتا المدينتين تتبعان نفس التوقيت الرسمي (${fromOffsetStr}).`
        : `الفارق الزمني هو ${diffLabel}. مدينة ${ahead} تسبق ${behind}. تقع ${fromCity.city_name_ar} في النطاق ${fromOffsetStr} بينما تقع ${toCity.city_name_ar} في ${toOffsetStr}، مما يجعل التحويل بينهما سهلاً عبر أداتنا.`,
    },
    {
      q: `هل ${fromCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: fromObservesDST
        ? `نعم، ${fromCity.city_name_ar} (${fromCity.country_name_ar}) تطبق التوقيت الصيفي. حاليًا ${fromDST ? 'هي في التوقيت الصيفي ☀️' : 'هي في التوقيت الشتوي 🌙'}.`
        : `لا، ${fromCity.city_name_ar} (${fromCity.country_name_ar}) لا تطبق التوقيت الصيفي. التوقيت ثابت طوال السنة عند ${fromOffsetStr}.`,
    },
    {
      q: `هل ${toCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: toObservesDST
        ? `نعم، ${toCity.city_name_ar} (${toCity.country_name_ar}) تطبق التوقيت الصيفي. حاليًا ${toDST ? 'هي في التوقيت الصيفي ☀️' : 'هي في التوقيت الشتوي 🌙'}.`
        : `لا، ${toCity.city_name_ar} (${toCity.country_name_ar}) لا تطبق التوقيت الصيفي. التوقيت ثابت عند ${toOffsetStr} طوال العام.`,
    },
    {
      q: `هل يتغير فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} في الصيف؟`,
      a: (!fromObservesDST && !toObservesDST)
        ? `لا يتغير الفرق على مدار السنة لأن لا ${fromCity.city_name_ar} ولا ${toCity.city_name_ar} تطبقان التوقيت الصيفي. الفارق ثابت دائمًا عند ${diffLabel}.`
        : `نعم، قد يتغير الفارق بمقدار ساعة خلال فترات تطبيق التوقيت الصيفي (عادة مارس–أكتوبر)، وذلك بحسب أي مدينة تُقدّم ساعتها وأيهما لا تفعل.`,
    },
    {
      q: `ما أفضل وقت للاتصال بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `استخدم أداة "تحويل الوقت السريع" أعلاه، أو اطلع على قسم ساعات العمل المشتركة. بشكل عام، يُفضّل التواصل حين يكون الطرفان ضمن ساعات العمل (9 صباحًا – 5 مساءً) في كلتا المدينتين.`,
    },
    {
      q: `هل نفس التاريخ في ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: Math.abs(diffMinutes) >= 720
        ? `بسبب الفارق الكبير في التوقيت (${diffLabel})، قد يختلف التاريخ الميلادي بين المدينتين في بعض الأوقات. يشير مؤشر (اليوم التالي/السابق) في النتائج أعلاه إلى هذه الحالة تلقائيًا.`
        : `نعم، في الغالب كلتا المدينتين في نفس اليوم الميلادي لأن الفارق (${diffLabel}) لا يتجاوز يومًا كاملًا.`,
    },
    {
      q: `ما هو توقيت جرينتش (UTC) لكل من ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `${fromCity.city_name_ar}: ${fromOffsetStr} | ${toCity.city_name_ar}: ${toOffsetStr}. التوقيت العالمي المنسق (UTC) هو المرجع الدولي الذي تُقاس على أساسه جميع التوقيتات.`,
    },
    {
      q: `هل يختلف فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} في رمضان؟`,
      a: `لا يتغير التوقيت الرسمي في معظم الدول بسبب شهر رمضان المبارك. الفارق بين ${fromCity.city_name_ar} و${toCity.city_name_ar} يظل ثابتاً عند ${diffLabel}، إلا إذا صادف رمضان تغيير التوقيت الصيفي (DST) في إحدى المدينتين.`,
    },
    {
      q: `كيف أحسب فرق التوقيت بدون أداة؟`,
      a: `اطرح نطاق UTC للمدينة الأولى من نطاق UTC للمدينة الثانية. مثلاً: إذا كانت ${fromCity.city_name_ar} في ${fromOffsetStr} و${toCity.city_name_ar} في ${toOffsetStr}، فالفرق هو ${diffLabel}.`,
    },
    {
      q: `لماذا أحتاج معرفة فرق التوقيت؟`,
      a: `لتنسيق الاجتماعات والمكالمات الدولية، لتحديد أوقات البث المباشر، لمتابعة الأسواق المالية، وللاتواصل مع الأهل والأصدقاء في بلدان أخرى دون إيقاظهم في ساعات متأخرة.`,
    },
    {
      q: `هل يؤثر فرق التوقيت على مواقيت الصلاة؟`,
      a: `مواقيت الصلاة مرتبطة بحركة الشمس وليس بالتوقيت الرسمي وحده، لذا تختلف من مدينة لأخرى حتى لو كانتا في نفس النطاق الزمني. راجع صفحة مواقيت الصلاة لدينا للحصول على مواعيد دقيقة.`,
    },
    {
      q: `كيف أشارك مقارنة التوقيت مع شخص آخر؟`,
      a: `انقر على زر "مشاركة" في الأداة التفاعلية أعلاه. ستُنسخ عنوان URL مباشرةً إلى الحافظة ويمكنك إرساله عبر أي تطبيق مراسلة. الرابط يفتح نفس المقارنة مباشرةً.`,
    },
    {
      q: `ما معنى "توقيت صيفي" و"توقيت شتوي"؟`,
      a: `التوقيت الصيفي (DST) هو تقديم عقارب الساعة ساعة واحدة للأمام في الربيع للاستفادة من ضوء الشمس. يُعاد في الخريف. الدول التي لا تطبقه (كمعظم دول الخليج) لديها توقيت ثابت طوال العام.`,
    },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
  const pageUrl = `${siteUrl}/time-difference/${from}/${to}`;

  // ── JSON-LD Schemas ──
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'فرق التوقيت', item: `${siteUrl}/time-difference` },
      { '@type': 'ListItem', position: 3, name: `${fromCity.city_name_ar} – ${toCity.city_name_ar}`, item: pageUrl },
    ],
  };
  const softwareAppSchema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: `حاسبة فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: `أداة مجانية لحساب فرق التوقيت وتحويل الوقت بين ${fromCity.city_name_ar} و${toCity.city_name_ar}.`,
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const webPageSchema = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar}`,
    url: pageUrl, inLanguage: 'ar',
    description: `فرق التوقيت الدقيق بين ${fromCity.city_name_ar} (${fromOffsetStr}) و${toCity.city_name_ar} (${toOffsetStr}) مع معلومات التوقيت الصيفي.`,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]" dir="rtl">

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-14 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[120px] opacity-25 -z-10" aria-hidden="true" />
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <nav aria-label="مسار التنقل">
            <ol className="flex justify-center gap-1.5 text-xs text-[var(--text-muted)]">
              <li><a href="/" className="hover:text-[var(--accent)] transition-colors">الرئيسية</a></li>
              <li aria-hidden="true" className="opacity-40">/</li>
              <li><a href="/time-difference" className="hover:text-[var(--accent)] transition-colors">فرق التوقيت</a></li>
              <li aria-hidden="true" className="opacity-40">/</li>
              <li aria-current="page" className="font-medium">{fromCity.city_name_ar} – {toCity.city_name_ar}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            فرق التوقيت بين{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#38b2ac]">{fromCity.city_name_ar}</span>
            {' '}و{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#38b2ac]">{toCity.city_name_ar}</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto font-medium">
            {diffMinutes === 0
              ? `${fromCity.city_name_ar} و${toCity.city_name_ar} في نفس التوقيت تمامًا.`
              : `${ahead} تسبق ${behind} بـ${diffLabel} — مقارنة مباشرة ومحدّثة لحظيًا.`}
          </p>
        </div>
      </section>

      {/* ── Interactive Calculator ── */}
      <section className="px-4 pb-16 relative z-10" aria-label="حاسبة فرق التوقيت التفاعلية">
        <TimeDiffCalculator initialFrom={fromCity} initialTo={toCity} />
      </section>

      {/* ── DST Comparison Block ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16" aria-label="مقارنة التوقيت الصيفي">
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-surface-1)] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-[var(--border-subtle)]">
            <h2 className="text-xl font-black">🌍 معلومات التوقيت للمدينتين</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">نطاق UTC، حالة التوقيت الصيفي، والفارق الزمني المحسوب بدقة</p>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[var(--border-subtle)]">

            {/* City A */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">المدينة الأولى</p>
              <p className="text-2xl font-black">{fromCity.city_name_ar}</p>
              <p className="text-sm text-[var(--text-muted)]">{fromCity.country_name_ar}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-[var(--bg-surface-2)] border border-[var(--border-default)]">
                  🕐 {fromOffsetStr}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${fromDST ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' : 'bg-[var(--bg-surface-2)] border-[var(--border-default)] text-[var(--text-secondary)]'}`}>
                  {fromDST ? '☀️ توقيت صيفي نشط' : '🌙 توقيت شتوي (قياسي)'}
                </span>
                {!fromObservesDST && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-surface-3)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    ⚓ لا يتغير طوال السنة
                  </span>
                )}
              </div>
              {fromObservesDST && (
                <p className="text-xs text-[var(--text-muted)] pt-1">
                  تُطبّق {fromCity.city_name_ar} التوقيت الصيفي — قد يزيد فرق التوقيت أو يقل بساعة في مواسم معينة.
                </p>
              )}
            </div>

            {/* City B */}
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">المدينة الثانية</p>
              <p className="text-2xl font-black">{toCity.city_name_ar}</p>
              <p className="text-sm text-[var(--text-muted)]">{toCity.country_name_ar}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-[var(--bg-surface-2)] border border-[var(--border-default)]">
                  🕐 {toOffsetStr}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border ${toDST ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' : 'bg-[var(--bg-surface-2)] border-[var(--border-default)] text-[var(--text-secondary)]'}`}>
                  {toDST ? '☀️ توقيت صيفي نشط' : '🌙 توقيت شتوي (قياسي)'}
                </span>
                {!toObservesDST && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--bg-surface-3)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                    ⚓ لا يتغير طوال السنة
                  </span>
                )}
              </div>
              {toObservesDST && (
                <p className="text-xs text-[var(--text-muted)] pt-1">
                  تُطبّق {toCity.city_name_ar} التوقيت الصيفي — قد يزيد فرق التوقيت أو يقل بساعة في مواسم معينة.
                </p>
              )}
            </div>
          </div>

          {/* Difference Summary bar */}
          <div className={`px-6 py-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-3 ${diffMinutes === 0 ? 'bg-[var(--success-soft)]' : 'bg-[var(--bg-surface-2)]'}`}>
            <span className="text-2xl font-black">{diffMinutes === 0 ? 'نفس التوقيت' : (diffMinutes > 0 ? `+${diffLabel}` : `-${diffLabel}`)}</span>
            <span className="text-sm text-[var(--text-muted)]">
              {diffMinutes === 0
                ? `كلتا المدينتين في النطاق ${fromOffsetStr}`
                : `${toCity.city_name_ar} ${diffMinutes > 0 ? 'تسبق' : 'تتأخر عن'} ${fromCity.city_name_ar}`}
            </span>
            {(fromObservesDST || toObservesDST) && (
              <span className="mr-auto text-xs px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 font-bold">
                ⚠️ قد يتغير الفارق موسميًا
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── SEO Section 1: main explanation ── */}
      <section className="max-w-4xl mx-auto px-4 pb-12 space-y-5">
        <h2 className="text-2xl md:text-3xl font-black border-r-4 border-[var(--accent)] pr-4">
          فرق التوقيت بين {fromCity.city_name_ar} و{toCity.city_name_ar} اليوم
        </h2>

        {/* Always-visible fact bar */}
        <div className="grid grid-cols-2 rounded-2xl border border-[var(--border-default)] overflow-hidden">
          <div className="p-4 bg-[var(--bg-surface-1)]">
            <p className="text-xs font-bold text-[var(--text-muted)] mb-1">{fromCity.city_name_ar}</p>
            <p className="text-xl font-black text-[var(--accent)]">{fromOffsetStr}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {fromDST ? '☀️ توقيت صيفي الآن' : '🌙 توقيت قياسي'}
              {!fromObservesDST && ' · ثابت طوال السنة'}
            </p>
          </div>
          <div className="p-4 bg-[var(--bg-surface-2)] border-r border-[var(--border-default)]">
            <p className="text-xs font-bold text-[var(--text-muted)] mb-1">{toCity.city_name_ar}</p>
            <p className="text-xl font-black text-[var(--accent)]">{toOffsetStr}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {toDST ? '☀️ توقيت صيفي الآن' : '🌙 توقيت قياسي'}
              {!toObservesDST && ' · ثابت طوال السنة'}
            </p>
          </div>
        </div>

        <p className="text-[var(--text-secondary)] leading-loose text-base md:text-lg">
          {diffMinutes === 0
            ? <>تقع <strong>{fromCity.city_name_ar}</strong> و<strong>{toCity.city_name_ar}</strong> في نفس النطاق الزمني <strong>{fromOffsetStr}</strong> تمامًا. لا يوجد أي فارق في التوقيت بينهما في أي وقت.</>
            : <>تقع <strong>{fromCity.city_name_ar}</strong> في النطاق الزمني <strong>{fromOffsetStr}</strong>، بينما تقع <strong>{toCity.city_name_ar}</strong> في <strong>{toOffsetStr}</strong>. الفارق الزمني الحالي بينهما هو <strong>{diffLabel}</strong>، حيث تسبق <strong>{ahead}</strong> <strong>{behind}</strong>.</>
          }
        </p>
        {diffMinutes !== 0 && (
          <p className="text-[var(--text-secondary)] leading-loose text-base md:text-lg">
            مثال: إذا كانت الساعة <strong>9:00 صباحًا</strong> في {fromCity.city_name_ar}،
            فهي <strong>{fmtAr(9 + diffHours)}</strong> في {toCity.city_name_ar}.
            يجب مراعاة هذا الفارق عند تنسيق الاجتماعات أو التواصل بين الموجودين في المدينتين.
          </p>
        )}
      </section>

      {/* ── SEO Section 2: DST explanation ── */}
      <section className="max-w-4xl mx-auto px-4 pb-12 space-y-5">
        <h2 className="text-2xl md:text-3xl font-black border-r-4 border-[var(--accent)] pr-4">
          هل يتغير فرق التوقيت بين {fromCity.city_name_ar} و{toCity.city_name_ar} خلال السنة؟
        </h2>

        {/* Per-city DST fact table */}
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden">
          <div className="grid grid-cols-3 bg-[var(--bg-surface-2)] border-b border-[var(--border-subtle)]">
            <div className="px-4 py-2 text-xs font-bold text-[var(--text-muted)]" />
            <div className="px-4 py-2 text-xs font-bold text-[var(--text-muted)] text-center">{fromCity.city_name_ar}</div>
            <div className="px-4 py-2 text-xs font-bold text-[var(--text-muted)] text-center border-r border-[var(--border-subtle)]"> {toCity.city_name_ar}</div>
          </div>
          {[
            {
              label: 'يطبق التوقيت الصيفي؟',
              from: fromObservesDST ? '✅ نعم' : '❌ لا',
              to:   toObservesDST   ? '✅ نعم' : '❌ لا',
            },
            {
              label: 'الحالة الآن',
              from: fromDST ? '☀️ صيفي' : '🌙 شتوي',
              to:   toDST   ? '☀️ صيفي' : '🌙 شتوي',
            },
            {
              label: 'التوقيت (UTC)',
              from: fromOffsetStr,
              to:   toOffsetStr,
            },
            {
              label: 'الفارق ثابت طوال السنة؟',
              from: (!fromObservesDST && !toObservesDST) ? '✅ نعم' : (fromObservesDST || toObservesDST ? '⚠️ لا' : '—'),
              to: '—',
            },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-3 border-b border-[var(--border-subtle)] last:border-0">
              <div className="px-4 py-3 text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-surface-1)]">{row.label}</div>
              <div className="px-4 py-3 text-sm font-bold text-center">{row.from}</div>
              <div className="px-4 py-3 text-sm font-bold text-center border-r border-[var(--border-subtle)]">{row.to}</div>
            </div>
          ))}
        </div>

        <p className="text-[var(--text-secondary)] leading-loose text-base md:text-lg">
          {(!fromObservesDST && !toObservesDST)
            ? <>الفارق بين {fromCity.city_name_ar} و{toCity.city_name_ar} ثابت تمامًا على مدار السنة. لا تطبق أي من المدينتين التوقيت الصيفي، لذا يبقى الفارق دائمًا <strong>{diffLabel}</strong> بغض النظر عن الشهر أو الموسم.</>
            : (!fromObservesDST && toObservesDST)
            ? <>{toCity.city_name_ar} تطبق التوقيت الصيفي (تُقدّم ساعتها عادةً في آخر أحد من مارس وتُعيدها في آخر أحد من أكتوبر)، بينما {fromCity.city_name_ar} لا تطبقه. هذا يعني أن الفارق الحالي <strong>{diffLabel}</strong> قد يتغير بمقدار ساعة خلال فترة التوقيت الصيفي.</>
            : (fromObservesDST && !toObservesDST)
            ? <>{fromCity.city_name_ar} تطبق التوقيت الصيفي، بينما {toCity.city_name_ar} لا تطبقه. الفارق الحالي <strong>{diffLabel}</strong> قد يتغير بمقدار ساعة في الربيع والخريف.</>
            : <>كلتا المدينتين تطبقان التوقيت الصيفي. إذا كانتا تُقدّمان ساعتيهما في نفس الوقت فالفارق يبقى ثابتًا، وإلا فقد يختلف مؤقتًا بمقدار ساعة. الفارق الحالي هو <strong>{diffLabel}</strong>.</>
          }
        </p>
      </section>

      {/* ── SEO Section 3: Visual time conversion cards ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black border-r-4 border-[var(--accent)] pr-4">
            تحويل الوقت بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            الوقت في {toCity.city_name_ar} مقابل كل وقت في {fromCity.city_name_ar}
          </p>
        </div>

        <div className="grid gap-6">
          {timeGroups.map(group => (
            <div key={group.label} className="bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              <div className="px-5 py-3 bg-[var(--bg-surface-2)] border-b border-[var(--border-subtle)] flex items-center gap-2">
                <span className="text-lg">{group.icon}</span>
                <span className="font-bold text-sm text-[var(--text-secondary)]">{group.label}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-x-reverse divide-[var(--border-subtle)]">
                {group.hours.map(h => {
                  const destH = h + diffHours;
                  const note = dayNote(h, diffHours);
                  return (
                    <div key={h} className="p-4 text-center space-y-1">
                      <p className="text-xs text-[var(--text-muted)] font-bold">{fromCity.city_name_ar}</p>
                      <p className="text-base font-black text-[var(--text-primary)]">{fmtAr(h)}</p>
                      <div className="text-[var(--accent)] text-xs font-bold">↓</div>
                      <p className="text-xs text-[var(--text-muted)] font-bold">{toCity.city_name_ar}</p>
                      <p className={`text-base font-black ${note ? 'text-[var(--warning)]' : 'text-[var(--accent)]'}`}>{fmtAr(destH)}</p>
                      {note && <p className="text-[9px] text-[var(--warning)] font-bold leading-tight">{note}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO Section 4: FAQ ── */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-black border-r-4 border-[var(--accent)] pr-4">
          أسئلة شائعة حول فرق التوقيت
        </h2>
        <div className="grid gap-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-[var(--bg-surface-1)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer font-bold text-sm list-none hover:bg-[var(--accent-soft)] transition-colors">
                <span>{faq.q}</span>
                <span className="text-[var(--accent)] shrink-0 group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <p className="px-5 pb-4 pt-2 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Internal links ── */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-3xl p-6">
          <h3 className="font-bold text-base mb-4 text-[var(--text-secondary)]">خدماتنا الأخرى</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { href: '/mwaqit-al-salat', icon: '🕌', label: 'مواقيت الصلاة', desc: 'أوقات دقيقة حسب موقعك أو أي مدينة' },
              { href: '/holidays', icon: '📅', label: 'العطل الرسمية', desc: 'تقويم العطل لجميع الدول العربية' },
            ].map(link => (
              <a key={link.href} href={link.href} className="flex gap-3 items-start p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all group">
                <span className="text-2xl">{link.icon}</span>
                <div>
                  <span className="block font-bold text-sm group-hover:text-[var(--accent)] transition-colors">{link.label}</span>
                  <span className="block text-xs text-[var(--text-muted)]">{link.desc}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
