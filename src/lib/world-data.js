// Comprehensive list of countries and their main timezones
// Prioritizing Arabic names where available, falling back to English

export const worldCountries = [
  // Arab Countries (Priority)
  { code: 'SA', name: 'المملكة العربية السعودية', englishName: 'Saudi Arabia', flag: '🇸🇦', timezones: ['Asia/Riyadh'] },
  { code: 'AE', name: 'الإمارات العربية المتحدة', englishName: 'United Arab Emirates', flag: '🇦🇪', timezones: ['Asia/Dubai'] },
  { code: 'EG', name: 'مصر', englishName: 'Egypt', flag: '🇪🇬', timezones: ['Africa/Cairo'] },
  { code: 'KW', name: 'الكويت', englishName: 'Kuwait', flag: '🇰🇼', timezones: ['Asia/Kuwait'] },
  { code: 'QA', name: 'قطر', englishName: 'Qatar', flag: '🇶🇦', timezones: ['Asia/Qatar'] },
  { code: 'BH', name: 'البحرين', englishName: 'Bahrain', flag: '🇧🇭', timezones: ['Asia/Bahrain'] },
  { code: 'OM', name: 'سلطنة عمان', englishName: 'Oman', flag: '🇴🇲', timezones: ['Asia/Muscat'] },
  { code: 'JO', name: 'الأردن', englishName: 'Jordan', flag: '🇯🇴', timezones: ['Asia/Amman'] },
  { code: 'LB', name: 'لبنان', englishName: 'Lebanon', flag: '🇱🇧', timezones: ['Asia/Beirut'] },
  { code: 'IQ', name: 'العراق', englishName: 'Iraq', flag: '🇮🇶', timezones: ['Asia/Baghdad'] },
  { code: 'SY', name: 'سوريا', englishName: 'Syria', flag: '🇸🇾', timezones: ['Asia/Damascus'] },
  { code: 'PS', name: 'فلسطين', englishName: 'Palestine', flag: '🇵🇸', timezones: ['Asia/Jerusalem', 'Asia/Gaza'] },
  { code: 'YE', name: 'اليمن', englishName: 'Yemen', flag: '🇾🇪', timezones: ['Asia/Aden'] },
  { code: 'MA', name: 'المغرب', englishName: 'Morocco', flag: '🇲🇦', timezones: ['Africa/Casablanca'] },
  { code: 'DZ', name: 'الجزائر', englishName: 'Algeria', flag: '🇩🇿', timezones: ['Africa/Algiers'] },
  { code: 'TN', name: 'تونس', englishName: 'Tunisia', flag: '🇹🇳', timezones: ['Africa/Tunis'] },
  { code: 'LY', name: 'ليبيا', englishName: 'Libya', flag: '🇱🇾', timezones: ['Africa/Tripoli'] },
  { code: 'SD', name: 'السودان', englishName: 'Sudan', flag: '🇸🇩', timezones: ['Africa/Khartoum'] },
  { code: 'SO', name: 'الصومال', englishName: 'Somalia', flag: '🇸🇴', timezones: ['Africa/Mogadishu'] },
  { code: 'DJ', name: 'جيبوتي', englishName: 'Djibouti', flag: '🇩🇯', timezones: ['Africa/Djibouti'] },
  { code: 'KM', name: 'جزر القمر', englishName: 'Comoros', flag: '🇰🇲', timezones: ['Indian/Comoro'] },
  { code: 'MR', name: 'موريتانيا', englishName: 'Mauritania', flag: '🇲🇷', timezones: ['Africa/Nouakchott'] },

  // World Major Countries
  { code: 'US', name: 'الولايات المتحدة', englishName: 'United States', flag: '🇺🇸', timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Phoenix', 'America/Anchorage', 'Pacific/Honolulu'] },
  { code: 'GB', name: 'المملكة المتحدة', englishName: 'United Kingdom', flag: '🇬🇧', timezones: ['Europe/London'] },
  { code: 'FR', name: 'فرنسا', englishName: 'France', flag: '🇫🇷', timezones: ['Europe/Paris'] },
  { code: 'DE', name: 'ألمانيا', englishName: 'Germany', flag: '🇩🇪', timezones: ['Europe/Berlin'] },
  { code: 'ES', name: 'إسبانيا', englishName: 'Spain', flag: '🇪🇸', timezones: ['Europe/Madrid', 'Atlantic/Canary'] },
  { code: 'IT', name: 'إيطاليا', englishName: 'Italy', flag: '🇮🇹', timezones: ['Europe/Rome'] },
  { code: 'RU', name: 'روسيا', englishName: 'Russia', flag: '🇷🇺', timezones: ['Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Vladivostok', 'Asia/Kamchatka'] },
  { code: 'CN', name: 'الصين', englishName: 'China', flag: '🇨🇳', timezones: ['Asia/Shanghai', 'Asia/Urumqi'] },
  { code: 'JP', name: 'اليابان', englishName: 'Japan', flag: '🇯🇵', timezones: ['Asia/Tokyo'] },
  { code: 'IN', name: 'الهند', englishName: 'India', flag: '🇮🇳', timezones: ['Asia/Kolkata'] },
  { code: 'TR', name: 'تركيا', englishName: 'Turkey', flag: '🇹🇷', timezones: ['Europe/Istanbul'] },
  { code: 'CA', name: 'كندا', englishName: 'Canada', flag: '🇨🇦', timezones: ['America/Toronto', 'America/Vancouver', 'America/Montreal', 'America/Calgary', 'America/Edmonton', 'America/Winnipeg', 'America/Halifax', 'America/St_Johns'] },
  { code: 'AU', name: 'أستراليا', englishName: 'Australia', flag: '🇦🇺', timezones: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane', 'Australia/Adelaide', 'Australia/Perth', 'Australia/Darwin', 'Australia/Hobart'] },
  { code: 'BR', name: 'البرازيل', englishName: 'Brazil', flag: '🇧🇷', timezones: ['America/Sao_Paulo', 'America/Manaus', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Eirunepe', 'America/Rio_Branco'] },
  { code: 'ID', name: 'إندونيسيا', englishName: 'Indonesia', flag: '🇮🇩', timezones: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'] },
  { code: 'PK', name: 'باكستان', englishName: 'Pakistan', flag: '🇵🇰', timezones: ['Asia/Karachi'] },
  { code: 'BD', name: 'بنغلاديش', englishName: 'Bangladesh', flag: '🇧🇩', timezones: ['Asia/Dhaka'] },
  { code: 'NG', name: 'نيجيريا', englishName: 'Nigeria', flag: '🇳🇬', timezones: ['Africa/Lagos'] },
  { code: 'MX', name: 'المكسيك', englishName: 'Mexico', flag: '🇲🇽', timezones: ['America/Mexico_City', 'America/Tijuana', 'America/Monterrey', 'America/Mazatlan', 'America/Chihuahua'] },
  { code: 'PH', name: 'الفلبين', englishName: 'Philippines', flag: '🇵🇭', timezones: ['Asia/Manila'] },
  { code: 'KR', name: 'كوريا الجنوبية', englishName: 'South Korea', flag: '🇰🇷', timezones: ['Asia/Seoul'] },
  { code: 'ZA', name: 'جنوب أفريقيا', englishName: 'South Africa', flag: '🇿🇦', timezones: ['Africa/Johannesburg'] },
  { code: 'AR', name: 'الأرجنتين', englishName: 'Argentina', flag: '🇦🇷', timezones: ['America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia'] },
  { code: 'CO', name: 'كولومبيا', englishName: 'Colombia', flag: '🇨🇴', timezones: ['America/Bogota'] },
  { code: 'UA', name: 'أوكرانيا', englishName: 'Ukraine', flag: '🇺🇦', timezones: ['Europe/Kyiv'] },
  { code: 'PL', name: 'بولندا', englishName: 'Poland', flag: '🇵🇱', timezones: ['Europe/Warsaw'] },
  { code: 'NL', name: 'هولندا', englishName: 'Netherlands', flag: '🇳🇱', timezones: ['Europe/Amsterdam'] },
  { code: 'SE', name: 'السويد', englishName: 'Sweden', flag: '🇸🇪', timezones: ['Europe/Stockholm'] },
  { code: 'BE', name: 'بلجيكا', englishName: 'Belgium', flag: '🇧🇪', timezones: ['Europe/Brussels'] },
  { code: 'CH', name: 'سويسرا', englishName: 'Switzerland', flag: '🇨🇭', timezones: ['Europe/Zurich'] },
  { code: 'AT', name: 'النمسا', englishName: 'Austria', flag: '🇦🇹', timezones: ['Europe/Vienna'] },
  { code: 'GR', name: 'اليونان', englishName: 'Greece', flag: '🇬🇷', timezones: ['Europe/Athens'] },
  { code: 'PT', name: 'البرتغال', englishName: 'Portugal', flag: '🇵🇹', timezones: ['Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores'] },
  { code: 'VN', name: 'فيتنام', englishName: 'Vietnam', flag: '🇻🇳', timezones: ['Asia/Ho_Chi_Minh'] },
  { code: 'TH', name: 'تايلاند', englishName: 'Thailand', flag: '🇹🇭', timezones: ['Asia/Bangkok'] },
  { code: 'MY', name: 'ماليزيا', englishName: 'Malaysia', flag: '🇲🇾', timezones: ['Asia/Kuala_Lumpur'] },
  { code: 'SG', name: 'سنغافورة', englishName: 'Singapore', flag: '🇸🇬', timezones: ['Asia/Singapore'] },
  { code: 'NZ', name: 'نيوزيلندا', englishName: 'New Zealand', flag: '🇳🇿', timezones: ['Pacific/Auckland', 'Pacific/Chatham'] },
  { code: 'IL', name: 'إسرائيل', englishName: 'Israel', flag: '🇮🇱', timezones: ['Asia/Jerusalem'] }
];

// Helper to get formatted timezone name
// e.g., "America/New_York" -> "New York (GMT-5)"
export function formatTimezoneDisplay(tzId) {
  try {
    const cityName = tzId.split('/').pop().replace(/_/g, ' ');
    // We could add offset calculation here if needed, but for now name is enough
    return cityName;
  } catch (e) {
    return tzId;
  }
}
