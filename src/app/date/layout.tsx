// src/app/date/layout.tsx
import type { Metadata } from 'next';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';

export const metadata: Metadata = {
  // Overridden per-page; this is just the segment fallback
  title: {
    default: 'كم التاريخ اليوم؟ | أدوات التاريخ الهجري والميلادي',
    template: '%s | ميقاتنا',
  },
  description:
    'قسم التاريخ في ميقاتنا يضم تاريخ اليوم بالهجري والميلادي، محول التاريخ، التقويم السنوي، والتاريخ حسب الدولة مع صفحات عربية قابلة للفهرسة.',
  keywords: buildDateKeywords(),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
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
