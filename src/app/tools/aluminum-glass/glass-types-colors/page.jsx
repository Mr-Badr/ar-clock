import Link from 'next/link';
import { AppWindow } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'aluminum-glass-types-colors');

const TOC_ITEMS = [
  ['types', 'أنواع الزجاج الأساسية'],
  ['securit', 'السيكوريت (المقسّى)'],
  ['double-glazing', 'الدبل جلاس'],
  ['colors', 'ألوان الزجاج العاكس'],
  ['aluminum-vs-upvc', 'الألومنيوم أم UPVC؟'],
  ['comparison', 'جدول مقارنة سريع'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const GLASS_TYPES = [
  {
    title: 'الزجاج العادي (السنجل)',
    facts: [
      'طبقة واحدة بسماكة شائعة 4-6 مم',
      'الأقل تكلفة بين كل الأنواع',
      'ينكسر لقطع كبيرة حادة الحواف',
      'مناسب لأماكن داخلية منخفضة المخاطر فقط',
    ],
  },
  {
    title: 'السيكوريت (المقسّى)',
    facts: [
      'معالجة حرارية تزيد الصلابة عدة أضعاف الزجاج العادي',
      'ينكسر لحبيبات صغيرة دائرية الحواف، أكثر أماناً',
      'يقاوم الإجهاد الحراري المفاجئ',
      'إلزامي غالباً لكبائن الشاور والأبواب الزجاجية',
    ],
  },
  {
    title: 'الدبل جلاس (المزدوج)',
    facts: [
      'طبقتان زجاج يفصل بينهما هواء أو غاز عازل',
      'يقلل انتقال الحرارة والصوت والغبار بشكل ملحوظ',
      'الأنسب للواجهات المعرّضة للشمس المباشرة',
      'تكلفة أعلى من الزجاج العادي والسيكوريت المفرد',
    ],
  },
  {
    title: 'الزجاج اللامينيت (المصفّح)',
    facts: [
      'طبقة بلاستيكية شفافة بين طبقتي زجاج',
      'يبقى متماسكاً عند الكسر بدل التطاير',
      'مقاومة أعلى للاختراق والضوضاء الخارجية',
      'يُستخدم غالباً في الواجهات الأمنية والطوابق الأرضية',
    ],
  },
];

const COLOR_SWATCHES = [
  { name: 'أسود عاكس', hex: '#1c1f24', use: 'واجهات مودرن، يخفي الرؤية من الخارج نهاراً' },
  { name: 'بني (برونزي)', hex: '#5b3a29', use: 'يقلل الوهج، شائع في الفلل والمكاتب' },
  { name: 'أزرق', hex: '#1f4e66', use: 'مظهر بارد، يقلل امتصاص الحرارة نسبياً' },
  { name: 'عسلي', hex: '#8a5a1e', use: 'الأكثر طلباً في الخليج، يوازن الإضاءة والحرارة' },
  { name: 'رمادي', hex: '#5a5f66', use: 'يقلل السطوع دون تغيير لون الديكور الداخلي كثيراً' },
  { name: 'فضي (مرآة)', hex: '#9aa3ab', use: 'انعكاس عالٍ، خصوصية أكبر للواجهات المطلة على الشارع' },
  { name: 'ثلجي (مصنفر)', hex: '#e7edf0', use: 'خصوصية مع مرور ضوء ناعم — حمامات ونوافذ داخلية' },
  { name: 'شفاف عادي', hex: '#dce8e8', use: 'أقصى إضاءة طبيعية، بلا تأثير على درجة الحرارة' },
];

const COMPARISON_ROWS = [
  ['الزجاج العادي', 'ضعيفة', 'منخفضة — قطع حادة', '$', 'نوافذ داخلية منخفضة المخاطر'],
  ['السيكوريت', 'عالية (عدة أضعاف العادي)', 'عالية — حبيبات آمنة', '$$', 'أبواب، كبائن شاور، واجهات'],
  ['الدبل جلاس', 'متوسطة إلى عالية', 'متوسطة', '$$$', 'واجهات مشمسة، عزل حراري وصوتي'],
  ['اللامينيت', 'عالية', 'عالية جداً — لا يتطاير', '$$$', 'أمان، طوابق أرضية، مناطق ضوضاء'],
];

const FAQ_ITEMS = [
  {
    question: 'ما الفرق الحقيقي بين الزجاج العادي والسيكوريت؟',
    answer:
      'السيكوريت يمر بمعالجة حرارية تزيد صلابته عدة أضعاف الزجاج العادي، والأهم أنه عند الكسر ينتج حبيبات صغيرة دائرية الحواف بدل قطع كبيرة حادة — لهذا يُشترط غالباً في كبائن الشاور والأبواب والواجهات المعرّضة للاصطدام.',
  },
  {
    question: 'هل الدبل جلاس يستحق فرق السعر فعلاً؟',
    answer:
      'في الواجهات المعرّضة لشمس مباشرة أو غرف قريبة من الشارع، الدبل جلاس يقلل انتقال الحرارة والصوت بشكل يُلاحظ فعلياً في فاتورة التكييف وراحة الغرفة — أما في نوافذ داخلية أو غرف مظللة فالفرق أقل وضوحاً، فقد لا يستحق التكلفة الإضافية هناك.',
  },
  {
    question: 'أي لون زجاج عاكس هو الأكثر طلباً في الخليج؟',
    answer:
      'العسلي والبرونزي (البني) هما الأكثر شيوعاً لأنهما يوازنان بين تقليل الوهج والحفاظ على إضاءة داخلية مريحة دون تغميق المكان بشكل مبالغ فيه، يليهما الرمادي للواجهات التي تريد مظهراً محايداً.',
  },
  {
    question: 'هل الزجاج العاكس يقلل الحرارة داخل المنزل؟',
    answer:
      'يقلل جزءاً من الوهج والإشعاع المباشر مقارنة بالزجاج الشفاف العادي، لكنه ليس بديلاً عن الدبل جلاس أو العزل الحراري الحقيقي — أفضل نتيجة تأتي من الجمع بين لون عاكس وتقنية دبل جلاس معاً في الواجهات الأكثر تعرضاً للشمس.',
  },
  {
    question: 'الألومنيوم أم إطارات UPVC — أيهما أفضل للشبابيك؟',
    answer:
      'الألومنيوم أخف وزناً ويتحمل مساحات وارتفاعات أكبر بإطار أرفع، وهو الخيار الأشيع تجارياً وللواجهات الكبيرة. UPVC عازل حراري وصوتي أفضل بطبيعته لكنه أثقل ويحتاج إطاراً أعرض قليلاً — الأنسب للشقق السكنية التي تريد عزلاً أعلى بميزانية مضبوطة.',
  },
  {
    question: 'كم سماكة الزجاج المناسبة لشباك كبير؟',
    answer:
      'كلما كبرت مساحة اللوح الواحد زادت الحاجة لسماكة أعلى أو تقسيم الشباك لألواح أصغر — السماكات الشائعة تبدأ من 4 مم للألواح الصغيرة وتصل إلى 8-10 مم أو دبل جلاس للواجهات الكبيرة، والقرار النهائي يعتمد على مقاس الفتحة الفعلي وتوصية الفني المُنفّذ.',
  },
  {
    question: 'هل يمكن تركيب زجاج ملون في نفس إطار الألومنيوم العادي؟',
    answer:
      'نعم، اللون خاصية في الزجاج نفسه (طلاء أو صبغة أثناء التصنيع) ولا علاقة له بنوع الإطار — يمكن تركيب أي لون زجاج عاكس أو مصنفر في إطار ألومنيوم أو UPVC عادي بلا فرق في طريقة التركيب.',
  },
];

export default function GlassTypesColorsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الألومنيوم والزجاج', item: `${SITE_URL}/tools/aluminum-glass` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'Article', headline: PAGE.heroTitle, description: PAGE.description,
    inLanguage: 'ar', mainEntityOfPage: `${SITE_URL}${PAGE.href}`, keywords: PAGE.keywords, isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: 'ميقاتنا', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 } },
  };
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-aluminum-glass-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل الألومنيوم والزجاج — أنواع وألوان</span>
              <h1>{PAGE.title}</h1>
              <p className="guide-v2-lead">
                قبل اختيار زجاج الشبابيك أو الأبواب، ثلاثة قرارات تحدد النتيجة: أي نوع زجاج
                يناسب الاستخدام (عادي، سيكوريت، دبل جلاس، لامينيت)، أي لون عاكس يوازن بين
                الإضاءة والخصوصية، وهل الإطار المناسب ألومنيوم أم UPVC.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><AppWindow size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أبواب وكبائن شاور ومناطق يكثر فيها الاحتكاك؟ اختر السيكوريت لأمانه عند الكسر.
                  واجهة مشمسة أو غرفة قريبة من الشارع؟ الدبل جلاس يستحق فرق السعر. أما اللون
                  فاختياري بالكامل — العسلي والبرونزي هما الأكثر توازناً للمناخ الخليجي.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="types">
                <h2>أنواع الزجاج الأساسية</h2>
                <p>
                  كل نوع زجاج مصمم لموقف مختلف — المعرفة السريعة بالفروقات توفر عليك تركيب النوع
                  الخطأ في مكان يحتاج أماناً أعلى.
                </p>
                <div className="guide-v2-type-grid">
                  {GLASS_TYPES.map((type) => (
                    <div className="guide-v2-type-card" key={type.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--blue-subtle)', color: 'var(--blue-text)' }}>
                          <AppWindow size={16} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{type.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        {type.facts.map((fact) => (<li key={fact}>{fact}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-aluminum-glass-guide" />

              <section id="securit">
                <h2>السيكوريت (المقسّى) — لماذا يُشترط في أماكن كثيرة؟</h2>
                <p>
                  يمر السيكوريت بمعالجة حرارية تزيد صلابته عدة أضعاف مقارنة بالزجاج العادي بنفس
                  السماكة، ويقاوم الإجهاد الحراري المفاجئ (مثل فرق الحرارة الحاد بين الداخل
                  والخارج) بشكل أفضل بكثير. الفرق الأهم عملياً عند الكسر: الزجاج العادي ينكسر
                  لقطع كبيرة حادة الحواف تسبب جروحاً خطيرة، بينما السيكوريت يتفتت لحبيبات صغيرة
                  دائرية الحواف — لهذا يُشترط غالباً في كبائن الشاور والأبواب الزجاجية والواجهات
                  المعرّضة للاصطدام أو الأطفال.
                </p>
              </section>

              <section id="double-glazing">
                <h2>الدبل جلاس — العزل الحراري والصوتي</h2>
                <p>
                  الدبل جلاس عبارة عن طبقتين من الزجاج يفصل بينهما فراغ هواء أو غاز عازل (الأرجون
                  شائع لعزل أقوى من الهواء العادي)، ما يقلل انتقال الحرارة والصوت والغبار بشكل
                  ملحوظ مقارنة بلوح زجاج مفرد. النسخ المتقدمة تضيف طلاء Low-E (منخفض الانبعاث)
                  يعكس جزءاً من الإشعاع الحراري قبل دخوله، أو تجمع بين الدبل جلاس والزجاج
                  اللامينيت (تُسمى أحياناً تربلكس) للحصول على عزل وأمان معاً في نفس اللوح. الفرق
                  يظهر أوضح في الواجهات المشمسة مباشرة أو الغرف القريبة من الشارع، حيث ينعكس على
                  راحة الغرفة وحمل التكييف بشكل يُلاحظ فعلياً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid2-aluminum-glass-guide" />

              <section id="colors">
                <h2>ألوان الزجاج العاكس — أيها يناسب واجهتك؟</h2>
                <p>
                  اللون خاصية في الزجاج نفسه (صبغة أو طلاء أثناء التصنيع) ولا يغيّر نوعه أو
                  قوته — يمكن الجمع بين أي لون وأي نوع (سيكوريت ملون، دبل جلاس ملون، إلخ). كل
                  لون له طابع بصري ووظيفي مختلف قليلاً:
                </p>
                <div className="guide-v2-swatch-grid">
                  {COLOR_SWATCHES.map((c) => (
                    <div className="guide-v2-swatch-card" key={c.name}>
                      <div className="guide-v2-swatch-chip" style={{ background: c.hex }} aria-hidden="true" />
                      <p className="guide-v2-swatch-name">{c.name}</p>
                      <p className="guide-v2-swatch-use">{c.use}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="aluminum-vs-upvc">
                <h2>الألومنيوم أم UPVC — أي إطار تختار؟</h2>
                <p>
                  الألومنيوم أخف وزناً ويتحمل فتحات ومساحات أكبر بإطار أرفع نسبياً، وهو الخيار
                  الأشيع للواجهات الكبيرة والمباني التجارية. إطارات UPVC أثقل وتحتاج عرضاً أكبر
                  قليلاً، لكنها عازلة حرارياً وصوتياً بطبيعة المادة نفسها دون حاجة لمعالجة إضافية
                  — خيار جيد للشقق السكنية التي تريد عزلاً أعلى دون تكلفة الألومنيوم الحراري
                  المعالج (Thermal Break).
                </p>
              </section>

              <section id="comparison">
                <h2>جدول مقارنة سريع</h2>
                <div className="guide-v2-table-wrap">
                  <table className="guide-v2-table">
                    <thead>
                      <tr><th>النوع</th><th>القوة</th><th>الأمان عند الكسر</th><th>مستوى السعر</th><th>الأنسب لـ</th></tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map((row) => (
                        <tr key={row[0]}>{row.map((cell, i) => (<td key={i}>{cell}</td>))}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {FAQ_ITEMS.map((item, index) => (
                    <details key={item.question} open={index === 0}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-aluminum-glass-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
