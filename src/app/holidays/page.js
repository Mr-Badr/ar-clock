import Link from 'next/link';
import { 
  Calendar, 
  ChevronLeft, 
  Globe, 
  Sun, 
  Clock, 
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Header from '@/components/layout/header';
import { 
  RELIGIOUS_HOLIDAYS, 
  SEASONAL_EVENTS, 
  COUNTRIES_EVENTS, 
  getNextEventDate 
} from '@/lib/holidays-engine';
import { DEFAULT_SETTINGS } from '@/lib/storage';
import ShareButton from '@/components/ui/share-button';

function getEventData(event) {
  const date = getNextEventDate(event);
  const formattedDate = date 
    ? date.toLocaleDateString('ar-SA', { month: 'long', day: 'numeric' })
    : '...';
    
  const daysLeft = date 
    ? Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return { formattedDate, daysLeft };
}

const EventCard = ({ event, small = false, highlight = false }) => {
  const { formattedDate, daysLeft } = getEventData(event);

  if (small) {
    return (
      <Link 
        href={`/holidays/${event.slug}`}
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
          <ShareButton 
            event={event}
            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded-lg transition-all text-primary w-6 h-6"
          />
          <ChevronLeft className="w-4 h-4 text-foreground-muted group-hover:text-primary transition-colors" />
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/holidays/${event.slug}`}
      className={`group relative h-40 bg-surface/40 border border-border/60 rounded-2xl p-6 hover:border-primary/60 transition-all duration-500 backdrop-blur-sm overflow-hidden flex flex-col justify-between ${highlight ? 'ring-1 ring-primary/20' : ''}`}
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-500">
          {event.type === 'hijri' ? <Sparkles className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <ShareButton 
          event={event}
          className="p-2 hover:bg-primary/10 rounded-xl transition-all text-foreground-muted hover:text-primary w-8 h-8"
        />
      </div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
          {event.name}
        </h3>
        <div className="flex items-center gap-3">
           <div className="text-xs font-medium px-2.5 py-1 bg-secondary/50 rounded-lg text-foreground-muted border border-border/50">
             {formattedDate}
           </div>
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
};

export default function HolidaysPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30" dir="rtl">
      <Header settings={DEFAULT_SETTINGS} />

      <main className="pt-28 pb-20 px-4 max-w-6xl mx-auto">
        <header className="mb-20 text-center relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent tracking-tight">
             عداد المواعيد <span className="text-primary italic">الذكية</span>
          </h1>
          <p className="text-foreground-muted text-xl max-w-2xl mx-auto leading-relaxed">
            منصة متكاملة لتتبع أهم المواعيد الإسلامية، الوطنية، والأكاديمية في الوطن العربي بتصميم عصري ودقة متناهية.
          </p>
        </header>

        {/* Section: Religious Holidays */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">المناسبات الدينية</h2>
            </div>
            <div className="hidden md:block h-px flex-1 bg-gradient-to-l from-primary/20 to-transparent mx-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RELIGIOUS_HOLIDAYS.map(event => <EventCard key={event.id} event={event} highlight />)}
          </div>
        </section>

        {/* Section: Seasonal & General */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner border border-blue-500/10">
                <Sun className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">المواسم العامة</h2>
            </div>
            <div className="hidden md:block h-px flex-1 bg-gradient-to-l from-blue-500/20 to-transparent mx-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SEASONAL_EVENTS.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        </section>

        {/* Section: Countries */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-14">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shadow-inner border border-green-500/10">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">حسب الدولة</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {COUNTRIES_EVENTS.map((country) => (
              <div key={country.code} className="group/country relative bg-surface/10 border border-border/40 rounded-[2rem] p-8 hover:bg-surface/20 transition-all duration-500 border-dashed hover:border-solid hover:border-primary/20">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-5xl drop-shadow-lg group-hover/country:scale-110 transition-transform duration-500">{country.flag}</span>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{country.name}</h3>
                    <p className="text-sm text-foreground-muted font-medium">مناسبات وفعاليات {country.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {country.events.map(event => (
                    <EventCard key={event.id} event={event} small />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 p-12 border border-border/60 bg-surface/20 rounded-[2.5rem] text-center backdrop-blur-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="flex justify-center gap-6 mb-8">
              <Clock className="text-primary w-8 h-8 animate-pulse" />
              <Sparkles className="text-primary w-8 h-8" />
            </div>
            <p className="text-lg text-foreground-muted leading-relaxed max-w-3xl mx-auto font-medium">
              تعتمد المواعيد على أدق الحسابات الفلكية والبيانات الرسمية وجداول التعليم. 
              <br />
              <span className="text-sm opacity-60 mt-4 block">* قد تختلف رؤية الهلال من دولة لأخرى بفرق يوم واحد.</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
