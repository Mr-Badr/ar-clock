import Link from 'next/link';

import TrafficFineDiscountCalculator from '@/components/calculators/TrafficFineDiscountCalculator.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { EXCLUDED_CATEGORIES } from '@/lib/calculators/traffic-fine-engine';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { getCachedNowIso } from '@/lib/date-utils';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'traffic-fine-discount');
const CONTENT = getFinancePageContent('traffic-fine-discount');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

function pickTools(slugs) {
  return slugs
    .map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug))
    .filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['net-salary', 'monthly-installment', 'car-insurance-saudi']);

const TOC_ITEMS = [
  ['tf-guide', 'قاعدة الخصم الحالية: 25% خلال 45 يوماً'],
  ['tf-excluded', 'المخالفات المستثناة من الخصم'],
  ['tf-installment', 'التقسيط عبر أبشر'],
  ['tf-official', 'المصدر الرسمي'],
  ['tf-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
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

export default async function TrafficFineDiscountPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];
  const nowIso = await getCachedNowIso();
  const todayIso = nowIso.slice(0, 10);

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
          <section id="tf-guide">
            <h2>قاعدة الخصم الحالية: 25% خلال 45 يوماً</h2>
            <p>
              وفق المادة 75 من نظام المرور، تحصل على خصم 25% من قيمة أي مخالفة فردية إذا سددتها
              خلال 45 يوماً من تاريخ تسجيلها. بعد انقضاء هذه المهلة، يصبح المبلغ الكامل مستحقاً بدون
              خصم. هذه القاعدة نافذة ومستمرة منذ أبريل 2024 — وهي <strong>مختلفة</strong> عن خصم
              الـ50% الذي كان برنامجاً استثنائياً لمرة واحدة على المخالفات المتراكمة القديمة،
              وانتهى فعلياً في 18 إبريل 2025 ولم يُجدَّد.
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr><th>المدة منذ التسجيل</th><th>الخصم المتاح</th></tr>
                </thead>
                <tbody>
                  <tr><td>0 - 45 يوماً</td><td>25% (ما لم تكن من الأنواع المستثناة)</td></tr>
                  <tr><td>أكثر من 45 يوماً</td><td>لا يوجد خصم — المبلغ الكامل مستحق</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <details className="tool-v2-collapse">
            <summary>
              <h2 id="tf-excluded">المخالفات المستثناة من الخصم</h2>
              <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div className="tool-v2-collapse-body">
              <p>لا تستفيد 9 فئات من المخالفات من خصم الـ25% مهما كان تاريخ السداد:</p>
              <ul>
                {EXCLUDED_CATEGORIES.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
          </details>

          <section id="tf-installment">
            <h2>التقسيط عبر أبشر</h2>
            <p>
              للمخالفات المرتفعة القيمة، يمكن طلب تقسيطها على 3 إلى 12 شهراً عبر منصة أبشر:{' '}
              <strong>خدماتي ← المرور ← تجزئة المخالفات المرورية</strong>. يجب تقديم طلب التقسيط
              خلال 90 يوماً من تاريخ تسجيل المخالفة أو الفصل في الاعتراض عليها إن وُجد.
            </p>
            <PlainBlock eyebrow="القسط تقديري" title="القسط الشهري = المبلغ الإجمالي ÷ عدد الأشهر">
              الحاسبة تعرض قسطاً شهرياً تقريبياً بالتقسيم البسيط. الرقم الدقيق النهائي يُحدَّد داخل
              منصة أبشر عند تقديم الطلب فعلياً.
            </PlainBlock>
          </section>

          <section id="tf-official">
            <h2>راجع المصدر الرسمي عند الحاجة</h2>
            <p>
              الأرقام والمهل هنا استرشادية ومبنية على القاعدة النافذة حالياً. لأي قرار سداد فعلي أو
              تفاصيل مخالفة محددة، ارجع دائماً إلى{' '}
              <a href="https://www.absher.sa" target="_blank" rel="noreferrer">منصة أبشر</a> أو{' '}
              <a href="https://www.moi.gov.sa/wps/portal/Home/sectors/publicsecurity/trafficdepartment" target="_blank" rel="noreferrer">
                الإدارة العامة للمرور
              </a>.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-tool-content" />

          <section id="tf-faq">
            <h2>أسئلة تتكرر قبل سداد مخالفة مرورية</h2>
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
            <section id="tf-sources">
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

          <section id="tf-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/traffic-fine-discount`}
              title="حاسبة خصم المخالفات المرورية"
              hint="هل تدير موقعاً أو منتدى؟ أضف حاسبة خصم المخالفات المرورية إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={480}
            />
          </section>

          <section id="tf-related">
            <h2>حاسبات مرتبطة</h2>
            <RelatedCalculatorsGrid items={RELATED_TOOLS} />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <TrafficFineDiscountCalculator initialTodayIso={todayIso} />
          </div>
        </div>
      </div>
    </main>
  );
}
