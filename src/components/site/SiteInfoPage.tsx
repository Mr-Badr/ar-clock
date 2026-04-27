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

interface SiteInfoPageProps {
  eyebrow: string;
  title: string;
  lead: string;
  sections: InfoSection[];
  quickLinks?: QuickLink[];
  spotlight?: SpotlightCard;
  note?: ReactNode;
  schema?: object | object[];
  tone?: 'accent' | 'warning';
}

const DEFAULT_QUICK_LINKS: QuickLink[] = [
  {
    href: '/about',
    label: 'من نحن',
    description: 'تعرف على المشروع، الرؤية، وكيف بُنيت هذه المنصة العربية.',
  },
  {
    href: '/editorial-policy',
    label: 'السياسة التحريرية',
    description: 'راجع كيف ننشئ المحتوى ونحدثه وكيف نستقبل التصحيحات.',
  },
  {
    href: '/fahras',
    label: 'البحث داخل الموقع',
    description: 'ابحث مباشرة عن الأداة أو الصفحة الأقرب إلى سؤالك.',
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
  quickLinks = DEFAULT_QUICK_LINKS,
  spotlight,
  note,
  schema,
  tone = 'accent',
}: SiteInfoPageProps) {
  const eyebrowClassName =
    tone === 'warning' ? `${styles.eyebrow} ${styles.eyebrowWarning}` : styles.eyebrow;

  return (
    <div className={styles.page} dir="rtl">
      <JsonLd data={schema} />

      <main className={styles.shell}>
        <header className={styles.hero}>
          <span className={eyebrowClassName}>{eyebrow}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>
        </header>

        <div className={styles.layout}>
          <div className={styles.content}>
            {sections.map((section) => (
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
              <h2 className={styles.quickLinksTitle}>صفحات مهمة مرتبطة بهذه الصفحة</h2>
              <div className={styles.quickList}>
                {quickLinks.map((item) => (
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
      </main>
    </div>
  );
}
