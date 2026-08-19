import Link from 'next/link';

import NvrStorageCalculator from '@/components/calculators/NvrStorageCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cctv-nvr-storage-calculator');

const FAQ_ITEMS = [
  {
    question: 'كيف احسب سعة التخزين المطلوبة لكاميرات المراقبة؟',
    answer:
      'بضرب معدل البت لكل كاميرا في عدد ساعات التسجيل اليومية وعدد الكاميرات وأيام الاحتفاظ، ثم تحويل الناتج من كيلوبت إلى جيجابايت — راجع المعادلة الكاملة وشرحها في قسم "كيف تُحسب سعة التخزين فعلياً" أعلى الصفحة، أو أدخل قيمك الفعلية في الحاسبة مباشرة لنتيجة دقيقة لنظامك دون حساب يدوي.',
  },
  {
    question: 'كم تيرا أحتاج لكاميرات المراقبة في المنزل؟',
    answer:
      'يعتمد بشكل كبير على عدد الكاميرات ودقتها ونمط التسجيل وأيام الاحتفاظ المطلوبة — لا يوجد رقم واحد يصلح للجميع. منزل بـ4 كاميرات 4 ميجابكسل بترميز H.265 وتسجيل مستمر لمدة 30 يوماً يحتاج عادة نطاقاً مختلفاً تماماً عن نظام بـ8 كاميرات 4K. استخدم الحاسبة أعلاه لرقمك الفعلي.',
  },
  {
    question: 'ما الفرق بين H.264 وH.265 في التخزين؟',
    answer:
      'H.265 (المعروف أيضاً بـ HEVC) يضغط الفيديو بكفاءة أعلى من H.264 لنفس الجودة المرئية تقريباً، ما يقلل السعة المطلوبة بنحو 50% تقريباً حسب الوثائق الرسمية لمصنّعي الأنظمة. إن كان جهازك يدعم H.265، فهو الخيار الأوفر للتخزين دون التضحية بجودة الصورة.',
  },
  {
    question: 'هل التسجيل بالحركة فقط يوفر مساحة تخزين حقيقية؟',
    answer:
      'نعم بشكل كبير، لأنه يسجل فقط عند اكتشاف حركة فعلية بدل 24 ساعة متواصلة. اختر "بالحركة فقط" في الحاسبة أعلاه وأدخل نسبة النشاط التقديرية لموقعك (شارع مزدحم أعلى من ممر داخلي هادئ) لرؤية الفرق الفعلي في السعة المطلوبة.',
  },
  {
    question: 'كم يوماً يجب أن أحتفظ بتسجيلات كاميرات المراقبة؟',
    answer:
      'لا يوجد معيار قانوني موحّد يفرض مدة محددة في معظم الاستخدامات المنزلية، لكن 30 يوماً فترة شائعة تعطي وقتاً كافياً لمراجعة أي حادثة دون الحاجة لسعة تخزين ضخمة غير ضرورية. المنشآت التجارية قد تحتاج فترة أطول حسب سياسات الأمان الداخلية أو متطلبات تأمينية.',
  },
  {
    question: 'هل يمكن استخدام قرص صلب عادي بدل قرص المراقبة المخصص؟',
    answer:
      'يمكن تقنياً، لكن أقراص المراقبة المخصصة (Surveillance-grade) مصمّمة خصيصاً للكتابة المستمرة على مدار الساعة لفترات طويلة دون تلف مبكر، بخلاف الأقراص العادية المصممة لاستخدام متقطع — فرق يستحق الانتباه له عند التسجيل المستمر 24 ساعة.',
  },
];

const RELATED = [{ route: CALCULATOR_ROUTES.find((r) => r.slug === 'cctv-buying-guide') }].filter((i) => i.route);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

const TOC_ITEMS = [
  ['nvr-guide', 'كيف تُحسب سعة التخزين فعلياً'],
  ['nvr-faq', 'الأسئلة الشائعة'],
];

