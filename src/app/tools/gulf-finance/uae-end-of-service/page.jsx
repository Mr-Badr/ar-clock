import Link from 'next/link';

import UaeEndOfServiceCalculator from '@/components/calculators/UaeEndOfServiceCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'uae-end-of-service');
const CONTENT = getFinancePageContent('uae-end-of-service');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

function pickTools(slugs) {
  return slugs
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && !item.draft);
}

// Same-niche sidebar list (other countries' EOS calculators) vs. complementary
// end-of-article planning tools — same distinctness rule as end-of-service-benefits.
const SIMILAR_TOOLS = pickTools(['end-of-service-benefits', 'eos-egypt', 'eos-jordan', 'eos-qatar']);
const PLANNING_TOOLS = pickTools(['monthly-installment', 'net-salary', 'vat', 'investment']);

const TOC_ITEMS = [
  ['uae-esb-guide', 'كيف تُحسب المكافأة وكيف تختلف حسب السبب؟'],
  ['uae-esb-comparison', 'جدول مرجعي: الاستحقاق حسب السبب والمدة'],
  ['uae-esb-scope', 'من لا تشمله هذه الحاسبة؟'],
  ['uae-esb-official', 'المصدر الرسمي'],
  ['uae-esb-faq', 'الأسئلة الشائعة'],
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

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

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

export default async function UaeEndOfServiceToolPage() {
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

      <ToolTopAdSlot slotId="top-uae-end-of-service" />
      <TocDetailsReveal />

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

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-uae-end-of-service" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="uae-esb-guide">
            <h2>كيف تُحسب المكافأة، ومتى يتغير الرقم فعلياً؟</h2>
            <p>
              معادلة الإمارات مبنية على شريحتين: 21 يوماً عن كل سنة من أول خمس سنوات، ثم 30 يوماً عن
              كل سنة بعدها. الشرط الوحيد للاستحقاق هو إتمام سنة كاملة من الخدمة — بعدها تحصل على
              المكافأة كاملة أياً كان سبب انتهاء العلاقة (استقالة أو انتهاء عقد أو إنهاء من صاحب
              العمل). هذا القسم يشرح كل جزء على حدة.
            </p>

            <figure className="tool-v2-figure">
              <div className="tool-v2-figure-timeline">
                <div className="tool-v2-tl-step">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" /></svg>
                  </span>
                  <b>بداية الخدمة</b>
                  <span>الراتب الأساسي المتفق عليه في العقد</span>
                </div>
                <div className="tool-v2-tl-line" />
                <div className="tool-v2-tl-step">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                  </span>
                  <b>أول 5 سنوات</b>
                  <span>21 يوماً أجر عن كل سنة خدمة</span>
                </div>
                <div className="tool-v2-tl-line" />
                <div className="tool-v2-tl-step tool-v2-tl-step--accent">
                  <span className="tool-v2-tl-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-1" /></svg>
                  </span>
                  <b>بعد 5 سنوات</b>
                  <span>30 يوماً أجر كامل عن كل سنة إضافية</span>
                </div>
              </div>
              <figcaption>مسار احتساب مكافأة نهاية الخدمة الإماراتية (المرسوم الاتحادي 33 لعام 2021)</figcaption>
            </figure>

            <Tabs defaultValue="eligibility" dir="rtl">
              <TabsList className="tool-v2-tabs-list" aria-label="شرح نتيجة مكافأة نهاية الخدمة الإمارات">
                <TabsTrigger value="eligibility" className="tool-v2-tabs-trigger">سبب الإنهاء</TabsTrigger>
                <TabsTrigger value="cases" className="tool-v2-tabs-trigger">حالات تحتاج انتباه</TabsTrigger>
                <TabsTrigger value="law" className="tool-v2-tabs-trigger">النظام باختصار</TabsTrigger>
                <TabsTrigger value="examples" className="tool-v2-tabs-trigger">أمثلة سريعة</TabsTrigger>
              </TabsList>

              <TabsContent value="eligibility">
                <PlainBlock eyebrow="الشرط الوحيد للاستحقاق" title="أقل من سنة خدمة">
                  إذا انتهت علاقة عملك قبل إتمام سنة كاملة من الخدمة الفعلية، فلا تستحق مكافأة نهاية خدمة إطلاقاً — وينطبق هذا على كل الأسباب: استقالة، انتهاء عقد، أو إنهاء من صاحب العمل.
                </PlainBlock>
                <PlainBlock eyebrow="القانون الحالي يساوي بين كل الأسباب" title="سنة فأكثر — استحقاق كامل">
                  بمجرد إتمام سنة كاملة من الخدمة، تحصل على المكافأة كاملة بالمعادلة القياسية (21 يوماً ثم 30 يوماً) بصرف النظر عن سبب الإنهاء. المرسوم الاتحادي رقم 33 لعام 2021 ألغى التدرج القديم الذي كان يقسّم مكافأة المستقيل إلى ثلث أو ثلثين حسب المدة — هذا التدرج لم يعد معمولاً به منذ دخول القانون حيّز التنفيذ في فبراير 2022.
                </PlainBlock>
                <PlainBlock eyebrow="نفس القاعدة، وتعويض إضافي محتمل" title="التقاعد أو الوفاة أو الإنهاء التعسفي">
                  التقاعد والوفاة يُحتسبان بنفس قاعدة "سنة فأكثر = استحقاق كامل" أعلاه. أما الإنهاء التعسفي (دون سبب مشروع من صاحب العمل) فيمنحك المكافأة كاملة أيضاً، وقد يُضاف له تعويض منفصل يصل إلى ثلاثة أشهر راتب — هذا التعويض لا تحسبه هذه الحاسبة.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="cases">
                <PlainBlock title="الراتب الأساسي مقابل الراتب الإجمالي">
                  أشيع سبب للمفاجأة: الحاسبة تعمل على الراتب الأساسي فقط، ليس المجموع. إذا كان أساسيك 8,000 درهم وإجماليك 14,000 فالمكافأة تُحسب على الـ 8,000 فقط ما لم ينصّ العقد على خلاف ذلك.
                </PlainBlock>
                <PlainBlock title="موظفو مناطق DIFC وADGM">
                  DIFC وADGM لهما قوانين عمل مستقلة عن القانون الاتحادي. DIFC يوفر نظام DEWS القائم على اشتراكات شهرية (5.83% ثم 8.33%) بدلاً من مكافأة نهاية الخدمة التقليدية — إذا كنت في إحدى المنطقتين، هذه الحاسبة لا تنطبق عليك.
                </PlainBlock>
                <PlainBlock title="فترة التجربة والانقطاعات">
                  فترة التجربة تُحتسب عموماً ضمن مدة الخدمة، لكن الإنهاء أثناءها يحتاج قراءة مختلفة. الانقطاعات الطويلة غير مدفوعة الأجر قد تؤثر على المدة المحتسبة — تحقق من تواريخ عقدك بدقة.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="law">
                <PlainBlock title="المرسوم الاتحادي رقم 33 لعام 2021">
                  دخل حيّز التنفيذ في فبراير 2022 وألغى التقسيم القديم بين عقود محدودة وغير محدودة — كل العقود أصبحت محدودة المدة قابلة للتجديد. معادلة المكافأة (21 و30 يوماً) بقيت كما هي.
                </PlainBlock>
                <PlainBlock title="الشريحتان باختصار">
                  21 يوماً لكل سنة من أول 5 سنوات (نحو 70% من الشهر)، ثم 30 يوماً (شهر كامل) لكل سنة بعدها. الفرق الفعلي يتضاعف مع طول الخدمة.
                </PlainBlock>
                <PlainBlock title="هل هناك حد أقصى؟">
                  نعم. المرسوم الاتحادي رقم 33 لعام 2021 يضع سقفاً لمكافأة نهاية الخدمة يساوي أجر سنتين كاملتين (الراتب الأساسي). إذا كانت نتيجة المعادلة العادية أعلى من هذا السقف — وهو وارد مع الرواتب المرتفعة والخدمة الطويلة — يُصرف السقف بدلاً منها. الحاسبة تطبّق هذا السقف تلقائياً وتنبّهك إذا كانت نتيجتك محكومة به.
                </PlainBlock>
                <PlainBlock title="الإنهاء من صاحب العمل والتعويض التعسفي">
                  الإنهاء من صاحب العمل يمنح استحقاقاً كاملاً؛ إذا كان دون سبب مشروع فقد يُضاف تعويض منفصل يصل إلى 3 أشهر راتب — هذا التعويض لا تحسبه الحاسبة.
                </PlainBlock>
              </TabsContent>

              <TabsContent value="examples">
                <div className="tool-v2-table-wrap">
                  <table className="tool-v2-table">
                    <thead>
                      <tr><th>السيناريو</th><th>المدة</th><th>ماذا يحدث؟</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>نهاية عقد بعد 3 سنوات</td><td>3 سنوات</td><td>استحقاق كامل: 21 يوماً × 3 سنوات.</td></tr>
                      <tr><td>استقالة بعد سنتين</td><td>سنتان</td><td>استحقاق كامل: 21 يوماً × سنتين — القانون الحالي لا يخفض المكافأة عند الاستقالة بعد إتمام سنة.</td></tr>
                      <tr><td>نهاية عقد بعد 7 سنوات</td><td>7 سنوات</td><td>21 يوماً × 5 سنوات + 30 يوماً × سنتين إضافيتين.</td></tr>
                      <tr><td>استقالة بعد 5 سنوات</td><td>5 سنوات</td><td>استحقاق كامل: 21 يوماً × 5 سنوات، بنفس معاملة انتهاء العقد.</td></tr>
                      <tr><td>استقالة بعد 25 سنة براتب مرتفع</td><td>25 سنة</td><td>الناتج قد يتجاوز أجر سنتين، فتُطبَّق الحاسبة السقف القانوني بدلاً من الرقم الأعلى.</td></tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section id="uae-esb-comparison">
            <h2>جدول مرجعي: الاستحقاق حسب السبب والمدة</h2>
            <p>
              هذا الجدول يلخّص القاعدة التي تعتمد عليها الحاسبة: الاستحقاق الكامل مرتبط بمدة الخدمة
              فقط (سنة فأكثر)، وليس بسبب إنهاء العلاقة — وهذا هو الفرق الجوهري بين القانون الحالي
              والتدرج القديم الذي كان معمولاً به قبل فبراير 2022.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>السبب</th><th>المدة</th><th>نسبة الاستحقاق</th><th>ملاحظة</th></tr>
                </thead>
                <tbody>
                  <tr><td>انتهاء العقد</td><td>سنة فأكثر</td><td>100%</td><td>تحقق من صياغة السبب في خطاب الإنهاء.</td></tr>
                  <tr><td>إنهاء من صاحب العمل</td><td>سنة فأكثر</td><td>100%</td><td>قد يُضاف تعويض تعسفي منفصل يصل إلى 3 أشهر راتب.</td></tr>
                  <tr><td>استقالة</td><td>سنة فأكثر</td><td>100%</td><td>نفس معاملة انتهاء العقد تماماً — لا تخفيض بعد الآن.</td></tr>
                  <tr><td>أي سبب</td><td>أقل من سنة</td><td>0%</td><td>لا استحقاق قبل إتمام سنة كاملة من الخدمة الفعلية.</td></tr>
                  <tr><td>أي سبب</td><td>الناتج يتجاوز أجر سنتين</td><td>محكوم بالسقف</td><td>مكافأة نهاية الخدمة لا تتجاوز أجر سنتين أساسي، مهما طالت الخدمة.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <details className="tool-v2-collapse">
            <summary>
              <h2 id="uae-esb-scope">من لا تشمله هذه الحاسبة؟</h2>
              <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="tool-v2-collapse-body">
              <p>
                هذه الحاسبة مبنية على القانون الاتحادي الإماراتي الذي يحكم علاقات القطاع الخاص. لا
                تشملها حالتان:
              </p>
              <ul>
                <li><strong>موظفو DIFC وADGM</strong> — لهما نظام مستقل (DEWS في DIFC)، لا مكافأة نهاية خدمة تقليدية.</li>
                <li><strong>موظفو القطاع الحكومي</strong> — مشمولون عادة بأنظمة تقاعد مختلفة عن مكافأة نهاية الخدمة من صاحب العمل.</li>
              </ul>
              <p>إذا كانت حالتك إحدى هاتين، راجع نظام المنطقة الحرة أو الجهة المختصة بدلاً من نتيجة هذه الحاسبة.</p>
            </div>
          </details>

          <section id="uae-esb-official">
            <h2>راجع المصدر الرسمي عند الحاجة</h2>
            <p>
              الحاسبة مصممة للسرعة والفهم الأولي، لكن النص الرسمي هو المرجع النهائي في أي نزاع أو
              حالة استثنائية. إذا كانت النتيجة مرتبطة بتسوية فعلية، فابدأ بـ<a href="https://mohre.gov.ae/ar/services/workers-services/end-of-service-calculation.aspx" target="_blank" rel="noreferrer">حاسبة MOHRE الرسمية</a> و<a href="https://mohre.gov.ae/ar/laws-regulations/federal-laws.aspx" target="_blank" rel="noreferrer">قانون العمل الإماراتي</a>، ثم استخدم{' '}
              <Link href="/tools/gulf-finance/end-of-service-benefits">حاسبة نهاية الخدمة السعودية</Link> إذا كنت تقارن بين الدولتين.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-uae-end-of-service" />

          <section id="uae-esb-faq">
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
            <section id="uae-esb-sources">
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

          <section id="uae-esb-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/uae-end-of-service`}
              title="حاسبة مكافأة نهاية الخدمة الإمارات"
              hint="هل تدير موقعاً أو منتدى؟ أضف حاسبة مكافأة نهاية الخدمة الإماراتية إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>

          <section id="uae-esb-related">
            <h2>حاسبات مرتبطة بالتخطيط بعد نهاية الخدمة</h2>
            <p>بعد معرفة المستحقات، قد تحتاج تقدير قسط أو ضريبة أو نسبة تغير في الدخل:</p>
            <RelatedCalculatorsGrid items={PLANNING_TOOLS} />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <UaeEndOfServiceCalculator
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
