// app/time-difference/page.tsx
import Link from 'next/link';
import TimeDiffCalculator from "@/components/TimeDifference/TimeDiffCalculatorV2.client";
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import TimeDiffSections from '@/components/time-diff/index';
import { SiteDotLinkList } from '@/components/shared/SiteDotLinkList';
import { SiteRelatedCardGrid } from '@/components/shared/SiteRelatedCardGrid';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { ArrowLeft, ArrowLeftRight, Globe, PhoneCall, Users, Clock, CalendarClock, MapPinned } from 'lucide-react';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildTimeDifferenceHubKeywords } from '@/lib/seo/section-search-intent';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
/**
 * Metadata (Next.js App Router)
 * - extend this object if you use dynamic city-pair pages later
 */
const SITE_URL = getSiteUrl();
const TIME_DIFFERENCE_DECISION_STEPS = [
  {
    label: 'قبل الاتصال',
    title: 'راجع من يسبق الآن',
    body: 'إذا كانت المدينة الثانية تسبقك أو تتأخر عنك، لا تنظر إلى الرقم وحده. اسأل: هل الطرف الآخر في وقت عمل، مساء، نوم، أو يوم مختلف؟',
    Icon: PhoneCall,
  },
  {
    label: 'قبل الاجتماع',
    title: 'ابحث عن نافذة مشتركة',
    body: 'الوقت المناسب ليس منتصف اليوم عندك فقط. الأفضل أن يقع داخل ساعات عمل الطرفين، أو قريباً منها إذا قبل أحد الطرفين وقتاً مبكراً أو متأخراً.',
    Icon: Users,
  },
  {
    label: 'قبل موعد مستقبلي',
    title: 'انتبه للتوقيت الصيفي',
    body: 'الفارق اليوم قد لا يبقى نفسه بعد شهر. إذا كان الموعد مستقبلياً، استخدم التحويل داخل الأداة ولا تعتمد على فرق ساعات محفوظ من الذاكرة.',
    Icon: Clock,
  },
];

const TIME_DIFFERENCE_MISTAKES = [
  {
    title: 'تحفظ فرقاً قديماً',
    body: 'تقول إن الفرق بين بلدين ساعتان دائماً، ثم يتغير توقيت صيفي في بلد واحد. الحل: احسب الموعد بالتاريخ نفسه.',
  },
  {
    title: 'تنسى اليوم التالي',
    body: 'قد تكون الساعة 11 مساءً عندك و2 صباحاً في المدينة الثانية. لذلك اقرأ التاريخ المحلي مع الساعة، لا الساعة وحدها.',
  },
  {
    title: 'تستخدم اختصاراً غامضاً',
    body: 'اختصارات مثل CST وEST قد تعني مناطق مختلفة. اسم IANA مثل Asia/Riyadh أو America/New_York أوضح عند ضبط التطبيقات.',
  },
  {
    title: 'تتجاهل نصف الساعة',
    body: 'ليست كل الفروق ساعات كاملة. الهند وإيران ونيبال أمثلة تجعل الحساب اليدوي بالدقيقة ضرورياً.',
  },
];

const TIME_DIFFERENCE_SOURCE_LINKS = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'قاعدة IANA للمناطق الزمنية',
    description: 'مرجع أسماء المناطق الزمنية وقواعد DST التي تستخدمها أنظمة التشغيل والتطبيقات.',
  },
  {
    href: 'https://www.bipm.org/en/time-metrology',
    label: 'BIPM ومرجعية UTC',
    description: 'شرح رسمي لمرجع الوقت العالمي UTC الذي تُقاس عليه فروق التوقيت.',
  },
  {
    href: 'https://www.timeanddate.com/time/dst/',
    label: 'شرح التوقيت الصيفي DST',
    description: 'مرجع عملي لفهم تغيير الساعة ولماذا يتبدل الفرق بين مدينتين في بعض المواسم.',
  },
];

function isValidPopularPair(pair) {
  return Boolean(
    pair
      && typeof pair === 'object'
      && typeof pair.from?.slug === 'string'
      && typeof pair.to?.slug === 'string'
      && typeof pair.from?.nameAr === 'string'
      && typeof pair.to?.nameAr === 'string',
  );
}

const SAFE_POPULAR_PAIRS = Array.isArray(POPULAR_PAIRS)
  ? POPULAR_PAIRS.filter(isValidPopularPair)
  : [];

export const metadata = buildCanonicalMetadata({
  title:
    "فرق التوقيت بين أي مدينتين الآن — مباشر مع DST وUTC | ميقاتنا",
  description:
    "ساعة مزدوجة حية + فرق التوقيت بالدقيقة بين أي مدينتين أو دولتين. جدول تحويل الوقت، مقارنة UTC والتوقيت الصيفي DST، وأفضل وقت للاجتماع أو الاتصال.",
  keywords: buildTimeDifferenceHubKeywords(SAFE_POPULAR_PAIRS),
  url: `${SITE_URL}/time-difference`,
});

