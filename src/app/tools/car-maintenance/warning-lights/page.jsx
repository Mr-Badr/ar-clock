import Link from 'next/link';
import { CarBattery, Drop, Engine, ThermometerHot, Tire, WarningOctagon } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'warning-lights');

const TOC_ITEMS = [
  ['critical', 'أضواء حمراء — توقف فوراً'],
  ['warning', 'أضواء صفراء — راجع الورشة قريباً'],
  ['battery', 'عمر البطارية وعلامات ضعفها'],
  ['faq', 'الأسئلة الشائعة'],
];

const BATTERY_SIGNS = [
  'بطء واضح في دوران المحرك عند التشغيل (يستغرق وقتاً أطول من المعتاد)',
  'إضاءة خافتة للمصابيح، خصوصاً عند التشغيل أو مع تشغيل المكيف',
  'حاجة متكررة لشحن أو "دفع" السيارة خلال أسابيع قليلة',
  'صوت طقطقة عند إدارة المفتاح دون أن يشتغل المحرك',
  'تآكل أو مسحوق أبيض/أزرق حول أطراف البطارية',
];

const CRITICAL_LIGHTS = [
  { icon: Drop, title: 'ضغط زيت المحرك', desc: 'أوقف السيارة فوراً وأطفئ المحرك — القيادة بدون زيت كافٍ تتلف المحرك خلال دقائق.' },
  { icon: ThermometerHot, title: 'حرارة المحرك', desc: 'أوقف السيارة وأطفئ المحرك، ولا تفتح غطاء الرديتر وهو ساخن — انتظر حتى يبرد تماماً.' },
  { icon: CarBattery, title: 'البطارية / الشحن', desc: 'توجه لأقرب ورشة بأسرع وقت — قد يكون الدينامو معطلاً وستفرغ البطارية قريباً وتتوقف السيارة.' },
  { icon: WarningOctagon, title: 'نظام الفرامل', desc: 'توقف بحذر في مكان آمن — تحقق من فرامل اليد أولاً، فقد يكون السبب بسيطاً، لكن لا تكمل القيادة دون التأكد.' },
];

const WARNING_LIGHTS = [
  { icon: Engine, title: 'فحص المحرك (Check Engine)', desc: 'ليس طارئاً بالضرورة، لكن يحتاج فحصاً بجهاز قراءة الأعطال قريباً — الأسباب تتراوح من بسيطة (غطاء خزان الوقود غير محكم) إلى أعمق.' },
  { icon: Tire, title: 'ضغط الإطارات (TPMS)', desc: 'تحقق من ضغط الإطارات الأربعة في أقرب فرصة — استخدم محول الضغط في دليل الإطارات.' },
  { icon: WarningOctagon, title: 'الوسادة الهوائية (SRS)', desc: 'نظام الأمان قد لا يعمل عند الحاجة — راجع الورشة قريباً حتى لو بدت السيارة تعمل بشكل طبيعي.' },
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
  { route: pickGuides(['maintenance-tracker'])[0], reason: 'بعد حل المشكلة، تابع موعد صيانتك القادم' },
  { route: pickGuides(['oil-guide'])[0], reason: 'ضوء ضغط الزيت غالباً مرتبط بمستوى الزيت مباشرة' },
  { route: pickGuides(['tire-guide'])[0], reason: 'اضبط ضغط الإطارات عند ظهور ضوء TPMS' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'متى يجب تغيير بطارية السيارة؟',
    answer: 'العمر المتوقع 3-5 سنوات في المناخ المعتدل، لكن في حرارة الخليج الشديدة قد ينخفض إلى سنتين أو 3 فقط. أفضل مؤشر ليس العمر وحده بل العلامات الفعلية: بطء التشغيل، ضعف الإضاءة، أو حاجتك لشحنها أكثر من مرة خلال أسابيع قليلة.',
  },
  {
    question: 'ما معنى ضوء المحرك الأصفر في لوحة القيادة؟',
    answer: 'يعني أن حاسوب السيارة رصد خللاً في نظام المحرك أو انبعاثاته — لا يعني بالضرورة عطلاً خطيراً فورياً، لكن يجب فحصه بجهاز قراءة أعطال (OBD) في أقرب فرصة معقولة لمعرفة السبب الدقيق.',
  },
  {
    question: 'هل يمكن القيادة عند ظهور ضوء البطارية؟',
    answer: 'لمسافة قصيرة جداً فقط للوصول لأقرب ورشة — البطارية تعمل حينها على شحنها المتبقي فقط دون دينامو يشحنها، وستفرغ خلال وقت قصير وقد تتوقف السيارة فجأة في منتصف الطريق.',
  },
  {
    question: 'ما الفرق بين الضوء الأحمر والأصفر في لوحة القيادة؟',
    answer: 'الأحمر يعني خطراً فورياً يستدعي التوقف الآن (حرارة، ضغط زيت، فرامل) — الاستمرار بالقيادة قد يسبب ضرراً دائماً أو خطراً على السلامة. الأصفر/البرتقالي تحذير يحتاج فحصاً قريباً، لكن عادة يمكن إكمال القيادة بحذر حتى الوصول لورشة.',
  },
  {
    question: 'لماذا تضيء كل الأضواء عند تشغيل السيارة ثم تنطفئ؟',
    answer: 'هذا طبيعي تماماً — هو "اختبار ذاتي" تقوم به لوحة القيادة عند إدارة المفتاح للتأكد أن كل المصابيح تعمل. المشكلة فقط إن بقي ضوء مضاءً بعد تشغيل المحرك فعلياً ولم ينطفئ.',
  },
];

