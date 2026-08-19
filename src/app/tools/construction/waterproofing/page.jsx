import Link from 'next/link';

import { Drop, ShieldCheck, SquaresFour } from '@phosphor-icons/react/ssr';

import WaterproofingCalculator from '@/components/calculators/WaterproofingCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'construction-waterproofing');
const CONTENT = getConstructionPageContent('waterproofing');
const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: CONTENT.faqItems });

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['building-paint', 'tiles', 'cement']);

const TOC_ITEMS = [
  ['wp-guide', 'لماذا "كمية مواد" لا "سعر" هو السؤال الصحيح'],
  ['wp-faq', 'الأسئلة الشائعة'],
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

// Same INSULATION_TYPES used by WaterproofingCalculator.client.jsx — shown as a quick visual
// overview of the three material types before the reader opens the calculator.
const INSULATION_TYPES_PREVIEW = [
  { label: 'عزل مائي سائل / دهان', desc: 'يُطبَّق بالفرشاة أو الرول على طبقتين غالباً.', icon: Drop, color: 'blue' },
  { label: 'لفائف عزل بيتومينية', desc: 'لفائف جاهزة تُلحم أو تُلصق بالحرارة.', icon: SquaresFour, color: 'amber' },
  { label: 'رغوة بولي يوريثان مرشوشة', desc: 'تُرش بمعدات متخصصة، السماكة تحدد كفاءة العزل الحراري.', icon: ShieldCheck, color: 'green' },
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

export default function WaterproofingToolPage() {
  const faqItems = CONTENT.faqItems;
  const sources = CONTENT.sources;

  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({ siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description, about: ['كمية مواد عزل الأسطح', 'عزل الاسطح'], keywords: SEARCH_COVERAGE.metadataKeywords });
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-waterproofing" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-waterproofing" /></div>

        <article className="tool-v2-lane-article">
          <section id="wp-guide">
            <h2>لماذا &quot;كمية مواد&quot; لا &quot;سعر&quot; هو السؤال الصحيح</h2>
            <p>
              كثير من "حاسبات تكلفة العزل" المنتشرة أونلاين مملوكة فعلياً لشركات عزل تستخدمها
              كأداة لجمع بيانات تواصلك، لا لإعطائك رقماً حقيقياً محسوباً — النتيجة غالباً سعر عام
              ثم طلب رقم واتساب لإرسال عرض لاحقاً. هذه الأداة مختلفة: تعطيك كمية المواد الفعلية
              (لترات، لفائف، أو أطقم) التي تحتاجها، لتشتريها أو تقارنها بعروض موردين حقيقيين
              بنفسك، لا سعراً وهمياً بلا معاينة.
            </p>
            <div className="tool-v2-info-grid">
              {INSULATION_TYPES_PREVIEW.map((t) => {
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
            <PlainBlock eyebrow="اختر النوع المناسب لسطحك" title="ثلاثة أنواع، ثلاث رياضيات مختلفة">
              العزل السائل يُحسب باللتر حسب معدل التغطية وعدد الطبقات. اللفائف البيتومينية تُحسب
              بعدد اللفائف حسب مساحة اللفة الواحدة ونسبة التراكب. الرغوة المرشوشة تُحسب بعدد
              الأطقم حسب السماكة المطلوبة وتغطية الطقم الواحد — اختر نوعك في الحاسبة أعلاه لتظهر
              الحقول الصحيحة له تلقائياً.
            </PlainBlock>
            <PlainBlock eyebrow="لا تعرف معدل تغطية منتجك بالضبط؟" title="راجع نشرة بيانات المنتج">
              معدلات التغطية الافتراضية في الحاسبة أعلاه نقطة بداية معقولة، لكن كل منتج فعلي له
              نشرة بيانات فنية (Technical Data Sheet) تذكر معدل التغطية الدقيق له — استخدم هذا
              الرقم بدل الافتراضي كلما توفر لديك لنتيجة أدق.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-waterproofing" />

          <section id="wp-faq">
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
            <section id="wp-sources">
              <h2>مصادر</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><WaterproofingCalculator /></div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في حاسبات البناء" />
        </div>
      </div>
    </main>
  );
}
