import Link from 'next/link';

import ElectricalUnitConverter from '@/components/calculators/ElectricalUnitConverter.client';
import TocDetailsReveal from '@/components/shared/TocDetailsReveal.client';
import ToolTopAdSlot from '@/components/tools-v2/ToolTopAdSlot';
import ToolInArticleAd from '@/components/tools-v2/ToolInArticleAd';
import { CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { buildFreeToolPageSchema } from '@/lib/seo/tool-schema';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const PAGE = CALCULATOR_ROUTES.find((item) => item.slug === 'electrical-unit-converter');

function pickTools(slugs) {
  return slugs.map((slug) => CALCULATOR_ROUTES.find((item) => item.slug === slug)).filter(Boolean);
}
const RELATED_TOOLS = pickTools(['electricity-consumption-calculator', 'generators', 'breaker-panel']);

const TOC_ITEMS = [
  ['power-units', 'وحدات القدرة الكهربائية — واط، حصان، BTU، طن تبريد'],
  ['watts-amps', 'العلاقة بين الواط والأمبير'],
  ['faq', 'الأسئلة الشائعة'],
];

const FAQ_ITEMS = [
  {
    question: 'كيف تحوّل من كيلو واط إلى أمبير؟',
    answer: 'الأمبير ليس وحدة قدرة مستقلة — يحتاج معرفة جهد الدائرة (فولت) ومعامل القدرة. المعادلة للدائرة الأحادية الطور: أمبير = واط ÷ (فولت × معامل القدرة). للدائرة ثلاثية الطور تُضرب الفولت في جذر 3 (≈1.732) أولاً. استخدم أداة التحويل أعلى الصفحة بدل الحساب اليدوي لتفادي الخطأ.',
  },
  {
    question: 'كم واط يساوي الحصان الواحد (HP)؟',
    answer: 'الحصان الميكانيكي (المستخدم في تصنيف المحركات والمولدات) يساوي 745.7 واط تقريباً، أي 0.7457 كيلو واط. هذا المعامل ثابت ولا يتغير حسب نوع الجهاز.',
  },
  {
    question: 'ما العلاقة بين الكيلو واط وطن التبريد؟',
    answer: 'طن التبريد (Ton of Refrigeration) وحدة تُستخدم لتصنيف قدرة المكيفات، ويساوي 3.517 كيلو واط تقريباً (أو 12,000 BTU/ساعة). كلما زاد عدد الأطنان، زادت قدرة التبريد وزاد استهلاك المكيف للكهرباء.',
  },
  {
    question: 'ما الفرق بين كيلو واط وكيلو فولت أمبير (kVA)؟',
    answer: 'كيلو واط (kW) يقيس القدرة الفعلية المستهلكة، بينما كيلو فولت أمبير (kVA) يقيس القدرة الظاهرية الكلية في الدائرة. العلاقة بينهما: kW = kVA × معامل القدرة. معامل القدرة يكون 1 للأحمال المقاومة البحتة (إضاءة، تسخين) وأقل من 1 (عادة 0.8-0.95) للمحركات والمكيفات.',
  },
  {
    question: 'لماذا تختلف نتيجة تحويل الأمبير حسب معامل القدرة؟',
    answer: 'لأن التيار الفعلي الذي يسحبه جهاز معين من الشبكة يعتمد على مدى "كفاءة" استخدامه للقدرة، لا على القدرة الاسمية وحدها. جهاز بمعامل قدرة أقل (كمحرك أو مكيف) يسحب تياراً أعلى لنفس القدرة الفعلية مقارنة بجهاز مقاومة بحتة (كمصباح إضاءة) بمعامل قدرة 1.',
  },
];

export const metadata = buildCanonicalMetadata({
  title: PAGE.heroTitle,
  description: PAGE.description,
  keywords: PAGE.keywords,
  url: `${SITE_URL}${PAGE.href}`,
});

function RelatedToolsCard({ items, heading }) {
  if (!items.length) return null;
  return (
    <aside className="tool-v2-related-card" aria-label="أدوات مشابهة">
      <div className="tool-v2-related-card__head">{heading}</div>
      <nav className="tool-v2-related-card__list">
        {items.map((tool, index) => (
          <Link key={tool.slug} href={tool.href} className={index === 0 ? 'is-featured' : undefined}>
            {index === 0 ? (
              <span className="tool-v2-related-ic">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" /></svg>
              </span>
            ) : null}
            <span>{tool.shortLabel || tool.title}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function ElectricalUnitConverterPage() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'الأدوات', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: 'الكهرباء', item: `${SITE_URL}/tools/electrical` },
      { '@type': 'ListItem', position: 4, name: PAGE.title, item: `${SITE_URL}${PAGE.href}` },
    ],
  };
  const softwareSchema = buildFreeToolPageSchema({
    siteUrl: SITE_URL,
    path: PAGE.href,
    name: PAGE.title,
    description: PAGE.description,
    about: ['تحويل وحدات الكهرباء', 'كيلو واط الى امبير', 'حصان الى كيلو واط'],
    keywords: PAGE.keywords,
  });
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
    <main className="bg-base text-primary" dir="rtl" lang="ar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <ToolTopAdSlot slotId="top-electrical-unit-converter" />
      <TocDetailsReveal />

      <div className="container mx-auto px-4 tool-v2-lanes">
        <div className="tool-v2-hero tool-v2-lane-hero">
          <span className="tool-v2-kicker">كهرباء / محول</span>
          <h1>{PAGE.heroTitle}</h1>
          <p className="tool-v2-lead">{PAGE.description}</p>

          <nav className="tool-v2-toc" aria-label="محتويات الصفحة">
            <div className="tool-v2-toc-head">المحتويات</div>
            <ol>
              {TOC_ITEMS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="tool-v2-lane-mobile-ad">
          <ToolInArticleAd slotId="mobile-electrical-unit-converter" />
        </div>

        <article className="tool-v2-lane-article">
          <section id="power-units">
            <h2>وحدات القدرة الكهربائية — واط، حصان، BTU، طن تبريد</h2>
            <p>
              كل هذه الوحدات تقيس "القدرة" بمعاملات تحويل ثابتة عبر الواط كوحدة مشتركة — 1 حصان ≈
              745.7 واط، 1 كيلو واط ≈ 3412 BTU/ساعة، و1 طن تبريد ≈ 3.517 كيلو واط. تظهر هذه
              التحويلات كثيراً عند مقارنة قدرة مكيف بالطن مع قدرة مولد بالكيلو واط، أو محرك بالحصان
              مع استهلاكه الكهربائي الفعلي.
            </p>
          </section>

          <ToolInArticleAd slotId="mid-electrical-unit-converter" />

          <section id="watts-amps">
            <h2>العلاقة بين الواط والأمبير</h2>
            <p>
              على عكس تحويلات القدرة أعلاه، الأمبير (تيار) ليس وحدة قدرة، ولا يمكن تحويله من واط
              مباشرة دون معرفة جهد الدائرة. المعادلة الأساسية: <strong>واط = فولت × أمبير ×
              معامل القدرة</strong>. لهذا فإن حساب "كم أمبير يحتاجه جهاز 1500 واط" يحتاج أولاً معرفة
              هل الدائرة أحادية الطور (230 فولت، الأشيع في المنازل) أو ثلاثية الطور (400 فولت،
              للأحمال الكبيرة).
            </p>
            <p>
              معامل القدرة يعكس مدى "كفاءة" الجهاز في تحويل القدرة الظاهرية إلى قدرة فعلية —
              يُفترض 1 للإضاءة والتسخين، وبين 0.8 و0.95 للمحركات والمكيفات. هذا هو نفس المعامل
              المستخدم في حساب حجم المولد المناسب في دليل المولدات.
            </p>
          </section>

          <section id="faq">
            <h2>الأسئلة الشائعة</h2>
            <div className="tool-v2-faq">
              {FAQ_ITEMS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    {item.question}
                    <svg className="tool-v2-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <div className="tool-v2-lane-tool">
          <div className="tool-v2-tool-panel">
            <ElectricalUnitConverter />
          </div>
          <RelatedToolsCard items={RELATED_TOOLS} heading="أدوات أخرى في الكهرباء" />
        </div>
      </div>
    </main>
  );
}
