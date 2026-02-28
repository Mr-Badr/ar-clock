'use client';

import React, { useMemo, useState } from 'react';
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
import { DEFAULT_SETTINGS } from '@/lib/storage';

// ensure hijri month names
moment.updateLocale('ar', {
  iMonths: [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ],
});

// Tabs definition (key -> label)
const TABS = [
  { key: 'religious', label: 'المناسبات الدينية', icon: Calendar },
  { key: 'seasonal', label: 'المواسم العامة', icon: Sun },
  { key: 'countries', label: 'حسب الدولة', icon: Globe },
  { key: 'educational', label: 'تعليمية', icon: Clock },
  { key: 'astronomical', label: 'فلكية', icon: Sparkles },
  { key: 'all', label: 'الكل', icon: Calendar },
];

const TIME_FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'week', label: 'هذا الأسبوع' },
  { key: 'month', label: 'هذا الشهر' },
  { key: 'upcoming', label: 'القادمة' },
];

function formatGregorian(date) {
  try {
    // use Intl.DateTimeFormat with arabic locale for localized month names & digits
    return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(date));
  } catch (e) {
    return moment(date).locale('ar').format('D MMMM YYYY');
  }
}

function formatHijri(date) {
  return moment(date).locale('ar').format('iD iMMMM iYYYY');
}

function getEventComputed(event) {
  const target = getNextEventDate(event);
  const remaining = getTimeRemaining(target);
  const daysLeft = remaining.days;

  const formattedDate = event.type === 'hijri' ? formatHijri(target) : formatGregorian(target);

  return { event, target, daysLeft, formattedDate };
}

