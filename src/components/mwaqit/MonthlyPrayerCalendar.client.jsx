'use client';

import { useState, useEffect, useMemo } from 'react';
import { calculatePrayerTimes } from '@/lib/prayerEngine';
import { CalendarDays, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const PRAYER_AR = {
  fajr: 'الفجر',
  sunrise: 'الشروق',
  dhuhr: 'الظهر',
  asr: 'العصر',
  maghrib: 'المغرب',
  isha: 'العشاء',
};

// Generates an array of Date objects for every day in the current month
function getDaysInCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
}

export default function MonthlyPrayerCalendar({ lat, lon, timezone, cityNameAr }) {
  const [mounted, setMounted] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

  useEffect(() => {
    setMounted(true);
    setCurrentDay(new Date().getDate());
  }, []);

  const monthLabel = useMemo(() => {
    if (!mounted) return '';
    // Use ar-EG-u-nu-latn to enforce English numerals for the year (e.g., 2026 instead of ٢٠٢٦)
    return new Date().toLocaleDateString('ar-EG-u-nu-latn', { month: 'long', year: 'numeric' });
  }, [mounted]);

  const schedule = useMemo(() => {
    if (!mounted || !lat || !lon) return [];

    return getDaysInCurrentMonth().map((date) => {
      // Create a fresh time calculation for noon on each day to avoid boundary issues
      const midDay = new Date(date);
      midDay.setHours(12, 0, 0, 0);

      const times = calculatePrayerTimes({
        lat,
        lon,
        timezone,
        date: midDay,
        // Disable cache here to ensure fast bulk generation without filling memory
        cacheKey: null,
      });

      if (!times) return null;

      // Format times locally using English numerals 'en'
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      });

      const formatTime = (isoString) => {
        if (!isoString) return '--:--';
        try {
          // Removes leading zero for hour if present, keeping output clean (e.g., 5:30 instead of 05:30)
          return formatter.format(new Date(isoString));
        } catch {
          return '--:--';
        }
      };

      return {
        dayNumber: date.getDate(), // Will render as integer directly
        dayName: date.toLocaleDateString('ar-EG', { weekday: 'long' }),
        isFriday: date.getDay() === 5, // 0 = Sunday, 5 = Friday
        fajr: formatTime(times.fajr),
        sunrise: formatTime(times.sunrise),
        dhuhr: formatTime(times.dhuhr),
        asr: formatTime(times.asr),
        maghrib: formatTime(times.maghrib),
        isha: formatTime(times.isha),
      };
    }).filter(Boolean);
  }, [mounted, lat, lon, timezone]);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted || !lat || !lon) {
    return (
      <div className="w-full h-96 bg-surface border border-border rounded-2xl animate-pulse" />
    );
  }

  return (
    <>
      {/* 
        This style block completely isolates the print view.
        It hides everything else on the page and stretches the calendar area to fill the paper.
      */}
      <style suppressHydrationWarning>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-calendar-area, #print-calendar-area * {
            visibility: visible;
          }
          #print-calendar-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            margin: 0 !important;
            padding: 2cm !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      <div id="print-calendar-area" className="card w-full overflow-hidden" dir="rtl">
        <div className="card__header flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6 mb-4 print:mb-8 print:border-black">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 print:text-black">
              <CalendarDays className="text-accent print:text-black" />
              إمساكية شهر {monthLabel}
            </h2>
            <p className="text-muted text-sm mt-1 print:text-black">
              مواقيت الصلاة الدقيقة لمدينة {cityNameAr}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="btn btn-outline flex items-center gap-2 print:hidden"
          >
            <Printer size={16} />
            طباعة الإمساكية
          </button>
        </div>

        <div className="w-full overflow-x-auto pb-4 custom-scrollbar print:overflow-visible">
          <Table className="min-w-[700px] text-center print:text-black">
            <TableHeader>
              <TableRow className="bg-surface print:bg-transparent print:border-b-2 print:border-black hover:bg-surface">
                <TableHead className="text-center font-bold text-primary print:text-black py-4">اليوم</TableHead>
                <TableHead className="text-center font-bold text-primary print:text-black py-4">التاريخ</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.fajr}</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.sunrise}</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.dhuhr}</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.asr}</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.maghrib}</TableHead>
                <TableHead className="text-center font-bold text-secondary print:text-black py-4">{PRAYER_AR.isha}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((row) => {
                const isToday = row.dayNumber === currentDay;

                // Construct the row background class mathematically based on requirements
                let rowBgClass = "";
                if (isToday) {
                  rowBgClass = "bg-[var(--accent-soft)] print:bg-transparent print:border-y-[3px] print:border-black font-extrabold";
                } else if (row.isFriday) {
                  rowBgClass = "bg-[var(--bg-surface-3)] print:bg-gray-100 font-semibold";
                }

                return (
                  <TableRow
                    key={row.dayNumber}
                    className={`transition-colors border-border print:border-gray-300 ${rowBgClass}`}
                  >
                    <TableCell className={`py-4 ${isToday ? 'text-accent print:text-black' : 'text-primary print:text-black'}`}>
                      {row.dayName}
                    </TableCell>
                    {/* Render dayNumber as a strict number (English numeric implicitly) */}
                    <TableCell className={`py-4 font-mono font-medium ${isToday ? 'text-accent print:text-black' : 'text-secondary print:text-black'}`}>
                      {row.dayNumber}
                    </TableCell>

                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.fajr}</TableCell>
                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.sunrise}</TableCell>
                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.dhuhr}</TableCell>
                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.asr}</TableCell>
                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.maghrib}</TableCell>
                    <TableCell className="py-4 font-mono text-primary print:text-black">{row.isha}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 text-xs text-muted text-center hidden print:block print:text-black">
          تم الطباعة من موقع waqt.app — حسابات فلكية دقيقة بناءً على معايير رابطة العالم الإسلامي
        </div>
      </div>
    </>
  );
}
