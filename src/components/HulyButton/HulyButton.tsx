'use client';

import { useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import styles from './HulyButton.module.css';

type HulyButtonProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

const DEFAULT_X = -75;
const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_MS = 600;
const RING_SHIFT = 6;

export default function HulyButton({
  href = '#',
  children,
  className = '',
}: HulyButtonProps) {
  const btnRef = useRef<HTMLAnchorElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const ringRRef = useRef<HTMLDivElement | null>(null);
  const ringLRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const insideRef = useRef(false);

  const clamp = (v: number, lo: number, hi: number) =>
    v < lo ? lo : v > hi ? hi : v;

  const moveBlob = (x: number) => {
    if (!blobRef.current) return;
    blobRef.current.style.transition = 'none';
    blobRef.current.style.transform = `translateX(${x}px)`;
  };

  const moveRings = (shift: number, eased = false) => {
    const ringR = ringRRef.current;
    const ringL = ringLRef.current;
    if (!ringR || !ringL) return;

    const transitionValue = `transform ${EASE_MS}ms ${EASE}, opacity ${EASE_MS}ms ease`;

    ringR.style.transition = eased ? transitionValue : 'none';
    ringL.style.transition = eased ? transitionValue : 'none';

    ringR.style.transform = `translate(calc(-50% + ${shift}px), -50%)`;
    ringL.style.transform = `translate(calc(-50% + ${shift}px), -50%) scaleX(-1)`;
  };

  const setRingsInstant = (rightOpacity: number, leftOpacity: number, shift: number) => {
    const ringR = ringRRef.current;
    const ringL = ringLRef.current;
    if (!ringR || !ringL) return;

    moveRings(shift, false);
    ringR.style.opacity = String(rightOpacity);
    ringL.style.opacity = String(leftOpacity);
  };

  const setRingsEased = (rightOpacity: number, leftOpacity: number, shift: number) => {
    const ringR = ringRRef.current;
    const ringL = ringLRef.current;
    if (!ringR || !ringL) return;

    moveRings(shift, true);
    ringR.style.opacity = String(rightOpacity);
    ringL.style.opacity = String(leftOpacity);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    insideRef.current = true;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const rect = btn.getBoundingClientRect();
    const offset = e.clientX - rect.left - rect.width / 2;
    const ratio = clamp(offset / (rect.width / 2), -1, 1);

    const rightGlow = clamp(ratio, 0, 1);
    const leftGlow = clamp(-ratio, 0, 1);
    const ringShift = Math.sin(ratio * Math.PI * 0.5) * RING_SHIFT;

    if (blobRef.current) {
      blobRef.current.style.transition = 'none';
    }

    moveBlob(offset);
    setRingsInstant(rightGlow, leftGlow, ringShift);
  };

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const btn = btnRef.current;
    if (!btn || !insideRef.current) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const rect = btn.getBoundingClientRect();
      const offset = e.clientX - rect.left - rect.width / 2;
      const ratio = clamp(offset / (rect.width / 2), -1, 1);

      moveBlob(offset);

      const rightGlow = Math.pow(clamp(ratio, 0, 1), 0.9);
      const leftGlow = Math.pow(clamp(-ratio, 0, 1), 1.8);
      const ringShift = Math.sin(ratio * Math.PI * 0.5) * RING_SHIFT;

      setRingsInstant(rightGlow, leftGlow, ringShift);
    });
  };

  const handleMouseLeave = () => {
    insideRef.current = false;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (blobRef.current) {
      blobRef.current.style.transition = `transform ${EASE_MS}ms ${EASE}`;
      blobRef.current.style.transform = `translateX(${DEFAULT_X}px)`;
    }

    setRingsEased(0, 1, 0);
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div
        ref={ringRRef}
        className={`${styles.borderBlur} ${styles.borderBlurNormal}`}
      >
        <div className={styles.borderInner} />
      </div>

      <div
        ref={ringLRef}
        className={`${styles.borderBlur} ${styles.borderBlurMirrored}`}
      >
        <div className={styles.borderInner} />
      </div>

      <a
        ref={btnRef}
        href={href}
        className={styles.button}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={blobRef} className={styles.lightBlob}>
          <div className={styles.lightBlobCore} />
          <div className={styles.lightBlobHalo} />
        </div>

        <span className={styles.label}>{children}</span>

        <svg
          className={styles.arrow}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 9"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
          />
        </svg>
      </a>
    </div>
  );
}