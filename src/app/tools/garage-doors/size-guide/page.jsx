import Link from 'next/link';

import GarageDoorSizeSelector from '@/components/calculators/GarageDoorSizeSelector.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'garage-doors-size-guide');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `ما هو مقاس باب الجراج القياسي ${CURRENT_YEAR}؟`,
    answer:
      'المقاسات القياسية الشائعة في السوق (عرض × ارتفاع) هي: 3×3 متر، 3.5×3 متر، 4×3 متر، 4.5×3 متر، 5×3 متر، 5.5×3 متر، و6×3 متر — الأصغر لسيارة واحدة والأكبر لسيارتين أو ثلاث. استخدم أداة الاختيار أعلاه لمعرفة المقاس المناسب لعدد سياراتك تحديداً.',
  },
  {
    question: 'كم مقاس باب جراج لسيارتين؟',
    answer:
      'عادة بين 4.5 و5.5 متراً عرضاً بارتفاع 3 أمتار — اختر الطرف الأعلى من هذا النطاق إن كانت سياراتك من فئة SUV كبيرة أو تحتاج مساحة إضافية لفتح الأبواب ووضع أغراض جانبية داخل الجراج.',
  },
  {
    question: 'ما الفرق بين باب الجراج الرول والسكشنال؟',
    answer:
      'الباب الرول يلتف بالكامل لأعلى داخل صندوق مضغوط فوق الفتحة مباشرة — الأشيع والأوفر تكلفة أولية. الباب السكشنال يتكون من شرائح أفقية تنزلق على سكة داخل السقف — عزل حراري وصوتي أفضل عادة، لكن يحتاج مساحة سقف أكبر للتركيب.',
  },
  {
    question: 'لماذا باب الجراج لا يفتح بالريموت؟',
    answer:
      'الأسباب الأكثر شيوعاً بالترتيب: بطاريات الريموت فارغة (حلها استبدال البطارية مباشرة)، عين الاستشعار (IR sensor) متسخة أو عليها عائق (نظّفها بقطعة قماش ناعمة رطبة)، عدسة الإرسال بالريموت نفسه تالفة (يحتاج ريموتاً جديداً)، قاطع الحماية GFCI في مقبس الكهرباء انفصل (اضغط زر إعادة الضبط)، أو فقدان اقتران الإشارة بعد فترة استخدام طويلة (يحتاج إعادة برمجة الريموت حسب طريقة الماركة).',
  },
  {
    question: 'كيف أعيد برمجة ريموت باب الجراج؟',
    answer:
      'تأكد أولاً من إغلاق الباب يدوياً بالكامل حتى لا يتحرك أثناء البرمجة، ثم اضغط زر البرمجة (CODE أو Learn) الموجود على وحدة الموتور نفسها، وفي نفس الوقت اضغط الزر المطلوب على الريموت حتى تضيء لمبة الموتور أو تصدر صوت تأكيد — الخطوات الدقيقة تختلف قليلاً بين الماركات، راجع دليل موتورك تحديداً.',
  },
  {
    question: 'كم سعر موتور باب الجراج؟',
    answer:
      'الموتورات الأساسية لباب واحد تبدأ من نحو 400-475 ريال سعودي (مثل بعض موديلات 220 فولت بقوة ربع حصان)، بينما الأبواب الأعرض أو الأثقل (سكشنال، مزدوجة) تحتاج موتورات أقوى وأغلى سعراً. لا يوجد معيار موحد بين الماركات لوحدة القياس المعلنة (بعضها يذكر الحصان، وبعضها الفولت فقط) — راجع مواصفات الموتور تحديداً وقارنها بوزن ونوع بابك قبل الشراء.',
  },
  {
    question: 'هل يمكن فتح باب الجراج يدوياً عند انقطاع الكهرباء؟',
    answer:
      'نعم، كل موتور باب جراج حديث يأتي بمفتاح تحرير يدوي (عادة حبل أحمر متدلٍ من قضيب الموتور) يفصل الباب عن الموتور مؤقتاً لتتمكن من رفعه أو إغلاقه بيدك — تأكد من معرفة موقعه قبل أول انقطاع كهرباء تحتاج فيه استخدامه فعلياً.',
  },
];

