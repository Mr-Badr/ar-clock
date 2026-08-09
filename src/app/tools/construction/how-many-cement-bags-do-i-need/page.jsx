import Link from 'next/link';
import { Package } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'construction-cement-bags-guide');

const TOC_ITEMS = [
  ['quick-answers', 'الإجابات السريعة'],
  ['steps', 'خطوات الحساب'],
  ['deep-dive', 'شرح أعمق'],
  ['comparison', 'أي رقم تستخدم؟'],
  ['checklist', 'قائمة المراجعة'],
  ['faq', 'الأسئلة الشائعة'],
  ['sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: PAGE.keywords, url: `${SITE_URL}${PAGE.href}` });

const QUICK_ANSWERS = [
  { question: 'كم كيس أسمنت في المتر المكعب؟', answer: 'في صبة سكنية متوسطة قد ترى رقماً قريباً من 7 إلى 7.5 أكياس 50 كجم لكل متر مكعب عند عيار M20 تقريباً، لكن هذا ليس رقماً ثابتاً لكل الصبات. العيار، وزن الكيس، نوع العنصر، والهدر يغيرون النتيجة.' },
  { question: 'كم كيس أسمنت لصبة 10 متر مكعب؟', answer: 'إذا استخدمت تقديراً متوسطاً 7.4 أكياس لكل متر مكعب، فصبة 10 متر تحتاج نحو 74 كيساً قبل تعديل الهدر أو العيار. إذا أضفت 5% هدر تصبح الكمية نحو 78 كيساً تقريباً.' },
  { question: 'هل أشتري الأسمنت وحده بعد الحساب؟', answer: 'لا. الخرسانة ليست أسمنتاً فقط. تحتاج الرمل والحصى أو الزلط والماء، وقد تحتاج خرسانة جاهزة بدل الخلط اليدوي إذا كانت الصبة إنشائية أو كبيرة. عدد الأكياس خطوة شراء أولية لا تصميم خلطة نهائي.' },
  { question: 'هل هذا يغني عن المهندس؟', answer: 'لا، خصوصاً في الأسقف والأعمدة والقواعد. الحاسبة والمقال يساعدانك على تقدير الشراء والنقاش مع المورد، أما عيار الخرسانة وتصميم الخلطة فيجب أن يتبع المخطط أو توصية مختص.' },
];

const STEPS = [
  { title: 'احسب حجم الصبة بالمتر المكعب أولاً', body: 'لا تبدأ من عدد الأكياس. ابدأ بالطول × العرض × السمك أو بالحجم الموجود في المخطط، لأن أي خطأ في الحجم يضاعف الخطأ في كل المواد.' },
  { title: 'اختر العيار أو مقاومة الخرسانة', body: 'خرسانة النظافة ليست مثل القواعد أو الأعمدة. العيار الأعلى يحتاج أسمنتاً أكثر غالباً، لكنه لا يختار بالذوق أو التوفير بل حسب الاستخدام والمخطط.' },
  { title: 'ثبّت وزن الكيس في بلدك', body: 'قد يسمى كيساً أو شيكارة أو خنشة، وقد يكون 50 كجم أو 42.5 كجم أو غير ذلك. الحساب الصحيح يقسم وزن الأسمنت المطلوب على وزن العبوة الفعلي.' },
  { title: 'أضف هدر الموقع قبل الشراء', body: 'الهدر يغطي الفاقد والتفاوت في الأبعاد والنقل والخلط. في الأعمال الصغيرة قد يكون 5% إلى 10% بداية عملية، لكن الصبات المعقدة تحتاج مراجعة أدق.' },
  { title: 'راجع الرمل والحصى والماء لا الأسمنت وحده', body: 'كمية الأسمنت وحدها لا تنفذ صبة جيدة. راجع مكوّنات الخلطة كلها، ولا تضف ماءً عشوائياً لأن زيادة الماء قد تضعف الخرسانة.' },
];

const DEEP_DIVE_SECTIONS = [
  { title: 'الجواب السريع: كم كيس في المتر المكعب؟', body: 'إذا كنت تريد رقماً أولياً لصبة سكنية متوسطة، فغالباً سترى تقديراً قريباً من 7 إلى 7.5 أكياس 50 كجم لكل متر مكعب في عيار M20 تقريباً. لكن تعامل مع الرقم كمرساة للفهم لا كأمر شراء. إذا كان العيار أعلى، قد يزيد عدد الأكياس. وإذا كان وزن الكيس أقل من 50 كجم، سيزيد العدد. وإذا أضفت هدر الموقع، سيزيد الرقم النهائي الذي تطلبه من المورد.' },
  { title: 'كيف تحسب حجم الصبة قبل أي كيس؟', body: 'الحجم هو نقطة البداية: الطول × العرض × السمك بالمتر. إذا كانت الصبة 5 م × 4 م × 0.10 م، فالحجم 2 متر مكعب. بعد ذلك تختار العيار المناسب، ثم تضرب عدد الأكياس التقريبي لكل متر في الحجم. إذا استخدمت 7.4 أكياس للمتر في المثال السابق، فالنتيجة 14.8 كيس قبل الهدر، فتقربها للأعلى وتراجعها مع الحاسبة أو المختص.' },
  { title: 'لماذا يغيّر العيار عدد الأكياس؟', body: 'العيار ليس اسماً تجارياً بل تعبير عن مقاومة أو درجة خلطة مطلوبة. كلما زادت المتطلبات غالباً احتجت محتوى أسمنت أعلى أو تصميم خلطة أدق. لذلك لا تقارن خرسانة النظافة بخرسانة الأعمدة أو القواعد. استخدام كمية أقل من اللازم في عنصر إنشائي خطر، واستخدام كمية أعلى بلا حاجة قد يرفع التكلفة وربما يسبب مشاكل تشغيلية أو تشققاً إذا لم تكن الخلطة مصممة جيداً.' },
  { title: 'ما الفرق بين كيس وشيكارة وخنشة؟', body: 'الاسم يتغير حسب البلد، لكن الحاسبة تحتاج الوزن. في الخليج قد تسمع كيس، في مصر شيكارة، وفي المغرب خنشة. إذا كان الوزن 50 كجم فالحساب يختلف عن 42.5 كجم أو 25 كجم. لا تعتمد على الاسم عند الشراء؛ اقرأ وزن العبوة أو اسأل المورد، ثم أدخله في الحاسبة.' },
  { title: 'كيف تضيف الهدر من غير مبالغة؟', body: 'لأعمال صغيرة ومنتظمة قد يكون 5% إلى 10% هامشاً عملياً مبدئياً، خاصة إذا كانت الأبعاد واضحة. أما إذا كانت الأرض غير مستوية، أو القوالب غير دقيقة، أو الصبة معقدة، فقد تحتاج مراجعة أكبر. اسأل: هل الأبعاد دقيقة؟ هل النقل قريب؟ هل الخلط يدوي؟ هل توجد فواصل أو زوايا كثيرة؟' },
  { title: 'متى لا يكفي الخلط اليدوي؟', body: 'إذا كانت الصبة كبيرة أو إنشائية أو تحتاج جودة ثابتة، فشراء أكياس أسمنت وخلطها يدوياً قد لا يكون الخيار الأفضل. الخرسانة الجاهزة تعطيك خلطة أكثر انتظاماً وتحمّل مسؤولية أوضح عند المورد، لكنها تحتاج ترتيب وقت الصب والنقل والهبوط والكمية.' },
];

const COMPARISON_CARDS = [
  { title: 'خرسانة نظافة أو أرضية بسيطة', rows: [['ماذا يعني؟', 'غالباً تحتاج عياراً أقل من العناصر الإنشائية'], ['ماذا تفعل؟', 'لا ترفع الأسمنت عشوائياً؛ راجع الاستخدام ثم أضف هدر شراء بسيطاً']] },
  { title: 'سقف أو عمود أو قاعدة', rows: [['ماذا يعني؟', 'لا يكفي رقم عام من الإنترنت لأن الخطأ مؤثر إنشائياً'], ['ماذا تفعل؟', 'اتبع المخطط أو المهندس، واستخدم الحاسبة لتقدير الكمية فقط']] },
  { title: 'كيس 50 كجم', rows: [['ماذا يعني؟', 'وزن شائع في أسواق عربية كثيرة'], ['ماذا تفعل؟', 'اقسم وزن الأسمنت المطلوب على 50 ثم قرّب للأعلى مع الهدر']] },
  { title: 'كيس بوزن مختلف', rows: [['ماذا يعني؟', 'الاسم نفسه لا يكفي؛ الوزن هو الذي يحدد العدد'], ['ماذا تفعل؟', 'عدّل وزن الكيس في الحاسبة حتى لا تشتري أقل أو أكثر من اللازم']] },
  { title: 'خرسانة جاهزة', rows: [['ماذا يعني؟', 'قد يكون طلب المتر المكعب الجاهز أفضل من شراء أكياس لصبة كبيرة'], ['ماذا تفعل؟', 'راجع العيار، الهبوط، النقل، ووقت الصب مع المورد أو المهندس']] },
];

const CHECKLIST_ITEMS = [
  'حسبت حجم الصبة بالمتر المكعب لا بالعين أو التخمين.',
  'عرفت هل العمل خرسانة نظافة أم سقفاً أم عموداً أم قاعدة.',
  'راجعت العيار أو المقاومة المطلوبة في المخطط أو مع المختص.',
  'اخترت وزن الكيس الفعلي في سوقك.',
  'أضفت هدر شراء مناسباً قبل تقريب العدد للأعلى.',
  'راجعت الرمل والحصى والماء أو قررت طلب خرسانة جاهزة إذا كانت الصبة كبيرة.',
];

const FAQ_ITEMS = [
  { question: 'هل 7 أكياس لكل متر مكعب قاعدة ثابتة؟', answer: 'لا. هو رقم تقريبي يظهر في خلطات متوسطة مثل M20 عند كيس 50 كجم، لكنه يتغير مع العيار ونوع الصبة ووزن الكيس والهدر. استخدمه كنقطة بداية لا كأمر شراء نهائي.' },
  { question: 'هل كل كيس أسمنت 50 كجم؟', answer: 'لا دائماً. 50 كجم وزن شائع، لكن بعض الأسواق أو المنتجات تستخدم أوزاناً مختلفة. لذلك الحساب الصحيح يبدأ من وزن العبوة المكتوب على الكيس أو عرض المورد.' },
  { question: 'ما الفرق بين الأسمنت والخرسانة؟', answer: 'الأسمنت مكوّن رابط داخل الخرسانة، أما الخرسانة فهي خليط من الأسمنت والماء والركام مثل الرمل والحصى. لذلك شراء الأسمنت وحده لا يعني أنك حسبت الصبة كاملة.' },
  { question: 'هل زيادة الأسمنت تجعل الخرسانة أفضل دائماً؟', answer: 'ليس دائماً. الخلطة الجيدة توازن بين الأسمنت والماء والركام وقابلية التشغيل. زيادة الأسمنت أو الماء بلا تصميم قد ترفع التكلفة أو تزيد التشقق أو تضعف المتانة، لذلك اتبع مواصفات الخلطة.' },
  { question: 'متى أطلب خرسانة جاهزة بدل الخلط اليدوي؟', answer: 'إذا كانت الكمية كبيرة أو العنصر إنشائياً أو تحتاج جودة ثابتة، فالخرسانة الجاهزة غالباً أسلم من خلط أكياس كثيرة يدوياً. ناقش العيار ووقت الصب والنقل مع المورد.' },
  { question: 'ماذا بعد معرفة عدد الأكياس؟', answer: 'افتح حاسبة الأسمنت لتراجع الرمل والحصى والماء والهدر، ثم افتح حاسبة الحديد إذا كانت الصبة مسلحة. لا تعتمد على رقم الأكياس وحده في قرار التنفيذ.' },
];

const SOURCE_LINKS = [
  { href: 'https://www.cement.org/cement-concrete/cement-concrete-faq/', title: 'American Cement Association: Cement & Concrete FAQ' },
  { href: 'https://www.nrmca.org/about-nrmca/about-concrete/', title: 'NRMCA: About Concrete' },
  { href: 'https://www.nrmca.org/association-resources/research-and-engineering/frequently-asked-questions-on-concrete-materials/', title: 'NRMCA: Frequently Asked Questions on Concrete Materials' },
  { href: 'https://www.quikrete.com/calculator/main.asp', title: 'QUIKRETE: Concrete Calculator' },
];

export default function CementBagsGuidePage() {
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
    { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
    { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
  ] };
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: PAGE.heroTitle, description: PAGE.description, inLanguage: 'ar', mainEntityOfPage: `${SITE_URL}${PAGE.href}`, keywords: PAGE.keywords, isAccessibleForFree: true, datePublished: '2026-05-08', dateModified: '2026-05-26', author: { '@type': 'Person', name: 'بدر الدين الهرشالي' }, publisher: { '@type': 'Organization', name: 'ميقاتنا', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 } } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-construction-cement-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">مقال بناء عملي</span>
              <h1>{PAGE.title}</h1>
              <p className="guide-v2-lead">{PAGE.description}</p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Package size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">المبدأ الأهم</p>
                <p className="guide-v2-verdict-body">
                  ابدأ من حجم الصبة والعيار، ثم حوّل وزن الأسمنت إلى أكياس حسب وزن العبوة والهدر.
                  قد تسمع أن المتر المكعب يحتاج 7 أكياس تقريباً، لكن هذا الرقم لا يكفي وحده — يتغير
                  مع العيار ووزن الكيس ومستوى الهدر في الموقع.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="quick-answers">
                <h2>الإجابات السريعة</h2>
                {QUICK_ANSWERS.map((qa) => (
                  <div key={qa.question} style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{qa.question}</p>
                    <p>{qa.answer}</p>
                  </div>
                ))}
              </section>

              <ToolInArticleAd slotId="mid-construction-cement-guide" />

              <section id="steps">
                <h2>خطوات الحساب بالترتيب</h2>
                <div className="guide-v2-steps">
                  {STEPS.map((step) => (
                    <div className="guide-v2-step" key={step.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <div>
                        <p className="guide-v2-step-title">{step.title}</p>
                        <p className="guide-v2-step-body">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="deep-dive">
                <h2>شرح أعمق لكل تفصيل</h2>
                {DEEP_DIVE_SECTIONS.map((s) => (
                  <div key={s.title} style={{ marginBottom: 'var(--space-5)' }}>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                ))}
              </section>

              <ToolInArticleAd slotId="mid2-construction-cement-guide" />

              <section id="comparison">
                <h2>أي رقم تستخدم قبل شراء الأسمنت؟</h2>
                <p>استخدم هذه البطاقات كخريطة سريعة قبل فتح الحاسبة أو طلب المواد من المورد.</p>
                <div className="guide-v2-compare-list">
                  {COMPARISON_CARDS.map((card) => (
                    <div className="guide-v2-compare-card" key={card.title}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{card.title}</span>
                      </div>
                      <div className="guide-v2-compare-rows">
                        {card.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="checklist">
                <h2>راجع هذه النقاط قبل شراء أكياس الأسمنت</h2>
                <p>هذه القائمة تمنع أكثر أخطاء الشراء شيوعاً: رقم عام، وزن كيس خاطئ، أو نسيان الهدر وبقية المكونات.</p>
                <ul>
                  {CHECKLIST_ITEMS.map((item) => (<li key={item}>{item}</li>))}
                </ul>
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

              <section id="sources">
                <h2>مصادر</h2>
                <ul>
                  {SOURCE_LINKS.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}
                </ul>
              </section>
            </article>

            <div className="guide-v2-related">
              <p className="guide-v2-related-head">أدوات ذات صلة</p>
              <div className="guide-v2-related-grid">
                <Link href="/tools/construction/cement" className="guide-v2-related-tile">
                  <p className="guide-v2-related-tile-title">حاسبة الأسمنت والخرسانة</p>
                  <p className="guide-v2-related-tile-reason">أدخل الحجم والعيار واحصل على الرمل والحصى والماء وعدد الأكياس</p>
                </Link>
                <Link href="/tools/construction/how-to-estimate-rebar-weight" className="guide-v2-related-tile">
                  <p className="guide-v2-related-tile-title">كيف تقدّر وزن حديد التسليح؟</p>
                  <p className="guide-v2-related-tile-reason">إذا كانت الصبة مسلحة، احسب وزن الحديد قبل الطلب</p>
                </Link>
              </div>
            </div>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-construction-cement-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
