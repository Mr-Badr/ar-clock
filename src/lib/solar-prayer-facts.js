import { calculatePrayerTimes, formatTime } from './prayerEngine';

const KAABA_COORDINATES = {
  lat: 21.422487,
  lon: 39.826206,
};

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

function normalizeBearing(degrees) {
  return (degrees + 360) % 360;
}

function isFiniteCoordinate(value) {
  return typeof value === 'number' && Number.isFinite(value);
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

function getDurationLabel(startIso, endIso) {
  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();

  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    return '';
  }

  return formatMinutesDuration((endMs - startMs) / 60000);
}

export function getQiblaBearingDegrees({ lat, lon }) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon)) {
    return null;
  }

  const fromLat = toRadians(lat);
  const fromLon = toRadians(lon);
  const toLat = toRadians(KAABA_COORDINATES.lat);
  const toLon = toRadians(KAABA_COORDINATES.lon);
  const deltaLon = toLon - fromLon;

  const y = Math.sin(deltaLon) * Math.cos(toLat);
  const x = (
    Math.cos(fromLat) * Math.sin(toLat)
    - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLon)
  );

  return Math.round(normalizeBearing(toDegrees(Math.atan2(y, x))));
}

export function getQiblaBearingLabel({ lat, lon }) {
  const bearing = getQiblaBearingDegrees({ lat, lon });
  return bearing === null ? '' : `${bearing}°`;
}

export function getSolarPrayerFacts({
  lat,
  lon,
  timezone,
  date,
  countryCode,
  cacheKey,
}) {
  if (!isFiniteCoordinate(lat) || !isFiniteCoordinate(lon) || typeof timezone !== 'string') {
    return null;
  }

  const times = calculatePrayerTimes({
    lat,
    lon,
    timezone,
    date,
    countryCode,
    cacheKey,
  });

  if (!times?.fajr || !times?.sunrise || !times?.maghrib) {
    return null;
  }

  return {
    fajrLabel: formatTime(times.fajr, timezone, false),
    sunriseLabel: formatTime(times.sunrise, timezone, false),
    sunsetLabel: formatTime(times.maghrib, timezone, false),
    maghribLabel: formatTime(times.maghrib, timezone, false),
    dayLengthLabel: getDurationLabel(times.sunrise, times.maghrib),
    fastingLengthLabel: getDurationLabel(times.fajr, times.maghrib),
  };
}
