import Link from 'next/link';
import { Ruler } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'construction-rebar-weight-guide');

const TOC_ITEMS = [
  ['quick-answers', 'الإجابات السريعة'],
  ['steps', 'خطوات الحساب'],
  ['deep-dive', 'شرح أعمق'],
  ['comparison', 'أي رقم تحتاجه الآن؟'],
  ['checklist', 'قائمة المراجعة'],
  ['faq', 'الأسئلة الشائعة'],
  ['sources', 'مصادر'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: PAGE.keywords, url: `${SITE_URL}${PAGE.href}` });

const QUICK_ANSWERS = [
  { question: 'ما معادلة حساب وزن حديد التسليح؟', answer: 'معادلتان متتاليتان: وزن المتر من القطر، ثم الوزن الإجمالي من وزن المتر — راجعهما كاملتين في قسم "الإجابات السريعة" أعلاه، أو استخدم حاسبة وزن الحديد للنتيجة مباشرة دون حساب يدوي.' },
  { question: 'كم وزن سيخ 12 متر قطر 16 ملم؟', answer: 'وزن متر قطر 16 ملم يساوي تقريباً 1.58 كجم/م، وسيخ 12 متر يزن حوالي 18.96 كجم — راجع طريقة الحساب في قسم "الإجابات السريعة"، والحاسبة تعرضه تقريباً 18.94 كجم حسب التقريب المستخدم.' },
  { question: 'كيف أحول الوزن إلى طن؟', answer: 'اقسم الوزن بالكيلوجرام على 1000. إذا كان مجموع الحديد 2450 كجم، فهذا يساوي 2.45 طن. عند طلب عرض سعر، اسأل المورد هل السعر للطن فقط أم يشمل النقل والقص والتحميل.' },
  { question: 'هل أضيف هالك عند شراء الحديد؟', answer: 'نعم غالباً تضيف هامشاً صغيراً حسب التقطيع والتراكب وأخطاء الموقع، لكن لا تضفه عشوائياً في مشروع إنشائي. ابدأ بالحصر من المخطط، ثم ناقش الهالك مع المهندس أو المقاول.' },
  { question: 'هل التقدير يغني عن المخطط الإنشائي؟', answer: 'لا. الحساب يعطيك وزنًا للتسعير والمراجعة، لكنه لا يحدد كمية التسليح الآمنة ولا القطر المناسب للعنصر. التصميم والحصر النهائي يجب أن يرجعا للمخطط الإنشائي والمهندس.' },
];

const STEPS = [
  { title: 'اجمع كل قطر وحده', body: 'لا تجمع أطوال قطر 12 مع قطر 16 في سطر واحد. لكل قطر وزن متر مختلف، لذلك اكتب سطراً مستقلاً لكل قطر في الحصر.' },
  { title: 'احسب وزن المتر من القطر', body: 'استخدم المعادلة: القطر × القطر ÷ 162. أو خذ الوزن مباشرة من جدول الحاسبة إذا كان القطر شائعاً مثل 8 أو 10 أو 12 أو 16 أو 20.' },
  { title: 'اضرب في الطول وعدد القطع', body: 'إذا كان لديك 40 سيخاً قطر 12 بطول 12 متر، فالوزن = وزن المتر × 12 × 40. كرر الخطوة لكل قطر.' },
  { title: 'حوّل الناتج إلى طن وعدد أسياخ', body: 'الكيلو يفيد في الحساب، والطن يفيد في التسعير. وعدد أسياخ 12 متر يفيد عند مراجعة الطلب مع المورد.' },
  { title: 'راجع الهالك والتراكب قبل الطلب', body: 'أطوال التراكب، الخطافات، الكانات، والقص قد تغيّر كمية الشراء. لا تعتمد رقم الحاسبة وحده إذا كنت في مرحلة التنفيذ النهائي.' },
];

