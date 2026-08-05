import Link from 'next/link';
import { Sparkle } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import DeepCleanChecker from '@/components/tools-v2/DeepCleanChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cleaning-deep-clean-checker');

const TOC_ITEMS = [
  ['difference', 'الفرق الحقيقي بين التنظيف العادي والعميق'],
  ['checker', 'اعرف توصيتك الآن'],
  ['signs', 'علامات تخبرك أن الوقت حان'],
  ['faq', 'الأسئلة الشائعة'],
];

const SIGNS = [
  { title: 'غبار يعود خلال يوم أو يومين', body: 'إذا عادت الأسطح مغبرّة بسرعة غير معتادة بعد التنظيف العادي، غالباً السبب تراكم غبار قديم خلف الأثاث وفي فتحات التكييف لا يزيله التنظيف السطحي.' },
  { title: 'رائحة غير مبررة رغم التنظيف المنتظم', body: 'روائح خفيفة مستمرة رغم التنظيف الدوري عادة مصدرها أماكن لا يصلها التنظيف العادي: تحت الأثاث، خلف الثلاجة، أو فتحات الصرف.' },
  { title: 'بقع قديمة على السجاد أو الكنب لم تختفِ', body: 'التنظيف السطحي لا يزيل البقع المتغلغلة في الألياف — تحتاج غسيلاً عميقاً بالبخار أو مواد متخصصة.' },
  { title: 'أكثر من 6 أشهر على آخر تنظيف عميق فعلي', body: 'حتى مع تنظيف دوري ممتاز، تتراكم طبقات لا يصل إليها التنظيف العادي بمرور الوقت — استخدم الأداة أدناه لمعرفة موعدك بدقة.' },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function pickGuides(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_GUIDES = [
  { route: pickGuides(['cleaning-cost-calculator'])[0], reason: 'عرفت توصيتك؟ احسب تكلفتها التقديرية الآن' },
  { route: pickGuides(['cleaning-water-tank-tracker'])[0], reason: 'تنظيف دوري آخر يستحق جدولاً ثابتاً: خزان المياه' },
  { route: pickGuides(['cleaning-quote-generator'])[0], reason: 'حوّل قرارك إلى عرض سعر جاهز للمشاركة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'ما الفرق الفعلي بين التنظيف العادي والتنظيف العميق؟',
    answer: 'التنظيف العادي يغطي الأسطح الظاهرة والاستخدام اليومي: الأرضيات، الحمام، المطبخ، وإزالة الغبار السطحي. التنظيف العميق يضيف ما لا يُلمس أسبوعياً: خلف الأثاث والأجهزة، السقوف والمراوح، إطارات النوافذ، وأحياناً غسيل السجاد والستائر. الفرق ليس في الأدوات فقط، بل في الوقت المستغرق — التنظيف العميق يحتاج غالباً ضعف وقت التنظيف العادي لنفس المساحة.',
  },
  {
    question: 'كل كم يجب عمل تنظيف عميق للمنزل؟',
    answer: 'لا توجد قاعدة واحدة تناسب الجميع — تعتمد على عدد الساكنين ووجود حيوانات أليفة ومدخنين وطبيعة استخدام المنزل. كقاعدة عامة واقعية: كل 3 إلى 6 أشهر للاستخدام المعتاد، وقد تحتاج فترة أقصر مع أسرة كبيرة أو حيوانات أليفة. أجب عن الأسئلة أعلاه لمعرفة توصيتك الدقيقة.',
  },
  {
    question: 'هل التنظيف العميق ضروري بعد الانتقال لمنزل جديد؟',
    answer: 'نعم، بغض النظر عن مدى نظافة المنزل ظاهرياً. المستأجر أو الساكن السابق قد ترك أتربة متراكمة في أماكن غير ظاهرة، وأنت لا تعرف تاريخ آخر تنظيف عميق فعلي للعقار. الأفضل عملياً هو تنظيف عميق شامل قبل نقل الأثاث، لا بعده.',
  },
  {
    question: 'هل يمكنني عمل التنظيف العميق بنفسي؟',
    answer: 'جزء كبير منه نعم — تنظيف خلف الأثاث والأجهزة وإطارات النوافذ يمكن لأي شخص القيام به بوقت كافٍ. لكن غسيل السجاد والكنب بعمق يحتاج غالباً آلة بخار متخصصة، وتنظيف فتحات التكييف الداخلية يحتاج معرفة فنية. قيّم حالتك بالأداة أعلاه، ثم قرر أي الأجزاء تنفذها بنفسك وأيها تحتاج مساعدة مختصة.',
  },
  {
    question: 'هل تنظيف يومي أو أسبوعي كافٍ بدل التنظيف العميق؟',
    answer: 'التنظيف اليومي أو الأسبوعي يمنع تراكم الاتساخ اليومي، لكنه لا يغني عن التنظيف العميق الدوري لأن معظمه يركز على الأسطح الظاهرة فقط. فكّر فيهما كطبقتين مختلفتين من العناية: الأولى تحافظ على المظهر اليومي، والثانية تمنع التراكم طويل المدى الذي لا تلاحظه يومياً.',
  },
  {
    question: 'هل هذه التوصية تنطبق على الشقق والفلل معاً؟',
    answer: 'نعم، المبدأ نفسه ينطبق بغض النظر عن نوع العقار أو الدولة الخليجية التي تسكن فيها — العوامل الحقيقية هي عدد الساكنين ووجود حيوانات أليفة وتاريخ آخر تنظيف عميق، لا مساحة العقار أو موقعه وحدهما.',
  },
];

export default function DeepCleanCheckerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التنظيف', item: `${SITE_URL}/tools/cleaning` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: PAGE.heroTitle,
    description: PAGE.description,
    inLanguage: 'ar',
    mainEntityOfPage: `${SITE_URL}${PAGE.href}`,
    keywords: PAGE.keywords,
    isAccessibleForFree: true,
    publisher: {
      '@type': 'Organization',
      name: 'ميقاتنا',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 },
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-deep-clean-checker" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تنظيف — قرار</span>
              <h1>هل تحتاج منزلك تنظيفاً عميقاً أم يكفيك التنظيف العادي؟</h1>
              <p className="guide-v2-lead">
                لا تعرف إن كان الوقت قد حان لتنظيف عميق أم أن التنظيف الدوري ما زال كافياً؟ أربعة
                أسئلة سريعة تعطيك توصية واضحة، بدل التخمين أو الانتظار حتى تتراكم المشكلة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Sparkle size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  إن مرّ أكثر من 6 أشهر على آخر تنظيف عميق، أو انتقلت لمنزل جديد مؤخراً، أو لديك
                  حيوانات أليفة وأسرة كبيرة — الاحتمال الأكبر أنك بحاجة لتنظيف عميق قريباً. أجب عن
                  الأسئلة أدناه لتوصية مخصصة بدل هذه القاعدة العامة.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="difference">
                <h2>الفرق الحقيقي بين التنظيف العادي والتنظيف العميق</h2>
                <p>
                  التنظيف العادي يحافظ على المظهر اليومي: أرضيات، حمام، مطبخ، وإزالة غبار الأسطح
                  الظاهرة. التنظيف العميق يذهب لما لا تراه يومياً — خلف الأثاث والأجهزة، السقوف
                  والمراوح، إطارات النوافذ، وأحياناً غسيل السجاد والستائر بعمق. المشكلة أن الاتساخ
                  في هذه الأماكن يتراكم بصمت لأشهر دون أن تلاحظه، حتى يصبح واضحاً فجأة.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-deep-clean-checker" />

              <section id="checker">
                <h2>اعرف توصيتك الآن</h2>
                <p>أجب عن الأسئلة التالية بصدق حول حالة منزلك للحصول على توصية دقيقة:</p>
                <DeepCleanChecker />
              </section>

              <section id="signs">
                <h2>علامات تخبرك أن الوقت حان</h2>
                <div className="guide-v2-steps">
                  {SIGNS.map((s) => (
                    <div className="guide-v2-step" key={s.title}>
                      <span className="guide-v2-step-num" aria-hidden="true" />
                      <p className="guide-v2-step-title">{s.title}</p>
                      <p className="guide-v2-step-body">{s.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {FAQ_ITEMS.map((item) => (
                    <details key={item.question}>
                      <summary>
                        {item.question}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                      </summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في التنظيف</p>
                <div className="guide-v2-related-grid">
                  {RELATED_GUIDES.map(({ route, reason }) => (
                    <Link key={route.slug} href={route.href} className="guide-v2-related-tile">
                      <p className="guide-v2-related-tile-title">{route.shortLabel}</p>
                      <p className="guide-v2-related-tile-reason">{reason}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-deep-clean-checker" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
