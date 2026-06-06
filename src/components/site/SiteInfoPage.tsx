import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_CONTACT_EMAIL } from '@/lib/site-config';

import styles from './SiteInfoPage.module.css';

interface InfoSection {
  title: string;
  content: ReactNode;
}

interface QuickLink {
  href: string;
  label: string;
  description: string;
}

interface SpotlightCard {
  eyebrow: string;
  title: string;
  body: ReactNode;
  href?: string;
  label?: string;
}

interface HeroHighlight {
  value: string;
  label: string;
  detail: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface SiteInfoPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  sections: InfoSection[];
  guidance?: InfoSection;
  quickLinks?: QuickLink[];
  spotlight?: SpotlightCard;
  highlights?: HeroHighlight[];
  faqItems?: FaqItem[];
  note?: ReactNode;
  schema?: object | object[];
  tone?: 'accent' | 'warning';
}

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  {
    href: '/about',
    label: 'من نحن',
    description: 'اقرأ لماذا وُجدت ميقاتنا وكيف تُبنى صفحات الوقت والصلاة والتاريخ والحاسبات.',
  },
  {
    href: '/editorial-policy',
    label: 'السياسة التحريرية',
    description: 'راجع كيف ننشئ المحتوى ونحدثه وكيف نستقبل التصحيحات.',
  },
  {
    href: '/fahras',
    label: 'استكشف الصفحات',
    description: 'اختر الصفحة الأقرب إلى سؤالك أو تنقّل بين المسارات الرئيسية بسهولة.',
  },
  {
    href: '/contact',
    label: 'اتصل بنا',
    description: 'أرسل ملاحظة أو اقتراحاً أو تصحيحاً مع رابط الصفحة.',
  },
];

function isInternalHref(href: string) {
  return href.startsWith('/');
}

export default function SiteInfoPage({
  eyebrow,
  title,
  lead,
  sections,
  guidance,
  quickLinks = DEFAULT_QUICK_LINKS,
  spotlight,
  highlights = [],
  faqItems = [],
  note,
  schema,
  tone = 'accent',
}: SiteInfoPageProps) {
  const eyebrowClassName =
    tone === 'warning' ? `${styles.eyebrow} ${styles.eyebrowWarning}` : styles.eyebrow;
  const safeSections = Array.isArray(sections) ? sections : [];
  const safeQuickLinks = Array.isArray(quickLinks) ? quickLinks : [];
  const safeHighlights = Array.isArray(highlights) ? highlights : [];
  const safeFaqItems = Array.isArray(faqItems) ? faqItems : [];

  return (
    <div className={styles.page} dir="rtl">
      <JsonLd data={schema} />

      <main className={styles.shell}>
        <header className={styles.hero}>
          <span className={eyebrowClassName}>{eyebrow}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          {safeHighlights.length > 0 ? (
            <div className={styles.highlights} aria-label="نقاط توضيحية سريعة">
              {safeHighlights.map((item) => (
                <article key={`${item.value}-${item.label}`} className={styles.highlightCard}>
                  <p className={styles.highlightValue}>{item.value}</p>
                  <p className={styles.highlightLabel}>{item.label}</p>
                  <p className={styles.highlightDetail}>{item.detail}</p>
                </article>
              ))}
            </div>
          ) : null}
        </header>

        <div className={styles.layout}>
          <div className={styles.content}>
            {safeSections.map((section) => (
              <section key={section.title} className={styles.section}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>
                <div className={styles.sectionBody}>{section.content}</div>
              </section>
            ))}
          </div>

          <aside className={styles.aside}>
            {spotlight ? (
              <section className={styles.spotlight}>
                <span className={styles.spotlightEyebrow}>{spotlight.eyebrow}</span>
                <h2 className={styles.spotlightTitle}>{spotlight.title}</h2>
                <div className={styles.spotlightBody}>{spotlight.body}</div>
                {spotlight.href && spotlight.label ? (
                  isInternalHref(spotlight.href) ? (
                    <Link href={spotlight.href} className={styles.spotlightAction}>
                      {spotlight.label}
                      <ArrowLeft size={14} />
                    </Link>
                  ) : (
                    <a href={spotlight.href} className={styles.spotlightAction}>
                      {spotlight.label}
                      <ArrowLeft size={14} />
                    </a>
                  )
                ) : null}
              </section>
            ) : null}

            <section className={styles.quickLinks}>
              <h2 className={styles.quickLinksTitle}>مسارات تساعدك على التحقق أو المتابعة</h2>
              <div className={styles.quickList}>
                {safeQuickLinks.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.quickLink}>
                    <span className={styles.quickLinkLabel}>{item.label}</span>
                    <span className={styles.quickLinkBody}>{item.description}</span>
                  </Link>
                ))}
              </div>
            </section>

            <section className={styles.support}>
              <span className={styles.supportEyebrow}>
                <ShieldCheck size={14} />
                الثقة والتصحيح
              </span>
              <h2 className={styles.supportTitle}>هل وجدت معلومة تحتاج مراجعة؟</h2>
              <p className={styles.supportBody}>
                إذا لاحظت وقتاً أو تاريخاً أو شرحاً يحتاج تحديثاً، أرسل رابط الصفحة والملاحظة إلى{' '}
                <a href={`mailto:${SITE_CONTACT_EMAIL}`}>
                  <Mail size={14} style={{ display: 'inline-block', verticalAlign: 'text-bottom' }} />
                  {' '}
                  {SITE_CONTACT_EMAIL}
                </a>
                .
              </p>
              {note ? <div className={styles.note}>{note}</div> : null}
            </section>
          </aside>
        </div>

        {guidance ? (
          <div className={styles.content}>
            <section className={styles.section} aria-labelledby="site-info-use-heading">
              <h2 id="site-info-use-heading" className={styles.sectionTitle}>
                {guidance.title}
              </h2>
              <div className={styles.sectionBody}>
                {guidance.content}
              </div>
            </section>
          </div>
        ) : null}

        {safeFaqItems.length > 0 ? (
          <section className={styles.faqSection} aria-labelledby="site-info-faq-heading">
            <div className={styles.faqHead}>
              <span className={styles.faqEyebrow}>قبل التواصل</span>
              <h2 id="site-info-faq-heading" className={styles.faqTitle}>
                إجابات مباشرة قبل أن تراسلنا أو تغادر الصفحة
              </h2>
            </div>
            <div className={styles.faqGrid}>
              {safeFaqItems.map((item) => (
                <details key={item.question} className={styles.faqCard}>
                  <summary className={styles.faqQuestion}>{item.question}</summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