// Small reusable EventCard (keeps your original look but adapted for tabbed UI)
function EventCard({ e, small = false, highlight = false }) {
  if (!e) return null;
  const { event, daysLeft, formattedDate } = getEventComputed(e);

  if (small) {
    return (
      <Link
        href={`/holidays/${event.slug}`}
        title={event.title}
        className="flex items-center justify-between p-4 bg-surface/20 hover:bg-surface/40 border border-border/40 hover:border-primary/50 group rounded-xl transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/5 flex flex-col items-center justify-center text-primary text-[10px] font-bold border border-primary/10 group-hover:bg-primary/10 transition-colors">
            <span>{daysLeft}</span>
            <span>يوم</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">{event.name}</span>
            <span className="text-[10px] text-foreground-muted">{formattedDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton event={event} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded-lg transition-all text-primary w-6 h-6" />
          <ChevronLeft className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/holidays/${event.slug}`}
      className={`group relative h-40 bg-surface/40 border border-border/60 rounded-2xl p-6 hover:border-primary/60 transition-all duration-500 backdrop-blur-sm overflow-hidden flex flex-col justify-between ${
        highlight ? 'ring-1 ring-primary/20' : ''
      }`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-500">
          {event.type === 'hijri' ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <ShareButton event={event} className="p-2 hover:bg-primary/10 rounded-xl transition-all text-foreground-muted hover:text-primary w-8 h-8" />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{event.name}</h3>
        <div className="flex items-center gap-3">
          <div className="text-xs font-medium px-2.5 py-1 bg-secondary/50 rounded-lg text-foreground-muted border border-border/50">{formattedDate}</div>
          {daysLeft !== null && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <TrendingUp className="w-3 h-3" />
              <span>متبقي {daysLeft} يوم</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HolidaysPage() {
  // UI state
  const [activeTab, setActiveTab] = useState('religious');
  const [timeFilter, setTimeFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('all');

  // prepare source datasets
  const religious = RELIGIOUS_HOLIDAYS.map(en => en);
  const seasonal = SEASONAL_EVENTS.map(en => en);
  const countries = COUNTRIES_EVENTS.map(c => ({ ...c }));

  // helper to flatten country events
  const flattenedCountryEvents = useMemo(() => {
    return COUNTRIES_EVENTS.flatMap((c) => c.events.map(e => ({ ...e, _country: { name: c.name, code: c.code } })));
  }, []);

  // choose current list based on tab
  const currentList = useMemo(() => {
    switch (activeTab) {
      case 'religious':
        return religious;
      case 'seasonal':
        return seasonal;
      case 'countries':
        // show flattened but keep country meta
        return flattenedCountryEvents;
      case 'educational':
        // derive educational from seasonal (e.g., exams, results, back-to-school)
        return SEASONAL_EVENTS.filter(e => ['back-to-school','exams','results','spring-vacation','summer-vacation'].includes(e.id));
      case 'astronomical':
        // religious hijri dates are astronomical by nature but surface a curated subset
        return RELIGIOUS_HOLIDAYS.filter(e => ['islamic-new-year','mawlid','hajj-start','day-of-arafa'].includes(e.id));
      case 'all':
      default:
        return [
          ...RELIGIOUS_HOLIDAYS,
          ...SEASONAL_EVENTS,
          ...flattenedCountryEvents,
        ];
    }
  }, [activeTab, flattenedCountryEvents]);

  // Apply search + time filter + country filter (simple & performant)
  const filtered = useMemo(() => {
    const now = new Date();

    const matchesQuery = (ev) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return (ev.name || ev.title || '').toLowerCase().includes(q) || (ev.slug || '').toLowerCase().includes(q);
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

  // grouped countries view for countries tab
  const countriesMap = useMemo(() => {
    if (activeTab !== 'countries') return null;
    return COUNTRIES_EVENTS.map(country => ({ ...country, events: country.events }));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30" dir="rtl">
      <Header settings={DEFAULT_SETTINGS} />

      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4">عداد المواعيد <span className="text-primary italic">الذكية</span></h1>
          <p className="text-foreground-muted">منصة متكاملة لتتبع أهم المواعيد الإسلامية، الوطنية، والأكاديمية في الوطن العربي — تصفح بسهولة عبر الأقسام والمرشحات.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Tabs (better visual hierarchy) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {TABS.map((t) => {
              const ActiveIcon = t.icon;
              const isActive = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-base ${
                    isActive 
                      ? 'bg-primary/20 text-primary border border-primary'
                      : 'bg-surface/10 text-foreground hover:bg-surface/20'
                  }`}
                >
                  <ActiveIcon className="w-6 h-6" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
  {/* Time Filter Dropdown */}
  <select
    value={timeFilter}
    onChange={(e) => setTimeFilter(e.target.value)}
    className="text-sm rounded-lg px-4 py-2 bg-surface/10 border border-border focus:ring-primary"
  >
    <option value="upcoming">القريبة (0–7 أيام)</option>
    <option value="month">هذا الشهر</option>
    <option value="quarter">خلال 3 أشهر</option>
    <option value="all">عرض الكل</option>
  </select>

  {/* Country Filter (only for countries tab) */}
  {activeTab === 'countries' && (
    <select
      value={selectedCountryCode}
      onChange={(e) => setSelectedCountryCode(e.target.value)}
      className="text-sm rounded-lg px-4 py-2 bg-surface/10 border border-border focus:ring-primary"
    >
      <option value="all">كل الدول</option>
      {COUNTRIES_EVENTS.map(c => (
        <option key={c.code} value={c.code}>{c.name}</option>
      ))}
    </select>
  )}
</div>

            <div className="flex items-center gap-2 bg-surface/10 rounded-xl px-3 py-1 border border-border">
              <Search className="w-4 h-4 text-foreground-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن مناسبة أو دولة..."
                className="bg-transparent outline-none text-sm placeholder:text-foreground-muted"
              />
            </div>

            {activeTab === 'countries' && (
              <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)} className="text-sm rounded-lg px-3 py-1 bg-surface/10 border border-border">
                <option value="all">كل الدول</option>
                {COUNTRIES_EVENTS.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content area */}
        {activeTab === 'countries' ? (
          // countries view keeps country cards (compact) each with small event list
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {countriesMap.map(country => (
              <div key={country.code} className="bg-surface/10 border border-border/40 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="text-2xl font-bold">{country.name}</h3>
                    <p className="text-sm text-foreground-muted">مناسبات وفعاليات {country.name}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {country.events
                    .map(ev => ({ ...ev, _country: { name: country.name, code: country.code } }))
                    .filter(ev => {
                      if (selectedCountryCode !== 'all' && ev._country.code !== selectedCountryCode) return false;
                      if (query && !(ev.name || '').toLowerCase().includes(query.toLowerCase())) return false;
                      // time filter
                      if (timeFilter !== 'all') {
                        const { daysLeft } = getEventComputed(ev);
                        if (timeFilter === 'week' && daysLeft > 7) return false;
                        if (timeFilter === 'month' && daysLeft > 31) return false;
                        if (timeFilter === 'upcoming' && daysLeft <= 0) return false;
                      }
                      return true;
                    })
                    .map(ev => <EventCard key={ev.id} e={ev} small />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // regular grid for other tabs
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(ev => (
              <EventCard key={ev.id || ev.slug} e={ev} />
            ))}
          </div>
        )}

        {/* Helpful footer / SEO hint area */}
        <div className="mt-16 p-8 bg-surface/20 border border-border/50 rounded-2xl text-center">
          <p className="text-foreground-muted">يمكنك فرز الأحداث حسب الوقت أو البحث عن مناسبة معينة — هذه الصفحة مصممة لتكون قابلة للفهرسة وتحسين محركات البحث (SEO).</p>
        </div>
      </main>
    </div>
  );
}
