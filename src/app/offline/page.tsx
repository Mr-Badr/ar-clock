import Link from 'next/link';
import type { Metadata } from 'next';
import { CalendarDays, Clock3, Search, ShieldCheck, WifiOff } from 'lucide-react';
import ReloadButton from './ReloadButton';

export const metadata: Metadata = {
  title: 'أنت غير متصل الآن | صفحة وضع عدم الاتصال في ميقاتنا',
  description: 'صفحة وضع عدم الاتصال في ميقاتنا: لماذا توقف التحميل، ماذا تفعل الآن، ومتى يجب إعادة تحميل الوقت والصلاة والتاريخ والحاسبات بعد عودة الشبكة.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  const recoverySteps = [
    {
      title: 'ابدأ من الاتصال نفسه',
      description: 'تأكد من اتصال الهاتف أو الحاسوب بالشبكة، ثم اضغط إعادة المحاولة. إذا كنت تستخدم شبكة عامة، قد تحتاج تسجيل الدخول للشبكة أولاً.',
    },
    {
      title: 'لا تعتمد على صفحة قديمة في قرار دقيق',
      description: 'الوقت الان، مواقيت الصلاة، التاريخ الحالي، والحاسبات تحتاج اتصالاً حديثاً. انتظر عودة الشبكة قبل أن تبني عليها موعداً أو صلاة أو قراراً.',
    },
    {
      title: 'ارجع إلى المسار الصحيح بعد الاتصال',
      description: 'إذا كنت لا تتذكر الصفحة، افتح الفهرس. وإذا كنت تعرف سؤالك، افتح مركز التاريخ أو الوقت الان أو مواقيت الصلاة مباشرة.',
    },
  ];

  const safeOfflineChecks = [
    'إذا كان السؤال عن صلاة أو موعد أو تاريخ اليوم أو نتيجة حاسبة، أعد التحميل بعد عودة الشبكة.',
    'إذا ظهرت الصفحة نفسها بعد عودة الاتصال، جرّب تبديل الشبكة أو إيقاف وضع توفير البيانات.',
    'إذا كنت تستخدم نسخة مثبتة كتطبيق، افتحها مرة أخرى بعد الاتصال حتى يحدّث المتصفح ملفاتها.',
  ];

  const offlineFacts = [
    {
      title: 'هذه ليست صفحة خطأ عشوائية',
      description: 'يعرضها المتصفح عندما يفشل تحميل صفحة ميقاتنا ولا توجد نسخة آمنة يمكن الاعتماد عليها في التخزين المؤقت.',
    },
    {
      title: 'لا نخزّن نتائج حية قد تربكك',
      description: 'الساعة، مواقيت الصلاة، وفروق التوقيت قد تتغير أو تعتمد على موقعك. عرض قيمة قديمة قد يكون أسوأ من إيقاف التجربة.',
    },
    {
      title: 'الروابط هنا تنتظر عودة الاتصال',
      description: 'يمكنك اختيار المسار الآن، لكن الصفحة المناسبة تحتاج شبكة حتى تعرض البيانات المحدثة بدقة.',
    },
  ];

  const availablePaths = [
    {
      href: '/date',
      title: 'مركز التاريخ',
      description: 'تاريخ اليوم، التحويل، والتقاويم عند عودة الاتصال.',
      icon: CalendarDays,
    },
    {
      href: '/date/today',
      title: 'تاريخ اليوم',
      description: 'افتحه بعد الاتصال لمعرفة التاريخ الهجري والميلادي الحالي.',
      icon: CalendarDays,
    },
    {
      href: '/time-now',
      title: 'الوقت الان',
      description: 'معرفة الساعة في الدول والمدن بعد استعادة الشبكة.',
      icon: Clock3,
    },
    {
      href: '/mwaqit-al-salat',
      title: 'مواقيت الصلاة',
      description: 'تحقق من أوقات الصلاة بعد استعادة الاتصال والمدينة الصحيحة.',
      icon: Clock3,
    },
    {
      href: '/fahras',
      title: 'فهرس الأدوات',
      description: 'ابحث عن صفحات الوقت والتاريخ والصلاة والحاسبات من مكان واحد.',
      icon: Search,
    },
  ];

  return (
    <main
      className="bg-base"
      style={{
        minHeight: '100dvh',
        padding: 'calc(var(--space-8) + 6vh) var(--space-4) var(--space-8)',
      }}
      dir="rtl"
    >
      <div
        className="content-col"
        style={{
          maxWidth: '880px',
        }}
      >
        <div
          className="card card--accent"
          style={{
            padding: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto var(--space-4)',
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--accent-soft)',
              color: 'var(--accent-alt)',
            }}
          >
            <WifiOff size={34} strokeWidth={1.75} />
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
              fontWeight: 'var(--font-black)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            أنت غير متصل بالإنترنت
          </h1>

          <p
            style={{
              maxWidth: '620px',
              margin: '0 auto var(--space-6)',
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            تعذر تحميل الصفحة لأن الاتصال انقطع. سنحافظ على التجربة واضحة بدلاً من عرض صفحة فارغة: أعد المحاولة، أو افتح مساراً أساسياً عند عودة الشبكة.
            لا نعطيك وقتاً أو تاريخاً قديماً قد يربك قرارك.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-3)',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <ReloadButton />

            <Link
              href="/"
              className="btn"
              style={{
                width: '100%',
                minHeight: '48px',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-surface-3)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 'var(--font-semibold)',
                fontSize: 'var(--text-base)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>

        <section
          className="mt-6"
          aria-labelledby="offline-facts-title"
        >
          <h2 id="offline-facts-title" className="text-xl font-bold text-primary mb-4">
            ما الذي يحدث في وضع عدم الاتصال؟
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: 'var(--space-4)',
            }}
          >
            {offlineFacts.map((fact) => (
              <article
                key={fact.title}
                className="card card--flat"
                style={{
                  margin: 0,
                  display: 'grid',
                  gap: 'var(--space-2)',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-bold)',
                    lineHeight: 'var(--leading-snug)',
                  }}
                >
                  {fact.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}
                >
                  {fact.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="card mt-6"
          aria-labelledby="offline-recovery-title"
        >
          <h2 id="offline-recovery-title" className="card__title mb-4">ماذا تفعل الآن؟</h2>
          <ol
            style={{
              display: 'grid',
              gap: 'var(--space-4)',
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {recoverySteps.map((step, index) => (
              <li
                key={step.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: 'var(--space-3)',
                  alignItems: 'start',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '2rem',
                    height: '2rem',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface-3)',
                    color: 'var(--accent-alt)',
                    fontWeight: 'var(--font-bold)',
                  }}
                >
                  {index + 1}
                </span>
                <span>
                  <strong
                    style={{
                      display: 'block',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    {step.title}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      color: 'var(--text-secondary)',
                      lineHeight: 'var(--leading-relaxed)',
                    }}
                  >
                    {step.description}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="mt-8"
          aria-labelledby="offline-trust-title"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'var(--space-6)',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              aria-hidden="true"
              style={{
                width: '48px',
                height: '48px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-surface-3)',
                color: 'var(--success)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <ShieldCheck size={24} strokeWidth={1.75} />
            </div>
            <h2 id="offline-trust-title" className="text-xl font-bold text-primary mb-4">
              لماذا لا نعرض بيانات قديمة؟
            </h2>
            <p className="text-sm text-secondary leading-relaxed mb-3">
              بعض صفحات ميقاتنا تعتمد على بيانات حية أو شبه حية، مثل الوقت الان، فرق التوقيت، مواقيت الصلاة، والتحويلات المرتبطة بتاريخ اليوم. عرض نتيجة قديمة في هذه الحالات قد يربكك أكثر مما يساعدك، لذلك نفضّل إيقاف التجربة مؤقتاً مع رسالة واضحة بدلاً من تقديم معلومة غير مؤكدة.
            </p>
            <p className="text-sm text-secondary leading-relaxed m-0">
              هدف وضع عدم الاتصال ليس إبقاءك داخل الموقع بأي ثمن، بل توضيح ما حدث وما القرار الصحيح بعده. عند عودة الاتصال يمكنك إعادة تحميل الصفحة نفسها، أو الانتقال إلى مركز التاريخ والفهرس للوصول إلى الأداة المطلوبة بسرعة.
            </p>
          </div>

          <div
            className="card card--flat"
            style={{
              margin: 0,
            }}
          >
            <h3 className="card__title mb-4">قاعدة القرار السريعة</h3>
            <ul
              style={{
                display: 'grid',
                gap: 'var(--space-3)',
                margin: 0,
                paddingInlineStart: 'var(--space-5)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {safeOfflineChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="offline-paths-title">
          <h2 id="offline-paths-title" className="text-xl font-bold text-primary mb-4">
            مسارات مهمة عند عودة الاتصال
          </h2>
          <div className="related-links__grid">
            {availablePaths.map((item) => {
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href} className="related-link-card">
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{item.title}</span>
                    <span className="related-link-card__desc">{item.description}</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
