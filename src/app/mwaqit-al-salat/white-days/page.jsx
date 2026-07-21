// app/mwaqit-al-salat/white-days/page.jsx
import { CalendarDots, Info } from '@phosphor-icons/react/ssr';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import AdMultiplex from '@/components/ads/AdMultiplex';
import FAQAccordions from '@/components/mwaqit/FAQAccordions.client';
import WhiteDaysCard from '@/components/mwaqit/WhiteDaysCard';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { JsonLd } from '@/components/seo/JsonLd';
import routeStyles from '@/app/mwaqit-al-salat/PrayerRoutePage.module.css';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getCachedNowIso } from '@/lib/date-utils';
import { getNextWhiteDays } from '@/lib/white-days';

const BASE = getSiteUrl();
const PAGE_URL = `${BASE}/mwaqit-al-salat/white-days`;

export const metadata = buildCanonicalMetadata({
  title: 'متى أيام البيض القادمة؟ | 13 و14 و15 من كل شهر هجري',
  description:
    'اعرف متى تبدأ أيام البيض القادمة (13-14-15 من الشهر الهجري الحالي) بالتقويم الميلادي، مع عد تنازلي دقيق وفضل صيامها الشهري المتكرر.',
  keywords: [
    'أيام البيض',
    'متى أيام البيض',
    'صيام أيام البيض',
    'أيام البيض هذا الشهر',
    'كم باقي على أيام البيض',
    'فضل صيام أيام البيض',
    '13 14 15 هجري',
  ],
  url: PAGE_URL,
});

const FAQS = [
  {
    q: 'ما هي أيام البيض؟',
    a: 'هي الأيام الثالث عشر والرابع عشر والخامس عشر من كل شهر هجري، سُميت بذلك لأن لياليها تكون مقمرة بالكامل من أول الليل إلى آخره، ويُستحب صيامها كل شهر.',
  },
  {
    q: 'كم مرة تتكرر أيام البيض في السنة؟',
    a: 'تتكرر كل شهر هجري، أي 12 مرة في السنة الهجرية الواحدة، على عكس المناسبات السنوية التي تأتي مرة واحدة فقط.',
  },
  {
    q: 'ما فضل صيام أيام البيض؟',
    a: 'صيامها يعدل صيام الدهر كله عند اقترانه بصيام ستة أيام من شوال أو بانتظامه شهرياً، لأن الحسنة بعشر أمثالها، فصيام ثلاثة أيام كل شهر يعادل صيام الشهر كاملاً.',
  },
  {
    q: 'هل يجب صيام الأيام الثلاثة معاً أم يمكن التفريق؟',
    a: 'الأفضل صيامها متتالية (13، 14، 15)، لكن من صام ثلاثة أيام متفرقة من الشهر نال أجر السنة الواردة في الحديث، فالمقصود صيام ثلاثة أيام من كل شهر وليس التتالي شرطاً.',
  },
  {
    q: 'كيف تُحسب أيام البيض بالتقويم الميلادي؟',
    a: 'نحول تاريخ اليوم الميلادي إلى الهجري أولاً، ثم نحدد الثالث عشر من الشهر الهجري الحالي أو القادم إذا كانت الأيام الثلاثة قد مضت، ثم نحول ذلك التاريخ الهجري مجدداً إلى ميلادي لعرضه بدقة.',
  },
  {
    q: 'ماذا لو فاتتني أيام البيض هذا الشهر؟',
    a: 'لا بأس، فهي تتكرر كل شهر هجري تلقائياً. يعرض العداد أعلى الصفحة موعد أيام البيض القادمة تلقائياً بمجرد انتهاء أيام الشهر الحالي.',
  },
];

