import Link from 'next/link';

import EgyptTransferFeeCalculator from '@/components/calculators/EgyptTransferFeeCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'egypt-transfer-fee-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم رسوم تسجيل الشقة في الشهر العقاري ${CURRENT_YEAR}؟`,
    answer:
      'رسم التسجيل رسم ثابت حسب مساحة العقار، وليس نسبة من قيمته: 500 جنيه للعقارات حتى 100 م²، 1000 جنيه حتى 200 م²، 1500 جنيه حتى 300 م²، و2000 جنيه لما فوق ذلك.',
  },
  {
    question: 'ما هي ضريبة التصرفات العقارية؟',
    answer:
      'ضريبة نسبتها 2.5% من قيمة العقد، مستحقة قانوناً على البائع عند بيع العقار. في الممارسة العملية، قد يتفق الطرفان على أن يتحملها المشتري جزئياً أو كلياً، خاصة عندما يحتاج المشتري إنهاء إجراءات النقل والمرافق بسرعة.',
  },
  {
    question: 'من يدفع رسوم التسجيل، البائع أم المشتري؟',
    answer:
      'رسوم التسجيل الثابتة عادة يتحملها المشتري لأنه المستفيد من إتمام تسجيل ملكيته. ضريبة التصرفات العقارية (2.5%) هي التزام قانوني على البائع، لكن الاتفاق الفعلي بين الطرفين قد يختلف — وثّق ذلك كتابياً في العقد دائماً.',
  },
  {
    question: 'هل توجد رسوم إضافية غير هذه؟',
    answer:
      'نعم، قد تضاف رسوم الرسم الهندسي وأتعاب التوثيق لدى الشهر العقاري حسب حالة كل معاملة — هذه الحاسبة تغطي الرسم الثابت وضريبة التصرفات فقط، وهما البندان الأساسيان في أي عملية نقل ملكية.',
  },
];

const TOC_ITEMS = [
  ['eg-guide', 'كيف تُحسب الرسوم'],
  ['eg-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function EgyptTransferFeeCalculatorPage() {
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
    about: ['رسوم الشهر العقاري', 'ضريبة التصرفات العقارية', 'تسجيل ملكية العقار في مصر'],
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

      <ToolTopAdSlot slotId="top-egypt-transfer-fee-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-egypt-transfer-fee-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="eg-guide">
            <h2>كيف تُحسب الرسوم؟</h2>
            <p>
              نقل ملكية عقار في مصر يشمل بندين أساسيين مختلفين تماماً: رسم تسجيل ثابت في الشهر
              العقاري يعتمد على مساحة العقار فقط، وضريبة تصرفات عقارية نسبتها 2.5% من قيمة العقد
              تُحسب على قيمة الصفقة كاملة.
            </p>
            <p>
              رسم التسجيل الثابت لا يتغير بتغير سعر العقار — شقة بمساحة 120 م² تدفع نفس الرسم سواء
              كانت قيمتها مليون جنيه أو ثلاثة ملايين. الضريبة وحدها هي التي ترتبط بقيمة الصفقة.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-egypt-transfer-fee-calculator" />

          <section id="eg-faq">
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

          <section id="eg-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.shorouknews.com/news/view.aspx?cdate=25022021&id=1f07ba5a-58d1-4a13-8dd8-164be3b74675" target="_blank" rel="noreferrer">بوابة الشروق</a> — تفاصيل رسوم التسجيل العقاري وضريبة التصرفات في مصر.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><EgyptTransferFeeCalculator /></div>
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
