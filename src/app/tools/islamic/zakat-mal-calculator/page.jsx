import Link from 'next/link';
import { Coins, Mosque, ShieldCheck } from '@phosphor-icons/react/ssr';

import ZakatMalCalculator from '@/components/calculators/ZakatMalCalculator.client';
import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getZakatLivePrices } from '@/lib/islamic/zakat-live-prices';
import { MADHABS } from '@/lib/islamic/zakat-madhab';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const GOLD_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-gold-calculator');
const STOCKS_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');
const TRADE_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');
const SALARY_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-salary-calculator');
const MADHAHIB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');

// Computed once at module scope — never call `new Date()` inside a component render body, per
// docs/PLAN.md §5 step 9 and the recurring "new-Date()-in-render" prerender bug in project memory.
const CURRENT_YEAR = new Date().getFullYear();

// .guide-v2-type-card-icon has no built-in color variant (unlike .tool-v2-choice-icon--{color}) —
// set background/color inline from the same palette so the madhab icon chips still rotate color.
const MADHAB_ICON_STYLE = {
  blue: { background: 'var(--blue-subtle)', color: 'var(--blue-text)' },
  green: { background: 'var(--green-subtle)', color: 'var(--green-text)' },
  amber: { background: 'var(--amber-subtle)', color: 'var(--amber-text)' },
  red: { background: 'color-mix(in srgb, var(--red) 14%, transparent)', color: 'var(--red-text)' },
};

const TOC_ITEMS = [
  ['conditions', 'من تجب عليه الزكاة ومتى'],
  ['calculator', 'احسب زكاتك الآن'],
  ['madhahib', 'الفرق بين المذاهب الأربعة'],
  ['assets', 'زكاة كل نوع مال بالتفصيل'],
  ['recipients', 'من يستحق الزكاة'],
  ['faq', 'الأسئلة الشائعة'],
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: buildPrincipalPageSearchCoverage({ title: PAGE.heroTitle, keywords: PAGE.keywords, faqItems: [] }).metadataKeywords,
  url: `${SITE_URL}${PAGE.href}`,
});

