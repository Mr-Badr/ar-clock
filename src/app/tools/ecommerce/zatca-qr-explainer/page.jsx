import Link from 'next/link';
import { QrCode } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import ZatcaQrDecoder from '@/components/tools-v2/ZatcaQrDecoder.client';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zatca-qr-explainer');

const TOC_ITEMS = [
  ['what', 'ماذا يحتوي كود QR فعلياً'],
  ['decoder', 'تحقق من كود فاتورتك الآن'],
  ['redflags', 'علامات فاتورة غير صحيحة'],
  ['faq', 'الأسئلة الشائعة'],
];

const FIELDS_INFO = [
  { code: '1', label: 'اسم البائع', desc: 'الاسم التجاري المسجَّل للمنشأة المصدرة للفاتورة.' },
  { code: '2', label: 'الرقم الضريبي', desc: 'الرقم الضريبي (VAT) المكوّن من 15 رقماً، يبدأ وينتهي غالباً بالرقم 3.' },
  { code: '3', label: 'التاريخ والوقت', desc: 'وقت إصدار الفاتورة الفعلي بصيغة موحّدة (ISO 8601).' },
  { code: '4-5', label: 'الإجمالي والضريبة', desc: 'إجمالي الفاتورة شاملاً الضريبة، وإجمالي مبلغ ضريبة القيمة المضافة وحده.' },
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
  { route: pickGuides(['zatca-eligibility'])[0], reason: 'تحقق أولاً هل منشأتك مشمولة بمرحلة الربط أصلاً' },
  { route: pickGuides(['store-profit-margin'])[0], reason: 'احسب هامش ربحك بعد إصدار فاتورة نظامية' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'من أين أحصل على النص المشفّر لكود QR؟',
    answer: 'امسح الكود بكاميرا هاتفك (تطبيق الكاميرا الافتراضي أو أي تطبيق قارئ QR) — عادة يعرض لك التطبيق النص الخام المفكوك تشفيره وخيار نسخه، حتى لو لم يتعرف عليه كرابط. انسخ ذلك النص كاملاً والصقه هنا.',
  },
  {
    question: 'هل كل فاتورة سعودية يجب أن تحتوي كود QR؟',
    answer: 'نعم، الفواتير الضريبية المبسّطة (للمستهلك النهائي) يجب أن تحتوي كود QR منذ المرحلة الأولى من الفوترة الإلكترونية (ديسمبر 2021). غياب الكود تماماً عن فاتورة ضريبية علامة تستدعي الشك.',
  },
  {
    question: 'هل يمكن لأي شخص إنشاء كود QR وهمي؟',
    answer: 'من الناحية التقنية نعم — تنسيق TLV نفسه معروف وموثّق علنياً. الحماية الحقيقية من التزوير في المرحلة الثانية تأتي من التوقيع الرقمي والتجزئة (Hash) المرفقين مع الفاتورة، لا من مجرد وجود كود QR يبدو صحيح الشكل. هذه الأداة تتحقق من اكتمال الحقول الأساسية فقط، لا من صحة التوقيع الرقمي الكامل.',
  },
  {
    question: 'ماذا لو كان الإجمالي في الكود مختلفاً عن المكتوب على الفاتورة؟',
    answer: 'هذا تناقض جوهري يستحق التوقف والسؤال — الكود المشفّر يُفترض أن يعكس بيانات الفاتورة نفسها تماماً. اختلاف الأرقام قد يعني خطأ في الطباعة أو، في حالات نادرة، محاولة تلاعب.',
  },
];

export default function ZatcaQrExplainerPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'التجارة الإلكترونية', item: `${SITE_URL}/tools/ecommerce` },
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

      <ToolTopAdSlot slotId="top-zatca-qr-explainer" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">تجارة إلكترونية — فحص</span>
              <h1>كود QR في فاتورتك: ماذا يخفي فعلاً، وكيف تتحقق منه</h1>
              <p className="guide-v2-lead">
                كل فاتورة ضريبية سعودية تحمل كود QR يخفي 5 معلومات حقيقية على الأقل — افهمها، ثم
                تحقق من فاتورتك أنت مباشرة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><QrCode size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  كود QR الحقيقي يحتوي دائماً <strong>5 حقول إلزامية</strong>: اسم البائع، رقمه
                  الضريبي، تاريخ الفاتورة، إجماليها، وإجمالي الضريبة — نقصان أي منها علامة تحذير.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ماذا يحتوي كود QR فعلياً</h2>
                <p>يُشفَّر كود QR بصيغة تقنية موحّدة (TLV) تحمل 5 حقول أساسية إلزامية على كل فاتورة مبسّطة:</p>
                <div className="guide-v2-type-grid">
                  {FIELDS_INFO.map((f) => (
                    <div className="guide-v2-type-card" key={f.code}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={{ background: 'var(--green-subtle)', color: 'var(--green-text)' }} aria-hidden="true">
                          {f.code}
                        </span>
                        <p className="guide-v2-type-card-title">{f.label}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>{f.desc}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zatca-qr-explainer" />

              <section id="decoder">
                <h2>تحقق من كود فاتورتك الآن</h2>
                <ZatcaQrDecoder />
              </section>

              <section id="redflags">
                <h2>علامات فاتورة غير صحيحة</h2>
                <ul>
                  <li><strong>حقل ناقص:</strong> غياب أي من الحقول الخمسة الإلزامية.</li>
                  <li><strong>رقم ضريبي غير منطقي:</strong> الرقم الضريبي السعودي يتكون من 15 رقماً بالضبط.</li>
                  <li><strong>تناقض في الأرقام:</strong> إجمالي الفاتورة أو الضريبة في الكود يختلف عمّا هو مطبوع على الفاتورة نفسها.</li>
                  <li><strong>تاريخ غير منطقي:</strong> تاريخ مستقبلي أو قديم جداً لا يتطابق مع وقت الشراء الفعلي.</li>
                </ul>
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
                <p className="guide-v2-related-head">أدوات أخرى في التجارة الإلكترونية</p>
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
            <AdBlogSidebar slotId="sidebar-zatca-qr-explainer" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
