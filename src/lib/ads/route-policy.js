export function normalizeAdPathname(pathname = '/') {
  if (!pathname) return '/';
  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}

export function getAdRoutePolicy(pathname = '/') {
  const normalized = normalizeAdPathname(pathname);

  const isHolidayDetail = normalized.startsWith('/holidays/');
  const isDateSection = normalized === '/date' || normalized.startsWith('/date/');
  const isTimeNowSection = normalized === '/time-now' || normalized.startsWith('/time-now/');
  const isTimeDifferenceSection = normalized === '/time-difference' || normalized.startsWith('/time-difference/');

  return {
    enableFullscreenCompanion:
      normalized === '/' ||
      isHolidayDetail ||
      isDateSection ||
      isTimeNowSection ||
      isTimeDifferenceSection,
  };
}