// Rendered from real rows, not a bare paragraph — each row is {label, value}, matching
// .guide-v2-compare-row's intended structure (see plan §5.4, correcting the original build's
// misuse of .guide-v2-compare-card as a paragraph wrapper).
const ASSET_SECTIONS = [
  {
    title: 'النقد والأرصدة البنكية',
    rows: [
      ['المقدار', 'ربع العشر (2.5%)'],
      ['الشرط', 'بلوغ النصاب بمفردها أو مع بقية أموالك، ومرور حول هجري كامل'],
      ['يشمل', 'النقد الحاضر، أرصدة الحسابات الجارية والتوفير، ومحافظ الادخار السائلة'],
    ],
  },
  {
    title: 'الذهب والفضة',
    rows: [
      ['النصاب', '85 جراماً ذهباً أو 595 جراماً فضة (تقريباً — راجع قسم المذاهب لتفاصيل الاختلاف)'],
      ['الحلي المستخدم للزينة', 'يختلف حكمه باختلاف المذهب — راجع قسم "الفرق بين المذاهب" أدناه'],
      ['الشرط', 'بلوغ النصاب ومرور حول هجري كامل'],
    ],
  },
  {
    title: 'الأسهم',
    rows: [
      ['أسهم المضاربة', 'تُزكّى بكامل قيمتها السوقية يوم وجوب الزكاة، كعروض التجارة'],
      ['أسهم الاستثمار', 'تُزكّى أرباحها فقط إذا حال عليها الحول، لا أصل قيمة السهم'],
    ],
  },
  {
    title: 'عروض التجارة',
    rows: [
      ['المقدار', 'ربع العشر من القيمة السوقية يوم وجوب الزكاة (لا سعر الشراء الأصلي)'],
      ['الخصم', 'بعد حسم الديون المتعلقة بها إن وُجدت'],
    ],
  },
  {
    title: 'الديون — لك وعليك',
    rows: [
      ['مدين مليء غير مماطل', 'الزكاة واجبة كل عام حتى قبل القبض — لأنه في حكم المقبوض'],
      ['مدين معسر أو مماطل', 'لا زكاة حتى القبض الفعلي، ثم يبدأ حول جديد من تاريخ القبض'],
      ['ديون عليك', 'تُخصم من إجمالي أموالك الزكوية قبل حساب الزكاة'],
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: `كم نصاب الزكاة بالريال ${CURRENT_YEAR}؟`,
    answer:
      'النصاب ليس مبلغاً ثابتاً، بل يُحسب بوزن الذهب (85 جراماً تقريباً) أو الفضة (595 جراماً تقريباً) مضروباً في سعر السوق يوم إخراج الزكاة — لذلك يتغير قيمته يومياً مع تغير أسعار المعادن، ويختلف من عملة لأخرى. استخدم الحاسبة أعلى الصفحة لمعرفة قيمة النصاب الحالية بعملتك تلقائياً من بين 22 دولة عربية.',
  },
  {
    question: 'متى يجب اخراج الزكاة؟',
    answer:
      'تجب الزكاة عند تحقق شرطين معاً: بلوغ المال النصاب، ومرور حول هجري كامل (نحو 354 يوماً) على بلوغه النصاب دون أن ينقص عنه طوال الحول. إن نقص المال عن النصاب في أثناء الحول ثم عاد وبلغه، يبدأ حساب حول جديد من تاريخ بلوغه النصاب مجدداً.',
  },
  {
    question: 'هل تجب الزكاة على الذهب المستخدم للزينة؟',
    answer:
      'يختلف الحكم باختلاف المذهب: المذهب الحنفي يوجب الزكاة في حلي الذهب والفضة المُعَدّ للاستعمال الشخصي إذا بلغ النصاب — وهو القول الأحوط والأبرأ للذمة. أما جمهور العلماء (المالكية والشافعية والحنابلة) فيرون عدم وجوب الزكاة في الحلي المُعَدّ للُبس المعتاد غير المدَّخر. اختر مذهبك في الحاسبة أعلاه لترى أثر هذا الاختلاف على مبلغ زكاتك مباشرة.',
  },
  {
    question: 'ما الفرق بين زكاة أسهم المضاربة وأسهم الاستثمار؟',
    answer:
      'أسهم المضاربة (تُشترى وتُباع بقصد الربح من فروق الأسعار) تُزكّى بكامل قيمتها السوقية كعروض التجارة. أسهم الاستثمار (يحتفظ بها صاحبها طويلاً للاستفادة من الأرباح السنوية دون نية بيعها) تُزكّى أرباحها فقط، لا أصل قيمة السهم.',
  },
  {
    question: 'خمسة لا يجوز دفع الزكاة إليهم — من هم؟',
    answer:
      'لا يجوز دفع الزكاة لكل من: الأغنياء غير العاملين عليها، الكافر (إلا في حالة المؤلفة قلوبهم)، من تلزمك نفقته (كالزوجة والأبناء والوالدين)، بنو هاشم (آل البيت) عند جمهور العلماء، ومن ينفقها في معصية. الزكاة لها مصارف محددة بيّنها القرآن الكريم في سورة التوبة، آية 60 — انظر قسم "من يستحق الزكاة" أعلاه.',
  },
  {
    question: 'هل يجوز إعطاء الزكاة للوالدين؟',
    answer:
      'لا يجوز دفع الزكاة للوالدين ولا للأبناء ولا للزوجة، لأن نفقتهم واجبة عليك أصلاً، ودفع الزكاة لهم يعني إسقاط واجب عنك بمال الزكاة — وهذا لا يجوز عند جمهور أهل العلم. يجوز لك مع ذلك التصدق عليهم بغير الزكاة (صدقة تطوع) في أي وقت.',
  },
  {
    question: 'هل يُضم الذهب إلى الفضة لبلوغ النصاب؟',
    answer:
      'من مسائل الخلاف الفقهي: الحنفية والمالكية يجيزون ضم الذهب إلى الفضة لبلوغ النصاب إن لم يبلغه أحدهما منفرداً. أما الرواية المعتمدة عند الحنابلة (وهي ما رجع إليه الإمام أحمد أخيراً) فلا تُضم — يجب أن يبلغ كل معدن نصابه الخاص منفرداً، وهو رأي الشافعية أيضاً. هذه المسألة تخص ضم المعدنين ببعضهما تحديداً، لا قيمة النقد الذي يُقدَّر أصلاً بقيمة نصاب الذهب أو الفضة.',
  },
  {
    question: 'كيف يعمل متتبع الحول الهجري في هذه الصفحة؟',
    answer:
      'أدخل تاريخ أول يوم بلغ فيه مالك النصاب، فتُحفظ هذه المعلومة محلياً على جهازك فقط (بلا حساب أو تسجيل دخول)، وتعرض لك الصفحة تلقائياً عند عودتك لاحقاً موعد زكاتك القادم تقريباً وعدد الأيام المتبقية — لتتابع حولك دون إعادة الحساب من الصفر كل مرة.',
  },
];

export default async function ZakatMalCalculatorPage() {
  const livePrices = await getZakatLivePrices();

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

  const allSources = Array.from(
    new Map(MADHABS.flatMap((m) => m.sources).map((s) => [s.url, s])).values(),
  );

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-zakat-mal-calculator" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — الزكاة</span>
              <h1>حاسبة زكاة المال الشاملة ومتتبع الحول</h1>
              <p className="guide-v2-lead">
                احسب زكاة كل أموالك حسب مذهبك — نقد، ذهب، فضة، أسهم مضاربة واستثمار، عروض تجارة،
                وديون — بأسعار ذهب وفضة محدَّثة تلقائياً من السوق العالمية لأكثر من 20 دولة عربية،
                ومتتبع حول هجري يحفظ تاريخك ويذكّرك بموعد زكاتك القادم دون إعادة الحساب كل مرة.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><Coins size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  زكاة المال تجب إذا بلغ مالك النصاب (قيمة 85 جراماً ذهباً أو 595 جراماً فضة تقريباً)
                  ومرّ عليه حول هجري كامل، ومقدارها ربع العشر (2.5%) من إجمالي أموالك الزكوية بعد
                  خصم ما عليك من ديون. بعض التفاصيل تختلف حسب مذهبك — اختره في الحاسبة أدناه لترى
                  المبلغ الدقيق فوراً.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="conditions">
                <h2>من تجب عليه الزكاة ومتى</h2>
                <p>
                  زكاة المال ركن من أركان الإسلام، وتجب على كل مسلم حر بلغ ماله النصاب وحال عليه
                  الحول. شرطان لا بد من تحققهما معاً:
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">النصاب</span>
                        <span className="guide-v2-compare-row-value">الحد الأدنى من المال الذي تجب فيه الزكاة — 85 جراماً ذهباً أو 595 جراماً فضة تقريباً (أو قيمتها).</span>
                      </div>
                      <div className="guide-v2-compare-row">
                        <span className="guide-v2-compare-row-label">الحول</span>
                        <span className="guide-v2-compare-row-value">مرور سنة هجرية كاملة (نحو 354 يوماً) على بلوغ المال النصاب دون أن ينقص عنه.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="guide-v2-type-grid" style={{ marginTop: 'var(--space-4)' }}>
                  {MADHABS.filter((m) => !m.recommended).map((m) => (
                    <div className="guide-v2-type-card" key={m.id}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={MADHAB_ICON_STYLE[m.color]} aria-hidden="true">
                          <Mosque size={16} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{m.name}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>الحلي المستعمل: {m.rules.jewelryZakatable ? 'تجب فيه الزكاة' : 'لا تجب فيه الزكاة'}</li>
                        <li>أساس النصاب: {m.rules.defaultNisabBasis === 'gold' ? 'الذهب' : 'الفضة (الأحظ للفقراء)'}</li>
                        <li>زكاة الفطر: {m.rules.fitrCashAllowed ? 'تجوز نقداً' : 'الأصل طعاماً'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-mal-1" />

              <section id="calculator">
                <h2>احسب زكاتك الآن</h2>
                <p>اختر مذهبك وأموالك أدناه — الحاسبة تُظهر الحقول المناسبة فقط وتحسب زكاتك تلقائياً:</p>
                <ZakatMalCalculator livePrices={livePrices} />
              </section>

              <ToolInArticleAd slotId="mid-zakat-mal-2" />

              <section id="madhahib">
                <h2>الفرق بين المذاهب الأربعة في زكاة المال</h2>
                <p>
                  الاختلاف بين المذاهب الأربعة في تفاصيل الزكاة اجتهاد فقهي معتبر، لا خطأ من أحد
                  الطرفين — إليك أبرز الفروق الحقيقية المؤثرة على المبلغ:
                </p>
                <div className="guide-v2-compare-list">
                  {MADHABS.filter((m) => !m.recommended).map((m) => (
                    <div className="guide-v2-compare-card" key={m.id}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{m.name}</span>
                        <span className="guide-v2-compare-row-value" style={{ fontSize: '0.8rem' }}>{m.whereCommon}</span>
                      </div>
                      <div className="guide-v2-compare-rows">
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">الحلي المستعمل للزينة</span>
                          <span className="guide-v2-compare-row-value">{m.rules.jewelryZakatable ? 'تجب فيه الزكاة' : 'لا تجب فيه الزكاة'}</span>
                        </div>
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">أساس نصاب النقد</span>
                          <span className="guide-v2-compare-row-value">{m.rules.defaultNisabBasis === 'gold' ? 'الذهب' : 'الفضة (الأحظ للفقراء)'}</span>
                        </div>
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">زكاة الفطر نقداً</span>
                          <span className="guide-v2-compare-row-value">{m.rules.fitrCashAllowed ? 'جائزة صراحة' : 'الأصل طعاماً، الأحوط اتباع فتوى بلدك'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  لا تفاضل هنا بين المذاهب — كلها اجتهاد معتبر عند أهل السنة. اختر ما تطمئن إليه أو
                  ما هو معتمد في بلدك، أو اترك الحاسبة على الخيار الافتراضي "اتبع الأحوط". لتفصيل
                  أوسع لكل فرق بأدلته الكاملة، راجع{' '}
                  <Link href={MADHAHIB_PAGE.href}>{MADHAHIB_PAGE.shortLabel}</Link>.
                </p>
              </section>

              <section id="assets">
                <h2>زكاة كل نوع مال بالتفصيل</h2>
                <div className="guide-v2-compare-list">
                  {ASSET_SECTIONS.map((asset) => (
                    <div className="guide-v2-compare-card" key={asset.title}>
                      <div className="guide-v2-compare-head">
                        <span className="guide-v2-compare-title">{asset.title}</span>
                      </div>
                      <div className="guide-v2-compare-rows">
                        {asset.rows.map(([label, value]) => (
                          <div className="guide-v2-compare-row" key={label}>
                            <span className="guide-v2-compare-row-label">{label}</span>
                            <span className="guide-v2-compare-row-value">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  تحتاج تفصيلاً أعمق لنوع مال واحد؟ لدينا صفحة مستقلة لكل نوع:{' '}
                  <Link href={GOLD_PAGE.href}>{GOLD_PAGE.shortLabel}</Link> (قطعة بقطعة بكل عيار)،{' '}
                  <Link href={STOCKS_PAGE.href}>{STOCKS_PAGE.shortLabel}</Link> (مضاربة أو استثمار
                  أو محفظة مختلطة)، <Link href={TRADE_PAGE.href}>{TRADE_PAGE.shortLabel}</Link> (لأصحاب
                  الأنشطة التجارية)، و<Link href={SALARY_PAGE.href}>{SALARY_PAGE.shortLabel}</Link> (للموظفين
                  أصحاب الراتب الشهري).
                </p>
              </section>

              <section id="recipients">
                <h2>من يستحق الزكاة</h2>
                <p>
                  حدد القرآن الكريم مصارف الزكاة الثمانية حصراً في سورة التوبة (الآية 60):
                  الفقراء، والمساكين، والعاملين عليها (القائمين على جمعها وتوزيعها)، والمؤلَّفة
                  قلوبهم، وفي الرقاب (تحرير العبيد والأسرى)، والغارمين (أصحاب الديون العاجزين عن
                  سدادها)، وفي سبيل الله، وابن السبيل (المسافر المنقطع عن ماله). لا يجوز صرف
                  الزكاة لمن تلزمك نفقته أصلاً (كالوالدين والأبناء والزوجة) — راجع الأسئلة
                  الشائعة أدناه لتفصيل هذه النقطة.
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
                <h2 className="guide-v2-sources-head">مصادر فقهية</h2>
                <ul className="guide-v2-sources">
                  {allSources.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a>
                    </li>
                  ))}
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  المحتوى الفقهي في هذه الصفحة مبني على مصادر سنّية معتمدة فقط (فتاوى الشيخ ابن باز
                  واللجنة الدائمة للإفتاء بالمملكة العربية السعودية، ودار الإفتاء المصرية، ومركز
                  فتوى إسلام ويب) وتغطي المذاهب الأربعة. هذه أداة استرشادية وليست فتوى شخصية —
                  استشر جهة إفتاء موثوقة عند وجود حالة خاصة أو خلاف مذهبي يهمك.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-mal-calculator" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
