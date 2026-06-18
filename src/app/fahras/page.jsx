import { Suspense } from 'react';
import DiscoveryWorkspace from '@/components/site/DiscoveryWorkspace';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import {
  buildDiscoveryViewModel,
  normalizeDiscoveryQueryValue,
  POPULAR_SITE_SEARCHES,
} from '@/lib/site/discovery';
import { getSiteUrl } from '@/lib/site-config';

const SITE_URL = getSiteUrl();
const VALID_TABS = new Set(['all', 'tools', 'articles', 'sections', 'featured']);
const DISCOVERY_BASE_TITLE = 'فهرس ميقاتنا: ابدأ من سؤالك وافتح الأداة المناسبة';
const DISCOVERY_BASE_DESCRIPTION =
  'افتح فهرس ميقاتنا عندما لا تعرف اسم الصفحة: اكتب سؤالك وانتقل إلى أداة الوقت أو الصلاة أو التاريخ أو الحاسبة أو المقال المناسب.';

const BASE_KEYWORDS = [
  'استكشف صفحات ميقاتنا',
  'صفحات ميقاتنا',
  'فهرس ميقاتنا',
  'فهرس أدوات عربية',
  'كل أدوات ميقاتنا',
  'البحث في ميقاتنا',
  'دليل أدوات الوقت',
  'دليل مواقيت الصلاة',
  'دليل محول التاريخ',
  'المدونة العربية في ميقاتنا',
  'الحاسبات العربية',
  'حاسبات أونلاين عربية',
  'الوقت الان ومواقيت الصلاة',
  'مسارات ميقاتنا',
  'أدوات ميقاتنا',
  'كل صفحات ميقاتنا',
  ...POPULAR_SITE_SEARCHES.slice(0, 14),
];

const DISCOVERY_ENTRY_POINTS = [
  {
    href: '/time-now',
    title: 'الوقت الان',
    description: 'ابدأ هنا إذا كنت تريد الساعة الحالية في دولة أو مدينة، أو تحتاج الانتقال بسرعة إلى فرق التوقيت.',
  },
  {
    href: '/mwaqit-al-salat',
    title: 'مواقيت الصلاة',
    description: 'افتح هذا المسار لمعرفة أوقات الصلاة اليوم، ثم اختر الدولة أو المدينة قبل الاعتماد على الموعد.',
  },
  {
    href: '/date/today',
    title: 'تاريخ اليوم',
    description: 'استخدمه عندما تريد التاريخ الميلادي أو الهجري اليوم، أو تحتاج إلى محول التاريخ والتقويم السنوي.',
  },
  {
    href: '/calculators',
    title: 'الحاسبات',
    description: 'يناسبك إذا كنت تريد حساب قسط، ضريبة، نسبة، عمر، صندوق طوارئ، نوم، أو تكلفة بناء.',
  },
  {
    href: '/blog',
    title: 'المقالات العملية',
    description: 'اقرأ الشروحات عندما تحتاج أن تفهم الفكرة قبل استخدام الأداة أو قبل الاعتماد على الرقم.',
  },
];

const DISCOVERY_FAQ_ITEMS = [
  {
    question: 'ما فائدة فهرس ميقاتنا؟',
    answer:
      'فهرس ميقاتنا يجمع أدوات الوقت، مواقيت الصلاة، التاريخ، الحاسبات، المناسبات، والمقالات في صفحة واحدة، حتى تبدأ من السؤال المناسب بدلاً من تجربة روابط كثيرة.',
  },
  {
    question: 'هل أبدأ من الأداة أم من المقال؟',
    answer:
      'ابدأ من الأداة عندما تريد رقماً أو موعداً فورياً، مثل الوقت الان أو حاسبة القسط. وابدأ من المقال عندما تحتاج شرحاً أو أمثلة أو حدوداً قبل الاعتماد على النتيجة.',
  },
  {
    question: 'هل الفهرس يغني عن التحقق الرسمي؟',
    answer:
      'لا. الفهرس يساعدك على الوصول إلى الصفحة المناسبة داخل ميقاتنا، لكن القرارات الرسمية أو الدينية أو المالية تحتاج مراجعة الجهة المعتمدة أو المصدر الرسمي عند الحاجة.',
  },
  {
    question: 'كيف أبحث داخل الفهرس؟',
    answer:
      'اكتب السؤال كما تفكر فيه: كم الساعة في دبي، تحويل هجري إلى ميلادي، حاسبة الضريبة، أو كم باقي على رمضان. سيعرض الفهرس أقرب الصفحات والأدوات والمقالات.',
  },
];

const FAHRAS_FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  name: 'أسئلة فهرس ميقاتنا',
  url: `${SITE_URL}/fahras`,
  inLanguage: 'ar',
  mainEntity: DISCOVERY_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const metadata = buildCanonicalMetadata({
  title: DISCOVERY_BASE_TITLE,
  description: DISCOVERY_BASE_DESCRIPTION,
  keywords: BASE_KEYWORDS,
  url: `${SITE_URL}/fahras`,
});

