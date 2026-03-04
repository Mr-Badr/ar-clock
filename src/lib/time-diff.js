export function getTimeDifference(fromTz, toTz, inputDate = new Date()) {
  try {
    const d = new Date(inputDate);
    if (isNaN(d.getTime())) {
      throw new Error("Invalid date provided.");
    }

    const getOffsetMinutes = (tz, targetDate) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      }).formatToParts(targetDate);
      
      const p = {};
      parts.forEach(({type, value}) => p[type] = value);
      
      let hour = parseInt(p.hour, 10);
      if (hour === 24) hour = 0;
      
      const localDate = new Date(Date.UTC(
        parseInt(p.year, 10),
        parseInt(p.month, 10) - 1,
        parseInt(p.day, 10),
        hour,
        parseInt(p.minute, 10),
        parseInt(p.second, 10)
      ));
      
      const utcDate = new Date(Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        targetDate.getUTCHours(),
        targetDate.getUTCMinutes(),
        targetDate.getUTCSeconds()
      ));

      return Math.round((localDate.getTime() - utcDate.getTime()) / 60000);
    };

    const offsetFrom = getOffsetMinutes(fromTz, d);
    const offsetTo = getOffsetMinutes(toTz, d);
    
    // Number of minutes to add to 'from' to get 'to'
    const diffMinutes = offsetTo - offsetFrom;
    
    const getIsDST = (tz, targetDate) => {
      const year = targetDate.getFullYear();
      const janOffset = getOffsetMinutes(tz, new Date(year, 0, 1));
      const julOffset = getOffsetMinutes(tz, new Date(year, 6, 1));
      const currentOffset = getOffsetMinutes(tz, targetDate);
      
      if (janOffset === julOffset) return false;
      
      const stdOffset = Math.min(janOffset, julOffset);
      return currentOffset > stdOffset;
    };

    const isDSTFrom = getIsDST(fromTz, d);
    const isDSTTo = getIsDST(toTz, d);

    const formatTimeAr = (tz, date) => {
      return new Intl.DateTimeFormat('ar-EG', {
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    };

    const formatTimeEn = (tz, date) => {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);
    };

    const isSameDayOrNext = (fromOffset, toOffset, targetDate) => {
       const userFromUnix = targetDate.getTime() + (fromOffset * 60000);
       const userToUnix = targetDate.getTime() + (toOffset * 60000);

       const fromDay = new Date(userFromUnix).getUTCDate();
       const toDay = new Date(userToUnix).getUTCDate();

       if (fromDay === toDay) return "same";
       
       return userToUnix > userFromUnix ? "next" : "prev";
    };

    const dayStatus = isSameDayOrNext(offsetFrom, offsetTo, d);

    // Provide a sign correctly
    const sign = diffMinutes >= 0 ? "+" : "-";
    const absDiff = Math.abs(diffMinutes);
    const hours = Math.floor(absDiff / 60);
    const minutes = absDiff % 60;

    return {
      success: true,
      from: fromTz,
      to: toTz,
      differenceHours: diffMinutes >= 0 ? hours : -hours,
      differenceMinutes: minutes, // Always positive, part of the hours
      totalMinutes: diffMinutes,
      formattedHours: hours,
      formattedMinutes: minutes,
      sign, // + or - relative to "from"
      formattedFromTimeAr: formatTimeAr(fromTz, d),
      formattedToTimeAr: formatTimeAr(toTz, d),
      formattedFromTimeEn: formatTimeEn(fromTz, d),
      formattedToTimeEn: formatTimeEn(toTz, d),
      isDSTFrom,
      isDSTTo,
      dayStatus, // "same" | "next" | "prev"
      fromOffsetMinutes: offsetFrom,
      toOffsetMinutes: offsetTo,
      timestamp: d.toISOString()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
