import Link from 'next/link';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { CALCULATOR_HUBS, CALCULATOR_ROUTES } from '@/lib/calculators/data';
import { getSiteUrl } from '@/lib/site-config';
import { appendToolDiscoveryLinks } from '@/lib/seo/discovery-links';
import AdTopBanner from '@/components/ads/AdTopBanner';
import AdInFeed from '@/components/ads/AdInFeed';
import AdMultiplex from '@/components/ads/AdMultiplex';

const SITE_URL = getSiteUrl();
const CALCULATOR_EDITORIAL_PARAGRAPHS = [
  'الرقم الذي تعطيه الحاسبة لا يصبح مفيداً إلا عندما تعرف ماذا يعني. قسط شهري منخفض قد يبدو مريحاً، لكنه قد يخفي مدة طويلة وتكلفة إجمالية أعلى. ونسبة خصم جذابة قد لا تكون أفضل صفقة إذا كان السعر الأساسي مبالغاً فيه. لذلك لا نريد أن يكون هذا القسم مجموعة أزرار تعطي أرقاماً سريعة فقط، بل نقطة بداية لفهم القرار.',
  'قد تصل إلى هنا بصيغة سؤال لا باسم أداة: كم عمري؟ كم قسط قرض 100 ألف؟ كم ضريبة 1000 ريال؟ كم أحتاج صندوق طوارئ؟ لذلك ابدأ من الموقف الحقيقي: مال، عمر، نوم، بناء، أو نسبة. عندما تبدأ من الموقف لا تضيع بين صفحات متشابهة ولا تحتاج إلى تجربة كل أداة حتى تصل إلى المناسبة.',
  'أهم خطأ في صفحات الحاسبات العربية أنها تعرض الناتج كأنه حقيقة نهائية. في الواقع، كثير من النتائج تقديرية: مكافأة نهاية الخدمة تتأثر بالنظام المحلي وسبب انتهاء العقد، وحاسبة القرض تتأثر بطريقة احتساب الفائدة، وحاسبة النوم تعطي نافذة عملية لا وصفة طبية. لهذا اقرأ الشرح المرافق قبل الاعتماد على الرقم، خاصة في القرارات المالية أو الوظيفية.',
  'المنافسون في نتائج البحث يقدمون مئات الحاسبات في صفحة واحدة، وهذا مفيد للاكتشاف لكنه يربكك عندما تريد جواباً الان. في ميقاتنا نرتب الحاسبات حول السؤال العربي الشائع: كم؟ متى؟ ما الفرق؟ وهل النتيجة تقديرية أم صالحة للاستخدام مباشرة؟',
];
const CALCULATOR_QUICK_ANSWERS = [
  {
    question: 'ما أفضل حاسبة أبدأ بها؟',
    description: 'ابدأ من السؤال لا من اسم الأداة.',
    answer: 'إذا كنت تريد رقماً فورياً فاختر الحاسبة المباشرة: العمر، القسط، الضريبة، النسبة، أو النوم. إذا كنت تريد قراراً أكبر، مثل قرض أو نهاية خدمة أو بناء، فابدأ بالحاسبة ثم اقرأ حدود النتيجة قبل التنفيذ.',
  },
  {
    question: 'هل نتائج الحاسبات نهائية؟',
    description: 'ليست كل النتائج بدرجة الدقة نفسها.',
    answer: 'لا. بعض النتائج حسابية مباشرة مثل النسبة والعمر، وبعضها تقديري مثل القروض، نهاية الخدمة، النوم، وتكلفة البناء. استخدم الناتج للفهم والمقارنة، ثم راجع المصدر الرسمي أو المختص عند القرارات المالية أو القانونية أو الصحية.',
  },
  {
    question: 'هل أحتاج إنشاء حساب؟',
    description: 'الأدوات مصممة للاستخدام السريع.',
    answer: 'لا تحتاج إلى حساب لاختيار الحاسبة أو قراءة الشرح. أدخل المدخلات الضرورية فقط، وتجنب إدخال أسماء أو أرقام هوية أو معلومات خاصة لا تطلبها الحاسبة.',
  },
  {
    question: 'لماذا لا توجد حاسبة واحدة لكل شيء؟',
    description: 'لأن طريقة قراءة النتيجة تختلف.',
    answer: 'حاسبة العمر تحتاج تاريخاً صحيحاً، وحاسبة الضريبة تحتاج معرفة هل السعر شامل أم غير شامل، وحاسبة القسط تحتاج مدة وفائدة ورسوم، وحاسبة البناء تحتاج أسعاراً محلية. فصل الأدوات يجعل النتيجة أوضح وأقل خطأ.',
  },
];
const CALCULATOR_TRUST_CHECKS = [
  'المدخلات المطلوبة محدودة بالرقم أو التاريخ أو النسبة التي تحتاجها الحاسبة.',
  'النتائج الحساسة تظهر معها حدود واضحة: تقدير، مقارنة، أو حاجة لمصدر رسمي.',
  'المحتوى يشرح طريقة قراءة الرقم ولا يدفعك إلى قرار مالي أو قانوني من نتيجة واحدة.',
  'روابط الأقسام الداخلية تساعدك على الانتقال إلى الوقت والتاريخ عند الحاجة إلى سياق إضافي.',
];
const CALCULATOR_READING_RULES = [
  {
    label: 'اقرأ المدخلات قبل النتيجة',
    value: 'إذا كان الرقم غريباً، فغالباً المشكلة في مدة أو نسبة أو مبلغ أُدخل بطريقة غير مناسبة.',
  },
  {
    label: 'لا تعتمد على سيناريو واحد',
    value: 'جرّب تغيير متغير واحد فقط كل مرة: مدة القرض، مبلغ الادخار، عدد الأشهر، أو نسبة الضريبة.',
  },
  {
    label: 'افصل بين الفهم والتنفيذ',
    value: 'الحاسبة تشرح لك الاتجاه. التنفيذ المالي أو القانوني يحتاج مصدراً مباشراً عندما تكون المخاطرة عالية.',
  },
];
const CALCULATOR_PATH_TABLE = [
  {
    key: 'money',
    cells: [
      'قرار مالي أو فاتورة',
      'القسط، الضريبة، النسبة، أو نهاية الخدمة',
      'ابدأ بالرقم المباشر، ثم راجع التكلفة الكلية أو الشرط القانوني قبل الاعتماد.',
    ],
  },
  {
    key: 'life',
    cells: [
      'عمر أو نوم أو موعد',
      'حاسبات العمر أو النوم',
      'الدقة هنا تعتمد على التاريخ والوقت والروتين؛ لا تعامل النتيجة كتشخيص أو حكم نهائي.',
    ],
  },
  {
    key: 'project',
    cells: [
      'مشروع بناء أو شراء مواد',
      'حاسبات البناء والمواد',
      'اقرأ الناتج كنطاق أولي، ثم قارنه بسعر محلي أو عرض مورد قبل الشراء.',
    ],
  },
];
// Gulf + high-RPM daily tools go first; classic tools second
const FEATURED_CALCULATOR_SLUGS = [
  'iqama',
  'electricity-bill',
  'inheritance',
  'net-salary',
  'pregnancy',
  'gpa',
  'monthly-installment',
  'end-of-service-benefits',
  'age-calculator',
  'vat',
  'percentage',
  'bedtime',
];