function normalizeTabParam(value) {
  const normalized = String(value || '').trim().toLowerCase();
  return VALID_TABS.has(normalized) ? normalized : 'all';
}

function DiscoveryFallback() {
  return (
    <main dir="rtl" aria-busy="true" className="min-h-[60vh] bg-[var(--bg-base)]">
      <div className="mx-auto grid w-[min(1120px,calc(100vw-56px))] gap-[var(--space-8)] pb-[var(--space-16)] pt-[calc(var(--app-header-height)+var(--space-10))]">
        <section className="grid gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)] p-[var(--space-6)]">
          <p className="w-fit rounded-[var(--radius-md)] bg-[var(--bg-surface-2)] px-[var(--space-3)] py-[var(--space-2)] text-[var(--text-sm)] font-bold text-[var(--text-muted)]">
            استكشف ميقاتنا
          </p>
          <p className="max-w-[18ch] font-[var(--font-heading)] text-[2.4rem] font-black leading-[1.15] text-[var(--text-primary)]">
            فهرس ميقاتنا: اختر الأداة أو المقال من أول مرة
          </p>
          <div className="grid max-w-[76ch] gap-[var(--space-3)] text-[1.02rem] leading-[2] text-[var(--text-secondary)]">
            <p>
              فهرس ميقاتنا هو صفحة البداية عندما لا تعرف اسم الأداة التي تحتاجها. ابدأ من
              السؤال نفسه: هل تريد معرفة الوقت الان؟ مواقيت الصلاة؟ تحويل تاريخ هجري أو
              ميلادي؟ حاسبة قسط أو ضريبة؟ موعد مناسبة؟ ستجد المسار الأقرب بدل أن
              تتنقل بين روابط متشابهة.
            </p>
            <p>
              الفهرس ليس قائمة طويلة للزينة. هو خريطة قرار: الأداة عندما تحتاج نتيجة سريعة،
              المقال عندما تحتاج أن تفهم قبل القرار، والقسم عندما تريد رؤية كل المسارات
              القريبة. بهذه الطريقة تصل إلى الصفحة التي تفيدك الآن، ثم تنتقل إلى ما يكملها
              فقط إذا احتجت.
            </p>
            <p>
              إذا كان السؤال يمس صلاة، تاريخاً رسمياً، أو قراراً مالياً، استخدم الفهرس
              للوصول والفهم، ثم راجع المصدر المعتمد عند الحاجة. ويمكنك معرفة منهج المراجعة
              من صفحة السياسة التحريرية أو إرسال تصحيح من صفحة التواصل.
            </p>
            <p>
              ستجد أيضاً روابط الثقة الأساسية مثل من نحن، التواصل، سياسة الخصوصية، وإخلاء
              المسؤولية، لأن صفحة الفهرس يجب أن تساعدك على الوصول إلى الخدمة والمعلومة
              وطريقة التحقق منها من المكان نفسه.
            </p>
            <p>
              أفضل طريقة لاستخدام هذه الصفحة أن تبدأ بالفعل الذي تريد إنجازه: معرفة موعد،
              تحويل تاريخ، حساب رقم، قراءة شرح، أو الوصول إلى صفحة ثقة. عندما يكون المطلوب
              سريعاً افتح الأداة مباشرة، وعندما يكون القرار محتاجاً سياقاً افتح المقال أو
              صفحة المنهج أولاً ثم ارجع إلى الأداة.
            </p>
          </div>
        </section>

        <section className="grid gap-[var(--space-4)]" aria-label="أقرب مسارات الفهرس">
          <div className="grid gap-[var(--space-2)]">
            <h2 className="font-[var(--font-heading)] text-[1.45rem] font-black leading-[1.3] text-[var(--text-primary)]">
              اختر المسار حسب ما تريد فعله الآن
            </h2>
            <p className="max-w-[72ch] text-[1rem] leading-[1.9] text-[var(--text-secondary)]">
              استخدم هذه المداخل كخريطة سريعة أثناء تحميل الفهرس التفاعلي. كل رابط يفتح
              باباً واضحاً، ثم يمكنك تضييق الاختيار حسب الدولة، المدينة، نوع الحاسبة،
              الموضوع، أو المقال المرتبط بسؤالك.
            </p>
          </div>

          <div className="grid gap-[var(--space-3)] md:grid-cols-2 lg:grid-cols-3">
            {DISCOVERY_ENTRY_POINTS.map((entry) => (
              <a
                key={entry.href}
                href={entry.href}
                className="grid min-h-[150px] gap-[var(--space-2)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-[var(--space-4)] text-current no-underline"
              >
                <strong className="text-[1.08rem] font-black leading-[1.6] text-[var(--text-primary)]">
                  {entry.title}
                </strong>
                <span className="text-[0.96rem] leading-[1.9] text-[var(--text-secondary)]">
                  {entry.description}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="grid gap-[var(--space-3)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)] p-[var(--space-6)]">
          <h2 className="font-[var(--font-heading)] text-[1.35rem] font-black leading-[1.35] text-[var(--text-primary)]">
            كيف تستخدم الفهرس دون أن تضيع بين الروابط؟
          </h2>
          <div className="grid gap-[var(--space-3)] text-[1rem] leading-[1.95] text-[var(--text-secondary)] md:grid-cols-3">
            <p>
              اكتب السؤال كما تفكر فيه: اسم مدينة، بلد، أداة، مناسبة، أو موضوع. البحث
              الداخلي يرتب النتائج الأقرب بدلاً من عرض قائمة عامة.
            </p>
            <p>
              إذا لم تكن متأكداً، افتح القسم الأقرب ثم انتقل منه إلى الصفحات المكملة. مثال:
              صندوق الطوارئ يبدأ من الحاسبة أو المقال، وليس من فهرس طويل.
            </p>
            <p>
              عند وجود أكثر من نتيجة، اختر الصفحة التي تعطيك الفعل المطلوب الآن: معرفة
              الوقت، حساب رقم، قراءة شرح، أو مقارنة موعد وتاريخ. وللمعلومات الحساسة،
              راجع <a href="/editorial-policy" className="font-bold text-[var(--accent-alt)]">السياسة التحريرية</a>
              {' '}و<a href="/disclaimer" className="font-bold text-[var(--accent-alt)]">إخلاء المسؤولية</a>.
            </p>
          </div>
        </section>

        <section className="grid gap-[var(--space-4)] rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface)] p-[var(--space-6)]">
          <div className="grid gap-[var(--space-2)]">
            <h2 className="font-[var(--font-heading)] text-[1.35rem] font-black leading-[1.35] text-[var(--text-primary)]">
              متى تختار الأداة، ومتى تختار الشرح؟
            </h2>
            <p className="max-w-[76ch] text-[1rem] leading-[1.95] text-[var(--text-secondary)]">
              أفضل تجربة في ميقاتنا تبدأ من نية واضحة. إذا كنت تريد رقماً أو موعداً الآن،
              افتح الأداة مباشرة. إذا كان الرقم سيؤثر في مالك أو عبادتك أو موعد رسمي،
              فاقرأ الشرح وحدود الاعتماد أولاً ثم استخدم الأداة كخطوة مساعدة.
            </p>
          </div>

          <div className="grid gap-[var(--space-3)] md:grid-cols-2">
            <article className="grid gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-[var(--space-4)]">
              <strong className="text-[1.02rem] font-black leading-[1.6] text-[var(--text-primary)]">
                افتح الأداة مباشرة عندما يكون السؤال حسابياً
              </strong>
              <p className="m-0 text-[0.96rem] leading-[1.9] text-[var(--text-secondary)]">
                مثل: كم الساعة في مدينة؟ كم باقي على مناسبة؟ كم يساوي 15%؟ ما تاريخ
                اليوم؟ هذه أسئلة تحتاج نتيجة فورية، ثم يمكنك حفظ الرابط أو مشاركة النتيجة
                إذا احتجت.
              </p>
            </article>

            <article className="grid gap-[var(--space-2)] rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-[var(--space-4)]">
              <strong className="text-[1.02rem] font-black leading-[1.6] text-[var(--text-primary)]">
                اقرأ الشرح عندما يكون القرار له أثر
              </strong>
              <p className="m-0 text-[0.96rem] leading-[1.9] text-[var(--text-secondary)]">
                مثل: قسط تمويل، نهاية خدمة، صندوق طوارئ، موعد صلاة محلي، أو تاريخ عطلة
                رسمية. هنا لا يكفي الرقم وحده؛ تحتاج أن تعرف مصدره وحدوده ومتى تراجع
                جهة رسمية أو مختصاً.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

async function FahrasContent({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const query = normalizeDiscoveryQueryValue(resolvedSearchParams?.q);
  const initialTab = normalizeTabParam(resolvedSearchParams?.tab);
  const viewModel = buildDiscoveryViewModel(query);

  return <DiscoveryWorkspace mode="map" viewModel={viewModel} initialTab={initialTab} />;
}

export default function FahrasPage({ searchParams }) {
  return (
    <>
      <JsonLd data={FAHRAS_FAQ_SCHEMA} />
      <h1 className="sr-only">فهرس ميقاتنا للوصول إلى الأداة أو المقال من أول مرة</h1>
      <Suspense fallback={<DiscoveryFallback />}>
        <FahrasContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}
