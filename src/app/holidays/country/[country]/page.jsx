import Link from 'next/link';
import { notFound } from 'next/navigation';

import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import CountdownTicker from '@/components/clocks/CountdownTicker';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCountryHubModel } from '@/lib/holidays/country-hub';
import { COUNTRY_HUBS, COUNTRY_HUB_SLUGS, getCountryHubBySlug } from '@/lib/holidays/country-hub-data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

import styles from './CountryHub.module.css';

const SITE_URL = getSiteUrl();

export function generateStaticParams() {
  return COUNTRY_HUB_SLUGS.map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country } = await params;
  const hub = getCountryHubBySlug(country);
  if (!hub) return {};
  const model = await buildCountryHubModel(country);
  const year = model?.year ?? '';
  return buildCanonicalMetadata({
    title: `العطل الرسمية في ${hub.nameAr} ${year} — جدول الإجازات والعداد التنازلي`,
    description: `جدول العطل الرسمية في ${hub.nameAr} ${year} كاملاً بالتاريخين الميلادي والهجري، مع عداد تنازلي لأقرب إجازة، ومدد إجازات الأعياد، والعطل الملتصقة بنهاية الأسبوع.`,
    keywords: [
      `العطل الرسمية في ${hub.nameAr} ${year}`,
      `جدول الإجازات الرسمية ${hub.nameAr}`,
      `إجازات ${hub.nameAr} ${year}`,
      `كم باقي على العطلة القادمة في ${hub.nameAr}`,
      `العطل الرسمية ${hub.nameAr} ${year + 1}`,
    ],
    url: `${SITE_URL}/holidays/country/${hub.slug}`,
  });
}

function buildFaqItems(model) {
  const { hub, year, stats, heroRow } = model;
  const items = [
    {
      question: `كم عدد العطل الرسمية في ${hub.nameAr} ${year}؟`,
      answer: `${stats.officialCount} مناسبات رسمية معتمدة، بمجموع نحو ${stats.totalDays} يوم إجازة خلال السنة (دون احتساب أيام نهاية الأسبوع الملتصقة بها). الجدول أعلاه يعرضها كاملة بالتاريخين الميلادي والهجري مع حالة كل عطلة.`,
    },
  ];
  if (heroRow?.gregorianLabel) {
    items.push({
      question: `ما العطلة الرسمية القادمة في ${hub.nameAr}؟`,
      answer: `أقرب عطلة رسمية قادمة هي ${heroRow.nameAr} بتاريخ ${heroRow.gregorianLabel}${heroRow.hijriLabel ? ` الموافق ${heroRow.hijriLabel}` : ''}${typeof heroRow.daysRemaining === 'number' ? ` — يفصلك عنها ${heroRow.daysRemaining} يوماً` : ''}. العداد أعلى الصفحة يتابعها بالثانية.`,
    });
  }
  items.push({
    question: 'هل مواعيد العطل الإسلامية في الجدول نهائية؟',
    answer:
      'مواعيد الأعياد والمناسبات الهجرية محسوبة وفق تقويم أم القرى وقد تتقدم أو تتأخر يوماً واحداً حسب ثبوت رؤية الهلال والإعلان الرسمي في كل دولة. المواعيد الميلادية الثابتة (الأيام الوطنية ورأس السنة) لا تتغير.',
  });
  for (const extra of hub.faqExtras || []) items.push(extra);
  return items;
}

function isoLocalDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function StatusChip({ row }) {
  if (row.status === 'passed') return <span className={`${styles.chip} ${styles.chipPassed}`}>انتهت</span>;
  if (row.status === 'today') return <span className={`${styles.chip} ${styles.chipLive}`}><span className={styles.liveDot} aria-hidden="true" />اليوم</span>;
  if (row.status === 'active') return <span className={`${styles.chip} ${styles.chipLive}`}><span className={styles.liveDot} aria-hidden="true" />جارية الآن</span>;
  return (
    <span className={`${styles.chip} ${styles.chipUpcoming}`}>
      {row.daysRemaining === 0 ? 'غداً' : `بعد ${row.daysRemaining} يوم`}
    </span>
  );
}

