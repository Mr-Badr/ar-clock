import Link from 'next/link';

import SchengenVisaCostCalculator from '@/components/calculators/SchengenVisaCostCalculator.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'schengen-visa-cost-calculator');

const CURRENT_YEAR = new Date().getFullYear();

const FAQ_ITEMS = [
  {
    question: `كم رسوم تأشيرة شنغن ${CURRENT_YEAR}؟`,
    answer:
      'الرسم الرسمي الموحد في كل سفارات دول شنغن هو 90 يورو للبالغ (18 سنة فأكثر)، و45 يورو للطفل من 6 إلى 11 سنة، ومجاناً تماماً للطفل أقل من 6 سنوات. هذا الرسم رُفع من 80 يورو إلى 90 يورو اعتباراً من 11 يونيو 2024، وما زالت مواقع عربية كثيرة تذكر الرقم القديم.',
  },
  {
    question: 'هل يوجد رسوم إضافية غير الرسم الرسمي؟',
    answer:
      'نعم — في أغلب دول الخليج، السفارة لا تستقبل الطلبات مباشرة بل تُحوّلها إلى مركز تأشيرات خارجي مثل VFS Global أو TLScontact، وهذا المركز يضيف رسم خدمة خاصاً به فوق الرسم الرسمي. هذا الرسم متغير فعلياً حسب الدولة والمركز، لذلك تعرضه الحاسبة كتقدير قابل للتعديل، لا كرقم ثابت.',
  },
  {
    question: 'هل رسوم الأطفال أقل من رسوم البالغين؟',
    answer:
      'نعم — الطفل من عمر 6 إلى 11 سنة يدفع نصف الرسم الرسمي فقط (45 يورو بدل 90)، والطفل أقل من 6 سنوات معفى تماماً من الرسم الرسمي. رسوم مركز التأشيرات (إن وُجدت) قد لا تخضع لنفس الإعفاء، فتحقق منها مع المركز مباشرة.',
  },
  {
    question: `كم تكلفة تأشيرة شنغن للعائلة ${CURRENT_YEAR}؟`,
    answer:
      'لا يوجد رقم ثابت واحد لكل عائلة لأن التكلفة تعتمد على عدد البالغين والأطفال وأعمارهم، وهل ستضيف رسوم مركز التأشيرات أم لا. أدخل عدد أفراد عائلتك في الحاسبة أعلاه لمعرفة التكلفة الإجمالية الدقيقة لحالتك.',
  },
];

const TOC_ITEMS = [
  ['sv-guide', 'الرسم الرسمي ورسوم مركز التأشيرات'],
  ['sv-faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: FAQ_ITEMS }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

export default function SchengenVisaCostCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'السفر', item: `${SITE_URL}/tools/travel` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['رسوم تأشيرة شنغن', 'رسوم مركز التأشيرات', 'تكلفة فيزا شنغن للعائلة'],
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

      <ToolTopAdSlot slotId="top-schengen-visa-cost-calculator" />
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

        <div className="tool-v2-lane-mobile-ad"><ToolInArticleAd slotId="mobile-schengen-visa-cost-calculator" /></div>

        <article className="tool-v2-lane-article">
          <section id="sv-guide">
            <h2>الرسم الرسمي ورسوم مركز التأشيرات</h2>
            <p>
              تكلفة تأشيرة شنغن الحقيقية تتكون من جزأين مختلفين: رسم رسمي موحد تحدده دول الاتحاد
              الأوروبي (90 يورو للبالغ، 45 يورو للطفل من 6 إلى 11 سنة، ومجاناً لمن هم دون 6
              سنوات)، ورسم خدمة إضافي يفرضه مركز التأشيرات الذي تُقدّم الطلب من خلاله فعلياً — وهو
              الجزء الذي كثيراً ما يُنسى عند حساب التكلفة مسبقاً.
            </p>
            <p>
              معظم سفارات دول شنغن في الخليج والعالم العربي لا تستقبل طلبات التأشيرة مباشرة، بل
              تُحوّلها إلى مراكز خارجية متخصصة مثل VFS Global أو TLScontact، وهذه المراكز تتقاضى
              رسم خدمة خاصاً بها فوق الرسم الرسمي — ويختلف هذا الرسم فعلياً حسب الدولة والمركز
              ونوع الخدمة (عادي أم مميز)، لذلك تعرضه الحاسبة كرقم تقديري قابل للتعديل حسب المركز
              الذي ستتعامل معه.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-schengen-visa-cost-calculator" />

          <section id="sv-faq">
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

          <section id="sv-sources">
            <h2>مصادر</h2>
            <ul>
              <li><a href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy/schengen-visa-fees_en" target="_blank" rel="noreferrer">المفوضية الأوروبية — الشؤون الداخلية</a> — الرسوم الرسمية المحدثة لتأشيرة شنغن.</li>
            </ul>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel"><SchengenVisaCostCalculator /></div>
          <aside className="tool-v2-related-card" aria-label="روابط ذات صلة">
            <div className="tool-v2-related-card__head">صفحات أخرى في الأدوات</div>
            <nav className="tool-v2-related-card__list">
              <Link href="/tools/travel">
                <span>كل أدوات السفر</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </nav>
          </aside>
        </div>
      </div>
    </main>
  );
}
