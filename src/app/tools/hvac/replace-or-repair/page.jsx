import Link from 'next/link';
import { ArrowsClockwise, Drop, Lightning, Warning, Waveform } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import AcReplaceOrRepairChecker from '@/components/tools-v2/AcReplaceOrRepairChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'replace-or-repair');

const TOC_ITEMS = [
  ['rules', 'القاعدتان الأساسيتان'],
  ['checker', 'أداة القرار'],
  ['signs', 'علامات إضافية تدل على الاستبدال'],
  ['why-worth-it', 'لماذا الاستبدال أحياناً أوفر رغم التكلفة الأعلى'],
  ['faq', 'الأسئلة الشائعة'],
];

const SIGNS = [
  { title: 'تلف الكمبروسر', desc: 'أغلى قطعة في المكيف، وإصلاحها غالباً يقترب من سعر جهاز جديد', icon: Warning },
  { title: 'تسريبات متكررة', desc: 'تكرار تسريبات غاز التبريد أكثر من مرة خلال فترة قصيرة', icon: Drop },
  { title: 'اهتزاز غير طبيعي', desc: 'اهتزاز بالوحدة وقصر فترة عملها الصحيح بعد كل إصلاح', icon: Waveform },
  { title: 'فاتورة كهرباء أعلى', desc: 'ارتفاع ملحوظ رغم عدم تغيّر عادات الاستخدام', icon: Lightning },
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
  { route: pickGuides(['inverter-savings'])[0], reason: 'قررت الاستبدال؟ اعرف كم يوفر لك جهاز انفرتر جديد فعلياً' },
  { route: pickGuides(['energy-label'])[0], reason: 'عند شراء البديل، بطاقة كفاءة الطاقة تفرق فعلياً بفاتورتك' },
  { route: pickGuides(['troubleshooting'])[0], reason: 'غير متأكد من سبب العطل أصلاً؟ شخّصه أولاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'متى استبدل المكيف بدل إصلاحه؟',
    answer: 'استخدم قاعدتين معاً: عمر المكيف (10 سنوات فأكثر يميل ميزان القرار نحو الاستبدال)، وتكلفة الإصلاح مقارنة بسعر جهاز جديد (إن اقتربت من 50% أو تجاوزتها، الاستبدال أوفر عادة). إن تحقق الشرطان معاً فالاستبدال شبه مؤكد أنه القرار الأصح اقتصادياً.',
  },
  {
    question: 'ما العمر الافتراضي للمكيف؟',
    answer: 'يتراوح بين 10 و15 عاماً في المعتاد مع صيانة دورية منتظمة. بدون صيانة، أو في بيئة مغبرة/ساحلية قاسية، قد ينخفض العمر الفعلي عن هذا المدى.',
  },
  {
    question: 'هل إصلاح المكيف القديم يستحق دائماً إن كانت التكلفة رخيصة؟',
    answer: 'ليس بالضرورة — حتى لو كان الإصلاح الحالي رخيصاً، مكيف تجاوز عمره الافتراضي يميل لتكرار الأعطال، فتتراكم تكلفة الإصلاحات المتفرقة مع الوقت لتفوق سعر جهاز جديد أكثر كفاءة. انظر للتكلفة التراكمية المتوقعة، لا لتكلفة العطل الحالي فقط.',
  },
  {
    question: 'هل تكلفة استبدال ضاغط المكيف تستحق العناء؟',
    answer: 'نادراً. الضاغط هو أغلى قطعة منفردة في المكيف، وتكلفة استبداله غالباً تقترب من نصف سعر جهاز جديد كامل أو أكثر — وهو بالضبط الحد الذي تنص عليه قاعدة الـ50٪ لصالح الاستبدال بدل الإصلاح.',
  },
  {
    question: 'هل هذه القاعدة تصلح في أي دولة خليجية؟',
    answer: 'نعم، قاعدتا العمر (10 سنوات) والتكلفة (50٪ من سعر جهاز جديد) اقتصاديتان بحتتان ولا ترتبطان بدولة معينة — استخدم الأداة أعلاه بعملة بلدك (السعودية، الإمارات، الكويت، قطر، البحرين، أو عُمان) وستحصل على نفس منطق القرار.',
  },
];

