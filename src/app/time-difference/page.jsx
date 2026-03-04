import React from 'react';
import TimeDiffCalculator from '@/components/TimeDifference/TimeDiffCalculatorV2.client';

export const metadata = {
  title: 'فرق التوقيت بين مدينتين — حاسبة الفرق الزمني الدقيقة | وقت',
  description: 'احسب فرق التوقيت بين أي مدينتين في العالم بدقة متناهية. معرفة الساعة الآن في أي دولة مع مراعاة التوقيت الصيفي والشتوي تلقائياً.',
  keywords: 'فرق التوقيت, فرق التوقيت بين المدن, تحويل التوقيت, الساعة الآن, الفرق بين توقيت, حاسبة الوقت',
  alternates: {
    canonical: '/time-difference'
  },
  openGraph: {
    title: 'حاسبة فرق التوقيت بين المدن',
    description: 'احسب فرق التوقيت بين أي مدينتين في العالم بدقة متناهية.',
    url: '/time-difference',
    type: 'website',
    locale: 'ar_SA'
  }
};

const faqs = [
  {
    q: "كيفية حساب فرق التوقيت بين مدينتين؟",
    a: "تقوم حاسبتنا بحساب فرق التوقيت تلقائياً بالاعتماد على قاعدة بيانات عالمية للمناطق الزمنية (TZ Database)، بحيث تقارن التوقيت المحلي للمدينة الأولى مع المدينة الثانية موفرةً لك الفرق الدقيق بالساعات والدقائق."
  },
  {
    q: "هل تأخذ الحاسبة التوقيت الصيفي (DST) في الاعتبار؟",
    a: "نعم، النظام مبرمج للتعرف على التوقيت الصيفي والشتوي لكل مدينة وتحديثه تلقائياً حسب التاريخ الحالي."
  },
  {
    q: "كيف يمكنني معرفة الساعة الآن في دولة أخرى؟",
    a: "اختر دولتك أو مدينتك في الحقل الأول، ثم اختر المدينة التي تريد معرفة وقتها في الحقل الثاني. ستعرض لك الحاسبة الوقت الحالي هناك مباشرة."
  },
  {
    q: "هل يمكنني مشاركة نتيجة فرق التوقيت؟",
    a: "نعم، بمجرد اختيار المدينتين، يمكنك النقر على زر 'مشاركة المقارنة' للحصول على رابط مباشر يفتح على نفس المدينتين."
  },
  {
    q: "هل تختلف أوقات الدوام عند وجود فرق توقيت؟",
    a: "نعم بالطبع. عندما يكون هناك فرق توقيت كبير، فإن ساعات العمل المعتادة (من 9 صباحًا إلى 5 مساءً) لا تتطابق بشكل كامل، وقد تضطر لتنسيق مواعيدك بدقة لضمان وجود التداخل المناسب للمكالمات والاجتماعات."
  },
  {
    q: "ما هو توقيت جرينتش (GMT) والتوقيت العالمي المنسق (UTC)؟",
    a: "التوقيت العالمي المنسق (UTC) هو المعيار الزمني الذي يُبنى عليه توقيت كوكب الأرض، أما توقيت جرينتش (GMT) فهو المنطقة الزمنية لخط الطول صفر. جميع الدول تقاس بفروق الساعات نسبة إلى UTC، سواء بجمع الساعات أو طرحها."
  },
  {
    q: "هل يمكنني الاعتماد على هذه الحاسبة للصلوات؟",
    a: "بينما تعطيك الحاسبة الوقت الفعلي لأي مدينة، يفضل دائماً استخدام صفحة مواقيت الصلاة المخصصة لدينا للحصول على مواعيد دقيقة للأذان بحسب المعادلات الفلكية الدقيقة والموقع الجغرافي."
  },
  {
    q: "لماذا تقوم بعض الدول بتغيير وقتها مرتين في السنة؟",
    a: "بهدف توفير الطاقة واستغلال ساعات النهار، تعتمد الكثير من الدول نظام التوقيت الصيفي، حيث تُقدم الساعة بمقدار 60 دقيقة في الربيع، وتعاد كما كانت في الخريف."
  },
  {
    q: "ما هو أكبر فرق توقيت بين بلدين في العالم؟",
    a: "يبلغ أقصى فرق ممكن للتوقيت في العالم حوالي 26 ساعة، ويكون عادة بين الجزر الموجودة على طرفي خط التاريخ الدولي في المحيط الهادئ المتباعدة بحدود 12 ساعة موجبة وسالبة."
  },
  {
    q: "كيف اتجنب الاتصال بشخص وهو نائم بسبب فرق التوقيت؟",
    a: "تسهل أداة فرق التوقيت لدينا إظهار حالة الوقت في الوجهة إذا كانت (اليوم التالي) أو (السابق). كما توفر أداة توضيح ساعات العمل إمكانية رؤية أفضل وقت مشترك."
  },
  {
    q: "هل يؤثر الفارق الزمني على أوقات الأذان؟",
    a: "بالتأكيد، حيث ترتبط أوقات الأذان بحركة الشمس التي تختلف من مدينة لأخرى. لذلك فإن كل مدينة حول العالم لها مواقيت صلاة مستقلة حتى لو كانت تقع في نفس الدولة أو تتبع نفس التوقيت المحلي."
  },
  {
    q: "كيف أرسل رابط فرق التوقيت لزميلي في العمل؟",
    a: "من خلال حاسبة فرق الساعات أعلاه، بعد اختيار المدينتين، انقر على 'مشاركة المقارنة' لنسخ الرابط الذي يمكن لزميلك فتحه والاطلاع على التوقيت المشترك مباشرة."
  },
  {
    q: "الفرق بين توقيت السعودية وتوقيت دبي؟",
    a: "توقيت دبي يسبق توقيت السعودية (الرياض) بساعة واحدة دائماً، لأن الإمارات تقع في النطاق الزمني UTC+4 والسعودية تقع في UTC+3، ولا يطبقان التوقيت الصيفي."
  }
];

