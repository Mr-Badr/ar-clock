import Link from 'next/link';
import MainClock from '@/components/clocks/main-clock';
import Header from '@/components/layout/header';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { Globe } from 'lucide-react';

export default function HomePage() {
  // Server-side default
  const defaultTimezone = "Asia/Riyadh"; 

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header settings={DEFAULT_SETTINGS} />

      <main className="pt-16 min-h-screen flex flex-col justify-center pb-20">
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="text-center mb-12">
            <MainClock 
              timezone={null} // Will be detected by client
              settings={DEFAULT_SETTINGS} 
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link 
              href="/time" 
              className="flex items-center gap-3 bg-surface hover:bg-surface-elevated border border-border px-8 py-4 rounded-2xl transition-all hover:scale-105 group font-bold text-lg"
            >
              <Globe className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
              <span>ساعات العالم</span>
            </Link>

            <Link 
              href="/holidays" 
              className="flex items-center gap-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-8 py-4 rounded-2xl transition-all hover:scale-105 group font-bold text-lg text-primary"
            >
              <span className="text-xl group-hover:scale-125 transition-transform">🌙</span>
              <span>المناسبات والاعياد</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
