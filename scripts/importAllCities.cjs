#!/usr/bin/env node
// scripts/importAllCities.cjs — run: node scripts/importAllCities.cjs

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load env
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n').forEach(line => {
  const t = line.trim(); if (!t || t.startsWith('#')) return;
  const eq = t.indexOf('='); if (eq > 0) process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
});

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// ─── DATASET: 500+ cities beyond seedCities.json ─────────────────────────────
// Format: [country_slug, country_name_ar, city_slug, city_name_ar, city_name_en, lat, lon, timezone, population, priority]
const RAW = [
  // ── Saudi Arabia (extra cities) ──────────────────────────────────────────────
  ['saudi-arabia', 'السعودية', 'taif', 'الطائف', 'Taif', 21.2854, 40.4152, 'Asia/Riyadh', 921298, 72],
  ['saudi-arabia', 'السعودية', 'buraydah', 'بريدة', 'Buraydah', 26.3260, 43.9750, 'Asia/Riyadh', 614984, 70],
  ['saudi-arabia', 'السعودية', 'hail', 'حائل', 'Hail', 27.5219, 41.7057, 'Asia/Riyadh', 504178, 65],
  ['saudi-arabia', 'السعودية', 'khamis-mushait', 'خميس مشيط', 'Khamis Mushait', 18.3059, 42.7283, 'Asia/Riyadh', 492859, 65],
  ['saudi-arabia', 'السعودية', 'jubail', 'الجبيل', 'Jubail', 27.0061, 49.6581, 'Asia/Riyadh', 237274, 60],
  ['saudi-arabia', 'السعودية', 'yanbu', 'ينبع', 'Yanbu', 24.0895, 38.0618, 'Asia/Riyadh', 234429, 60],
  ['saudi-arabia', 'السعودية', 'najran', 'نجران', 'Najran', 17.4924, 44.1321, 'Asia/Riyadh', 582225, 58],
  ['saudi-arabia', 'السعودية', 'jizan', 'جازان', 'Jizan', 16.8892, 42.5511, 'Asia/Riyadh', 148497, 58],
  ['saudi-arabia', 'السعودية', 'al-ahsa', 'الأحساء', 'Al-Ahsa', 25.3796, 49.5867, 'Asia/Riyadh', 1063112, 68],
  ['saudi-arabia', 'السعودية', 'sakaka', 'سكاكا', 'Sakaka', 29.9685, 40.2060, 'Asia/Riyadh', 130379, 55],
  // ── Egypt (extra cities) ──────────────────────────────────────────────────────
  ['egypt', 'مصر', 'port-said', 'بور سعيد', 'Port Said', 31.2565, 32.2841, 'Africa/Cairo', 760000, 72],
  ['egypt', 'مصر', 'suez', 'السويس', 'Suez', 29.9668, 32.5498, 'Africa/Cairo', 728180, 70],
  ['egypt', 'مصر', 'mansoura', 'المنصورة', 'Mansoura', 31.0356, 31.3789, 'Africa/Cairo', 960000, 70],
  ['egypt', 'مصر', 'tanta', 'طنطا', 'Tanta', 30.7865, 31.0004, 'Africa/Cairo', 421076, 67],
  ['egypt', 'مصر', 'asyut', 'أسيوط', 'Asyut', 27.1878, 31.1789, 'Africa/Cairo', 420585, 65],
  ['egypt', 'مصر', 'fayyum', 'الفيوم', 'Fayyum', 29.3084, 30.8428, 'Africa/Cairo', 431052, 63],
  ['egypt', 'مصر', 'zagazig', 'الزقازيق', 'Zagazig', 30.5877, 31.5021, 'Africa/Cairo', 309956, 62],
  ['egypt', 'مصر', 'ismailia', 'الإسماعيلية', 'Ismailia', 30.5965, 32.2715, 'Africa/Cairo', 370543, 62],
  ['egypt', 'مصر', 'damanhur', 'دمنهور', 'Damanhur', 31.0342, 30.4696, 'Africa/Cairo', 315862, 60],
  ['egypt', 'مصر', 'minya', 'المنيا', 'Minya', 28.1099, 30.7503, 'Africa/Cairo', 320000, 60],
  ['egypt', 'مصر', 'beni-suef', 'بني سويف', 'Beni Suef', 29.0661, 31.0994, 'Africa/Cairo', 242508, 58],
  ['egypt', 'مصر', 'qena', 'قنا', 'Qena', 26.1615, 32.7250, 'Africa/Cairo', 216938, 56],
  ['egypt', 'مصر', 'sohag', 'سوهاج', 'Sohag', 26.5569, 31.6948, 'Africa/Cairo', 195600, 56],
  ['egypt', 'مصر', 'hurghada', 'الغردقة', 'Hurghada', 27.2574, 33.8129, 'Africa/Cairo', 248000, 65],
  ['egypt', 'مصر', 'sharm-el-sheikh', 'شرم الشيخ', 'Sharm el Sheikh', 27.9158, 34.3300, 'Africa/Cairo', 73000, 60],
  // ── Morocco (extra) ───────────────────────────────────────────────────────────
  ['morocco', 'المغرب', 'safi', 'آسفي', 'Safi', 32.2994, -9.2373, 'Africa/Casablanca', 308508, 70],
  ['morocco', 'المغرب', 'beni-mellal', 'بني ملال', 'Beni Mellal', 32.3372, -6.3498, 'Africa/Casablanca', 192676, 65],
  ['morocco', 'المغرب', 'kenitra', 'القنيطرة', 'Kenitra', 34.2610, -6.5802, 'Africa/Casablanca', 431282, 68],
  ['morocco', 'المغرب', 'tetouan', 'تطوان', 'Tetouan', 35.5729, -5.3686, 'Africa/Casablanca', 380787, 70],
  ['morocco', 'المغرب', 'nador', 'الناظور', 'Nador', 35.1740, -2.9287, 'Africa/Casablanca', 160466, 62],
  ['morocco', 'المغرب', 'settat', 'سطات', 'Settat', 33.0003, -7.6219, 'Africa/Casablanca', 142250, 60],
  ['morocco', 'المغرب', 'el-jadida', 'الجديدة', 'El Jadida', 33.2316, -8.5007, 'Africa/Casablanca', 194934, 64],
  ['morocco', 'المغرب', 'larache', 'العرائش', 'Larache', 35.1932, -6.1560, 'Africa/Casablanca', 125008, 58],
  ['morocco', 'المغرب', 'taza', 'تازة', 'Taza', 34.2100, -4.0100, 'Africa/Casablanca', 148456, 58],
  ['morocco', 'المغرب', 'errachidia', 'الرشيدية', 'Errachidia', 31.9312, -4.4249, 'Africa/Casablanca', 99000, 55],
  ['morocco', 'المغرب', 'ouarzazate', 'ورزازات', 'Ouarzazate', 30.9335, -6.8934, 'Africa/Casablanca', 86000, 55],
  ['morocco', 'المغرب', 'dakhla', 'الداخلة', 'Dakhla', 23.6848, -15.9570, 'Africa/Casablanca', 106000, 58],
  ['morocco', 'المغرب', 'laayoune', 'العيون', 'Laayoune', 27.1418, -13.1800, 'Africa/Casablanca', 217732, 60],
  // ── Algeria (extra) ───────────────────────────────────────────────────────────
  ['algeria', 'الجزائر', 'annaba', 'عنابة', 'Annaba', 36.9000, 7.7667, 'Africa/Algiers', 342703, 72],
  ['algeria', 'الجزائر', 'batna', 'باتنة', 'Batna', 35.5560, 6.1740, 'Africa/Algiers', 310848, 68],
  ['algeria', 'الجزائر', 'blida', 'البليدة', 'Blida', 36.4700, 2.8300, 'Africa/Algiers', 331779, 66],
  ['algeria', 'الجزائر', 'setif', 'سطيف', 'Setif', 36.1898, 5.4136, 'Africa/Algiers', 288461, 68],
  ['algeria', 'الجزائر', 'sidi-bel-abbes', 'سيدي بلعباس', 'Sidi Bel Abbes', 35.1893, -0.6314, 'Africa/Algiers', 212935, 65],
  ['algeria', 'الجزائر', 'biskra', 'بسكرة', 'Biskra', 34.8500, 5.7333, 'Africa/Algiers', 204661, 63],
  ['algeria', 'الجزائر', 'tlemcen', 'تلمسان', 'Tlemcen', 34.8900, -1.3200, 'Africa/Algiers', 173531, 65],
  ['algeria', 'الجزائر', 'bejaia', 'بجاية', 'Bejaia', 36.7500, 5.0833, 'Africa/Algiers', 177988, 64],
  ['algeria', 'الجزائر', 'tebeça', 'تبسة', 'Tebessa', 35.4040, 8.1210, 'Africa/Algiers', 153246, 60],
  ['algeria', 'الجزائر', 'mostaganem', 'مستغانم', 'Mostaganem', 35.9334, -0.0895, 'Africa/Algiers', 142815, 60],
  ['algeria', 'الجزائر', 'bouira', 'البويرة', 'Bouira', 36.3800, 3.9000, 'Africa/Algiers', 113668, 58],
  ['algeria', 'الجزائر', 'chlef', 'الشلف', 'Chlef', 36.1653, 1.3317, 'Africa/Algiers', 130000, 58],
  ['algeria', 'الجزائر', 'djelfa', 'الجلفة', 'Djelfa', 34.6700, 3.2500, 'Africa/Algiers', 350000, 60],
  ['algeria', 'الجزائر', 'ghardaia', 'غرداية', 'Ghardaia', 32.4900, 3.6700, 'Africa/Algiers', 100000, 60],
  ['algeria', 'الجزائر', 'ouargla', 'ورقلة', 'Ouargla', 31.9500, 5.3200, 'Africa/Algiers', 153000, 60],
  // ── Tunisia (extra) ───────────────────────────────────────────────────────────
  ['tunisia', 'تونس', 'sousse', 'سوسة', 'Sousse', 35.8289, 10.6405, 'Africa/Tunis', 271428, 78],
  ['tunisia', 'تونس', 'kairouan', 'القيروان', 'Kairouan', 35.6784, 10.0963, 'Africa/Tunis', 186653, 72],
  ['tunisia', 'تونس', 'bizerte', 'بنزرت', 'Bizerte', 37.2744, 9.8739, 'Africa/Tunis', 142966, 70],
  ['tunisia', 'تونس', 'medenine', 'مدنين', 'Medenine', 33.3503, 10.5014, 'Africa/Tunis', 80000, 60],
  ['tunisia', 'تونس', 'nabeul', 'نابل', 'Nabeul', 36.4561, 10.7376, 'Africa/Tunis', 80000, 60],
  ['tunisia', 'تونس', 'gabes', 'قابس', 'Gabes', 33.8869, 10.0982, 'Africa/Tunis', 152000, 65],
  ['tunisia', 'تونس', 'gafsa', 'قفصة', 'Gafsa', 34.4300, 8.7800, 'Africa/Tunis', 111000, 60],
  ['tunisia', 'تونس', 'beja', 'باجة', 'Beja', 36.7306, 9.1817, 'Africa/Tunis', 65000, 55],
  ['tunisia', 'تونس', 'monastir', 'المنستير', 'Monastir', 35.7643, 10.8113, 'Africa/Tunis', 71546, 62],
  ['tunisia', 'تونس', 'hammamet', 'الحمامات', 'Hammamet', 36.3993, 10.6161, 'Africa/Tunis', 87000, 60],
  // ── Libya (extra) ─────────────────────────────────────────────────────────────
  ['libya', 'ليبيا', 'misrata', 'مصراتة', 'Misrata', 32.3754, 15.0925, 'Africa/Tripoli', 386000, 72],
  ['libya', 'ليبيا', 'zawiya', 'الزاوية', 'Zawiya', 32.7546, 12.7278, 'Africa/Tripoli', 186000, 65],
  ['libya', 'ليبيا', 'derna', 'درنة', 'Derna', 32.7543, 22.6372, 'Africa/Tripoli', 100000, 60],
  ['libya', 'ليبيا', 'tobruk', 'طبرق', 'Tobruk', 32.0870, 23.9756, 'Africa/Tripoli', 120000, 60],
  ['libya', 'ليبيا', 'sebha', 'سبها', 'Sebha', 27.0377, 14.4283, 'Africa/Tripoli', 130000, 60],
  ['libya', 'ليبيا', 'gharyan', 'غريان', 'Gharyan', 32.1722, 13.0200, 'Africa/Tripoli', 110000, 55],
  // ── Sudan (extra) ─────────────────────────────────────────────────────────────
  ['sudan', 'السودان', 'port-sudan', 'بورتسودان', 'Port Sudan', 19.6158, 37.2164, 'Africa/Khartoum', 489725, 68],
  ['sudan', 'السودان', 'kassala', 'كسلا', 'Kassala', 15.4518, 36.3987, 'Africa/Khartoum', 418000, 65],
  ['sudan', 'السودان', 'gedaref', 'القضارف', 'Gedaref', 14.0378, 35.3933, 'Africa/Khartoum', 343000, 62],
  ['sudan', 'السودان', 'atbara', 'عطبرة', 'Atbara', 17.6989, 33.9864, 'Africa/Khartoum', 103604, 60],
  ['sudan', 'السودان', 'wad-madani', 'ود مدني', 'Wad Madani', 14.3910, 33.5210, 'Africa/Khartoum', 345000, 62],
  ['sudan', 'السودان', 'el-obeid', 'الأبيض', 'El Obeid', 13.1830, 30.2170, 'Africa/Khartoum', 393311, 62],
  // ── Iraq (extra) ──────────────────────────────────────────────────────────────
  ['iraq', 'العراق', 'sulaymaniyah', 'السليمانية', 'Sulaymaniyah', 35.5600, 45.4350, 'Asia/Baghdad', 723170, 72],
  ['iraq', 'العراق', 'kirkuk', 'كركوك', 'Kirkuk', 35.4681, 44.3922, 'Asia/Baghdad', 1091000, 70],
  ['iraq', 'العراق', 'karbala', 'كربلاء', 'Karbala', 32.6160, 44.0245, 'Asia/Baghdad', 1035000, 75],
  ['iraq', 'العراق', 'hilla', 'الحلة', 'Hilla', 32.4729, 44.4221, 'Asia/Baghdad', 535000, 65],
  ['iraq', 'العراق', 'ramadi', 'الرمادي', 'Ramadi', 33.4237, 43.2997, 'Asia/Baghdad', 532000, 64],
  ['iraq', 'العراق', 'dohuk', 'دهوك', 'Dohuk', 36.8669, 42.9903, 'Asia/Baghdad', 500000, 65],
  ['iraq', 'العراق', 'amarah', 'العمارة', 'Amarah', 31.8455, 47.1519, 'Asia/Baghdad', 423000, 63],
  ['iraq', 'العراق', 'samawa', 'السماوة', 'Samawa', 31.3161, 45.2839, 'Asia/Baghdad', 350000, 62],
  ['iraq', 'العراق', 'nasiriyah', 'الناصرية', 'Nasiriyah', 31.0460, 46.2578, 'Asia/Baghdad', 560000, 65],
  ['iraq', 'العراق', 'diwaniyah', 'الديوانية', 'Diwaniyah', 31.9896, 44.9253, 'Asia/Baghdad', 490000, 64],
  ['iraq', 'العراق', 'baqubah', 'بعقوبة', 'Baqubah', 33.7500, 44.6333, 'Asia/Baghdad', 467000, 63],
  ['iraq', 'العراق', 'samarra', 'سامراء', 'Samarra', 34.1984, 43.8748, 'Asia/Baghdad', 348700, 62],
  // ── Syria (extra) ─────────────────────────────────────────────────────────────
  ['syria', 'سوريا', 'homs', 'حمص', 'Homs', 34.7295, 36.7165, 'Asia/Damascus', 652609, 75],
  ['syria', 'سوريا', 'hama', 'حماة', 'Hama', 35.1333, 36.7500, 'Asia/Damascus', 460602, 70],
  ['syria', 'سوريا', 'latakia', 'اللاذقية', 'Latakia', 35.5317, 35.7914, 'Asia/Damascus', 383786, 70],
  ['syria', 'سوريا', 'deir-ez-zor', 'دير الزور', 'Deir ez-Zor', 35.3351, 40.1416, 'Asia/Damascus', 211857, 65],
  ['syria', 'سوريا', 'raqqa', 'الرقة', 'Raqqa', 35.9500, 39.0130, 'Asia/Damascus', 220488, 63],
  ['syria', 'سوريا', 'idlib', 'إدلب', 'Idlib', 35.9296, 36.6338, 'Asia/Damascus', 163972, 62],
  ['syria', 'سوريا', 'qamishli', 'القامشلي', 'Qamishli', 37.0519, 41.2295, 'Asia/Damascus', 184231, 62],
  ['syria', 'سوريا', 'hasakah', 'الحسكة', 'Hasakah', 36.5025, 40.7519, 'Asia/Damascus', 188160, 60],
  ['syria', 'سوريا', 'tartus', 'طرطوس', 'Tartus', 34.8906, 35.8869, 'Asia/Damascus', 152500, 62],
  ['syria', 'سوريا', 'daraa', 'درعا', 'Daraa', 32.6189, 36.1021, 'Asia/Damascus', 97969, 58],
  // ── Jordan (extra) ────────────────────────────────────────────────────────────
  ['jordan', 'الأردن', 'aqaba', 'العقبة', 'Aqaba', 29.5321, 35.0063, 'Asia/Amman', 188160, 70],
  ['jordan', 'الأردن', 'tafilah', 'الطفيلة', 'Tafilah', 30.8375, 35.6017, 'Asia/Amman', 78000, 53],
  ['jordan', 'الأردن', 'salt', 'السلط', 'Salt', 32.0326, 35.7278, 'Asia/Amman', 100000, 55],
  ['jordan', 'الأردن', 'mafraq', 'المفرق', 'Mafraq', 32.3430, 36.2120, 'Asia/Amman', 95000, 55],
  ['jordan', 'الأردن', 'madaba', 'مادبا', 'Madaba', 31.7160, 35.7940, 'Asia/Amman', 82000, 55],
  ['jordan', 'الأردن', 'karak', 'الكرك', 'Karak', 31.1760, 35.7030, 'Asia/Amman', 97000, 55],
  ['jordan', 'الأردن', 'ajloun', 'عجلون', 'Ajloun', 32.3333, 35.7500, 'Asia/Amman', 58000, 53],
  ['jordan', 'الأردن', 'jerash', 'جرش', 'Jerash', 32.2847, 35.9001, 'Asia/Amman', 50000, 53],
  // ── Palestine (extra) ─────────────────────────────────────────────────────────
  ['palestine', 'فلسطين', 'nablus', 'نابلس', 'Nablus', 32.2226, 35.2543, 'Asia/Jerusalem', 185998, 72],
  ['palestine', 'فلسطين', 'hebron', 'الخليل', 'Hebron', 31.5300, 35.0998, 'Asia/Jerusalem', 246702, 72],
  ['palestine', 'فلسطين', 'jenin', 'جنين', 'Jenin', 32.4619, 35.2966, 'Asia/Jerusalem', 56000, 65],
  ['palestine', 'فلسطين', 'khanyunis', 'خانيونس', 'Khan Yunis', 31.3452, 34.3067, 'Asia/Gaza', 300000, 68],
  ['palestine', 'فلسطين', 'rafah', 'رفح', 'Rafah', 31.2970, 34.2477, 'Asia/Gaza', 200000, 65],
  ['palestine', 'فلسطين', 'jericho', 'أريحا', 'Jericho', 31.8569, 35.4588, 'Asia/Jerusalem', 25000, 60],
  // ── Lebanon (extra) ───────────────────────────────────────────────────────────
  ['lebanon', 'لبنان', 'sidon', 'صيدا', 'Sidon', 33.5606, 35.3714, 'Asia/Beirut', 163554, 72],
  ['lebanon', 'لبنان', 'tyre', 'صور', 'Tyre', 33.2700, 35.2030, 'Asia/Beirut', 117100, 65],
  ['lebanon', 'لبنان', 'zahle', 'زحلة', 'Zahle', 33.8500, 35.9010, 'Asia/Beirut', 150000, 65],
  ['lebanon', 'لبنان', 'baalbek', 'بعلبك', 'Baalbek', 34.0040, 36.2120, 'Asia/Beirut', 82608, 62],
  ['lebanon', 'لبنان', 'nabatieh', 'النبطية', 'Nabatieh', 33.3760, 35.4840, 'Asia/Beirut', 100000, 60],
  // ── Yemen (extra) ─────────────────────────────────────────────────────────────
  ['yemen', 'اليمن', 'taiz', 'تعز', 'Taiz', 13.5772, 44.0177, 'Asia/Aden', 615222, 72],
  ['yemen', 'اليمن', 'hodeida', 'الحديدة', 'Hodeida', 14.7980, 42.9534, 'Asia/Aden', 617871, 70],
  ['yemen', 'اليمن', 'ibb', 'إب', 'Ibb', 13.9764, 44.1836, 'Asia/Aden', 300000, 65],
  ['yemen', 'اليمن', 'mukalla', 'المكلا', 'Mukalla', 14.5224, 49.1229, 'Asia/Aden', 258132, 65],
  ['yemen', 'اليمن', 'dhamar', 'ذمار', 'Dhamar', 14.5470, 44.4043, 'Asia/Aden', 160000, 60],
  ['yemen', 'اليمن', 'saada', 'صعدة', 'Saada', 16.9360, 43.7600, 'Asia/Aden', 50000, 58],
  // ── UAE (extra) ───────────────────────────────────────────────────────────────
  ['uae', 'الإمارات', 'fujairah', 'الفجيرة', 'Fujairah', 25.1288, 56.3265, 'Asia/Dubai', 117000, 68],
  ['uae', 'الإمارات', 'umm-al-quwain', 'أم القيوين', 'Umm Al Quwain', 25.5647, 55.5554, 'Asia/Dubai', 72000, 60],
  ['uae', 'الإمارات', 'al-ain', 'العين', 'Al Ain', 24.2075, 55.7447, 'Asia/Dubai', 766936, 75],
  // ── Kuwait (extra) ────────────────────────────────────────────────────────────
  ['kuwait', 'الكويت', 'jahra', 'الجهراء', 'Jahra', 29.3396, 47.6580, 'Asia/Kuwait', 400000, 70],
  ['kuwait', 'الكويت', 'farwaniya', 'الفروانية', 'Farwaniya', 29.2773, 47.9590, 'Asia/Kuwait', 638000, 72],
  ['kuwait', 'الكويت', 'ahmadi', 'الأحمدي', 'Ahmadi', 29.0766, 48.0832, 'Asia/Kuwait', 637411, 68],
  // ── Oman (extra) ──────────────────────────────────────────────────────────────
  ['oman', 'عُمان', 'sohar', 'صحار', 'Sohar', 24.3479, 56.7468, 'Asia/Muscat', 197200, 68],
  ['oman', 'عُمان', 'nizwa', 'نزوى', 'Nizwa', 22.9333, 57.5333, 'Asia/Muscat', 72000, 60],
  ['oman', 'عُمان', 'sur', 'صور', 'Sur', 22.5671, 59.5289, 'Asia/Muscat', 90000, 58],
  ['oman', 'عُمان', 'barka', 'بركاء', 'Barka', 23.6877, 57.8893, 'Asia/Muscat', 92000, 57],
  // ── Bahrain (extra) ───────────────────────────────────────────────────────────
  ['bahrain', 'البحرين', 'muharraq', 'المحرق', 'Muharraq', 26.2576, 50.6127, 'Asia/Bahrain', 176583, 75],
  ['bahrain', 'البحرين', 'riffa', 'الرفاع', 'Riffa', 26.1295, 50.5557, 'Asia/Bahrain', 171262, 68],
  // ── Qatar (extra) ─────────────────────────────────────────────────────────────
  ['qatar', 'قطر', 'al-rayyan', 'الريان', 'Al Rayyan', 25.2892, 51.4240, 'Asia/Qatar', 832000, 78],
  ['qatar', 'قطر', 'al-khor', 'الخور', 'Al Khor', 25.6843, 51.4968, 'Asia/Qatar', 247000, 67],
  // ── Turkey (extra) ────────────────────────────────────────────────────────────
  ['turkey', 'تركيا', 'bursa', 'بورصة', 'Bursa', 40.1826, 29.0665, 'Europe/Istanbul', 2936803, 75],
  ['turkey', 'تركيا', 'adana', 'أضنة', 'Adana', 37.0000, 35.3213, 'Europe/Istanbul', 2183167, 73],
  ['turkey', 'تركيا', 'gaziantep', 'غازي عنتاب', 'Gaziantep', 37.0662, 37.3833, 'Europe/Istanbul', 2028563, 73],
  ['turkey', 'تركيا', 'konya', 'قونية', 'Konya', 37.8667, 32.4833, 'Europe/Istanbul', 2232374, 72],
  ['turkey', 'تركيا', 'antalya', 'أنطاليا', 'Antalya', 36.8969, 30.7133, 'Europe/Istanbul', 1352321, 72],
  ['turkey', 'تركيا', 'diyarbakir', 'ديار بكر', 'Diyarbakir', 37.9100, 40.2330, 'Europe/Istanbul', 1004359, 70],
  ['turkey', 'تركيا', 'kayseri', 'قيصرية', 'Kayseri', 38.7189, 35.4847, 'Europe/Istanbul', 1389680, 70],
  ['turkey', 'تركيا', 'mersin', 'مرسين', 'Mersin', 36.8000, 34.6333, 'Europe/Istanbul', 1000000, 68],
  ['turkey', 'تركيا', 'trabzon', 'طرابزون', 'Trabzon', 41.0015, 39.7178, 'Europe/Istanbul', 805369, 68],
  ['turkey', 'تركيا', 'sanliurfa', 'شانلي أورفا', 'Sanliurfa', 37.1591, 38.7969, 'Europe/Istanbul', 1249500, 68],
  ['turkey', 'تركيا', 'malatya', 'ملاطية', 'Malatya', 38.3552, 38.3095, 'Europe/Istanbul', 842977, 65],
  ['turkey', 'تركيا', 'erzurum', 'أرضروم', 'Erzurum', 39.9055, 41.2658, 'Europe/Istanbul', 763314, 63],
  // ── Pakistan (extra) ──────────────────────────────────────────────────────────
  ['pakistan', 'باكستان', 'faisalabad', 'فيصل آباد', 'Faisalabad', 31.4180, 73.0790, 'Asia/Karachi', 3203846, 78],
  ['pakistan', 'باكستان', 'rawalpindi', 'راولبندي', 'Rawalpindi', 33.5970, 73.0430, 'Asia/Karachi', 2098231, 75],
  ['pakistan', 'باكستان', 'gujranwala', 'گوجرانوالا', 'Gujranwala', 32.1877, 74.1945, 'Asia/Karachi', 2027001, 73],
  ['pakistan', 'باكستان', 'multan', 'ملتان', 'Multan', 30.1978, 71.4711, 'Asia/Karachi', 1871843, 73],
  ['pakistan', 'باكستان', 'hyderabad', 'حيدر آباد', 'Hyderabad', 25.3600, 68.3700, 'Asia/Karachi', 1732693, 70],
  ['pakistan', 'باكستان', 'peshawar', 'پشاور', 'Peshawar', 34.0150, 71.5249, 'Asia/Karachi', 1970042, 72],
  ['pakistan', 'باكستان', 'quetta', 'كويتا', 'Quetta', 30.1798, 66.9750, 'Asia/Karachi', 1140000, 70],
  ['pakistan', 'باكستان', 'bahawalpur', 'بهاولبور', 'Bahawalpur', 29.3956, 71.6836, 'Asia/Karachi', 762111, 67],
  // ── Bangladesh ────────────────────────────────────────────────────────────────
  ['bangladesh', 'بنغلاديش', 'dhaka', 'دكا', 'Dhaka', 23.8103, 90.4125, 'Asia/Dhaka', 10356500, 80],
  ['bangladesh', 'بنغلاديش', 'chittagong', 'شيتاغونغ', 'Chittagong', 22.3569, 91.7832, 'Asia/Dhaka', 2581643, 72],
  ['bangladesh', 'بنغلاديش', 'sylhet', 'سيلهيت', 'Sylhet', 24.8949, 91.8687, 'Asia/Dhaka', 526412, 65],
  ['bangladesh', 'بنغلاديش', 'rajshahi', 'راجشاهي', 'Rajshahi', 24.3636, 88.6241, 'Asia/Dhaka', 700133, 65],
  // ── Indonesia (extra) ─────────────────────────────────────────────────────────
  ['indonesia', 'إندونيسيا', 'bandung', 'باندونغ', 'Bandung', -6.9175, 107.6191, 'Asia/Jakarta', 2575478, 72],
  ['indonesia', 'إندونيسيا', 'medan', 'ميدان', 'Medan', 3.5952, 98.6722, 'Asia/Jakarta', 2435252, 72],
  ['indonesia', 'إندونيسيا', 'makassar', 'ماكاسار', 'Makassar', -5.1477, 119.4327, 'Asia/Makassar', 1483000, 70],
  ['indonesia', 'إندونيسيا', 'semarang', 'سيمارانغ', 'Semarang', -6.9667, 110.4167, 'Asia/Jakarta', 1555984, 68],
  ['indonesia', 'إندونيسيا', 'palembang', 'بالمبانغ', 'Palembang', -2.9167, 104.7458, 'Asia/Jakarta', 1441500, 68],
  ['indonesia', 'إندونيسيا', 'aceh', 'آتشيه', 'Aceh', 5.5502, 95.3232, 'Asia/Jakarta', 250000, 65],
  // ── Malaysia (extra) ──────────────────────────────────────────────────────────
  ['malaysia', 'ماليزيا', 'george-town', 'جورج تاون', 'George Town', 5.4141, 100.3288, 'Asia/Kuala_Lumpur', 721000, 68],
  ['malaysia', 'ماليزيا', 'johor-bahru', 'جوهور بارو', 'Johor Bahru', 1.4927, 103.7414, 'Asia/Kuala_Lumpur', 861892, 70],
  ['malaysia', 'ماليزيا', 'ipoh', 'إيبوه', 'Ipoh', 4.5975, 101.0901, 'Asia/Kuala_Lumpur', 673000, 65],
  ['malaysia', 'ماليزيا', 'kota-kinabalu', 'كوتا كينابالو', 'Kota Kinabalu', 5.9788, 116.0753, 'Asia/Kuala_Lumpur', 452058, 65],
  // ── Iran (extra) ──────────────────────────────────────────────────────────────
  ['iran', 'إيران', 'isfahan', 'أصفهان', 'Isfahan', 32.6539, 51.6660, 'Asia/Tehran', 2220000, 75],
  ['iran', 'إيران', 'tabriz', 'تبريز', 'Tabriz', 38.0800, 46.2919, 'Asia/Tehran', 1773033, 73],
  ['iran', 'إيران', 'shiraz', 'شيراز', 'Shiraz', 29.6100, 52.5150, 'Asia/Tehran', 1869001, 73],
  ['iran', 'إيران', 'karaj', 'كرج', 'Karaj', 35.8327, 50.9915, 'Asia/Tehran', 1973470, 72],
  ['iran', 'إيران', 'ahvaz', 'الأهواز', 'Ahvaz', 31.3183, 48.6706, 'Asia/Tehran', 1184788, 72],
  ['iran', 'إيران', 'qom', 'قم', 'Qom', 34.6416, 50.8746, 'Asia/Tehran', 1257000, 72],
  ['iran', 'إيران', 'kermanshah', 'كرمانشاه', 'Kermanshah', 34.3142, 47.0650, 'Asia/Tehran', 946651, 68],
  ['iran', 'إيران', 'rasht', 'رشت', 'Rasht', 37.2809, 49.5832, 'Asia/Tehran', 679995, 65],
  ['iran', 'إيران', 'zahedan', 'زاهدان', 'Zahedan', 29.4963, 60.8629, 'Asia/Tehran', 587730, 65],
  // ── Afghanistan ───────────────────────────────────────────────────────────────
  ['afghanistan', 'أفغانستان', 'kabul', 'كابول', 'Kabul', 34.5253, 69.1783, 'Asia/Kabul', 4601789, 75],
  ['afghanistan', 'أفغانستان', 'kandahar', 'قندهار', 'Kandahar', 31.6289, 65.7372, 'Asia/Kabul', 614118, 65],
  ['afghanistan', 'أفغانستان', 'herat', 'هرات', 'Herat', 34.3529, 62.2040, 'Asia/Kabul', 574276, 65],
  ['afghanistan', 'أفغانستان', 'mazar-e-sharif', 'مزار شريف', 'Mazar-e-Sharif', 36.7080, 67.1109, 'Asia/Kabul', 469247, 63],
  ['afghanistan', 'أفغانستان', 'jalalabad', 'جلال آباد', 'Jalalabad', 34.4415, 70.4360, 'Asia/Kabul', 356274, 62],
  // ── Senegal ───────────────────────────────────────────────────────────────────
  ['senegal', 'السنغال', 'dakar', 'داكار', 'Dakar', 14.6937, -17.4441, 'Africa/Dakar', 3731000, 72],
  ['senegal', 'السنغال', 'touba', 'طوبى', 'Touba', 14.8500, -15.8833, 'Africa/Dakar', 753813, 65],
  ['senegal', 'السنغال', 'thies', 'تيس', 'Thies', 14.7910, -16.9260, 'Africa/Dakar', 372000, 60],
  // ── Mali ──────────────────────────────────────────────────────────────────────
  ['mali', 'مالي', 'bamako', 'باماكو', 'Bamako', 12.6392, -8.0029, 'Africa/Bamako', 2515000, 70],
  ['mali', 'مالي', 'timbuktu', 'تمبكتو', 'Timbuktu', 16.7735, -3.0074, 'Africa/Bamako', 54453, 65],
  // ── Niger ─────────────────────────────────────────────────────────────────────
  ['niger', 'النيجر', 'niamey', 'نيامي', 'Niamey', 13.5137, 2.1098, 'Africa/Niamey', 1011277, 68],
  ['niger', 'النيجر', 'zinder', 'زندر', 'Zinder', 13.8055, 8.9882, 'Africa/Niamey', 322737, 58],
  // ── Nigeria ───────────────────────────────────────────────────────────────────
  ['nigeria', 'نيجيريا', 'kano', 'كانو', 'Kano', 12.0022, 8.5920, 'Africa/Lagos', 3848885, 75],
  ['nigeria', 'نيجيريا', 'lagos', 'لاغوس', 'Lagos', 6.4550, 3.3841, 'Africa/Lagos', 14800000, 80],
  ['nigeria', 'نيجيريا', 'abuja', 'أبوجا', 'Abuja', 9.0579, 7.4951, 'Africa/Lagos', 3464123, 75],
  ['nigeria', 'نيجيريا', 'ibadan', 'إيبادان', 'Ibadan', 7.3775, 3.9470, 'Africa/Lagos', 3552000, 70],
  ['nigeria', 'نيجيريا', 'kaduna', 'كادونا', 'Kaduna', 10.5220, 7.4381, 'Africa/Lagos', 1582102, 68],
  ['nigeria', 'نيجيريا', 'sokoto', 'صوكوتو', 'Sokoto', 13.0600, 5.2400, 'Africa/Lagos', 427760, 65],
  ['nigeria', 'نيجيريا', 'maiduguri', 'مايدوغوري', 'Maiduguri', 11.8311, 13.1508, 'Africa/Lagos', 803000, 65],
  // ── Somalia ───────────────────────────────────────────────────────────────────
  ['somalia', 'الصومال', 'mogadishu', 'مقديشو', 'Mogadishu', 2.0469, 45.3419, 'Africa/Mogadishu', 2587183, 72],
  ['somalia', 'الصومال', 'hargeisa', 'هرجيسا', 'Hargeisa', 9.5600, 44.0650, 'Africa/Mogadishu', 760000, 65],
  ['somalia', 'الصومال', 'kismayo', 'كيسمايو', 'Kismayo', -0.3582, 42.5454, 'Africa/Mogadishu', 234852, 58],
  // ── Mauritania ────────────────────────────────────────────────────────────────
  ['mauritania', 'موريتانيا', 'nouakchott', 'نواكشوط', 'Nouakchott', 18.0800, -15.9660, 'Africa/Nouakchott', 1030000, 68],
  ['mauritania', 'موريتانيا', 'nouadhibou', 'نواذيبو', 'Nouadhibou', 20.9310, -17.0347, 'Africa/Nouakchott', 118167, 60],
  // ── Chad ──────────────────────────────────────────────────────────────────────
  ['chad', 'تشاد', 'ndjamena', 'نجامينا', 'NDjamena', 12.1070, 15.0440, 'Africa/Ndjamena', 1323000, 68],
  ['chad', 'تشاد', 'moundou', 'منداو', 'Moundou', 8.5667, 16.0833, 'Africa/Ndjamena', 135167, 58],
  // ── Comoros ───────────────────────────────────────────────────────────────────
  ['comoros', 'جزر القمر', 'moroni', 'موروني', 'Moroni', -11.7022, 43.2551, 'Indian/Comoro', 60200, 60],
  // ── Djibouti ──────────────────────────────────────────────────────────────────
  ['djibouti', 'جيبوتي', 'djibouti-city', 'مدينة جيبوتي', 'Djibouti City', 11.5886, 43.1456, 'Africa/Djibouti', 623891, 65],
  // ── Eritrea ───────────────────────────────────────────────────────────────────
  ['eritrea', 'إريتريا', 'asmara', 'أسمرة', 'Asmara', 15.3380, 38.9312, 'Africa/Asmara', 963000, 62],
  // ── Gambia ────────────────────────────────────────────────────────────────────
  ['gambia', 'غامبيا', 'banjul', 'بانجول', 'Banjul', 13.4549, -16.5790, 'Africa/Banjul', 31301, 60],
  // ── Guinea ────────────────────────────────────────────────────────────────────
  ['guinea', 'غينيا', 'conakry', 'كوناكري', 'Conakry', 9.6412, -13.5784, 'Africa/Conakry', 1667864, 65],
  // ── Sierra Leone ──────────────────────────────────────────────────────────────
  ['sierra-leone', 'سيراليون', 'freetown', 'فريتاون', 'Freetown', 8.4697, -13.2659, 'Africa/Freetown', 1055964, 62],
  // ── Kazakhstan ────────────────────────────────────────────────────────────────
  ['kazakhstan', 'كازاخستان', 'almaty', 'ألماتي', 'Almaty', 43.2220, 76.8512, 'Asia/Almaty', 1977011, 72],
  ['kazakhstan', 'كازاخستان', 'nur-sultan', 'نور سلطان', 'Nur-Sultan', 51.1801, 71.4460, 'Asia/Nur-Sultan', 1184400, 70],
  ['kazakhstan', 'كازاخستان', 'shymkent', 'شيمكنت', 'Shymkent', 42.3417, 69.5901, 'Asia/Almaty', 1200000, 68],
  // ── Uzbekistan ────────────────────────────────────────────────────────────────
  ['uzbekistan', 'أوزبكستان', 'tashkent', 'طشقند', 'Tashkent', 41.2995, 69.2401, 'Asia/Tashkent', 2507900, 72],
  ['uzbekistan', 'أوزبكستان', 'samarkand', 'سمرقند', 'Samarkand', 39.6270, 66.9750, 'Asia/Samarkand', 604000, 70],
  ['uzbekistan', 'أوزبكستان', 'namangan', 'نامنغان', 'Namangan', 41.0011, 71.6725, 'Asia/Tashkent', 597000, 65],
  ['uzbekistan', 'أوزبكستان', 'bukhara', 'بخارى', 'Bukhara', 39.7747, 64.4286, 'Asia/Samarkand', 280187, 68],
  // ── Tajikistan ────────────────────────────────────────────────────────────────
  ['tajikistan', 'طاجيكستان', 'dushanbe', 'دوشنبه', 'Dushanbe', 38.5598, 68.7870, 'Asia/Dushanbe', 897400, 68],
  // ── Kyrgyzstan ────────────────────────────────────────────────────────────────
  ['kyrgyzstan', 'قرغيزستان', 'bishkek', 'بيشكيك', 'Bishkek', 42.8746, 74.5698, 'Asia/Bishkek', 1012500, 68],
  // ── Turkmenistan ──────────────────────────────────────────────────────────────
  ['turkmenistan', 'تركمانستان', 'ashgabat', 'عشق آباد', 'Ashgabat', 37.9601, 58.3261, 'Asia/Ashgabat', 810000, 65],
  // ── Azerbaijan ────────────────────────────────────────────────────────────────
  ['azerbaijan', 'أذربيجان', 'baku', 'باكو', 'Baku', 40.4093, 49.8671, 'Asia/Baku', 2293100, 72],
  // ── India (Muslim-majority areas) ─────────────────────────────────────────────
  ['india', 'الهند', 'mumbai', 'مومباي', 'Mumbai', 19.0760, 72.8777, 'Asia/Kolkata', 20667656, 75],
  ['india', 'الهند', 'delhi', 'دلهي', 'Delhi', 28.7041, 77.1025, 'Asia/Kolkata', 32941000, 78],
  ['india', 'الهند', 'hyderabad', 'حيدر آباد (الهند)', 'Hyderabad India', 17.3850, 78.4867, 'Asia/Kolkata', 10534418, 72],
  ['india', 'الهند', 'lucknow', 'لكناو', 'Lucknow', 26.8467, 80.9462, 'Asia/Kolkata', 3382000, 70],
  ['india', 'الهند', 'kolkata', 'كلكتا', 'Kolkata', 22.5726, 88.3639, 'Asia/Kolkata', 14850000, 73],
  // ── Europe (Muslim diaspora cities) ───────────────────────────────────────────
  ['netherlands', 'هولندا', 'amsterdam', 'أمستردام', 'Amsterdam', 52.3676, 4.9041, 'Europe/Amsterdam', 921402, 70],
  ['netherlands', 'هولندا', 'rotterdam', 'روتردام', 'Rotterdam', 51.9244, 4.4777, 'Europe/Amsterdam', 651376, 68],
  ['belgium', 'بلجيكا', 'brussels', 'بروكسل', 'Brussels', 50.8503, 4.3517, 'Europe/Brussels', 185103, 70],
  ['sweden', 'السويد', 'stockholm', 'ستوكهولم', 'Stockholm', 59.3293, 18.0686, 'Europe/Stockholm', 975522, 70],
  ['sweden', 'السويد', 'malmoe', 'مالمو', 'Malmö', 55.6050, 13.0038, 'Europe/Stockholm', 347949, 65],
  ['norway', 'النرويج', 'oslo', 'أوسلو', 'Oslo', 59.9139, 10.7522, 'Europe/Oslo', 1000000, 68],
  ['denmark', 'الدنمارك', 'copenhagen', 'كوبنهاغن', 'Copenhagen', 55.6761, 12.5683, 'Europe/Copenhagen', 794128, 68],
  ['austria', 'النمسا', 'vienna', 'فيينا', 'Vienna', 48.2082, 16.3738, 'Europe/Vienna', 1897000, 68],
  ['switzerland', 'سويسرا', 'zurich', 'زيورخ', 'Zurich', 47.3769, 8.5417, 'Europe/Zurich', 434335, 68],
  ['spain', 'إسبانيا', 'madrid', 'مدريد', 'Madrid', 40.4168, -3.7038, 'Europe/Madrid', 3305408, 70],
  ['spain', 'إسبانيا', 'barcelona', 'برشلونة', 'Barcelona', 41.3851, 2.1734, 'Europe/Madrid', 1620343, 70],
  ['italy', 'إيطاليا', 'rome', 'روما', 'Rome', 41.9028, 12.4964, 'Europe/Rome', 2873494, 70],
  ['italy', 'إيطاليا', 'milan', 'ميلانو', 'Milan', 45.4642, 9.1900, 'Europe/Rome', 1352000, 68],
  // ── USA (extra Muslim cities) ─────────────────────────────────────────────────
  ['usa', 'الولايات المتحدة', 'dallas', 'دالاس', 'Dallas', 32.7767, -96.7970, 'America/Chicago', 1343573, 72],
  ['usa', 'الولايات المتحدة', 'phoenix', 'فينيكس', 'Phoenix', 33.4484, -112.0740, 'America/Phoenix', 1608139, 70],
  ['usa', 'الولايات المتحدة', 'san-antonio', 'سان انطونيو', 'San Antonio', 29.4241, -98.4936, 'America/Chicago', 1434625, 68],
  ['usa', 'الولايات المتحدة', 'philadelphia', 'فيلادلفيا', 'Philadelphia', 39.9526, -75.1652, 'America/New_York', 1584064, 68],
  ['usa', 'الولايات المتحدة', 'san-diego', 'سان دييغو', 'San Diego', 32.7157, -117.1611, 'America/Los_Angeles', 1386932, 65],
  ['usa', 'الولايات المتحدة', 'san-jose', 'سان خوسيه', 'San Jose', 37.3382, -121.8863, 'America/Los_Angeles', 1013240, 65],
  ['usa', 'الولايات المتحدة', 'detroit', 'ديترويت', 'Detroit', 42.3314, -83.0458, 'America/Detroit', 670031, 68],
  ['usa', 'الولايات المتحدة', 'jersey-city', 'جيرسي سيتي', 'Jersey City', 40.7178, -74.0431, 'America/New_York', 292449, 65],
  ['usa', 'الولايات المتحدة', 'paterson', 'باترسون', 'Paterson', 40.9168, -74.1719, 'America/New_York', 159400, 65],
  // ── Canada (extra) ─────────────────────────────────────────────────────────────
  ['canada', 'كندا', 'ottawa', 'أوتاوا', 'Ottawa', 45.4215, -75.6972, 'America/Toronto', 994837, 72],
  ['canada', 'كندا', 'edmonton', 'إدمونتون', 'Edmonton', 53.5461, -113.4938, 'America/Edmonton', 972223, 68],
  ['canada', 'كندا', 'calgary', 'كالغاري', 'Calgary', 51.0447, -114.0719, 'America/Edmonton', 1336000, 68],
  ['canada', 'كندا', 'vancouver', 'فانكوفر', 'Vancouver', 49.2827, -123.1207, 'America/Vancouver', 675218, 70],
  ['canada', 'كندا', 'mississauga', 'ميسيساغا', 'Mississauga', 43.5890, -79.6441, 'America/Toronto', 721599, 68],
  // ── Australia ─────────────────────────────────────────────────────────────────
  ['australia', 'أستراليا', 'sydney', 'سيدني', 'Sydney', -33.8688, 151.2093, 'Australia/Sydney', 5312000, 72],
  ['australia', 'أستراليا', 'melbourne', 'ملبورن', 'Melbourne', -37.8136, 144.9631, 'Australia/Melbourne', 5157000, 72],
  ['australia', 'أستراليا', 'brisbane', 'بريسبن', 'Brisbane', -27.4698, 153.0251, 'Australia/Brisbane', 2560720, 68],
  ['australia', 'أستراليا', 'perth', 'برث', 'Perth', -31.9505, 115.8605, 'Australia/Perth', 2085973, 68],
  // ── South Africa ──────────────────────────────────────────────────────────────
  ['south-africa', 'جنوب أفريقيا', 'cape-town', 'كيب تاون', 'Cape Town', -33.9249, 18.4241, 'Africa/Johannesburg', 4618000, 70],
  ['south-africa', 'جنوب أفريقيا', 'johannesburg', 'جوهانسبرغ', 'Johannesburg', -26.2041, 28.0473, 'Africa/Johannesburg', 9578000, 72],
  ['south-africa', 'جنوب أفريقيا', 'durban', 'ديربان', 'Durban', -29.8587, 31.0218, 'Africa/Johannesburg', 3720000, 68],
  // ── Tanzania ──────────────────────────────────────────────────────────────────
  ['tanzania', 'تنزانيا', 'dar-es-salaam', 'دار السلام', 'Dar es Salaam', -6.7924, 39.2083, 'Africa/Dar_es_Salaam', 4364541, 68],
  ['tanzania', 'تنزانيا', 'zanzibar', 'زنجبار', 'Zanzibar', -6.1630, 39.1988, 'Africa/Dar_es_Salaam', 223033, 65],
  // ── Kenya ─────────────────────────────────────────────────────────────────────
  ['kenya', 'كينيا', 'nairobi', 'نيروبي', 'Nairobi', -1.2921, 36.8219, 'Africa/Nairobi', 4397073, 70],
  ['kenya', 'كينيا', 'mombasa', 'ممباسا', 'Mombasa', -4.0435, 39.6682, 'Africa/Nairobi', 1208333, 65],
  // ── Ethiopia ──────────────────────────────────────────────────────────────────
  ['ethiopia', 'إثيوبيا', 'addis-ababa', 'أديس أبابا', 'Addis Ababa', 9.0320, 38.7469, 'Africa/Addis_Ababa', 5006200, 70],
  ['ethiopia', 'إثيوبيا', 'dire-dawa', 'دير داوا', 'Dire Dawa', 9.5930, 41.8671, 'Africa/Addis_Ababa', 438956, 60],
  ['ethiopia', 'إثيوبيا', 'harar', 'هرر', 'Harar', 9.3130, 42.1189, 'Africa/Addis_Ababa', 99368, 58],
  // ── China (Muslim areas) ──────────────────────────────────────────────────────
  ['china', 'الصين', 'urumqi', 'أورومتشي', 'Urumqi', 43.8256, 87.6168, 'Asia/Shanghai', 3531000, 65],
  ['china', 'الصين', 'kashgar', 'كاشغر', 'Kashgar', 39.4704, 75.9897, 'Asia/Shanghai', 506640, 62],
  // ── Russia (Muslim areas) ─────────────────────────────────────────────────────
  ['russia', 'روسيا', 'moscow', 'موسكو', 'Moscow', 55.7558, 37.6173, 'Europe/Moscow', 12506468, 70],
  ['russia', 'روسيا', 'kazan', 'قازان', 'Kazan', 55.8304, 49.0661, 'Europe/Moscow', 1257391, 68],
  ['russia', 'روسيا', 'grozny', 'غروزني', 'Grozny', 43.3178, 45.6983, 'Europe/Moscow', 308000, 65],
  ['russia', 'روسيا', 'makhachkala', 'ماخاتشكالا', 'Makhachkala', 42.9849, 47.5047, 'Europe/Moscow', 601036, 65],
  ['russia', 'روسيا', 'ufa', 'أوفا', 'Ufa', 54.7388, 55.9721, 'Asia/Yekaterinburg', 1124226, 65],
  // ── Bosnia ────────────────────────────────────────────────────────────────────
  ['bosnia', 'البوسنة', 'sarajevo', 'سراييفو', 'Sarajevo', 43.8486, 18.3564, 'Europe/Sarajevo', 419957, 68],
  // ── Albania ───────────────────────────────────────────────────────────────────
  ['albania', 'ألبانيا', 'tirana', 'تيرانا', 'Tirana', 41.3275, 19.8187, 'Europe/Tirane', 800000, 65],
  // ── Kosovo ────────────────────────────────────────────────────────────────────
  ['kosovo', 'كوسوفو', 'pristina', 'بريشتينا', 'Pristina', 42.6629, 21.1655, 'Europe/Belgrade', 198897, 65],
];

// Convert array rows to objects
const cities = RAW.map(([country_slug, country_name_ar, city_slug, city_name_ar, city_name_en, lat, lon, timezone, population, priority]) => ({
  country_slug, country_name_ar, city_slug, city_name_ar, city_name_en, lat, lon, timezone, population, priority
}));

const BATCH = 50;

async function run() {
  console.log(`\n🌍 Importing ${cities.length} additional cities to Supabase...`);
  let total = 0;

  for (let i = 0; i < cities.length; i += BATCH) {
    const batch = cities.slice(i, i + BATCH);
    const { error } = await sb.from('cities').upsert(batch, { onConflict: 'country_slug,city_slug' });
    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH) + 1} error:`, error.message);
    } else {
      total += batch.length;
      process.stdout.write(`\r✅ Inserted ${total}/${cities.length} cities...`);
    }
    await new Promise(r => setTimeout(r, 100)); // be polite to free tier
  }

  const { count } = await sb.from('cities').select('*', { count: 'exact', head: true });
  console.log(`\n🎉 Done! Total cities in Supabase: ${count}`);
}

run().catch(console.error);
