import { calculatePrayerTimes, formatTime } from './prayerEngine';

function isFiniteCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatMinutesDuration(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes < 0) {
    return '';
  }

  const roundedMinutes = Math.round(totalMinutes);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours === 0) {
    return `${minutes} دقيقة`;
  }

  if (minutes === 0) {
    return `${hours} ساعة`;
  }

  return `${hours} ساعة و${minutes} دقيقة`;
}

/**
 * The last third of the night (الثلث الأخير من الليل) and the Islamic midpoint
 * of the night (منتصف الليل الشرعي), both derived from the maghrib→fajr interval
 * — the "night" as defined in fiqh, not the civil midnight-to-midnight day.
 *
 * Handles the pre-fajr edge case: before today's fajr, the relevant night already
 * started at YESTERDAY's maghrib, not today's — otherwise a visitor checking at
 * 3am would see tomorrow night's window instead of the one they're currently in.
 */
export function getLastThirdOfNightFacts({ lat, lon, timezone, date, countryCode, cacheKey }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string' || !(date instanceof Date)) {
    return null;
  }

  const baseKey = cacheKey || `${lat},${lon}`;
  const todayTimes = calculatePrayerTimes({ lat, lon, timezone, date, countryCode, cacheKey: `${baseKey}::night0` });
  if (!todayTimes?.fajr || !todayTimes?.maghrib) {
    return null;
  }

  const nowMs = date.getTime();
  const todayFajrMs = new Date(todayTimes.fajr).getTime();

  let maghribIso;
  let fajrIso;

  if (nowMs < todayFajrMs) {
    const yesterdayTimes = calculatePrayerTimes({
      lat, lon, timezone, date: addDays(date, -1), countryCode, cacheKey: `${baseKey}::night-1`,
    });
    if (!yesterdayTimes?.maghrib) return null;
    maghribIso = yesterdayTimes.maghrib;
    fajrIso = todayTimes.fajr;
  } else {
    const tomorrowTimes = calculatePrayerTimes({
      lat, lon, timezone, date: addDays(date, 1), countryCode, cacheKey: `${baseKey}::night+1`,
    });
    if (!tomorrowTimes?.fajr) return null;
    maghribIso = todayTimes.maghrib;
    fajrIso = tomorrowTimes.fajr;
  }

  const maghribMs = new Date(maghribIso).getTime();
  const fajrMs = new Date(fajrIso).getTime();
  const nightMs = fajrMs - maghribMs;

  if (!(nightMs > 0)) {
    return null;
  }

  const lastThirdStartMs = fajrMs - nightMs / 3;
  const islamicMidnightMs = fajrMs - nightMs / 2;
  const lastThirdStartIso = new Date(lastThirdStartMs).toISOString();
  const islamicMidnightIso = new Date(islamicMidnightMs).toISOString();

  return {
    maghribIso,
    fajrIso,
    maghribLabel: formatTime(maghribIso, timezone, false),
    fajrLabel: formatTime(fajrIso, timezone, false),
    nightDurationLabel: formatMinutesDuration(nightMs / 60000),
    lastThirdStartIso,
    lastThirdStartLabel: formatTime(lastThirdStartIso, timezone, false),
    islamicMidnightIso,
    islamicMidnightLabel: formatTime(islamicMidnightIso, timezone, false),
    isCurrentlyLastThird: nowMs >= lastThirdStartMs && nowMs < fajrMs,
    isBeforeIslamicMidnight: nowMs < islamicMidnightMs,
  };
}

/**
 * وقت صلاة الضحى — starts ~15 min after sunrise (once the sun has fully risen,
 * karahah window ends) and ends ~10 min before dhuhr (istiwaa buffer).
 */
export function getDuhaPrayerFacts({ lat, lon, timezone, date, countryCode, cacheKey }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string' || !(date instanceof Date)) {
    return null;
  }

  const times = calculatePrayerTimes({ lat, lon, timezone, date, countryCode, cacheKey });
  if (!times?.sunrise || !times?.dhuhr) {
    return null;
  }

  const startMs = new Date(times.sunrise).getTime() + 15 * 60000;
  const endMs = new Date(times.dhuhr).getTime() - 10 * 60000;

  if (!(endMs > startMs)) {
    return null;
  }

  const duhaStartIso = new Date(startMs).toISOString();
  const duhaEndIso = new Date(endMs).toISOString();
  const nowMs = date.getTime();

  return {
    sunriseLabel: formatTime(times.sunrise, timezone, false),
    dhuhrLabel: formatTime(times.dhuhr, timezone, false),
    duhaStartIso,
    duhaStartLabel: formatTime(duhaStartIso, timezone, false),
    duhaEndIso,
    duhaEndLabel: formatTime(duhaEndIso, timezone, false),
    durationLabel: formatMinutesDuration((endMs - startMs) / 60000),
    isDuhaNow: nowMs >= startMs && nowMs < endMs,
  };
}

