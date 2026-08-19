import PoolVolumeChlorineCalculator from '@/components/calculators/PoolVolumeChlorineCalculator.client';
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
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pools-volume-chlorine-calculator');

const FAQ_ITEMS = [
  {
    question: 'كيف احسب حجم المسبح؟',
    answer:
      'المعادلة تختلف حسب شكل المسبح — راجع الصيغ الأربع كاملة في قسم "لماذا نحسب بالمتري مباشرة لا بالغالون" أعلاه، أو اختر شكل مسبحك في الحاسبة وأدخل الأبعاد بالمتر للحصول على الحجم بالمتر المكعب واللتر مباشرة دون حساب يدوي.',
  },
  {
    question: 'كم كمية الكلور اللازمة للمسبح؟',
    answer:
      'يعتمد على حجم مسبحك (باللتر) والفرق بين نسبة الكلور الحالية والمستهدفة ونوع منتج الكلور وتركيزه. الحاسبة أعلاه تحسب حجم مسبحك أولاً، ثم تستخدمه تلقائياً لحساب الكمية المطلوبة بمجرد اختيار هدفك ونوع المنتج.',
  },
  {
    question: 'ما الفرق بين المعالجة الروتينية ومعالجة الصدمة؟',
    answer:
      'المعالجة الروتينية تحافظ على نسبة كلور منخفضة نسبياً (حول 1-3 ppm) للاستخدام اليومي الآمن للسباحة. معالجة الصدمة (Shock) ترفع النسبة مؤقتاً إلى حدود أعلى بكثير (حول 10 ppm) للقضاء على تراكم الملوثات العضوية أو رائحة الكلور القوية غير الطبيعية — لا يُسمح بالسباحة مباشرة بعدها حتى تعود النسبة لمستوى آمن.',
  },
  {
    question: 'لماذا مياه المسبح تصبح خضراء وكيف الحل؟',
    answer:
      'اللون الأخضر عادة علامة على نمو طحالب بسبب نقص الكلور الفعّال لفترة، أو خلل في توازن الأس الهيدروجيني (pH)، أو ضعف الترشيح والتدوير. الحل المعتاد هو معالجة صدمة بنسبة كلور أعلى (اختر "مكافحة طحالب" في الحاسبة أعلاه) مع تشغيل نظام الترشيح لساعات إضافية حتى تصفو المياه تماماً.',
  },
  {
    question: 'هل يمكن استخدام أنواع كلور مختلفة في نفس المسبح؟',
    answer:
      'يمكن التبديل بين الأنواع (سائل، حبيبي، أقراص) لكن ليس من الحكمة خلطها مباشرة مع بعضها يدوياً في نفس الوقت لأن بعض التفاعلات الكيميائية بين المركّزات المختلفة قد تكون خطرة — أضف نوعاً واحداً، انتظر واختبر النسبة، ثم قرر الخطوة التالية.',
  },
  {
    question: 'كم مرة يجب فحص نسبة الكلور في المسبح؟',
    answer:
      'للاستخدام المنزلي المعتاد، فحص يومي أو كل يومين بشريط اختبار بسيط كافٍ لمتابعة النسبة، مع فحص أكثر تكراراً في أيام الاستخدام الكثيف أو بعد هطول أمطار غزيرة قد تخفف تركيز الكلور الفعّال في الماء.',
  },
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

const TOC_ITEMS = [
  ['pool-guide', 'لماذا نحسب بالمتري مباشرة لا بالغالون'],
  ['pool-faq', 'الأسئلة الشائعة'],
];

export default function PoolVolumeCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'المسابح', item: `${SITE_URL}/tools/pools` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['حساب حجم المسبح', 'كم كمية الكلور اللازمة للمسبح'],
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

      <ToolTopAdSlot slotId="top-pool-volume" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-pool-volume" /></div>

        <article className="tool-v2-lane-article">
          <section id="pool-guide">
            <h2>لماذا نحسب بالمتري مباشرة لا بالغالون</h2>
            <p>
              أغلب حاسبات حجم المسابح المرجعية بالإنجليزية (Swim University، Omni Calculator،
              وحتى مواقع مقاولي مسابح خليجيين) تُخرج النتيجة بالغالون الأمريكي أولاً ثم تحوّلها،
              ما يضيف خطوة ذهنية غير ضرورية للقارئ العربي. هذه الأداة تحسب مباشرة بالمتر المكعب
              واللتر، ثم تستخدم نفس الحجم فوراً لحساب جرعة الكلور بلا أي تحويل وسيط.
            </p>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              معادلة حساب الحجم تختلف حسب شكل المسبح:
            </p>
            <div className="tool-v2-formula-grid">
              <FormulaCard label="مسبح مستطيل">
                <span>الحجم = الطول × العرض × متوسط العمق</span>
              </FormulaCard>
              <FormulaCard label="مسبح دائري">
                <span>الحجم = π × نصف القطر² × متوسط العمق</span>
              </FormulaCard>
              <FormulaCard label="مسبح بيضاوي">
                <span>الحجم = الطول × العرض × 0.785 × متوسط العمق</span>
              </FormulaCard>
              <FormulaCard label="مسبح كلوي الشكل">
                <span>الحجم = 0.45 × مجموع العرضين × الطول × متوسط العمق</span>
              </FormulaCard>
            </div>
            <PlainBlock eyebrow="لا تعرف عمق مسبحك بالضبط؟" title="استخدم متوسط العمق">
              إن كان مسبحك بعمق ثابت في كل مكان، أدخل نفس الرقم في حقلي العمق الضحل والعميق. إن
              كان يتدرج (منطقة أطفال ضحلة ومنطقة سباحة أعمق)، أدخل العمقين الحقيقيين وستحسب
              الأداة المتوسط تلقائياً.
            </PlainBlock>
            <PlainBlock eyebrow="الخطوة الثانية تستخدم نتيجة الأولى تلقائياً" title="حجم واحد، لا إعادة إدخال">
              بمجرد حساب الحجم في الجزء الأول، تُستخدم النتيجة مباشرة في حساب جرعة الكلور أسفلها —
              لا حاجة لنسخ الرقم يدوياً أو حسابه في أداة منفصلة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-pool-volume" />

          <section id="pool-faq">
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

          <section id="pool-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.swimuniversity.com/pool-calculator/" target="_blank" rel="noreferrer">Swim University — Pool Volume Calculator</a> — مصدر معادلات حساب الحجم حسب الشكل.</li>
              <li><a href="https://www.omnicalculator.com/everyday-life/pool-shock" target="_blank" rel="noreferrer">Omni Calculator — Pool Shock Calculator</a> — مصدر منهجية حساب جرعة الكلور.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><PoolVolumeChlorineCalculator /></div>
        </div>
      </div>
    </main>
  );
}
