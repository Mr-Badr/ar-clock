"use client";

import { useMemo, useState } from 'react';
import { Camera, Info, VideoCamera } from '@phosphor-icons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fmt } from '@/lib/calculators/building/constants';

// Bitrate/formula sourced directly from vendor documentation — Reolink's CCTV storage formula,
// Hikvision's official H.264/H.265 recommended-bitrate PDF, Western Digital & Seagate
// surveillance calculators — see keyword-research/narrow-tools-2026-08-03/DECISION.md §1.1.
// Base rates below are "at 15fps" industry-common defaults; the bitrate field itself stays
// fully editable because real camera bitrates vary by brand/scene complexity (docs/PLAN.md §5.8).
const RESOLUTIONS = [
  { id: '2mp', label: '2 ميجابكسل (1080p)', baseBitrate: 4096 },
  { id: '4mp', label: '4 ميجابكسل', baseBitrate: 8192 },
  { id: '5mp', label: '5 ميجابكسل', baseBitrate: 10240 },
  { id: '8mp', label: '8 ميجابكسل (4K)', baseBitrate: 16384 },
];
const CODECS = [
  { id: 'h264', label: 'H.264', factor: 1 },
  { id: 'h265', label: 'H.265', factor: 0.5 },
  { id: 'h265plus', label: 'H.265+', factor: 0.4 },
];
const FPS_OPTIONS = [15, 25, 30];
const PROPERTY_GUIDE = [
  { label: 'شقة صغيرة', count: 3 },
  { label: 'شقة كبيرة', count: 4 },
  { label: 'فيلا دور واحد', count: 5 },
  { label: 'فيلا متعددة الأدوار', count: 7 },
];
const COMMERCIAL_HDD_SIZES = [1, 2, 4, 6, 8, 10, 12, 16];

