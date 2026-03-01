import Link from 'next/link';
import MainClock from '@/components/clocks/main-clock';
import Header from '@/components/layout/header';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import { Globe } from 'lucide-react';

export default function HomePage() {
  // Server-side default
  const defaultTimezone = "Asia/Riyadh"; 

  return (
    <div className="min-h-screen text-foreground" dir="rtl">
      <Header settings={DEFAULT_SETTINGS} />

      <main className="pt-16 min-h-screen flex flex-col justify-center pb-20">
        <div className="max-w-4xl mx-auto w-full px-4">
          <div className="text-center mb-12">
            <MainClock 
              timezone={null} // Will be detected by client
              settings={DEFAULT_SETTINGS} 
            />
          </div>
        </div>
      </main>

      
    </div>
  );
}