export default function NvrStorageCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'كاميرات المراقبة', item: `${SITE_URL}/tools/cctv` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['سعة التخزين المطلوبة للكاميرات', 'حساب سعة تخزين كاميرات المراقبة'],
    keywords: PAGE.keywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-nvr-storage" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-nvr-storage" /></div>

        <article className="tool-v2-lane-article">
          <section id="nvr-guide">
            <h2>كيف تُحسب سعة التخزين فعلياً</h2>
            <p>
              أربعة عوامل تتضاعف مع بعضها لتحديد السعة المطلوبة: دقة الكاميرا (كل ميجابكسل إضافي
              يرفع حجم الملف)، الترميز (H.265 يضغط الفيديو لنصف حجم H.264 تقريباً لنفس الجودة)،
              نمط التسجيل (24 ساعة مستمر مقابل التسجيل بالحركة فقط)، وعدد أيام الاحتفاظ. تجاهل أي
              واحد منها يعني تقديراً خاطئاً بفارق كبير جداً عن الرقم الحقيقي.
            </p>
            <FormulaCard
              label="استخدم هذه المعادلة المعتمدة من مصنّعي أنظمة المراقبة لحساب سعة التخزين بالجيجابايت من معدل البت وعدد الكاميرات وأيام الاحتفاظ:"
              note="معدل البت يقاس بالكيلوبت/ثانية — تجده في مواصفات الكاميرا، أو استخدم القيم الافتراضية المقترحة تلقائياً في الحاسبة أعلاه حسب الدقة والترميز."
            >
              <span>السعة (جيجابايت) =</span>
              <Frac
                num="معدل البت × 3600 × ساعات التسجيل × الكاميرات × الأيام"
                den="8,000,000"
              />
            </FormulaCard>
            <PlainBlock eyebrow="اشترِ قرصاً أكبر من الحد الأدنى" title="هامش أمان يستحق تكلفته الصغيرة">
              فارق السعر بين قرص 4 تيرابايت و6 تيرابايت صغير نسبياً مقارنة بإزعاج نفاد المساحة
              مبكراً وحذف تسجيلات أقدم مما تحتاج فعلاً — اختر دائماً أقرب سعة تجارية أعلى من الرقم
              المحسوب، لا الأقرب له من الأسفل.
            </PlainBlock>
            <PlainBlock eyebrow="لا تعرف بيانات كاميرتك بالضبط؟" title="القيم الافتراضية بداية جيدة">
              القيم المقترحة تلقائياً في الحاسبة أعلاه مبنية على معدلات صناعية شائعة لكل دقة
              وترميز — إن لم تجد المواصفات الدقيقة لكاميرتك، هذه الافتراضات تعطيك تقديراً واقعياً
              كافياً لاختيار حجم القرص.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-nvr-storage" />

          <section id="nvr-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {FAQ_ITEMS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="nvr-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://reolink.com/blog/cctv-storage-calculation-formula/" target="_blank" rel="noreferrer">Reolink — CCTV Storage Calculation Formula</a> — مصدر المعادلة الأساسية.</li>
              <li><a href="https://www.hikvision.com/" target="_blank" rel="noreferrer">Hikvision — H.264/H.265 Recommended Bit Rate Documentation</a> — جداول معدل البت الرسمية حسب الدقة والترميز.</li>
              <li><a href="https://www.westerndigital.com/tools/surveillance-capacity-calculator" target="_blank" rel="noreferrer">Western Digital — Surveillance Capacity Calculator</a> — مرجع تصميم حقول الحاسبة.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><NvrStorageCalculator /></div>
          {RELATED.length ? (
            <aside className="tool-v2-related-card" aria-label="أدوات مشابهة">
              <div className="tool-v2-related-card__head">مقالات أخرى في كاميرات المراقبة</div>
              <nav className="tool-v2-related-card__list">
                {RELATED.map(({ route }) => (
                  <Link key={route.slug} href={route.href}>
                    <span>{route.shortLabel || route.title}</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
                  </Link>
                ))}
              </nav>
            </aside>
          ) : null}
        </div>
      </div>
    </main>
  );
}
