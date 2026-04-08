import { buildCanonicalMetadata } from '@/lib/seo/metadata';
import { SITE_BRAND, getSiteUrl } from '@/lib/site-config';
import Link from 'next/link';

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/disclaimer`;

export const metadata = buildCanonicalMetadata({
  title: 'إخلاء المسؤولية',
  description:
    `إخلاء المسؤولية الخاص بموقع ${SITE_BRAND}، مع توضيح حدود استخدام أدوات الوقت والاقتصاد والمحتوى المعلوماتي، وأنها ليست نصيحة استثمارية أو قانونية أو مصدراً مطلقاً للحقيقة.`,
  keywords: [
    `إخلاء المسؤولية ${SITE_BRAND}`,
    'تنبيه قانوني',
    'ليست نصيحة استثمارية',
    'حدود استخدام أدوات الاقتصاد',
    'إخلاء ذمة الموقع',
  ],
  url: PAGE_URL,
});

function Section({ title, children }) {
  return (
    <section
      style={{
        background: 'var(--bg-surface-1)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)',
        padding: 'var(--space-6)',
      }}
    >
      <h2
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--font-bold)',
          marginBottom: 'var(--space-4)',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: 'grid',
          gap: 'var(--space-4)',
          color: 'var(--text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function DisclaimerPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `إخلاء المسؤولية | ${SITE_BRAND}`,
    url: PAGE_URL,
    inLanguage: 'ar',
    dateModified: '2026-04-06',
  };

  return (
    <div className="bg-base" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="container" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-16)' }}>
        <header style={{ maxWidth: '76ch', marginBottom: 'var(--space-10)' }}>
          <p
            style={{
              display: 'inline-flex',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              background: 'var(--warning-soft)',
              color: 'var(--warning)',
              border: '1px solid var(--warning-border)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-semibold)',
              marginBottom: 'var(--space-4)',
            }}
          >
            إخلاء المسؤولية
          </p>
          <h1
            style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-4)',
            }}
          >
            نعرض أدوات معلوماتية لمساعدتك، لا لنقدّم حقيقة مطلقة أو نصيحة فردية
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', fontSize: 'var(--text-lg)' }}>
            يقدّم {SITE_BRAND} أدوات للوقت والتواريخ والمناسبات والاقتصاد بهدف المساعدة العملية وتنظيم
            المعلومة للقارئ العربي. ومع ذلك، يجب فهم هذه الأدوات ضمن حدودها الطبيعية: هي أدوات
            معلوماتية وإرشادية، وليست بديلاً عن المصادر الرسمية أو الاستشارات المهنية المتخصصة.
          </p>
        </header>

        <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
          <Section title="1. طبيعة المحتوى والأدوات">
            <p>
              المعلومات المعروضة في صفحات {SITE_BRAND} تهدف إلى الشرح، التبسيط، وتقديم أدوات مساعدة
              عملية. نحن نحاول تحسين وضوح المعلومة ودقتها، لكننا لا نزعم أن كل صفحة تمثل مصدراً
              نهائياً أو مرجعاً رسمياً وحيداً لكل حالة استخدام.
            </p>
            <p>
              هذا ينطبق خصوصاً على الأدوات الاقتصادية مثل جلسات الفوركس، أفضل وقت للتداول، ساعة السوق،
              وحالة البورصات العالمية. هذه الصفحات تساعد المستخدم على الفهم والتنظيم والمتابعة، لكنها
              لا تحل محل التحقق من المصدر الرسمي أو منصة الوسيط أو الجهة المنظمة أو السوق نفسه.
            </p>
          </Section>

          <Section title="2. ليست نصيحة استثمارية أو قانونية أو مهنية">
            <p>
              لا يشكل أي محتوى في هذا الموقع نصيحة استثمارية شخصية، ولا توصية شراء أو بيع، ولا دعوة
              إلى فتح صفقة أو إغلاقها، ولا استشارة قانونية أو ضريبية أو تنظيمية. نحن لا نعرف ظروفك
              المالية، أهدافك، قدرتك على تحمل المخاطر، أو وضعك القانوني، ولذلك لا ينبغي تفسير أي أداة
              أو شرح على أنه توجيه فردي مخصص لك.
            </p>
            <p>
              إذا كنت تحتاج إلى قرار استثماري أو التزام تنظيمي أو رأي قانوني في نشاط منظم، فالمسار
              الصحيح هو الرجوع إلى مستشار مؤهل أو محام أو جهة تنظيمية مختصة بحسب بلدك ونوع النشاط.
            </p>
          </Section>

          <Section title="3. حدود الدقة والاعتماد على المصادر">
            <p>
              نبذل جهداً لتحسين الدقة، ونستخدم حسابات زمنية ومصادر سوقية ومراجع رسمية حيث أمكن. لكن
              بعض البيانات قد تتأثر بعوامل خارجة عن سيطرتنا، مثل العطل الرسمية، الإغلاقات الاستثنائية،
              اختلاف ساعات الوسطاء، التوقفات الفنية، تأخر مزود البيانات، أو تغيرات التوقيت الصيفي
              وانتقالاته الموسمية.
            </p>
            <p>
              لذلك، إذا كنت تعتمد على وقت سوق أو حالة جلسة قبل تنفيذ فعلي، فيجب عليك التحقق من البورصة
              أو الوسيط أو الجهة الرسمية ذات الصلة. ما نعرضه هنا يساعدك على الاتجاه الصحيح، لكنه لا
              يغني وحده عن التحقق النهائي.
            </p>
          </Section>

          <Section title="4. النتائج والمخاطر والمسؤولية">
            <p>
              استخدامك للموقع وأدواته يكون على مسؤوليتك الخاصة. لا نضمن تحقيق نتيجة مالية معينة، ولا
              نضمن أن أي توقيت أو شرح أو نافذة نشاط سيؤدي إلى ربح أو يقلل خسارة أو يناسب استراتيجيتك.
              الوقت المناسب ظاهرياً لا يلغي مخاطر السوق أو الانزلاق أو الأخبار أو خطأ التقدير.
            </p>
            <p>
              كما لا نتحمل مسؤولية أي خسائر أو أضرار مباشرة أو غير مباشرة تنشأ عن اعتماد المستخدم على
              المحتوى دون التحقق المناسب أو دون استخدام إدارة مخاطر ملائمة أو دون مراجعة المصادر
              الرسمية عندما يكون ذلك ضرورياً.
            </p>
          </Section>

          <Section title="5. كيف نعرض هذا التنبيه بوضوح">
            <p>
              نحاول أن تكون التنبيهات الجوهرية في الصفحات الاقتصادية واضحة ومرئية ومكتوبة بلغة مفهومة،
              لا مدفونة في نص صغير. إذا رأيت صفحة اقتصادية تحتاج إلى توضيح أقوى أو صياغة أدق في
              التنبيه، يمكنك مراسلتنا وسنراجعها.
            </p>
            <p>
              الهدف من هذا الإخلاء ليس التهرب من المسؤولية الأخلاقية، بل وضع حدود الاستخدام بصدق: نحن
              نحاول المساعدة وتقديم أداة نافعة، لكننا لا نريد أن نفسح المجال لفهم مضلل بأن الأداة
              حقيقة مطلقة أو توصية مهنية فردية.
            </p>
          </Section>

          <Section title="6. التواصل وطلب التصحيح">
            <p>
              إذا لاحظت خطأ في صفحة اقتصادية أو أردت لفت نظرنا إلى تنبيه قانوني أو تنظيمي أو مصدر رسمي
              يجب إضافته، يمكنك مراسلتنا على:
              {' '}
              <Link href="mailto:mr.elharchali@gmail.com" style={{ color: 'var(--accent-alt)' }}>
                mr.elharchali@gmail.com
              </Link>
              .
            </p>
            <p>آخر تحديث لهذه الصفحة: 6 أبريل 2026.</p>
          </Section>
        </div>
      </main>
    </div>
  );
}
