// src/app/date/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Overridden per-page; this is just the segment fallback
  title: {
    default: 'أدوات التاريخ الهجري والميلادي | ميقاتنا',
    template: '%s | ميقاتنا',
  },
};

export default function DateLayout({ children }: { children: React.ReactNode }) {
  return (
    // Static segment wrapper — no <html>/<body>, no duplication of root layout
    // The root layout already sets dir="rtl" and RTL body globally
    <div className="date-feature-root">
      {children}
    </div>
  );
}