export default function WarningLightsPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'صيانة السيارة', item: `${SITE_URL}/tools/car-maintenance` },
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

      <ToolTopAdSlot slotId="top-warning-lights" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — دليل</span>
              <h1>دليل أضواء لوحة القيادة: أيها يستدعي التوقف فوراً؟</h1>
              <p className="guide-v2-lead">
                ليست كل الأضواء بنفس الخطورة — بعضها يعني "توقف الآن" وبعضها "راجع الورشة خلال أيام".
                هذا الدليل يفرّق بينها بوضوح حسب اللون والرمز.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><WarningOctagon size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  <strong>أحمر = توقف فوراً</strong> (حرارة، ضغط زيت، فرامل، بطارية) — <strong>أصفر/
                  برتقالي = راجع قريباً</strong> ولا داعي للتوقف الفوري في الغالب.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="critical">
                <h2>أضواء حمراء — توقف فوراً</h2>
                <p>هذه الأضواء تعني خطراً حقيقياً على المحرك أو السلامة — لا تكمل القيادة بها:</p>
                <div className="guide-v2-type-grid">
                  {CRITICAL_LIGHTS.map((l) => (
                    <div className="guide-v2-type-card" key={l.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--red-subtle)', color: 'var(--red-text)' }} aria-hidden="true">
                          <l.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">
                          {l.title} <span className="badge badge-danger" style={{ marginInlineStart: 'var(--space-2)' }}>توقف الآن</span>
                        </p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{l.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-warning-lights" />

              <section id="warning">
                <h2>أضواء صفراء — راجع الورشة قريباً</h2>
                <p>هذه تحتاج انتباهاً، لكن عادة يمكن إكمال القيادة بحذر حتى الوصول لورشة:</p>
                <div className="guide-v2-type-grid">
                  {WARNING_LIGHTS.map((l) => (
                    <div className="guide-v2-type-card" key={l.title}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--amber-subtle)', color: 'var(--amber-text)' }} aria-hidden="true">
                          <l.icon size={17} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">
                          {l.title} <span className="badge badge-warning" style={{ marginInlineStart: 'var(--space-2)' }}>راجع قريباً</span>
                        </p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{l.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section id="battery">
                <h2>عمر البطارية وعلامات ضعفها</h2>
                <p>
                  البطارية عادة تدوم 3 إلى 5 سنوات — لكن في حرارة الخليج الشديدة قد تنخفض إلى
                  <strong> سنتين إلى 3 سنوات فقط</strong>، لأن الحرارة العالية تسرّع التفاعلات
                  الكيميائية داخلها وتبخّر سائلها أسرع من المناخ المعتدل. علامات تدل أن البطارية
                  تضعف قبل أن تتوقف تماماً:
                </p>
                <ul>
                  {BATTERY_SIGNS.map((sign) => <li key={sign}>{sign}</li>)}
                </ul>
                <p>
                  إن احتجت تشغيل السيارة بكوابل (Jump Start): تأكد أن السيارتين مطفأتان قبل توصيل
                  الكوابل، لا تدع أطراف الكوابل تتلامس مع بعضها أو تلمس أي معدن آخر، وتجنب المحاولة
                  إطلاقاً إن رأيت تورماً أو تسرّب سائل أو تآكلاً شديداً على البطارية نفسها — هذه علامة
                  خطر حقيقي. بعد التشغيل الناجح، قد لمدة 15-20 دقيقة متواصلة ليكمل المولّد شحن البطارية
                  قبل إطفاء السيارة مجدداً.
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
                    <a href="https://www.midtronics.com/blog/why-hot-temperatures-reduce-the-lifespan-of-batteries/" target="_blank" rel="noreferrer">Midtronics — تأثير الحرارة العالية على عمر البطارية</a>
                  </li>
                  <li>
                    <a href="https://www.batteriesplus.com/blog/power/summer-heat-battery-care" target="_blank" rel="noreferrer">Batteries Plus — العناية بالبطارية في الحر الشديد</a>
                  </li>
                </ul>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدلة أخرى في صيانة السيارة</p>
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
            <AdBlogSidebar slotId="sidebar-warning-lights" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
