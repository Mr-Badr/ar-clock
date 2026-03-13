/* app/time-difference/[from]/[to]/page.jsx */
import { Suspense } from 'react';
import TimeDiffCalculator from '@/components/TimeDifference/TimeDiffCalculatorV2.client';
import { getCityBySlug } from '@/lib/db/queries/cities';
import { getCountryBySlug } from '@/lib/db/queries/countries';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import './time-difference.css';
import { SuspendedTimeSnapshot, getOffsetMinutes, observesDST, formatUTCOffset } from './time-snapshot';


// ─── City resolution ──────────────────────────────────────────────────────────
async function resolveCityFromSegment(segment) {
  console.log(`[DEBUG - SSR] resolveCityFromSegment called with segment:`, segment);
  if (!segment) return null;
  const parts = segment.split('-');
  for (let i = 0; i < parts.length - 1; i++) {
    const countrySlug = parts.slice(0, i + 1).join('-');
    const citySlug = parts.slice(i + 1).join('-');
    if (!countrySlug || !citySlug) continue;
    const country = await getCountryBySlug(countrySlug);
    if (!country) continue;
    const city = await getCityBySlug(country.country_code, citySlug);
    if (city?.timezone && city.timezone !== 'UTC') {
      return {
        country_slug: country.country_slug,
        country_name_ar: country.name_ar,
        city_slug: city.city_slug,
        city_name_ar: city.name_ar || city.name_en,
        timezone: city.timezone,
      };
    }
  }
  const country = await getCountryBySlug(parts[0]);
  if (!country) return null;
  const city = await getCityBySlug(country.country_code, parts.slice(1).join('-'));
  if (!city) return null;
  return {
    country_slug: country.country_slug,
    country_name_ar: country.name_ar,
    city_slug: city.city_slug,
    city_name_ar: city.name_ar || city.name_en,
    timezone: city.timezone || 'UTC',
  };
}
const resolveCity = cache(resolveCityFromSegment);

function dayNote(srcH, diffH) {
  const dest = srcH + diffH;
  if (dest >= 24) return 'اليوم التالي';
  if (dest < 0) return 'اليوم السابق';
  return '';
}

