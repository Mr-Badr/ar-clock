import { Suspense } from 'react';
import Link from 'next/link';

import LandscapingQuoteGenerator from '@/components/calculators/LandscapingQuoteGenerator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getLandscapingPageContent } from '@/lib/calculators/landscaping-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-quote-generator');
const CONTENT = getLandscapingPageContent('landscaping-quote');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: CONTENT.faqItems });

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['landscaping-garden-cost', 'landscaping-artificial-grass', 'landscaping-maintenance-tracker']);

const TOC_ITEMS = [
  ['ls-quote-guide', 'ما الذي يجعل عرض سعر تنسيق الحديقة يبدو موثوقاً؟'],
  ['ls-quote-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: SEARCH_COVERAGE.metadataKeywords, url: `${SITE_URL}${PAGE.href}` });

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
            {index === 0 ? <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg></span> : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function LandscapingQuoteGeneratorPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'تنسيق الحدائق', item: `${SITE_URL}/tools/landscaping` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({ siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description, about: ['عرض سعر تنسيق حديقة', 'نموذج عرض سعر تنسيق حدائق'], keywords: SEARCH_COVERAGE.metadataKeywords });
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-ls-quote" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-ls-quote" /></div>

        <article className="tool-v2-lane-article">
          <section id="ls-quote-guide">
            <h2>ما الذي يجعل عرض سعر تنسيق الحديقة يبدو موثوقاً؟</h2>
            <p>
              عرض سعر بند واحد إجمالي يثير الشك دائماً. تفصيل الخدمة إلى بنود واضحة (تصميم، أرضية،
              ري، إضاءة، نباتات) يمنح العميل فهماً حقيقياً لما يدفع مقابله، ويسهّل عليه مقارنة عرضك
              بعروض أخرى بعدالة.
            </p>
            <PlainBlock eyebrow="اربط الأداتين ببعض" title="من الحاسبة مباشرة إلى العرض">
              إن جئت من حاسبة تكلفة تنسيق الحديقة عبر زر "حوّل إلى عرض سعر"، ستجد الرقم والخدمة
              معبّأين تلقائياً في أول بند — عدّلهما أو أضف بنوداً أخرى من القائمة الجاهزة أعلاه.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-ls-quote" />

          <section id="ls-quote-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="ls-quote-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <Suspense fallback={<div className="tool-v2-empty-state">جارِ التحميل…</div>}>
              <LandscapingQuoteGenerator />
            </Suspense>
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في تنسيق الحدائق" />
        </div>
      </div>
    </main>
  );
}
