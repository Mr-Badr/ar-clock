'use client';

/**
 * PrintThemeChooserModal.jsx — v3
 *
 * CLIENT boundary. Handles all interactivity (state, keyboard, focus trap).
 * All static data, palettes, and presentational sub-components live in
 * PrintThemeChooserModal.data.jsx (server-safe, good for SEO / bundle size).
 *
 * Props
 * ─────
 *   isOpen     boolean           Controls visibility
 *   onClose    () => void        Called on ESC / backdrop / Cancel
 *   onSelect   (theme) => void   Called when user confirms — 'light' | 'dark'
 *   actionType 'download'        Reserved for future use
 *
 * Responsive behaviour
 * ────────────────────
 *   Mobile  (< 480px) — bottom sheet; cards stacked horizontally (preview + label)
 *   Tablet  (480–767px) — centred dialog; cards side by side
 *   Desktop (≥ 768px) — wider centred dialog; cards side by side, larger previews
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Palette, Download, X } from '@phosphor-icons/react';

import { ThemeCard } from './PrintThemeChooserModal.data';
import styles from './PrintThemeChooserModal.module.css';

export default function PrintThemeChooserModal({
  isOpen,
  onClose,
  onSelect,
  actionType = 'download',
}) {
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);

  /* Reset selection each open */
  useEffect(() => { if (isOpen) setSelected(null); }, [isOpen]);

  /* ESC to close */
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  /* Auto-focus dialog */
  useEffect(() => {
    if (isOpen && dialogRef.current) dialogRef.current.focus();
  }, [isOpen]);

  const handleConfirm = useCallback(() => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  }, [selected, onSelect, onClose]);

  if (!isOpen) return null;

  const hasSelected = Boolean(selected);

  /* Accent colours for confirm button */
  const confirmBg     = hasSelected
    ? 'var(--accent-gradient, linear-gradient(135deg,#1D4ED8,#4338CA))'
    : 'var(--bg-surface-3)';
  const confirmColor  = hasSelected ? '#fff' : 'var(--text-disabled)';
  const confirmShadow = hasSelected ? 'var(--shadow-accent)' : 'none';

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="اختر نمط التحميل"
      className={styles.portal}
    >
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog card */}
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — visible on mobile only via CSS */}
        <div className={styles.dragHandle} aria-hidden="true" />

        {/* ── Title row ── */}
        <div className={styles.titleRow}>
          <div className={styles.titleGroup}>
            <div className={styles.iconWrap}>
              <Palette size={17} color="var(--accent-alt)" weight="duotone" />
            </div>
            <div>
              <h2 className={styles.heading}>اختر نمط ملف PDF</h2>
              <p className={styles.subheading}>
                سيُطبَّق على الملف فقط — الشاشة لا تتأثر
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق"
            className={styles.closeBtn}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Theme cards ── */}
        <div className={styles.cardsGrid}>
          <ThemeCard
            isDark={false}
            selected={selected === 'light'}
            onSelect={() => setSelected('light')}
          />
          <ThemeCard
            isDark={true}
            selected={selected === 'dark'}
            onSelect={() => setSelected('dark')}
          />
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          {hasSelected && (
            <span className={styles.selectionHint}>
              ✓ {selected === 'light' ? 'الوضع النهاري' : 'الوضع الليلي'} محدد
            </span>
          )}

          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            إلغاء
          </button>

          <button
            className={styles.confirmBtn}
            onClick={handleConfirm}
            disabled={!hasSelected}
            style={{
              background:  confirmBg,
              color:       confirmColor,
              opacity:     hasSelected ? 1 : 0.5,
              boxShadow:   confirmShadow,
            }}
          >
            <Download size={13} />
            تحميل الآن
          </button>
        </div>
      </div>
    </div>
  );
}