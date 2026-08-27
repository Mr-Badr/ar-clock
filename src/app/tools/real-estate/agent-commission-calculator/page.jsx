import Link from 'next/link';

import RealEstateCommissionCalculator from '@/components/calculators/RealEstateCommissionCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'agent-commission-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم عمولة الوسيط العقاري في السعودية ${CURRENT_YEAR}؟`,
    answer:
      'وفق نظام الوساطة العقارية (المرسوم الملكي م/130)، لا تتجاوز عمولة الوسيط 2.5% من قيمة الصفقة في البيع، أو 2.5% من قيمة إيجار السنة الأولى فقط في عقود الإيجار — وتُضاف عليها ضريبة القيمة المضافة (15%) على مبلغ العمولة نفسه، وليس على قيمة العقار.',
  },
  {
    question: 'كم عمولة الوسيط العقاري في الإمارات؟',
    answer:
      'العرف السائد في دبي وباقي الإمارات هو 2% من سعر البيع في صفقات البيع، و5% من الإيجار السنوي في عقود الإيجار (أو رسم ثابت أيهما أعلى)، مع ضريبة قيمة مضافة 5% تُضاف على العمولة نفسها. هذه نسبة عرفية شائعة في السوق وليست سقفاً نظامياً ملزماً كما في السعودية.',
  },
  {
    question: 'من يدفع عمولة الوسيط العقاري فعلياً؟',
    answer:
      'الطرف الذي تعاقد فعلياً مع الوسيط هو من يدفع العمولة نظامياً. في السعودية غالباً البائع (للبيع) أو المالك (للإيجار). في الإمارات العرف السائد أن يدفعها المشتري في صفقات البيع، بينما تُدفع عمولة الإيجار غالباً من المستأجر. راجع عقدك الفعلي دائماً لمعرفة من يتحمّلها في حالتك.',
  },
  {
    question: 'هل يمكن أن يتفق الوسيط على عمولة أعلى من النسبة النظامية؟',
    answer:
      'في السعودية، لا — أي اتفاق يتجاوز 2.5% باطل نظاماً حتى لو وقّع عليه الطرفان، وإن تعاقد أكثر من وسيط على نفس الصفقة فمجموع عمولاتهم مجتمعة لا يتجاوز 2.5% أيضاً. في أسواق أخرى تعتمد على العرف لا النظام، النسبة قابلة للتفاوض فعلياً.',
  },
  {
    question: 'هل ضريبة القيمة المضافة تُحسب على قيمة العقار أم على العمولة فقط؟',
    answer:
      'على العمولة فقط، وليس على قيمة العقار كاملة. مثال: عمولة 50,000 ريال على صفقة بيع، تُضاف عليها ضريبة 15% من الـ50,000 (أي 7,500 ريال)، ليصبح الإجمالي المستحق للوسيط 57,500 ريال — وليس 15% من قيمة العقار كاملة.',
  },
];

const TOC_ITEMS = [
  ['re-guide', 'كيف تُحسب العمولة'],
  ['re-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function RealEstateCommissionCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'العقارات', item: `${SITE_URL}/tools/real-estate` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['عمولة الوسيط العقاري', 'حاسبة السعي العقاري', 'ضريبة القيمة المضافة على العمولة'],
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

      <ToolTopAdSlot slotId="top-agent-commission-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-agent-commission-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="re-guide">
            <h2>كيف تُحسب العمولة؟</h2>
            <p>
              العمولة تُحسب كنسبة مئوية من قيمة الصفقة، لكن الأساس يختلف بين البيع والإيجار: في
              البيع، النسبة على كامل ثمن العقار. في الإيجار، النسبة على قيمة إيجار السنة الأولى
              فقط — وليس على كامل مدة العقد إن كان لعدة سنوات. ثم تُضاف ضريبة القيمة المضافة على
              مبلغ العمولة نفسه، لا على قيمة العقار.
            </p>
            <p>
              في السعودية هذه النسبة (2.5%) سقف نظامي ملزم بموجب نظام الوساطة العقارية — لا يجوز
              لأي وسيط تجاوزها حتى برضا الطرفين. في أسواق أخرى كالإمارات، النسبة الشائعة (2% بيع،
              5% إيجار) عرف سوقي متبع وليست سقفاً نظامياً بنفس الإلزام، فهي قابلة للتفاوض فعلياً.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-agent-commission-calculator" />

          <section id="re-faq">
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

          <section id="re-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://rega.gov.sa/" target="_blank" rel="noreferrer">الهيئة العامة للعقار</a> — نظام الوساطة العقارية السعودي (المرسوم الملكي م/130)، سقف عمولة 2.5%.</li>
              <li><a href="https://www.propertyfinder.ae/blog/%D8%B9%D9%85%D9%88%D9%84%D8%A9-%D8%A7%D9%84%D9%88%D8%B3%D9%8A%D8%B7-%D8%A7%D9%84%D8%B9%D9%82%D8%A7%D8%B1%D9%8A-%D9%81%D9%8A-%D8%AF%D8%A8%D9%8A/" target="_blank" rel="noreferrer">بروبرتي فايندر</a> — النسب العرفية السائدة لعمولة الوسيط العقاري في دبي.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><RealEstateCommissionCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/real-estate">
                <span>كل أدوات العقارات</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
