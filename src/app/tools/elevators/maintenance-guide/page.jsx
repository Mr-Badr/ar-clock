import Link from 'next/link';

import ElevatorContractChecker from '@/components/calculators/ElevatorContractChecker.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'elevator-maintenance-guide');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `ما هي أنواع عقود صيانة المصاعد ${CURRENT_YEAR}؟`,
    answer:
      'ثلاثة أنواع شائعة: عقد شامل (يغطي الفحص الدوري وقطع الغيار والإصلاحات دون تكلفة إضافية)، عقد غير شامل (يقتصر على الفحص الدوري والتنظيف، وأي قطعة تحتاج استبدالاً تُحاسَب منفصلة)، وعقد طوارئ (استجابة سريعة لأعطال التوقف المفاجئ فقط، دون زيارات دورية مجدولة). العقد الشامل أعلى تكلفة لكنه أقل مفاجآت مالية لاحقة.',
  },
  {
    question: 'ما اشتراط الدفاع المدني الذي يغفل عنه كثيرون في عقد صيانة المصعد؟',
    answer:
      'ربط المصعد بنظام إنذار الحريق في المبنى بحيث يعود تلقائياً إلى طابق آمن ويتوقف عن الاستخدام العادي عند تفعيل الإنذار — هذا اشتراط دفاع مدني حقيقي في السعودية، وليس ميزة إضافية اختيارية يقدمها بعض المزودين فقط. تحقق من وجوده صراحة في عقدك.',
  },
  {
    question: 'كيف أتأكد أن شركة صيانة المصاعد معتمدة من الدفاع المدني؟',
    answer:
      'الدفاع المدني ينشر قائمة رسمية بشركات فحص المصاعد المعتمدة لديه — اطلب من مقدّم الخدمة رقم الاعتماد أو الشهادة قبل التوقيع، ولا تكتفِ بتصريح شفهي أن "الشركة معتمدة" دون توثيق فعلي.',
  },
  {
    question: 'ما الفرق بين عقد الصيانة الشامل وغير الشامل من ناحية التكلفة الفعلية؟',
    answer:
      'العقد غير الشامل يبدو أرخص عند التوقيع، لكن أي عطل يحتاج قطعة غيار (كابل، بكرة، لوحة تحكم) يُحاسَب بشكل منفصل فوق قيمة العقد — قد يتجاوز مجموع هذه الفواتير الإضافية على مدار السنة فرق السعر مع العقد الشامل نفسه، خصوصاً في المصاعد الأقدم الأكثر عرضة للأعطال.',
  },
  {
    question: 'هل يشترط استخدام قطع غيار أصلية من نفس ماركة المصعد؟',
    answer:
      'يُفضَّل ذلك بقوة حتى لو لم يكن العقد يذكره صراحة — أوتيس وميتسوبيشي وفوجي وكوني وشندلر (العلامات الأكثر انتشاراً في السوق السعودي) تصمم أنظمتها بمواصفات دقيقة لكل موديل، وقطعة غير أصلية قد تعمل مؤقتاً لكنها تزيد احتمال عطل لاحق أو تلغي ضمان الشركة المصنّعة إن وُجد.',
  },
  {
    question: 'كم مرة يجب فحص المصعد دورياً؟',
    answer:
      'عدد الزيارات يجب أن يكون رقماً محدداً مكتوباً في العقد نفسه (شهرياً، كل شهرين، ربع سنوي...)، لا عبارة عامة مثل "زيارات دورية حسب الحاجة" — الصياغة الغامضة تفتح الباب لتقليل عدد الزيارات الفعلية دون أن يكون لديك أساس عقدي للاعتراض.',
  },
  {
    question: `متى يحتاج مبنى مصعداً ثانياً بدل عقد صيانة أقوى ${CURRENT_YEAR}؟`,
    answer:
      'صيانة أقوى لا تحل مشكلة الحمل الزائد أو التوقف المتكرر بسبب الاستخدام المكثف فوق الطاقة التصميمية للمصعد — إن كان مبناك يشهد ازدحاماً يومياً حقيقياً (عمارة سكنية كبيرة، مبنى تجاري متعدد الطوابق) فالحل الهيكلي هو مصعد إضافي، لا مجرد عقد صيانة أكثر تكراراً.',
  },
];

