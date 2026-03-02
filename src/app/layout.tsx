import './new.css';
import type { Metadata } from 'next';
import { Noto_Kufi_Arabic } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';

// Load every weight the design system uses.
// --font-extrabold (800) is required for clock digits.
// --font-black (900) is required for fullscreen clock.
const notoKufi = Noto_Kufi_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-noto-kufi',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ar-clock.vercel.app'), // Replace with actual domain when known
  title: 'ساعة عربية - الوقت الآن في جميع أنحاء العالم',
  description: 'تطبيق ساعة عالمية باللغة العربية لمتابعة الوقت بدقة في مختلف المدن والدول حول العالم مع تنبيهات للمناسبات.',
  keywords: ['ساعة', 'وقت', 'عالمية', 'توقيت', 'السعودية', 'مصر', 'الإمارات', 'موعد'],
  authors: [{ name: 'Waqt Clock' }],
  openGraph: {
    title: 'ساعة عربية | الوقت الآن',
    description: 'الوقت الآن في جميع أنحاء العالم',
    siteName: 'ساعة عربية',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ساعة عربية | الوقت الآن',
    description: 'تطبيق ساعة عالمية لمتابعة الوقت في مختلف المدن والدول.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is required because next-themes writes
    // class="dark|light|contrast" on <html> after hydration.
    //
    // theme-transition: defined in the CSS (section 30) — enables smooth
    // bg/color/border animations on every element when the theme class changes.
    // It MUST be on <html> (not <body>) to cover the full document tree.
    //
    // The font variable is passed so any component can reference
    // var(--font-noto-kufi) directly if needed alongside the body rule.
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${notoKufi.variable}`}
    >
      {/* The CSS @layer base already sets body styles:
            background-color: var(--bg-base)
            color:            var(--text-primary)
            font-family:      'Noto Kufi Arabic', system-ui, sans-serif
            min-height:       100dvh
            direction:        rtl
          So no colour or layout classes are needed here — they would
          duplicate or fight the design system's base rules.
          notoKufi.className activates the loaded font family. */}
      <body className={notoKufi.className}>
        <ThemeProvider>
          {children}
          {/* Sonner Toaster — dir and position match RTL layout */}
          <Toaster
            dir="rtl"
            position="bottom-left"
            toastOptions={{
              // Use design system surface and border tokens via CSS vars
              style: {
                background: 'var(--bg-surface-3)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
                borderRight: '3px solid var(--accent)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                fontFamily: 'var(--font-base)',
                fontSize: 'var(--text-sm)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}