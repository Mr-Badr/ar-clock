'use client';

import { useEffect, useMemo, useState } from 'react';

import { resolveCurrentUserCity } from '@/lib/user-location.client';

function mergeViewerWithDetection(currentViewer, detection) {
  const city = detection?.city;
  if (!city?.timezone) {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || currentViewer.timezone;
    return browserTimezone && browserTimezone !== currentViewer.timezone
      ? { ...currentViewer, timezone: browserTimezone }
      : currentViewer;
  }

  return {
    ...currentViewer,
    timezone: city.timezone || currentViewer.timezone,
    cityNameAr: city.city_name_ar || currentViewer.cityNameAr || '',
    countryNameAr: city.country_name_ar || currentViewer.countryNameAr || '',
    countryCode: city.country_code || currentViewer.countryCode || '',
    source: detection?.source || currentViewer.source || 'timezone',
  };
}

export function useEconomyLiveModel(buildModel, initialViewer, initialNowIso) {
  const [viewer, setViewer] = useState(initialViewer);
  const [nowIso, setNowIso] = useState(initialNowIso || null);

  useEffect(() => {
    setNowIso(new Date().toISOString());

    const timer = window.setInterval(() => {
      setNowIso(new Date().toISOString());
    }, 30_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function detectViewer() {
      try {
        const detection = await resolveCurrentUserCity({
          geolocation: 'if-granted',
          gpsTimeoutMs: 4_000,
        });

        if (cancelled) return;

        setViewer((currentViewer) => mergeViewerWithDetection(currentViewer, detection));
      } catch {
        if (cancelled) return;

        setViewer((currentViewer) => mergeViewerWithDetection(currentViewer, null));
      }
    }

    detectViewer();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(() => {
    if (!nowIso) return null;
    return buildModel(viewer, nowIso);
  }, [buildModel, nowIso, viewer]);
}
