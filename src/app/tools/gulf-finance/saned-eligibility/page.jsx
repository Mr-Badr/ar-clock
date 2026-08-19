import Link from 'next/link';

import SanedEligibilityChecker from '@/components/calculators/SanedEligibilityChecker.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getFinancePageContent } from '@/lib/calculators/finance-page-content';
import { buildFinancePageSearchCoverage } from '@/lib/calculators/finance-search-coverage';
import { CONTRIBUTION_REQUIREMENTS, REGISTRATION_DEADLINE_DAYS } from '@/lib/calculators/saned-eligibility-engine';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'saned-eligibility');
const CONTENT = getFinancePageContent('saned-eligibility');
const SEARCH_COVERAGE = buildFinancePageSearchCoverage(PAGE, CONTENT);

const TOC_ITEMS = [
  ['sn-guide', 'شروط الاستحقاق الستة'],
  ['sn-contribution', 'مدة الاشتراك المطلوبة'],
  ['sn-deadline', 'مهلة التسجيل والتعويض'],
  ['sn-faq', 'الأسئلة الشائعة'],
  ['sn-sources', 'مصادر رسمية'],
  ['sn-related', 'أدوات ذات صلة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_TOOLS = pickTools([
  'domestic-worker-eligibility', 'end-of-service-benefits', 'sick-leave',
  'article-77-compensation', 'saudi-pay-dates',
]);

function PlainBlock({ eyebrow, title, children }) {
  return (
    <div className="tool-v2-plain-block">
      {eyebrow ? <span className="tool-v2-eyebrow">{eyebrow}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default function SanedEligibilityPage() {
  const faqItems = Array.isArray(CONTENT.faqItems) ? CONTENT.faqItems : [];
  const sources = Array.isArray(CONTENT.sources) ? CONTENT.sources : [];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الرواتب والمزايا الخليجية', item: `${SITE_URL}/tools/gulf-finance` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL, path: PAGE.href, name: PAGE.title, description: PAGE.description,
    about: SEARCH_COVERAGE.schemaAbout, keywords: SEARCH_COVERAGE.metadataKeywords,
  });
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-saned-elig" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{CONTENT.hero.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{CONTENT.hero.description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-saned-elig" /></div>

        <article className="tool-v2-lane-article">
          <section id="sn-guide">
            <h2>شروط الاستحقاق الستة</h2>
            <p>
              ساند نظام تأمين حقيقي تديره المؤسسة العامة للتأمينات الاجتماعية (GOSI)، لا برنامج
              دعم عام — يعني هذا أن الاستحقاق مشروط بنقاط محددة يجب توفرها كلها معاً، لا نقطة واحدة
              فقط. أكثر نقطة تُخطئ فيها الناس: النظام لا يشمل من ترك عمله بنفسه (استقالة) أو فُصل
              تأديبياً بسبب راجع إليه — فقط من فقد عمله خارج إرادته.
            </p>
            <PlainBlock eyebrow="الشرط الأهم" title="سبب فقدان العمل يحدد كل شيء">
              إن كان عقدك انتهى أو أنهى صاحب العمل خدمتك دون سبب راجع إليك (تقليص عمالة مثلاً)، فأنت
              ضمن الفئة المشمولة. أما إن استقلت بنفسك أو فُصلت تأديبياً، فلا تنطبق عليك شروط ساند
              مهما توفرت بقية النقاط.
            </PlainBlock>
            <PlainBlock eyebrow="نقطة يغفل عنها كثيرون" title="التسجيل التلقائي لا يعني استحقاقاً تلقائياً">
              كل مشترك سعودي في فرع المعاشات مسجَّل تلقائياً في نظام ساند بلا أي إجراء إضافي — لكن
              هذا لا يعني أنك ستُصرف لك تعويضاً تلقائياً عند فقدان عملك. الاستحقاق الفعلي يحتاج
              تقديم طلب فعلي خلال المهلة المحددة بعد التأكد من توفر الشروط الستة.
            </PlainBlock>
          </section>

          <ToolInArticleAd slotId="mid-saned-elig-1" />

          <section id="sn-contribution">
            <h2>مدة الاشتراك المطلوبة — ترتفع مع كل مرة تصرف فيها</h2>
            <p>
              الشرط الأكثر التباساً: المدة المطلوبة من اشتراكك في ساند ليست رقماً ثابتاً — ترتفع في
              كل مرة تطالب فيها بالتعويض مرة أخرى بعد استحقاق سابق.
            </p>
            <div className="tool-v2-chart-card">
              <div className="tool-v2-hbar-list">
                {CONTRIBUTION_REQUIREMENTS.map((req) => (
                  <div key={req.claimNumber} className="tool-v2-hbar-row">
                    <span className="tool-v2-hbar-label">{req.claimNumber >= 4 ? 'الرابعة أو أكثر' : req.label}</span>
                    <div className="tool-v2-hbar-track">
                      <div
                        className="tool-v2-hbar-fill"
                        style={{ width: `${Math.round((req.requiredMonths / 36) * 100)}%` }}
                      />
                    </div>
                    <span className="tool-v2-hbar-value">{req.requiredMonths} شهراً / آخر {req.windowMonths} شهراً</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="sn-deadline">
            <h2>مهلة التسجيل والتعويض</h2>
            <p>
              بعد فقدان عملك، أمامك {REGISTRATION_DEADLINE_DAYS} يوماً بالضبط لتسجيل طلبك عبر بوابة
              تأميناتي — التأخر عن هذه المهلة قد يفقدك الاستحقاق. أدخل تاريخ آخر يوم عمل لك في
              المدقق أعلاه ليحسب المدقق المتبقي بالضبط، لا تقريبياً.
            </p>
            <p>
              أما مبلغ التعويض فيُحسب كنسبة من متوسط أجرك الشهري الخاضع للاشتراك (60% للأشهر الثلاثة
              الأولى بحد أقصى 9,000 ريال، ثم 50% لما بعدها بحد أقصى 7,500 ريال)، لمدة أقصاها 12
              شهراً — تقدير تقريبي فقط، احسب رقمك الدقيق عبر بوابة تأميناتي بعد تقديم الطلب فعلياً.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-saned-elig-2" />

          <section id="sn-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {sources.length ? (
            <section id="sn-sources">
              <h2>مصادر رسمية</h2>
              <ul>{sources.map((source) => (<li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>{source.description ? ` — ${source.description}` : null}</li>))}</ul>
            </section>
          ) : null}

          <section id="sn-related">
            <h2>أدوات ذات صلة</h2>
            <p>بعد التأكد من أهليتك، تحقق من حقوقك المالية الأخرى:</p>
            <nav className="tool-v2-related-grid" aria-label="أدوات ذات صلة">
              {RELATED_TOOLS.map((tool) => (
                <Link key={tool.slug} href={tool.href}>
                  <span className="tool-v2-related-ic"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></svg></span>
                  {tool.shortLabel || tool.title}
                </Link>
              ))}
            </nav>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><SanedEligibilityChecker /></div>
        </div>
      </div>
    </main>
  );
}
