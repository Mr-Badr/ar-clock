const STORAGE_KEYS = {
  SELECTED_CITIES: 'vclock_selected_cities',
  SETTINGS: 'vclock_settings',
  USER_TIMEZONE: 'vclock_user_timezone'
};

export const storage = {
  getSelectedCities() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SELECTED_CITIES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('خطأ في قراءة المدن المحفوظة:', error);
      return null;
    }
  },

  saveSelectedCities(cities) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_CITIES, JSON.stringify(cities));
    } catch (error) {
      console.error('خطأ في حفظ المدن:', error);
    }
  },

  getSettings() {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('خطأ في قراءة الإعدادات:', error);
      return null;
    }
  },

  saveSettings(settings) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
    }
  },

  getUserTimezone() {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_TIMEZONE);
    } catch (error) {
      console.error('خطأ في قراءة المنطقة الزمنية:', error);
      return null;
    }
  },

  saveUserTimezone(timezone) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.USER_TIMEZONE, timezone);
    } catch (error) {
      console.error('خطأ في حفظ المنطقة الزمنية:', error);
    }
  }
};

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  is24Hour: true,
  showDate: true,
  useArabicNumerals: false,
  clockColor: '#3B82F6',
  fontSize: 'large'
};
