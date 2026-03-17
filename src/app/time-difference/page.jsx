// app/time-difference/page.tsx
import TimeDiffCalculator from "@/components/TimeDifference/TimeDiffCalculatorV2.client";
import { getCountriesAction } from "@/app/actions/location";
import CurrentTime from "@/components/helpers/CurrentTime";
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';

/**
 * Metadata (Next.js App Router)
 * - extend this object if you use dynamic city-pair pages later
 */
export const metadata = {
  title:
    "فرق التوقيت بين مدينتين أو دولتين — حاسبة الفرق الزمني وتحويل الوقت بدقة",
  description:
    "احسب فرق التوقيت بين أي مدينتين أو دولتين في العالم. اعرف الساعة الان، حول الوقت بين المناطق الزمنية، وتعرّف على أفضل وقت للاجتماع مع دعم التوقيت الصيفي.",
  keywords:
    "فرق التوقيت, تحويل الوقت, كم الساعة, فرق التوقيت بين المدن, فرق التوقيت بين الدول, ساعات العمل المشتركة, تحويل التوقيت, فرق التوقيت والدوام, تحويل التوقيت من إلى",
  alternates: {
    canonical: "/time-difference",
    // add hreflang alternatives if you have other locales, e.g.
    // languages: { "en-US": "/en/time-difference" }
  },
  openGraph: {
    title: "حاسبة فرق التوقيت بين المدن والدول — وقت",
    description:
      "أداة سريعة ودقيقة لمعرفة فرق التوقيت وتحويل الوقت بين أي مدينتين حول العالم مع دعم التوقيت الصيفي.",
    url: "/time-difference",
    type: "website",
    locale: "ar_SA",
  },
};

const faqs = [
  // keep and extend your previous faqs
  {
    q: "كيفية حساب فرق التوقيت بين مدينتين؟",
    a:
      "تقوم الحاسبة بتحويل التوقيت المحلي لكل مدينة إلى التوقيت العالمي (UTC) باستخدام قاعدة بيانات المناطق الزمنية المعتمدة (IANA TZ database)، ثم تحسب الفرق بالساعات والدقائق بدقة، مع مراعاة التوقيت الصيفي تلقائياً.",
  },
  {
    q: "هل تُراعي الحاسبة التوقيت الصيفي (DST)؟",
    a:
      "نعم. بيانات المناطق الزمنية تتضمن قواعد التوقيت الصيفي والشتوي لكل منطقة، لذلك تظهر النتيجة بحالة التوقيت الحالية (صيفي/قياسي) بحسب التاريخ المحدد.",
  },
  {
    q: "كيف أحسب أفضل وقت للاجتماع بين بلدين؟",
    a:
      "تعرّف أولاً ساعات العمل التقليدية في كل بلد (مثلاً 9 ص - 5 م)، ثم استخدم عرض 'ساعات العمل المشتركة' في الأداة لتحديد الفترات التي تتقاطع فيها ساعات العمل في كلا الموقعين.",
  },
  {
    q: "ما أفضل طريقة لمشاركة النتيجة مع زميل؟",
    a:
      "بعد تحديد المدينتين والحصول على النتيجة، اضغط 'مشاركة المقارنة' لنسخ رابط يحتوي على المدينتين يمكن لأي شخص فتحه ليظهر نفس المقارنة.",
  },
  {
    q: "هل يمكن للحاسبة التعامل مع المدن التي لها نفس الاسم؟",
    a:
      "نعم — عند وجود أكثر من مدينة بنفس الاسم نعرض القائمة الكاملة مع اسم الدولة والموقع الجغرافي لذلك يمكنك اختيار المدينة الصحيحة.",
  },
  {
    q: "هل يمكنني استخدام هذه الصفحة لجدولة مكالمات عبر فرق زمنية متعددة؟",
    a:
      "نعم — الأداة تسمح بالمقارنة الزوجية، ويمكنك تكرار المقارنات أو إنشاء صفحات مقارنات مخصصة للمدن الأكثر استخداماً لديك.",
  },
  // add more targeted Qs:
  {
    q: "فرق التوقيت بين الرياض ودبي كم؟",
    a: "تتقدم دبي على الرياض بساعة واحدة (دبي UTC+4، السعودية UTC+3)، ولا تطبق كلا الدولتين التوقيت الصيفي عادةً.",
  },
  {
    q: "كيف أتحقق من فرق التوقيت أثناء السفر؟",
    a:
      "استخدم الحاسبة مع اسم المدينة أو حقل البحث في هاتفك لاختيار المدينة الوجهة وسنظهر لك التوقيت المحلي هناك وكذلك الفرق بالنسبة لموقعك الحالي.",
  },
];

