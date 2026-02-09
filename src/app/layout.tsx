import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';

const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700'] });

export const metadata: Metadata = {
  title: 'ساعة عربية - الوقت الآن في جميع أنحاء العالم',
  description: 'تطبيق ساعة عالمية باللغة العربية لمتابعة الوقت في مختلف المدن والدول حول العالم',
  openGraph: {
    title: 'ساعة عربية',
    description: 'الوقت الآن في جميع أنحاء العالم',
  },
};

import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var settingsStr = localStorage.getItem('vclock_settings');
                  var theme = 'dark'; // Default
                  if (settingsStr) {
                    var settings = JSON.parse(settingsStr);
                    if (settings && settings.theme) theme = settings.theme;
                  }
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (theme === 'dark' || (!settingsStr && supportDarkMode)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to dark
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${cairo.className} bg-background text-foreground min-h-screen`} suppressHydrationWarning>
        {children}
        <Toaster dir="rtl" position="bottom-center" />
      </body>
    </html>
  );
}
