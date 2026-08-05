import Link from 'next/link';

import BirthdayDetailsTool from '@/components/calculators/age/BirthdayDetailsTool.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildBreadcrumbSchema, buildSoftwareSchema } from '@/app/tools/health/age-page-helpers';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'birth-day');
const PATH = PAGE.href;
const description = PAGE.description;

const quickAnswers = [
  { question: 'في أي يوم وُلدت؟', answer: 'أدخل تاريخ ميلادك وستعرض الحاسبة يوم الأسبوع مباشرة، مثل السبت أو الأربعاء، مع تاريخ الميلاد الهجري وبعض التفاصيل الزمنية الخفيفة.' },
  { question: 'هل الصفحة تعرض تاريخ ميلادي بالهجري؟', answer: 'نعم. عند توفر التحويل، تعرض الصفحة التاريخ الهجري الموافق لتاريخ ميلادك حتى ترى اليوم نفسه بالتقويمين دون فتح أداة أخرى.' },
  { question: 'ما معنى نصف عيد الميلاد؟', answer: 'نصف عيد الميلاد هو تاريخ يقع بعد ستة أشهر تقريباً من عيد ميلادك أو قبله بحسب الموضع داخل السنة. نعرضه كمرجع ممتع للتقويم لا كموعد رسمي.' },
  { question: 'هل هذه الصفحة مرتبطة بالأبراج؟', answer: 'لا. الصفحة تحسب معلومات زمنية يمكن التحقق منها: يوم الأسبوع، التاريخ الموازي، الفصل، الجيل، ونصف عيد الميلاد. لا تقدم صفات شخصية أو تنبؤات.' },
];
const decisionRows = [
  ['أريد معرفة يوم الأسبوع', 'بطاقة يوم الميلاد', 'اقرأ اسم اليوم أولاً، ثم طابقه مع التاريخ الأصلي إذا ستشاركه.'],
  ['أريد تاريخ ميلادي بالهجري', 'التاريخ الهجري في الحقائق السريعة', 'استخدمه للفضول أو المقارنة، وافتح محوّل التاريخ إذا كان الاستخدام رسمياً.'],
  ['أريد نصف عيد الميلاد', 'بطاقة نصف عيد الميلاد', 'تعامل معه كتاريخ ممتع للتقويم أو التخطيط الشخصي، وليس تاريخاً رسمياً ثابتاً.'],
  ['أريد معرفة جيلي أو فصل ميلادي', 'بطاقات الجيل والفصل', 'هذه تصنيفات تعليمية خفيفة تساعد على فهم السياق الزمني، وليست حكماً على شخصيتك.'],
];
const methodItems = [
  { title: 'نبدأ بالتاريخ نفسه لا بالعمر', content: 'السؤال هنا هو: ما اليوم الذي وافق تاريخ ميلادي؟ لذلك تأخذ الحاسبة تاريخ الميلاد كما أدخلته، ثم تحدد يوم الأسبوع الموافق له وفق التقويم المستخدم في الحساب.' },
  { title: 'السنوات الكبيسة جزء من المسار', content: 'عندما تمر سنة كبيسة، يضاف يوم إلى التقويم الميلادي، وهذا يغيّر انتقال أيام الأسبوع عبر السنوات. لذلك لا يكفي أن تحفظ قاعدة بسيطة مثل "كل سنة يتقدم اليوم يوماً واحداً".' },
  { title: 'التاريخ الهجري قراءة موازية', content: 'إذا أدخلت تاريخاً ميلادياً، تعرض الصفحة التاريخ الهجري الموافق عندما يكون التحويل مدعوماً. استخدمه كقراءة موازية، ثم راجع محول التاريخ إذا كان الأمر وثيقة أو موعداً رسمياً.' },
  { title: 'نصف عيد الميلاد ليس عيداً رسمياً', content: 'نصف عيد الميلاد يساعدك على رؤية منتصف المسافة تقريباً بين عيد ميلادك الحالي والقادم. بعض الناس يستخدمونه للمشاركة أو التخطيط الخفيف، لكنه لا يحمل معنى قانونياً أو دينياً بحد ذاته.' },
];
const sourceLinks = [
  { href: 'https://www.timeanddate.com/date/weekday.html', title: 'timeanddate: حاسبة يوم الأسبوع' },
  { href: 'https://aa.usno.navy.mil/faq/leap_years', title: 'US Naval Observatory: السنوات الكبيسة' },
  { href: 'https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/', title: 'Pew Research Center: حدود الأجيال الحديثة' },
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
  ['birthday-decision', 'اختر الجزء المهم من نتيجة يوم الميلاد'],
  ['birthday-method', 'كيف تعرف الصفحة يوم ولادتك من تاريخ واحد؟'],
  ['birthday-boundaries', 'ما الذي لا تعنيه نتيجة يوم الميلاد؟'],
  ['birthday-faq', 'الأسئلة الشائعة'],
  ['birthday-sources', 'مصادر'],
];

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter((item) => item && !item.draft);
}
const RELATED_TOOLS = pickTools(['age-calculator', 'hijri', 'difference', 'countdown']);

