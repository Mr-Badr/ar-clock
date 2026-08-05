import Link from 'next/link';

import PaintCalculator from '@/components/calculators/PaintCalculator.client';
import PaintCoverageChart from '@/components/calculators/PaintCoverageChart.client';
import EmbedCodeSnippet from '@/components/shared/EmbedCodeSnippet.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getConstructionPageContent } from '@/lib/calculators/construction-page-content';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'building-paint');
const CONTENT = getConstructionPageContent('paint');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: CONTENT.faqItems,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}

const RELATED_TOOLS = pickTools(['tiles', 'cement', 'building']);

const TOC_ITEMS = [
  ['paint-guide', 'كيف تحوّل مساحة الغرفة إلى لترات دهان بدقة؟'],
  ['paint-faq', 'الأسئلة الشائعة'],
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

export default function PaintToolPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['حساب كمية الدهان', 'كم لتر دهان للغرفة'],
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

      <ToolTopAdSlot slotId="top-paint" />
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
          <ToolInArticleAd slotId="mobile-paint" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="paint-guide">
            <h2>كيف تحوّل مساحة الغرفة إلى لترات دهان بدقة؟</h2>
            <p>
              أكثر خطأ يحصل عند حساب كمية الدهان: التفكير بمساحة الأرضية بدل الجدران. غرفة 12 م²
              أرضية قد تحتاج 30 إلى 40 م² دهاناً فعلياً على الجدران حسب الارتفاع — لأن المعادلة
              الصحيحة هي محيط الغرفة (طول + عرض) × 2 × الارتفاع، ثم خصم مساحة الأبواب والنوافذ.
              هذا هو بالضبط ما تحسبه الحاسبة أعلاه تلقائياً بمجرد إدخال الأبعاد.
            </p>

            <PaintCoverageChart />

            <p>
              لاحظ في الرسم أعلاه أن نوع الدهان وحده قد يُضاعف الكمية المطلوبة تقريباً: الدهان
              الداخلي الفاخر يغطي 14 م² باللتر الواحد، بينما الدهان الخارجي العادي يغطي 8 م² فقط —
              أي أنك قد تحتاج 75% دهاناً أكثر لنفس المساحة لو اخترت النوع الخطأ في الحاسبة.
            </p>

            <PlainBlock eyebrow="طبقتان هو المعيار، وليس الاستثناء" title="لا تكتفِ بطبقة واحدة">
              معظم الدهانات تحتاج طبقتين على الأقل لتغطية متجانسة ومنع اللون القديم من الظهور من
              تحتها. الأستر (البريمر) يُحسب بشكل منفصل إذا كنت تبدأ من جدار جديد، أو تنتقل من لون
              داكن إلى فاتح، أو كان الجدار متشققاً أو ماصاً للدهان بشكل غير متساوٍ.
            </PlainBlock>
            <PlainBlock eyebrow="لماذا النتيجة أكبر قليلاً مما تتوقع؟" title="هامش أمان مدمج تلقائياً">
              بقعة تحتاج إصلاحاً، طبقة إضافية في زاوية صعبة، أو قطرات ضائعة أثناء العمل — كلها
              تستهلك من الكمية "النظرية". لهذا تضيف الحاسبة هامش أمان صغيراً تلقائياً على النتيجة
              النهائية، حتى تشتري مرة واحدة ولا تضطر لرحلة ثانية لمطابقة نفس دفعة اللون.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-paint" />

          <section id="paint-faq">
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
            <section id="paint-sources">
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

          <section id="paint-embed">
            <EmbedCodeSnippet
              embedUrl={`${SITE_URL}/embed/calculators/paint`}
              title="حاسبة الدهان"
              hint="هل تدير موقعاً هندسياً أو منتدى؟ أضف حاسبة الدهان إليه مجاناً بنسخ الكود التالي:"
              width={380}
              height={520}
            />
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <PaintCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