const DEEP_DIVE_SECTIONS = [
  { title: 'الجواب المختصر: القطر يعطي وزن المتر، والطول والعدد يعطيان الوزن النهائي', body: 'إذا أردت تقدير وزن حديد التسليح، لا تبدأ بسؤال "كم طن أحتاج؟" قبل أن تعرف الأقطار والأطوال. المعادلة المبسطة هي: وزن المتر = القطر² ÷ 162. بعد ذلك تضرب في طول السيخ وعدد الأسياخ. مثال سريع: قطر 12 ملم وزنه تقريباً 0.888 كجم/م. إذا كان السيخ 12 متر، فوزنه حوالي 10.66 كجم. إذا احتجت 80 سيخاً، فالوزن يقارب 852.8 كجم، أي 0.853 طن.' },
  { title: 'لماذا لا يكفي أن تحفظ جدول الأوزان؟', body: 'جدول أوزان الحديد مفيد جداً، لكنه لا يحل المشكلة كلها. قد تحفظ أن قطر 16 يزن 1.578 كجم/م، لكنك ما زلت تحتاج معرفة طول كل قطعة وعددها وهل هي سيخ كامل أم قطعة مقصوصة. الخطأ الشائع أن يأخذ الشخص وزن سيخ 12 متر ثم يطبقه على قطع طولها 6 أو 8 أمتار، أو يخلط بين الكانات والأسياخ الطولية.' },
  { title: 'مثال عملي: 30 سيخ قطر 16 بطول 12 متر', body: 'وزن المتر لقطر 16 = 16 × 16 ÷ 162 = 1.58 كجم/م تقريباً. وزن السيخ 12 متر = 1.58 × 12 = 18.96 كجم. وزن 30 سيخاً = 18.96 × 30 = 568.8 كجم. بالطن: 568.8 ÷ 1000 = 0.569 طن تقريباً. هذا الرقم يصلح للمراجعة السريعة أو طلب سعر مبدئي، لكنه لا يقرر وحده كمية التسليح النهائية.' },
  { title: 'كيف تتعامل مع أكثر من قطر في نفس العنصر؟', body: 'افصل كل قطر في سطر: حديد 12، حديد 16، حديد 8 للكانات، وهكذا. احسب وزن كل قطر وحده، ثم اجمع النتائج في النهاية. قطر 16 ليس أثقل قليلاً من قطر 12؛ وزن متر 16 يقارب 1.58 كجم، بينما وزن متر 12 يقارب 0.888 كجم، أي فرق كبير عند الكميات الكبيرة.' },
  { title: 'ما الذي لا تحسبه المعادلة وحدها؟', body: 'المعادلة تحسب وزن قضيب مستقيم حسب القطر والطول والعدد. لكنها لا تفهم تفاصيل المخطط: التراكب بين الأسياخ، الخطافات، الكانات، أطوال القص، الهالك، اختلاف أطوال المصنع، أو اشتراطات الغطاء الخرساني. لذلك هي ممتازة لتقدير الوزن ومراجعة عرض المورد، لكنها لا تغني عن جدول الحصر الإنشائي.' },
  { title: 'كيف تحوّل الوزن إلى طلب شراء واضح؟', body: 'بعد الحساب، اكتب للمورد بلغة السوق: القطر، الطول القياسي إن كان 12 متر، عدد الأسياخ التقريبي، الوزن بالطن، وهل تحتاج قصاً أو تحميلًا أو نقلًا. مثال: "أحتاج تقريباً 0.57 طن من قطر 16، ما يعادل نحو 30 سيخ 12 متر قبل الهالك".' },
];

