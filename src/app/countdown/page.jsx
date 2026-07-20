// src/app/countdown/page.jsx
import Link from 'next/link';
import { Suspense } from 'react';
import {
  CalendarClock,
  Gift,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Moon,
  Plane,
  Rocket,
} from 'lucide-react';

import CountdownTicker, { ShareBar } from '@/components/clocks/CountdownTicker';
import CountdownCreatorForm from '@/components/countdown/CountdownCreatorForm.client';
import { JsonLd } from '@/components/seo/JsonLd';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import { getSiteUrl } from '@/lib/site-config';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getTimeRemaining, formatGregorianAr } from '@/lib/holidays-engine';
import { convertDate } from '@/lib/date-adapter';
import { getCachedNowIso } from '@/lib/date-utils';
import { sanitizeCountdownTitle } from '@/lib/countdown/resolve';
import { logger, serializeError } from '@/lib/logger';
import styles from '../date/DateRoutePage.module.css';

const BASE_URL = getSiteUrl();
const PAGE_PATH = '/countdown';

const PAGE_KEYWORDS = [
  'عداد تنازلي',
  'أنشئ عداد تنازلي',
  'عداد تنازلي لأي مناسبة',
  'عداد تنازلي لمناسبتي',
  'عداد تنازلي مجاني',
  'كم باقي على مناسبتي',
  'عداد تنازلي بالهجري',
  'عداد تنازلي للزواج',
  'عداد تنازلي للامتحان',
  'مشاركة عداد تنازلي',
];

const USE_CASES = [
  { icon: HeartHandshake, title: 'زفاف أو خطوبة', body: 'شارك رابط العداد مع العائلة والأصدقاء ليتابعوا معك العد التنازلي حتى يوم الزفاف نفسه.' },
  { icon: GraduationCap, title: 'امتحان أو تخرج', body: 'ثبّت موعد الامتحان أو حفل التخرج، وتابع الأيام والساعات المتبقية للاستعداد الجيد.' },
  { icon: Rocket, title: 'إطلاق منتج أو مشروع', body: 'أنشئ عداداً علنياً لإطلاق منتجك، وشاركه على وسائل التواصل لبناء الترقب قبل الإطلاق.' },
  { icon: Plane, title: 'سفر أو إجازة', body: 'عداد بسيط لموعد الرحلة أو بداية الإجازة، مع رابط جاهز لإرساله في مجموعة العائلة.' },
  { icon: Gift, title: 'مناسبة شخصية', body: 'عيد ميلاد صديق، ذكرى سنوية، أو أي موعد يهمك — أدخل التاريخ واحصل على رابط فوري.' },
  { icon: CalendarClock, title: 'موعد رسمي أو عمل', body: 'نهاية عقد، تجديد إقامة، أو موعد تسليم مشروع — عداد واضح يذكّرك بالوقت المتبقي بدقة.' },
];

