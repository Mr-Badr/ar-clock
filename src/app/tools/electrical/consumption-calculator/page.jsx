import Link from 'next/link';

import ElectricityConsumptionCalculator from '@/components/calculators/ElectricityConsumptionCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'electricity-consumption-calculator');
const CURRENT_YEAR = new Date().getFullYear();

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_TOOLS = pickTools(['meter', 'electrical-unit-converter', 'generators']);

const TOC_ITEMS = [
  ['how-it-works', 'كيف تُحسب فاتورة الكهرباء؟'],
  ['reduce-bill', 'أكبر بنود الاستهلاك — وكيف تخفضها'],
  ['faq', 'الأسئلة الشائعة'],
];

const FAQ_ITEMS = [
  {
    question: `كيف تُحسب فاتورة الكهرباء ${CURRENT_YEAR}؟`,
    answer: 'المعادلة الأساسية: استهلاك الجهاز بالواط × عدد ساعات التشغيل يومياً × 30 يوماً ÷ 1000 = الاستهلاك الشهري بالكيلوواط/ساعة، ثم يُضرب هذا الرقم في سعر الوحدة من فاتورتك. اختر أجهزتك في الأداة أعلى الصفحة للحصول على تقدير تلقائي بدل الحساب اليدوي.',
  },
  {
    question: 'ما أكثر الأجهزة استهلاكاً للكهرباء في المنزل؟',
    answer: 'المكيفات (خاصة السبليت والمركزي) هي الأعلى استهلاكاً بفارق كبير عن باقي الأجهزة، تليها سخانات المياه الكهربائية. الثلاجة تستهلك أقل لكل ساعة لكنها تعمل 24 ساعة يومياً فيتراكم استهلاكها الشهري. الإضاءة والإلكترونيات الصغيرة عادة الأقل تأثيراً على الفاتورة رغم أنها الأكثر انتشاراً في المنزل.',
  },
  {
    question: 'هل حاسبة استهلاك الكهرباء دقيقة 100%؟',
    answer: 'تعتمد الدقة على القيم التي تُدخلها. القيم المعبأة تلقائياً نقطة بداية تقريبية فقط — لكن كل حقل (الواط، ساعات الاستخدام اليومية، عدد القطع) قابل للتعديل مباشرة في الأداة أعلى الصفحة. للحصول على أقرب تقدير ممكن، عدّل الواط ليطابق الرقم المكتوب فعلياً على ملصق جهازك أو دليل المستخدم، وعدّل الساعات لتطابق استخدامك الحقيقي بدل الاعتماد على القيمة الافتراضية.',
  },
  {
    question: 'كيف تعرف سعر الكيلوواط/ساعة في فاتورتك؟',
    answer: 'أسهل طريقة هي قسمة المبلغ الإجمالي في فاتورتك الأخيرة على عدد الكيلوواط/ساعة المستهلكة الظاهر فيها. في الأنظمة التصاعدية (الشائعة في أغلب دول الخليج)، السعر يرتفع مع ارتفاع الشريحة، فقد يختلف السعر الفعلي للوحدة الأخيرة عن متوسط فاتورتك.',
  },
  {
    question: 'لماذا يرتفع استهلاكي رغم عدم تغيير عاداتي؟',
    answer: 'الأسباب الأشيع: ارتفاع درجات الحرارة يرفع عمل المكيف تلقائياً، جهاز بدأ يفقد كفاءته (خاصة المكيف أو الثلاجة)، أو انتقالك لشريحة تسعير أعلى بسبب الاستهلاك التراكمي. راجع دليل عداد الكهرباء أدناه لتفاصيل أكثر عن أسباب الارتفاع المفاجئ في الفاتورة.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function RelatedToolsCard({ items, heading }) {
  if (!items.length) return null;
  return (
    <aside className="tool-v2-related-card" aria-label="أدوات مشابهة">
      <div className="tool-v2-related-card__head">{heading}</div>
      <nav className="tool-v2-related-card__list">
        {items.map((tool, index) => (
          <Link key={tool.slug} href={tool.href} className={index === 0 ? 'is-featured' : undefined}>
            {index === 0 ? (
              <span className="tool-v2-related-ic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>
              </span>
            ) : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function ElectricityConsumptionCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الكهرباء', item: `${SITE_URL}/tools/electrical` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['حاسبة استهلاك الكهرباء', 'تقدير فاتورة الكهرباء'],
    keywords: PAGE.keywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-electricity-consumption" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">كهرباء / حاسبة</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>

          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>
              {TOC_ITEMS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-electricity-consumption" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="how-it-works">
            <h2>كيف تُحسب فاتورة الكهرباء؟</h2>
            <p>
              كل فاتورة كهرباء مبنية على معادلة بسيطة مكررة لكل جهاز: القدرة بالواط × ساعات
              التشغيل = طاقة مستهلكة، تُجمع كل الأجهزة معاً وتُضرب في سعر الوحدة. الفرق بين فاتورة
              مرتفعة وأخرى معقولة غالباً يعود لعدد قليل من الأجهزة عالية الاستهلاك — لا لكل الأجهزة
              بالتساوي.
            </p>
            <p>
              لكن رقم الواط "النموذجي" لأي جهاز لا يعني شيئاً كثيراً وحده — مكيفان من نفس النوع
              والحجم يختلفان في الاستهلاك الفعلي حسب عمر الجهاز وكفاءته وعدد ساعات تشغيلك الحقيقية،
              وهذا يختلف من بيت لآخر. لهذا الأداة أعلى الصفحة لا تفترض رقماً ثابتاً واحداً: كل جهاز
              تختاره يظهر معه حقول واط وساعات وعدد قابلة للتعديل مباشرة — عدّلها لتطابق جهازك أنت
              فعلياً (تجد الواط الحقيقي عادة على ملصق خلفي على الجهاز أو في دليل المستخدم)، بدل
              رقم عام قد يبعد كثيراً عن استهلاكك الفعلي.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-electricity-consumption" />

          <section id="reduce-bill">
            <h2>أكبر بنود الاستهلاك — وكيف تخفضها</h2>
            <ul>
              <li>المكيفات: اضبط الحرارة عند 24 درجة بدل 20 — كل درجة أقل تزيد الاستهلاك بشكل ملحوظ</li>
              <li>سخان المياه: استخدم مؤقتاً بدل تركه يعمل باستمرار طوال اليوم</li>
              <li>الأجهزة القديمة: ثلاجة أو مكيف بعمر أكثر من 10 سنوات يستهلك أكثر بكثير من نظيره الحديث بنفس الحجم</li>
              <li>أجهزة الاستعداد (Standby): الشواحن والأجهزة الموصولة دون استخدام تستهلك قدراً صغيراً لكنه متراكم على مدار الشهر</li>
            </ul>
          </section>

          <section id="faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {FAQ_ITEMS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    {item.question}
                    <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <ElectricityConsumptionCalculator />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في الكهرباء" />
        </div>
      </div>
    </main>
  );
}
