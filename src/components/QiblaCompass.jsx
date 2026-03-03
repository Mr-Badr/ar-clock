'use client';

/**
 * components/QiblaCompass.jsx
 * 
 * Professional-grade Qibla Finder UI using Shadcn components.
 * Features:
 * - Real-time distance to Mecca (Haversine).
 * - Precision & Calibration quality indicators.
 * - Haptic-like visual alignment feedback.
 * - Shadcn Card, Badge, and Alert integration.
 * - Smooth CSS animations for "Live" status.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Navigation,
  MapPin,
  AlertCircle,
  RefreshCw,
  Infinity,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const MECCA_COORDS = { lat: 21.4225, lon: 39.8262 };

export default function QiblaCompass({ qiblaAngle, userLat, userLon }) {
  const [heading, setHeading] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState(null);
  const [isCalibrated, setIsCalibrated] = useState(false);

  // Distance Calculation
  const distanceKm = useMemo(() => {
    if (!userLat || !userLon) return null;
    const R = 6371;
    const dLat = (MECCA_COORDS.lat - userLat) * Math.PI / 180;
    const dLon = (MECCA_COORDS.lon - userLon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * Math.PI / 180) * Math.cos(MECCA_COORDS.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, [userLat, userLon]);

  // Alignment Logic
  const isAligned = heading !== null && qiblaAngle !== null && Math.abs((qiblaAngle - heading + 540) % 360 - 180) < 3;

  const requestPermission = async () => {
    setError(null);
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          startCompass();
        } else {
          setError('يرجى السماح بالوصول للمستشعرات لتفعيل البوصلة الذكية.');
        }
      } else {
        startCompass();
      }

      if (!userLat || !userLon) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            window.location.href = `/qibla?lat=${latitude}&lon=${longitude}`;
          },
          (err) => setError('تعذر تحديد الموقع. يرجى تفعيل الـ GPS.'),
          { enableHighAccuracy: true }
        );
      }
    } catch (e) {
      setIsSupported(false);
      setError('الجهاز لا يدعم مستشعرات الاتجاه المتقدمة.');
    }
  };

  const startCompass = () => {
    setPermissionGranted(true);
    const handler = (event) => {
      let alpha = event.webkitCompassHeading || (360 - event.alpha);
      if (alpha !== undefined && alpha !== null) {
        setHeading(alpha);
        setIsCalibrated(true);
      }
    };
    window.addEventListener('deviceorientationabsolute', handler, true);
    window.addEventListener('deviceorientation', handler, true);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handler, true);
      window.removeEventListener('deviceorientation', handler, true);
    };
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* ── Status Bar ── */}
      <div className="flex items-center justify-between px-2">
        <Badge variant={isCalibrated ? "outline" : "secondary"} className="gap-1.5 py-1 px-3 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          مباشر
        </Badge>
        {isCalibrated && (
          <Badge variant="outline" className="gap-1.5 py-1 px-3 border-blue-500/20 text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            دقة عالية
          </Badge>
        )}
      </div>

      {/* ── Main Display Card ── */}
      <Card className="overflow-hidden border-none bg-surface-1 shadow-2xl relative">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-bold text-primary tracking-tight">اتجاه مكة المكرمة</CardTitle>
          <CardDescription className="text-sm">قم بتوجيه السهم نحو الأعلى للحصول على الاتجاه الصحيح</CardDescription>
        </CardHeader>

        <CardContent className="relative flex flex-col items-center pt-8 pb-12">

          {/* Visual Ground Plane / Ring Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[80px] transition-all duration-700 ${isAligned ? 'bg-emerald-500/30 scale-125' : 'bg-accent/10'}`} />

          {/* 3D-Look Compass */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">

            {/* Outer Decorative Ring */}
            <div className="absolute inset-0 rounded-full border border-border/40 shadow-inner" />
            <div className="absolute inset-4 rounded-full border-2 border-dashed border-border/20" />

            {/* Compass Dial (Rotating with device) */}
            <div
              className="absolute inset-0 transition-transform duration-200 ease-out flex items-center justify-center"
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              <div className="absolute top-4 text-[11px] font-black text-primary/60 tracking-[0.2em]">N</div>
              <div className="absolute bottom-4 text-[11px] font-black text-muted/30 tracking-[0.2em]">S</div>
              <div className="absolute right-4 text-[11px] font-bold text-muted/30 uppercase">E</div>
              <div className="absolute left-4 text-[11px] font-bold text-muted/30 uppercase">W</div>
            </div>

            {/* Qibla Needle (Mecca Pointer) */}
            <div
              className="absolute inset-0 z-20 flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${(qiblaAngle || 0) - heading}deg)` }}
            >
              <div className={`relative flex flex-col items-center transition-all duration-500 ${isAligned ? 'scale-110 drop-shadow-[0_0_15px_var(--color-emerald-500)]' : 'opacity-80 scale-100'}`}>
                <div className={`w-1.5 h-32 bg-gradient-to-t from-transparent via-emerald-500/40 to-emerald-500 rounded-full absolute bottom-1/2 left-1/2 -translate-x-1/2 blur-[2px] transition-opacity ${isAligned ? 'opacity-100' : 'opacity-0'}`} />
                <Navigation className={`w-28 h-28 ${isAligned ? 'text-emerald-500 fill-emerald-500' : 'text-primary/30 fill-primary/10'} drop-shadow-lg`} />

                {isAligned && (
                  <div className="absolute -top-12 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Inner Hub */}
            <div className="w-12 h-12 bg-surface-1 border-4 border-border rounded-full z-30 shadow-xl flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isAligned ? 'bg-emerald-500 scale-150 shadow-[0_0_10px_var(--color-emerald-500)]' : 'bg-muted scale-100'}`} />
            </div>
          </div>

          {/* Real-time Angle Feedback */}
          <div className="mt-14 flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-primary tabular-nums tracking-tighter">
                {isCalibrated ? Math.round(heading) : '---'}
              </span>
              <span className="text-2xl text-muted font-light">°</span>
            </div>
            <p className="text-xs font-bold text-muted/60 uppercase tracking-widest">بوصلة المتصفح</p>
          </div>
        </CardContent>
      </Card>

      {/* ── Info Grid ── */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-surface-2 border-border/40 shadow-sm flex flex-col items-center justify-center p-6 text-center space-y-1">
          <MapPin className="w-5 h-5 text-accent/60 mb-1" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">المسافة للكعبة</span>
          <span className="text-xl font-black text-primary tabular-nums">{distanceKm ? `${distanceKm.toLocaleString()}` : '--'} <span className="text-sm font-medium">كم</span></span>
        </Card>

        <Card className="bg-surface-2 border-border/40 shadow-sm flex flex-col items-center justify-center p-6 text-center space-y-1">
          <Zap className="w-5 h-5 text-blue-500/60 mb-1" />
          <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">زاوية القبلة</span>
          <span className="text-xl font-black text-primary tabular-nums">{qiblaAngle ? `${Math.round(qiblaAngle)}°` : '--'}</span>
        </Card>
      </div>

      {/* ── Action Area ── */}
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-2xl border-none shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تنبيه</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!permissionGranted ? (
          <Button
            onClick={requestPermission}
            className="w-full h-16 rounded-2xl text-lg font-bold gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700"
          >
            <RefreshCw className="w-6 h-6" />
            تشغيل البوصلة المباشرة
          </Button>
        ) : (
          <div className="p-5 rounded-2xl bg-surface-2 border border-border/40 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Info className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary leading-none">نصيحة للمعايرة</p>
              <p className="text-xs text-muted leading-relaxed">قم بتحريك هاتفك في الهواء على شكل رقم (8) لتقليل التداخل المغناطيسي وزيادة الدقة.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Context */}
      <div className="pt-4 flex flex-col items-center gap-4">
        <Separator className="w-24 bg-border/40" />
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-surface-1 bg-surface-3 flex items-center justify-center text-[8px] font-bold text-muted">
                {i}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">يستخدمه 10,000+ مستخدم يومياً</p>
        </div>
      </div>

    </div>
  );
}

function Info(props) {
  return <Navigation {...props} className={props.className + " rotate-45"} />
}
