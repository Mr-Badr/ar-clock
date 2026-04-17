// app/time-difference/page.tsx
import TimeDiffCalculator from "@/components/TimeDifference/TimeDiffCalculatorV2.client";
import AdTopBanner from '@/components/ads/AdTopBanner';
import TimeDiffSections from '@/components/time-diff/index';
import GeoInternalLinks from '@/components/seo/GeoInternalLinks';
import { POPULAR_PAIRS } from '@/components/time-diff/data/popularPairs';
import { Globe } from 'lucide-react';
import { getSiteUrl } from '@/lib/site-config';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildTimeDifferenceHubKeywords } from '@/lib/seo/section-search-intent';
/**
 * Metadata (Next.js App Router)
 * - extend this object if you use dynamic city-pair pages later
 */
const SITE_URL = getSiteUrl();

export const metadata = buildCanonicalMetadata({
  title:
    "كم فرق التوقيت بين مدينتين؟ | حاسبة فرق التوقيت الآن",
  description:
    "اعرف كم فرق التوقيت الآن بين أي مدينتين أو دولتين، ومن يسبق الآخر، وما أفضل وقت للاجتماعات مع دعم التوقيت الصيفي وتحويل الوقت مباشرة.",
  keywords: buildTimeDifferenceHubKeywords(POPULAR_PAIRS),
  url: `${SITE_URL}/time-difference`,
});

export default async function TimeDifferencePage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "فرق التوقيت بين المدن والدول",
    url: `${SITE_URL}/time-difference`,
    description:
      "قسم حاسبة فرق التوقيت في ميقاتنا يربط بين مقارنات الدول والمدن، والتحويل المباشر، وساعات العمل المشتركة، مع دعم التوقيت الصيفي.",
    inLanguage: "ar",
  };
  const popularPairsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "أشهر مقارنات فرق التوقيت",
    itemListElement: POPULAR_PAIRS.slice(0, 12).map((pair, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `فرق التوقيت بين ${pair.from.nameAr} و${pair.to.nameAr}`,
      url: `${SITE_URL}/time-difference/${pair.from.slug}/${pair.to.slug}`,
    })),
  };
  const utilityLinks = [
    {
      href: "/time-now",
      label: "الوقت الآن في المدن والدول",
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
      description: "راجع التاريخ الهجري والميلادي اليوم مع الروابط المرتبطة بالتقويم والتحويل.",
    },
    {
      href: "/holidays",
      label: "المناسبات القادمة",
      description: "استكشف المناسبات والإجازات القادمة عند تنسيق الاجتماعات والسفر عبر الدول.",
    },
  ];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(popularPairsSchema) }}
      />
      <main className="content-col pt-24 mt-12">

        {/* JSON-LD structured data (HowTo) */}
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
            كم فرق التوقيت بين مدينتين؟
          </h1>
          <p className="mt-4 text-lg text-[var(--text-muted)] max-w-3xl mx-auto leading-relaxed">
            احسب الفرق بالساعة والدقيقة بين أي مدينتين أو دولتين في العالم، واعرف من يسبق الآن وما أفضل وقت للاتصال أو الاجتماع مع مراعاة التوقيت الصيفي.
          </p>
        </header>

        <AdTopBanner slotId="top-time-diff-list" />

        {/* Calculator */}
        <section aria-label="حاسبة فرق التوقيت">
          <TimeDiffCalculator />
        </section>

      </main>
      <TimeDiffSections />
      <section className="content-col pb-20">
        <GeoInternalLinks
          title="روابط مهمة مرتبطة بفرق التوقيت"
          description="ربطنا حاسبة فرق التوقيت بأقسام الوقت الآن والصلاة والتاريخ والمناسبات حتى تبقى المقارنات مرتبطة بسياقها الكامل داخل الموقع."
          links={utilityLinks}
          ariaLabel="روابط مهمة مرتبطة بفرق التوقيت"
        />
      </section>
      {/* </AdLayoutWrapper> */}
    </div>
  );
}
