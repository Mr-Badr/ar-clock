import Link from 'next/link';

import WorkHoursCalculator from '@/components/calculators/WorkHoursCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'work-hours-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: 'كيف أحسب راتبي من عدد ساعات العمل؟',
    answer:
      'اضرب عدد الساعات العادية في أجر الساعة الواحدة، ثم أضف أجر ساعات العمل الإضافي إن وُجدت (أجر الساعة × النسبة الإضافية × عدد الساعات الإضافية). إن كان راتبك شهرياً وليس بالساعة، استخدم رابط "راتبي شهري" في الحاسبة أعلاه لتحويله أولاً.',
  },
  {
    question: `كم نسبة أجر ساعة العمل الإضافي في السعودية ${CURRENT_YEAR}؟`,
    answer:
      'وفق المادة 107 من نظام العمل السعودي، يستحق العامل عن كل ساعة عمل إضافي أجر الساعة العادية مضافاً إليه 50% منه — أي 150% من أجر الساعة العادية إجمالاً. هذا هو الحد الأدنى النظامي؛ لا يجوز أن يقل عنه أي اتفاق في العقد.',
  },
  {
    question: 'كم نسبة أجر ساعة العمل الإضافي في الإمارات؟',
    answer:
      'وفق قانون العمل الإماراتي، ساعات العمل الإضافي العادية تُحتسب بـ125% من الأجر الأساسي (أي زيادة 25%)، بينما الساعات الإضافية الليلية (بين العاشرة مساءً والرابعة فجراً) تُحتسب بـ150% من الأجر الأساسي (زيادة 50%).',
  },
  {
    question: 'هل نسبة العمل الإضافي نفسها في كل الدول العربية؟',
    answer:
      'لا — كل دولة تحدد نسبتها الدنيا في نظامها الخاص، وقد يمنحك عقدك نسبة أعلى من الحد الأدنى النظامي لكن لا يجوز أقل منه أبداً. راجع نظام العمل في دولتك تحديداً، واستخدم النسبة الصحيحة في خيارات الحاسبة أعلاه.',
  },
  {
    question: 'ما الفرق بين الأجر بالساعة والراتب الشهري؟',
    answer:
      'الراتب الشهري رقم ثابت متفق عليه بغض النظر عن عدد الساعات الفعلي، بينما الأجر بالساعة هو الأساس الذي تُحسب عليه ساعات العمل الإضافي — حتى الموظف براتب شهري ثابت يحتاج معرفة أجر ساعته الفعلي لحساب مستحقات العمل الإضافي بدقة.',
  },
  {
    question: 'هل هذه الحاسبة تحسب الاستقطاعات والتأمينات؟',
    answer:
      'لا، هذه الحاسبة تعطيك إجمالي الراتب المستحق مقابل ساعات العمل فقط (قبل أي استقطاع). للاستقطاعات ومكافأة نهاية الخدمة، راجع حاسبات الرواتب والمزايا الخليجية المخصصة لكل دولة.',
  },
];

const TOC_ITEMS = [
  ['wh-guide', 'كيف تُحسب ساعات العمل الإضافي'],
  ['wh-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function WorkHoursCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الحضور والانصراف', item: `${SITE_URL}/tools/attendance` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['حساب ساعات العمل', 'أجر العمل الإضافي', 'حاسبة الراتب من ساعات العمل'],
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

      <ToolTopAdSlot slotId="top-work-hours-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-work-hours-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="wh-guide">
            <h2>كيف تُحسب ساعات العمل الإضافي؟</h2>
            <p>
              أي ساعة عمل تتجاوز ساعات دوامك الأساسية المتفق عليها في العقد تُعد عملاً إضافياً،
              ويستحق عنها العامل أجراً أعلى من أجر الساعة العادية — النسبة الدنيا محددة قانوناً في
              كل دولة ولا يجوز أن يقل عنها أي اتفاق، حتى لو وافق عليه العامل نفسه.
            </p>
            <p>
              في السعودية، المادة 107 من نظام العمل تنص على 150% من الأجر العادي لكل ساعة عمل
              إضافي (أجر الساعة + 50% منه). في الإمارات، النسبة 125% للساعات الإضافية العادية،
              وترتفع إلى 150% للساعات الليلية بين العاشرة مساءً والرابعة فجراً. استخدم الحاسبة
              أعلاه بالنسبة الصحيحة لدولتك وعقدك.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-work-hours-calculator" />

          <section id="wh-faq">
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

          <section id="wh-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://hrsd.gov.sa/" target="_blank" rel="noreferrer">وزارة الموارد البشرية والتنمية الاجتماعية السعودية</a> — المادة 107 من نظام العمل، نسبة أجر العمل الإضافي 150%.</li>
              <li><a href="https://www.mohre.gov.ae/" target="_blank" rel="noreferrer">وزارة الموارد البشرية والتوطين الإماراتية</a> — نسب أجر العمل الإضافي 125% و150% الليلي.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><WorkHoursCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/attendance">
                <span>كل أدوات الحضور والانصراف</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
              <Link href="/tools/gulf-finance/working-days">
                <span>حاسبة أيام العمل بين تاريخين</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
