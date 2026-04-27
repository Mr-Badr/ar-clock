import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Calculator,
  ChartNoAxesCombined,
  Mail,
  Search,
  ShieldCheck,
  Target,
} from 'lucide-react';

import { SITE_CONTACT_EMAIL } from '@/lib/site-config';

import styles from './SiteTrustPanel.module.css';

type PanelType = 'calculators' | 'economy';

interface PanelItem {
  href: string;
  title: string;
  body: string;
  icon: LucideIcon;
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
    eyebrow: 'تجربة أوضح',
    title: 'حوّل الزيارة الواحدة إلى مسار كامل لاتخاذ القرار',
    lead:
      'الحاسبات المفيدة لا تنتهي عند الناتج فقط. هذا الشريط يربطك بالأداة التالية، ويفتح لك مساراً أوضح للمقارنة، والتأكد من الشرح، ثم العودة للموقع عندما يكون عندك سؤال جديد.',
    items: [
      {
        href: '/calculators',
        title: 'ابدأ من مركز الحاسبات',
        body: 'استعرض المسارات حسب السؤال الحقيقي: مال، عمر، نوم، بناء، أو نسب مئوية.',
        icon: Calculator,
      },
      {
        href: '/calculators/finance',
        title: 'اربط القرض والضريبة ونهاية الخدمة',
        body: 'صفحات المال والعمل متجاورة حتى لا يضطر المستخدم للبحث من جديد في كل مرة.',
        icon: ChartNoAxesCombined,
      },
      {
        href: '/fahras',
        title: 'ابحث كما تتحدث',
        body: 'اكتب سؤالك بالعربية مثل: كم قسط قرض 100 ألف أو كم ضريبة 1000 ريال.',
        icon: Search,
      },
      {
        href: '/editorial-policy',
        title: 'اعرف كيف نراجع المحتوى',
        body: 'هذه الصفحة تشرح منهج المراجعة والتحديث وحدود الدقة في الأدوات والمحتوى.',
        icon: ShieldCheck,
      },
    ],
    note: `إذا ظهرت لك نتيجة تحتاج شرحاً أو تحسيناً، يمكنك مراسلتنا مباشرة على ${SITE_CONTACT_EMAIL}.`,
  },
  economy: {
    eyebrow: 'قرار أسرع',
    title: 'اجعل صفحة الاقتصاد لوحة متابعة لا صفحة واحدة معزولة',
    lead:
      'المستخدم الاقتصادي عادة لا يكتفي بمعرفة حالة واحدة. هو يريد أن يعرف السوق المفتوح الآن، نافذة النشاط التالية، ثم ينتقل فوراً إلى الأداة التي تكمل قراره في نفس الجلسة.',
    items: [
      {
        href: '/economie',
        title: 'ابدأ من لوحة الاقتصاد الحي',
        body: 'مدخل واحد يجمع السوق الأمريكي، الذهب، الفوركس، وساعات النشاط اليومية.',
        icon: ChartNoAxesCombined,
      },
      {
        href: '/economie/best-trading-time',
        title: 'اعرف أفضل نافذة بعد الحالة الحالية',
        body: 'بدلاً من سؤال هل السوق مفتوح فقط، انتقل مباشرة إلى أفضل وقت للتداول من مدينتك.',
        icon: Target,
      },
      {
        href: '/disclaimer',
        title: 'راجع حدود الاستخدام بوضوح',
        body: 'صفحات الاقتصاد هنا معلوماتية وتنظيمية، وليست توصيات استثمارية فردية.',
        icon: ShieldCheck,
      },
      {
        href: '/contact',
        title: 'أرسل تصحيحاً أو اقتراحاً',
        body: 'إذا لاحظت وقت سوق غير دقيق أو احتجت إضافة مصدر واضح، تواصل معنا مباشرة.',
        icon: Mail,
      },
    ],
    note: 'كل صفحة اقتصادية أقوى عندما تقودك إلى الخطوة التالية: التحقق، المقارنة، ثم العودة اليومية للمتابعة.',
  },
};

export default function SiteTrustPanel({ panel }: SiteTrustPanelProps) {
  const content = PANEL_CONTENT[panel];

  return (
    <section className={styles.panel} aria-labelledby={`trust-panel-${panel}`}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>{content.eyebrow}</span>
        <h2 id={`trust-panel-${panel}`} className={styles.title}>
          {content.title}
        </h2>
        <p className={styles.lead}>{content.lead}</p>
      </div>

      <div className={styles.grid}>
        {content.items.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className={styles.card}>
              <span className={styles.cardIcon}>
                <Icon size={18} />
              </span>
              <span className={styles.cardTitle}>{item.title}</span>
              <span className={styles.cardBody}>{item.body}</span>
              <span className={styles.cta}>
                افتح الصفحة
                <ArrowLeft size={14} />
              </span>
            </Link>
          );
        })}
      </div>

      <p className={styles.note}>{content.note}</p>
    </section>
  );
}