/** Western-numeral 12-hour Arabic time string */
function fmtTime(h24) {
  const norm = ((Math.round(h24 * 60) % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }) {
  console.log(`[DEBUG - SSR] generateMetadata started`);
  const paramsResolved = await params;
  console.log(`[DEBUG - SSR] generateMetadata params awaited:`, paramsResolved);

  const { from, to } = paramsResolved;
  const [fromCity, toCity] = await Promise.all([resolveCity(from), resolveCity(to)]);
  console.log(`[DEBUG - SSR] generateMetadata cities resolved`);
  if (!fromCity || !toCity) return { title: 'فرق التوقيت | وقت' };

  const title = `فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} الآن`;
  const description =
    `كم الفرق الزمني بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟ تحويل فوري للوقت بدقة، ` +
    `معلومات التوقيت الصيفي، وأفضل وقت للاجتماعات.محدّث لحظيًا.`;
  const keywords = [
    `فرق التوقيت بين ${fromCity.city_name_ar} و${toCity.city_name_ar} `,
    `كم الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar} `,
    `الساعة الآن في ${fromCity.city_name_ar} `,
    `الساعة الآن في ${toCity.city_name_ar} `,
    `توقيت ${fromCity.city_name_ar} الآن`,
    `توقيت ${toCity.city_name_ar} الآن`,
    `تحويل الوقت من ${fromCity.city_name_ar} إلى ${toCity.city_name_ar} `,
    `فرق التوقيت بين ${fromCity.country_name_ar} و${toCity.country_name_ar} `,
    `هل ${fromCity.city_name_ar} تطبق التوقيت الصيفي`,
    `هل ${toCity.city_name_ar} تطبق التوقيت الصيفي`,
    'حاسبة فرق التوقيت', 'تحويل الوقت بين المدن', 'فرق التوقيت',
  ].join(', ');

  return {
    title, description, keywords,
    alternates: { canonical: `/ time - difference / ${from}/${to}` },
    openGraph: { title, description, locale: 'ar_SA', type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

async function ComparisonPageContent({ paramsPromise }) {
  console.log(`[DEBUG - SSR] ComparisonPageContent performing SEO calculations`);

  const paramsResolved = await paramsPromise;
  const { from, to } = paramsResolved;

  const [fromCity, toCity] = await Promise.all([resolveCity(from), resolveCity(to)]);
  if (!fromCity || !toCity) notFound();

  // ─── Shared calculations (Independent of current time snapshot) ─────────────
  // We use a fixed reference to prevent Next.js 15 SSR bailout from `new Date()`
  const SEO_DATE = new Date('2024-01-01T12:00:00Z');
  const fromOffMin = getOffsetMinutes(fromCity.timezone, SEO_DATE);
  const toOffMin = getOffsetMinutes(toCity.timezone, SEO_DATE);
  const diffMinutes = toOffMin - fromOffMin;
  const diffHours = diffMinutes / 60;

  // For SEO and static data, we assume standard time and state if they *observe* DST.
  const fromHasDST = observesDST(fromCity.timezone, SEO_DATE);
  const toHasDST = observesDST(toCity.timezone, SEO_DATE);

  // Current DST state for the interactive table
  const CURRENT_DATE = new Date();
  const fromDST = observesDST(fromCity.timezone, CURRENT_DATE);
  const toDST = observesDST(toCity.timezone, CURRENT_DATE);

  const fromOffStr = formatUTCOffset(fromOffMin);
  const toOffStr = formatUTCOffset(toOffMin);
  const absDiffH = Math.floor(Math.abs(diffHours));
  const absDiffM = Math.abs(diffMinutes) % 60;
  const diffLabel = absDiffH > 0
    ? `${absDiffH} ساعة${absDiffM > 0 ? ` و${absDiffM} دقيقة` : ''}`
    : `${absDiffM} دقيقة`;
  const ahead = diffMinutes > 0 ? toCity.city_name_ar : fromCity.city_name_ar;
  const behind = diffMinutes > 0 ? fromCity.city_name_ar : toCity.city_name_ar;

  // Time conversion groups
  const timeGroups = [
    { label: 'الصباح', icon: '🌅', hours: [6, 7, 8, 9, 10, 11] },
    { label: 'الظهيرة', icon: '🌞', hours: [12, 13, 14, 15] },
    { label: 'المساء', icon: '🌆', hours: [16, 17, 18, 19, 20, 21] },
  ];

  // FAQ data
  const faqs = [
    {
      q: `كم ساعة الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: diffMinutes === 0
        ? `لا يوجد فرق — كلتاهما في نفس النطاق (${fromOffStr}).`
        : `الفرق الحالي ${diffLabel}. ${ahead} تسبق ${behind}. ${fromCity.city_name_ar} في ${fromOffStr} و${toCity.city_name_ar} في ${toOffStr}.`,
    },
    {
      q: `هل ${fromCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: fromHasDST
        ? `نعم. قد يتغير توقيتها بين الصيفي والشتوي خلال العام.`
        : `لا، توقيتها ثابت طوال العام عند ${fromOffStr}.`,
    },
    {
      q: `هل ${toCity.city_name_ar} تطبق التوقيت الصيفي؟`,
      a: toHasDST
        ? `نعم. قد يتغير توقيتها بين الصيفي والشتوي خلال العام.`
        : `لا، توقيتها ثابت طوال العام عند ${toOffStr}.`,
    },
    {
      q: `هل يتغير الفرق بين ${fromCity.city_name_ar} و${toCity.city_name_ar} خلال العام؟`,
      a: (!fromHasDST && !toHasDST)
        ? `لا — الفرق ثابت عند ${diffLabel} طوال السنة، إذ لا تطبق أيٌّ منهما التوقيت الصيفي.`
        : `نعم، قد يتغير بمقدار ساعة في فترات التوقيت الصيفي. الفرق الحالي ${diffLabel}.`,
    },
    {
      q: `ما أفضل وقت للاجتماعات بين ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `استخدم أداة "ساعات العمل المشتركة" في الأداة التفاعلية أعلاه لمعرفة نافذة التوقيت المشترك. يمكنك تعديل وقت الدوام حسب جدولك الفعلي.`,
    },
    {
      q: `هل التاريخ واحد في ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: Math.abs(diffMinutes) >= 720
        ? `بسبب الفرق الكبير (${diffLabel}) قد يختلف التاريخ في بعض الساعات. الأداة أعلاه تُنبّهك تلقائيًا.`
        : `في الغالب نعم، الفرق لا يتجاوز حدود اليوم في معظم الأحوال.`,
    },
    {
      q: `ما هو توقيت جرينتش لـ${fromCity.city_name_ar} و${toCity.city_name_ar}؟`,
      a: `${fromCity.city_name_ar} في ${fromOffStr}، و${toCity.city_name_ar} في ${toOffStr}.`,
    },
    {
      q: `كيف أحسب فرق التوقيت يدويًا؟`,
      a: `اطرح UTC الأولى من UTC الثانية: (${toOffMin >= 0 ? '+' : ''}${toOffMin}) − (${fromOffMin >= 0 ? '+' : ''}${fromOffMin}) = ${diffMinutes > 0 ? '+' : ''}${diffMinutes} دقيقة أي ${diffLabel}.`,
    },
    {
      q: `لماذا أحتاج معرفة فرق التوقيت؟`,
      a: `لتنسيق الاجتماعات عن بُعد، متابعة البث المباشر، تحديد أوقات الأسواق المالية، والتواصل الصحيح مع الأهل والزملاء.`,
    },
    {
      q: `هل يتغير الفرق في رمضان؟`,
      a: `لا تغيّر الدول العربية توقيتها الرسمي بسبب رمضان. الفرق يبقى ${diffLabel} إلا إذا صادف رمضان فترة التوقيت الصيفي في إحدى الدولتين.`,
    },
    {
      q: `كيف أشارك مقارنة التوقيت؟`,
      a: `اضغط زر "مشاركة" في الأداة أعلاه. يُنسخ الرابط تلقائيًا ويمكن مشاركته مباشرة.`,
    },
  ];

  // JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://yourdomain.com' },
      { '@type': 'ListItem', position: 2, name: 'فرق التوقيت', item: 'https://yourdomain.com/time-difference' },
      { '@type': 'ListItem', position: 3, name: `${fromCity.city_name_ar} – ${toCity.city_name_ar}`, item: `https://yourdomain.com/time-difference/${from}/${to}` },
    ],
  };

  console.log(`[DEBUG - SSR] ComparisonPage returning JSX`);

  return (
    <div className="min-h-screen bg-base text-primary">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="mx-auto px-4 pt-24 pb-20 max-w-[640px]">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <nav aria-label="مسار التنقل" className="text-xs text-muted mb-6 flex items-center gap-1 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">الرئيسية</Link>
          <span aria-hidden="true">›</span>
          <Link href="/time-difference" className="hover:text-accent transition-colors">فرق التوقيت</Link>
          <span aria-hidden="true">›</span>
          <span className="text-secondary">{fromCity.city_name_ar} – {toCity.city_name_ar}</span>
        </nav>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="mb-3">
            <span className={`badge ${diffMinutes === 0 ? 'badge-success' : 'badge-accent'}`}>
              {diffMinutes === 0 ? 'نفس التوقيت' : `فارق ${diffLabel}`}
            </span>
          </div>
          <h1 className="text-3xl font-black leading-tight mb-2">
            فرق التوقيت بين{' '}
            <span className="text-accent">{fromCity.city_name_ar}</span>
            {' '}و{' '}
            <span className="text-accent">{toCity.city_name_ar}</span>
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            {diffMinutes === 0
              ? `${fromCity.city_name_ar} و${toCity.city_name_ar} في نفس النطاق الزمني (${fromOffStr})`
              : `${ahead} تسبق ${behind} بـ${diffLabel} — محدّث لحظيًا`}
          </p>
        </header>

        {/* ── SSR snapshot — crawlable current times ─────────────── */}
        <section className="td-snapshot mb-8" aria-label="الوقت الحالي في المدينتين">
          <SuspendedTimeSnapshot fromCity={fromCity} toCity={toCity} />
        </section>

        {/* ── Interactive calculator ──────────────────────────────── */}
        <section className="mb-10" aria-label="حاسبة فرق التوقيت التفاعلية">
          <TimeDiffCalculator initialFrom={fromCity} initialTo={toCity} />
        </section>

        <Separator className="mb-10" style={{ backgroundColor: 'var(--border-subtle)' }} />

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 1 — Explanation
            ════════════════════════════════════════════════════════ */}
        <section className="mb-10" aria-labelledby="diff-heading">
          <h2 id="diff-heading" className="active-indicator text-xl font-bold mb-4">
            فرق التوقيت بين {fromCity.city_name_ar} و{toCity.city_name_ar} اليوم
          </h2>

          {/* Compact UTC comparison */}
          <div className="card--flat border-default card mb-4 p-0 overflow-hidden">
            <div className="grid grid-cols-2">
              <div className="p-4">
                <p className="text-xs text-muted mb-1">{fromCity.city_name_ar}</p>
                <p className="text-xl font-black tabular-nums text-accent-alt" dir="ltr">{fromOffStr}</p>
                <p className="text-xs text-muted mt-1">{fromHasDST ? '☀️ قد يتغير توقيتها موسميًا' : '· توقيت ثابت'}</p>
              </div>
              <div className="p-4 border-r border-[var(--border-subtle)]">
                <p className="text-xs text-muted mb-1">{toCity.city_name_ar}</p>
                <p className="text-xl font-black tabular-nums text-accent-alt" dir="ltr">{toOffStr}</p>
                <p className="text-xs text-muted mt-1">{toHasDST ? '☀️ قد يتغير توقيتها موسميًا' : '· توقيت ثابت'}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-secondary leading-loose">
            {diffMinutes === 0
              ? <>
                <strong className="text-primary">{fromCity.city_name_ar}</strong> و
                <strong className="text-primary">{toCity.city_name_ar}</strong> في نفس
                النطاق الزمني <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong>.
                الساعة متطابقة في كلا البلدين.
              </>
              : <>
                <strong className="text-primary">{fromCity.city_name_ar}</strong> في{' '}
                <strong dir="ltr" className="tabular-nums">{fromOffStr}</strong> و
                <strong className="text-primary">{toCity.city_name_ar}</strong> في{' '}
                <strong dir="ltr" className="tabular-nums">{toOffStr}</strong>.
                الفارق الحالي <strong className="text-primary">{diffLabel}</strong>،
                تسبق فيه <strong className="text-primary">{ahead}</strong> مدينة{' '}
                <strong className="text-primary">{behind}</strong>.
                {' '}مثال: إذا كانت الساعة <span dir="ltr" className="tabular-nums font-bold">9:00 ص</span> في{' '}
                {fromCity.city_name_ar} فهي{' '}
                <span dir="ltr" className="tabular-nums font-bold text-accent-alt">{fmtTime(9 + diffHours)}</span>{' '}
                في {toCity.city_name_ar}.
              </>
            }
          </p>
        </section>

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 2 — Time conversion table
            ════════════════════════════════════════════════════════ */}
        <section className="mb-10" aria-labelledby="conversion-heading">
          <h2 id="conversion-heading" className="active-indicator text-xl font-bold mb-4">
            تحويل الوقت بين {fromCity.city_name_ar} و{toCity.city_name_ar}
          </h2>

          <div className="space-y-4">
            {timeGroups.map(group => (
              <div key={group.label} className="table-wrapper">
                <table className="table table--compact">
                  <thead>
                    <tr>
                      <th colSpan={3} className="text-right py-2 px-4">
                        <span className="text-xs font-semibold text-secondary">
                          {group.icon} {group.label}
                        </span>
                      </th>
                    </tr>
                    <tr>
                      <th className="text-center">{fromCity.city_name_ar}</th>
                      <th className="text-center w-8" />
                      <th className="text-center">{toCity.city_name_ar}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.hours.map(h => {
                      const note = dayNote(h, diffHours);
                      return (
                        <tr key={h}>
                          <td className="numeric text-center text-primary font-bold" dir="ltr">
                            {fmtTime(h)}
                          </td>
                          <td className="text-center text-muted text-xs" aria-hidden="true">←</td>
                          <td className={`numeric text-center font-bold ${note ? 'td-warning' : 'td-accent'}`} dir="ltr">
                            {fmtTime(h + diffHours)}
                            {note && <span className="block text-xs font-semibold text-warning">{note}</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>

        <Separator className="mb-10" style={{ backgroundColor: 'var(--border-subtle)' }} />

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 3 — DST comparison
            ════════════════════════════════════════════════════════ */}
        <section className="mb-10" aria-labelledby="dst-heading">
          <h2 id="dst-heading" className="active-indicator text-xl font-bold mb-4">
            هل يتغير الفارق بين {fromCity.city_name_ar} و{toCity.city_name_ar} خلال السنة؟
          </h2>

          <div className="table-wrapper mb-4">
            <table className="table table--compact">
              <thead>
                <tr>
                  <th>المعلومة</th>
                  <th className="text-center">{fromCity.city_name_ar}</th>
                  <th className="text-center">{toCity.city_name_ar}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-secondary text-xs">التوقيت (UTC)</td>
                  <td className="numeric text-center text-primary font-semibold" dir="ltr">{fromOffStr}</td>
                  <td className="numeric text-center text-primary font-semibold" dir="ltr">{toOffStr}</td>
                </tr>
                <tr>
                  <td className="text-secondary text-xs">يطبق التوقيت الصيفي؟</td>
                  <td className="text-center">{fromHasDST ? '✅ نعم' : '❌ لا'}</td>
                  <td className="text-center">{toHasDST ? '✅ نعم' : '❌ لا'}</td>
                </tr>
                <tr>
                  <td className="text-secondary text-xs">الحالة الآن</td>
                  <td className={`text-center text-xs ${fromDST ? 'td-warning' : ''}`}>{fromDST ? '☀️ صيفي' : '🌙 شتوي'}</td>
                  <td className={`text-center text-xs ${toDST ? 'td-warning' : ''}`}>{toDST ? '☀️ صيفي' : '🌙 شتوي'}</td>
                </tr>
                <tr>
                  <td className="text-secondary text-xs">الفارق ثابت السنة؟</td>
                  <td className="text-center" colSpan={2}>
                    {(!fromHasDST && !toHasDST) ? '✅ نعم، ثابت' : '⚠️ قد يتغير موسميًا'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-secondary leading-loose">
            {(!fromHasDST && !toHasDST)
              ? <>الفارق بين {fromCity.city_name_ar} و{toCity.city_name_ar} ثابت طوال العام عند <strong className="text-primary">{diffLabel}</strong>. لا تطبق أيٌّ منهما التوقيت الصيفي.</>
              : (!fromHasDST && toHasDST)
                ? <>{toCity.city_name_ar} تطبق التوقيت الصيفي بينما {fromCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير ساعة في مارس/أكتوبر.</>
                : (fromHasDST && !toHasDST)
                  ? <>{fromCity.city_name_ar} تطبق التوقيت الصيفي بينما {toCity.city_name_ar} لا تطبقه. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يتغير موسميًا.</>
                  : <>كلتاهما تطبقان التوقيت الصيفي. الفارق الحالي <strong className="text-primary">{diffLabel}</strong> قد يبقى ثابتًا أو يتغير ساعة حسب توقيت كل منهما.</>
            }
          </p>
        </section>

        <Separator className="mb-10" style={{ backgroundColor: 'var(--border-subtle)' }} />

        {/* ════════════════════════════════════════════════════════
            SEO SECTION 4 — FAQ
            ════════════════════════════════════════════════════════ */}
        <section className="mb-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="active-indicator text-xl font-bold mb-4">
            أسئلة شائعة حول فرق التوقيت
          </h2>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="card card--flat overflow-hidden px-0 border-[var(--border-default)] data-[state=open]:border-[var(--border-accent-strong)] data-[state=open]:shadow-accent"
                style={{ padding: 0 }}
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-primary text-right hover:bg-accent-soft hover:no-underline gap-3 [&>svg]:shrink-0 [&>svg]:text-accent-alt [&>svg]:ms-auto [&>svg]:me-0">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <p className="text-sm text-secondary leading-loose border-t border-[var(--border-subtle)] pt-3 mt-1">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ════════════════════════════════════════════════════════
            Internal links
            ════════════════════════════════════════════════════════ */}
        <section>
          <h3 className="text-sm font-semibold text-muted mb-3">خدماتنا الأخرى</h3>
          <div className="grid grid-cols-1 gap-2">
            {[
              { href: '/mwaqit-al-salat', icon: '🕌', label: 'مواقيت الصلاة', desc: 'أوقات دقيقة حسب موقعك أو أي مدينة' },
              { href: '/holidays', icon: '📅', label: 'العطل الرسمية', desc: 'تقويم العطل لجميع الدول العربية' },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="card-nested flex gap-3 items-center hover:border-[var(--border-accent)] hover:bg-accent-soft transition-colors"
              >
                <span className="text-2xl shrink-0" aria-hidden="true">{link.icon}</span>
                <div>
                  <span className="block font-semibold text-sm text-primary">{link.label}</span>
                  <span className="block text-xs text-muted">{link.desc}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

// ─── Page Wrapper ─────────────────────────────────────────────────────────────
export default function ComparisonPage({ params }) {
  console.log(`[DEBUG - SSR] ComparisonPage wrapper started`);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <ComparisonPageContent paramsPromise={params} />
    </Suspense>
  );
}