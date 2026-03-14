// app/mwaqit-al-salat/page.jsx
import SearchCityWrapper from "@/components/SearchCityWrapper.client";
import { getCountriesAction } from "@/app/actions/location";

/**
 * Server component landing page for prayer times.
 * SearchCityWrapper is client-only (ssr:false)
 */

export const metadata = {
  title: "مواقيت الصلاة الدقيقة لكل مدينة — أذان، إمساكية، أوقات الفجر والمغرب",
  description:
    "احصل على مواقيت الصلاة الدقيقة لأي مدينة في العالم. دعم طرق الحساب المختلفة (Umm al-Qura, MWL, ISNA, Egyptian)، وتحديث تلقائي حسب الموقع والتوقيت المحلي.",
  keywords:
    "مواقيت الصلاة, أوقات الصلاة, إمساكية رمضان, أذان, الفجر, الظهر, العصر, المغرب, العشاء, حساب أوقات الصلاة, تحويل التوقيت",
  alternates: {
    canonical: "/mwaqit-al-salat",
  },
  openGraph: {
    title: "مواقيت الصلاة الدقيقة لكل مدينة — وقت",
    description:
      "أداة سريعة للحصول على أوقات الصلاة حسب مدينتك بدقة عالية مع دعم طرق الحساب المحلية والتحديث التلقائي.",
    url: "/mwaqit-al-salat",
    type: "website",
    locale: "ar_SA",
  },
};

const faqs = [
  {
    q: "كيف تُحسب مواقيت الصلاة؟",
    a:
      "تُحسب مواقيت الصلاة عادةً عبر معادلات فلكية تربط زاوية الشمس أسفل أو فوق الأفق (للفجر والمغرب) وخط الطول والعرض والزمن المحلي. يعتمد تحديد الفجر والإشراق على زاوية الشمس تحت الأفق، بينما يعتمد العصر على طول الظل. طرق الحساب تختلف قليلاً بين الجهات المعتمدة.",
  },
  {
    q: "أي طرق الحساب متاحة وما الفرق بينها؟",
    a:
      "الطرق الشائعة تشمل: Muslim World League (MWL)، Islamic Society of North America (ISNA)، Umm al-Qura (مكة)، Egyptian General Authority، Karachi (جامعة كاراكِي). الفروق الأساسية تكون بزوايا الفجر/العشاء أو قواعد فترة العشاء الثابتة في بعض الطرق.",
  },
  {
    q: "هل تتغير المواقيت في رمضان؟",
    a:
      "نعم، تبقى القاعدة الحسابية نفسها لكن يتم تحديث مواقيت الفجر والمغرب يومياً لتسهيل الإمساك والإفطار. نقدم إمساكاً واضحاً ومعلومات إضافية حسب كل مدينة.",
  },
  {
    q: "هل أستطيع مشاركة مواقيت مدينتي؟",
    a:
      "نعم. بعد اختيار مدينة، استخدم زر 'مشاركة' لنسخ رابط مباشر يعرض نفس المدينة والمواقيت للمستخدم الآخر.",
  },
  {
    q: "هل نراعي التوقيت الصيفي (DST)؟",
    a:
      "نعم، الحساب يأخذ بعين الاعتبار التوقيت الصيفي لكل منطقة زمنية عند توفر بياناتها لضمان دقة الأوقات المعروضة.",
  },
];

