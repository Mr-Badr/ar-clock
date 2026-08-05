import Link from 'next/link';

import PesticideDosageCalculator from '@/components/calculators/PesticideDosageCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pest-control-dosage-calculator');
const CONTENT = getPestControlPageContent('dosage-calculator');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['pest-control-inspection-report', 'pest-control-cost-estimator', 'pest-control-contract-checker']);

const TOC_ITEMS = [
  ['dosage-guide', 'لماذا "الملصق هو القانون" عند حساب الجرعة'],
  ['dosage-faq', 'الأسئلة الشائعة'],
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

export default function PestDosageCalculatorPage() {
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
    about: ['حاسبة جرعة المبيد', 'كيف احسب كمية المبيد'],
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

      <ToolTopAdSlot slotId="top-pest-dosage" />
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
          <ToolInArticleAd slotId="mobile-pest-dosage" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="dosage-guide">
            <h2>لماذا &quot;الملصق هو القانون&quot; عند حساب الجرعة</h2>
            <p>
              كل مبيد له تركيز فعّال ومعدل جرعة موصى به مختلف تماماً عن غيره، حتى لو استُخدما لنفس
              نوع الحشرة. معدل الجرعة المكتوب على العبوة هو نتيجة اختبارات فعلية للتركيز الأمثل بين
              الفعالية والسلامة — رفعه بحدسك الشخصي لا يزيد الفعالية بالضرورة، وقد يكون مخالفاً
              لتعليمات الاستخدام الآمن. لهذا تطلب الحاسبة أعلاه رقمك أنت من ملصق منتجك، لا رقماً
              عاماً واحداً يُطبَّق على الجميع.
            </p>
            <PlainBlock eyebrow="المعادلة ببساطة" title="مركّز × سعة الخزان = الكمية لكل خزان">
              كمية المركّز لكل خزان كامل = معدل الجرعة على الملصق (مل أو غرام لكل لتر ماء) × سعة
              الخزان باللتر. مثال: ملصق يقول &quot;5 مل لكل لتر&quot; وخزان 16 لتراً → 80 مل من
              المركّز لكل خزان كامل.
            </PlainBlock>
            <PlainBlock eyebrow="عند رش مساحة كبيرة" title="احسب عدد الخزانات قبل البدء">
              إن كنت تخطط لتغطية مساحة كبيرة، أدخل المساحة ومعدل الرش لكل متر مربع في الحاسبة أعلاه
              لمعرفة عدد الخزانات الكاملة التي ستحتاجها مسبقاً، بدل مقاطعة العمل لتحضير خزان إضافي
              في المنتصف.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-pest-dosage" />

          <section id="dosage-faq">
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
            <section id="dosage-sources">
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
            <PesticideDosageCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في مكافحة الحشرات" />
        </div>
      </div>
    </main>
  );
}