export default function TimeDifferencePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[var(--bg-default)] text-[var(--text-primary)]" dir="rtl">
      {/* JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent-glow)] rounded-full blur-[120px] opacity-20 -z-10 animate-pulse-slow"></div>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            فرق التوقيت بين مدينتين — <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#38b2ac]">حاسبة الفرق الزمني الدقيقة</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-muted)] max-w-2xl mx-auto font-medium">
            حاسبة دقيقة وسريعة لمعرفة فرق التوقيت وتحويل الوقت بين أي دولتين أو مدينتين حول العالم، مع دعم كلي للتوقيت الصيفي.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="px-4 pb-20 relative z-10">
        <TimeDiffCalculator />
      </section>

      {/* SEO Content & SEO Structure */}
      <section className="px-4 py-20 bg-[var(--bg-surface-1)] border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-[var(--border-subtle)] pb-4 inline-block">كيفية حساب فرق التوقيت</h2>
            <p className="text-[var(--text-muted)] leading-relaxed text-lg mb-4">
              حساب فرق التوقيت لم يعد مهمة معقدة. تعتمد أداتنا على أحدث قواعد البيانات العالمية للمناطق الزمنية. 
              عند اختيارك لمدينتين، يقوم خادمنا بحساب الفارق الزمني عبر تحويل الوقت القياسي لكل مدينة مقارنة بتوقيت جرينتش (UTC)، 
              ثم إيجاد الفارق النهائي لمساعدتك في تنسيق اجتماعاتك ومكالماتك الدولية بسهولة.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed text-lg">
              وبمجرد معرفة فرق الساعات الدقيق والوقت أينما كنت تسافر، يمكنك أيضاً الاعتماد على منصتنا لمعرفة 
              <a href="/mwaqit-al-salat" className="text-[var(--text-link)] hover:text-[var(--text-link-hover)] underline">مواقيت الصلاة
              </a>
               لمدينتك القادمة، وحتى تفحص <a href="/holidays" className="text-[var(--text-link)] hover:text-[var(--text-link-hover)] underline">العطلات الرسمية
              </a> 
              لتخطيط إجازتك الاستثنائية بكل ذكاء واحترافية.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-[var(--border-subtle)] pb-4 inline-block">الفرق بين التوقيت الصيفي والشتوي</h2>
            <p className="text-[var(--text-muted)] leading-relaxed text-lg">
              تطبق العديد من الدول نظام التوقيت الصيفي (Daylight Saving Time)، حيث يتم تقديم الساعة بمقدار 60 دقيقة في أشهر الصيف.
              حاسبة الوقت الخاصة بنا تتبنى هذا النظام وتبرز بوضوح ما إذا كانت المدينة تعتمد التوقيت الصيفي أو الشتوي (القياسي) في الوقت الحالي،
              لتفادي أي التباس في فارق الساعات.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-[var(--border-subtle)] pb-4 inline-block">تحويل الوقت بين الدول خطوة بخطوة</h2>
            <p className="text-[var(--text-muted)] leading-relaxed text-lg mb-4">
              لتحويل الوقت بين أي دولتين بدقة، اتبع الخطوات التالية: أولاً، حدد مدينتك أو بلد الإقامة في الحقل الأول، ثم اختر الوجهة التي ترغب في معرفة فارق التوقيت معها.
              فور اختيارك للوجهتين، سيتم عرض فرق الساعات مباشرة، بالإضافة إلى توقيت كلتا المدينتين جنباً إلى جنب متضمناً حالة التوقيت الصيفي.
              كما توفر حاسبة الوقت لدينا ميزة عرض ساعات العمل المشتركة لتسهيل التنسيق الدولي بشكل تلقائي وذكي.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-[var(--border-subtle)] pb-4 inline-block">أسئلة شائعة حول فرق التوقيت</h2>
            <div className="grid gap-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-[var(--bg-surface-2)] p-6 rounded-2xl border border-[var(--border-subtle)]">
                  <h3 className="font-bold text-xl mb-3">{faq.q}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
