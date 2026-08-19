import Link from 'next/link';
import { VideoCamera } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'cctv-buying-guide');

const WIRED_WIRELESS_CARDS = [
  {
    title: 'كاميرا سلكية',
    rows: [
      ['التركيب', 'يحتاج حفر/تمديد كابلات'],
      ['الاستقرار', 'عالٍ، غير متأثر بالشبكة'],
      ['المرونة في الموقع', 'محدودة بمسار الكابل'],
      ['الأنسب لـ', 'مواقع ثابتة قريبة من التمديدات'],
    ],
  },
  {
    title: 'كاميرا لاسلكية',
    rows: [
      ['التركيب', 'سهل، بلا كابلات'],
      ['الاستقرار', 'يعتمد على قوة الواي فاي'],
      ['المرونة في الموقع', 'أي موقع تقريباً'],
      ['الأنسب لـ', 'مواقع يصعب توصيل كابل لها'],
    ],
  },
];

const TOC_ITEMS = [
  ['wired-wireless', 'سلكية أم لاسلكية؟'],
  ['power', 'كاميرا تعمل بدون كهرباء'],
  ['maintenance', 'صيانة كاميرات المراقبة'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({ title: PAGE.heroTitle, description: PAGE.description, keywords: PAGE.keywords, url: `${SITE_URL}${PAGE.href}` });

function pickGuides(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_GUIDES = [
  { route: pickGuides(['cctv-nvr-storage-calculator'])[0], reason: 'قبل الشراء — احسب سعة التخزين التي تحتاجها فعلاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  { question: 'هل الكاميرات اللاسلكية أضعف أماناً من السلكية؟', answer: 'ليس بالضرورة إن كانت من علامة موثوقة تدعم تشفيراً حقيقياً للبث — لكن الكاميرات السلكية تبقى أكثر استقراراً في مناطق ضعف تغطية الواي فاي، ولا تتأثر بانقطاع الشبكة اللاسلكية المؤقت.' },
  { question: 'كم مسافة رؤية كاميرا المراقبة العادية؟', answer: 'يختلف بشكل كبير حسب نوع العدسة وجودة الرؤية الليلية، لكن كاميرات المراقبة المنزلية الشائعة تغطي عادة نطاقاً يكفي لمدخل منزل أو ممر متوسط الطول بوضوح مقبول، بينما الكاميرات المتخصصة بعدسات مقرّبة تصل لمسافات أبعد بكثير.' },
  { question: 'ما مدى فعالية كاميرات المراقبة العاملة بالطاقة الشمسية؟', answer: 'مناسبة جداً للمواقع البعيدة عن أي مصدر كهرباء (بوابة خارجية، مزرعة، موقف سيارات منفصل) بشرط تعرّض جيد لأشعة الشمس المباشرة معظم اليوم وبطارية داخلية كافية للتغطية الليلية — أداؤها يقل في أيام الغيوم المتتالية.' },
  { question: 'كل كم يجب صيانة كاميرات المراقبة؟', answer: 'تنظيف العدسة الخارجية من الغبار كل بضعة أسابيع يحافظ على وضوح الصورة، وفحص دوري كل بضعة أشهر للتأكد من تحديث البرنامج الداخلي (Firmware) وسلامة الكابلات أو قوة إشارة الواي فاي كافٍ لمعظم الاستخدامات المنزلية.' },
];

export default function CctvBuyingGuidePage() {
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
    { '@type': 'ListItem', position: 3, name: 'كاميرات المراقبة', item: `${SITE_URL}/tools/cctv` },
    { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
  ] };
  const articleSchema = { '@context': 'https://schema.org', '@type': 'Article', headline: PAGE.heroTitle, description: PAGE.description, inLanguage: 'ar', mainEntityOfPage: `${SITE_URL}${PAGE.href}`, keywords: PAGE.keywords, isAccessibleForFree: true, publisher: { '@type': 'Organization', name: 'ميقاتنا', url: SITE_URL, logo: { '@type': 'ImageObject', url: `${SITE_URL}/icons/icon-512.png`, width: 512, height: 512 } } };
  const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) };

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-cctv-guide" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل كاميرات المراقبة — شراء</span>
              <h1>كيف تختار كاميرات المراقبة المناسبة لمنزلك</h1>
              <p className="guide-v2-lead">
                قبل مقارنة الأسعار والماركات، ثلاثة قرارات تحدد أي نوع كاميرا تحتاجه فعلاً: سلكية
                أم لاسلكية، متصلة بالكهرباء أم بالطاقة الشمسية، وكم تحتاج من صيانة دورية لاحقاً.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><VideoCamera size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  كهرباء متوفرة ومكان ثابت؟ اختر سلكية لاستقرار أعلى. موقع بعيد بلا كهرباء وأشعة
                  شمس جيدة؟ كاميرا شمسية لاسلكية أنسب. بعد الاختيار، احسب سعة التخزين التي تحتاجها
                  بالأداة المرتبطة أدناه قبل شراء أي قرص أو جهاز NVR.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="wired-wireless">
                <h2>سلكية أم لاسلكية؟</h2>
                <p>
                  الكاميرات السلكية تعتمد على كابل تغذية وأحياناً كابل بيانات مباشر، ما يمنحها
                  استقراراً عالياً غير متأثر بضعف إشارة الواي فاي أو ازدحام الشبكة المنزلية —
                  مناسبة أكثر للمواقع الثابتة القريبة من التمديدات الكهربائية والشبكية. الكاميرات
                  اللاسلكية أسهل تركيباً في أي موقع بلا حفر أو تمديد كابلات، لكنها تعتمد على قوة
                  إشارة الواي فاي وعمر بطاريتها إن كانت تعمل بها.
                </p>
                <div className="guide-v2-compare-list">
                  {WIRED_WIRELESS_CARDS.map((card) => (
                    <div className="guide-v2-compare-card" key={card.title}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{card.title}</span>
                      </div>
                      <div className="guide-v2-compare-rows">
                        {card.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-cctv-guide" />

              <section id="power">
                <h2>كاميرا تعمل بدون كهرباء</h2>
                <p>
                  للمواقع البعيدة عن أي مصدر كهرباء (بوابة خارجية بعيدة، سور مزرعة، موقف سيارات
                  منفصل)، الكاميرات العاملة بالطاقة الشمسية مع بطارية داخلية خيار عملي حقيقي —
                  تحتاج فقط تعرضاً جيداً لأشعة الشمس معظم النهار لشحن كافٍ يغطي التشغيل الليلي.
                  أداؤها يتراجع في مواسم الغيوم المتتالية أو المناطق قليلة سطوع الشمس.
                </p>
              </section>

              <section id="maintenance">
                <h2>صيانة كاميرات المراقبة</h2>
                <p>
                  الصيانة الدورية بسيطة عادة: تنظيف عدسة الكاميرا الخارجية من الغبار والأتربة كل
                  بضعة أسابيع يحافظ على وضوح الصورة، خصوصاً في المناطق المغبرة. فحص تحديثات
                  البرنامج الداخلي (Firmware) وسلامة الكابلات أو قوة إشارة الشبكة كل بضعة أشهر
                  يمنع أعطالاً مفاجئة وقت الحاجة الفعلية للتسجيل.
                </p>
              </section>

              <section id="faq">
                <h2>الأسئلة الشائعة</h2>
                <div className="guide-v2-faq">
                  {FAQ_ITEMS.map((item) => (
                    <details key={item.question}>
                      <summary>{item.question}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            {RELATED_GUIDES.length ? (
              <div className="guide-v2-related">
                <p className="guide-v2-related-head">أدوات أخرى في كاميرات المراقبة</p>
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
            <AdBlogSidebar slotId="sidebar-cctv-guide" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