const FAQ_ITEMS = [
  {
    question: 'كيف أنشئ عداداً تنازلياً لمناسبتي؟',
    answer: 'اكتب اسم المناسبة، اختر التاريخ بالتقويم الميلادي أو الهجري، وحدد الوقت إن أردت، ثم اضغط «أنشئ العداد وشاركه». ستحصل فوراً على رابط عداد تنازلي حي جاهز للمشاركة.',
  },
  {
    question: 'هل يدعم العداد التنازلي التاريخ الهجري؟',
    answer: 'نعم. يمكنك إدخال تاريخ المناسبة بالتقويم الهجري مباشرة، وسيحوّله العداد تلقائياً إلى الموعد الميلادي المطابق باستخدام نفس محرك تقويم أم القرى المستخدم في باقي أدوات الموقع.',
  },
  {
    question: 'هل يحتاج إنشاء العداد التنازلي إلى تسجيل حساب؟',
    answer: 'لا. الأداة مجانية بالكامل ولا تحتاج بريداً إلكترونياً أو حساباً أو تسجيل دخول. تنشئ العداد وتحصل على رابط قابل للمشاركة فوراً.',
  },
  {
    question: 'هل يرى كل من يفتح الرابط نفس الوقت المتبقي بالضبط؟',
    answer: 'نعم. العداد يحسب الوقت حتى لحظة زمنية حقيقية واحدة، فكل من يفتح رابط المناسبة — بغض النظر عن بلده أو توقيته المحلي — يرى العد التنازلي حتى نفس اللحظة الفعلية للمناسبة.',
  },
  {
    question: 'كم باقي على مناسبتي بالضبط؟',
    answer: 'بعد إنشاء العداد يظهر الوقت المتبقي حياً بالأيام والساعات والدقائق والثواني، ويتحدّث كل ثانية دون الحاجة لإعادة تحميل الصفحة.',
  },
  {
    question: 'هل يمكن مشاركة العداد التنازلي عبر واتساب؟',
    answer: 'نعم، بعد إنشاء العداد تظهر أزرار مشاركة مباشرة عبر واتساب وتيليغرام وX وفيسبوك، إضافة إلى نسخ الرابط أو إضافة الموعد إلى تقويم جوجل أو تقويم آبل مباشرة.',
  },
  {
    question: 'هل يبقى رابط العداد التنازلي يعمل بعد إغلاق الصفحة؟',
    answer: 'نعم، الرابط الذي تحصل عليه ثابت ويعمل في أي وقت لاحق طالما احتفظت به أو شاركته، ولا حاجة لإعادة إنشاء العداد من جديد لعرضه مرة أخرى.',
  },
  {
    question: 'ماذا يحدث عندما يحين موعد المناسبة؟',
    answer: 'عند وصول اللحظة المحددة يتوقف العداد عند الصفر ويظهر تنبيه أن المناسبة حانت الآن، بدلاً من عرض أرقام سالبة أو مضللة.',
  },
];

function parseSharedCountdown(rawTitle, rawDate) {
  const title = sanitizeCountdownTitle(rawTitle);
  if (!title || !rawDate) return null;

  const targetDate = new Date(String(rawDate));
  if (Number.isNaN(targetDate.getTime())) return null;

  return { title, targetDate };
}

const METADATA_TITLE = 'أنشئ عداد تنازلي لأي مناسبة مجاناً | ميقاتنا';
const METADATA_DESCRIPTION = 'أنشئ عداداً تنازلياً مجانياً لأي مناسبة بالتاريخ الهجري أو الميلادي، واحصل فوراً على رابط جاهز لمشاركته عبر واتساب وتيليغرام.';

// Static metadata only — deliberately does NOT read searchParams. A page whose
// generateMetadata depends on a dynamic API can't produce a static shell under
// cacheComponents (the whole route, including the static H1/FAQ/ads, would be
// forced dynamic — this is what caused the prerender failure). The noindex
// treatment for shared-countdown URLs (?title=&date=) is applied via the
// `x-robots-tag` response header in src/proxy.ts instead, the same pattern
// already used for /fahras's ?q=/?tab= variants.
export const metadata = {
  title: METADATA_TITLE,
  description: METADATA_DESCRIPTION,
  keywords: PAGE_KEYWORDS.join(', '),
  alternates: { canonical: `${BASE_URL}${PAGE_PATH}` },
  openGraph: {
    title: METADATA_TITLE,
    description: METADATA_DESCRIPTION,
    url: `${BASE_URL}${PAGE_PATH}`,
    locale: 'ar_SA',
  },
};

const BREADCRUMB = [
  { label: 'الرئيسية', href: '/' },
  { label: 'عداد تنازلي' },
];
const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: BREADCRUMB.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
  })),
};

const TOOL_SCHEMA = buildFreeToolPageSchema({
  siteUrl: BASE_URL,
  path: PAGE_PATH,
  name: 'أنشئ عداد تنازلي لأي مناسبة',
  description: 'أداة مجانية لإنشاء عداد تنازلي حي لأي مناسبة بالتاريخ الهجري أو الميلادي، مع رابط جاهز للمشاركة عبر واتساب وتيليغرام.',
  about: ['عداد تنازلي', 'مناسبات', 'التقويم الهجري', 'مشاركة رابط'],
  keywords: PAGE_KEYWORDS,
});

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'أسئلة شائعة عن العداد التنازلي',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

