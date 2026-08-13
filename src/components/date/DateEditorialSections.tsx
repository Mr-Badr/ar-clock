import type { ReactElement } from 'react';
import { AlertTriangle, CheckCircle2, Circle, Info, Sparkles } from 'lucide-react';
import { SiteFaqAccordion } from '@/components/shared/SiteFaqAccordion';
import styles from './DateEditorialSections.module.css';

export type DateInsightTone = 'accent' | 'default' | 'info' | 'success' | 'warning';

export interface DateInsightItem {
  badge: string;
  title: string;
  body: string;
  tone: DateInsightTone;
}

export interface DateFaqItem {
  question: string;
  answer: string;
}

interface DateEditorialSectionsProps {
  badge: string;
  title: string;
  intro: string;
  insights: DateInsightItem[];
  faqTitle: string;
  faqItems: DateFaqItem[];
}

interface DateFaqJsonLdInput {
  pageName: string;
  items: DateFaqItem[];
}

function isValidInsightItem(item: unknown): item is DateInsightItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<DateInsightItem>;
  return Boolean(
    typeof candidate.badge === 'string'
      && candidate.badge.trim().length > 0
      && typeof candidate.title === 'string'
      && candidate.title.trim().length > 0
      && typeof candidate.body === 'string'
      && candidate.body.trim().length > 0
      && candidate.tone
      && ['accent', 'default', 'info', 'success', 'warning'].includes(candidate.tone),
  );
}

function isValidFaqItem(item: unknown): item is DateFaqItem {
  if (!item || typeof item !== 'object') return false;
  const candidate = item as Partial<DateFaqItem>;
  return Boolean(
    typeof candidate.question === 'string'
      && candidate.question.trim().length > 0
      && typeof candidate.answer === 'string'
      && candidate.answer.trim().length > 0,
  );
}

// Icon follows tone so the color and the glyph always agree — callers only ever pick a tone,
// never an icon directly (owner, 2026-08-13: real visual weight per row, not a bare text line).
const TONE_ICON: Record<DateInsightTone, typeof Sparkles> = {
  accent: Sparkles,
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  default: Circle,
};

const TONE_CHIP_CLASS: Record<DateInsightTone, string> = {
  accent: styles.chipAccent,
  success: styles.chipSuccess,
  info: styles.chipInfo,
  warning: styles.chipWarning,
  default: styles.chipDefault,
};

export function buildDateFaqJsonLd(input: DateFaqJsonLdInput): object {
  const safeItems = Array.isArray(input.items) ? input.items.filter(isValidFaqItem) : [];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: input.pageName,
    mainEntity: safeItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function DateEditorialSections({
  badge,
  title,
  intro,
  insights,
  faqTitle,
  faqItems,
}: DateEditorialSectionsProps): ReactElement {
  const safeInsights = Array.isArray(insights) ? insights.filter(isValidInsightItem) : [];
  const safeFaqItems = Array.isArray(faqItems) ? faqItems.filter(isValidFaqItem) : [];

  return (
    <>
      <section className={styles.section} dir="rtl">
        <div className={styles.head}>
          <span className="badge badge-accent">{badge}</span>
          <h2 className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>
            {intro}
          </p>
        </div>

        {safeInsights.length > 0 ? (
          <ul className={styles.insightList}>
            {safeInsights.map((item) => {
              const Icon = TONE_ICON[item.tone];
              return (
                <li key={item.title} className={styles.insightRow}>
                  <span className={`${styles.insightIcon} ${TONE_CHIP_CLASS[item.tone]}`} aria-hidden="true">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <span className={styles.insightRowBody}>
                    <strong className={styles.panelTitle}>{item.title}</strong>
                    <span className={styles.body}>{item.body}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.body} role="status">
            نعرض لك الإجابة الأساسية أولاً، ثم يمكنك استخدام مسارات التحويل والتقويم القريبة للتحقق من التاريخ بطريقة أخرى إذا كانت المناسبة رسمية أو مرتبطة بسفر.
          </p>
        )}
      </section>

      <section className={styles.section} dir="rtl">
        <div className={styles.prose}>
          <h2 className={styles.title}>
            كيف تتحقق من التاريخ قبل الاعتماد عليه؟
          </h2>
          <p className={styles.body}>
            ابدأ دائماً من التاريخ الأصلي الذي تعرفه: اليوم، الشهر، السنة، ونوع التقويم. بعد ذلك راجع طريقة التحويل أو طريقة الحساب المعروضة في الصفحة، خصوصاً عندما يكون التاريخ مرتبطاً بوثيقة رسمية أو موعد ديني أو سفر أو مراسلة بين بلدين مختلفين.
          </p>
          <p className={styles.body}>
            إذا كانت النتيجة مهمة قانونياً أو حكومياً، فاستخدم هذه الصفحة كمرجع سريع ومنظم ثم طابقها مع الجهة الرسمية المختصة. أما للاستخدام اليومي مثل مشاركة تاريخ، معرفة اليوم، أو مقارنة الميلادي بالهجري، فمسارات اليوم السابق والتالي والمحوّل تساعدك على مراجعة النتيجة من أكثر من زاوية دون فتح أدوات خارجية.
          </p>
          <p className={styles.body}>
            أفضل نتيجة هي التي يمكن شرحها لشخص آخر بسهولة: اذكر التاريخ، نوع التقويم، وطريقة الحساب عند الحاجة. هذه الصيغة الصغيرة تجعل المشاركة أوضح وتقلل احتمالات اختلاف يوم واحد بين بلدين.
          </p>
        </div>
      </section>

      <section className={styles.section} dir="rtl">
        <h2 className={styles.faqTitle}>
          {faqTitle}
        </h2>
        {safeFaqItems.length > 0 ? (
          <SiteFaqAccordion items={safeFaqItems} />
        ) : (
          <p className={styles.body} role="status">
            لم تتوفر أسئلة تفصيلية لهذه الصفحة الآن. استخدم الإجابة الرئيسية، ثم راجع محول التاريخ أو التقويم السنوي إذا كان التاريخ يحتاج تحققاً إضافياً.
          </p>
        )}
      </section>
    </>
  );
}
