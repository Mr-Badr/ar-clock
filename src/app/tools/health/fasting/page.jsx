import '@/app/tools/tools-v2.css';
import FastingWindowCalculator from '@/components/calculators/FastingWindowCalculatorLoader.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'fasting');
const CONTENT = getFinancePageContent('fasting');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const PROTOCOL_TABLE = [
  { id: '16:8', fast: '16', eat: '8', autophagy: '14–16 ساعة', bestFor: 'الوزن والصحة العامة' },
  { id: '18:6', fast: '18', eat: '6', autophagy: '16–18 ساعة', bestFor: 'تعزيز الالتهام الذاتي' },
  { id: '20:4', fast: '20', eat: '4', autophagy: '18+ ساعة', bestFor: 'حرق الدهون العميق' },
  { id: 'OMAD', fast: '23', eat: '1', autophagy: 'ذروة الالتهام', bestFor: 'التجديد الخلوي الكامل' },
  { id: '5:2', fast: 'يومان/أسبوع', eat: 'مرن', autophagy: 'متذبذب', bestFor: 'المرونة في الجدول' },
];

const TOC_ITEMS = [
  ['fasting-protocols', 'مقارنة البروتوكولات'],
  ['fasting-ramadan', 'رمضان والصيام المتقطع'],
  ['fasting-autophagy', 'الالتهام الذاتي'],
  ['fasting-faq', 'الأسئلة الشائعة'],
];

export default function FastingPage() {
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

      <ToolTopAdSlot slotId="top-fasting" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-fasting" /></div>

        <article className="tool-v2-lane-article">
          <section id="fasting-protocols">
            <h2>أيّ بروتوكول صيام يناسبك؟</h2>
            <p>جدول مقارنة كامل للبروتوكولات الخمسة — من الأسهل إلى الأكثر تأثيراً.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>البروتوكول</th><th>صيام</th><th>أكل</th><th>للالتهام الذاتي</th><th>الأمثل لـ</th></tr></thead>
                <tbody>
                  {PROTOCOL_TABLE.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.fast} {p.fast.includes('يوم') ? '' : 'ساعة'}</td>
                      <td>{p.eat} {p.eat === 'مرن' ? '' : 'ساعة'}</td>
                      <td>{p.autophagy}</td>
                      <td>{p.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-fasting" />

          <section id="fasting-ramadan">
            <h2>كيف يختلف صيام رمضان عن الصيام المتقطع الصحي؟</h2>
            <p>
              رمضان هو صيام جاف (دون ماء أو طعام) من الفجر حتى المغرب — وفي الخليج يمتد في فصل الصيف من 15 إلى 18
              ساعة يومياً. هذه المدة تتجاوز بروتوكول 16:8 الشائع وتقترب من 18:6، مما يعني أن المسلمين يمارسون أحد
              أشكال الصيام المتقطع الأكثر صحيةً تلقائياً طوال شهر كامل.
            </p>
            <div className="tool-v2-plain-block">
              <h3>الفارق الجوهري</h3>
              <p>في الصيام المتقطع الصحي تُسمح المشروبات الصفرية السعرات (ماء، قهوة سوداء، شاي بدون سكر)، وهذه تساعد على كبح الجوع وتحافظ على الالتهام الذاتي. رمضان هو صيام جاف لا يُسمح فيه بذلك — مما يجعله أكثر شدةً صحياً.</p>
            </div>
            <div className="tool-v2-plain-block">
              <h3>أفضل استراتيجية</h3>
              <p>استخدم الأسابيع الثلاثة الأولى بعد رمضان للانتقال تدريجياً إلى 16:8. سيساعدك التكيّف من رمضان على تحمّل فترة الجوع بسهولة.</p>
            </div>
          </section>

          <section id="fasting-autophagy">
            <h2>ما هو الالتهام الذاتي ولماذا يهمك؟</h2>
            <p>
              الالتهام الذاتي (Autophagy) اكتشاف حصل على جائزة نوبل 2016 — هو عملية تنظيف خلوي طبيعية تقوم فيها
              الخلايا بتفكيك البروتينات التالفة والمكونات المعطوبة وإعادة تدويرها. فكّر فيه كـ"إعادة تدوير النفايات
              الداخلية".
            </p>
            <p>
              يبدأ التفعيل بعد 12–14 ساعة من الصيام، ويصل ذروته بعد 24–48 ساعة. الأبحاث تربطه بتباطؤ الشيخوخة، تقليل
              مخاطر السرطان، وتحسين وظائف الدماغ. هذا ما يجعل الصيام المتقطع أكثر من مجرد تقليل للسعرات — إنه إعادة
              برمجة خلوية.
            </p>
          </section>

          <section id="fasting-faq">
            <h2>أسئلة عن الصيام المتقطع والبروتوكولات</h2>
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
            <section id="fasting-sources">
              <h2>مصادر</h2>
              <ul>{CONTENT.sources.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
            </section>
          )}
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><FastingWindowCalculator /></div>
        </div>
      </div>
    </main>
  );
}
