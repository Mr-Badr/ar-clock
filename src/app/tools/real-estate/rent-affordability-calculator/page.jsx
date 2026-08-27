import Link from 'next/link';

import RentAffordabilityCalculator from '@/components/calculators/RentAffordabilityCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'rent-affordability-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم يجب أن تكون نسبة الإيجار من الراتب ${CURRENT_YEAR}؟`,
    answer:
      'القاعدة الإرشادية الأكثر شيوعاً عالمياً هي ألا يتجاوز الإيجار 30% من صافي دخلك الشهري. هذه ليست قاعدة ملزمة قانوناً، لكنها معيار موازنة معقول يترك لك مساحة كافية للمصاريف الأخرى والادخار.',
  },
  {
    question: 'ماذا لو كان إيجاري أكثر من 30% من راتبي؟',
    answer:
      'بين 30% و40% يُعتبر مرتفعاً لكنه ليس بالضرورة خطأً — راجع باقي التزاماتك المالية (قروض، معيشة، ادخار) قبل الحكم. أما تجاوز 40% فيستحق مراجعة جدية، لأنه يترك مساحة صغيرة جداً لأي مصروف طارئ.',
  },
  {
    question: 'هل هذه النسبة تختلف حسب الدولة؟',
    answer:
      'القاعدة نفسها (30%) شائعة عالمياً وليست خاصة بدولة معينة، لكن مستوى الإيجارات الفعلي يختلف كثيراً بين مدن الخليج — استخدم رقم إيجارك الفعلي ودخلك الفعلي بدل مقارنة نفسك بمتوسط عام قد لا ينطبق على مدينتك.',
  },
  {
    question: 'إيجاري سنوي، كيف أستخدم الحاسبة؟',
    answer:
      'اقسم قيمة الإيجار السنوي على 12 للحصول على المعدل الشهري، ثم أدخل هذا الرقم في حقل الإيجار الشهري أعلاه.',
  },
];

const TOC_ITEMS = [
  ['ra-guide', 'قاعدة الـ30%'],
  ['ra-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function RentAffordabilityCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'العقارات', item: `${SITE_URL}/tools/real-estate` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['نسبة الإيجار من الراتب', 'قاعدة الثلاثين بالمئة', 'هل إيجاري مناسب لراتبي'],
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

      <ToolTopAdSlot slotId="top-rent-affordability-calculator" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle.replace('{{year}}', String(CURRENT_YEAR))}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-rent-affordability-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="ra-guide">
            <h2>قاعدة الـ30%</h2>
            <p>
              خبراء التخطيط المالي حول العالم يستخدمون قاعدة بسيطة: لا يتجاوز إيجار سكنك 30% من
              صافي دخلك الشهري. هذه النسبة تترك لك ما يكفي من دخلك لتغطية الطعام والمواصلات
              والفواتير والادخار، دون أن يستهلك السكن وحده جزءاً كبيراً جداً من ميزانيتك.
            </p>
            <p>
              كلما اقتربت النسبة من 40% أو تجاوزتها، قلّت مساحة المناورة المالية لديك في حال حدث
              أي طارئ (فقدان دخل مؤقت، مصروف صحي غير متوقع) — لهذا هي علامة تستحق مراجعة جدية،
              وليست مجرد رقم نظري.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-rent-affordability-calculator" />

          <section id="ra-faq">
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
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><RentAffordabilityCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/real-estate">
                <span>كل أدوات العقارات</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