export default async function TimeDifferencePage() {
  const allCountries = await getCountriesAction();

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  // HowTo schema for "تحويل الوقت بين مدينتين" (step-by-step)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "كيفية تحويل الوقت بين مدينتين (خطوة بخطوة)",
    description:
      "خطوات سريعة لتحويل الوقت من مدينة إلى أخرى مع مراعاة فرق التوقيت والتوقيت الصيفي.",
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
    <div className="min-h-screen bg-base text-primary">
      {/* <AdLayoutWrapper> */}
      <main className="content-col pt-24 pb-20 mt-12">

        {/* JSON-LD structured data (FAQ + HowTo) */}
        <script
          type="application/ld+json"
          // FAQ schema first (Google reads both)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />

        {/* HERO */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            فرق التوقيت بين مدينتين — حاسبة الوقت وتحويل التوقيت بسهولة
          </h1>
          <p className="mt-4 text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            احسب الفرق بالساعة والدقيقة بين أي مدينتين أو دولتين في العالم، اعرف الساعة الان
            في الوجهة، وتعرّف على أفضل أوقات الاجتماع وساعات العمل المشتركة مع مراعاة التوقيت الصيفي.
          </p>
        </header>

        {/* <AdTopBanner slotId="top-time-diff-list" /> */}

        {/* Calculator */}
        <section aria-label="حاسبة فرق التوقيت" className="mb-12">
          <TimeDiffCalculator preloadedCountries={allCountries} />
        </section>

        {/* Quick answer / examples (This helps featured snippets) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">أمثلة سريعة — إجابات فورية</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Static example cards — keep concise answers visible for snippet */}
            <article className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
              <h3 className="font-semibold mb-2">الفرق بين الرياض ودبي</h3>
              <p className="text-[var(--text-muted)]">دبي تسبق الرياض بساعة واحدة (دبي UTC+4، الرياض UTC+3).</p>
            </article>

            <article className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)]">
              <h3 className="font-semibold mb-2">الفرق بين القاهرة ولندن</h3>
              <p className="text-[var(--text-muted)]">لندن غالباً متأخرة عن القاهرة بساعتين (قد تتغير مع التوقيت الصيفي).</p>
            </article>
          </div>
        </section>

        {/* Deep content: How it works, DST, work-overlap */}
        <section className="prose px-2 mt-20 mb-20">
          <h2 className="mt-4">كيف تعمل الحاسبة (ببساطة)</h2>
          <p className="text-[var(--text-muted)] leading-relaxed mt-2">
            عند اختيار مدينتين، نقوم بتحويل التوقيت المحلي لكل واحدة إلى التوقيت العالمي المنسق (UTC)
            باستخدام بيانات المناطق الزمنية الموثوقة ثم نأخذ الفرق بين هذين التوقيتين. إن أخذنا بالحسبان
            التوقيت الصيفي يضمن نتيجة دقيقة على مدار السنة.
          </p>

          <h3 className="mt-4">التوقيت الصيفي ولماذا يهم</h3>
          <p className="text-[var(--text-muted)] leading-relaxed mt-2">
            بعض الدول تقدّم أو تؤخر الساعة موسمياً (DST)، وهذا يؤثر مباشرة على فرق التوقيت. الحاسبة
            تتحقق من حالة DST لكل مدينة في التاريخ المطلوب وتعرض علامة توضيحية إن كانت المدينة في حالة صيفي.
          </p>

          <h3 className="mt-4">حساب ساعات العمل المشتركة</h3>
          <p className="text-[var(--text-muted)] leading-relaxed mt-2">
            لتحديد أفضل وقت للاجتماع، نقارن نطاقات العمل التقليدية (مثلاً 09:00–17:00) في كل مدينة
            ونحسب الفترة المشتركة. إن لم توجد فترة مشتركة، نقترح الفترات الأقرب بعد فحص فارق الساعات.
          </p>
        </section>

        {/* <AdInArticle slotId="mid-time-diff-list-1" /> */}

        {/* FAQ */}
        <section className="mb-20 mt-20">

          <h2
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-bold)",
              color: "var(--text-primary)",
              marginTop: "var(--space-10)",
              marginBottom: "var(--space-5)",
              textAlign: "center",
            }}
          >
            أسئلة شائعة حول فرق التوقيت وتحويل الوقت
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >

            {faqs.map(({ q, a }) => (

              <details
                key={q}
                className="waqt-card-nested"
                style={{
                  padding: "var(--space-4) var(--space-5)",
                }}
              >

                <summary
                  style={{
                    cursor: "pointer",
                    fontWeight: "var(--font-semibold)",
                    color: "var(--text-primary)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    listStyle: "none",
                    fontSize: "var(--text-base)",
                  }}
                >
                  {q}

                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "var(--text-xl)",
                      marginRight: "var(--space-2)",
                      flexShrink: 0,
                    }}
                    aria-hidden
                  >
                    +
                  </span>

                </summary>

                <p
                  style={{
                    marginTop: "var(--space-3)",
                    color: "var(--text-secondary)",
                    fontSize: "var(--text-sm)",
                    lineHeight: "var(--leading-relaxed)",
                  }}
                >
                  {a}
                </p>

              </details>

            ))}

          </div>

        </section>

      </main>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}