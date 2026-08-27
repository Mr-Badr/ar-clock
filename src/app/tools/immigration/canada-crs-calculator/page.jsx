import Link from 'next/link';

import CanadaCrsCalculator from '@/components/calculators/CanadaCrsCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'canada-crs-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم نقطة احتاج للهجرة الى كندا ${CURRENT_YEAR}؟`,
    answer:
      'لا يوجد رقم ثابت واحد — الحد الأدنى للقبول (cutoff score) يتغير في كل سحب من سحوبات Express Entry حسب فئة السحب (عام، مرشح إقليمي، فرنسي، إلخ) وعدد المتقدمين في تلك الدورة. ما يهم فعلياً هو نقاطك الحقيقية مقارنة بآخر السحوبات المنشورة على الموقع الرسمي — احسب نقاطك في الأداة أعلاه، ثم قارنها بأحدث نتائج السحب لفئتك.',
  },
  {
    question: 'كيف تعمل حاسبة نقاط CRS بالضبط؟',
    answer:
      'نظام التصنيف الشامل (CRS) يقيّمك على 1,200 نقطة موزعة على 4 مجموعات: عوامل رأس المال البشري الأساسية (العمر، التعليم، اللغة، الخبرة) حتى 500 نقطة (أو 460 إن رافقك زوج/زوجة)، عوامل الزوج/الزوجة حتى 40 نقطة، انتقال المهارات (تركيبات التعليم واللغة والخبرة معاً) حتى 100 نقطة، ونقاط إضافية (الترشيح الإقليمي وغيره) حتى 600 نقطة.',
  },
  {
    question: 'ما الفرق بين هذه الحاسبة وحاسبات أخرى موجودة أونلاين؟',
    answer:
      'بعض المواقع التي تعرض "حاسبة نقاط" فعلياً نموذج تسجيل متعدد الخطوات ينتهي بطلب التواصل مع مستشار هجرة، دون إعطائك رقماً حقيقياً فورياً. هذه الأداة تعطيك رقمك المقدّر مباشرة من إدخالاتك، دون تسجيل بريد إلكتروني أو رقم هاتف.',
  },
  {
    question: 'هل الترشيح الإقليمي (PNP) يضمن القبول؟',
    answer:
      'الترشيح الإقليمي يضيف 600 نقطة كاملة إلى مجموعك — وهو رقم كبير يجعل تقريباً أي متقدم مرشح إقليمياً في مقدمة كل سحب تقريباً. لكنه لا يعني قبولاً تلقائياً بالجنسية؛ عليك أولاً الحصول على الترشيح الفعلي من المقاطعة الكندية المعنية عبر برنامجها الخاص (PNP) قبل أن تنعكس هذه النقاط في ملفك.',
  },
];

const TOC_ITEMS = [
  ['ca-guide', 'كيف يعمل نظام CRS'],
  ['ca-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function CanadaCrsCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الهجرة', item: `${SITE_URL}/tools/immigration` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['نظام التصنيف الشامل CRS', 'الهجرة الى كندا Express Entry', 'نقاط الهجرة الكندية'],
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

      <ToolTopAdSlot slotId="top-canada-crs-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-canada-crs-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="ca-guide">
            <h2>كيف يعمل نظام CRS</h2>
            <p>
              كندا لا تختار المهاجرين عشوائياً — كل متقدم عبر Express Entry يحصل على نقاط وفق
              معايير محددة رسمياً (نظام التصنيف الشامل CRS)، ثم تُدعى أعلى النقاط في كل سحب دوري
              لتقديم طلب الإقامة الدائمة الفعلي. فهم كيفية توزيع هذه النقاط بدقة يوفر عليك وقتاً
              كبيراً قبل الالتزام بأي خطوة تحضيرية مكلفة (كامتحان لغة أو تقييم شهادة).
            </p>
            <p>
              أكبر فرق بين رقمك التقديري ونتيجتك الفعلية عادة ما يأتي من قسم "انتقال المهارات" —
              وهو تراكم إضافي عندما تجتمع لديك مؤهلات قوية في أكثر من محور معاً (تعليم عالٍ مع لغة
              قوية، أو خبرة كندية مع خبرة أجنبية طويلة)، وليس مجرد جمع بسيط للعوامل كلٌ على حدة.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-canada-crs-calculator" />

          <section id="ca-faq">
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

          <section id="ca-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system.html" target="_blank" rel="noreferrer">canada.ca (IRCC)</a> — المصدر الرسمي الكامل لجدول نقاط CRS.</li>
              <li><a href="https://immigration.ca/express-entry-crs-grid/" target="_blank" rel="noreferrer">immigration.ca</a> — شرح مفصل لجدول النقاط بالإنجليزية، استُخدم للتحقق المتقاطع من القيم.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><CanadaCrsCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/immigration">
                <span>كل أدوات الهجرة</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
