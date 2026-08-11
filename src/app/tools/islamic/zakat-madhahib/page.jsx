import Link from 'next/link';
import { BookOpen, Mosque, ShieldCheck } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { MADHABS } from '@/lib/islamic/zakat-madhab';
import { buildPrincipalPageSearchCoverage } from '@/lib/seo/page-search-coverage';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-madhahib');
const MAL_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-mal-calculator');
const GOLD_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-gold-calculator');
const FITR_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-fitr-calculator');
const NISAB_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-nisab-today');
const STOCKS_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-stocks-calculator');
const TRADE_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-trade-goods-calculator');
const SALARY_PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'zakat-salary-calculator');

const MADHAB_ICON_STYLE = {
  blue: { background: 'var(--blue-subtle)', color: 'var(--blue-text)' },
  green: { background: 'var(--green-subtle)', color: 'var(--green-text)' },
  amber: { background: 'var(--amber-subtle)', color: 'var(--amber-text)' },
  red: { background: 'color-mix(in srgb, var(--red) 14%, transparent)', color: 'var(--red-text)' },
};

const TOC_ITEMS = [
  ['overview', 'المذاهب الأربعة — لمحة'],
  ['jewelry', 'زكاة الحلي المستعمل'],
  ['combining', 'ضم الذهب والفضة'],
  ['nisab', 'أساس نصاب النقد'],
  ['fitr', 'زكاة الفطر — طعاماً أم نقداً'],
  ['related', 'احسب زكاة كل نوع مال'],
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
    question: 'هل يجب أن أتبع مذهباً معيناً في الزكاة؟',
    answer:
      'ليس شرطاً الالتزام بمذهب واحد في كل شيء، لكن الأفضل أن تختار رأياً معتبراً وتستمر عليه بدل التنقل بين الآراء بحثاً عن الأخف في كل مسألة. إن كنت في بلد له مذهب رسمي أو دار إفتاء معتمدة، اتباع فتواها خيار آمن وعملي.',
  },
  {
    question: 'أي مذهب أتبع إذا لم أكن أعرف مذهبي؟',
    answer:
      'اتبع الرأي الأحوط (الأكثر احتياطاً للذمة) في كل مسألة — وهو الخيار الافتراضي في حاسباتنا. عملياً هذا يعني: زكاة الحلي المستعمل تُحتسب، ونصاب الفضة (الأقل عادة) هو الأساس. هذا مطابق لما اختاره الشيخ ابن باز واللجنة الدائمة كرأي أحوط.',
  },
  {
    question: 'هل الاختلاف بين المذاهب في الزكاة خطأ من أحد الطرفين؟',
    answer:
      'لا، هذا اجتهاد فقهي معتبر من علماء ثقات، ولكل رأي أدلته من الكتاب والسنة وأقوال الصحابة. الاختلاف في الفروع (لا الأصول) رحمة ومن سعة الشريعة، وليس عيباً في أي من المذاهب.',
  },
];

