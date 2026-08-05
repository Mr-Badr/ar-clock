import Link from 'next/link';

import DripIrrigationCalculator from '@/components/calculators/DripIrrigationCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-drip-irrigation');
const CONTENT = getLandscapingPageContent('drip-irrigation');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: CONTENT.faqItems });

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['landscaping-garden-cost', 'landscaping-plant-picker', 'landscaping-maintenance-tracker']);

const TOC_ITEMS = [
  ['drip-guide', 'لماذا الري بالتنقيط أوفر في مناخ الخليج'],
  ['drip-faq', 'الأسئلة الشائعة'],
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

export default function DripIrrigationCalculatorPage() {
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
  const softwareSchema = buildFreeToolPageSchema({ siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description, about: ['ري بالتنقيط حاسبة', 'نظام ري اوتوماتيكي للحديقة'], keywords: SEARCH_COVERAGE.metadataKeywords });
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-drip-irrigation" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-drip-irrigation" /></div>

        <article className="tool-v2-lane-article">
          <section id="drip-guide">
            <h2>لماذا الري بالتنقيط أوفر في مناخ الخليج</h2>
            <p>
              الري السطحي التقليدي يفقد جزءاً كبيراً من الماء بالتبخر قبل وصوله فعلياً لجذور
              النبات، خصوصاً في حرارة الظهيرة الخليجية. الري بالتنقيط يوصل الماء مباشرة عند منطقة
              الجذر بمعدل بطيء ومستمر، ما يقلل الهدر بشكل كبير ويقلل عدد مرات الري اليدوي المطلوبة
              أسبوعياً.
            </p>
            <PlainBlock eyebrow="لا تعرف معدل تصرف نقّاطاتك الفعلي؟" title="تحقق من عبوة المنتج">
              النقّاطات التجارية مطبوع عليها معدل التصرف بالساعة (لتر/ساعة) عادة على العبوة أو
              النقّاطة نفسها — استخدم هذا الرقم في الحاسبة أعلاه بدل الاعتماد على القيمة الافتراضية
              وحدها للحصول على نتيجة دقيقة لنظامك الفعلي.
            </PlainBlock>
            <PlainBlock eyebrow="أفضل وقت لتشغيل الري بالتنقيط" title="الفجر أو بعد الغروب">
              التشغيل في ساعات الصباح الباكر أو بعد غروب الشمس يقلل التبخر الإضافي أثناء الري نفسه
              مقارنة بالتشغيل في ذروة حرارة النهار، ما يزيد كفاءة استخدام كل قطرة ماء تصل للتربة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-drip-irrigation" />

          <section id="drip-faq">
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
            <section id="drip-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><DripIrrigationCalculator /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في تنسيق الحدائق" />
        </div>
      </div>
    </main>
  );
}
