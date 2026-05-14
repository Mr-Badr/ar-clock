// src/components/hero/CopyBlock.jsx  — Server Component (no 'use client')
//
// Theme note:
// ─────────────────────────────────────────────────────────────────────────────
// The previous version added className="dark" to titleSub and desc to force
// dark-palette token values. That worked when the hero always had a dark video
// background. Now that the hero uses a proper light/dark gradient background
// (`:global(.light) .heroRoot` in TimeCinematicHero.module.css), every text
// element should resolve its color tokens naturally from the cascade — no
// manual .dark override needed.
//
// Adding .dark on a light-background hero makes light-palette text
// (--text-secondary: #A8B2CB) invisible against the near-white canvas.
// Removing it lets the app theme class resolve the correct value per mode:
//   dark  → --text-secondary: #A8B2CB  ✓ readable on dark hero
//   light → --text-secondary: #536080  ✓ readable on light hero
// ─────────────────────────────────────────────────────────────────────────────

import styles from './TimeCinematicHero.module.css';
import Link from 'next/link';
import HulyButton from '@/components/HulyButton/HulyButton';
import { SITE_BRAND } from '@/lib/site-config';

const HERO_QUICK_LINKS = [
  { href: '/fahras', label: 'الفهرس الشامل' },
  { href: '/calculators', label: 'الحاسبات' },
  { href: '/economie', label: 'الاقتصاد' },
  { href: '/holidays', label: 'المناسبات' },
  { href: '/guides', label: 'الأدلة' },
];

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

      <p className={styles.badge}>منصة عربية ليومك كله</p>

      <h1 className={styles.title}>
        <AuroraText>{SITE_BRAND}</AuroraText>
        {/* No .dark override — resolves to correct token per active theme */}
        <span className={styles.titleSub}>
          الوقت والصلاة والتاريخ والحاسبات والاقتصاد
        </span>
      </h1>

      {/* No .dark override — resolves to correct token per active theme */}
      <p className={styles.desc}>
        {SITE_BRAND} لا يقتصر على الساعة الآن فقط. هنا تجد الوقت والصلاة والتاريخ والمناسبات والحاسبات وأدوات الاقتصاد والأدلة العملية داخل تجربة عربية واحدة مترابطة وواضحة.
      </p>

      <div style={{ marginTop: '32px', padding: '4px' }}>
        <HulyButton href="/fahras">
          <span>افتح الفهرس الشامل</span>
        </HulyButton>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem',
          marginTop: '1rem',
        }}
      >
        {HERO_QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.55rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface-1)',
              color: 'var(--text-secondary)',
              fontSize: '0.92rem',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

    </div>
  );
}
