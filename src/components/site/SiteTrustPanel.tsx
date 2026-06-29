import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getDefaultAuthor } from '@/data/site/authors';
import { SITE_CONTACT_EMAIL } from '@/lib/site-config';

import styles from './SiteTrustPanel.module.css';

type PanelType = 'calculators' | 'blog' | 'time' | 'prayer' | 'date';

interface PanelItem {
  href: string;
  title: string;
  body: string;
}

interface PanelContent {
  eyebrow: string;
  title: string;
  lead: string;
  items: PanelItem[];
  note: string;
}

interface SiteTrustPanelProps {
  panel: PanelType;
}

const PANEL_CONTENT: Record<PanelType, PanelContent> = {
  calculators: {
    eyebrow: 'بعد النتيجة',
    title: 'ماذا تفعل بعد أن تظهر لك النتيجة؟',
    lead: 'إذا حصلت على الرقم الذي تريده، لا تحتاج أن تبدأ البحث من جديد. اختر الخطوة الأقرب لسؤالك: حاسبة أخرى، شرح طريقة الحساب، أو صفحة تساعدك على المقارنة.',
    items: [
      {
        href: '/calculators',
        title: 'كل الحاسبات في مكان واحد',
        body: 'اختر الأداة حسب ما تريد حسابه: مال، عمر، نوم، بناء، أو نسبة.',
      },
      {
        href: '/calculators/finance',
        title: 'انتقل بين حاسبات المال والعمل',
        body: 'القرض والضريبة ونهاية الخدمة في مسار واحد حتى تقارن الأرقام بسهولة.',
      },
      {
        href: '/editorial-policy',
        title: 'كيف نراجع البيانات؟',
        body: 'الأرقام في حاساباتنا مستندة إلى جهات رسمية. اعرف المنهجية وحدود الدقة.',
      },
      {
        href: '/fahras',
        title: 'ابحث بسؤالك كما تكتبه',
        body: 'اكتب مثالاً بسيطاً مثل: كم قسط قرض 100 ألف؟ أو كم ضريبة 1000 ريال؟',
      },
    ],
    note: `إذا ظهرت لك نتيجة غير واضحة أو تحتاج مثالاً أفضل، يمكنك مراسلتنا مباشرة على ${SITE_CONTACT_EMAIL}.`,
  },
  blog: {
    eyebrow: 'قراءة أوثق',
    title: 'اجعل المقال بداية رحلة لا صفحة معزولة',
    lead: 'المقال الجيد لا يشرح الفكرة فقط، بل يوضح لك أين تكمل بعدها: صفحة أداة، مقال مرتبط، سياسة تحريرية، أو وسيلة تواصل إذا وجدت نقطة تحتاج تصحيحاً أو توضيحاً.',
    items: [
      {
        href: '/blog',
        title: 'ارجع إلى المدونة',
        body: 'انتقل بين المقالات حسب الموضوع حتى لا تنتهي القراءة عند صفحة واحدة فقط.',
      },
      {
        href: '/editorial-policy',
        title: 'اعرف كيف نراجع المحتوى',
        body: 'هذه الصفحة تشرح طريقة التحرير والمراجعة وحدود الدقة وكيف نحدّث الصفحات.',
      },
      {
        href: '/fahras',
        title: 'استكشف الصفحات حسب سؤالك',
        body: 'إذا تغيّر سؤالك بعد القراءة، افتح استكشف للانتقال السريع إلى القسم أو الأداة الأقرب.',
      },
      {
        href: '/contact',
        title: 'أرسل ملاحظة أو اقتراحاً',
        body: 'إذا وجدت فقرة تحتاج توضيحاً أو إضافة، يمكنك مراسلتنا مباشرة بدل مغادرة الموقع بصمت.',
      },
    ],
    note: `إذا شعرت أن المقال يحتاج تحديثاً أو مثالاً أوضح، اكتب لنا على ${SITE_CONTACT_EMAIL} وسنراجع ذلك.`,
  },
  time: {
    eyebrow: 'متابعة أسهل',
    title: 'حوّل صفحة الوقت إلى نقطة انطلاق مفيدة',
    lead: 'من يبحث عن الوقت الان لا يريد فقط ساعة رقمية، بل يريد أن يكمل بسرعة إلى الصلاة أو التاريخ أو فرق التوقيت أو صفحة الدولة نفسها.',
    items: [
      {
        href: '/time-now',
        title: 'ابدأ من مركز الوقت الان',
        body: 'ارجع إلى بوابة الوقت لاستكشاف الدول والمدن والانتقال بينها بسرعة.',
      },
      {
        href: '/time-difference',
        title: 'قارن التوقيت فوراً',
        body: 'إذا كان هدفك اجتماع أو سفر أو مكالمة، افتح فرق التوقيت بدل الاكتفاء بوقت مدينة واحدة.',
      },
      {
        href: '/date/today',
        title: 'راجع تاريخ اليوم',
        body: 'انتقل إلى التاريخ الميلادي والهجري اليوم إذا كان سؤالك مرتبطاً بالموعد لا بالساعة فقط.',
      },
      {
        href: '/contact',
        title: 'أبلغ عن ملاحظة',
        body: 'إذا لاحظت اسم مدينة يحتاج تصحيحاً أو صفحة ناقصة، يمكنك مراسلتنا مباشرة.',
      },
    ],
    note: 'صفحات الوقت الأفضل هي التي تعطي الإجابة بسرعة، ثم تفتح لك المسار التالي بوضوح إذا احتجته.',
  },
  prayer: {
    eyebrow: 'انتقال أوضح',
    title: 'اجعل صفحة الصلاة دليلك اليومي لا محطة سريعة فقط',
    lead: 'ابدأ بمعرفة وقت الصلاة القادم بسرعة، ثم انتقل بسهولة إلى صفحة الدولة أو المدينة التالية أو صفحة الوقت والتاريخ المرتبطة بنفس السؤال.',
    items: [
      {
        href: '/mwaqit-al-salat',
        title: 'ارجع إلى بوابة مواقيت الصلاة',
        body: 'ابدأ من صفحة رئيسية تجمع البحث السريع والمدن الأكثر طلباً والشرح الأساسي لطريقة الحساب.',
      },
      {
        href: '/editorial-policy',
        title: 'اعرف طريقة الحساب المعتمدة',
        body: 'نشرح الطريقة الحسابية المستخدمة لكل دولة وسبب اختلاف المواقيت بين جهات الإفتاء.',
      },
      {
        href: '/date/today/hijri',
        title: 'راجع التاريخ الهجري اليوم',
        body: 'صفحة التاريخ تفيدك إذا كان سؤالك مرتبطاً ببداية الشهر أو بموعد عبادي لا بالساعة فقط.',
      },
      {
        href: '/contact',
        title: 'أبلغ عن طريقة حساب أو مدينة',
        body: 'إذا لاحظت مدينة ناقصة أو طريقة حساب تحتاج مراجعة، يمكنك مراسلتنا مباشرة.',
      },
    ],
    note: `إذا لاحظت مدينة ناقصة أو طريقة حساب تحتاج مراجعة، يمكنك مراسلتنا مباشرة على ${SITE_CONTACT_EMAIL}.`,
  },
  date: {
    eyebrow: 'خطوة تالية مفيدة',
    title: 'اجعل صفحة التاريخ مدخلاً أوسع للموعد الذي تبحث عنه',
    lead: 'من يدخل صفحة التاريخ غالباً لا يريد رقماً فقط، بل يريد أن يعرف ماذا بعد: تحويل تاريخ، وقت محلي، أو صفحة البلد المرتبطة بنفس اليوم والموعد.',
    items: [
      {
        href: '/date',
        title: 'ارجع إلى مركز التاريخ',
        body: 'من هنا تنتقل إلى تاريخ اليوم، المحول، صفحات الدول، والتقويمات المرتبطة بها.',
      },
      {
        href: '/date/converter',
        title: 'حوّل التاريخ مباشرة',
        body: 'إذا كان عندك موعد قديم أو مستقبلي، انتقل إلى أداة التحويل بدل البحث اليدوي بين الأشهر.',
      },
      {
        href: '/editorial-policy',
        title: 'كيف نحسب التقويم الهجري؟',
        body: 'نشرح الفرق بين حساب أم القرى والرؤية الفلكية وما نعتمده ولماذا.',
      },
      {
        href: '/contact',
        title: 'أرسل ملاحظة أو تصحيحاً',
        body: 'إذا وجدت صفحة بلد تحتاج توضيحاً أو تحديثاً، يمكنك مراسلتنا بسهولة من صفحة التواصل.',
      },
    ],
    note: 'أفضل صفحات التاريخ هي التي تعطي اليوم بوضوح، ثم تقودك مباشرة إلى التحويل أو الوقت أو صفحة البلد المرتبطة به.',
  },
};