export default function BirthdayPage() {
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: quickAnswers.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };
  const howToSchema = {
    '@context': 'https://schema.org', '@type': 'HowTo',
    name: 'كيفية معرفة يوم الميلاد',
    description: 'خطوات معرفة يوم الأسبوع الذي وُلدت فيه مع التاريخ الهجري ونصف عيد الميلاد.',
    step: [
      { '@type': 'HowToStep', name: 'أدخل تاريخ الميلاد', text: 'اختر اليوم والشهر والسنة كما تظهر في الوثيقة أو السجل الذي تعتمد عليه.' },
      { '@type': 'HowToStep', name: 'اقرأ بطاقة يوم الميلاد', text: 'ابدأ باسم يوم الأسبوع، ثم راجع التاريخ الميلادي والهجري والفصل والجيل.' },
      { '@type': 'HowToStep', name: 'راجع نصف عيد الميلاد', text: 'استخدم نصف عيد الميلاد كتاريخ خفيف للتقويم أو المشاركة، لا كموعد رسمي.' },
    ],
  };

  return (
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema([
        { name: 'الرئيسية', href: '/' }, { name: 'الأدوات', href: '/tools' }, { name: 'الصحة والعمر', href: '/tools/health' }, { name: PAGE.title, href: PATH },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildSoftwareSchema({ name: PAGE.title, description, path: PATH })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />

      <ToolTopAdSlot slotId="top-age-birth-day" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-age-birth-day" /></div>

        <article className="tool-v2-lane-article">
          <section id="birthday-decision">
            <h2>اختر الجزء المهم من نتيجة يوم الميلاد</h2>
            <p>ليس كل زائر يحتاج كل البطاقات. هذا الجدول يساعدك على قراءة النتيجة التي تخدم سؤالك مباشرة.</p>
            <div className="tool-v2-table-wrap">
              <table className="tool-v2-table">
                <thead><tr><th>السؤال</th><th>أين تقرأه؟</th><th>قاعدة عملية</th></tr></thead>
                <tbody>{decisionRows.map((row) => (<tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>))}</tbody>
              </table>
            </div>
          </section>

          <ToolInArticleAd slotId="mid-age-birth-day" />

          <section id="birthday-method">
            <h2>كيف تعرف الصفحة يوم ولادتك من تاريخ واحد؟</h2>
            <p>الفكرة أبسط مما تبدو: كل تاريخ له موضع داخل التقويم، وهذا الموضع يحدد يوم الأسبوع. السنوات الكبيسة وطول الأشهر هي السبب في أن الحساب اليدوي يخطئ كثيراً.</p>
            {methodItems.map((item) => (
              <div className="tool-v2-plain-block" key={item.title}><h3>{item.title}</h3><p>{item.content}</p></div>
            ))}
          </section>

          <section id="birthday-boundaries">
            <h2>ما الذي لا تعنيه نتيجة يوم الميلاد؟</h2>
            <p>إذا ظهر أنك وُلدت يوم الجمعة أو الاثنين، فهذا يعني أن تاريخ الميلاد وافق ذلك اليوم في التقويم. لا يعني ذلك أن شخصيتك محكومة بهذا اليوم، ولا أن مستقبلك يمكن قراءته منه. لذلك فصلنا الصفحة عن الأبراج والتنجيم، وركزنا على معلومات يمكن حسابها ومراجعتها.</p>
            <p>تصنيف الجيل أيضاً يحتاج قراءة هادئة. عندما تقول البطاقة إنك من جيل معيّن، فهي تستخدم حدوداً شائعة في الكتابة الاجتماعية لا قاعدة رسمية عالمية. قد تختلف الحدود بين مصدر وآخر، لذلك استخدمها كلمحة زمنية تساعدك على فهم السياق، لا كهوية مغلقة.</p>
            <p>أما التاريخ الهجري ونصف عيد الميلاد فهما مساعدان للتقويم والمشاركة. إذا كان السؤال مرتبطاً بوثيقة، موعد رسمي، أو إثبات عمر، فابدأ من التاريخ الأصلي وافتح محوّل التاريخ عند الحاجة.</p>
          </section>

          <section id="birthday-faq">
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

          <section id="birthday-sources">
            <h2>مصادر</h2>
            <ul>{sourceLinks.map((s) => (<li key={s.href}><a href={s.href} target="_blank" rel="noreferrer">{s.title}</a></li>))}</ul>
          </section>

          <section id="birthday-related">
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
          <div className="tool-v2-tool-panel"><BirthdayDetailsTool /></div>
        </div>
      </div>
    </main>
  );
}
