/* Holidays page */
'use client';

import React, { useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronLeft,
  Globe,
  Sun,
  Clock,
  Sparkles,
  TrendingUp,
  Search,
} from 'lucide-react';
import Header from '@/components/layout/header';
import ShareButton from '@/components/ui/share-button';
import moment from 'moment-hijri';
import 'moment/locale/ar';
import {
  RELIGIOUS_HOLIDAYS,
  SEASONAL_EVENTS,
  COUNTRIES_EVENTS,
  getNextEventDate,
  getTimeRemaining,
} from '@/lib/holidays-engine';

// ─── Component ──────────────────────────────────────────────────────────────

// ensure hijri month names
moment.updateLocale('ar', {
  iMonths: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
  ],
});

const TABS = [
  { key: 'religious', label: 'المناسبات الدينية', icon: Calendar },
  { key: 'seasonal', label: 'المواسم العامة', icon: Sun },
  { key: 'countries', label: 'حسب الدولة', icon: Globe },
  { key: 'educational', label: 'تعليمية', icon: Clock },
  { key: 'astronomical', label: 'فلكية', icon: Sparkles },
  { key: 'all', label: 'الكل', icon: Calendar },
];

function formatGregorian(date) {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
  } catch (e) {
    return moment(date).locale('ar').format('D MMMM YYYY');
  }
}

function formatHijri(date) {
  return moment(date).locale('en').iDate() + ' ' + moment(date).locale('ar').format('iMMMM') + ' ' + moment(date).locale('en').iYear();
}

function getEventComputed(event) {
  const target = getNextEventDate(event);
  const remaining = getTimeRemaining(target);
  const daysLeft = remaining.days;
  const formattedDate = event.type === 'hijri' ? formatHijri(target) : formatGregorian(target);
  return { event, target, daysLeft, formattedDate };
}

