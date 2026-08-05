import Link from 'next/link';
import { FileText } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import PestContractChecker from '@/components/tools-v2/PestContractChecker.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'pest-control-contract-checker');

const TOC_ITEMS = [
  ['compare', 'عقد سنوي مقابل معالجة لمرة واحدة'],
  ['checker', 'اعرف توصيتك الآن'],
  ['faq', 'الأسئلة الشائعة'],
];

const COMPARE_ROWS = [
  { title: 'معالجة لمرة واحدة', body: 'مناسبة لمشكلة ظهرت لأول مرة بدون تكرار سابق، في عقار سكني بلا متطلبات رقابية خاصة — تكلفة أقل مقدماً، لكن بلا متابعة دورية.' },
  { title: 'عقد صيانة دوري', body: 'أفضل لمنشآت تجارية (مطاعم، منشآت غذائية) تحتاج تقارير دورية موثّقة، أو عقارات بمشكلة متكررة سابقاً — سعر الزيارة الواحدة أقل، مع متابعة مستمرة تمنع تفاقم المشكلة.' },
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
  { route: pickGuides(['pest-control-cost-estimator'])[0], reason: 'عرفت توصيتك؟ احسب تكلفتها التقديرية الآن' },
  { route: pickGuides(['pest-control-inspection-report'])[0], reason: 'وثّق كل زيارة دورية بتقرير احترافي' },
  { route: pickGuides(['pest-control-dosage-calculator'])[0], reason: 'أداة للفني: اضبط جرعة المبيد بدقة' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'متى يستحق عقد الصيانة السنوي تكلفته الإضافية؟',
    answer: 'عندما تكون المشكلة متكررة موسمياً (كل صيف مثلاً)، أو عندما يكون العقار منشأة تجارية تحتاج توثيقاً دورياً لجهة رقابية، أو عندما يكون المبنى قديماً بمداخل محتملة متعددة للحشرات. في هذه الحالات، الزيارات الدورية المجدولة تمنع تفاقم المشكلة قبل أن تحتاج معالجة أكبر وأغلى.',
  },
  {
    question: 'هل عقد الصيانة يضمن عدم عودة الحشرات نهائياً؟',
    answer: 'لا يوجد ضمان مطلق في مكافحة الحشرات، لكن العقد الدوري يقلل احتمال تفاقم أي إصابة جديدة لأن الفني يكتشفها مبكراً في الزيارة الدورية القادمة بدل انتظارها حتى تصبح مشكلة كبيرة وواضحة.',
  },
  {
    question: 'كم عدد الزيارات المعتاد في عقد مكافحة الحشرات السنوي؟',
    answer: 'يختلف حسب نوع العقار والاتفاق، لكن الشائع تجارياً هو زيارة شهرية أو كل شهرين للمنشآت الغذائية، وزيارة كل 3 أشهر تقريباً للعقارات السكنية العادية دون مشكلة نشطة.',
  },
  {
    question: 'هل يمكن إلغاء عقد الصيانة قبل انتهاء مدته؟',
    answer: 'يعتمد على شروط العقد المتفق عليها مسبقاً — معظم العقود الجادة تنص على فترة إشعار مسبق (مثلاً 30 يوماً) لإنهاء العقد من أي طرف. تأكد من وجود هذا البند بوضوح قبل التوقيع.',
  },
  {
    question: 'هل المنشآت التجارية ملزمة قانونياً بعقد مكافحة حشرات؟',
    answer: 'في كثير من دول الخليج، المنشآت الغذائية (مطاعم، مصانع أغذية) مطالبة بتوثيق دوري لمكافحة الآفات ضمن اشتراطات السلامة الصحية للحصول على تراخيص التشغيل أو تجديدها — راجع الجهة الرقابية المختصة في بلدك للتأكد من المتطلبات الدقيقة.',
  },
];

export default function PestContractCheckerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'مكافحة الحشرات', item: `${SITE_URL}/tools/pest-control` },
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

      <ToolTopAdSlot slotId="top-pest-contract-checker" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل مكافحة حشرات — قرار</span>
              <h1>عقد صيانة سنوي أم معالجة لمرة واحدة؟</h1>
              <p className="guide-v2-lead">
                لا تعرف إن كنت بحاجة لعقد مكافحة حشرات دوري أم أن معالجة واحدة تكفيك؟ أربعة أسئلة
                سريعة عن عقارك ومدى تكرار المشكلة تعطيك توصية واضحة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><FileText size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  منشأة تجارية، مشكلة متكررة سابقاً، أو حاجة لتقرير رقابي دوري — هذه المؤشرات
                  الثلاثة ترجّح كفة العقد السنوي. غياب هذه المؤشرات في عقار سكني عادي يعني غالباً
                  أن معالجة واحدة جيدة التنفيذ كافية.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="compare">
                <h2>عقد سنوي مقابل معالجة لمرة واحدة</h2>
                <div className="guide-v2-compare-list">
                  {COMPARE_ROWS.map((row) => (
                    <div className="guide-v2-compare-card" key={row.title}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{row.title}</span></div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{row.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-pest-contract-checker" />

              <section id="checker">
                <h2>اعرف توصيتك الآن</h2>
                <p>أجب عن الأسئلة التالية بصدق حول عقارك للحصول على توصية دقيقة:</p>
                <PestContractChecker />
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
                <p className="guide-v2-related-head">أدوات أخرى في مكافحة الحشرات</p>
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
            <AdBlogSidebar slotId="sidebar-pest-contract-checker" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