const TOC_ITEMS = [
  ['garage-sizes', 'المقاسات القياسية لأبواب الجراج'],
  ['garage-motor', 'اختيار موتور باب الجراج'],
  ['garage-troubleshoot', 'حل مشاكل الريموت الشائعة'],
  ['garage-faq', 'الأسئلة الشائعة'],
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

const TROUBLESHOOT_TABLE = [
  { cause: 'بطارية الريموت فارغة', fix: 'استبدل البطارية — أشيع سبب على الإطلاق وأسهل حل' },
  { cause: 'عين الاستشعار (IR) متسخة أو عليها عائق', fix: 'نظّفها بقطعة قماش ناعمة رطبة وأزل أي عائق أمامها' },
  { cause: 'عدسة إرسال الريموت تالفة', fix: 'لا حل غالباً سوى شراء ريموت جديد متوافق' },
  { cause: 'قاطع الحماية GFCI انفصل', fix: 'اضغط زر إعادة الضبط في مقبس الكهرباء المغذي للموتور' },
  { cause: 'فقدان اقتران الإشارة بعد استخدام طويل', fix: 'أعد برمجة الريموت من زر CODE/Learn على وحدة الموتور' },
];

export default function GarageDoorSizeGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'أبواب الجراج', item: `${SITE_URL}/tools/garage-doors` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['مقاس باب الجراج المناسب', 'حل مشاكل ريموت باب الجراج'],
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

      <ToolTopAdSlot slotId="top-garage-doors-size" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-garage-doors-size" /></div>

        <article className="tool-v2-lane-article">
          <section id="garage-sizes">
            <h2>المقاسات القياسية لأبواب الجراج</h2>
            <p>
              سبعة مقاسات تغطي معظم الاحتياجات في السوق، من عرض 3 أمتار وحتى 6 أمتار، جميعها
              بارتفاع 3 أمتار تقريباً — أضيق من هذا يناسب سيارة واحدة، وأوسع يستوعب سيارتين أو
              أكثر. اختر عدد سياراتك أعلى الأداة لمعرفة النطاق المناسب لك مباشرة.
            </p>
            <PlainBlock eyebrow="جراج ثلاث سيارات أو أكثر" title="غالباً بابان، لا باب واحد عريض">
              لا يوجد مقاس قياسي واحد شائع يغطي ثلاث سيارات في باب واحد — الحل الشائع عالمياً
              ومحلياً هو باب مزدوج (لسيارتين) بجانب باب مفرد منفصل لثالث سيارة، أو ثلاثة أبواب
              مفردة متجاورة، لا باب واحد بعرض ضخم غير عملي إنشائياً.
            </PlainBlock>
            <PlainBlock eyebrow="قبل الشراء" title="اترك هامشاً حقيقياً لا مقاس السيارة بالضبط">
              اختر دائماً أقرب مقاس قياسي أعلى من عرض سيارتك الفعلي، لا الأقرب له تماماً — الهامش
              الإضافي يمنحك مساحة لفتح الأبواب والمشي بجانب السيارة دون خدش الجدران أو الباب نفسه.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-garage-doors-size-1" />

          <section id="garage-motor">
            <h2>اختيار موتور باب الجراج</h2>
            <p>
              لا يوجد معيار موحّد بين الماركات لوحدة القياس المعلنة على صندوق الموتور — بعضها
              يذكر القوة بالحصان (مثل موتورات 220 فولت الأساسية بقوة ربع حصان لباب واحد خفيف)،
              وبعضها يكتفي بالفولت فقط دون رقم قوة صريح. القاعدة العملية الأهم بغض النظر عن
              الوحدة: كلما زاد عرض ووزن الباب (سكشنال أثقل من الرول عادة)، احتجت موتوراً أقوى
              وأغلى — لا تشترِ أرخص موتور متاح لباب عريض أو ثقيل ظناً أن التوفير يستحق العناء،
              فالموتور الضعيف يتعطل أسرع تحت إجهاد متكرر.
            </p>
            <PlainBlock eyebrow="نصيحة عملية" title="اسأل البائع عن وزن بابك تحديداً">
              بما أن وحدات القياس تختلف بين الماركات، اطلب من البائع مطابقة الموتور لوزن باب
              بالضبط ونوعه (رول أم سكشنال) بدل الاعتماد على الرقم المعلن على العلبة وحده —
              الموتور المناسب لباب رول خفيف قد لا يكفي إطلاقاً لباب سكشنال بنفس العرض تقريباً.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-garage-doors-size-2" />

          <section id="garage-troubleshoot">
            <h2>حل مشاكل الريموت الشائعة</h2>
            <p>
              قبل الاتصال بفني، خمسة أسباب تفسر معظم حالات "الريموت لا يعمل" — رتّبها من الأسهل
              حلاً للأصعب:
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>السبب</th>
                    <th>الحل</th>
                  </tr>
                </thead>
                <tbody>
                  {TROUBLESHOOT_TABLE.map((row) => (
                    <tr key={row.cause}>
                      <td>{row.cause}</td>
                      <td>{row.fix}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="garage-faq">
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

          <section id="garage-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.bayut.com/mybayut/ar/%D8%A7%D9%86%D9%88%D8%A7%D8%B9-%D8%A7%D8%A8%D9%88%D8%A7%D8%A8-%D8%A7%D9%84%D9%83%D8%B1%D8%A7%D8%AC%D8%A7%D8%AA/" target="_blank" rel="noreferrer">Bayut — أنواع أبواب الكراجات ومقاساتها</a> — مصدر جدول المقاسات القياسية.</li>
              <li><a href="https://karajey.com/garage-door-problem/" target="_blank" rel="noreferrer">كراجي — حل مشكلة ريموت الكراج</a> — مصدر أسباب وحلول مشاكل الريموت.</li>
              <li><a href="https://doors-store.com/product/%D9%85%D9%83%D9%8A%D9%86%D8%A9-%D8%A8%D8%A7%D8%A8-%D8%A7%D9%84%D9%83%D8%B1%D8%A7%D8%AC/" target="_blank" rel="noreferrer">متجر الأبواب — موتور HERCULIFT</a> — مصدر مواصفة موتور 220 فولت / ربع حصان.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><GarageDoorSizeSelector /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/garage-doors">
                <span>كل أدوات أبواب الجراج</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