export default async function WhiteDaysPage() {
  const nowIso = await getCachedNowIso();
  const now = new Date(nowIso);
  const whiteDays = getNextWhiteDays(now);

  const dateFormatter = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', calendar: 'gregory',
  });
  const startLabel = dateFormatter.format(whiteDays.startDate);
  const endLabel = dateFormatter.format(whiteDays.endDate);
  const hijriLabel = `${whiteDays.hijriMonthName} ${whiteDays.hijriYear} هـ`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'متى أيام البيض القادمة؟',
    url: PAGE_URL,
    description: 'عد تنازلي دقيق لأيام البيض القادمة (13-14-15 هجري) بالتقويم الميلادي.',
    inLanguage: 'ar',
  };

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `أيام البيض — ${hijriLabel}`,
    startDate: whiteDays.startDate.toISOString().slice(0, 10),
    endDate: whiteDays.endDate.toISOString().slice(0, 10),
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    description: `أيام البيض (13-14-15 ${whiteDays.hijriMonthName}) من ${startLabel} إلى ${endLabel}.`,
  };

  return (
    <div className={`${routeStyles.prayerHubPage} min-h-screen bg-base text-primary`} dir="rtl" lang="ar">
      <AdLayoutWrapper layout="wide" sidebarMode="dual">
        <main className={routeStyles.pageMain}>
          <JsonLd data={webPageSchema} />
          <JsonLd data={faqSchema} />
          <JsonLd data={eventSchema} />

          {/* First thing on the page, before the breadcrumb/H1 — see AdTopBanner.tsx v3. */}
          <AdTopBanner slotId="top-white-days" />

          <section className={`container mx-auto px-4 ${routeStyles.heroSection}`}>
            <div className={`${routeStyles.heroInner} ${routeStyles.heroCenter}`}>
              <div className={routeStyles.heroCopy}>
                <div className={routeStyles.metaPill}>
                  <CalendarDots size={13} weight="duotone" />
                  أيام البيض — {hijriLabel}
                </div>
                <h1 className={routeStyles.heroTitle}>متى أيام البيض القادمة؟</h1>
                <p className={routeStyles.heroLead}>
                  أيام البيض هي 13 و14 و15 من كل شهر هجري، وتتكرر شهرياً — صيامها الثلاثة يعادل
                  صيام الشهر كاملاً.
                </p>
              </div>

              <div className={routeStyles.searchWrap}>
                <WhiteDaysCard whiteDays={whiteDays} startLabel={startLabel} endLabel={endLabel} />
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <h2 className={routeStyles.sectionTitle}>أيام البيض القادمة بالتفصيل</h2>
                <p className={routeStyles.sectionCopy}>
                  محسوبة من التقويم الهجري (أم القرى) الحالي، وتتكرر تلقائياً كل شهر هجري بلا توقف.
                </p>
              </div>
              <div className={routeStyles.contextGrid}>
                <article className={routeStyles.contextCard}>
                  <h3 className={routeStyles.contextTitle}>التاريخ الهجري</h3>
                  <p className={routeStyles.contextBody}>13 و14 و15 {hijriLabel}</p>
                </article>
                <article className={routeStyles.contextCard}>
                  <h3 className={routeStyles.contextTitle}>بداية الصيام</h3>
                  <p className={routeStyles.contextBody}>{startLabel}</p>
                </article>
                <article className={routeStyles.contextCard}>
                  <h3 className={routeStyles.contextTitle}>نهاية الصيام</h3>
                  <p className={routeStyles.contextBody}>{endLabel}</p>
                </article>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4">
            <AdInArticle slotId="mid-white-days-1" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.proseBlock}>
                <h2>لماذا سُميت أيام البيض بهذا الاسم؟</h2>
                <p>
                  سُميت أيام البيض لأن لياليها الثلاث (ليلة 13 و14 و15) تكون مقمرة بالكامل من
                  غروب الشمس إلى طلوع الفجر، لأن القمر يكون بدراً أو قريباً من ذلك، فتبيضّ الليالي
                  بضوء القمر. وهي مناسبة شهرية متكررة، على عكس المناسبات الإسلامية السنوية التي
                  تأتي مرة واحدة في العام.
                </p>
                <ul className="space-y-1.5 list-disc ps-5">
                  <li><span className="font-semibold text-primary">التكرار:</span> كل شهر هجري، 12 مرة في السنة.</li>
                  <li><span className="font-semibold text-primary">الأيام:</span> 13 و14 و15 من كل شهر هجري.</li>
                  <li><span className="font-semibold text-primary">الفضل:</span> يعادل صيامها صيام الدهر كله لأن الحسنة بعشر أمثالها.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="أسئلة شائعة عن أيام البيض">
            <div className={routeStyles.sectionPanel}>
              <h2 className={`${routeStyles.sectionTitle} mb-6 text-center`}>أسئلة شائعة عن أيام البيض</h2>
              <FAQAccordions items={FAQS} />
            </div>
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`} aria-label="مصادر">
            <div className={routeStyles.sectionPanel}>
              <div className={routeStyles.sectionHead}>
                <span className={routeStyles.metaPill}><Info size={13} weight="duotone" />ملاحظة منهجية</span>
                <p className={routeStyles.sectionCopy}>
                  التواريخ محسوبة بتقويم أم القرى الفلكي المعتمد في باقي صفحات الموقع. قد يختلف
                  تاريخ بداية الشهر الهجري يوماً واحداً عن إعلان رؤية الهلال الرسمي في بلدك.
                </p>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 pb-20">
            <AdMultiplex slotId="end-white-days" />
          </section>

          <section className={`container mx-auto px-4 ${routeStyles.sectionBand}`}>
            <div className={routeStyles.sectionPanel}>
              <SiteTrustPanel panel="prayer" />
            </div>
          </section>
        </main>
      </AdLayoutWrapper>
    </div>
  );
}
