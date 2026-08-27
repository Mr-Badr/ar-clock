import Link from 'next/link';

import DvLotteryEligibilityChecker from '@/components/calculators/DvLotteryEligibilityChecker.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'dv-lottery-eligibility-checker');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `ما هي شروط التسجيل في قرعة الجرين كارد ${CURRENT_YEAR}؟`,
    answer:
      'شرطان أساسيان لا استثناء فيهما: أن تكون من دولة مؤهلة (القائمة تتغير كل دورة حسب عدد المهاجرين من كل دولة خلال آخر 5 سنوات — تحقق من القائمة الرسمية الحالية دائماً قبل التسجيل)، وأن تستوفي شرط التعليم أو الخبرة: إكمال الثانوية العامة، أو سنتان خبرة عمل خلال آخر 5 سنوات في مهنة تتطلب عادة سنتين تدريب أو خبرة على الأقل.',
  },
  {
    question: 'كيف أعرف هل مهنتي "مؤهلة" لشرط الخبرة؟',
    answer:
      'الجهة الرسمية تعتمد تصنيف O*NET الأمريكي لتحديد المهن التي تتطلب سنتين تدريب أو خبرة على الأقل (Job Zone 4 أو 5، أو Zone 3 ضمن نطاق تحضير مهني محدد). ابحث عن مهنتك في قاعدة بيانات O*NET الرسمية للتأكد من تصنيفها قبل الاعتماد على هذا الشرط.',
  },
  {
    question: 'هل التسجيل في قرعة الجرين كارد مجاني؟',
    answer:
      'كان مجانياً تماماً في كل الدورات السابقة، لكن ابتداءً من دورة DV-2027 فرضت وزارة الخارجية الأمريكية رسم تسجيل إلكتروني قدره دولار واحد فقط — وهو أول رسم من نوعه في تاريخ البرنامج. تحقق دائماً من الرسم الفعلي في الدورة الحالية عبر الموقع الرسمي.',
  },
  {
    question: `متى تفتح قرعة أمريكا ${CURRENT_YEAR}؟`,
    answer:
      'تاريخياً يفتح التسجيل في أوائل أكتوبر ويُغلق في أوائل نوفمبر، وتصدر النتائج في مايو من العام التالي. لكن الموعد الدقيق لكل دورة يُعلن رسمياً قبلها بفترة قصيرة فقط عبر travel.state.gov — لا تثق بأي تاريخ محدد تراه في مقال قبل أن يؤكده الموقع الرسمي نفسه.',
  },
];

const TOC_ITEMS = [
  ['dv-guide', 'شروط الأهلية بالتفصيل'],
  ['dv-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function DvLotteryEligibilityCheckerPage() {
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
    about: ['قرعة الجرين كارد', 'برنامج تأشيرة التنوع DV', 'شروط الهجرة العشوائية لأمريكا'],
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

      <ToolTopAdSlot slotId="top-dv-lottery-eligibility-checker" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-dv-lottery-eligibility-checker" /></div>

        <article className="tool-v2-lane-article">
          <section id="dv-guide">
            <h2>شروط الأهلية بالتفصيل</h2>
            <p>
              أهلية قرعة الجرين كارد تقوم على شرطين منفصلين تماماً، ويكفي عدم استيفاء أحدهما
              لإسقاط الأهلية بالكامل: بلد ميلادك (وهي القائمة الوحيدة التي تتغير كل دورة، لهذا لا
              نعرضها كقائمة ثابتة هنا — تحقق منها دائماً في الموقع الرسمي قبل التسجيل)، وشرط
              التعليم أو الخبرة العملية الذي تفحصه الحاسبة أعلاه مباشرة.
            </p>
            <p>
              كثير من طلبات التسجيل تُرفض لاحقاً ليس بسبب بلد المنشأ، بل لأن مقدم الطلب لم يفهم
              جيداً معنى "مهنة تتطلب سنتين تدريب أو خبرة" — وهو تصنيف رسمي محدد (O*NET) وليس تقديراً
              شخصياً لصعوبة العمل.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-dv-lottery-eligibility-checker" />

          <section id="dv-faq">
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

          <section id="dv-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://dvprogram.state.gov/" target="_blank" rel="noreferrer">dvprogram.state.gov</a> — الموقع الرسمي الوحيد للتسجيل والنتائج.</li>
              <li><a href="https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry.html" target="_blank" rel="noreferrer">travel.state.gov</a> — شروط الأهلية الرسمية الكاملة لبرنامج تأشيرة التنوع.</li>
              <li><a href="https://www.onetonline.org/" target="_blank" rel="noreferrer">O*NET OnLine</a> — تصنيف المهن الرسمي لتحديد "المهن المؤهلة" لشرط الخبرة.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><DvLotteryEligibilityChecker /></div>
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