const COMPARISON_CARDS = [
  { title: 'وزن المتر', rows: [['متى يفيد؟', 'عند قراءة جدول الأقطار'], ['ما المدخلات؟', 'القطر فقط'], ['المعادلة', 'القطر² ÷ 162'], ['مثال قطر 16', '1.58 كجم/م تقريباً'], ['انتبه إلى', 'التقريب وجدول المصنع']] },
  { title: 'وزن سيخ 12 متر', rows: [['متى يفيد؟', 'عند مراجعة وحدة الشراء الشائعة'], ['ما المدخلات؟', 'القطر وطول 12 متر'], ['المعادلة', 'وزن المتر × 12'], ['مثال قطر 16', '18.94 كجم تقريباً'], ['انتبه إلى', 'اختلاف طول السيخ في بعض الأسواق']] },
  { title: 'الوزن الإجمالي', rows: [['متى يفيد؟', 'عند طلب سعر أو مراجعة كمية'], ['ما المدخلات؟', 'القطر والطول والعدد'], ['المعادلة', 'وزن المتر × الطول × العدد'], ['مثال قطر 16', '30 سيخاً = 568 كجم تقريباً'], ['انتبه إلى', 'الهالك والتراكب والقص']] },
  { title: 'عدد الأسياخ في الطن', rows: [['متى يفيد؟', 'عند فحص كلام المورد بسرعة'], ['ما المدخلات؟', 'وزن السيخ الواحد'], ['المعادلة', '1000 ÷ وزن السيخ'], ['مثال قطر 16', 'نحو 52 سيخاً في الطن'], ['انتبه إلى', 'التقريب والربطات وطريقة البيع']] },
];

const CHECKLIST_ITEMS = [
  'لدي قطر وطول وعدد أسياخ وأريد تحويلها إلى كيلوجرام أو طن.',
  'أريد معرفة وزن سيخ 12 متر قبل مقارنة الأسعار.',
  'أراجع عرض مورد وأريد التأكد أن الوزن منطقي.',
  'أتعامل مع أكثر من قطر ولا أريد خلط الأوزان.',
  'أحتاج تقديراً أولياً قبل إرسال الحصر للمهندس أو المقاول.',
  'أريد فهم متى أضيف هالكاً ومتى ألتزم بالمخطط فقط.',
];

const FAQ_ITEMS = [
  { question: 'هل وزن الحديد = القطر × الطول فقط؟', answer: 'لا. القطر يدخل في الوزن كمربع القطر، ثم تضرب في الطول والعدد. لذلك الفرق بين قطر 12 و16 كبير حتى لو بدا القطران قريبين بالنظر.' },
  { question: 'كم وزن سيخ 12 متر قطر 12 ملم؟', answer: 'وزن المتر لقطر 12 يساوي تقريباً 0.888 كجم. وزن سيخ 12 متر = 0.888 × 12 = 10.66 كجم تقريباً.' },
  { question: 'كم عدد أسياخ 12 متر في الطن؟', answer: 'اقسم 1000 كجم على وزن السيخ الواحد. مثلاً سيخ قطر 12 يزن حوالي 10.66 كجم، إذن الطن يحتوي تقريباً 93 سيخاً. الرقم يتغير حسب التقريب ووزن المصنع الفعلي.' },
  { question: 'هل أستخدم أرقام الحاسبة لطلب الحديد مباشرة؟', answer: 'استخدمها للمراجعة والتسعير الأولي. قبل الطلب النهائي، راجع المخطط، أطوال القص، التراكب، الكانات، والهالك مع المهندس أو المقاول، لأن الخطأ في الحديد مكلف وقد يؤثر على السلامة.' },
  { question: 'هل يختلف وزن الحديد حسب المصنع؟', answer: 'الوزن النظري يعتمد على القطر وكثافة الفولاذ، لكن المنتج الفعلي قد يختلف قليلاً ضمن سماحات التصنيع والمعايير المحلية. إذا كان الشراء كبيراً، اطلب شهادة المصنع أو جدول الوزن من المورد.' },
  { question: 'هل الحديد المشرشر يزن أكثر من الأملس؟', answer: 'لنفس القطر والطول، الوزن النظري متقارب جداً. اختلاف السطح مهم للتماسك والاستخدام الإنشائي، أما التقدير السريع للوزن فيبدأ عادة من القطر والطول والعدد.' },
];