export const metadata = buildCanonicalMetadata({
  title: 'حاسبات عربية مجانية: الإقامة والراتب والكهرباء والميراث والحمل',
  description:
    'حاسبات عربية مجانية بدون تسجيل: احسب انتهاء الإقامة، فاتورة الكهرباء، الميراث، صافي الراتب، موعد الولادة، المعدل، القسط، وضريبة القيمة المضافة — نتائج فورية مع شرح واضح.',
  keywords: [
    'حاسبات أونلاين عربية',
    'حاسبة عربية',
    'كل الحاسبات',
    'حاسبة العمر والقروض والضريبة',
    ...CALCULATOR_HUBS.flatMap((item) => item.keywords),
    ...CALCULATOR_ROUTES.filter((item) => !item.draft).flatMap((item) => item.keywords),
  ],
  url: `${SITE_URL}/calculators`,
});

export default function CalculatorsPage() {
  const calculatorRouteBySlug = new Map(CALCULATOR_ROUTES.map((route) => [route.slug, route]));
  const calculatorHubLinks = CALCULATOR_HUBS.map((hub) => ({
    ...hub,
    count: Array.isArray(hub.routeSlugs) ? hub.routeSlugs.length : 0,
  }));
  const archiveGroups = calculatorHubLinks.map((hub) => ({
    ...hub,
    routes: (Array.isArray(hub.routeSlugs) ? hub.routeSlugs : [])
      .map((slug) => calculatorRouteBySlug.get(slug))
      .filter(Boolean),
  }));
  const platformUtilityLinks = appendToolDiscoveryLinks([
    {
      href: '/time-now',
      label: 'الوقت الان في المدن والدول',
      description: 'راجع الوقت المحلي الحالي إذا كانت الحاسبة مرتبطة بساعات العمل أو المواعيد أو السفر.',
    },
    {
      href: '/time-difference',
      label: 'حاسبة فرق التوقيت',
      description: 'أداة مكملة مهمة لمن يربط الحاسبات المالية أو الاجتماعات أو العمل الحر بمدن ودول مختلفة.',
    },
    {
      href: '/date',
      label: 'التاريخ اليوم والتحويل',
      description: 'ادخل إلى قسم التاريخ الهجري والميلادي إذا كنت تحتاج مرجعاً زمنياً قبل استخدام العمر أو التقاعد أو المناسبات.',
    },
    {
      href: '/holidays',
      label: 'المناسبات والعدادات القادمة',
      description: 'راجع المواسم والإجازات والمناسبات القادمة عندما يرتبط حسابك بتاريخ أو عمر أو تخطيط شهري.',
    },
  ]).map((link) => ({
    href: link.href,
    title: link.title || link.label,
    description: link.description,
  }));
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'قسم الحاسبات',
    url: `${SITE_URL}/calculators`,
    inLanguage: 'ar',
    description: 'مجموعة حاسبات أونلاين عربية تشمل العمر ونهاية الخدمة والقروض والضريبة والنسبة والنوم والبناء، مع شرح حدود النتائج.',
  };
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: CALCULATOR_ROUTES.filter((item) => !item.draft).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `${SITE_URL}${item.href}`,
    })),
  };
  const trustLinks = [
    {
      href: '/privacy',
      title: 'سياسة الخصوصية',
      description: 'راجع كيف نتعامل مع الخصوصية والبيانات عند استخدام أدوات الموقع.',
    },
    {
      href: '/disclaimer',
      title: 'إخلاء المسؤولية',
      description: 'افهم متى تكون النتيجة تقديرية ومتى تحتاج إلى جهة رسمية أو مختص.',
    },
    {
      href: '/editorial-policy',
      title: 'السياسة التحريرية',
      description: 'تعرّف على طريقة كتابة الشرح العربي ومراجعة المعلومات قبل نشرها.',
    },
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CALCULATOR_QUICK_ANSWERS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main id="main-content" className="bg-base text-primary calc-hub-page calc-hub-v8" dir="rtl" lang="ar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="calc-hub-v8-hero" aria-labelledby="calculators-title">
        <div className="calc-hub-v8-wrap calc-hub-v8-hero-grid">
          {/* First thing in the (single-column, DOM-order-stacked) hero grid —
              moved above the H1 so it renders in the same viewport as the
              navbar. See AdTopBanner.tsx v3. */}
          <div className="calc-hub-v8-hero-ad">
            <AdTopBanner slotId="top-calculator-hub" />
          </div>

          <div className="calc-hub-v8-hero-copy">
            <span className="calc-hub-v8-kicker">قسم الحاسبات</span>
            <h1 id="calculators-title" className="calc-hub-v8-title">حاسبات عربية تجيب عن سؤالك مباشرة</h1>
            <p className="calc-hub-v8-lead">
              انتهاء الإقامة، فاتورة الكهرباء، الميراث، صافي الراتب، موعد الولادة، المعدل التراكمي، القسط، الضريبة، نهاية الخدمة، والبناء — كل أداة تعطيك رقماً مفهوماً مع شرح حدوده.
            </p>
            <div className="calc-hub-v8-proof" aria-label="مميزات قسم الحاسبات">
              <span>نتائج فورية</span>
              <span>شرح حدود الرقم</span>
              <span>بدون حساب</span>
            </div>
          </div>

          <nav className="calc-hub-v8-command" aria-label="ابدأ من نوع السؤال">
            <div className="calc-hub-v8-command-head">
              <span className="calc-hub-v8-kicker">ابدأ هنا</span>
              <h2>اختر نوع الحساب، ثم افتح الأداة الدقيقة</h2>
              <p>الواجهة هنا مصممة كسؤال سريع: مال، عمر، نوم، بناء، أو تخطيط مالي. اختر المجال أولاً حتى لا تضيع بين أسماء الأدوات.</p>
            </div>
            <div className="calc-hub-v8-intents">
              {calculatorHubLinks.map((hub) => (
                <Link key={hub.slug} href={hub.href} className="calc-hub-v8-intent" style={{ '--intent-accent': hub.accent || 'var(--blue)' }}>
                  <span
                    className="calc-hub-v8-intent-dot"
                    style={{ background: hub.accent || 'var(--blue)' }}
                    aria-hidden="true"
                  />
                  <span className="calc-hub-v8-intent-copy">
                    <span className="calc-hub-v8-tag" style={{ color: hub.accent || 'var(--blue)', background: `color-mix(in srgb, ${hub.accent || 'var(--blue)'} 12%, var(--bg-surface-1))` }}>
                      {hub.badge}
                    </span>
                    <strong>{hub.title}</strong>
                    <span>{hub.description}</span>
                  </span>
                  <span className="calc-hub-v8-count" style={{ color: hub.accent || 'var(--blue)' }}>{hub.count} أدوات</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* === Category sections — each hub as a distinct colored block === */}
      <section className="calc-hub-cats-wrap" aria-label="الحاسبات مرتبة حسب القسم">
        {archiveGroups.map((group) => {
          const accent = group.accent || '#2563eb';
          return (
            <div
              key={group.slug}
              className="calc-hub-cat-section"
              style={{ '--cat': accent }}
            >
              <div className="calc-hub-v8-wrap">
                <div className="calc-hub-cat-head">
                  <div className="calc-hub-cat-head-copy">
                    <span className="calc-hub-cat-dot" style={{ background: accent }} aria-hidden="true" />
                    <div>
                      <h2 className="calc-hub-cat-title">{group.title}</h2>
                      <p className="calc-hub-cat-desc">{group.description}</p>
                    </div>
                  </div>
                  <Link href={group.href} className="calc-hub-cat-viewall" style={{ color: accent, borderColor: `color-mix(in srgb, ${accent} 30%, var(--border-default))` }}>
                    كل أدوات {group.badge}
                    <span className="calc-hub-cat-arrow" aria-hidden="true" />
                  </Link>
                </div>
                <div className="calc-hub-cat-grid">
                  {group.routes.map((route) => (
                    <Link
                      key={route.slug}
                      href={route.href}
                      className="calc-hub-cat-card"
                      style={{ '--card-accent': accent }}
                    >
                      <span className="calc-hub-cat-card-badge" style={{ color: accent, background: `color-mix(in srgb, ${accent} 11%, var(--bg-surface-1))` }}>
                        {route.badge || group.badge}
                      </span>
                      <strong className="calc-hub-cat-card-title">{route.title}</strong>
                      <span className="calc-hub-cat-card-desc">
                        {route.description ? route.description.slice(0, 90).trimEnd() + '…' : ''}
                      </span>
                      <span className="calc-hub-cat-card-cta" style={{ color: accent }} aria-hidden="true">
                        احسب الآن ←
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="calc-hub-v8-section calc-hub-v8-section-soft" aria-labelledby="calculator-answer-guide">
        <div className="calc-hub-v8-wrap">
          <div className="calc-hub-v8-section-head">
            <span className="calc-hub-v8-kicker">قبل الرقم</span>
            <h2 id="calculator-answer-guide">ما الذي تريد معرفته بالضبط؟</h2>
            <p>السؤال الجيد يوفر عليك التنقل بين أدوات كثيرة. هذه الإجابات تختصر اختيار الحاسبة ودرجة الثقة في النتيجة.</p>
          </div>
          <div className="calc-hub-v8-answer-list">
            {CALCULATOR_QUICK_ANSWERS.map((item, index) => (
              <article key={item.question} className="calc-hub-v8-answer-row">
                <span className="calc-hub-v8-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.question}</h3>
                  <p className="calc-hub-v8-muted">{item.description}</p>
                  <p>{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <AdInFeed slotId="feed-calculators-hub-1" />

      <section className="calc-hub-v8-section" aria-labelledby="calculator-decision-map">
        <div className="calc-hub-v8-wrap">
          <div className="calc-hub-v8-section-head">
            <span className="calc-hub-v8-kicker">خريطة القرار</span>
            <h2 id="calculator-decision-map">حوّل سؤالك إلى مسار واضح</h2>
            <p>اختر نوع السؤال أولاً، ثم افتح الحاسبة المناسبة. هذا يحافظ على الصفحة قصيرة ويجعل الأرشيف في مكانه الصحيح: بعد القرار لا قبله.</p>
          </div>
          <div className="calc-hub-v8-decision-list">
            {CALCULATOR_PATH_TABLE.map((row, index) => (
              <article key={row.key} className="calc-hub-v8-decision-row">
                <span className="calc-hub-v8-number">{String(index + 1).padStart(2, '0')}</span>
                <strong>{row.cells[0]}</strong>
                <span>{row.cells[1]}</span>
                <p>{row.cells[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="calc-hub-v8-section calc-hub-v8-section-soft" aria-labelledby="calculator-method">
        <div className="calc-hub-v8-wrap calc-hub-v8-method">
          <article className="calc-hub-v8-editorial">
            <span className="calc-hub-v8-kicker">منهج الاستخدام</span>
            <h2 id="calculator-method">الحاسبة الجيدة لا تعطيك رقماً فقط</h2>
            <p className="calc-hub-v8-lead-small">
              استخدم الحاسبة كأداة تفكير سريعة: أدخل بيانات قريبة من واقعك، جرّب أكثر من سيناريو، ثم اقرأ حدود النتيجة قبل الاعتماد.
            </p>
            {CALCULATOR_EDITORIAL_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="calc-hub-v8-rules" aria-label="قواعد الثقة قبل استخدام الحاسبة">
            <h3>قواعد الثقة</h3>
            <ul>
              {[...CALCULATOR_READING_RULES.map((item) => item.value), ...CALCULATOR_TRUST_CHECKS].slice(0, 6).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="calc-hub-v8-section" aria-labelledby="calculator-faq">
        <div className="calc-hub-v8-wrap">
          <div className="calc-hub-v8-section-head">
            <span className="calc-hub-v8-kicker">أسئلة مختصرة</span>
            <h2 id="calculator-faq">قبل استخدام أي حاسبة</h2>
            <p>إجابات قصيرة تبقى في الصفحة لمحركات البحث والزائر، من دون أن تتحول إلى جدار نص طويل.</p>
          </div>
          <div className="calc-hub-v8-faq-list">
            {CALCULATOR_QUICK_ANSWERS.map((item, index) => (
              <details key={item.question} className="calc-hub-v8-faq" open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="calc-hub-v8-final" aria-labelledby="calculator-next">
        <div className="calc-hub-v8-wrap">
          <div className="calc-hub-v8-final-head">
            <span className="calc-hub-v8-kicker">بعد الحساب</span>
            <h2 id="calculator-next">حوّل الزيارة الواحدة إلى مسار كامل لاتخاذ القرار</h2>
            <p>لا نريد أن تأخذ رقماً وتغادر بلا سياق. اختر الخطوة التالية التي تكمل نفس القرار: مقارنة رقم آخر، ربط الحساب بوقت أو تاريخ، أو مراجعة حدود الاعتماد قبل تنفيذ شيء مهم.</p>
          </div>

          <div className="calc-hub-v8-next-grid">
            {[
              {
                href: '/calculators/finance',
                label: 'قارن رقماً آخر',
                title: 'أكمل القرار المالي',
                description: 'إذا كان الحساب عن قسط أو ضريبة أو نسبة، افتح مسار المال والعمل وقارن النتيجة بسيناريو آخر قبل الاعتماد.',
              },
              {
                href: '/date',
                label: 'اربطه بالوقت',
                title: 'راجع التاريخ والسياق',
                description: 'إذا كان الرقم مرتبطاً بعمر أو موعد أو تخطيط شهري، افتح التاريخ أو الوقت حتى لا تفصل الحساب عن اليوم الفعلي.',
              },
              {
                href: '/disclaimer',
                label: 'تحقق قبل التنفيذ',
                title: 'اعرف حدود النتيجة',
                description: 'إذا كان القرار قانونياً أو مالياً أو صحياً، استخدم الرقم للفهم فقط ثم راجع الجهة الرسمية أو المختص.',
              },
            ].map((item, index) => (
              <Link key={item.href} href={item.href} className="calc-hub-v8-next-card">
                <span className="calc-hub-v8-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="calc-hub-v8-tag">{item.label}</span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </Link>
            ))}
          </div>

          <nav className="calc-hub-v8-chip-nav" aria-label="روابط مساعدة بعد استخدام الحاسبات">
            {[...platformUtilityLinks, ...trustLinks].slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href}>{link.title}</Link>
            ))}
          </nav>
        </div>
      </section>

      <AdMultiplex slotId="end-calculators-hub" />
    </main>
  );
}