export default async function CountryHubPage({ params }) {
  const { country } = await params;
  const hub = getCountryHubBySlug(country);
  if (!hub) notFound();

  const model = await buildCountryHubModel(country);
  if (!model) notFound();

  const { year, rows, observanceRows, heroRow, liveRow, heroRemaining, stats, longWeekends } = model;
  const faqItems = buildFaqItems(model);
  const otherHubs = COUNTRY_HUBS.filter((item) => item.slug !== hub.slug);
  const pagePath = `/holidays/country/${hub.slug}`;

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'المناسبات', item: `${SITE_URL}/holidays` },
        { '@type': 'ListItem', position: 3, name: `العطل الرسمية في ${hub.nameAr}`, item: `${SITE_URL}${pagePath}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `العطل الرسمية في ${hub.nameAr} ${year}`,
      itemListElement: rows
        .filter((row) => row.dateThisYear)
        .map((row, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Event',
            name: `${row.nameAr} — ${hub.nameAr}`,
            startDate: isoLocalDate(row.dateThisYear),
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: { '@type': 'Country', name: hub.officialNameAr },
            ...(row.eventSlug ? { url: `${SITE_URL}/holidays/${row.eventSlug}` } : {}),
          },
        })),
    },
  ];

  return (
    <main className={`bg-base ${styles.page}`} dir="rtl" lang="ar">
      <JsonLd data={schemas} />

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="مسار التنقل">
          <Link href="/holidays">المناسبات</Link>
          <span aria-hidden="true">‹</span>
          <span>{hub.nameAr}</span>
        </nav>
        <div className={styles.heroTop}>
          <span className={`${styles.flagChip} ${styles[`flag_${hub.accentClass}`] || ''}`} aria-hidden="true">
            {hub.flag}
          </span>
          <h1 className={styles.h1}>العطل الرسمية في {hub.nameAr} {year}</h1>
        </div>
        <p className={styles.todayLine}>
          اليوم: {model.todayWeekdayAr} {model.todayGregorianLabel}
          {model.todayHijriLabel ? <span className={styles.todayHijri}> — {model.todayHijriLabel}</span> : null}
        </p>
        <p className={styles.intro}>{hub.intro}</p>
      </header>

      {/* ── Live next-holiday countdown ── */}
      <section className={styles.nextCard} aria-labelledby="next-holiday-h">
        <div className={styles.nextCardHead}>
          <h2 id="next-holiday-h" className={styles.nextCardTitle}>
            {liveRow ? 'عطلة جارية الآن' : 'العطلة الرسمية القادمة'}
          </h2>
          <span className={styles.liveDot} aria-hidden="true" />
        </div>
        {liveRow ? (
          <p className={styles.nextCardLive}>
            🎉 {liveRow.nameAr} — {liveRow.gregorianLabel}
            {liveRow.hijriLabel ? ` الموافق ${liveRow.hijriLabel}` : ''}
          </p>
        ) : null}
        {heroRow ? (
          <>
            <p className={styles.nextCardName}>
              {heroRow.eventSlug ? (
                <Link href={`/holidays/${heroRow.eventSlug}`}>{heroRow.nameAr}</Link>
              ) : (
                heroRow.nameAr
              )}
              <span className={styles.nextCardDate}>
                {' '}— {heroRow.weekdayAr} {heroRow.gregorianLabel}
                {heroRow.hijriLabel ? ` • ${heroRow.hijriLabel}` : ''}
              </span>
            </p>
            {heroRow.countdownTarget && heroRemaining ? (
              <CountdownTicker
                targetISO={heroRow.countdownTarget.toISOString()}
                initialRemaining={heroRemaining}
                eventName={`${heroRow.nameAr} — ${hub.nameAr}`}
                eventDate={heroRow.gregorianLabel || ''}
                dateAr={heroRow.gregorianLabel || ''}
                dateHijri={heroRow.hijriLabel || ''}
              />
            ) : null}
          </>
        ) : null}
      </section>

      {/* ── Stats strip ── */}
      <section className={styles.stats} aria-label="ملخص العطل">
        <div className={styles.statItem}>
          <span className={styles.statChip} aria-hidden="true">📅</span>
          <div><strong>{stats.officialCount}</strong><span>عطلة رسمية</span></div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statChip} aria-hidden="true">🌴</span>
          <div><strong>{stats.totalDays}</strong><span>يوم إجازة تقريباً</span></div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statChip} aria-hidden="true">⏳</span>
          <div><strong>{stats.remainingCount}</strong><span>متبقية هذا العام</span></div>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statChip} aria-hidden="true">🛌</span>
          <div><strong>{stats.weekendLabel}</strong><span>نهاية الأسبوع</span></div>
        </div>
      </section>

      <AdTopBanner slotId={`top-holiday-country-${hub.code}`} />

      {/* ── Year timeline ── */}
      <section className={styles.section} aria-labelledby="calendar-h">
        <h2 id="calendar-h" className={styles.sectionTitle}>جدول العطل الرسمية {year} بالميلادي والهجري</h2>
        <p className={styles.sectionLead}>
          كل صف يعرض التاريخ الميلادي والهجري والمدة وحالة العطلة الآن. اضغط على اسم العطلة لصفحة العد
          التنازلي والتفاصيل الكاملة.
        </p>
        <ol className={styles.timeline}>
          {rows.map((row) => (
            <li key={row.key} className={`${styles.row} ${row.status === 'passed' ? styles.rowPassed : ''}`}>
              <div className={styles.dateBlock} aria-hidden="true">
                <span className={styles.dateDay}>{row.dayNumber ?? '—'}</span>
                <span className={styles.dateMonth}>{row.monthNameAr ?? ''}</span>
                <span className={styles.dateWeekday}>{row.weekdayAr ?? ''}</span>
              </div>
              <div className={styles.rowBody}>
                <h3 className={styles.rowName}>
                  {row.eventSlug ? <Link href={`/holidays/${row.eventSlug}`}>{row.nameAr}</Link> : row.nameAr}
                </h3>
                <p className={styles.rowMeta}>
                  {row.hijriLabel ? <span>{row.hijriLabel}</span> : null}
                  {row.durationLabel ? <span className={styles.metaDot}>{row.durationLabel}</span> : null}
                  {row.isHijri ? (
                    <span className={`${styles.metaDot} ${styles.moonNote}`} title="قد يتغير يوماً حسب رؤية الهلال">
                      🌙 حسب رؤية الهلال
                    </span>
                  ) : null}
                </p>
                {row.note ? <p className={styles.rowNote}>{row.note}</p> : null}
                {row.longWeekend && row.status !== 'passed' ? (
                  <p className={styles.bridgeBadge}>
                    إجازة ممتدة: {row.longWeekend.totalDays} أيام متصلة مع نهاية الأسبوع
                  </p>
                ) : null}
              </div>
              <div className={styles.rowStatus}>
                <StatusChip row={row} />
              </div>
            </li>
          ))}
        </ol>
        <p className={styles.disclaimer}>
          المواعيد الهجرية محسوبة وفق تقويم أم القرى وهي تقديرية — قد تتقدم أو تتأخر يوماً حسب رؤية
          الهلال والإعلان الرسمي. {hub.sourceNote}
        </p>
        <a className={styles.icsButton} href={`${pagePath}/calendar.ics`} download={`holidays-${hub.slug}-${year}.ics`}>
          ⬇️ تحميل التقويم لهاتفك (ملف iCal)
        </a>
      </section>

      {/* ── Long weekends ── */}
      {longWeekends.length > 0 ? (
        <section className={styles.section} aria-labelledby="bridges-h">
          <h2 id="bridges-h" className={styles.sectionTitle}>عطل تلتصق بنهاية الأسبوع — خطط لها مبكراً</h2>
          <ul className={styles.bridgeList}>
            {longWeekends.map((row) => (
              <li key={`bridge-${row.key}`} className={styles.bridgeItem}>
                <strong>{row.nameAr}</strong> — {row.gregorianLabel}: تتصل بنهاية الأسبوع ({hub.weekendLabel})
                لتصنع {row.longWeekend.totalDays} أيام راحة متتالية دون أخذ أي يوم من رصيد إجازاتك.
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Observances (NOT days off) ── */}
      {observanceRows.length > 0 ? (
        <section className={styles.section} aria-labelledby="observances-h">
          <h2 id="observances-h" className={styles.sectionTitle}>مناسبات وطنية ليست إجازة رسمية</h2>
          <p className={styles.sectionLead}>
            أكثر ما يخلط فيه الباحثون: هذه المناسبات يُحتفى بها رسمياً لكن الدوام فيها مستمر.
          </p>
          <ul className={styles.obsList}>
            {observanceRows.map((row) => (
              <li key={`obs-${row.key}`} className={styles.obsItem}>
                <span className={styles.obsBadge}>ليست إجازة</span>
                <div>
                  <strong>
                    {row.eventSlug ? <Link href={`/holidays/${row.eventSlug}`}>{row.nameAr}</Link> : row.nameAr}
                  </strong>
                  <p>
                    {row.approximate ? 'موعد تقريبي: ' : ''}
                    {row.gregorianLabel}
                    {row.note ? ` — ${row.note}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AdInArticle slotId={`mid-holiday-country-${hub.code}`} />

      {/* ── FAQ ── */}
      <section className={styles.section} aria-labelledby="faq-h">
        <h2 id="faq-h" className={styles.sectionTitle}>أسئلة شائعة عن العطل الرسمية في {hub.nameAr}</h2>
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <details key={item.question} className={styles.faqItem} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Other hubs ── */}
      <section className={styles.section} aria-labelledby="other-h">
        <h2 id="other-h" className={styles.sectionTitle}>العطل الرسمية في دول أخرى</h2>
        <div className={styles.hubLinks}>
          {otherHubs.map((item) => (
            <Link key={item.slug} href={`/holidays/country/${item.slug}`} className={styles.hubLink}>
              <span aria-hidden="true">{item.flag}</span> العطل الرسمية في {item.nameAr}
            </Link>
          ))}
          <Link href="/holidays" className={styles.hubLink}>
            <span aria-hidden="true">🗓️</span> كل المناسبات والأعياد
          </Link>
          <Link href="/calculators/gulf-pay-dates" className={styles.hubLink}>
            <span aria-hidden="true">💰</span> جدول رواتب الخليج
          </Link>
        </div>
      </section>

      <AdMultiplex slotId={`multiplex-holiday-country-${hub.code}`} />
    </main>
  );
}
