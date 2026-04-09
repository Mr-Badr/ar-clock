// app/time-difference/page.tsx
import TimeDiffCalculator from "@/components/TimeDifference/TimeDiffCalculatorV2.client";
import { getCountriesAction } from "@/app/actions/location";
import CurrentTime from "@/components/helpers/CurrentTime";
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInArticle from '@/components/ads/AdInArticle';
import TimeDiffSections from '@/components/time-diff/index';
import { Globe } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
/**
 * Metadata (Next.js App Router)
 * - extend this object if you use dynamic city-pair pages later
 */
const SITE_URL = getSiteUrl();

export const metadata = {
  title:
    "فرق التوقيت بين المدن والدول - حاسبة تحويل الوقت",
  description:
    "احسب فرق التوقيت والساعة الآن بين أي مدينتين أو دولتين، مع تحويل الوقت بين المناطق الزمنية، ودعم التوقيت الصيفي، وتحديد أفضل وقت للاجتماعات.",
  keywords:
    "فرق التوقيت, تحويل الوقت, كم الساعة, فرق التوقيت بين المدن, فرق التوقيت بين الدول, ساعات العمل المشتركة, تحويل التوقيت, فرق التوقيت والدوام, تحويل التوقيت من إلى",
  alternates: {
    canonical: `${SITE_URL}/time-difference`,
    // add hreflang alternatives if you have other locales, e.g.
    // languages: { "en-US": "/en/time-difference" }
  },
  openGraph: {
    title: "فرق التوقيت بين المدن والدول | حاسبة تحويل الوقت",
    description:
      "أداة عربية دقيقة لمعرفة فرق التوقيت وتحويل الوقت بين المدن والدول مع دعم التوقيت الصيفي.",
    url: `${SITE_URL}/time-difference`,
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
      <main className="content-col pt-24 mt-12">

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
            فرق التوقيت بين مدينتين — حاسبة الوقت وتحويل التوقيت بسهولة
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            فرق التوقيت بين مدينتين — حاسبة الوقت وتحويل التوقيت بسهولة
          </h1>
          <p className="mt-4 text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            احسب الفرق بالساعة والدقيقة بين أي مدينتين أو دولتين في العالم، اعرف الساعة الان
            في الوجهة، وتعرّف على أفضل أوقات الاجتماع وساعات العمل المشتركة مع مراعاة التوقيت الصيفي.
          </p>
        </header>

        <AdTopBanner slotId="top-time-diff-list" />

        {/* Calculator */}
        <section aria-label="حاسبة فرق التوقيت">
          <TimeDiffCalculator preloadedCountries={allCountries} />
        </section>

      </main>
        <TimeDiffSections />
      {/* </AdLayoutWrapper> */}
    </div>
  );
}
