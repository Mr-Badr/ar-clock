import Link from 'next/link';

import AgeCountdownTool from '@/components/calculators/age/AgeCountdownTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'countdown');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'كم باقي على عيد ميلادي؟', answer: 'أدخل تاريخ ميلادك وستعرض الصفحة عداداً حياً حتى عيد ميلادك القادم بالأيام والساعات والدقائق والثواني، مع تاريخ العيد واليوم الذي سيوافقه.' },
  { question: 'ماذا يحدث إذا كان عيد ميلادي مرّ هذا العام؟', answer: 'تنتقل الحاسبة تلقائياً إلى عيد ميلادك في السنة التالية. لا تحتاج إلى تغيير السنة يدوياً، لأن المطلوب هو العيد القادم لا تاريخ الميلاد الأصلي فقط.' },
  { question: 'هل العداد يعمل بتوقيت بلدي؟', answer: 'العداد يعتمد على تاريخ ووقت جهازك، لذلك يقرأ اليوم الحالي ومنتصف الليل محلياً. إذا كان وقت جهازك خاطئاً فقد تظهر نتيجة غير دقيقة قرب نهاية اليوم.' },
  { question: 'ما فائدة نسبة التقدم بين عيدين؟', answer: 'النسبة تخبرك أين أنت بين آخر عيد ميلاد والعيد القادم. أحياناً يكون رقم الأيام كبيراً، لكن نسبة التقدم تجعل الصورة أسهل: كم مضى من السنة الشخصية وكم بقي.' },
];
const decisionRows = [
  ['أريد جواباً سريعاً', 'الأيام المتبقية', 'اقرأ عدد الأيام أولاً، فهو أنسب رقم للرسائل والسؤال اليومي.'],
  ['أريد عداداً يتحرك', 'الساعات والدقائق والثواني', 'استخدمها عندما تتابع العداد الآن أو تريد لقطة قبل المناسبة.'],
  ['أريد موعد العيد القادم', 'تاريخ عيد الميلاد القادم', 'اقرأ اليوم والتاريخ لتعرف هل يأتي هذا العام أم السنة التالية.'],
  ['أريد فهم السنة الشخصية', 'نسبة التقدم بين عيدين', 'تفيد عندما تريد معرفة كم مضى من السنة بين آخر عيد والقادم.'],
];
const methodItems = [
  { title: 'لا نستخدم سنة الميلاد القادمة عشوائياً', content: 'تأخذ الصفحة يوم وشهر ميلادك، ثم تبحث عن أقرب عيد ميلاد قادم. إذا كان العيد لم يأت بعد في السنة الحالية، تستخدم هذه السنة. وإذا مرّ بالفعل، تنتقل تلقائياً إلى السنة التالية.' },
  { title: 'العداد يحسب حتى بداية يوم عيدك', content: 'عندما يصل التاريخ إلى يوم عيد ميلادك، يصبح العداد صفراً عند بداية اليوم بحسب وقت جهازك. هذا يجعل النتيجة مفهومة للمشاركة، خصوصاً إذا كنت تتابعها قبل المناسبة بساعات.' },
  { title: 'التوقيت المحلي مهم', content: 'قد يكون عيد الميلاد بدأ في الإمارات مثلاً بينما لم يبدأ بعد في المغرب. لذلك يعتمد العداد على وقت جهازك المحلي بدلاً من توقيت عالمي ثابت لا يناسب كل المستخدمين.' },
  { title: 'نسبة التقدم تضيف معنى', content: 'إذا بقي 120 يوماً مثلاً فقد يبدو الرقم كبيراً، لكن نسبة التقدم توضّح هل أنت في بداية السنة الشخصية أم قرب نهايتها، وهذا يجعل القراءة أسهل وأمتع.' },
];
const sourceLinks = [
  { href: 'https://www.timeanddate.com/date/duration.html', title: 'timeanddate: حساب المدة بين تاريخين' },
  { href: 'https://aa.usno.navy.mil/faq/leap_years', title: 'US Naval Observatory: السنوات الكبيسة' },
];

const SEARCH_COVERAGE = buildPrincipalPageSearchCoverage({
  title: PAGE.heroTitle,
  keywords: PAGE.keywords,
  faqItems: quickAnswers,
});

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description,
  keywords: SEARCH_COVERAGE.metadataKeywords,
  url: `${SITE_URL}${PATH}`,
});

const TOC_ITEMS = [
  ['countdown-decision', 'أي جزء من العدّاد تحتاجه الآن؟'],
  ['countdown-method', 'كيف يحدد العدّاد عيد الميلاد القادم؟'],
  ['countdown-faq', 'الأسئلة الشائعة'],
  ['countdown-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'milestones', 'birth-day', 'planets']);

export default function AgeCountdownPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema([
        { name: 'الرئيسية', href: '/' }, { name: 'الأدوات', href: '/tools' }, { name: 'الصحة والعمر', href: '/tools/health' }, { name: PAGE.title, href: PATH },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: PAGE.title, description, path: PATH })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-age-countdown" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">{PAGE.badge}</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{description}</p>
          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>{TOC_ITEMS.map(([id, label]) => (<li key={id}><a href={`#${id}`}>{label}</a></li>))}</ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-countdown" /></div>

        <article className="tool-v2-lane-article">
          <section id="countdown-decision">
            <h2>أي جزء من العدّاد تحتاجه الآن؟</h2>
            <p>ليست كل الأرقام مهمة في كل موقف. اختر القراءة التي تخدم سؤالك: رسالة سريعة، متابعة حية، تاريخ العيد، أو فهم السنة الشخصية.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>الجزء المناسب</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-countdown" />

          <section id="countdown-method">
            <h2>كيف يحدد العدّاد عيد الميلاد القادم؟</h2>
            <p>الخطأ الشائع هو حساب الفرق مع تاريخ الميلاد الأصلي. الأداة لا تفعل ذلك؛ هي تبحث عن النسخة القادمة من يوم ميلادك.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="countdown-faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {quickAnswers.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section id="countdown-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="countdown-related">
            <h2>أدوات أخرى للعمر والوقت</h2>
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
          <div className="tool-v2-tool-panel"><AgeCountdownTool /></div>
        </div>
      </div>
    </main>
  );
}