function EventCard({ e, small = false }) {
  if (!e) return null;
  const { event, daysLeft, formattedDate } = getEventComputed(e);

  if (small) {
    return (
      <Link href={`/holidays/${event.slug}`} className="card-small group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex flex-col items-center justify-center text-[10px] font-bold border border-border bg-surface-2 group-hover:bg-accent-soft group-hover:border-accent group-hover:text-accent transition-colors">
            <span>{daysLeft}</span>
            <span>يوم</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold group-hover:text-accent transition-colors">{event.name}</span>
            <span className="text-[10px] text-muted">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton event={event} className="p-1.5 opacity-0 group-hover:opacity-100 rounded-lg transition-all w-6 h-6 text-accent" />
          <ChevronLeft className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/holidays/${event.slug}`} className="card h-40 group">
      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 rounded-xl transition-transform duration-500 bg-accent-soft text-accent group-hover:scale-110">
          {event.type === 'hijri' ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <ShareButton event={event} className="p-2 rounded-xl w-8 h-8 text-muted hover:text-accent hover:bg-accent-soft transition-colors" />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2 transition-colors group-hover:text-accent">{event.name}</h3>
        <div className="flex items-center gap-3">
          <div className="text-xs font-medium px-2.5 py-1 rounded-lg border border-border bg-surface-2 text-muted transition-colors group-hover:border-accent-strong group-hover:text-primary">
            {formattedDate}
          </div>
          {daysLeft !== null && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
              <TrendingUp className="w-3 h-3" />
              <span>متبقي {daysLeft} يوم</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function HolidaysContent() {
  const [activeTab, setActiveTab] = useState('religious');
  const [timeFilter, setTimeFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('all');

  const religious = RELIGIOUS_HOLIDAYS;
  const seasonal = SEASONAL_EVENTS;
  const flattenedCountryEvents = useMemo(() => {
    return COUNTRIES_EVENTS.flatMap((c) => c.events.map(e => ({ ...e, _country: { name: c.name, code: c.code } })));
  }, []);

  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'religious': return religious;
      case 'seasonal': return seasonal;
      case 'countries': return flattenedCountryEvents;
      case 'educational': return SEASONAL_EVENTS.filter(e => ['back-to-school', 'exams', 'results', 'spring-vacation', 'summer-vacation'].includes(e.id));
      case 'astronomical': return RELIGIOUS_HOLIDAYS.filter(e => ['islamic-new-year', 'mawlid', 'hajj-start', 'day-of-arafa'].includes(e.id));
      case 'all':
      default: return [...RELIGIOUS_HOLIDAYS, ...SEASONAL_EVENTS, ...flattenedCountryEvents];
    }
  }, [activeTab, flattenedCountryEvents, religious, seasonal]);

  const filtered = useMemo(() => {
    const matchesQuery = (ev) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (ev.name || '').toLowerCase().includes(q);
    };
    const matchesCountry = (ev) => {
      if (selectedCountryCode === 'all') return true;
      return ev._country?.code === selectedCountryCode;
    };
    const matchesTime = (ev) => {
      if (timeFilter === 'all') return true;
      const { daysLeft } = getEventComputed(ev);
      if (timeFilter === 'week') return daysLeft <= 7;
      if (timeFilter === 'month') return daysLeft <= 31;
      if (timeFilter === 'upcoming') return daysLeft > 0;
      return true;
    };
    return currentList.filter(ev => matchesQuery(ev) && matchesCountry(ev) && matchesTime(ev));
  }, [currentList, query, timeFilter, selectedCountryCode]);

  const countriesMap = useMemo(() => {
    if (activeTab !== 'countries') return null;
    return COUNTRIES_EVENTS;
  }, [activeTab]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-8 w-full">
          {TABS.map((t) => {
            const ActiveIcon = t.icon;
            const isActive = t.key === activeTab;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 p-3 rounded-xl transition-all font-bold text-sm ${isActive
                  ? 'bg-accent-soft text-accent border border-accent'
                  : 'bg-surface-2 text-primary hover:bg-surface-3'
                  }`}
              >
                <ActiveIcon className="w-5 h-5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8">
        <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="text-sm rounded-lg px-4 py-2 bg-surface-2 border border-border">
          <option value="all">كل الأوقات</option>
          <option value="upcoming">القريبة</option>
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
        </select>

        {activeTab === 'countries' && (
          <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)} className="text-sm rounded-lg px-4 py-2 bg-surface-2 border border-border">
            <option value="all">كل الدول</option>
            {COUNTRIES_EVENTS.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        )}

        <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-surface-2 rounded-xl px-3 py-2 border border-border">
          <Search className="w-4 h-4 text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن مناسبة..." className="bg-transparent outline-none text-sm w-full" />
        </div>
      </div>

      {activeTab === 'countries' && countriesMap ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {countriesMap.map(country => (
            <div key={country.code} className="bg-surface-2 border border-border-subtle rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{country.flag}</span>
                <h3 className="text-2xl font-bold">{country.name}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {country.events
                  .map(ev => ({ ...ev, _country: { code: country.code } }))
                  .filter(ev => {
                    if (selectedCountryCode !== 'all' && ev._country.code !== selectedCountryCode) return false;
                    if (query && !(ev.name || '').toLowerCase().includes(query.toLowerCase())) return false;
                    return true;
                  })
                  .map(ev => <EventCard key={ev.id} e={ev} small />)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(ev => <EventCard key={ev.id || ev.slug} e={ev} />)}
        </div>
      )}
    </>
  );
}

export default function HolidaysPageWrapper() {
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <Header />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-right">
          <h1 className="text-4xl md:text-6xl font-black mb-4">عداد المواعيد <span className="text-accent italic">الذكية</span></h1>
          <p className="text-muted max-w-2xl">تتبع أهم المواعيد الإسلامية، الوطنية، والأكاديمية.</p>
        </div>

        <Suspense fallback={<div className="h-96 animate-pulse bg-surface-2 rounded-3xl" />}>
          <HolidaysContent />
        </Suspense>

        <div className="mt-16 p-8 bg-surface-3 border border-border rounded-2xl text-center text-sm text-muted">
          جميع المواعيد تُحسب بناءً على التقويمين الهجري والميلادي.
        </div>
      </main>
    </div>
  );
}