export default function ReplaceOrRepairPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التكييف', item: `${SITE_URL}/tools/hvac` },
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

      <ToolTopAdSlot slotId="top-replace-or-repair" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل تكييف — قرار</span>
              <h1>استبدال المكيف أم إصلاحه؟ أداة تساعدك تقرر</h1>
              <p className="guide-v2-lead">
                عطل جديد في مكيف قديم يطرح نفس السؤال دائماً: هل يستحق الإصلاح، أم حان وقت جهاز جديد؟
                قاعدتان بسيطتان يعتمدهما فنيو الصيانة عادة تعطيك جواباً واضحاً خلال دقيقة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><ArrowsClockwise size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  إن كان مكيفك <strong>10 سنوات فأكثر</strong> والإصلاح المتوقع يقترب من <strong>نصف
                  سعر جهاز جديد</strong> أو يتجاوزه، فالاستبدال هو الخيار الأوفر. غير ذلك، الإصلاح
                  عادة خيار اقتصادي منطقي.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="rules">
                <h2>القاعدتان الأساسيتان</h2>
                <p>
                  <strong>قاعدة العمر:</strong> إن تجاوز مكيفك 10 سنوات، تميل الكفة نحو الاستبدال — ليس
                  لأنه سيتوقف عن العمل فجأة، بل لأن احتمال تكرار الأعطال يرتفع والكفاءة تنخفض مقارنة
                  بجهاز جديد.
                </p>
                <p>
                  <strong>قاعدة الـ50٪:</strong> إن كانت تكلفة الإصلاح المتوقعة تقترب من نصف سعر جهاز
                  جديد مشابه أو تتجاوزه، فالاستبدال أوفر — لأنك تدفع نصف ثمن جهاز جديد على جهاز قديم
                  سيحتاج على الأرجح إصلاحاً آخر قريباً.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-replace-or-repair" />

              <section id="checker">
                <h2>أداة القرار</h2>
                <p>أدخل عمر مكيفك وتكلفة الإصلاح الحالي المتوقع للحصول على توصية مباشرة:</p>
                <AcReplaceOrRepairChecker />
              </section>

              <section id="signs">
                <h2>علامات إضافية تدل على الاستبدال</h2>
                <p>حتى لو لم تنطبق القاعدتان تماماً بعد، هذه العلامات تستحق أخذها بجدية:</p>
                <div className="guide-v2-type-grid">
                  {SIGNS.map((s) => (
                    <div className="guide-v2-type-card" key={s.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--red-subtle)', color: 'var(--red-text)' }}>
                          <s.icon size={16} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{s.title}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{s.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="why-worth-it">
                <h2>لماذا الاستبدال أحياناً أوفر رغم التكلفة الأعلى؟</h2>
                <p>
                  جهاز جديد لا يعني فقط "توقف عن الأعطال" — الأجهزة الحديثة (خصوصاً الانفرتر) أكفأ
                  بكثير في استهلاك الكهرباء، ما يعني توفيراً شهرياً مستمراً يعوّض جزءاً من فرق السعر
                  تلقائياً. أضف لذلك ضمان المصنّع الذي يغطيك من أعطال غير متوقعة لسنوات، بعكس جهاز
                  قديم خرج من الضمان منذ زمن.
                </p>
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

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://balighni.com.sa/replace-vs-repair-ac/" target="_blank" rel="noreferrer">بلغني للصيانة — متى يكون استبدال المكيف أفضل من إصلاحه</a>
                  </li>
                  <li>
                    <a href="https://www.voltiat.com/when-is-replacing-an-old-air-conditioner-more-cost-effective-than-repairing-it/" target="_blank" rel="noreferrer">فولتيات — متى يكون استبدال المكيف القديم أوفر من إصلاحه</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في التكييف</p>
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
            <AdBlogSidebar slotId="sidebar-replace-or-repair" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
