import Link from 'next/link';

import EuCitizenshipDurationCalculator from '@/components/calculators/EuCitizenshipDurationCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'eu-citizenship-duration-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم سنة اقامة للجنسية الفرنسية ${CURRENT_YEAR}؟`,
    answer:
      'المدة الأساسية 5 سنوات إقامة قانونية في فرنسا. تنخفض إلى سنتين فقط إذا أنهيت دراسة جامعية فرنسية لمدة سنتين أو أكثر وحصلت على الشهادة. وتُلغى تماماً (بدون حد أدنى) لللاجئين المعترف بهم، ولمن ينتمي لدولة فرنكوفونية والفرنسية لغته الأم، أو درس 5 سنوات فأكثر بالفرنسية.',
  },
  {
    question: `ما هي شروط الجنسية الالمانية ${CURRENT_YEAR}؟`,
    answer:
      'منذ إصلاح 27 يونيو 2024، انخفضت المدة الأساسية من 8 سنوات إلى 5 سنوات إقامة قانونية منتظمة في ألمانيا، إلى جانب شروط أخرى (مستوى B1 في اللغة، اجتياز اختبار الجنسية، الاكتفاء المالي الذاتي). مهم: المسار السريع بعد 3 سنوات للاندماج الاستثنائي كان جزءاً من إصلاح 2024، لكنه أُلغي فعلياً اعتباراً من 30 أكتوبر 2025 ولم يعد متاحاً — لهذا لا تجده كخيار في الحاسبة أعلاه.',
  },
  {
    question: 'هل الزواج من مواطن(ة) يقلل المدة المطلوبة؟',
    answer:
      'نعم في الحالتين لكن بشروط مختلفة. في فرنسا: 4 سنوات زواج مع إقامة مشتركة في فرنسا (أو 5 سنوات إذا كانت الإقامة خارج فرنسا). في ألمانيا: 3 سنوات إقامة قانونية بشرط أن يكون الزواج أو الشراكة المسجلة قائماً منذ سنتين على الأقل.',
  },
  {
    question: 'هل بلوغ المدة يكفي وحده للحصول على الجنسية؟',
    answer:
      'لا — المدة شرط أساسي لكنه ليس الوحيد. في الحالتين تحتاج أيضاً إلى مستوى لغة كافٍ، حسن سيرة وسلوك (عدم وجود سوابق جنائية خطيرة)، واجتياز اختبار معرفة عامة بالبلد والدستور. الحاسبة تحسب فقط شرط المدة الزمنية، وباقي الشروط منفصلة عنها تماماً.',
  },
];

const TOC_ITEMS = [
  ['eu-guide', 'المدة المطلوبة حسب الدولة والحالة'],
  ['eu-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function EuCitizenshipDurationCalculatorPage() {
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
    about: ['الجنسية الفرنسية', 'الجنسية الألمانية', 'مدة الإقامة للتجنس'],
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

      <ToolTopAdSlot slotId="top-eu-citizenship-duration-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-eu-citizenship-duration-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="eu-guide">
            <h2>المدة المطلوبة حسب الدولة والحالة</h2>
            <p>
              فرنسا وألمانيا كلتاهما تشترطان مدة إقامة قانونية دنيا قبل التقدم للجنسية، لكن المدة
              الفعلية تختلف بشكل كبير حسب حالتك الشخصية — الإقامة العادية، الزواج من مواطن(ة)،
              الدراسة الجامعية، أو وضع اللاجئ. معظم المقالات المتاحة بالعربية تذكر رقماً عاماً
              واحداً فقط دون توضيح أي الحالات ينطبق عليها فعلاً، وهو ما يسبب لبساً حقيقياً.
            </p>
            <p>
              مهم بشكل خاص لألمانيا: قانون الجنسية تغيّر مرتين خلال أقل من عامين — تخفيض المدة
              الأساسية من 8 إلى 5 سنوات في يونيو 2024، ثم إلغاء المسار السريع (3 سنوات) في أكتوبر
              2025. الحاسبة أعلاه تعكس الوضع القانوني الحالي فقط، وليس قاعدة قديمة.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-eu-citizenship-duration-calculator" />

          <section id="eu-faq">
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

          <section id="eu-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F2213" target="_blank" rel="noreferrer">service-public.gouv.fr</a> — شروط التجنس الفرنسي الرسمية الكاملة.</li>
              <li><a href="https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html" target="_blank" rel="noreferrer">BAMF (المكتب الاتحادي الألماني للهجرة واللاجئين)</a> — شروط التجنس الألماني الرسمية.</li>
              <li><a href="https://www.thelocal.de/20251031/law-repealing-germanys-three-year-citizenship-track-takes-effect" target="_blank" rel="noreferrer">The Local Germany</a> — تأكيد إلغاء المسار السريع (3 سنوات) في أكتوبر 2025.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><EuCitizenshipDurationCalculator /></div>
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
