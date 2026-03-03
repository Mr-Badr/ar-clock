'use client';

/**
 * components/TimezoneBanner.client.jsx
 *
 * Reads the browser's IANA timezone from Intl, calls /api/map-timezone-to-city,
 * and shows a discreet bottom banner if a matching city is found.
 *
 * Requires EXPLICIT user confirmation — never auto-redirects.
 * Dismissal is saved in localStorage to avoid repeat shows.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TimezoneBanner() {
  const [city, setCity] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Already dismissed?
    if (localStorage.getItem('tz_banner_dismissed')) return;

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz) return;

      fetch(`/api/map-timezone-to-city?tz=${encodeURIComponent(tz)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.city_name_ar) { setCity(data); setShow(true); }
        })
        .catch(() => { });
    } catch { }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('tz_banner_dismissed', '1');
  };

  if (!show || !city) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      dir="rtl"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-toast)',
        background: 'var(--bg-surface-2)',
        borderTop: '1px solid var(--border-accent-strong)',
        boxShadow: 'var(--shadow-xl)',
        padding: 'var(--space-4) var(--space-5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ color: 'var(--text-primary)', fontSize: 'var(--text-sm)', margin: 0 }}>
        📍 هل ترغب في عرض مواقيت الصلاة في{' '}
        <strong style={{ color: 'var(--accent)' }}>{city.city_name_ar}</strong>،{' '}
        {city.country_name_ar}؟
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexShrink: 0 }}>
        <Link
          href={`/mwaqit-al-salat/${city.country_slug}/${city.city_slug}`}
          onClick={dismiss}
          className="btn btn-primary btn-sm"
          style={{ minHeight: '44px' }}
        >
          نعم، اعرض المواقيت
        </Link>
        <button
          onClick={dismiss}
          className="btn btn-ghost btn-sm"
          style={{ minHeight: '44px' }}
          aria-label="إغلاق"
        >
          لا، شكراً
        </button>
      </div>
    </div>
  );
}