export default async function PrayerLandingPage() {
  // fetch server-side data first (this allows safe use of new Date() afterwards)
  const allCountries = await getCountriesAction();

  // JSON-LD: FAQPage schema (must match visible content)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a,
      },
    })),
  };

  // JSON-LD: HowTo for "كيفية استخدام الأداة للحصول على مواقيت الصلاة"
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "كيفية الحصول على مواقيت الصلاة لمدينتك",
    description: "خطوات سريعة لاستخدام أداة مواقيت الصلاة للحصول على أوقات دقيقة ومشاركتها.",
    step: [
      { "@type": "HowToStep", name: "اختر المدينة أو الدولة", text: "ابدأ بكتابة اسم المدينة في مربع البحث واخترها." },
      { "@type": "HowToStep", name: "اختر طريقة الحساب (اختياري)", text: "يمكنك اختيار طريقة الحساب إن أردت (مثل Umm al-Qura أو MWL) للحصول على نتائج تلائم ممارستك المحلية." },
      { "@type": "HowToStep", name: "اطّلع على جدول الصلوات والملاحظات", text: "ستظهر أوقات الفجر، الظهر، العصر، المغرب، العشاء، إضافةً إلى ملاحظات التوقيت الصيفي والإمساك في رمضان." },
      { "@type": "HowToStep", name: "مشاركة النتيجة", text: "انقر زر 'مشاركة' لنسخ رابط يعرض نفس التوقيتات في جهاز آخر." }
    ]
  };

  return (
    <div className="min-h-screen bg-base text-primary">
      <main className="mx-auto px-4 pt-24 pb-20 max-w-[900px] mt-12">

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">           مواقيت الصلاة الدقيقة لكل مدينة
          </h1>

          <p className="text-muted text-lg mx-auto leading-relaxed mt-4 mb-4">
            اعرف أوقات الفجر، الظهر، العصر، المغرب والعشاء لأي مدينة حول العالم بدقة عالية. الأداة تدعم طرق الحساب الشائعة،
            تأخذ بعين الاعتبار التوقيت الصيفي والفرق الزمني المحلي، وتُحدّث المواقيت يومياً.
          </p>

        </header>

        {/* Search Card */}
        <div className="bg-glass border border-border rounded-[2.5rem] p-4 md:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative space-y-6">
            <div className="text-right px-2">
              <label className="text-sm font-bold text-secondary mb-2 block mr-1">ابحث عن مدينة أو دولة</label>
              <SearchCityWrapper mode="prayer" preloadedCountries={allCountries} />
            </div>
          </div>
        </div>

        <div className="empty-state mt-12 mb-28">
          <span className="empty-state__icon">🌍</span>
          <p className="empty-state__title">اختر مدينتين للمقارنة</p>
          <p className="empty-state__description">
            ابحث عن أي مدينتين لمعرفة فرق التوقيت الدقيق وأفضل وقت للاجتماعات.
          </p>
        </div>


        {/* Prominent benefits / features for SEO snippet */}
        <section className="text-right prose px-2 mt-20 mb-20">
          <h2 className="mb-2 mt-2">لماذا تعتمد على هذه الأداة؟</h2>
          <p className="mb-6">
            نقدم مواقيت صلاة دقيقة تعتمد على معادلات فلكية موثوقة، وتدعم طرق الحساب المعروفة مثل
            <strong> Umm al-Qura</strong> (مكة)، <strong>MWL</strong> (Muslim World League)، <strong>ISNA</strong> (الولايات المتحدة)، والهيئات المحلية مثل الجهة المصرية.
            يمكنك اختيار الطريقة التي تتبعها أو ترك الأداة تختار الأنسب تلقائياً بناءً على الموقع. <em>(المصادر توضح اختلاف الزوايا وطرق الحساب الفلكي).</em>
          </p>

          <h3 className="mb-2 mt-2">ما الذي يجعل الأوقات دقيقة؟</h3>
          <p className="mb-6">
            الدقة تنبع من استخدام: خط العرض والطول، تصحيح الارتفاع، معادلات حركة الشمس (declination & equation of time)، وزوايا الفجر/العشاء المعتمدة في كل طريقة حساب. نتيجتنا محدثة يومياً وتراعي التوقيت الصيفي عند توفره.
          </p>

          <h3 className="mb-2 mt-2">نصائح سريعة للمستخدم</h3>
          <ul className="mb-6">
            <li>اختر طريقة الحساب المناسبة لبلدك (مثلاً Umm al-Qura للسعودية).</li>
            <li>تحقق من ضبط المنطقة الزمنية لجهازك إن لاحظت اختلافاً.</li>
            <li>استخدم زر المشاركة لنشر جدول الصلاة بدقة.</li>
          </ul>
        </section>

        {/* Examples (featured-snippet friendly) */}
        <section className="mb-20 text-right">
          <h2 className="text-2xl font-bold mb-4">أمثلة سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-right">
              <h4 className="font-semibold mb-2">مكة المكرمة</h4>
              <p className="text-[var(--text-muted)]">تُحسب مواقيت الصلاة في مكة حسب طريقة Umm al-Qura المعتمدة محليًا.</p>
            </article>

            <article className="p-4 rounded-xl bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-right">
              <h4 className="font-semibold mb-2">القاهرة</h4>
              <p className="text-[var(--text-muted)]">تتوفر طريقة الحساب المصرية بالإضافة إلى زوايا فلكية أخرى للمقارنة.</p>
            </article>
          </div>
        </section>

        {/* Deep: How prayer times are calculated (useful for E-E-A-T and search intent) */}
        <section className="prose px-2 text-right mt-10 mb-20">
          <h2 className="mb-2 mt-2">كيف تُحسب أوقات الصلاة؟ (شرح مبسّط)</h2>
          <p className="mb-2">
            تُعتمد الأوقات على موقع الشمس بالنسبة للأفق. على سبيل المثال:
          </p>
          <ul className="mb-10">
            <li className="mb-2"><strong>الفجر</strong>: عندما تكون الشمس أسفل الأفق بزاوية معينة (غالبًا 15°–18° حسب الطريقة).</li>
            <li className="mb-2"><strong>الشروق/المغرب</strong>: عند شروق الشمس وغروبها (تصحيح الانكسار الجوي يُطبّق عادةً ~0.833°).</li>
            <li className="mb-2"><strong>العصر</strong>: يعتمد على طول الظل (مقارنةً بطول الجسم) ويختلف حسب المذهب الفقهي.</li>
            <li className="mb-2"><strong>العشاء</strong>: يحدد بزاوية شفق أو بفترة زمنية بعد غروب الشمس حسب الطريقة المختارة.</li>
          </ul>

          <p className="text-sm text-[var(--text-muted)]">
            (ملاحظة: اختلافات بسيطة بين طرق الحساب طبيعية—نقدّم خيارات متعددة لتطابق الممارسات المحلية). 
          </p>
        </section>

        {/* FAQ — native accordion (details/summary) using your CSS tokens */}
        <section className="mb-20">
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
            أسئلة شائعة حول مواقيت الصلاة
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
                    textAlign: "right",
                  }}
                >
                  {a}
                </p>
              </details>
            ))}
          </div>

        </section>

      </main>
    </div>
  );
}