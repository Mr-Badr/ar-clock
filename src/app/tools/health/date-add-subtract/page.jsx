import Link from 'next/link';

import '@/app/tools/tools-v2.css';
import DateAddSubtractCalculator from '@/components/calculators/DateAddSubtractCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'date-add-subtract');
const CONTENT = getFinancePageContent('date-add-subtract');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const TOC_ITEMS = [
  ['how-it-works', 'لماذا يختلف حساب الأشهر الهجرية؟'],
  ['das-faq', 'الأسئلة الشائعة'],
];

export default function DateAddSubtractPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const howToSteps = Array.isArray(CONTENT.howTo?.steps) ? CONTENT.howTo.steps : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الصحة والعمر', item: `${SITE_URL}/tools/health` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title,
    description: PAGE.description, about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: CONTENT.howTo?.name || PAGE.title,
    description: CONTENT.howTo?.description || PAGE.description,
    step: howToSteps.map((item) => ({ '@type': 'HowToStep', name: item.name, text: item.text })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-date-add-subtract" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-date-add-subtract" /></div>

        <article className="tool-v2-lane-article">
          <section id="how-it-works">
            <h2>لماذا حساب الأشهر الهجرية يختلف عن الأشهر الميلادية؟</h2>
            <p>
              الشهر الهجري 29 أو 30 يوماً فقط (لا 30 أو 31 كالميلادي)، والسنة الهجرية أقصر من الميلادية بنحو 10-11 يوماً.
              لهذا فإن إضافة "شهر واحد" على تاريخ هجري يعطي نتيجة مختلفة عن إضافة شهر ميلادي — هذه الأداة تحسب كل تقويم
              بقواعده الفعلية (تقويم أم القرى للهجري) ثم تعرض النتيجة بالتقويمين معاً، فلا تحتاج لتحويل يدوي بعد الحساب.
            </p>
            <div className="tool-v2-info-grid">
              <div className="tool-v2-info-card">
                <h3>إضافة أو طرح أيام وأسابيع</h3>
                <p>حساب دقيق بفارق أيام فعلي، بصرف النظر عن التقويم المُدخل.</p>
              </div>
              <div className="tool-v2-info-card">
                <h3>إضافة أو طرح أشهر وسنوات</h3>
                <p>يُحسب داخل نظام الشهر الخاص بالتقويم الذي أدخلته (هجري أو ميلادي) لا بالتقريب.</p>
              </div>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-date-add-subtract" />

          <section id="das-faq">
            <h2>أسئلة عن حساب إضافة وطرح الأيام من تاريخ هجري وميلادي</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {CONTENT.sources?.length > 0 && (
            <section id="das-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}

          <section id="das-related">
            <h2>أدوات تاريخ أخرى</h2>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['hijri-birthday', 'age-calculator', 'age-hijri'].map((slug) => {
                const tool = CALCULATOR_ROUTES.find((item) => item.slug === slug);
                if (!tool) return null;
                return (
                  <Link key={slug} href={tool.href}>
                    <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                    {tool.shortLabel || tool.title}
                  </Link>
                );
              })}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><DateAddSubtractCalculator /></div>
        </div>
      </div>
    </main>
  );
}
