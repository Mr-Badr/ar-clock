// CopyBlock.jsx  — Server Component (no 'use client')
import styles from './TimeCinematicHero.module.css';
import HulyButton from '@/components/HulyButton/HulyButton';

function AuroraText({ children }) {
  return (
    <span className={styles.auroraText} style={{ paddingBottom: '0.3em' }}>
      {children}
    </span>
  );
}

export default function CopyBlock({ extraClass = '' }) {
  return (
    <div className={`${styles.copy} ${extraClass}`}>

      <p className={styles.badge}>أخيراً، أداة صُنعت لك</p>

      <h1 className={styles.title}>
        <AuroraText>ميقات</AuroraText>
        <span className={styles.titleSub}>لكل لحظة، معناها الحقيقي</span>
      </h1>

      <p className={styles.desc}>
        نعرف كم يعني لك وقتك. لذلك بنينا ميقات — منصة عربية تضع كل ما يحتاجه يومك بين يديك، بدقة تشعر معها أن كل أداة صُممت لك وحدك
      </p>

      <div style={{ marginTop: '32px', padding: '4px' }}>
        <HulyButton href="/time-now">
          <span>استكشف الوقت حول العالم</span>
        </HulyButton>
      </div>

    </div>
  );
}