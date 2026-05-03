// components/economy/useEconomyLiveModel.jsx
'use client';

import { useEffect, useRef, useState } from 'react';

import { logger, serializeError } from '@/lib/logger';
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

export function useEconomyLiveModel(buildModel, initialViewer, initialNowIso, getDocumentTitle = null) {
  const [viewer, setViewer] = useState(initialViewer);
  const [nowIso, setNowIso] = useState(initialNowIso || null);
  const [model, setModel] = useState(() => {
    if (!initialNowIso) return null;

    try {
      return buildModel(initialViewer, initialNowIso);
    } catch {
      return null;
    }
  });
  const loggedModelErrorRef = useRef('');

  useEffect(() => {
    setNowIso(new Date().toISOString());

    const timer = window.setInterval(() => {
      setNowIso(new Date().toISOString());
    }, 1_000);

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

  useEffect(() => {
    if (!nowIso) return;

    try {
      const nextModel = buildModel(viewer, nowIso);
      loggedModelErrorRef.current = '';
      setModel(nextModel);
    } catch (error) {
      const signature = `${error?.name || 'Error'}:${error?.message || 'unknown'}`;

      if (loggedModelErrorRef.current !== signature) {
        loggedModelErrorRef.current = signature;
        logger.warn('economy-live-model-build-failed', {
          viewerTimezone: viewer?.timezone || null,
          nowIso,
          error: serializeError(error),
        });
      }
    }
  }, [buildModel, nowIso, viewer]);

  useEffect(() => {
    if (!model || typeof getDocumentTitle !== 'function') return undefined;

    const nextTitle = getDocumentTitle(model);
    const previousTitle = document.title;

    if (nextTitle) {
      document.title = nextTitle;
    }

    return () => {
      document.title = previousTitle;
    };
  }, [getDocumentTitle, model]);

  return model;
}
