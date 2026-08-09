import Link from 'next/link';

import '@/app/tools/tools-v2.css';
import OvulationCalculator from '@/components/calculators/OvulationCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'ovulation');
const CONTENT = getFinancePageContent('ovulation');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const CYCLE_OVULATION_ROWS = [
  [21, 7, '2–7', 'اليوم 21'],
  [25, 11, '6–11', 'اليوم 25'],
  [28, 14, '9–14', 'اليوم 28'],
  [30, 16, '11–16', 'اليوم 30'],
  [32, 18, '13–18', 'اليوم 32'],
  [35, 21, '16–21', 'اليوم 35'],
];
const OVULATION_EXPLAINER = [
  { title: 'المرحلة الأصفرية — ثابتة 14 يوماً', desc: 'التبويض = طول الدورة − 14', text: 'المرحلة الأصفرية (Luteal Phase) هي الفترة بين التبويض ونزول الدورة التالية. تثبت تقريباً عند 14 يوماً لمعظم النساء. لذا إذا كانت دورتك 30 يوماً فالتبويض في اليوم 16، وإذا 28 يوماً ففي اليوم 14. هذا هو أساس حساب الحاسبة.' },
  { title: 'الفترة الخصبة — 6 أيام في الشهر', desc: '5 أيام قبل التبويض + يوم التبويض', text: 'الحيوانات المنوية تعيش 3–5 أيام في الرحم، لذا الإخصاب ممكن حتى إذا حدث الجماع قبل التبويض. البويضة تبقى صالحة فقط 12–24 ساعة بعد التبويض. بمعنى أن أفضل فرص الحمل هي في آخر يومين قبل التبويض ويوم التبويض نفسه.' },
  { title: 'الهجري — موعد التبويض بالتقويمين', desc: 'التاريخ الهجري المقابل تلقائياً', text: 'هذه الحاسبة تعطي موعد التبويض والفترة الخصبة بالميلادي والهجري — مفيد للنساء اللواتي يتابعن مواعيدهن بالتقويم الهجري في الخليج وسائر الدول العربية. معظم الأدوات المنافسة تعطي الميلادي فقط.' },
  { title: 'تأكيد التبويض — ما وراء الحاسبة', desc: 'اختبار LH أدق من أي حاسبة', text: 'الحاسبة تعطي تقديراً بناءً على طول الدورة. للتأكيد الفعلي: استخدمي اختبار LH (Luteinizing Hormone) من الصيدلية — يرصد الموجة الهرمونية قبل 24–36 ساعة من التبويض. أو قيسي درجة حرارة الجسم الأساسية كل صباح — ترتفع 0.2–0.5 درجة بعد التبويض مباشرة.' },
];

const TOC_ITEMS = [
  ['ovulation-method', 'كيف تعمل الحاسبة'],
  ['ovulation-table', 'جدول التبويض'],
  ['ovulation-links', 'أدوات مرتبطة'],
  ['ovulation-faq', 'الأسئلة الشائعة'],
];

export default function OvulationPage() {
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

      <ToolTopAdSlot slotId="top-ovulation" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-ovulation" /></div>

        <article className="tool-v2-lane-article">
          <section id="ovulation-method">
            <h2>المرحلة الأصفرية وقاعدة الـ14 يوماً</h2>
            <p>قاعدة واحدة تحكم التبويض في أغلب الدورات — والحاسبة تطبقها مع ضبط طول الدورة للدقة الأعلى.</p>
            <div className="tool-v2-info-grid">
              {OVULATION_EXPLAINER.map((item) => (
                <div className="tool-v2-info-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <div className="tool-v2-info-desc">{item.desc}</div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <ToolInArticleAd slotId="mid-ovulation" />

          <section id="ovulation-table">
            <h2>يوم التبويض والفترة الخصبة حسب طول الدورة</h2>
            <p>جدول مرجعي سريع — ابحثي عن طول دورتك لمعرفة يوم التبويض المتوقع بدون الحاجة للإدخال.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>طول الدورة</th><th>يوم التبويض المتوقع</th><th>الأيام الخصبة</th><th>الدورة التالية</th></tr></thead>
                <tbody>
                  {CYCLE_OVULATION_ROWS.map((row) => (
                    <tr key={row[0]}>
                      <td>{row[0]} يوم</td>
                      <td>اليوم {row[1]}</td>
                      <td>الأيام {row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="tool-v2-option-hint">* الأيام تُحسب من أول يوم في الدورة الشهرية.</p>
          </section>

          <section id="ovulation-links">
            <h2>بعد معرفة موعد التبويض — ما التالي؟</h2>
            <p>انتقلي بين أدواتنا الصحية لتكتمل الصورة.</p>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {['pregnancy', 'date-add-subtract'].map((slug) => {
                const tool = CALCULATOR_ROUTES.find((item) => item.slug === slug);
                if (!tool) return null;
                return (
                  <Link key={slug} href={tool.href}>
                    <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                    {tool.shortLabel || tool.title}
                  </Link>
                );
              })}
              <a href="https://www.who.int/ar" target="_blank" rel="noopener noreferrer">
                <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                منظمة الصحة العالمية — الصحة الإنجابية
              </a>
            </nav>
          </section>

          <section id="ovulation-faq">
            <h2>أسئلة عن التبويض والخصوبة</h2>
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
            <section id="ovulation-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><OvulationCalculator /></div>
        </div>
      </div>
    </main>
  );
}
