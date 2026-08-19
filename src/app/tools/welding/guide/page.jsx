import Link from 'next/link';

import WeldingCalculator from '@/components/calculators/WeldingCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'welding-guide');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `ما هي أنواع اللحام ${CURRENT_YEAR}؟`,
    answer:
      'أربعة أنواع شائعة: اللحام بالقوس الكهربائي بالأقطاب (SMAW) — الأشيع والأرخص تجهيزاً، مناسب للحديد والمعادن السميكة في الورش والمواقع الخارجية. اللحام بالأرجون (TIG) — الأدق والأنظف، ضروري لحام الألمنيوم والستانلس ستيل. اللحام بغاز CO2 (MIG) — أسرع من الأقطاب للأعمال المتكررة في المصانع وخطوط الإنتاج. لحام النقطة (Spot Welding) — لربط صفائح معدنية رقيقة دون معدن حشو، شائع في تصنيع السيارات والأجهزة.',
  },
  {
    question: 'كيف احسب كمية أقطاب اللحام التي احتاجها؟',
    answer:
      'راجع الصيغة الهندسية الكاملة في قسم "أنواع الأقطاب" أعلاه. عملياً، أسهل طريقة هي استخدام معدل استهلاك تقريبي لكل نوع قطب لكل 100 متر لحام — أدخل طول اللحام الإجمالي ونوع القطب في الحاسبة أعلاه لتحصل على الوزن التقديري مباشرة، مع هامش أمان يُنصح بإضافته للهدر.',
  },
  {
    question: 'ما الفرق بين قطب 6013 وقطب 7018؟',
    answer:
      'قطب 6013 أسهل في الاستخدام وينتج قوساً ألطف، مناسب للمبتدئين والأعمال العامة على الصفائح الرقيقة والمتوسطة. قطب 7018 (منخفض الهيدروجين) ينتج لحاماً أقوى وأكثر متانة، وهو المفضّل للأعمال الإنشائية التي تتحمل أحمالاً حقيقية (الهياكل، الأعمدة، الجسور الصغيرة) رغم أنه يحتاج مهارة أعلى قليلاً في التحكم بالقوس.',
  },
  {
    question: 'كيف اختار التيار المناسب لسمك المعدن؟',
    answer:
      'استخدم القاعدة التقريبية الموضحة في قسم "أنواع الأقطاب" أعلاه كنقطة بداية، ثم اضبط الرقم فعلياً حسب جودة اللحام الناتج على معدنك. مثال موثّق: قطب 3.2 مم من نوع E7018 يعمل عادة بين 75 و125 أمبير حسب عدد التمريرات ووضعية اللحام (أفقي، عمودي، فوق الرأس).',
  },
  {
    question: 'هل يمكن لحام الألمنيوم بنفس طريقة لحام الحديد؟',
    answer:
      'لا — الألمنيوم يحتاج لحام الأرجون (TIG) بتيار متردد (AC) تحديداً، لأن طبقة الأكسيد على سطحه تحتاج كسراً كهربائياً لا يوفره التيار المستمر (DC) المستخدم عادة لحام الحديد بالأقطاب. محاولة لحام الألمنيوم بجهاز أقطاب عادي لن تنجح بجودة مقبولة إطلاقاً.',
  },
  {
    question: 'ما الفرق بين اللحام بالأرجون (TIG) واللحام بـ CO2 (MIG)؟',
    answer:
      'الأرجون (TIG) أبطأ لكن أدق وأنظف، يستخدم قضيب تلحيم منفصل يُغذّى يدوياً، ومثالي للمعادن الرقيقة والدقيقة (ألمنيوم، ستانلس ستيل، أنابيب) حيث تظهر جودة اللحام في الشكل النهائي. MIG (بغاز CO2 أو خليط) يغذّي سلك اللحام تلقائياً من بكرة، أسرع بكثير للأعمال الطويلة المتكررة في الورش والمصانع، لكنه أقل دقة من TIG.',
  },
  {
    question: 'لماذا يستهلك اللحام أقطاباً أكثر من المتوقع؟',
    answer:
      'أسباب شائعة: عدد التمريرات الفعلي أعلى من التقدير الأولي (المعدن السميك يحتاج تمريرات متعددة لا تمريرة واحدة)، هدر أثناء العمل (طرف القطب المتبقي غير القابل للاستخدام)، وإعادة لحام مواضع لم تلتحم جيداً من المحاولة الأولى. أضف دائماً هامش 10-15% فوق الرقم المحسوب في الحاسبة لتغطية هذه العوامل.',
  },
  {
    question: `كم يستغرق لحام متر واحد من الحديد السميك ${CURRENT_YEAR}؟`,
    answer:
      'يختلف كثيراً حسب سمك المعدن ونوع الوصلة وخبرة اللحّام — معدن رقيق بتمريرة واحدة قد يستغرق دقائق قليلة لكل متر، بينما معدن سميك يحتاج تمريرات متعددة (تمهيدية، حشو، تغطية) قد يستغرق ساعة أو أكثر لكل متر. لا يوجد رقم ثابت يصلح للجميع — استخدم زمن التجربة الأولى على قطعة مشابهة كمرجع لتقدير باقي المشروع.',
  },
];

