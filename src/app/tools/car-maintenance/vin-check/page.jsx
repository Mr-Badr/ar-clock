import Link from 'next/link';
import { Fingerprint } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import VinDecoder from '@/components/tools-v2/VinDecoder.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'vin-check');

const TOC_ITEMS = [
  ['what', 'ما هو رقم الشاصي ولماذا تحتاجه'],
  ['decoder', 'افحص رقم الشاصي الآن'],
  ['structure', 'كيف تُقرأ الـ 17 خانة'],
  ['faq', 'الأسئلة الشائعة'],
];

const VIN_PARTS = [
  { code: '1-3', label: 'الشركة المصنّعة والدولة (WMI)', desc: 'أول 3 خانات تحدد الشركة المصنّعة والدولة أو المنطقة التي صُنعت فيها السيارة.' },
  { code: '4-8', label: 'مواصفات السيارة (VDS)', desc: 'موديل السيارة، نوع الهيكل، والمحرك — تختلف شفرتها من شركة لأخرى.' },
  { code: '9', label: 'رقم التحقق (Check Digit)', desc: 'رقم رياضي يُحسب من باقي الخانات للتأكد أن الرقم صحيح ولم يُكتب بالخطأ — إلزامي فقط في معيار أمريكا الشمالية.' },
  { code: '10', label: 'سنة الصنع', desc: 'حرف أو رقم واحد يمثّل سنة الصنع، ضمن دورة متكررة كل 30 سنة.' },
  { code: '11-17', label: 'المصنع والرقم التسلسلي', desc: 'خانة تحدد المصنع الفعلي، ثم 6 خانات هي الرقم التسلسلي الفريد لهذه السيارة تحديداً.' },
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
  { route: pickGuides(['oil-guide'])[0], reason: 'اعرف نوع الزيت المناسب بعد التأكد من مواصفات محركك' },
  { route: pickGuides(['maintenance-tracker'])[0], reason: 'تابع موعد صيانة سيارتك القادم بعد الفحص' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'أين أجد رقم الشاصي (VIN) لسيارتي؟',
    answer: 'أسهل مكان هو ملصق صغير على إطار الباب الأمامي من جهة السائق (افتح الباب وانظر للحافة المعدنية). يظهر أيضاً على استمارة/رخصة السيارة، ووثيقة التأمين، وأحياناً منقوشاً على زجاج الأمامية السفلي من جهة السائق.',
  },
  {
    question: 'هل فحص رقم الشاصي هنا مجاني فعلاً؟',
    answer: 'نعم، بالكامل ومجاناً بلا تسجيل ولا حدود عدد مرات — التحليل العام (بلد الصنع وسنة الإنتاج) يعمل داخل متصفحك مباشرة، والبيانات الإضافية تأتي من قاعدة بيانات NHTSA الأمريكية الحكومية المفتوحة مجاناً للجميع.',
  },
  {
    question: 'لماذا لا تظهر بيانات إضافية لسيارتي رغم أن الرقم صحيح؟',
    answer: 'قاعدة NHTSA الإضافية تغطي بشكل أساسي السيارات المسجّلة أو المباعة أصلاً في السوق الأمريكي. سيارة استوردتها وكالة يابانية أو كورية أو أوروبية مباشرة لسوقك المحلي غالباً لن تظهر فيها — لكن التحليل العام (بلد الصنع وسنة الإنتاج المستخرجان من الرقم نفسه) يبقى صحيحاً ويعمل لأي سيارة في العالم.',
  },
  {
    question: 'هل رقم الشاصي هو نفسه رقم اللوحة؟',
    answer: 'لا إطلاقاً — رقم اللوحة يتغيّر إذا نقلت ملكية السيارة أو غيّرت الدولة، بينما رقم الشاصي (VIN) ثابت للسيارة نفسها منذ تصنيعها ولا يتغيّر أبداً، وهو المعرّف الحقيقي والدائم للسيارة.',
  },
  {
    question: 'هل يمكن أن يكشف هذا الفحص إن كانت السيارة مسروقة أو لها حوادث؟',
    answer: 'لا — هذه الأداة تفكّ تشفير بنية الرقم نفسها فقط (المصنّع، بلد الصنع، السنة، والمواصفات الأساسية إن توفرت). فحص تاريخ الحوادث أو السرقة يحتاج تقرير سجل مركبة كامل من جهة متخصصة، وهو غالباً خدمة مدفوعة منفصلة تماماً عن فك تشفير الرقم.',
  },
];

export default function VinCheckPage() {
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

      <ToolTopAdSlot slotId="top-vin-check" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — فحص</span>
              <h1>فحص رقم الشاصي (VIN): فك تشفير فوري ومجاني بالكامل</h1>
              <p className="guide-v2-lead">
                17 خانة على سيارتك تخبرك بالكثير — بلد الصنع، سنة الإنتاج، وأحياناً المحرك والموديل
                بالضبط. افحصها الآن مجاناً بلا تسجيل، والحساب يتم مباشرة في متصفحك.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Fingerprint size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  رقم الشاصي (VIN) هو <strong>بصمة السيارة الوحيدة التي لا تتكرر أبداً</strong> —
                  الأداة أدناه تفك تشفيره فوراً، وتجلب بيانات حقيقية إضافية من قاعدة أمريكية رسمية
                  عند توفرها.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هو رقم الشاصي ولماذا تحتاجه</h2>
                <p>
                  رقم الشاصي (Vehicle Identification Number) هو معرّف عالمي فريد مكوّن دائماً من 17
                  حرفاً ورقماً، يُصنع مع السيارة نفسها ولا يتكرر مع أي سيارة أخرى في العالم — يشبه
                  تماماً بصمة الإصبع. تحتاجه عملياً عند شراء سيارة مستعملة (للتأكد أن الرقم يطابق
                  الأوراق)، عند طلب قطع غيار دقيقة لمحركك بالضبط، أو ببساطة لمعرفة تفاصيل سيارتك
                  الحقيقية دون الاعتماد على كلام البائع فقط.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-vin-check" />

              <section id="decoder">
                <h2>افحص رقم الشاصي الآن</h2>
                <VinDecoder />
              </section>

              <section id="structure">
                <h2>كيف تُقرأ الـ 17 خانة</h2>
                <p>كل مجموعة من الخانات في رقم الشاصي تحمل معنى محدداً حسب المعيار الدولي:</p>
                <div className="guide-v2-type-grid">
                  {VIN_PARTS.map((p) => (
                    <div className="guide-v2-type-card" key={p.code}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--blue-subtle)', color: 'var(--blue-text)' }} aria-hidden="true">
                          {p.code}
                        </span>
                        <p className="guide-v2-type-card-title">{p.label}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{p.desc}</li>
                      </ul>
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

              <section id="sources" aria-label="مصادر">
                <h2 className="guide-v2-sources-head">مصادر</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://vpic.nhtsa.dot.gov/api/" target="_blank" rel="noreferrer">NHTSA vPIC — قاعدة بيانات المركبات الرسمية الأمريكية (API عام مجاني)</a>
                  </li>
                  <li>
                    <a href="https://www.iso.org/standard/52200.html" target="_blank" rel="noreferrer">ISO 3779 — المعيار الدولي لبنية رقم الشاصي</a>
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
            <AdBlogSidebar slotId="sidebar-vin-check" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
