import Link from 'next/link';
import { GasPump } from '@phosphor-icons/react/ssr';

import AdBlogSidebar from '@/components/ads/AdBlogSidebar';
import TocScrollSpy from '@/components/tools-v2/TocScrollSpy.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import FuelEfficiencyConverter from '@/components/tools-v2/FuelEfficiencyConverter.client';
import { FormulaCard, Frac } from '@/components/tools-v2/FormulaCard';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'fuel-efficiency');

const TOC_ITEMS = [
  ['converter', 'محول وحدات استهلاك الوقود'],
  ['improve', 'كيف تقلل استهلاك سيارتك فعلياً'],
  ['faq', 'الأسئلة الشائعة'],
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
  { route: pickGuides(['tire-guide'])[0], reason: 'إطار بضغط منخفض يزيد استهلاك الوقود ملحوظاً' },
  { route: pickGuides(['car-maintenance-schedule'])[0], reason: 'فلتر هواء متسخ يرفع الاستهلاك أيضاً' },
].filter((item) => item.route);

const FAQ_ITEMS = [
  {
    question: 'كيف أحول من لتر/100كم إلى كم/لتر؟',
    answer: 'اقسم 100 على رقم اللتر/100كم — راجع المعادلة والمثال المحلول في قسم "محول وحدات استهلاك الوقود" أعلى الصفحة، أو استخدم المحول مباشرة لتحويل فوري ودقيق بين الوحدات الثلاث.',
  },
  {
    question: 'ما هو معدل استهلاك الوقود الطبيعي للسيارات؟',
    answer: 'السيارات الاقتصادية الصغيرة عادة بين 5 و7 لتر/100كم، السيدان المتوسطة بين 7 و9، والدفع الرباعي الكبير قد يتجاوز 12-14 لتر/100كم — الرقم الفعلي يعتمد كثيراً على أسلوب القيادة ونوع الطرق (مدينة أم طريق سريع).',
  },
  {
    question: 'ما الفرق بين لتر/100كم و MPG؟',
    answer: 'لتر/100كم يقيس كمية الوقود المستهلكة لقطع مسافة ثابتة — رقم أقل يعني كفاءة أفضل. MPG (ميل لكل غالون، مستخدم أمريكياً) يقيس المسافة المقطوعة بوحدة وقود ثابتة — هنا رقم أعلى يعني كفاءة أفضل. الاتجاهان معكوسان تماماً، لهذا يسهل الخلط بينهما.',
  },
];

export default function FuelEfficiencyPage() {
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

      <ToolTopAdSlot slotId="top-fuel-efficiency" />

      <div className="guide-v2-shell">
        <div className="guide-v2-page-grid">
          <div className="guide-v2-main">
            <div className="guide-v2-hero">
              <span className="guide-v2-kicker">دليل صيانة — محول</span>
              <h1>محول استهلاك الوقود: لتر/100كم ↔ كم/لتر ↔ MPG</h1>
              <p className="guide-v2-lead">
                قارن كفاءة سيارتك بأي وحدة تظهر بها المواصفات — تحويل فوري بين الوحدات الثلاث
                الأكثر استخداماً عالمياً.
              </p>
            </div>

            <TocScrollSpy items={TOC_ITEMS} variant="mobile" />

            <article className="guide-v2-article">
              <section id="converter">
                <h2>محول وحدات استهلاك الوقود</h2>
                <FuelEfficiencyConverter />
                <FormulaCard
                  label="لتحويل لتر/100كم إلى كم/لتر يدوياً، اقسم 100 على الرقم:"
                  note="مثال: 7 لتر/100كم = 100 ÷ 7 ≈ 14.3 كم/لتر. نفس المعادلة تُستخدم بالعكس لتحويل كم/لتر إلى لتر/100كم."
                >
                  <span>كم/لتر =</span>
                  <Frac num="100" den="لتر/100كم" />
                </FormulaCard>
              </section>

              <ToolInArticleAd slotId="mid-fuel-efficiency" />

              <section id="improve">
                <h2>كيف تقلل استهلاك سيارتك فعلياً</h2>
                <ul>
                  <li><strong>ضغط إطارات صحيح:</strong> إطار منخفض الضغط بـ 0.5 بار فقط يزيد الاحتكاك مع الطريق ويرفع الاستهلاك ملحوظاً — راجع دليل الإطارات لضبطه بدقة.</li>
                  <li><strong>تسارع وفرملة تدريجيان:</strong> التسارع المفاجئ يستهلك وقوداً أكثر بكثير من التسارع التدريجي الهادئ لنفس السرعة النهائية.</li>
                  <li><strong>فلتر هواء نظيف:</strong> فلتر مسدود يجبر المحرك على العمل أصعب لسحب الهواء اللازم للاحتراق — بند بسيط ضمن جدول الصيانة الدورية.</li>
                  <li><strong>تقليل الوزن الزائد:</strong> أغراض ثقيلة في صندوق السيارة أو حامل سقف غير مستخدم يزيدان استهلاك الوقود باستمرار، حتى في الرحلات القصيرة.</li>
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
            <AdBlogSidebar slotId="sidebar-fuel-efficiency" className="guide-v2-toc-card" />
          </aside>
        </div>
      </div>
    </main>
  );
}