const TOC_ITEMS = [
  ['elevator-contract-types', 'أنواع عقود صيانة المصاعد'],
  ['elevator-regulation', 'اشتراط الدفاع المدني الذي يغفل عنه كثيرون'],
  ['elevator-brands', 'العلامات التجارية الشائعة في السعودية'],
  ['elevator-faq', 'الأسئلة الشائعة'],
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

const CONTRACT_TYPES_TABLE = [
  { type: 'عقد شامل', covers: 'فحص دوري + إصلاحات + قطع غيار بدون تكلفة إضافية', tradeoff: 'أعلى تكلفة سنوياً، أقل مفاجآت مالية لاحقة' },
  { type: 'عقد غير شامل', covers: 'فحص دوري وتنظيف فقط', tradeoff: 'أرخص عند التوقيع، أي قطعة غيار تُحاسَب منفصلة' },
  { type: 'عقد طوارئ', covers: 'استجابة سريعة للأعطال المفاجئة فقط', tradeoff: 'لا زيارات دورية مجدولة — مناسب كملحق لا كعقد وحيد' },
];

const BRANDS_TABLE = [
  { brand: 'أوتيس (Otis)', note: 'من أقدم العلامات العالمية وأكثرها انتشاراً في المباني التجارية الكبرى' },
  { brand: 'ميتسوبيشي (Mitsubishi)', note: 'لها كيان محلي فعلي في السعودية (MELSA) منذ 1980، تركيب وصيانة مباشرة' },
  { brand: 'فوجي (Fuji)', note: 'منتشرة في المشاريع السكنية والتجارية متوسطة الحجم' },
  { brand: 'كوني (Kone)', note: 'علامة فنلندية معروفة بأنظمة التحكم الذكية في المباني الحديثة' },
  { brand: 'شندلر (Schindler)', note: 'علامة سويسرية منتشرة في المشاريع الكبرى والأبراج' },
];

export default function ElevatorMaintenanceGuidePage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'المصاعد', item: `${SITE_URL}/tools/elevators` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['بنود عقد صيانة المصعد', 'اشتراطات الدفاع المدني للمصاعد'],
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

      <ToolTopAdSlot slotId="top-elevators-maintenance" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-elevators-maintenance" /></div>

        <article className="tool-v2-lane-article">
          <section id="elevator-contract-types">
            <h2>أنواع عقود صيانة المصاعد</h2>
            <p>
              ثلاثة أنواع تتكرر في السوق، ولكل منها موازنة مختلفة بين التكلفة الأولية وحجم
              المفاجآت المالية اللاحقة:
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>النوع</th>
                    <th>يغطي</th>
                    <th>الموازنة</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRACT_TYPES_TABLE.map((row) => (
                    <tr key={row.type}>
                      <td>{row.type}</td>
                      <td>{row.covers}</td>
                      <td>{row.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PlainBlock eyebrow="السؤال الحقيقي قبل التوقيع" title="ليس أي عقد أرخص، بل أي عقد أوفر فعلياً">
              العقد غير الشامل يبدو أوفر عند المقارنة الأولى، لكن مصعداً بعمر أكبر من بضع سنوات
              يحتاج غالباً قطعة غيار واحدة على الأقل سنوياً — احسب تكلفة القطع المحتملة قبل
              المقارنة، لا سعر العقد وحده.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-elevators-maintenance-1" />

          <section id="elevator-regulation">
            <h2>اشتراط الدفاع المدني الذي يغفل عنه كثيرون</h2>
            <p>
              معظم النقاش حول عقود الصيانة يركّز على السعر ونوع العقد، بينما اشتراط تنظيمي حقيقي
              يُغفَل غالباً: يجب ربط المصعد بنظام إنذار الحريق في المبنى، بحيث يعود تلقائياً إلى
              طابق آمن ويتوقف عن الاستخدام العادي فور تفعيل الإنذار — هذا ليس ميزة تسويقية
              اختيارية، بل اشتراط سلامة معتمد من الدفاع المدني في السعودية.
            </p>
            <PlainBlock eyebrow="تحقق قبل التوقيع، لا بعده" title="اطلب رقم اعتماد الشركة">
              الدفاع المدني ينشر قائمة رسمية بشركات فحص المصاعد المعتمدة لديه — اطلب من مقدّم
              الخدمة إثباتاً فعلياً لاعتماده، لا تصريحاً شفهياً فقط. استخدم المدقق أعلاه للتأكد
              من هذا البند تحديداً قبل توقيع أي عقد.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-elevators-maintenance-2" />

          <section id="elevator-brands">
            <h2>العلامات التجارية الشائعة في السعودية</h2>
            <p>
              خمس علامات تغطي معظم المصاعد المُركَّبة في السوق السعودي — معرفة علامة مصعدك تحدد
              أي فني يملك قطع الغيار الأصلية والخبرة المناسبة لصيانته:
            </p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead>
                  <tr>
                    <th>العلامة</th>
                    <th>ملاحظة</th>
                  </tr>
                </thead>
                <tbody>
                  {BRANDS_TABLE.map((row) => (
                    <tr key={row.brand}>
                      <td>{row.brand}</td>
                      <td>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="elevator-faq">
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

          <section id="elevator-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://rayde.sa/blog/%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D8%B7%D8%A7%D8%AA-%D8%A7%D9%84%D8%AF%D9%81%D8%A7%D8%B9-%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A-%D9%84%D9%84%D9%85%D8%B5%D8%A7%D8%B9%D8%AF/" target="_blank" rel="noreferrer">ريد — اشتراطات الدفاع المدني للمصاعد</a> — مصدر اشتراط ربط المصعد بنظام إنذار الحريق.</li>
              <li><a href="https://uaj.sa/%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%81%D8%AD%D8%B5-%D8%A7%D9%84%D9%85%D8%B5%D8%A7%D8%B9%D8%AF-%D8%A7%D9%84%D9%85%D8%B9%D8%AA%D9%85%D8%AF%D8%A9-%D9%85%D9%86-%D8%A7%D9%84%D8%AF%D9%81%D8%A7%D8%B9-%D8%A7/" target="_blank" rel="noreferrer">قائمة شركات فحص المصاعد المعتمدة من الدفاع المدني</a> — مصدر اشتراط الاعتماد الرسمي.</li>
              <li><a href="https://waelelevators.com/%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1-%D8%B9%D9%82%D9%88%D8%AF-%D8%B5%D9%8A%D8%A7%D9%86%D8%A9-%D8%A7%D9%84%D9%85%D8%B5%D8%A7%D8%B9%D8%AF/" target="_blank" rel="noreferrer">مصاعد وائل — أسعار عقود الصيانة</a> — مصدر أنواع العقود الثلاثة (شامل/غير شامل/طوارئ).</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><ElevatorContractChecker /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/elevators">
                <span>كل أدوات المصاعد</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