// The ONLY part of this page that reads searchParams — isolated behind
// Suspense so the rest of the page (H1, FAQ, ads, JSON-LD) stays a fully
// static shell instead of the whole route being forced dynamic.
async function SharedCountdownSection({ searchParams }) {
  const params = await searchParams;
  const shared = parseSharedCountdown(params?.title, params?.date);
  if (!shared) return null;

  const nowIso = await getCachedNowIso();
  const nowMs = new Date(nowIso).getTime();
  const remaining = getTimeRemaining(shared.targetDate, nowMs);
  const gregStr = formatGregorianAr(shared.targetDate);

  let hijriStr = '';
  try {
    const isoDateOnly = shared.targetDate.toISOString().slice(0, 10);
    const hijriResult = convertDate({ date: isoDateOnly, toCalendar: 'hijri' });
    hijriStr = `${hijriResult.formatted.ar}هـ`;
  } catch (error) {
    logger.warn('countdown-share-hijri-conversion-failed', { error: serializeError(error) });
  }

  const targetIso = shared.targetDate.toISOString();
  const eventDate = hijriStr ? `${gregStr}، ${hijriStr}` : gregStr;
  const shareUrl = `${BASE_URL}${PAGE_PATH}?${new URLSearchParams({ title: shared.title, date: targetIso }).toString()}`;

  return (
    <section
      className={`container mx-auto px-4 ${styles.sectionBand}`}
      aria-labelledby="shared-countdown-heading"
    >
      <div className={styles.sectionPanel}>
        <h2 id="shared-countdown-heading" className={styles.sectionTitle} style={{ textAlign: 'center' }}>
          {shared.title}
        </h2>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <CountdownTicker
            targetISO={targetIso}
            initialRemaining={remaining}
            eventName={shared.title}
            eventDate={eventDate}
            dateAr={gregStr}
            dateHijri={hijriStr}
            isDark
          />
        </div>
        <div style={{ marginTop: 'var(--space-5)' }}>
          <ShareBar
            url={shareUrl}
            eventName={shared.title}
            days={remaining.days}
            dateStr={gregStr}
            eventISODate={remaining.total > 0 ? targetIso : null}
          />
        </div>
      </div>
    </section>
  );
}

