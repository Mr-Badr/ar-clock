import { DateTime } from 'luxon';

export class TimeEngine {
  static getCurrentTimeInZone(timezone) {
    try {
      return DateTime.now().setZone(timezone);
    } catch (error) {
      console.error('خطأ في المنطقة الزمنية:', error);
      return DateTime.now();
    }
  }

  static getUTCNow() {
    return DateTime.utc();
  }

  // Fixed: 24-hour format with seconds, western numerals
  static formatTime(dateTime) {
    return dateTime.toFormat('HH:mm:ss');
  }

  // Fixed: Arabic weekday and month names, western numerals
  static formatDate(dateTime) {
    const weekday = this.getArabicWeekday(dateTime.weekday);
    const month = this.getArabicMonth(dateTime.month);
    return `${weekday} - ${month} ${dateTime.day}, ${dateTime.year}`;
  }

  static getArabicWeekday(weekdayNumber) {
    const days = {
      1: 'الإثنين',
      2: 'الثلاثاء',
      3: 'الأربعاء',
      4: 'الخميس',
      5: 'الجمعة',
      6: 'السبت',
      7: 'الأحد',
    };
    return days[weekdayNumber] || '';
  }

  static getArabicMonth(monthNumber) {
    const months = {
      1: 'يناير',
      2: 'فبراير',
      3: 'مارس',
      4: 'أبريل',
      5: 'مايو',
      6: 'يونيو',
      7: 'يوليو',
      8: 'أغسطس',
      9: 'سبتمبر',
      10: 'أكتوبر',
      11: 'نوفمبر',
      12: 'ديسمبر',
    };
    return months[monthNumber] || '';
  }

  static getRelativeDay(dateTime, referenceTime) {
    const diffInDays = dateTime.startOf('day').diff(referenceTime.startOf('day'), 'days').days;
    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'غدًا';
    if (diffInDays === -1) return 'أمس';
    if (diffInDays > 1) return `+${Math.floor(diffInDays)} يوم`;
    if (diffInDays < -1) return `${Math.floor(diffInDays)} يوم`;
    return '';
  }

  static getTimezoneOffset(timezone) {
    const dt = DateTime.now().setZone(timezone);
    const offset = dt.offset / 60;
    const sign = offset >= 0 ? '+' : '';
    return `UTC ${sign}${offset}`;
  }

  static getUserTimezone() {
    return DateTime.local().zoneName;
  }
}