import Link from 'next/link';

import TvSizeCalculator from '@/components/calculators/TvSizeCalculator.client';
import { FormulaCard } from '@/components/tools-v2/FormulaCard';
import { ReferenceGrid } from '@/components/tools-v2/ReferenceGrid';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'tv-size-calculator');

const CURRENT_YEAR = new Date().getFullYear();

// Real, sourced reference table — SMPTE (×0.65) and THX (×0.835) ratios applied to common
// viewing distances, verified against the same 4 independent sources cited in the tool's own
// component comment. Never invented per-size labels beyond what the formula itself produces.
const SIZE_DISTANCE_TABLE = [
  { distanceCm: 150, smpte: 38, thx: 49 },
  { distanceCm: 200, smpte: 51, thx: 66 },
  { distanceCm: 250, smpte: 64, thx: 82 },
  { distanceCm: 300, smpte: 77, thx: 99 },
  { distanceCm: 350, smpte: 90, thx: 115 },
];

const FAQ_ITEMS = [
  {
    question: 'كيف أحسب حجم التلفزيون المناسب لغرفتي؟',
    answer:
      'قِس المسافة الفعلية بين مكان جلوسك المعتاد والحائط الذي سيوضع عليه التلفزيون، ثم أدخلها في الحاسبة أعلاه مع اختيار المعيار المناسب (مريح للاستخدام اليومي، أو سينمائي لتجربة أقرب للسينما).',
  },
  {
    question: 'ما هو معيار SMPTE؟',
    answer:
      'SMPTE (جمعية مهندسي السينما والتلفزيون) معيار يوصي بزاوية رؤية 30° للمشاهدة المريحة اليومية — أي أن الشاشة تملأ جزءاً مريحاً من مجال بصرك دون إجهاد عينيك أو حاجتك لتحريك رأسك لمتابعة الحركة على الشاشة.',
  },
  {
    question: 'ما هو معيار THX؟',
    answer:
      'THX معيار صوتي وبصري وضعته الشركة التابعة لاستوديوهات جورج لوكاس، ويوصي بزاوية رؤية أوسع (40°) لتجربة أقرب لصالة السينما — لذلك يقترح مقاساً أكبر من SMPTE لنفس مسافة الجلوس.',
  },
  {
    question: `هل حجم الشاشة يُقاس بالعرض أم بالقطر ${CURRENT_YEAR}؟`,
    answer:
      'المقاس المعلن دائماً (32 بوصة، 55 بوصة، إلخ) هو القياس القطري الكامل للشاشة من زاوية إلى زاوية، وليس عرضها أو ارتفاعها فقط — هذا هو نفس الرقم الذي تراه في المتجر وعلى صندوق التلفزيون.',
  },
  {
    question: 'هل يجب أن ألتزم برقم الحاسبة بالضبط؟',
    answer:
      'لا — هذا تقدير هندسي مبني على معايير رؤية مريحة للعين، وليس قاعدة صارمة. البعض يفضل شاشة أكبر قليلاً للأفلام والألعاب حتى لو زاد عن الرقم الموصى به، طالما لا يشعر بإجهاد في العين أو الرقبة.',
  },
  {
    question: 'لماذا قد أرى رقماً مختلفاً قليلاً في حاسبات أخرى؟',
    answer:
      'بعض المواقع تقيس زاوية الرؤية على عرض الشاشة بدل قطرها، أو تستخدم تقريباً مختلفاً قليلاً لنفس المعادلة الهندسية (مثلاً 1.6 ضعف القطر بدل 0.65 من المسافة، وهما تقريباً نفس الرقم لكن بصياغة مختلفة) — الفروقات الصغيرة بين المواقع طبيعية وسببها طريقة التقريب، وليست خطأ في أحدها.',
  },
];

const TOC_ITEMS = [
  ['tv-guide', 'كيف يعمل الحساب'],
  ['tv-table', 'جدول مرجعي للمقاسات الشائعة'],
  ['tv-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function TvSizeCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الإلكترونيات والأجهزة المنزلية', item: `${SITE_URL}/tools/electronics` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['حجم التلفزيون المناسب', 'مسافة المشاهدة المثالية', 'معيار SMPTE وTHX'],
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

      <ToolTopAdSlot slotId="top-tv-size-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-tv-size-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="tv-guide">
            <h2>كيف يعمل الحساب؟</h2>
            <p>
              كلما ابتعدت عن الشاشة، احتجت مقاساً أكبر لتحصل على نفس تجربة المشاهدة المريحة — العلاقة
              بين المسافة والمقاس ثابتة رياضياً حسب زاوية الرؤية المستهدفة، وليست تخميناً.
            </p>
            <FormulaCard label="معيار SMPTE (مريح، زاوية 30°)" note="المسافة بالبوصة = المسافة بالسم ÷ 2.54">
              المقاس بالبوصة = المسافة بالبوصة × 0.65
            </FormulaCard>
            <FormulaCard label="معيار THX (سينمائي، زاوية 40°)">
              المقاس بالبوصة = المسافة بالبوصة × 0.835
            </FormulaCard>
          </section>

          <ToolInArticleAd slotId="mid-tv-size-calculator" />

          <section id="tv-table">
            <h2>جدول مرجعي للمقاسات الشائعة</h2>
            <p>المقاس الموصى به (بالبوصة) لكل معيار حسب مسافة الجلوس الشائعة:</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>مسافة الجلوس</th>
                    <th>مريح (SMPTE)</th>
                    <th>سينمائي (THX)</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_DISTANCE_TABLE.map((row) => (
                    <tr key={row.distanceCm}>
                      <td>{row.distanceCm} سم</td>
                      <td>{row.smpte}″</td>
                      <td>{row.thx}″</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ReferenceGrid items={[
              { value: '32″–43″', meta: 'غرف صغيرة / مكتب' },
              { value: '50″–55″', meta: 'غرفة معيشة متوسطة' },
              { value: '65″–75″', meta: 'صالة كبيرة أو سينما منزلية' },
            ]}
            />
          </section>

          <section id="tv-faq">
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

          <section id="tv-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.smpte.org/" target="_blank" rel="noreferrer">SMPTE — جمعية مهندسي السينما والتلفزيون</a> — مصدر معيار زاوية الرؤية 30°.</li>
              <li><a href="https://www.thx.com/" target="_blank" rel="noreferrer">THX</a> — مصدر معيار زاوية الرؤية السينمائية 40°.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><TvSizeCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/electronics">
                <span>كل أدوات الإلكترونيات والأجهزة المنزلية</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