export default function CountdownPage({ searchParams }) {
  return (
    <>
      <JsonLd data={[TOOL_SCHEMA, BREADCRUMB_SCHEMA, FAQ_SCHEMA]} />
      <AdLayoutWrapper>
        <main className={styles.main}>
          <section
            className={`container mx-auto px-4 ${styles.heroSection} ${styles.heroCompact}`}
            aria-labelledby="countdown-title"
          >
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <h1 id="countdown-title" className={styles.heroTitle}>
                  أنشئ عداد تنازلي لأي مناسبة
                </h1>
                <p className={styles.heroLead}>
                  اكتب اسم المناسبة واختر تاريخها بالميلادي أو الهجري، واحصل فوراً على عداد حي ورابط
                  جاهز لمشاركته — بلا تسجيل وبلا حساب.
                </p>
              </div>
            </div>
          </section>

          <Suspense fallback={null}>
            <SharedCountdownSection searchParams={searchParams} />
          </Suspense>

          <section
            className={`container mx-auto px-4 ${styles.sectionBand}`}
            aria-label="أداة إنشاء العداد التنازلي"
          >
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>أنشئ عداداً تنازلياً</h2>
                <p className={styles.sectionCopy}>لأي مناسبة أخرى، استخدم النموذج أدناه لإنشاء عداد منفصل بنفس الطريقة.</p>
              </div>
              <Suspense fallback={<div className="calc-note">جارٍ تجهيز الأداة…</div>}>
                <CountdownCreatorForm />
              </Suspense>
            </div>
          </section>

          <AdTopBanner slotId="top-countdown" />

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="countdown-use-cases-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <h2 id="countdown-use-cases-heading" className={styles.sectionTitle}>
                  لأي مناسبة تحتاج عداداً تنازلياً؟
                </h2>
                <p className={styles.sectionCopy}>
                  الأداة عامة وتصلح لأي تاريخ تنتظره — هذه أكثر الاستخدامات شيوعاً.
                </p>
              </div>
              <div className={styles.infoGrid}>
                {USE_CASES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className={styles.infoCard}>
                      <span className={styles.cardIcon} aria-hidden="true">
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <h3 className={styles.cardTitle}>{item.title}</h3>
                      <p className={styles.cardBody}>{item.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <div className={styles.prosePanel}>
              <h2 className={styles.sectionTitle}>لماذا هذا العداد التنازلي مختلف؟</h2>
              <div className={styles.proseBody}>
                <p>
                  أغلب أدوات العد التنازلي العربية تكتفي بالتقويم الميلادي فقط. هنا يمكنك إدخال تاريخ
                  المناسبة بالتقويم الهجري مباشرة، وسيحوّله الموقع تلقائياً باستخدام نفس محرك تقويم أم
                  القرى المستخدم في صفحات التاريخ ومواقيت الصلاة في الموقع — دون أي تحويل يدوي.
                </p>
                <p>
                  الرابط الذي تحصل عليه بعد إنشاء العداد يشير إلى نفس اللحظة الزمنية الحقيقية لكل من
                  يفتحه، أينما كان، مع أزرار مشاركة مباشرة عبر واتساب وتيليغرام، وخيار إضافة الموعد إلى
                  تقويم جوجل أو تقويم آبل بضغطة واحدة.
                </p>
              </div>
            </div>
          </section>

          <AdInArticle slotId="inarticle-countdown" />

          <section className={`container mx-auto px-4 ${styles.sectionBand}`} aria-labelledby="countdown-faq-heading">
            <div className={styles.sectionPanel}>
              <div className={styles.sectionHead}>
                <span className="badge badge-accent">أسئلة شائعة</span>
                <h2 id="countdown-faq-heading" className={styles.sectionTitle}>
                  أسئلة قبل إنشاء عدادك التنازلي
                </h2>
              </div>
              <div className={styles.faqGrid}>
                {FAQ_ITEMS.map((item) => (
                  <details key={item.question} className={styles.faqCard}>
                    <summary className={styles.faqQuestion}>
                      <HelpCircle size={16} strokeWidth={1.75} aria-hidden="true" />
                      {item.question}
                    </summary>
                    <p className={styles.cardBody}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${styles.sectionBand}`}>
            <nav aria-label="مسارات مرتبطة بالعداد التنازلي" className={styles.sectionPanel} dir="rtl">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>أدوات مرتبطة</h2>
              </div>
              <div className={`${styles.linkGrid} mt-5`}>
                <Link href="/calculators/age/countdown" className={`${styles.linkCard} ${styles.linkCardPrimary}`}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Gift size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>عداد عيد ميلادي القادم</span>
                  <span className={styles.cardBody}>عداد جاهز خصيصاً لعيد ميلادك القادم من تاريخ ميلادك مباشرة.</span>
                </Link>

                <Link href="/holidays/ramadan" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <Moon size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>كم باقي على رمضان</span>
                  <span className={styles.cardBody}>عداد جاهز ومحدّث تلقائياً لبداية شهر رمضان القادم.</span>
                </Link>

                <Link href="/holidays" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <CalendarClock size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>كل المناسبات والأعياد</span>
                  <span className={styles.cardBody}>تصفح عدادات جاهزة لعشرات المناسبات الدينية والوطنية.</span>
                </Link>

                <Link href="/date/converter" className={styles.linkCard}>
                  <span className={styles.cardIcon} aria-hidden="true">
                    <CalendarClock size={16} strokeWidth={1.75} />
                  </span>
                  <span className={styles.cardTitle}>محول التاريخ الهجري والميلادي</span>
                  <span className={styles.cardBody}>تحقق من تاريخ المناسبة بالتقويمين قبل إنشاء العداد.</span>
                </Link>
              </div>
            </nav>
          </section>

          <AdMultiplex slotId="multiplex-countdown" />
        </main>
      </AdLayoutWrapper>
    </>
  );
}