export default function ZakatMadhahibPage() {
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
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
  };

  const realMadhabs = MADHABS.filter((m) => !m.recommended);
  const allSources = Array.from(new Map(MADHABS.flatMap((m) => m.sources).map((s) => [s.url, s])).values());

  return (
    <main className="guide-v2 bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-zakat-madhahib" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">الأدوات الإسلامية — دليل</span>
              <h1>الفرق بين المذاهب الأربعة في أحكام الزكاة</h1>
              <p className="guide-v2-lead">
                الاختلاف بين المذاهب الأربعة في تفاصيل الزكاة اجتهاد فقهي معتبر، لا خطأ من أحد
                الطرفين. هذا الدليل يشرح أبرز الفروق الحقيقية المؤثرة على مبلغ زكاتك، بمصادر سنّية
                موثّقة لكل رأي.
              </p>
            </div>

            <div className="guide-v2-verdict">
              <span className="guide-v2-verdict-icon" aria-hidden="true"><BookOpen size={20} weight="bold" /></span>
              <div>
                <p className="guide-v2-verdict-title">الخلاصة السريعة</p>
                <p className="guide-v2-verdict-body">
                  أبرز 3 فروق حقيقية: هل تجب الزكاة في حلي الزينة المستعمل؟ هل يُضم الذهب إلى الفضة
                  لبلوغ النصاب؟ وهل تجوز زكاة الفطر نقداً؟ كل الآراء أدناه معتبرة عند أهل السنة —
                  اختر ما تطمئن إليه أو ما هو معتمد في بلدك.
                </p>
              </div>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="overview">
                <h2>المذاهب الأربعة — لمحة</h2>
                <div className="guide-v2-type-grid">
                  {realMadhabs.map((m) => (
                    <div className="guide-v2-type-card" key={m.id}>
                      <div className="guide-v2-type-card-head">
                        <span className="guide-v2-type-card-icon" style={MADHAB_ICON_STYLE[m.color]} aria-hidden="true">
                          <Mosque size={16} weight="bold" />
                        </span>
                        <p className="guide-v2-type-card-title">{m.name}</p>
                      </div>
                      <ul className="guide-v2-type-card-facts">
                        <li>ينتشر في: {m.whereCommon}</li>
                        <li>حلي الزينة: {m.rules.jewelryZakatable ? 'تجب فيه الزكاة' : 'لا تجب فيه'}</li>
                        <li>زكاة الفطر نقداً: {m.rules.fitrCashAllowed ? 'جائزة' : 'الأصل طعاماً'}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <ToolInArticleAd slotId="mid-zakat-madhahib-1" />

              <section id="jewelry">
                <h2>زكاة الحلي المستعمل — أكثر المسائل بحثاً</h2>
                <p>
                  هل تجب الزكاة على الذهب الذي تلبسه فعلاً للزينة، أم فقط على الذهب المُدَّخر
                  كسبائك أو استثمار؟
                </p>
                <div className="guide-v2-compare-list">
                  {realMadhabs.map((m) => (
                    <div className="guide-v2-compare-card" key={m.id}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{m.name}</span></div>
                      <div className="guide-v2-compare-rows">
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">الحكم</span>
                          <span className="guide-v2-compare-row-value">{m.rules.jewelryZakatable ? 'تجب فيه الزكاة إذا بلغ النصاب — الأحوط والأبرأ للذمة' : 'لا تجب فيه الزكاة (المُعَدّ للُبس المعتاد غير المدَّخر)'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  اختر مذهبك مباشرة في <Link href={GOLD_PAGE.href}>{GOLD_PAGE.shortLabel}</Link> لترى
                  أثر هذا الفرق على زكاتك بالأرقام.
                </p>
              </section>

              <section id="combining">
                <h2>ضم الذهب إلى الفضة لبلوغ النصاب</h2>
                <p>
                  إن كان لديك ذهب وفضة ولم يبلغ أيٌّ منهما نصابه الخاص منفرداً، هل يُجمَعان معاً
                  لبلوغ نصاب واحد؟
                </p>
                <div className="guide-v2-compare-list">
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">الحنفية والمالكية</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">الحكم</span><span className="guide-v2-compare-row-value">يجيزون الضم — تُجمَع قيمة الذهب والفضة معاً لبلوغ النصاب</span></div>
                    </div>
                  </div>
                  <div className="guide-v2-compare-card">
                    <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">الشافعية والحنابلة</span></div>
                    <div className="guide-v2-compare-rows">
                      <div className="guide-v2-compare-row"><span className="guide-v2-compare-row-label">الحكم</span><span className="guide-v2-compare-row-value">لا يُضمّان — يجب أن يبلغ كل معدن نصابه الخاص منفرداً (الرواية المعتمدة عند الحنابلة، وهي ما رجع إليه الإمام أحمد أخيراً — مع وجود رواية أخرى بالجواز)</span></div>
                    </div>
                  </div>
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  هذه المسألة تخص ضم المعدنين ببعضهما تحديداً — لا تتعلق بتقدير نصاب النقد الذي
                  يُقاس أصلاً بقيمة نصاب الذهب أو الفضة (راجع القسم التالي).
                </p>
              </section>

              <section id="nisab">
                <h2>أساس تقدير نصاب النقد — الذهب أم الفضة</h2>
                <p>
                  الأوراق النقدية (الريال، الدرهم، الجنيه...) لا نصاب خاصاً بها في النصوص الكلاسيكية
                  — تُقاس بقيمة نصاب الذهب أو الفضة. أيهما يُعتمد؟
                </p>
                <div className="guide-v2-compare-list">
                  {realMadhabs.map((m) => (
                    <div className="guide-v2-compare-card" key={m.id}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{m.name}</span></div>
                      <div className="guide-v2-compare-rows">
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">الأساس</span>
                          <span className="guide-v2-compare-row-value">{m.rules.defaultNisabBasis === 'gold' ? 'نصاب الذهب' : 'نصاب الفضة ("الأحظ للفقراء" — موقف اللجنة الدائمة الفعلي)'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  راجع القيمة الحية للنصابين بعملتك في <Link href={NISAB_PAGE.href}>{NISAB_PAGE.shortLabel}</Link>،
                  أو احسب زكاة كل أموالك دفعة واحدة (نقد، ذهب، أسهم، عروض تجارة) في{' '}
                  <Link href={MAL_PAGE.href}>{MAL_PAGE.shortLabel}</Link>.
                </p>
              </section>

              <ToolInArticleAd slotId="mid-zakat-madhahib-2" />

              <section id="fitr">
                <h2>زكاة الفطر — طعاماً أم نقداً</h2>
                <div className="guide-v2-compare-list">
                  {realMadhabs.map((m) => (
                    <div className="guide-v2-compare-card" key={m.id}>
                      <div className="guide-v2-compare-head"><span className="guide-v2-compare-title">{m.name}</span></div>
                      <div className="guide-v2-compare-rows">
                        <div className="guide-v2-compare-row">
                          <span className="guide-v2-compare-row-label">الحكم</span>
                          <span className="guide-v2-compare-row-value">{m.rules.fitrCashAllowed ? 'يُجيز النقد صراحة بدل الطعام' : (m.rules.fitrCashCaveat || 'الأصل طعاماً')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  احسب زكاة الفطر بطريقة مذهبك مباشرة في <Link href={FITR_PAGE.href}>{FITR_PAGE.shortLabel}</Link>.
                </p>
              </section>

              <section id="related" aria-label="أدوات ذات صلة">
                <h2>احسب زكاة كل نوع مال على حدة</h2>
                <p>
                  الفروق أعلاه تنعكس مباشرة في حاسبات مخصصة لكل نوع مال — اختر مذهبك في أيٍّ منها
                  لترى الأثر على مبلغ زكاتك مباشرة: <Link href={GOLD_PAGE.href}>{GOLD_PAGE.shortLabel}</Link>،{' '}
                  <Link href={STOCKS_PAGE.href}>{STOCKS_PAGE.shortLabel}</Link>،{' '}
                  <Link href={TRADE_PAGE.href}>{TRADE_PAGE.shortLabel}</Link>، و{' '}
                  <Link href={SALARY_PAGE.href}>{SALARY_PAGE.shortLabel}</Link>.
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
                    <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>
                  ))}
                </ul>
                <p className="guide-v2-checker-result-note" style={{ marginTop: 'var(--space-3)' }}>
                  <ShieldCheck size={14} weight="fill" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                  محتوى سنّي معتمد فقط، لا تفاضل هنا بين المذاهب — كلها اجتهاد معتبر. استشر جهة
                  إفتاء موثوقة عند وجود حالة خاصة.
                </p>
              </section>
            </article>
          </div>

          <aside className="guide-v2-toc-rail">
            <TocScrollSpy items={TOC_ITEMS} variant="desktop" />
            <AdBlogSidebar slotId="sidebar-zakat-madhahib" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
