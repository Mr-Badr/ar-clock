import { COUNTRY_META } from '@/lib/calendar-config';
import { CATEGORIES } from '@/lib/holidays-engine';

const TIME_RANGE_OPTIONS = [
  { id: 'all', label: 'الكل' },
  { id: 'week', label: 'أسبوع' },
  { id: 'month', label: 'شهر' },
  { id: '3months', label: '3 أشهر' },
];

const SORT_OPTIONS = [
  { value: 'daysLeft', label: 'الأقرب أولاً' },
  { value: 'daysLeftDesc', label: 'الأبعد أولاً' },
  { value: 'name', label: 'أبجدي' },
];

export function getHolidaysClientModel() {
  const categoryOptions = CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    icon: category.icon,
    iconKey: category.id,
  }));

  const countryOptions = [
    { value: 'all', label: 'كل الدول', flag: '' },
    ...Object.entries(COUNTRY_META)
      .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
      .map(([code, meta]) => ({
        value: code,
        label: meta.name,
        flag: meta.flag,
      })),
  ];

  return {
    categoryOptions,
    countryOptions,
    timeRangeOptions: TIME_RANGE_OPTIONS,
    sortOptions: SORT_OPTIONS,
  };
}
