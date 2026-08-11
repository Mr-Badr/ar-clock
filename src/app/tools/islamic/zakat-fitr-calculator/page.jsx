import Link from 'next/link';
import { Basket, Mosque, ShieldCheck } from '@phosphor-icons/react/ssr';

import ZakatFitrCalculator from '@/components/calculators/ZakatFitrCalculator.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import CountryFlag from '@/components/shared/CountryFlag';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { MADHABS } from '@/lib/islamic/zakat-madhab';
import { FITR_REFERENCE } from '@/lib/islamic/zakat-fitr-reference';
import { getCurrencyByCode } from '@/lib/shared/arab-currencies';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-fitr-calculator');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');

const MADHAB_ICON_STYLE = {
  blue: { background: 'var(--blue-subtle)', color: 'var(--blue-text)' },
  green: { background: 'var(--green-subtle)', color: 'var(--green-text)' },
  amber: { background: 'var(--amber-subtle)', color: 'var(--amber-text)' },
  red: { background: 'color-mix(in srgb, var(--red) 14%, transparent)', color: 'var(--red-text)' },
};

const TOC_ITEMS = [
  ['what', 'ما هي زكاة الفطر ومقدارها'],
  ['calculator', 'احسب زكاة أسرتك'],
  ['rules', 'شروطها ووقت إخراجها'],
  ['per-country', 'مقدارها حسب الدولة'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

const FAQ_ITEMS = [
  {
    question: 'ما مقدار زكاة الفطر؟',
    answer:
      'الأصل أن تُخرَج طعاماً — صاعاً نبوياً عن كل فرد، ويختلف وزنه قليلاً حسب المذهب: نحو 2.04 كجم عند جمهور المالكية والشافعية والحنابلة (والاحتياط عند بعضهم تقريبه إلى 3 كجم)، أو 1.625 كجم من القمح/الزبيب و3.25 كجم من التمر/الشعير عند الحنفية. يجوز أيضاً إخراجها نقداً بما يعادل قيمة الصاع (عند الحنفية صراحة، وبفتوى معاصرة عند بعض هيئات الإفتاء في المذاهب الأخرى)، وتُحدِّد جهة الإفتاء في كل بلد هذه القيمة سنوياً حسب سعر قوت البلد وقتها.',
  },
  {
    question: 'متى يجب إخراج زكاة الفطر؟',
    answer:
      'وقتها المستحب من غروب شمس آخر يوم من رمضان حتى قبل صلاة عيد الفطر. يجوز إخراجها قبل ذلك بيوم أو يومين تيسيراً على الفقراء وتنظيماً للتوزيع، ولا يجوز تأخيرها بعد صلاة العيد بلا عذر — فإن أُخِّرت بلا عذر صارت صدقة عادية لا زكاة فطر.',
  },
  {
    question: 'على من تجب زكاة الفطر؟',
    answer:
      'تجب على كل مسلم يملك قوت يومه وليلة عيد الفطر زائداً عن حاجته الأساسية، عن نفسه وعن كل من تلزمه نفقته من أهل بيته (الزوجة والأبناء)، ويُستحب إخراجها أيضاً عن الجنين في بطن أمه.',
  },
  {
    question: 'هل يجوز إخراج زكاة الفطر نقداً عند كل المذاهب؟',
    answer:
      'الحنفية يجيزونها نقداً صراحة. المالكية من أشد المذاهب رفضاً لذلك كلاسيكياً — الطعام عندهم هو الأصل تحديداً. الشافعية والحنابلة موقفهم الكلاسيكي أيضاً الطعام، لكن بعض هيئات الإفتاء المعاصرة في هذه المذاهب تجيز النقد لتيسير التوزيع. اختر مذهبك في الحاسبة أعلاه لترى الطريقة المناسبة.',
  },
  {
    question: 'هل تختلف زكاة الفطر عن زكاة المال؟',
    answer:
      'نعم، تختلف كلياً في السبب والمقدار والوقت. زكاة الفطر مقدار ثابت لكل فرد (صاع من الطعام أو قيمته)، تجب في رمضان فقط ولا تحتاج نصاباً ولا حولاً. أما زكاة المال فهي ربع العشر (2.5%) من الأموال التي بلغت النصاب ومرّ عليها حول هجري كامل — راجع حاسبة زكاة المال الشاملة لحساب هذه الأخيرة.',
  },
];

export default function ZakatFitrCalculatorPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الأدوات الإسلامية', item: `${SITE_URL}/tools/islamic` },
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

      <ToolTopAdSlot slotId="top-zakat-fitr-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — زكاة الفطر</span>
              <h1>حاسبة زكاة الفطر حسب المذهب وعدد أفراد الأسرة</h1>
              <p className="guide-v2-lead">
                احسب زكاة الفطر لعائلتك كاملة — بالمبلغ الرسمي المُعلَن في بلدك، أو بحساب وزن
                الصاع الشرعي حسب مذهبك مضروباً في سعر القوت اليوم، أو طعاماً مباشرة — واعرف
                شروطها والوقت الصحيح لإخراجها.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Basket size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  زكاة الفطر مقدار ثابت لكل فرد (صاع من الطعام أو ما يعادله نقداً عند أغلب
                  المذاهب) تجب على كل مسلم يملك قوت يومه وليلة العيد زائداً عن حاجته، وتُخرَج قبل
                  صلاة عيد الفطر — لا علاقة لها بالنصاب أو الحول، بخلاف زكاة المال.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="what">
                <h2>ما هي زكاة الفطر ومقدارها</h2>
                <p>
                  زكاة الفطر (تُعرف أيضاً بزكاة الفطرة) صدقة واجبة على كل مسلم بمناسبة انتهاء شهر
                  رمضان، تُخرَج طعاماً أو نقداً يعادل قيمته عند أغلب المذاهب. أساسها الشرعي صاع
                  نبوي، لكن وزنه بالكيلوغرام ووسيلة إخراجه (طعاماً أو نقداً) يختلفان قليلاً حسب
                  المذهب — إليك لمحة سريعة:
                </p>
                <div className="guide-v2-type-grid">
                  {MADHABS.filter((m) => !m.recommended).map((m) => (
                    <div className="guide-v2-type-card" key={m.id}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={MADHAB_ICON_STYLE[m.color]} aria-hidden="true">
                          <Mosque size={16} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{m.name}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>وزن الصاع (قمح/دقيق): {m.rules.fitrSaaKgByStaple.wheat} كجم</li>
                        <li>يجوز نقداً: {m.rules.fitrCashAllowed ? 'نعم صراحة' : 'الأصل طعاماً'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-fitr-1" />

              <section id="calculator">
                <h2>احسب زكاة أسرتك</h2>
                <p>اختر مذهبك وطريقة الحساب المناسبة لك، وعدد أفراد أسرتك:</p>
                <ZakatFitrCalculator />
              </section>

              <section id="rules">
                <h2>شروطها ووقت إخراجها</h2>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">على من تجب</span>
                        <span className="guide-v2-compare-row-value">كل مسلم يملك قوت يومه وليلة العيد زائداً عن حاجته، عن نفسه وعمّن تلزمه نفقته.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">وقت الإخراج المستحب</span>
                        <span className="guide-v2-compare-row-value">من غروب شمس آخر يوم رمضان حتى قبل صلاة عيد الفطر.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">يجوز تقديمها</span>
                        <span className="guide-v2-compare-row-value">قبل العيد بيوم أو يومين، تيسيراً وتنظيماً للتوزيع على المستحقين.</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">لا يجوز تأخيرها</span>
                        <span className="guide-v2-compare-row-value">بعد صلاة العيد بلا عذر — تصبح حينها صدقة عادية لا زكاة فطر.</span>
                      </div>
                    </div>
                  </div>
                </div>
                <blockquote className="guide-v2-pullquote">
                  <p>
                    تبحث عن حساب زكاة أموالك (النقد والذهب والأسهم وغيرها)؟ هذه أداة مختلفة تماماً —
                    راجع <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>.
                  </p>
                </blockquote>
              </section>

              <section id="per-country">
                <h2>مقدارها حسب الدولة</h2>
                <p>
                  آخر قيمة نقدية معلنة نعرفها لكل دولة — تُحدَّد سنوياً حسب سعر القوت الغالب وقتها،
                  فتحقّق دائماً من الإعلان الرسمي لهذا العام قبل الإخراج:
                </p>
                <div className="guide-v2-type-grid">
                  {FITR_REFERENCE.map((r) => {
                    const currency = getCurrencyByCode(r.code);
                    return (
                      <div className="guide-v2-type-card" key={r.code}>
                        <div className="guide-v2-type-card-head">
                          <CountryFlag code={r.code} label={currency.country} square className="guide-v2-type-card-flag" />
                          <p className="guide-v2-type-card-title">{currency.country}</p>
                        </div>
                        <ul className="guide-v2-type-card-facts">
                          <li>{r.amount} {currency.short}{r.note ? ` (${r.note})` : ''} — عام {r.year}</li>
                          <li>المصدر: {r.source.label}</li>
                        </ul>
                      </div>
                    );
                  })}
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
                <h2 className="guide-v2-sources-head">مصادر فقهية</h2>
                <ul className="guide-v2-sources">
                  <li>
                    <a href="https://binbaz.org.sa/fatwas/9263" target="_blank" rel="noreferrer">موقع الشيخ ابن باز — مقدار الصاع في زكاة الفطر بالكيلو</a>
                  </li>
                  <li>
                    <a href="https://www.dar-alifta.org/ar/fatwa/details/11208" target="_blank" rel="noreferrer">دار الإفتاء المصرية — مقدار زكاة الفطر عند السادة الحنفية</a>
                  </li>
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  المحتوى الفقهي في هذه الصفحة مبني على مصادر سنّية معتمدة فقط ويغطي المذاهب
                  الأربعة. هذه أداة استرشادية وليست فتوى شخصية — تحقّق من المبلغ الرسمي المُعلَن
                  في بلدك لهذا العام.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-fitr-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
