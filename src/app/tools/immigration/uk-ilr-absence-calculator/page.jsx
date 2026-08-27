import Link from 'next/link';

import UkIlrAbsenceCalculator from '@/components/calculators/UkIlrAbsenceCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'uk-ilr-absence-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `ما هي قاعدة الـ180 يوماً للإقامة الدائمة في بريطانيا ${CURRENT_YEAR}؟`,
    answer:
      'وفق القاعدة CR 3.1 من الملحق الرسمي "Continuous Residence"، يجب ألا تتجاوز مدة غيابك عن بريطانيا 180 يوماً في أي نافذة 12 شهراً متتالية خلال فترة الاستقرار (عادة 5 سنوات لمسارات العامل الماهر ومرافق الزوج/الزوجة). النافذة "متحركة" — تُحتسب من أي يوم إلى ما قبله بسنة، وليست مقصورة على سنوات التقويم.',
  },
  {
    question: 'كيف تُحسب أيام الغياب بالضبط؟',
    answer:
      'تُحسب الأيام التي قضيتها فعلياً خارج بريطانيا، باستثناء يوم المغادرة ويوم العودة أنفسهما. مثلاً إذا غادرت في 1 يناير وعدت في 10 يناير، فإن عدد أيام الغياب المحتسبة هو 8 أيام وليس 9 أو 10.',
  },
  {
    question: 'ماذا يحدث إذا تجاوزت 180 يوماً في نافذة ما؟',
    answer:
      'وفق CR 4.1(e)، تجاوز الحد بدون استثناء ينطبق يقطع استمرارية إقامتك القانونية، مما قد يعني أن عليك البدء من جديد. توجد استثناءات حقيقية (CR 3.4) لا تُحتسب من ضمن الحد: المساعدة في أزمة إنسانية أو بيئية خارج البلاد، تعطل السفر بسبب كارثة طبيعية أو نزاع مسلح أو جائحة، أو ظروف قهرية شخصية مثل مرض يهدد الحياة لك أو لأحد أفراد أسرتك المقربين.',
  },
  {
    question: 'هل القاعدة نفسها تنطبق على مسار الإقامة الطويلة (10 سنوات)؟',
    answer:
      'لا — مسار "Long Residence" الذي يعتمد على 10 سنوات إقامة قانونية مستمرة له قاعدة غياب مختلفة: حد إجمالي 548 يوماً على كامل الفترة (لمن كان يعيش خارج بريطانيا قبل 11 أبريل 2024) بالإضافة إلى حد سنوي منفصل قدره 184 يوماً لكل 12 شهراً. هذه الحاسبة مصممة لمسارات الـ5 سنوات الأكثر شيوعاً تحديداً — إذا كنت على مسار الـ10 سنوات استشر مختصاً لحساب دقيق.',
  },
];

const TOC_ITEMS = [
  ['uk-guide', 'قاعدة الـ180 يوماً'],
  ['uk-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function UkIlrAbsenceCalculatorPage() {
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
    about: ['الإقامة الدائمة في بريطانيا', 'قاعدة 180 يوم', 'الاستقرار ILR'],
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

      <ToolTopAdSlot slotId="top-uk-ilr-absence-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-uk-ilr-absence-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="uk-guide">
            <h2>قاعدة الـ180 يوماً</h2>
            <p>
              معظم مسارات الاستقرار في بريطانيا (العامل الماهر، مرافق الزوج/الزوجة، وغيرها) تشترط
              إقامة قانونية مستمرة لمدة 5 سنوات قبل التقدم بطلب الإقامة الدائمة (ILR). "مستمرة" هنا
              لا تعني عدم مغادرة البلاد إطلاقاً، بل تعني ألا يتجاوز غيابك 180 يوماً في أي فترة 12
              شهراً متتالية — وهذه النافذة تتحرك مع كل رحلة تضيفها، وليست محصورة بسنوات التقويم.
            </p>
            <p>
              هذا بالضبط ما يجعل الحساب اليدوي صعباً ومعرضاً للخطأ مع تراكم عدة رحلات على مدى 5
              سنوات: نافذة واحدة قد تبدو آمنة بينما نافذة أخرى تبدأ من منتصف رحلة سابقة تتجاوز
              الحد. الحاسبة أعلاه تفحص كل نافذة محتملة تلقائياً وتخبرك بأسوأ نتيجة فعلية.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-uk-ilr-absence-calculator" />

          <section id="uk-faq">
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

          <section id="uk-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-continuous-residence" target="_blank" rel="noreferrer">gov.uk — Immigration Rules Appendix Continuous Residence</a> — القاعدة الرسمية الكاملة وقواعد الاستثناء.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><UkIlrAbsenceCalculator /></div>
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
