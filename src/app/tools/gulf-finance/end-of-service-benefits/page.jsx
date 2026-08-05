import Link from 'next/link';

import EndOfServiceCalculator from '@/components/calculators/EndOfServiceCalculator.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'end-of-service-benefits');
const CONTENT = getFinancePageContent('end-of-service-benefits');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

function pickTools(slugs) {
  return slugs
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && !item.draft);
}

// Two DIFFERENT related-tool lists, not the same set repeated in two places (2026-07-30 fix —
// the sidebar and the end-of-article section were previously both slicing the same
// finance-cluster array, so a reader saw identical links twice). Sidebar = same narrow niche
// (Omni Calculator's own "check out N similar converters" pattern: OTHER end-of-service
// calculators, one per country), end-of-article = what to do AFTER the payout (genuinely
// different, complementary financial-planning tools).
const SIMILAR_TOOLS = pickTools(['eos-egypt', 'eos-jordan', 'eos-qatar', 'uae-end-of-service']);
const PLANNING_TOOLS = pickTools(['monthly-installment', 'net-salary', 'vat', 'investment']);

const TOC_ITEMS = [
  ['esb-guide', 'كيف تُحسب المكافأة وكيف تختلف حسب السبب؟'],
  ['esb-comparison', 'جدول مرجعي: الفرق بين أسباب إنهاء العلاقة'],
  ['esb-scope', 'من لا تشمله هذه الحاسبة؟'],
  ['esb-official', 'المصدر الرسمي'],
  ['esb-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function shiftYears(isoDate, years) {
  const date = new Date(isoDate);
  date.setUTCFullYear(date.getUTCFullYear() + years);
  return date.toISOString().slice(0, 10);
}

// Plain flowing prose block — no card, no background. Whitespace between blocks does the
// separating (per the Omni Calculator reference the owner pointed to as the new bar for
// "not everything is boxes"). Reserve real bordered cards for genuinely distinct modules
// (.tool-v2-related-card, .tool-v2-tip/-callout), not for stacked explanatory paragraphs.
function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

// Sidebar reference card — one item (the most likely genuine follow-up, first in the list)
// gets the "is-featured" tinted treatment so the list isn't N identical grey rows; the rest
// stay plain. This is the "little bit live" version, placed under the calculator itself.
function RelatedToolsCard({ items, heading }) {
  if (!items.length) return null;
  return (
    <aside className="tool-v2-related-card" aria-label="أدوات مشابهة">
      <div className="tool-v2-related-card__head">{heading}</div>
      <nav className="tool-v2-related-card__list">
        {items.map((tool, index) => (
          <Link key={tool.slug} href={tool.href} className={index === 0 ? 'is-featured' : undefined}>
            {index === 0 ? (
              <span className="tool-v2-related-ic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>
              </span>
            ) : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

// End-of-article related-calculators grid — plain two-column link list with an icon chip per
// row (icon carries the color, not a card background). Distinct from RelatedToolsCard above:
// this lives inline in the article flow, not as a separate boxed sidebar module.
function RelatedCalculatorsGrid({ items }) {
  if (!items.length) return null;
  return (
    <nav className="tool-v2-related-grid" aria-label="حاسبات مرتبطة">
      {items.map((tool) => (
        <Link key={tool.slug} href={tool.href}>
          <span className="tool-v2-related-ic">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg>
          </span>
          {tool.shortLabel || tool.title}
        </Link>
      ))}
    </nav>
  );
}

// Same reasoning as the old /calculators page this replaces: no searchParams read here
// (breaks static prerendering under cacheComponents) — the shared-link prefill happens
// client-side inside EndOfServiceCalculator after hydration.
export default async function EndOfServiceBenefitsToolPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];
  const nowIso = await getCachedNowIso();
  const defaultEndDate = nowIso.slice(0, 10);
  const defaultStartDate = shiftYears(defaultEndDate, -5);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout,
    keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-calculator-tool" />
      <TocDetailsReveal />

      {/* Title/lead/TOC share column 1's width/alignment with the article (not a full-width
          band above both lanes), but stay a SEPARATE grid item from <article> — on mobile
          this keeps the H1 rendering first (before the tool panel), while on desktop CSS
          places it directly above the article in the same column. See .tool-v2-lanes in
          tools-v2.css for how the grid + order combination pulls this off per breakpoint. */}
      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>

          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>
              {TOC_ITEMS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Mobile-only ad, order:2 in CSS — fixed rule: mobile shows tool, then this ad, then
            content (hero+article). Removed entirely above 1024px (display:none), since desktop
            already gets an in-article ad naturally placed mid-content instead. */}
        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-tool-top" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="esb-guide">
            <h2>كيف تُحسب المكافأة، ثم لماذا يختلف الرقم بحسب السبب؟</h2>
            <p>
              إذا كنت تستقيل، فالمدة تغيّر نسبة الاستحقاق. وإذا انتهى العقد، فسبب الإنهاء يغيّر
              القراءة. هذا القسم يضع السبب والمدة في مكان واحد حتى لا تعتمد على رقم بلا سياق —
              سواء كتبته &quot;مكافأة نهاية الخدمة&quot; أو &quot;مكافاة نهاية الخدمه&quot;.
            </p>

            <figure className="tool-v2-figure">
              <div className="tool-v2-figure-timeline">
                <div className="tool-v2-tl-step">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /></svg>
                  </span>
                  <b>بداية الخدمة</b>
                  <span>الأجر المرجعي المتفق عليه في العقد</span>
                </div>
                <div className="tool-v2-tl-line" />
                <div className="tool-v2-tl-step">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                  </span>
                  <b>أول 5 سنوات</b>
                  <span>نصف شهر أجر عن كل سنة خدمة</span>
                </div>
                <div className="tool-v2-tl-line" />
                <div className="tool-v2-tl-step tool-v2-tl-step--accent">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1" /></svg>
                  </span>
                  <b>بعد 5 سنوات</b>
                  <span>شهر أجر كامل عن كل سنة إضافية</span>
                </div>
              </div>
              <figcaption>مسار احتساب مكافأة نهاية الخدمة عبر سنوات العمل (المادة 84)</figcaption>
            </figure>

            <Tabs defaultValue="eligibility" dir="rtl">
              <TabsList className="tool-v2-tabs-list" aria-label="شرح نتيجة مكافأة نهاية الخدمة">
                <TabsTrigger value="eligibility" className="tool-v2-tabs-trigger">سبب الإنهاء</TabsTrigger>
                <TabsTrigger value="cases" className="tool-v2-tabs-trigger">حالات تحتاج انتباه</TabsTrigger>
                <TabsTrigger value="law" className="tool-v2-tabs-trigger">النظام باختصار</TabsTrigger>
                <TabsTrigger value="examples" className="tool-v2-tabs-trigger">أمثلة سريعة</TabsTrigger>
              </TabsList>

              <TabsContent value="eligibility">
                <PlainBlock eyebrow="القاعدة العامة تبدأ من الاستحقاق الكامل" title="انتهاء العقد أو الإنهاء من صاحب العمل">
                  عندما تنتهي العلاقة بانتهاء العقد أو بإنهاء من صاحب العمل، تبدأ القراءة من أصل المكافأة في المادة 84. الاستثناءات مثل الفصل بسبب مخالفة جسيمة لا تختصرها الحاسبة ويجب مراجعتها من المصدر الرسمي.
                </PlainBlock>
                <PlainBlock eyebrow="ترتبط النسبة بمدة الخدمة" title="الاستقالة">
                  في الاستقالة العادية لا تنظر إلى الأجر وحده: أقل من سنتين = صفر، من سنتين إلى أقل من 5 سنوات = ثلث، من 5 إلى أقل من 10 سنوات = ثلثان، و10 سنوات فأكثر = كامل المكافأة.
                </PlainBlock>
                <PlainBlock eyebrow="اقرأ السبب المكتوب قبل إدخال الحالة" title="الاتفاق أو المخالصة">
                  قد تبدو المخالصة كإنهاء بسيط، لكنها تعتمد على الصياغة والمستندات. قبل اختيار سبب الإنهاء في الحاسبة، طابقه مع خطاب الإنهاء أو الاستقالة أو عدم التجديد.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="cases">
                <PlainBlock title="الأجر المتغير والعمولات">
                  إذا كان دخلك يتضمن عمولات أو نسباً متغيرة أو بدلات تختلف من شهر إلى شهر، فلا تضفها أو تستبعدها آلياً. المادة 86 تفتح باب الاتفاق المكتوب على بعض العناصر القابلة للزيادة والنقص.
                </PlainBlock>
                <PlainBlock title="الإجازات غير المدفوعة">
                  قد تؤثر الإجازات غير المدفوعة أو الانقطاعات الطويلة على المدة المحتسبة. إذا تغيّرت مدة الخدمة في سجلات الشركة عن حسابك الشخصي، اطلب تفصيلاً يوضح الأيام المستبعدة.
                </PlainBlock>
                <PlainBlock title="فترة التجربة أو المادة 80">
                  الإنهاء أثناء فترة التجربة أو بسبب مخالفة جسيمة يحتاج قراءة مختلفة، ولا يصح أن تحوّله إلى اختيار عام داخل الحاسبة دون التحقق من المستندات والإجراءات.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="law">
                <PlainBlock title="المادة 84 باختصار">
                  هي أصل المعادلة: نصف شهر عن كل سنة من السنوات الخمس الأولى، ثم أجر شهر عن كل سنة بعد ذلك، مع احتساب كسور السنة بنسبة ما أمضاه العامل.
                </PlainBlock>
                <PlainBlock title="المادة 85 باختصار">
                  عند الاستقالة لا يتغير أصل المعادلة، بل تتغير نسبة الاستحقاق بحسب مدة الخدمة. لذلك ترى في الحاسبة الاستحقاق الكامل ثم النسبة المطبقة على الاستقالة.
                </PlainBlock>
                <PlainBlock title="المادة 86 باختصار">
                  تفيدك عند وجود عمولات أو نسب مبيعات أو عناصر أجر تزيد وتنقص. لا تجعل حقل الأجر المرجعي قراراً عشوائياً إذا كانت هذه العناصر جزءاً كبيراً من دخلك.
                </PlainBlock>
                <PlainBlock title="المادتان 87 و88 باختصار">
                  المادة 87 تذكر حالات استحقاق كامل رغم الاستقالة، مثل القوة القاهرة وبعض حالات العاملة بعد الزواج أو الوضع. المادة 88 مهمة لتوقيت تصفية المستحقات بعد انتهاء العلاقة.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="examples">
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead>
                      <tr><th>السيناريو</th><th>المدة</th><th>ماذا يحدث؟</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>استقالة بعد 3 سنوات</td><td>3 سنوات</td><td>تبدأ من المكافأة الكاملة ثم تأخذ ثلثها فقط.</td></tr>
                      <tr><td>انتهاء عقد بعد 7 سنوات</td><td>7 سنوات</td><td>تأخذ كامل الاستحقاق: نصف شهر لكل سنة من أول 5 سنوات، وشهر لكل سنة بعدها.</td></tr>
                      <tr><td>استقالة بعد 12 سنة</td><td>12 سنة</td><td>تعود النسبة إلى 100% لأن العامل تجاوز 10 سنوات.</td></tr>
                      <tr><td>عمولات شهرية متغيرة</td><td>أي مدة</td><td>لا يكفي إدخال الأجر الأساسي فقط قبل مراجعة الاتفاق المكتوب على الأجر المرجعي.</td></tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section id="esb-comparison">
            <h2>جدول مرجعي: الفرق بين أسباب إنهاء العلاقة</h2>
            <p>هذا الجدول يلخّص القاعدة المبسطة التي تعتمد عليها الحاسبة عند اختيار سبب الإنهاء.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>السبب</th><th>المدة</th><th>نسبة الاستحقاق</th><th>ما الذي تراجعه؟</th></tr>
                </thead>
                <tbody>
                  <tr><td>انتهاء العقد</td><td>أي مدة</td><td>100%</td><td>تأكد أن سبب الانتهاء في الخطاب ليس استقالة أو مخالصة بصياغة مختلفة.</td></tr>
                  <tr><td>فصل أو إنهاء من صاحب العمل</td><td>أي مدة</td><td>100%</td><td>راجع إن كان الإنهاء عاماً أم مرتبطاً بمادة خاصة مثل المادة 80.</td></tr>
                  <tr><td>استقالة</td><td>أقل من سنتين</td><td>0%</td><td>تأكد من تاريخ البداية الفعلي وهل الخدمة متصلة.</td></tr>
                  <tr><td>استقالة</td><td>من سنتين إلى أقل من 5 سنوات</td><td>33.33%</td><td>قارن أثر الانتظار إذا كنت قريباً من خمس سنوات.</td></tr>
                  <tr><td>استقالة</td><td>من 5 إلى أقل من 10 سنوات</td><td>66.67%</td><td>قارن أثر الانتظار إذا كنت قريباً من عشر سنوات.</td></tr>
                  <tr><td>استقالة</td><td>10 سنوات فأكثر</td><td>100%</td><td>يبقى الأجر المرجعي والتواريخ هما مصدر الفروق الأكبر.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <details className="tool-v2-collapse">
            <summary>
              <h2 id="esb-scope">من لا تشمله هذه الحاسبة؟</h2>
              <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="tool-v2-collapse-body">
              <p>
                هذه الحاسبة مبنية على نظام العمل السعودي الذي يحكم علاقات القطاع الخاص. لا تشملها
                حالتان شائعتان في نتائج البحث:
              </p>
              <ul>
                <li><strong>العمالة المنزلية</strong> — تخضع للائحة تعاقدية منفصلة بشروط مختلفة عن المواد 84-88.</li>
                <li><strong>أغلب موظفي القطاع الحكومي</strong> — مشمولون عادة بنظام التقاعد المدني أو تأمينات التقاعد، لا بمكافأة نهاية خدمة من صاحب العمل بنفس الصيغة.</li>
              </ul>
              <p>إذا كانت حالتك إحدى هاتين، راجع اللائحة أو الجهة المختصة بدلاً من الاعتماد على نتيجة هذه الحاسبة.</p>
            </div>
          </details>

          <section id="esb-official">
            <h2>راجع المصدر الرسمي عند الحاجة</h2>
            <p>
              الحاسبة مصممة للسرعة والفهم الأولي، لكن النص الرسمي هو المرجع النهائي في أي نزاع أو
              حالة استثنائية. إذا كانت النتيجة مرتبطة بتسوية فعلية أو خلاف على مدة الخدمة أو الأجر،
              فابدأ بـ<a href="https://www.hrsd.gov.sa/en/ministry-services/services/end-service-benefit-calculator" target="_blank" rel="noreferrer">حاسبة منصة قوى</a> (وزارة الموارد البشرية) و<a href="https://www.hrsd.gov.sa/en/knowledge-centre/%D9%86%D8%B8%D8%A7%D9%85-%D8%A7%D9%84%D8%B9%D9%85%D9%84" target="_blank" rel="noreferrer">نص نظام العمل</a>، ثم استخدم{' '}
              <Link href="/calculators/monthly-installment">حاسبة القسط الشهري</Link> للتخطيط بعد
              نهاية العمل.
            </p>
          </section>

          {/* Fixed rule: one ad roughly in the middle of column 1's content (4 sections
              before it, 4 after) — desktop's only in-article ad; mobile gets this PLUS the
              dedicated tool-top one above. */}
          <ToolInArticleAd slotId="mid-tool-content" />

          <section id="esb-faq">
            <h2>أسئلة تتكرر قبل الاستقالة أو عند مراجعة التسوية</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    {item.question}
                    <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="esb-sources">
              <h2>مصادر رسمية</h2>
              <ul>
                {sources.map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                    {source.description ? ` — ${source.description}` : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section id="esb-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/end-of-service-benefits`}
              title="حاسبة مكافأة نهاية الخدمة"
              hint="هل تدير موقعاً أو منتدى؟ أضف حاسبة مكافأة نهاية الخدمة إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>

          <section id="esb-related">
            <h2>حاسبات مرتبطة بالتخطيط بعد نهاية الخدمة</h2>
            <p>بعد معرفة المستحقات، قد تحتاج تقدير قسط أو ضريبة أو نسبة تغير في الدخل:</p>
            <RelatedCalculatorsGrid items={PLANNING_TOOLS} />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <EndOfServiceCalculator
              initialStartDate={defaultStartDate}
              initialEndDate={defaultEndDate}
            />
          </div>
          <RelatedToolsCard items={SIMILAR_TOOLS} heading={`استكشف ${SIMILAR_TOOLS.length} حاسبات مكافأة نهاية خدمة في دول أخرى`} />
        </div>
      </div>
    </main>
  );
}