const SOURCE_LINKS = [
  { href: 'https://www.crsi.org/reinforcing-basics/reinforcing-steel/rebar-properties/', title: 'CRSI: Rebar Properties' },
  { href: 'https://steelmath.com/calculators/tmt', title: 'SteelMath: TMT Bar Weight Calculator' },
  { href: 'https://calculateconstruction.com/calculators/material/steel-rebar-calculator.html', title: 'Calculate Construction: Steel Rebar Weight Calculator' },
];

export default function RebarWeightGuidePage() {
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
    { '@type': 'ListItem', position: 3, name: 'البناء والتشييد', item: `${SITE_URL}/tools/construction` },
    { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
  ] };
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: PAGE.heroTitle, description: PAGE.description, inLanguage: 'ar', mainEntityOfPage: `${SITE_URL}${PAGE.href}`, keywords: PAGE.keywords, isAccessibleForFree: true, datePublished: '2026-05-09', dateModified: '2026-05-27', author: { '@type': 'Person', name: 'بدر الدين الهرشالي' }, publisher: { '@type': 'Organization', name: 'ميقاتنا', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 } } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-construction-rebar-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">مقال بناء عملي</span>
              <h1>{PAGE.title}</h1>
              <p className="guide-v2-lead">{PAGE.description}</p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Ruler size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">القاعدة السريعة</p>
                <p className="guide-v2-verdict-body">
                  وزن المتر = القطر² ÷ 162، والوزن الإجمالي = وزن المتر × الطول × العدد. استخدم
                  الناتج للمراجعة والتسعير، ثم راجع المخطط والتراكب والهالك قبل الطلب النهائي.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="quick-answers">
                <h2>الإجابات السريعة</h2>
                <FormulaCard label="الخطوة الأولى: احسب وزن المتر الواحد من قطر السيخ">
                  <span>وزن المتر (كجم) =</span>
                  <Frac num="القطر²" den="162" />
                </FormulaCard>
                <FormulaCard
                  label="الخطوة الثانية: اضرب وزن المتر في الطول وعدد الأسياخ لتحصل على الوزن الإجمالي"
                  note="مثال: قطر 16 ملم → وزن المتر ≈ 1.58 كجم. لسيخ بطول 12 متر: 1.58 × 12 = 18.96 كجم."
                >
                  <span>الوزن الإجمالي (كجم) = وزن المتر × الطول × عدد الأسياخ</span>
                </FormulaCard>
                {QUICK_ANSWERS.map((qa) => (
                  <div key={qa.question} style={{ marginBottom: 'var(--space-4)' }}>
                    <p style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{qa.question}</p>
                    <p>{qa.answer}</p>
                  </div>
                ))}
              </section>

              <ToolInArticleAd slotId="mid-construction-rebar-guide" />

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

              <ToolInArticleAd slotId="mid2-construction-rebar-guide" />

              <section id="comparison">
                <h2>أي رقم تحتاجه الآن؟</h2>
                <p>حدد المطلوب قبل الحساب حتى لا تخلط بين وزن المتر ووزن السيخ ووزن الطلب الكامل.</p>
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
                <h2>استخدم هذا الدليل إذا كنت قبل الشراء أو التسعير</h2>
                <p>كلما كانت الأقطار والأطوال واضحة، كانت النتيجة أقرب للواقع.</p>
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
                <Link href="/tools/construction/rebar-weight" className="guide-v2-related-tile">
                  <p className="guide-v2-related-tile-title">احسب الوزن الفعلي بالكيلو والطن</p>
                  <p className="guide-v2-related-tile-reason">أدخل القطر والطول وعدد الأسياخ لتحصل على الوزن فوراً</p>
                </Link>
                <Link href="/tools/construction/cement" className="guide-v2-related-tile">
                  <p className="guide-v2-related-tile-title">هل الصبة تحتاج مواد أخرى؟</p>
                  <p className="guide-v2-related-tile-reason">بعد وزن الحديد، احسب الأسمنت والرمل والحصى إذا كنت تراجع مواد الصبة كاملة</p>
                </Link>
              </div>
            </div>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-construction-rebar-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
