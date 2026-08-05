import Link from 'next/link';
import { CookingPot } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import KitchenCabinetCostCalculator from '@/components/tools-v2/KitchenCabinetCostCalculator.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'kitchen-cabinets-cost');

const TOC_ITEMS = [
  ['why', 'لماذا لا نعطيك رقم سعر ثابت'],
  ['calculator', 'احسب مطبخك'],
  ['factors', 'ما الذي يرفع السعر فعلياً'],
  ['faq', 'الأسئلة الشائعة'],
];

const FACTORS = [
  { title: 'الخامة', body: 'خشب طبيعي أعلى تكلفة من MDF المطلي، والكلادينج/PVC الأوفر بينهما — نفس الترتيب تقريباً في كل الأسواق حتى لو اختلفت الأرقام المطلقة.' },
  { title: 'شكل التصميم', body: 'التصميم المستقيم البسيط أوفر دائماً من حرف L، والأكثر تعقيداً (جزيرة وسطية، حرف U) يحتاج مواداً وعمالة إضافية.' },
  { title: 'الإكسسوارات', body: 'الأدراج ذاتية الإغلاق، الرفوف الدوارة، وأنظمة السحب الخفيفة تضيف تكلفة حقيقية غير مرتبطة بالخامة نفسها.' },
  { title: 'جودة التصنيع والعمالة', body: 'نفس الخامة بالضبط قد تختلف تكلفتها بفارق كبير بين ورشة وأخرى حسب دقة التصنيع وخبرة الفنيين.' },
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
  { route: pickGuides(['wood-types'])[0], reason: 'قارن خامات الخزائن (خشب طبيعي، MDF) بالتفصيل قبل القرار' },
  { route: pickGuides(['wood-calculator'])[0], reason: 'تفصّل الخزائن بنفسك؟ احسب كمية الخشب الفعلية المطلوبة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كم تكلفة تفصيل مطبخ خشب؟',
    answer: 'لا يوجد رقم ثابت يصح لكل الدول والمدن — السعر يعتمد على الخامة وشكل التصميم والعمالة المحلية وسعر الصرف. استخدم الأداة أعلاه لمعرفة عدد الوحدات ومساحة الواجهات الفعلية أولاً (هذه أرقام ثابتة)، ثم اضرب عرض سعر حقيقي استلمته من نجار محلي على طول مطبخك للتحقق من معقوليته.',
  },
  {
    question: 'كيف اعرف عدد الوحدات التي يحتاجها مطبخي؟',
    answer: 'اقسم الطول الإجمالي لخزائنك (بالمتر) على عرض الوحدة القياسية التي تفضّلها (غالباً 45 سم) — الأداة أعلاه تحسب هذا تلقائياً وتعطيك أيضاً مساحة الواجهات التقريبية بالمتر المربع.',
  },
  {
    question: 'هل عرض السعر الذي استلمته معقول؟',
    answer: 'اضرب سعر المتر الخطي المعروض عليك × طول مطبخك الفعلي، وقارن الناتج بعرض سعر ثانٍ على الأقل من نجار أو ورشة مختلفة لنفس الخامة والتصميم بالضبط — فارق كبير بين عرضين لنفس المواصفات علامة تستحق سؤالاً قبل الموافقة.',
  },
  {
    question: 'أيهما أوفر: التعامل مباشرة مع نجار أم شركة تفصيل مطابخ؟',
    answer: 'لا توجد إجابة واحدة تصح دائماً — النجار المستقل أحياناً أوفر لغياب تكاليف الشركة الإدارية، بينما الشركات الكبيرة تقدّم غالباً ضماناً وجدولة أوضح. اطلب عرضين حقيقيين مكتوبين لنفس المواصفات بالضبط قبل المقارنة.',
  },
];

export default function KitchenCabinetsCostPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'النجارة', item: `${SITE_URL}/tools/carpenter` },
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

      <ToolTopAdSlot slotId="top-kitchen-cabinets-cost" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل نجارة — احسب</span>
              <h1>احسب مطبخك: عدد الوحدات، المساحة، والتحقق من عرض السعر</h1>
              <p className="guide-v2-lead">
                "كم تكلفة تفصيل مطبخ" سؤال لا رقم ثابت له — الأسعار تختلف بشدة بين بلد وآخر بل بين
                مدينة وأخرى. بدل رقم تخميني، هذه الأداة تعطيك أرقاماً هندسية حقيقية (عدد الوحدات
                ومساحة الواجهات) تصح في أي مكان، ثم تتحقق من عرض سعر حقيقي استلمته أنت.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><CookingPot size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  عدد الوحدات ومساحة الواجهات أرقام هندسية ثابتة لا تتغير بتغيّر بلدك. أما التكلفة
                  فاطلب دائماً <strong>عرضين حقيقيين على الأقل</strong> لنفس المواصفات بالضبط، واضربهما
                  في طول مطبخك للتحقق قبل الموافقة — لا تعتمد على رقم عام من الإنترنت.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="why">
                <h2>لماذا لا نعطيك رقم سعر ثابت</h2>
                <p>
                  أسعار تفصيل المطابخ تختلف بشدة بين دولة وأخرى، بل بين مدينة وأخرى بنفس الدولة —
                  حسب تكلفة العمالة المحلية، سعر استيراد الخامات، وسعر الصرف. أي رقم عام "متوسط
                  السعر عالمياً" مضلِّل عملياً. ما يبقى ثابتاً بغض النظر عن مكانك هو <strong>الهندسة</strong>:
                  عدد الوحدات ومساحة الواجهات التي يحتاجها مطبخك بالضبط — وهذا ما تحسبه الأداة أدناه.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-kitchen-cabinets-cost" />

              <section id="calculator">
                <h2>احسب مطبخك</h2>
                <p>أدخل طول خزائنك وعرض الوحدة المفضّلة، ثم أضف عرض سعر حقيقي إن توفر لديك للتحقق منه:</p>
                <KitchenCabinetCostCalculator />
              </section>

              <section id="factors">
                <h2>ما الذي يرفع السعر فعلياً</h2>
                <div className="guide-v2-compare-list">
                  {FACTORS.map((f) => (
                    <div className="guide-v2-compare-card" key={f.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{f.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.7, color: 'var(--text-2)' }}>{f.body}</p>
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
                <p className="guide-v2-related-head">أدلة أخرى في النجارة</p>
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
            <AdBlogSidebar slotId="sidebar-kitchen-cabinets-cost" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
