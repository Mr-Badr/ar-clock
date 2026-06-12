'use client';

import { useCallback, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import PrintThemeChooserModal from './PrintThemeChooserModal';
import styles from './MonthlyPrayerCalendar.module.css';

async function readPdfErrorMessage(response) {
  try {
    const payload = await response.json();
    if (typeof payload?.error === 'string' && payload.error.trim()) {
      return payload.error.trim();
    }
  } catch {
    return 'فشل إنشاء ملف PDF. يمكنك استخدام الجدول على الشاشة والمحاولة بعد قليل.';
  }

  return 'فشل إنشاء ملف PDF. يمكنك استخدام الجدول على الشاشة والمحاولة بعد قليل.';
}

export default function MonthlyPrayerCalendarDownload({
  schedule,
  cityNameAr,
  gregorianLabel,
  hijriLabel,
  countryCode,
}) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const pdfLoadingRef = useRef(false);
  const safeSchedule = Array.isArray(schedule) ? schedule : [];

  const handleThemeSelected = useCallback(async (theme) => {
    if (pdfLoadingRef.current || safeSchedule.length === 0) {
      return;
    }

    pdfLoadingRef.current = true;
    setPdfLoading(true);
    setPdfError('');

    try {
      const response = await fetch('/api/pdf-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule: safeSchedule,
          cityNameAr,
          gregorianLabel,
          hijriLabel,
          countryCode,
          theme,
        }),
      });

      if (!response.ok) {
        throw new Error(await readPdfErrorMessage(response));
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `taqwim-salat-${cityNameAr}-${gregorianLabel}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setPdfError(error?.message || 'حدث خطأ أثناء إنشاء الملف');
    } finally {
      setPdfLoading(false);
      pdfLoadingRef.current = false;
    }
  }, [safeSchedule, cityNameAr, gregorianLabel, hijriLabel, countryCode]);

  return (
    <>
      <button
        className={styles.downloadButton}
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={pdfLoading || safeSchedule.length === 0}
        aria-busy={pdfLoading}
        aria-label="تحميل تقويم مواقيت الصلاة كملف PDF"
      >
        {pdfLoading ? (
          <>
            <Loader2 size={13} className={styles.spin} aria-hidden="true" />
            جاري الإنشاء…
          </>
        ) : (
          <>
            <Download size={13} aria-hidden="true" />
            تحميل PDF
          </>
        )}
      </button>

      {pdfError ? (
        <p className={styles.error} role="alert" aria-live="assertive">
          {pdfError}
        </p>
      ) : null}

      <PrintThemeChooserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleThemeSelected}
        actionType="download"
      />
    </>
  );
}
