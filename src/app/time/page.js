'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minimize2, Monitor } from 'lucide-react';
import Header from '@/components/layout/header';
import WorldClock from '@/components/clocks/world-clock';
import MainClock from '@/components/clocks/main-clock';
import AddTimezoneModal from '@/components/modals/add-timezone-modal';
import { Button } from '@/components/ui/button';
import { storage, DEFAULT_SETTINGS } from '@/lib/storage';
import { TimeEngine } from '@/lib/time-engine';
import { getDefaultCities, generateSlug } from '@/lib/arabic-data';

export default function TimePage() {
  const router = useRouter();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [cities, setCities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referenceTime, setReferenceTime] = useState(null);
  const [userTimezone, setUserTimezone] = useState(null);

  useEffect(() => {
    // Load data immediately on client
    const savedSettings = storage.getSettings();
    if (savedSettings) setSettings(savedSettings);

    const savedCities = storage.getSelectedCities();
    if (savedCities && savedCities.length > 0) {
      setCities(savedCities);
    } else {
      const defaultCities = getDefaultCities();
      setCities(defaultCities);
      storage.saveSelectedCities(defaultCities);
    }

    const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(systemTz);
    setReferenceTime(TimeEngine.getCurrentTimeInZone(systemTz));

    const interval = setInterval(() => {
      setReferenceTime(TimeEngine.getCurrentTimeInZone(systemTz));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleAddCity = (city) => {
    const exists = cities.some(c => c.timezone === city.timezone);
    if (!exists) {
      const newCities = [...cities, city];
      setCities(newCities);
      storage.saveSelectedCities(newCities);
    }
  };

  const handleRemoveCity = (cityToRemove) => {
    const newCities = cities.filter(c => c.timezone !== cityToRemove.timezone);
    setCities(newCities);
    storage.saveSelectedCities(newCities);
  };

  const handleSetMain = (city) => {
    storage.saveUserTimezone(city.timezone);
    router.push('/');
  };

  const [isLocalFullscreen, setIsLocalFullscreen] = useState(false);

  const handleLocalFullscreenToggle = () => {
    setIsLocalFullscreen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <Header settings={settings} onSettingsChange={handleSettingsChange} />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        
        {/* Local Time Fullscreen Overlay */}
        {isLocalFullscreen && (
          <div className="fixed inset-0 bg-background text-foreground flex flex-col items-center justify-center z-[100]" dir="rtl">
            <button
              onClick={handleLocalFullscreenToggle}
              className="absolute top-8 right-8 p-3 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
              title="تصغير"
            >
              <Minimize2 className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h1 className="text-sm md:text-lg mb-8 text-foreground-muted tracking-wider">التوقيت المحلي</h1>
              <MainClock 
                timezone={userTimezone} 
                settings={{ ...settings, showDate: true }} 
                compact={false} 
              />
            </div>
          </div>
        )}
        
        {/* Time Now Section */}
        <div className="mb-8 text-center w-full">
           <div className="inline-block transform scale-75 origin-top relative">
             <div className="absolute top-2 right-2 z-10">
               <button
                 onClick={handleLocalFullscreenToggle}
                 className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground-muted hover:text-foreground"
                 title={isLocalFullscreen ? "تصغير" : "ملء الشاشة"}
               >
                 {isLocalFullscreen ? <Minimize2 className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
               </button>
             </div>
             <MainClock 
                timezone={userTimezone} 
                settings={{ ...settings, showDate: true }} 
                compact={false} 
             />
             <div className="text-foreground-muted uppercase tracking-widest text-sm mt-4 font-medium flex items-center justify-center gap-2">
                وقتك المحلي
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">الأوقات العالمية</h1>
            <p className="text-foreground-muted">تابع الوقت في مختلف المدن حول العالم</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-success hover:bg-success/90 text-success-foreground gap-2">
            <Plus className="w-5 h-5" />
            <span>إضافة منطقة زمنية</span>
          </Button>
        </div>

        {!referenceTime ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 rounded-xl bg-surface animate-pulse border border-border"></div>
                ))}
             </div>
        ) : cities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-foreground-muted mb-4">لم تقم بإضافة أي منطقة زمنية بعد</p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-success hover:bg-success/90 text-success-foreground">إضافة منطقة زمنية</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, index) => (
              <WorldClock
                key={`${city.timezone}-${index}`}
                city={city}
                settings={settings}
                referenceTime={referenceTime}
                onRemove={handleRemoveCity}
                onSetMain={handleSetMain}
              />
            ))}
          </div>
        )}

        <AddTimezoneModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddCity} />
      </main>
    </div>
  );
}
