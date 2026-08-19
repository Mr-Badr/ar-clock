import Link from 'next/link';
import { Flower, GridFour, Sparkle, TreePalm } from '@phosphor-icons/react/ssr';

import GardenCostCalculator from '@/components/calculators/GardenCostCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'landscaping-garden-cost');
const CONTENT = getLandscapingPageContent('garden-cost');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: CONTENT.faqItems });

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['landscaping-artificial-grass', 'landscaping-plant-picker', 'landscaping-quote-generator']);

const TOC_ITEMS = [
  ['garden-cost-guide', 'ما الذي يحدد تكلفة تنسيق حديقتك فعلياً؟'],
  ['garden-cost-faq', 'الأسئلة الشائعة'],
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

// Same FLOOR_TYPES used by GardenCostCalculator.client.jsx.
const FLOOR_TYPES_PREVIEW = [
  { label: 'عشب طبيعي', desc: 'أرخص تركيباً، يحتاج صيانة وري دوريين.', icon: Flower, color: 'green' },
  { label: 'عشب صناعي', desc: 'أعلى تكلفة أولى، صفر صيانة دورية تقريباً.', icon: GridFour, color: 'blue' },
  { label: 'حصى وزينة حجرية', desc: 'مناسب للممرات والمساحات الجافة قليلة الري.', icon: Sparkle, color: 'amber' },
  { label: 'مختلط', desc: 'مزيج من عشب وحصى ونباتات حسب المناطق.', icon: TreePalm, color: 'green' },
];

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

export default function GardenCostCalculatorPage() {
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
  const softwareSchema = buildFreeToolPageSchema({ siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description, about: ['كم تكلفة تنسيق حديقة', 'حاسبة تكلفة تنسيق حديقة'], keywords: SEARCH_COVERAGE.metadataKeywords });
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-garden-cost" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-garden-cost" /></div>

        <article className="tool-v2-lane-article">
          <section id="garden-cost-guide">
            <h2>ما الذي يحدد تكلفة تنسيق حديقتك فعلياً؟</h2>
            <p>
              ثلاثة عوامل تحرّك السعر أكثر من أي شيء آخر: <strong>نوع الأرضية</strong> (العشب
              الصناعي أعلى تركيباً من الطبيعي لكن بلا صيانة دورية)، <strong>مستوى التصميم</strong>
              (فرق كبير بين تنسيق أساسي وتصميم متكامل بعناصر ديكور)، و<strong>الإضافات
              الاختيارية</strong> (ري، إضاءة، عناصر مائية) التي تُحسب كل واحدة على حدة في الحاسبة
              أعلاه بدل إخفائها داخل رقم واحد.
            </p>
            <div className="tool-v2-info-grid">
              {FLOOR_TYPES_PREVIEW.map((t) => {
                const Icon = t.icon;
                return (
                  <div className="tool-v2-info-card" key={t.label}>
                    <span
                      aria-hidden="true"
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '2rem', height: '2rem', borderRadius: '999px', marginBottom: '8px',
                        background: `var(--${t.color}-subtle)`, color: `var(--${t.color}-text)`,
                      }}
                    >
                      <Icon size={16} weight="bold" />
                    </span>
                    <h3>{t.label}</h3>
                    <p>{t.desc}</p>
                  </div>
                );
              })}
            </div>
            <PlainBlock eyebrow="أكبر خطأ عند طلب عروض أسعار" title="اطلب دائماً تفصيل البنود">
              مقارنة رقمين إجماليين من شركتين مختلفتين بلا معرفة ما يشملانه مضللة تماماً — شركة قد
              تدرج الري والإضاءة ضمن سعرها والأخرى لا. استخدم تفصيل البنود في نتيجة الحاسبة أعلاه
              كمرجع عادل للمقارنة.
            </PlainBlock>
            <PlainBlock eyebrow="لماذا الحديقة المتوسطة قد تتضاعف تكلفتها بسهولة" title="العناصر الإضافية تراكمية">
              إضافة ري بالتنقيط وإضاءة ونافورة صغيرة معاً على حديقة متوسطة الحجم قد تضيف مبلغاً
              يقارب تكلفة الأرضية الأساسية نفسها — فعّل الإضافات في الحاسبة أعلاه واحدة تلو الأخرى
              لترى تأثير كل عنصر بوضوح قبل الالتزام به.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-garden-cost" />

          <section id="garden-cost-faq">
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
            <section id="garden-cost-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><GardenCostCalculator /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في تنسيق الحدائق" />
        </div>
      </div>
    </main>
  );
}
