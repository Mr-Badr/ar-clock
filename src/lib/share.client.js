'use client';

import { useEffect, useRef, useState } from 'react';

export function getCurrentPageUrl(fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return window.location.href || fallback;
}

export async function copyTextToClipboard(text) {
  const value = String(text || '').trim();
  if (!value) return false;

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // Fall through to the legacy path below.
    }
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const originalRange =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    const copied =
      typeof document.execCommand === 'function' && document.execCommand('copy');

    document.body.removeChild(textarea);

    if (selection) {
      selection.removeAllRanges();
      if (originalRange) selection.addRange(originalRange);
    }

    return copied;
  } catch {
    return false;
  }
}

export function useCopyFeedback(durationMs = 2200) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = async (text) => {
    const ok = await copyTextToClipboard(text);
    if (!ok) return false;

    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), durationMs);
    return true;
  };

  return { copied, copy };
}
