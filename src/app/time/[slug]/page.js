'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/layout/header';
import MainClock from '@/components/clocks/main-clock';
import { getCityBySlug } from '@/lib/arabic-data';
import { storage, DEFAULT_SETTINGS } from '@/lib/storage';
import { notFound } from 'next/navigation';

export default function CityTimePage() {
  const params = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [cityData, setCityData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedSettings = storage.getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }

    if (params.slug) {
      if (params.slug === 'local') {
          // Special case for Local System Time
          const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setCityData({
              name: 'الوقت المحلي',
              timezone: systemTz,
              country: 'النظام', // Or "System" / "Your Location"
              isLocal: true
          });
      } else {
          const city = getCityBySlug(params.slug);
          if (city) {
            setCityData(city);
          } else {
            // If city not found, we might want to show 404 or redirect
            // For now, we can let it render null which looks like loading, or push to 404
          }
      }
    }
  }, [params.slug]);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  if (!mounted) return null;

  if (!cityData) {
     return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-xl">جاري البحث عن المدينة...</div>
        </div>
     );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      dir="rtl"
    >
      <Header settings={settings} onSettingsChange={handleSettingsChange} />

      <main className="pt-16 relative">
          <Link 
            href="/time"
            className="absolute top-4 right-4 md:top-8 md:right-8 z-10 bg-surface/30 backdrop-blur-md border border-border/50 text-foreground px-4 py-2 rounded-full hover:bg-surface/50 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للقائمة</span>
          </Link>

        <MainClock 
            timezone={cityData.timezone} 
            settings={settings}
            cityOverride={cityData}
        />
      </main>
    </div>
  );
}