function FieldHint({ text }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="tool-v2-field-hint-btn" aria-label="توضيح">
            <Info size={14} weight="bold" />
          </button>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function NvrStorageCalculator() {
  const [cameraCount, setCameraCount] = useState(4);
  const [showGuide, setShowGuide] = useState(false);
  const [resolutionId, setResolutionId] = useState('4mp');
  const [codecId, setCodecId] = useState('h265');
  const [fps, setFps] = useState(25);
  const [bitrate, setBitrate] = useState('');
  const [recordingMode, setRecordingMode] = useState('continuous');
  const [motionPercent, setMotionPercent] = useState('40');
  const [retentionDays, setRetentionDays] = useState(30);

  const resolution = RESOLUTIONS.find((r) => r.id === resolutionId);
  const codec = CODECS.find((c) => c.id === codecId);

  const suggestedBitrate = useMemo(() => {
    return Math.round(resolution.baseBitrate * codec.factor * (fps / 15));
  }, [resolution, codec, fps]);

  const effectiveBitrate = bitrate === '' ? suggestedBitrate : Math.max(0, Number(bitrate) || 0);

  function applyResolution(id) {
    setResolutionId(id);
    setBitrate('');
  }
  function applyCodec(id) {
    setCodecId(id);
    setBitrate('');
  }
  function applyFps(f) {
    setFps(f);
    setBitrate('');
  }

  const result = useMemo(() => {
    const hoursPerDay = recordingMode === 'continuous' ? 24 : 24 * (Math.max(0, Math.min(100, Number(motionPercent) || 0)) / 100);
    const totalGB = ((effectiveBitrate / 8) * 3600 * hoursPerDay * cameraCount * retentionDays) / 1_000_000;
    const totalTB = totalGB / 1000;
    const suggestedHdd = COMMERCIAL_HDD_SIZES.find((size) => size >= totalTB) || COMMERCIAL_HDD_SIZES[COMMERCIAL_HDD_SIZES.length - 1];
    const perCameraPerDayGB = ((effectiveBitrate / 8) * 3600 * hoursPerDay) / 1_000_000;
    return { totalGB, totalTB, suggestedHdd, perCameraPerDayGB, hoursPerDay };
  }, [effectiveBitrate, cameraCount, retentionDays, recordingMode, motionPercent]);

  return (
    <div aria-label="حاسبة سعة تخزين كاميرات المراقبة">
      <div className="tool-v2-panel-head">
        <span className="tool-v2-country-badge"><span className="tool-v2-live-dot" aria-hidden="true" /> صيغة Reolink / Hikvision الرسمية</span>
      </div>

      <div className="tool-v2-field">
        <label htmlFor="camera-count">عدد الكاميرات</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div id="camera-count" className="tool-v2-stepper" role="group" aria-label="عدد الكاميرات">
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setCameraCount((v) => Math.max(1, v - 1))} aria-label="تقليل">−</button>
            <span className="tool-v2-stepper-val">{cameraCount}</span>
            <button type="button" className="tool-v2-stepper-btn" onClick={() => setCameraCount((v) => Math.min(64, v + 1))} aria-label="زيادة">+</button>
          </div>
          <button type="button" className="tool-v2-action-btn" onClick={() => setShowGuide((v) => !v)}>
            <Camera size={15} weight="bold" /> لا تعرف العدد؟
          </button>
        </div>
        {showGuide ? (
          <div className="guide-v2-checker-options" role="group" aria-label="دليل عدد الكاميرات" style={{ marginTop: 10 }}>
            {PROPERTY_GUIDE.map((p) => (
              <button key={p.label} type="button" className="guide-v2-checker-chip" onClick={() => { setCameraCount(p.count); setShowGuide(false); }}>
                {p.label} ({p.count})
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label>دقة الكاميرا</label>
        <div className="guide-v2-checker-options" role="group" aria-label="دقة الكاميرا">
          {RESOLUTIONS.map((r) => (
            <button key={r.id} type="button" className={`guide-v2-checker-chip${resolutionId === r.id ? ' is-active' : ''}`} aria-pressed={resolutionId === r.id} onClick={() => applyResolution(r.id)}>{r.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field">
        <label>الترميز (الضغط)</label>
        <div className="guide-v2-checker-options" role="group" aria-label="الترميز">
          {CODECS.map((c) => (
            <button key={c.id} type="button" className={`guide-v2-checker-chip${codecId === c.id ? ' is-active' : ''}`} aria-pressed={codecId === c.id} onClick={() => applyCodec(c.id)}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="tool-v2-field-row-pair">
        <div className="tool-v2-field">
          <label>معدل الإطارات (FPS)</label>
          <div className="guide-v2-checker-options" role="group" aria-label="معدل الإطارات">
            {FPS_OPTIONS.map((f) => (
              <button key={f} type="button" className={`guide-v2-checker-chip${fps === f ? ' is-active' : ''}`} aria-pressed={fps === f} onClick={() => applyFps(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="tool-v2-field">
          <label htmlFor="bitrate">
            معدل البت (kbps)
            <FieldHint text="مقترح تلقائياً حسب الدقة والترميز والإطارات — عدّله يدوياً إن كانت كاميرتك الفعلية تحدد رقماً مختلفاً." />
          </label>
          <input id="bitrate" type="number" inputMode="numeric" min="0" step="128" placeholder={String(suggestedBitrate)} value={bitrate} onChange={(e) => setBitrate(e.target.value)} />
        </div>
      </div>

      <div className="tool-v2-field">
        <label>نمط التسجيل</label>
        <div className="guide-v2-checker-options" role="group" aria-label="نمط التسجيل">
          <button type="button" className={`guide-v2-checker-chip${recordingMode === 'continuous' ? ' is-active' : ''}`} aria-pressed={recordingMode === 'continuous'} onClick={() => setRecordingMode('continuous')}>مستمر 24 ساعة</button>
          <button type="button" className={`guide-v2-checker-chip${recordingMode === 'motion' ? ' is-active' : ''}`} aria-pressed={recordingMode === 'motion'} onClick={() => setRecordingMode('motion')}>بالحركة فقط</button>
        </div>
        {recordingMode === 'motion' ? (
          <input type="number" inputMode="numeric" min="0" max="100" className="tool-v2-addon-price" style={{ marginTop: 8 }} value={motionPercent} onChange={(e) => setMotionPercent(e.target.value)} aria-label="نسبة النشاط %" />
        ) : null}
      </div>

      <div className="tool-v2-field">
        <label htmlFor="retention-days">عدد أيام الاحتفاظ</label>
        <div id="retention-days" className="tool-v2-stepper" role="group" aria-label="عدد أيام الاحتفاظ">
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setRetentionDays((v) => Math.max(1, v - 5))} aria-label="تقليل">−</button>
          <span className="tool-v2-stepper-val">{retentionDays}</span>
          <button type="button" className="tool-v2-stepper-btn" onClick={() => setRetentionDays((v) => Math.min(365, v + 5))} aria-label="زيادة">+</button>
        </div>
      </div>

      <div aria-live="polite">
        <div className="tool-v2-result-hero">
          <span className="tool-v2-result-label">السعة الإجمالية المطلوبة</span>
          <div className="tool-v2-result-stat-row">
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.totalTB, 2)}</span>
              <span className="tool-v2-result-stat-label">تيرابايت</span>
            </span>
            <span className="tool-v2-result-stat-sep" aria-hidden="true">≈</span>
            <span className="tool-v2-result-stat">
              <span className="tool-v2-result-stat-value">{fmt(result.totalGB)}</span>
              <span className="tool-v2-result-stat-label">جيجابايت</span>
            </span>
          </div>
          <div className="tool-v2-result-meta">القرص التجاري المقترح: {result.suggestedHdd} تيرابايت</div>
        </div>

        <div className="tool-v2-breakdown-list">
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">استهلاك كل كاميرا يومياً</span>
            <span className="tool-v2-breakdown-value">{fmt(result.perCameraPerDayGB, 2)} جيجابايت</span>
          </div>
          <div className="tool-v2-breakdown-row">
            <span className="tool-v2-breakdown-label">ساعات التسجيل الفعلية يومياً</span>
            <span className="tool-v2-breakdown-value">{fmt(result.hoursPerDay, 1)} ساعة</span>
          </div>
        </div>

        <div className="tool-v2-note-strip">
          <VideoCamera size={15} weight="fill" />
          <span>أضف قرصاً أكبر من الحد الأدنى المحسوب بخطوة تجارية واحدة على الأقل — يمنحك هامش أمان لأيام تسجيل إضافية دون حذف مبكر.</span>
        </div>
      </div>
    </div>
  );
}
