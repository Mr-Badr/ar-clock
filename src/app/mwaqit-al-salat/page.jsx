/**
 * app/mwaqit-al-salat/page.jsx
 *
 * Server component landing page for prayer times.
 * SearchCity is loaded client-only (ssr:false) to avoid hydration mismatches
 * caused by localStorage / window access inside the component.
 */

import { MapPin } from 'lucide-react';
import SearchCityWrapper from '@/components/SearchCityWrapper.client';
import { getCountriesAction } from '@/app/actions/location';

export const metadata = {
  title: 'مواقيت الصلاة — دقيقة في جميع أنحاء العالم',
  description: 'احصل على مواقيت الصلاة الدقيقة لأي مدينة في العالم. الفجر والظهر والعصر والمغرب والعشاء.',
};

export default async function PrayerLandingPage() {
  const allCountries = await getCountriesAction();

  return (
    <div className="min-h-screen bg-base py-12 px-6" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-12 text-center">

        {/* Header */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-accent-soft rounded-3xl flex items-center justify-center mx-auto border border-accent/20 shadow-lg">
            <MapPin className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">مواقيت الصلاة</h1>
          <p className="text-muted text-lg max-w-md mx-auto leading-relaxed">
            احصل على مواقيت الصلاة الدقيقة لمدينتك حسب التوقيت المحلي الرسمي.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-glass border border-border rounded-[2.5rem] p-4 md:p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="relative space-y-6">
            <div className="text-right px-2">
              <label className="text-sm font-bold text-secondary mb-2 block mr-1">ابحث عن مدينة أو دولة</label>
              <SearchCityWrapper mode="prayer" preloadedCountries={allCountries} />
            </div>
          </div>
        </div>

        <p className="text-muted text-xs max-w-sm mx-auto leading-relaxed opacity-60">
          يتم تحديث مواقيت الصلاة تلقائياً بناءً على الموقع الجغرافي وقواعد الحساب المحلية.
        </p>
      </div>
    </div>
  );
}