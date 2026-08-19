import Link from 'next/link';

import PestCostEstimator from '@/components/calculators/PestCostEstimator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getPestControlPageContent } from '@/lib/calculators/pest-control-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pest-control-cost-estimator');
const CONTENT = getPestControlPageContent('cost-estimator');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['pest-control-termite-estimator', 'pest-control-contract-checker', 'pest-control-dosage-calculator']);

const TOC_ITEMS = [
  ['cost-guide', 'ما الذي يرفع أو يخفض سعر مكافحة الحشرات فعلياً؟'],
  ['cost-faq', 'الأسئلة الشائعة'],
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

// Same relative per-m² rate multipliers used by PestCostEstimator.client.jsx's PEST_TYPES
// (general=2, rodents=2.5, bedbugs=4) — kept identical to the calculator's real logic, not
// invented separately, so the visual and the actual calculated result never disagree.
const PEST_COST_BARS = [
  { label: 'صراصير ونمل عام', rate: 2, colorVar: '--blue-text' },
  { label: 'قوارض (فئران)', rate: 2.5, colorVar: '--amber-text' },
  { label: 'بق الفراش', rate: 4, colorVar: '--red-text' },
];
const PEST_COST_MAX = 4;

function PestCostChart() {
  return (
    <div className="tool-v2-chart-card">
      <div className="tool-v2-chart-head">
        <h3>لماذا يختلف السعر بهذا الشكل حسب نوع الآفة؟</h3>
        <p>سعر كل نوع نسبةً إلى الآخر لكل متر مربع — بق الفراش يحتاج ضعف وقت المعالجة تقريباً مقارنة بالصراصير والنمل.</p>
      </div>
      <div className="tool-v2-hbar-list">
        {PEST_COST_BARS.map((row) => (
          <div key={row.label} className="tool-v2-hbar-row">
            <span className="tool-v2-hbar-label">{row.label}</span>
            <div className="tool-v2-hbar-track">
              <div
                className="tool-v2-hbar-fill"
                style={{ width: `${(row.rate / PEST_COST_MAX) * 100}%`, background: `var(${row.colorVar})` }}
              />
            </div>
            <span className="tool-v2-hbar-value">×{row.rate}</span>
          </div>
        ))}
      </div>
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

export default function PestCostEstimatorPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مكافحة الحشرات', item: `${SITE_URL}/tools/pest-control` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['تكلفة مكافحة الحشرات', 'كم سعر رش المنزل من الحشرات'],
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

      <ToolTopAdSlot slotId="top-pest-cost" />
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
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-pest-cost" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="cost-guide">
            <h2>ما الذي يرفع أو يخفض سعر مكافحة الحشرات فعلياً؟</h2>
            <p>
              ثلاثة عوامل تحدد السعر الحقيقي أكثر من أي شيء آخر: <strong>نوع الآفة</strong> (بق
              الفراش يحتاج معالجة أدق وأطول من الصراصير)، <strong>درجة الإصابة</strong> (إصابة
              شديدة متكررة تحتاج زيارات أكثر ومبيداً أكثر)، و<strong>مساحة العقار</strong> (وقت
              العمل يزيد مع المساحة). الحاسبة أعلاه تجمع الثلاثة معاً لتعطيك نطاقاً واقعياً بدل رقم
              عام لا يعكس حالتك.
            </p>
            <PestCostChart />
            <PlainBlock eyebrow="لماذا بق الفراش أغلى دائماً؟" title="الوقت لا المادة">
              معالجة بق الفراش تحتاج فحص كل قطعة أثاث وزاوية غرفة بدقة، وغالباً أكثر من زيارة
              واحدة للتأكد من القضاء على البيض أيضاً لا الحشرات البالغة فقط — وقت عمل أطول بكثير
              من رش عام للصراصير والنمل.
            </PlainBlock>
            <PlainBlock eyebrow="إصابة عادت بعد معالجة سابقة؟" title="السبب غالباً لم يُعالَج">
              عودة الإصابة بعد معالجة سابقة تعني عادة أن مصدر المشكلة (تسرب مياه، شق في الجدار،
              مصدر غذاء متاح) لم يُعالَج، لا أن المبيد كان ضعيفاً. فعّل هذا الخيار في الحاسبة أعلاه
              لتقدير أقرب للواقع.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-pest-cost" />

          <section id="cost-faq">
            <h2>الأسئلة الشائعة</h2>
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
            <section id="cost-sources">
              <h2>مصادر</h2>
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
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <PestCostEstimator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في مكافحة الحشرات" />
        </div>
      </div>
    </main>
  );
}
