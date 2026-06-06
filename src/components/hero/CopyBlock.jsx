import Link from 'next/link';
import { ArrowLeft, Clock3 } from 'lucide-react';

import HulyButton from '@/components/HulyButton/HulyButton';
import { SITE_BRAND } from '@/lib/site-config';

import styles from './TimeCinematicHero.module.css';

function AuroraText({ children }) {
  return (
    <span className={styles.auroraText}>
      {children}
    </span>
  );
}

export default function CopyBlock({ extraClass, titleId }) {
  const className = [styles.copy, extraClass].filter(Boolean).join(' ');

  return (
    <div className={className}>

      <p className={styles.badge}>{SITE_BRAND}</p>

      <h1 id={titleId} className={styles.title}>
        <AuroraText>جواب يومك يبدأ من ميقاتنا </AuroraText>
        <span className={styles.titleSub}>
          الوقت، الصلاة، التاريخ، الحاسبات والمناسبات في مسارات عربية واضحة.
        </span>
      </h1>

      <p className={styles.desc}>
        ابدأ من السؤال الأقرب لك الآن، ثم انتقل إلى الصفحة التي تعطيك النتيجة والسياق والخطوة التالية من دون بحث مشتت.
      </p>

      <p className={styles.contextLine}>
        <Clock3 size={16} aria-hidden="true" />
        الجواب أولاً، ثم المصدر أو الأداة عند الحاجة.
      </p>

      <div className={styles.ctaWrap}>
        <HulyButton href="/fahras">
          <span>ابدأ من الصفحة المناسبة</span>
        </HulyButton>
        <Link href="/time-now" className={styles.secondaryCta}>
          اعرض الوقت الان
          <ArrowLeft size={16} aria-hidden="true" />
        </Link>
      </div>

    </div>
  );
}
