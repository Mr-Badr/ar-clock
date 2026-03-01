'use client';

import { useState, useEffect } from 'react';
import { getTimeRemaining } from '@/lib/holidays-engine';
import FullscreenClock from '@/components/clocks/fullscreen-clock';
import { Share2, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CLOCK_COLOR = '#3B82F6';
const WIDGET_SIZES = [
  { label: '475*250 (عرض متوسط)', width: '475', height: '250' },
  { label: '200*200 (مربع صغير)', width: '200', height: '200' },
  { label: '200*90 (شريط صغير)', width: '200', height: '90' },
  { label: '600*300 (مستطيل كبير)', width: '600', height: '300' },
  { label: '300*250 (صغير متوازن)', width: '300', height: '250' },
];


export default function CountdownTicker({ holiday, targetDate, initialTimeRemaining, isEmbedInitial }) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isEmbedMode, setIsEmbedMode] = useState(isEmbedInitial);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedSize, setEmbedSize] = useState(WIDGET_SIZES[0]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === 'true') setIsEmbedMode(true);
  }, []);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate);
    const timer = setInterval(() => setTimeRemaining(getTimeRemaining(target)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const formattedDate = new Date(targetDate).toLocaleDateString('ar-SA-u-nu-latn', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`,
    twitter: `https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&text=${encodeURIComponent(holiday.title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${holiday.title} - ${typeof window !== 'undefined' ? window.location.href : ''}`)}`,
    blogger: `https://www.blogger.com/blog-this.g?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&n=${encodeURIComponent(holiday.title)}`,
    reddit: `https://reddit.com/submit?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&title=${encodeURIComponent(holiday.title)}`,
    tumblr: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&autoTrigger=true`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&description=${encodeURIComponent(holiday.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`,
  };

  const embedUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?embed=true` : '';
  const embedCode = `<iframe src="${embedUrl}" width="${embedSize.width}" height="${embedSize.height}" frameborder="0" scrolling="no" style="border:none; overflow:hidden;"></iframe>`;

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    import('sonner').then(({ toast }) => toast.success(message));
  };

  const CountdownUnits = ({ sizeClass, labelClass }) => (
    <>
      {[
        { value: timeRemaining.days, label: 'يوم' },
        { value: timeRemaining.hours, label: 'ساعة' },
        { value: timeRemaining.minutes, label: 'دقيقة' },
        { value: timeRemaining.seconds, label: 'ثانية' },
      ].map(({ value, label }) => (
        <div key={label} className={`flex flex-col items-center ${isEmbedMode ? 'min-w-[40px] md:min-w-[100px]' : 'min-w-[70px]'}`}>
          <span className={`${sizeClass} font-bold font-mono whitespace-nowrap leading-none transition-all`} style={{ color: CLOCK_COLOR }}>
            {value}
          </span>
          <span className={`${labelClass} text-foreground-muted uppercase tracking-tighter md:tracking-widest mt-0.5`}>
            {label}
          </span>
        </div>
      ))}
    </>
  );

  return (
    <div className={`${isEmbedMode ? 'h-full w-full overflow-hidden' : ''}`}>
      <div className={`${isEmbedMode ? 'h-full w-full overflow-hidden flex items-center justify-center' : 'relative mb-16'}`}>
        {!isEmbedMode && (
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">{holiday.title}</h1>
            <div className="h-1 w-24 bg-primary/30 mx-auto rounded-full" />
          </div>
        )}

        <FullscreenClock
          showExpandButton={!isEmbedMode}
          overlayContent={
            <div className="text-center" dir="rtl">
              <h2 className="text-2xl md:text-5xl font-bold mb-12 text-primary">{holiday.name}</h2>
              {timeRemaining && (
                <div className="flex flex-wrap justify-center gap-6 md:gap-16 mb-12">
                  <CountdownUnits sizeClass="text-6xl md:text-9xl" labelClass="text-lg md:text-2xl mt-2" />
                </div>
              )}
              <div className="mt-8 text-xl md:text-3xl text-foreground-muted font-medium bg-secondary/20 inline-block px-8 py-3 rounded-full border border-border/40">
                {formattedDate}
              </div>
            </div>
          }
        >
          <div className={`flex flex-col items-center justify-center bg-background border-border text-center relative overflow-hidden transition-all duration-500
            ${isEmbedMode ? 'w-full h-full p-2 border-0 shadow-none' : 'p-8 md:p-16 border rounded-3xl min-h-[400px] shadow-xl'}`}>

            {!isEmbedMode && <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />}
            {!isEmbedMode && <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />}

            {isEmbedMode && (
              <h2 className="text-lg md:text-3xl font-bold text-primary truncate max-w-[95vw] mb-1 md:mb-2">
                {holiday.title}
              </h2>
            )}

            <div className={`flex flex-wrap justify-center items-center ${isEmbedMode ? 'gap-2 md:gap-6' : 'gap-6 md:gap-16'} relative z-10 w-full flex-1 min-h-0`}>
              <CountdownUnits
                sizeClass={isEmbedMode ? 'text-4xl md:text-8xl' : 'text-5xl md:text-8xl'}
                labelClass={isEmbedMode ? 'text-[10px] md:text-base' : 'text-xs md:text-lg'}
              />
            </div>

            <div className={`${isEmbedMode ? 'mt-1 md:mt-4 text-[10px] md:text-sm px-3 py-0.5' : 'mt-8 text-lg md:text-xl px-4 py-1.5'} text-foreground-muted font-medium bg-secondary/20 inline-block rounded-full border border-border/40 shrink-0`}>
              {formattedDate}
            </div>
          </div>
        </FullscreenClock>
      </div>

      {!isEmbedMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="lg:col-span-2 bg-surface/30 border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" />
              حول {holiday.name}
            </h2>
            <p className="text-foreground-muted text-lg leading-relaxed mb-8">
              {holiday.details || holiday.description} وهو من المواعيد المنتظرة التي يحتفل بها ملايين الأشخاص حول العالم، ويتميز بطقوس خاصة وتقاليد عريقة تعكس عمق الثقافة العربية والإسلامية.
            </p>

            <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">لماذا نهتم بـ {holiday.name}؟</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  تعتبر {holiday.name} من أهم المحطات الروحية في حياة المسلم، حيث تساهم في تعزيز التواصل الاجتماعي والشعور بالانتماء، بالإضافة إلى ما تحمله من دروس في الصبر والشكر والعطاء.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">كيف نستعد لها؟</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  الاستعداد النفسي والبدني من خلال الدعاء والتخطيط لاستغلال هذه الأوقات المباركة، مما يجعل تجربة الاحتفال بـ {holiday.name} ذكرى لا تنسى تملؤها السكينة والبهجة.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <span className="text-sm text-foreground-muted block mb-1">الموعد المحدد:</span>
                <span className="text-lg font-bold">
                  {holiday.type === 'hijri' || !holiday.type ? (
                    `${holiday.hijriDay || holiday.day} ${holiday.name.includes('رمضان') ? 'رمضان' : holiday.name.includes('عيد الفطر') ? 'شوال' : 'في التقويم الهجري'}`
                  ) : (
                    `${holiday.day} / ${holiday.month} (ميلادي)`
                  )}
                </span>
              </div>
              <div className="p-4 bg-secondary/50 rounded-xl border border-border">
                <span className="text-sm text-foreground-muted block mb-1">دقة الحساب:</span>
                <span className="text-sm italic">تعتمد هذه البيانات على تقويم أم القرى. قد يختلف التاريخ الفعلي لرؤية الهلال بفرق يوم واحد.</span>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="space-y-6">
            <div className="bg-surface/30 border border-border rounded-2xl p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">شارك الموعد</h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#3b5998] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.597 1.325-1.325V1.325C24 .597 23.403 0 22.675 0z" /></svg>
                  </a>
                  <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#1da1f2] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                  </a>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#25d366] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.559.923 3.447 1.411 5.366 1.411 5.454 0 9.893-4.44 9.896-9.894.001-2.645-1.03-5.131-2.903-7.004-1.873-1.873-4.359-2.903-7.004-2.904-5.454 0-9.894 4.439-9.896 9.894-.001 2.015.525 3.987 1.523 5.74l-.999 3.649 3.753-.984zm11.336-3.8c-.22-.11-1.3-.641-1.501-.714-.202-.073-.349-.11-.497.11s-.57.714-.698.861-.257.164-.477.054c-.22-.11-.928-.342-1.767-1.091-.652-.581-1.092-1.299-1.22-1.519-.128-.22-.014-.339.096-.449.099-.1.22-.257.33-.385.11-.128.147-.22.22-.367.073-.147.037-.275-.018-.385s-.497-1.197-.681-1.642c-.179-.434-.359-.374-.497-.381l-.423-.01c-.147 0-.386.055-.588.275-.202.22-.772.754-.772 1.838s.79 2.128.9 2.275c.11.147 1.553 2.373 3.763 3.328.526.227.936.362 1.255.464.53.167 1.011.143 1.392.086.425-.064 1.3-.531 1.484-1.044.184-.513.184-.954.128-1.044-.055-.091-.202-.147-.422-.257z" /></svg>
                  </a>
                  <a href={shareLinks.blogger} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#ff5722] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M16.131 11.25V9.004c0-1.24-.949-2.253-2.119-2.253h-4.237c-1.169 0-2.119 1.013-2.119 2.253v5.99c0 1.24.95 2.254 2.119 2.254h4.237c1.17 0 2.119-1.014 2.119-2.254v-1.5c.677-.042 1.131-.498 1.131-1.125s-.351-1.082-1.131-1.125zm-6.356-1.5h1.412c.39 0 .707.337.707.75s-.317.75-.707.75h-1.412c-.39 0-.706-.337-.706-.75s.316-.75.706-.75zm3.53 5.992c0 .412-.317.75-.707.75h-2.118c-.39 0-.706-.338-.706-.75s.316-.75.706-.75h2.118c.39 0 .707.337.707.75zM19.414 2H4.586C3.158 2 2 3.158 2 4.586v14.828C2 20.842 3.158 22 4.586 22h14.828C20.842 22 22 20.842 22 19.414V4.586C22 3.158 20.842 2 19.414 2z" /></svg>
                  </a>
                  <a href={shareLinks.reddit} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#cee3f8] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-[#ff4500]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 11.5c0-1.654-1.346-3-3-3-.674 0-1.29.232-1.787.601-2.129-1.503-4.999-2.454-8.141-2.585l1.737-5.466 4.793 1.018c.119.866.862 1.532 1.761 1.532 1.013 0 1.837-.824 1.837-1.837s-.824-1.838-1.837-1.838c-.767 0-1.424.472-1.701 1.139l-5.405-1.148c-.201-.044-.407.067-.481.258l-2.019 6.357c-3.238.071-6.208.995-8.397 2.531-.502-.387-1.134-.645-1.825-.645-1.654 0-3 1.346-3 3 0 1.205.719 2.235 1.751 2.696-.032.222-.051.446-.051.672 0 3.821 5.006 6.928 11.168 6.928s11.168-3.107 11.168-6.928c0-.188-.013-.374-.038-.558 1.137-.417 1.96-1.506 1.96-2.791zm-18.784 1.62c0-.982.799-1.781 1.781-1.781s1.781.799 1.781 1.781-.799 1.781-1.781 1.781-1.781-.799-1.781-1.781zm11.332 5.097c-1.258.944-3.518 1.026-4.548 1.026s-3.29-.082-4.548-1.026c-.198-.148-.239-.429-.09-.627.149-.199.43-.24.628-.09 1.015.762 2.92.85 4.01.85s2.995-.088 4.01-.85c.198-.15.479-.109.628.09.149.198.108.479-.09.627zm-.232-3.316c-.982 0-1.781-.799-1.781-1.781s.799-1.781 1.781-1.781 1.781.799 1.781 1.781-.799 1.781-1.781 1.781z" /></svg>
                  </a>
                  <a href={shareLinks.tumblr} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#35465c] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.511-4.596 4.71-6.648h3.111v6.236h3.948v3.511h-3.948v7.359c0 1.251.657 2.457 2.41 2.457 1.006 0 1.847-.411 2.37-1.121v3.316c-.739.585-1.956.843-3.154.843z" /></svg>
                  </a>
                  <a href={shareLinks.pinterest} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#bd081c] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.718-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.259 7.929-7.259 4.162 0 7.398 2.965 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.621 0 11.988-5.365 11.988-11.987C24 5.368 18.633 0 12.017 0z" /></svg>
                  </a>
                  <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#0077b5] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                  </a>

                  <button
                    onClick={() => copyToClipboard(window.location.href, 'تم نسخ الرابط!')}
                    className="w-10 h-10 bg-[#517fa4] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>

                  <button
                    onClick={() => setShowEmbed(true)}
                    className="bg-[#0084ff] text-white px-4 h-10 rounded-sm font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    Embed
                  </button>
                </div>

                {typeof navigator !== 'undefined' && navigator.share && (
                  <button
                    onClick={() => navigator.share({ title: holiday.title, text: `كم باقي على ${holiday.name}؟ تفقد العداد التنازلي هنا:`, url: window.location.href }).catch(() => {})}
                    className="w-full bg-primary/20 text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary/30 transition-colors"
                  >
                    مشاركة عبر التطبيقات الأخرى
                  </button>
                )}
              </div>
            </div>

            {/* Embed Modal */}
            {showEmbed && (
              <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-surface border border-border rounded-2xl p-6 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <h3 className="text-xl font-bold mb-4">تخصيص وتضمين العداد</h3>

                  <div className="flex flex-col gap-6 overflow-y-auto">
                    <div>
                      <span className="text-xs font-bold mb-2 block text-foreground-muted">اختر مقاس التضمين:</span>
                      <select
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors appearance-none cursor-pointer font-bold"
                        onChange={(e) => {
                          const size = WIDGET_SIZES.find(s => s.label === e.target.value);
                          if (size) setEmbedSize(size);
                        }}
                        value={embedSize.label}
                      >
                        {WIDGET_SIZES.map((size) => (
                          <option key={size.label} value={size.label}>{size.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 flex flex-col min-h-[350px]">
                      <span className="text-xs font-bold mb-2 block text-foreground-muted">معاينة مباشرة:</span>
                      <div className="flex-1 bg-black/40 rounded-2xl border border-border flex items-center justify-center p-4 md:p-8 overflow-auto relative">
                        <div
                          className="bg-background shadow-2xl rounded-xl overflow-hidden transition-all duration-300 relative border border-white/5 flex flex-col"
                          style={{ width: `${embedSize.width}px`, height: `${embedSize.height}px`, maxWidth: '100%', maxHeight: '100%' }}
                        >
                          <div className="h-6 bg-secondary/20 border-b border-border/50 flex items-center px-2 gap-1.5 select-none shrink-0">
                            <div className="w-2 h-2 rounded-full bg-red-500/40" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                            <div className="w-2 h-2 rounded-full bg-green-500/40" />
                          </div>
                          <div className="flex-1 overflow-hidden relative">
                            <iframe
                              key={`${embedSize.width}-${embedSize.height}`}
                              src={embedUrl}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              className="absolute inset-0 w-full h-full"
                              style={{ border: 'none', background: 'transparent' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold mb-2 block text-foreground-muted">كود التضمين النهائي:</span>
                      <div className="bg-black/60 p-4 rounded-xl font-mono text-[10px] break-all border border-border relative group">
                        <code className="text-primary-light whitespace-pre-wrap">{embedCode}</code>
                        <button
                          onClick={() => copyToClipboard(embedCode, 'تم نسخ كود التضمين!')}
                          className="absolute top-2 left-2 p-2 bg-primary/20 hover:bg-primary/40 rounded-lg text-primary transition-all opacity-0 group-hover:opacity-100 shadow-lg backdrop-blur-md"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => copyToClipboard(embedCode, 'تم نسخ كود التضمين!')}
                      className="flex-[2] bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                      نسخ الكود
                    </button>
                    <button
                      onClick={() => setShowEmbed(false)}
                      className="flex-1 bg-surface border border-border py-3 rounded-xl font-bold hover:bg-secondary/50 transition-all active:scale-[0.98]"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Link href="/holidays" className="block bg-surface/30 border border-border hover:border-primary rounded-2xl p-6 transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold mb-1">كل المناسبات</h3>
                  <p className="text-sm text-foreground-muted">عرض قائمة المناسبات القادمة</p>
                </div>
                <ArrowRight className="w-6 h-6 transform rotate-180 group-hover:-translate-x-2 transition-transform text-primary" />
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}