const TOC_ITEMS = [
  ['welding-types', 'أنواع اللحام ومتى تستخدم كل نوع'],
  ['welding-electrodes', 'أنواع الأقطاب: 6013 مقابل 7018'],
  ['welding-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
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

const TYPES_TABLE = [
  { type: 'القوس الكهربائي (SMAW/أقطاب)', use: 'الحديد والمعادن السميكة، ورش ومواقع خارجية', note: 'الأرخص تجهيزاً، الأشيع في السوق' },
  { type: 'الأرجون (TIG)', use: 'الألمنيوم، الستانلس ستيل، الأنابيب الدقيقة', note: 'الأدق والأنظف، أبطأ في التنفيذ' },
  { type: 'CO2 / MIG', use: 'أعمال متكررة وطويلة في المصانع وخطوط الإنتاج', note: 'الأسرع، تغذية سلك تلقائية' },
  { type: 'لحام النقطة (Spot)', use: 'ربط صفائح معدنية رقيقة بدون معدن حشو', note: 'شائع في تصنيع السيارات والأجهزة' },
];

export default function WeldingGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'اللحام', item: `${SITE_URL}/tools/welding` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['أنواع اللحام', 'استهلاك أقطاب اللحام', 'التيار المناسب للحام'],
    keywords: PAGE.keywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-welding-guide" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle.replace('{{year}}', String(CURRENT_YEAR))}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-welding-guide" /></div>

        <article className="tool-v2-lane-article">
          <section id="welding-types">
            <h2>أنواع اللحام ومتى تستخدم كل نوع</h2>
            <p>
              اللحام ليس طريقة واحدة — أربعة أنواع تغطي أغلب الاحتياجات، ولكل منها معدن وموقف
              استخدام يناسبه أكثر من غيره:
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>النوع</th>
                    <th>الاستخدام الأنسب</th>
                    <th>ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {TYPES_TABLE.map((row) => (
                    <tr key={row.type}>
                      <td>{row.type}</td>
                      <td>{row.use}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PlainBlock eyebrow="خطأ شائع" title="لحام الألمنيوم بجهاز الحديد العادي">
              الألمنيوم يحتاج تياراً متردداً (AC) عبر جهاز أرجون تحديداً — طبقة الأكسيد الطبيعية على
              سطحه لا تُكسر بالتيار المستمر (DC) المستخدم في لحام الحديد بالأقطاب العادية، مهما
              كانت مهارة اللحّام.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-welding-guide-1" />

          <section id="welding-electrodes">
            <h2>أنواع الأقطاب: 6013 مقابل 7018</h2>
            <p>
              القطبان الأكثر شيوعاً في السوق، ولكل منهما مجال استخدام مختلف. قطب 6013 أسهل تحكماً
              وأنسب للمبتدئين والأعمال العامة، بينما قطب 7018 (منخفض الهيدروجين) ينتج لحاماً أقوى
              مناسباً للأعمال الإنشائية الحقيقية التي تتحمل أحمالاً — لكنه يحتاج مهارة أعلى قليلاً.
            </p>
            <PlainBlock eyebrow="قبل شراء كمية كبيرة" title="احسب الكمية الفعلية أولاً">
              معدل الاستهلاك يختلف بين نوعي القطب (7018 يستهلك أكثر من 6013 لكل متر لحام تقريباً) —
              استخدم الحاسبة على يمين الصفحة لمعرفة الوزن التقريبي قبل شراء علب أكثر مما تحتاج أو
              أقل مما يكفي المشروع.
            </PlainBlock>
            <FormulaCard
              label="الصيغة الهندسية الأساسية لحساب وزن معدن اللحام المطلوب:"
              note="عملياً، أسهل طريقة هي استخدام معدل استهلاك تقريبي لكل نوع قطب لكل 100 متر لحام — الحاسبة أعلاه تفعل هذا تلقائياً بدل الحساب اليدوي."
            >
              <span>وزن معدن اللحام (كجم) = طول اللحام × مساحة مقطع اللحام × كثافة المعدن</span>
            </FormulaCard>
            <FormulaCard
              label="قاعدة تقريبية شائعة لاختيار التيار المناسب حسب قطر القطب:"
              note="استخدمها كنقطة بداية فقط، ثم اضبط الرقم فعلياً حسب جودة اللحام الناتج على معدنك."
            >
              <span>التيار (أمبير) ≈ قطر القطب (مم) × 40</span>
            </FormulaCard>
          </section>

          <section id="welding-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {FAQ_ITEMS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="welding-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.machinemfg.com/welding-rod-consumption/" target="_blank" rel="noreferrer">MachineMFG — Welding Rod Consumption Calculation Guide</a> — مصدر معدلات استهلاك الأقطاب (E6010، E7018).</li>
              <li><a href="https://www.kobelco-welding.jp/education-center/references/references01.html" target="_blank" rel="noreferrer">Kobelco Welding — Calculation of Welding Consumables Consumption</a> — مصدر صيغة وزن معدن اللحام.</li>
              <li><a href="https://weldyard.com/%D9%83%D9%8A%D9%81%D9%8A%D8%A9-%D8%A3%D8%AE%D8%AA%D9%8A%D8%A7%D8%B1-%D8%B3%D9%84%D9%83-%D8%A7%D9%84%D9%84%D8%AD%D8%A7%D9%85-%D8%A7%D9%84%D9%85%D9%86%D8%A7%D8%B3%D8%A8-%D9%84%D8%A3%D8%B9%D9%85%D8%A7" target="_blank" rel="noreferrer">Weld Yard — كيفية اختيار سلك اللحام المناسب</a> — مصدر مبدأ اختيار قطر القطب حسب سمك المعدن.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><WeldingCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/welding">
                <span>كل أدوات اللحام</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