/**
 * ساعة الاستجابة يوم الجمعة — the computable view (last hour before Friday
 * maghrib). Live only on Fridays; otherwise returns the countdown target for
 * the upcoming Friday's window.
 */
export function getFridayResponseHourFacts({ lat, lon, timezone, date, countryCode, cacheKey }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string' || !(date instanceof Date)) {
    return null;
  }

  const baseKey = cacheKey || `${lat},${lon}`;
  let targetDate = new Date(date);
  let daysAhead = 0;

  for (let i = 0; i < 8; i += 1) {
    const weekday = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' }).format(targetDate);
    if (weekday === 'Fri') {
      daysAhead = i;
      break;
    }
    targetDate = addDays(targetDate, 1);
  }

  const fridayTimes = calculatePrayerTimes({
    lat, lon, timezone, date: targetDate, countryCode, cacheKey: `${baseKey}::fri${daysAhead}`,
  });
  if (!fridayTimes?.maghrib) {
    return null;
  }

  const maghribMs = new Date(fridayTimes.maghrib).getTime();
  const responseStartMs = maghribMs - 60 * 60000;
  const responseHourStartIso = new Date(responseStartMs).toISOString();
  const nowMs = date.getTime();
  const isFridayToday = daysAhead === 0;
  const isLiveNow = isFridayToday && nowMs >= responseStartMs && nowMs < maghribMs;

  return {
    fridayMaghribIso: fridayTimes.maghrib,
    fridayMaghribLabel: formatTime(fridayTimes.maghrib, timezone, false),
    responseHourStartIso,
    responseHourStartLabel: formatTime(responseHourStartIso, timezone, false),
    isFridayToday,
    isLiveNow,
  };
}

/**
 * أوقات النهي عن الصلاة — the three prohibited/disliked prayer windows, per the
 * hadith of Uqbah ibn Amir (Sahih Muslim 831): sunrise, true noon (istiwaa/zawal),
 * and sunset. The sunrise and zawal windows use the same ~15min/~10min practical
 * buffers already used by `getDuhaPrayerFacts` above (Duha starts exactly where
 * the sunrise window ends, and ends exactly where the zawal window begins — the
 * two pages are deliberately consistent). The sunset window uses the exact
 * asr→maghrib prayer times with no estimation needed.
 */
export function getProhibitedPrayerWindowsFacts({ lat, lon, timezone, date, countryCode, cacheKey }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string' || !(date instanceof Date)) {
    return null;
  }

  const times = calculatePrayerTimes({ lat, lon, timezone, date, countryCode, cacheKey });
  if (!times?.fajr || !times?.sunrise || !times?.dhuhr || !times?.asr || !times?.maghrib) {
    return null;
  }

  const fajrMs = new Date(times.fajr).getTime();
  const sunriseMs = new Date(times.sunrise).getTime();
  const dhuhrMs = new Date(times.dhuhr).getTime();
  const asrMs = new Date(times.asr).getTime();
  const maghribMs = new Date(times.maghrib).getTime();
  const nowMs = date.getTime();

  const rawWindows = [
    {
      key: 'sunrise',
      title: 'من الفجر حتى ارتفاع الشمس',
      startMs: fajrMs,
      endMs: sunriseMs + 15 * 60000,
    },
    {
      key: 'zawal',
      title: 'وقت الاستواء (زوال الشمس)',
      startMs: dhuhrMs - 10 * 60000,
      endMs: dhuhrMs,
    },
    {
      key: 'sunset',
      title: 'من العصر حتى الغروب',
      startMs: asrMs,
      endMs: maghribMs,
    },
  ];

  const windows = rawWindows.map((w) => {
    const startIso = new Date(w.startMs).toISOString();
    const endIso = new Date(w.endMs).toISOString();
    return {
      key: w.key,
      title: w.title,
      startIso,
      endIso,
      startLabel: formatTime(startIso, timezone, false),
      endLabel: formatTime(endIso, timezone, false),
      durationLabel: formatMinutesDuration((w.endMs - w.startMs) / 60000),
      isActiveNow: nowMs >= w.startMs && nowMs < w.endMs,
    };
  });

  const activeWindow = windows.find((w) => w.isActiveNow) || null;

  return {
    fajrLabel: formatTime(times.fajr, timezone, false),
    sunriseLabel: formatTime(times.sunrise, timezone, false),
    dhuhrLabel: formatTime(times.dhuhr, timezone, false),
    asrLabel: formatTime(times.asr, timezone, false),
    maghribLabel: formatTime(times.maghrib, timezone, false),
    windows,
    activeWindow,
    isProhibitedNow: Boolean(activeWindow),
  };
}
