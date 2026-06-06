import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

import styles from './HulyButton.module.css';

type HulyButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function HulyButton(props: HulyButtonProps) {
  const className = props.className ?? '';

  return (
    <Link href={props.href} className={`${styles.button} ${className}`.trim()}>
      <span className={styles.label}>{props.children}</span>
      <ArrowLeft className={styles.arrow} size={16} aria-hidden="true" />
    </Link>
  );
}