export default async function TimeDifferencePage() {
  const hubKeywords = buildTimeDifferenceHubKeywords(SAFE_POPULAR_PAIRS);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "فرق التوقيت بين المدن والدول",
    url: `${SITE_URL}/time-difference`,
    description:
      "قسم حاسبة فرق التوقيت في ميقاتنا يربط بين مقارنات الدول والمدن، التحويل المباشر، التاريخ المحلي، ساعات العمل المشتركة، ودعم التوقيت الصيفي.",
    inLanguage: "ar",
  };
  const popularPairsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أشهر مقارنات فرق التوقيت",
    itemListElement: SAFE_POPULAR_PAIRS.slice(0, 12).map((pair, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}`,
      url: `${SITE_URL}/time-difference/${pair.from.slug}/${pair.to.slug}`,
    })),
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: '/time-difference',
    name: 'حاسبة فرق التوقيت بين بلدين أو مدينتين',
    description:
      'أداة عربية مجانية لحساب فرق التوقيت بين بلدين أو مدينتين الآن، مع التحويل المباشر، التاريخ المحلي، أفضل وقت للاتصال، ومراعاة التوقيت الصيفي وUTC.',
    about: [
      'فرق التوقيت',
      'تحويل الوقت بين المدن',
      'الوقت الان',
      'التوقيت الصيفي',
      'الاجتماعات الدولية',
    ],
    keywords: hubKeywords,
  });
  const popularPairQuickLinks = SAFE_POPULAR_PAIRS.slice(0, 6).map((pair) => ({
    href: `/time-difference/${pair.from.slug}/${pair.to.slug}`,
    fromName: pair.from.nameAr,
    toName: pair.to.nameAr,
    volume: pair.volume || null,
  }));
  const utilityLinks = appendToolDiscoveryLinks([
    {
      href: "/time-now",
      label: "الوقت الان في المدن والدول",
      Icon: MapPinned,
    },
    {
      href: "/date/today",
      label: "تاريخ اليوم",
      Icon: CalendarClock,
    },
    {
      href: "/holidays",
      label: "المناسبات القادمة",
      Icon: Globe,
    },
  ]);

  // HowTo schema for "تحويل الوقت بين مدينتين" (step-by-step)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "كيفية تحويل الوقت بين مدينتين (خطوة بخطوة)",
    description:
      "خطوات سريعة لتحويل الوقت من مدينة إلى أخرى مع مراعاة فرق التوقيت والتاريخ المحلي والتوقيت الصيفي.",
    step: [
      {
        "@type": "HowToStep",
        name: "حدد المدينة الأولى (مصدر الوقت)",
        text: "اختر المدينة أو البلد الذي يظهر الوقت الذي تريد تحويله."
      },
      {
        "@type": "HowToStep",
        name: "حدد المدينة الثانية (الوجهة)",
        text: "اختر المدينة المستهدفة لمعرفة الوقت المكافئ هناك."
      },
      {
        "@type": "HowToStep",
        name: "تحقق من حالة التوقيت الصيفي",
        text: "تأكد من ما إذا كانت إحدى المدينتين في توقيت صيفي لأن ذلك يغير الفارق."
      },
      {
        "@type": "HowToStep",
        name: "اقرأ النتيجة واطّلع على ساعات العمل المشتركة",
        text: "ستظهر لك النتيجة بالساعات والدقائق، وستعرض الأداة أيضاً أي تداخل في ساعات العمل لتسهيل جدول الاجتماعات."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-base text-primary time-diff-hub-page" dir="rtl">
      <AdLayoutWrapper>
        <div className="layout-content-shell">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(popularPairsSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
          />
          <main className="content-col pt-24 mt-12 time-diff-hub-main">
        {/* First thing on the page, before the breadcrumb/H1 — see
            AdTopBanner.tsx v3. */}
        <AdTopBanner slotId="top-time-diff-list" />

        {/* JSON-LD structured data (HowTo) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />

        {/* HERO */}
        <header className="text-center mb-12 time-diff-hub-hero">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.9rem',
              borderRadius: '999px',
              background: 'var(--accent-soft)',
              border: '1px solid var(--border-accent)',
              fontSize: '0.78rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginBottom: '1rem',
            }}
          >
            <Globe size={13} />
            حاسبة الوقت بين المدن والدول
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            احسب فرق التوقيت بين بلدين أو مدينتين الآن
          </h1>
          <p className="mt-4 text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            اختر مدينتين لتحصل فوراً على الفارق، من يسبق الآن، التاريخ المحلي عند الطرفين، وأفضل ساعات التداخل للاتصال أو الاجتماع. إذا كان الموعد مستقبلياً، راجع DST وUTC بدلاً من حفظ فرق ساعات قديم.
          </p>
        </header>

        {/* Calculator */}
        <section aria-label="حاسبة فرق التوقيت" style={{ marginBottom: 'var(--space-12)' }}>
          <TimeDiffCalculator />
        </section>

        {/* Plain text + icon-chip inline list — sequential instructions, no card boxes and no
            border-top/bottom lines (owner, 2026-08-13: replacing the old !important-driven
            line-separated list in editorial-redesign.css). */}
        <section aria-labelledby="time-difference-decision-heading" className="date-section max-w-3xl">
          <h2 id="time-difference-decision-heading" className="date-section-title">
            كيف تستخدم النتيجة بدون خطأ؟
          </h2>
          <p className="date-editorial-copy">
            فرق التوقيت ليس رقماً للحفظ فقط. اقرأ النتيجة كقرار: هل أتصل الآن، هل أرسل دعوة اجتماع، وهل الموعد يقع في نفس اليوم عند الطرفين؟
          </p>
          <ul className="date-use-inline-list">
            {TIME_DIFFERENCE_DECISION_STEPS.map((step) => (
              <li key={step.title}>
                <span className="date-use-icon" aria-hidden="true"><step.Icon size={16} strokeWidth={1.75} /></span>
                <span><strong>{step.title}</strong> — {step.body}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Real cards — 4 genuinely comparable "common mistake" facts, not sequential steps,
            so a peer-card grid is the right shape here (DESIGN.md Law 4: cards for comparable
            items, not for plain prose). */}
        <section aria-labelledby="time-difference-mistakes-heading" className="date-section">
          <h2 id="time-difference-mistakes-heading" className="date-section-title">
            متى يكون حساب فرق التوقيت مضللاً؟
          </h2>
          <p className="date-section-copy mb-5">
            الرقم الصحيح اليوم قد يصبح خاطئاً إذا تغير التاريخ أو دخل أحد الطرفين في توقيت صيفي. هذه أخطاء متكررة عند المكالمات والسفر والاجتماعات العابرة للمناطق الزمنية.
          </p>
          <div className="date-use-list" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
            {TIME_DIFFERENCE_MISTAKES.map((item) => (
              <article key={item.title} className="date-use-item">
                <h3 className="date-use-title">{item.title}</h3>
                <p className="date-use-copy">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Smart comparison cards — two specific cities + an optional "most searched" badge,
            not a generic related-link card (owner, 2026-08-13: "should have better smart card
            that catch the user eye"). Capped at 6, down from a plain list that could grow
            unbounded ("so much related pages... not that much"). */}
        <section aria-labelledby="popular-time-difference-links-heading" className="date-section">
          <h2 id="popular-time-difference-links-heading" className="date-section-title">
            مقارنات جاهزة إذا كان سؤالك شائعاً
          </h2>
          <p className="date-section-copy mb-5">
            إذا كنت تبحث عن زوج مدن معروف، افتح المقارنة مباشرة. أما إذا كان لديك
            زوج مختلف، فالأداة في الأعلى تعطيك النتيجة نفسها لأي مدينة أو دولة.
          </p>
          {popularPairQuickLinks.length > 0 ? (
            <div className="site-pair-grid">
              {popularPairQuickLinks.map((pair) => (
                <Link key={pair.href} href={pair.href} className="site-pair-card">
                  {pair.volume && <span className="badge badge-accent" style={{ width: 'fit-content' }}>{pair.volume}</span>}
                  <span className="site-pair-cities">
                    {pair.fromName}
                    <ArrowLeftRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    {pair.toName}
                  </span>
                  <span className="site-pair-cta">
                    افتح المقارنة
                    <ArrowLeft size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="date-editorial-copy" role="status">
              لا تظهر المقارنات الجاهزة الآن، لكن الحاسبة في أعلى الصفحة ما زالت تعمل لأي مدينتين تختارهما.
            </p>
          )}
        </section>

        {/* Sources — plain small dot-list like /tools, last thing before the FAQ. */}
        <section aria-labelledby="time-difference-sources-heading" className="date-section max-w-3xl">
          <SiteDotLinkList
            heading="مصادر مفيدة لفهم UTC وDST"
            headingId="time-difference-sources-heading"
            items={TIME_DIFFERENCE_SOURCE_LINKS.map((source) => ({
              href: source.href,
              label: source.label,
              description: source.description,
              external: true,
            }))}
          />
        </section>

          </main>
          <TimeDiffSections />
          <section className="content-col pb-20">
            {/* Related pages — small clean cards, not a dot-list (owner, 2026-08-13: "related
                pages and tools should be small clean cards"). */}
            <SiteRelatedCardGrid
              heading="خطوتك التالية بعد حساب فرق التوقيت"
              headingId="time-difference-next-paths-heading"
              items={utilityLinks}
            />
            <AdMultiplex slotId="end-time-difference-hub" />
          </section>
        </div>
      </AdLayoutWrapper>
    </div>
  );
}