export default function SiteTrustPanel({ panel }: SiteTrustPanelProps) {
  const content = PANEL_CONTENT[panel];
  const author = getDefaultAuthor();

  return (
    <section className={styles.panel} aria-labelledby={`trust-panel-${panel}`}>
      {/* Credibility strip — who maintains this */}
      <div className={styles.credStrip}>
        <span className={styles.credItem}>
          <span className={styles.credLabel}>إعداد</span>
          <Link href={`/author/${author.id}`} className={styles.credValue}>{author.name}</Link>
          <span className={styles.credSep}>·</span>
          <span className={styles.credRole}>{author.role}</span>
        </span>
        <span className={styles.credItem}>
          <span className={styles.credLabel}>المنهجية</span>
          <Link href="/editorial-policy" className={styles.credValue}>السياسة التحريرية</Link>
        </span>
        <span className={styles.credItem}>
          <span className={styles.credLabel}>خطأ؟</span>
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className={styles.credValue}>راسلنا</a>
        </span>
      </div>

      {/* Next-step navigation */}
      <div className={styles.head}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h2 id={`trust-panel-${panel}`} className={styles.title}>
          {content.title}
        </h2>
        <p className={styles.lead}>{content.lead}</p>
      </div>

      <ol className={styles.grid} aria-label="روابط تساعدك على الخطوة التالية داخل ميقاتنا">
        {content.items.map((item, index) => (
          <li key={item.href} className={styles.item}>
            <Link href={item.href} className={styles.card}>
              <span className={styles.step} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.cardCopy}>
                <span className={styles.cardTitle}>{item.title}</span>
                <span className={styles.cardBody}>{item.body}</span>
              </span>
              <span className={styles.cta}>
                افتح الصفحة
                <ArrowLeft size={14} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className={styles.note}>
        <span className={styles.noteLabel}>ملاحظة شفافة</span>
        <p className={styles.noteText}>{content.note}</p>
      </div>
    </section>
  );
}
