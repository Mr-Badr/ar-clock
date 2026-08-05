import Link from 'next/link';

import Article77CompensationCalculator from '@/components/calculators/Article77CompensationCalculator.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'article-77-compensation');
const CONTENT = getFinancePageContent('article-77-compensation');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

function pickTools(slugs) {
  return slugs
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && !item.draft);
}

const PLANNING_TOOLS = pickTools(['end-of-service-benefits', 'net-salary', 'nafaqah', 'monthly-installment']);

const TOC_ITEMS = [
  ['a77-guide', 'متى تستحق التعويض، وكيف يُحسب؟'],
  ['a77-comparison', 'جدول: المادة 74 مقابل المادة 77'],
  ['a77-scope', 'العلاقة بمكافأة نهاية الخدمة'],
  ['a77-official', 'المصدر الرسمي'],
  ['a77-faq', 'الأسئلة الشائعة'],
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

export default async function Article77CompensationPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];
  const nowIso = await getCachedNowIso();
  const defaultEndDate = nowIso.slice(0, 10);
  const defaultStartDate = shiftYears(defaultEndDate, -3);

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
          <ToolInArticleAd slotId="mobile-tool-top" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="a77-guide">
            <h2>متى تستحق التعويض، وكيف يُحسب؟</h2>
            <p>
              المادة 77 تُطبَّق فقط عندما يُنهي صاحب العمل عقدك بطريقة لا تندرج تحت الأسباب
              المشروعة في المادة 74 (اتفاق كتابي، انتهاء عقد محدد المدة دون تجديد، بلوغ سن
              التقاعد، أو القوة القاهرة)، ولا وفق إجراءات المادة 75 الصحيحة لإنهاء عقد غير محدد
              المدة. إذا انطبقت حالتك، فالصيغة تعتمد على نوع عقدك.
            </p>

            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>نوع العقد</th><th>صيغة التعويض</th><th>الحد الأدنى</th></tr>
                </thead>
                <tbody>
                  <tr><td>غير محدد المدة</td><td>15 يوماً أجر × عدد سنوات الخدمة</td><td>أجر شهرين</td></tr>
                  <tr><td>محدد المدة</td><td>الأجر الشهري × الأشهر المتبقية من مدة العقد</td><td>أجر شهرين</td></tr>
                </tbody>
              </table>
            </div>

            <PlainBlock eyebrow="مذكور صراحة داخل نص المادة" title="الحد الأدنى: أجر شهرين كاملين">
              حتى لو كان ناتج الصيغة أقل من أجر شهرين (مثلاً بعد أقل من عام خدمة في عقد غير محدد
              المدة)، ينص النظام صراحة على ألا يقل التعويض في الحالتين عن أجر شهرين كاملين — تطبّق
              الحاسبة هذا الحد تلقائياً وتوضح لك متى تم رفع الرقم بسببه.
            </PlainBlock>
          </section>

          <section id="a77-comparison">
            <h2>جدول: المادة 74 مقابل المادة 77</h2>
            <p>الفرق بين الحالتين هو ما يحدد استحقاقك من الأساس.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>الحالة</th><th>المادة المنطبقة</th><th>هل يوجد تعويض؟</th></tr>
                </thead>
                <tbody>
                  <tr><td>اتفاق كتابي بين الطرفين على الإنهاء</td><td>المادة 74</td><td>لا</td></tr>
                  <tr><td>انتهاء عقد محدد المدة دون تجديد</td><td>المادة 74</td><td>لا</td></tr>
                  <tr><td>إنهاء عقد غير محدد المدة بإشعار صحيح</td><td>المادة 75</td><td>لا (مع دفع مهلة الإشعار)</td></tr>
                  <tr><td>فصل تأديبي مبرر بمخالفة جسيمة</td><td>المادة 80</td><td>لا</td></tr>
                  <tr><td>إنهاء بدون سبب مشروع أو بدون اتباع الإجراء الصحيح</td><td>المادة 77</td><td>نعم — هذا ما تحسبه الأداة</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <details className="tool-v2-collapse">
            <summary>
              <h2 id="a77-scope">العلاقة بمكافأة نهاية الخدمة</h2>
              <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="tool-v2-collapse-body">
              <p>
                تعويض المادة 77 <strong>مستحق منفصل تماماً</strong> عن مكافأة نهاية الخدمة (المواد
                84-88) والأجور المستحقة حتى تاريخ الإنهاء ومهلة الإشعار إن لم تُحترم. لا يحل أحدهما
                محل الآخر — إذا كان إنهاء عقدك غير مشروع، فأنت تستحق تعويض المادة 77 بالإضافة إلى
                مكافأة نهاية الخدمة الكاملة (وليس النسبة المخفّضة التي تُطبَّق أحياناً عند
                الاستقالة).
              </p>
              <p>استخدم <Link href="/tools/gulf-finance/end-of-service-benefits">حاسبة مكافأة نهاية الخدمة</Link> لحساب ذلك المستحق الآخر بشكل منفصل.</p>
            </div>
          </details>

          <section id="a77-official">
            <h2>راجع المصدر الرسمي عند الحاجة</h2>
            <p>
              الحاسبة مصممة للتقدير السريع، لكن النص الرسمي والمحكمة العمالية هما المرجع النهائي في
              أي نزاع فعلي. إذا كانت حالتك تتضمن خلافاً حقيقياً حول سبب الإنهاء أو مقدار التعويض،
              فراجع{' '}
              <a href="https://www.hrsd.gov.sa/knowledge-centre/decisions-and-regulations/regulation-and-procedures/%D9%86%D8%B8%D8%A7%D9%85-%D8%A7%D9%84%D8%B9%D9%85%D9%84" target="_blank" rel="noreferrer">
                نظام العمل الرسمي
              </a>{' '}
              (وزارة الموارد البشرية والتنمية الاجتماعية)، أو استشر محامياً متخصصاً في قضايا العمل.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-tool-content" />

          <section id="a77-faq">
            <h2>أسئلة تتكرر عند مراجعة الإنهاء التعسفي</h2>
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
            <section id="a77-sources">
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

          <section id="a77-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/article-77-compensation`}
              title="حاسبة تعويض المادة 77"
              hint="هل تدير موقعاً أو منتدى؟ أضف حاسبة تعويض المادة 77 إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>

          <section id="a77-related">
            <h2>حاسبات مرتبطة بنهاية العلاقة الوظيفية</h2>
            <p>بعد معرفة تعويض المادة 77، قد تحتاج أيضاً:</p>
            <RelatedCalculatorsGrid items={PLANNING_TOOLS} />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <Article77CompensationCalculator
              initialStartDate={defaultStartDate}
              initialEndDate={defaultEndDate}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
