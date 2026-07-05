// app/time-difference/page.tsx
import Link from 'next/link';
import TimeDiffCalculator from "@/components/TimeDifference/TimeDiffCalculatorV2.client";
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdMultiplex from '@/components/ads/AdMultiplex';
import AdTopBanner from '@/components/ads/AdTopBanner';
import TimeDiffSections from '@/components/time-diff/index';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { ArrowLeft, Globe } from 'lucide-react';
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
  },
  {
    label: 'قبل الاجتماع',
    title: 'ابحث عن نافذة مشتركة',
    body: 'الوقت المناسب ليس منتصف اليوم عندك فقط. الأفضل أن يقع داخل ساعات عمل الطرفين، أو قريباً منها إذا قبل أحد الطرفين وقتاً مبكراً أو متأخراً.',
  },
  {
    label: 'قبل موعد مستقبلي',
    title: 'انتبه للتوقيت الصيفي',
    body: 'الفارق اليوم قد لا يبقى نفسه بعد شهر. إذا كان الموعد مستقبلياً، استخدم التحويل داخل الأداة ولا تعتمد على فرق ساعات محفوظ من الذاكرة.',
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
  const popularPairQuickLinks = SAFE_POPULAR_PAIRS.slice(0, 5).map((pair) => ({
    href: `/time-difference/${pair.from.slug}/${pair.to.slug}`,
    title: `فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}`,
    description: `افتح مقارنة جاهزة تعرض من يسبق الآن وأوقات التداخل المناسبة.`,
  }));
  const utilityLinks = appendToolDiscoveryLinks([
    {
      href: "/time-now",
      label: "الوقت الان في المدن والدول",
      description: "تحقق من الوقت الحالي في كل مدينة قبل المقارنة بينها وبين أي مدينة أخرى.",
    },
    {
      href: "/mwaqit-al-salat",
      label: "مواقيت الصلاة اليوم",
      description: "انتقل إلى مواقيت الصلاة في المدن نفسها إذا كنت تخطط للسفر أو العمل بين مناطق زمنية مختلفة.",
    },
    {
      href: "/date/today",
      label: "تاريخ اليوم",
      description: "راجع التاريخ الهجري والميلادي اليوم قبل تثبيت موعد يمتد بين يومين أو منطقتين زمنيتين.",
    },
    {
      href: "/holidays",
      label: "المناسبات القادمة",
      description: "استكشف المناسبات والإجازات القادمة عند تنسيق الاجتماعات والسفر عبر الدول.",
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

        <AdTopBanner slotId="top-time-diff-list" />

        <section
          aria-labelledby="time-difference-decision-heading"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div style={{ maxWidth: '72ch', marginBottom: 'var(--space-5)' }}>
            <h2
              id="time-difference-decision-heading"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              كيف تستخدم النتيجة بدون خطأ؟
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              فرق التوقيت ليس رقماً للحفظ فقط. اقرأ النتيجة كقرار: هل أتصل الآن، هل أرسل دعوة اجتماع، وهل الموعد يقع في نفس اليوم عند الطرفين؟
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {TIME_DIFFERENCE_DECISION_STEPS.map((step) => (
              <article
                key={step.title}
                style={{
                  display: 'grid',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface-1)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-muted)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-semibold)',
                  }}
                >
                  {step.label}
                </p>
                <h3
                  style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-bold)',
                    lineHeight: 'var(--leading-snug)',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="time-difference-mistakes-heading"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div style={{ maxWidth: '72ch', marginBottom: 'var(--space-5)' }}>
            <h2
              id="time-difference-mistakes-heading"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              متى يكون حساب فرق التوقيت مضللاً؟
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              الرقم الصحيح اليوم قد يصبح خاطئاً إذا تغير التاريخ أو دخل أحد الطرفين في توقيت صيفي. هذه أخطاء متكررة عند المكالمات والسفر والاجتماعات العابرة للمناطق الزمنية.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {TIME_DIFFERENCE_MISTAKES.map((item) => (
              <article
                key={item.title}
                style={{
                  display: 'grid',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface-2)',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-bold)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="time-difference-sources-heading"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div style={{ maxWidth: '72ch', marginBottom: 'var(--space-5)' }}>
            <h2
              id="time-difference-sources-heading"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              مصادر مفيدة لفهم UTC وDST
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              الحاسبة لا تسحب هذه المصادر أثناء التشغيل، لكنها مراجع تساعدك على فهم لماذا تختلف فروق التوقيت بين المدن ولماذا تستخدم التطبيقات أسماء مناطق IANA.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {TIME_DIFFERENCE_SOURCE_LINKS.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'grid',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface-1)',
                  textDecoration: 'none',
                }}
              >
                <strong style={{ color: 'var(--text-primary)' }}>{source.label}</strong>
                <span
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {source.description}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="popular-time-difference-links-heading"
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <div>
            <h2
              id="popular-time-difference-links-heading"
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              مقارنات جاهزة إذا كان سؤالك شائعاً
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '72ch',
                marginBottom: 'var(--space-4)',
              }}
            >
              إذا كنت تبحث عن زوج مدن معروف، افتح المقارنة مباشرة. أما إذا كان لديك
              زوج مختلف، فالأداة في الأعلى تعطيك النتيجة نفسها لأي مدينة أو دولة.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-3)',
            }}
          >
            {popularPairQuickLinks.length > 0 ? (
              popularPairQuickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'grid',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    background: item === popularPairQuickLinks[0]
                      ? 'color-mix(in srgb, var(--accent-soft) 48%, var(--bg-surface-2))'
                      : 'var(--bg-surface-2)',
                    border: item === popularPairQuickLinks[0]
                      ? '1px solid var(--border-accent)'
                      : '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                  }}
                >
                  <strong
                    style={{
                      color: 'var(--text-primary)',
                      lineHeight: 'var(--leading-snug)',
                    }}
                  >
                    {item.title}
                  </strong>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: 'var(--text-sm)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {item.description}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-alt)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                    افتح المقارنة
                    <ArrowLeft size={14} aria-hidden="true" />
                  </span>
                </Link>
              ))
            ) : (
              <div
                role="status"
                style={{
                  gridColumn: '1 / -1',
                  padding: 'var(--space-4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-secondary)',
                  lineHeight: 'var(--leading-relaxed)',
                }}
              >
                لا تظهر المقارنات الجاهزة الآن، لكن الحاسبة في أعلى الصفحة ما زالت تعمل لأي مدينتين تختارهما.
              </div>
            )}
          </div>
        </section>

          </main>
          <TimeDiffSections />
          <section className="content-col pb-20">
            <GeoInternalLinks
              title="خطوتك التالية بعد حساب فرق التوقيت"
              description="بعد معرفة الفارق، اختر المسار الذي يكمّل قرارك: الوقت الان للتحقق من المدينة، الصلاة عند السفر أو التنسيق اليومي، التاريخ عندما يعبر الموعد منتصف الليل، أو المناسبات عند ترتيب رحلة."
              links={utilityLinks}
              ariaLabel="خطوات تكمل حساب فرق التوقيت"
            />
            <AdMultiplex slotId="end-time-difference-hub" />
          </section>
        </div>
      </AdLayoutWrapper>
    </div>
  );
}
