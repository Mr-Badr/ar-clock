// src/app/date/country/[countrySlug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getPriorityCountrySlugs, getCountryBySlug } from '@/lib/db/queries/countries';
import { getCapitalCity } from '@/lib/db/queries/cities';
import { getCachedNowIso } from '@/lib/date-utils';
import { convertDate, GREGORIAN_MONTH_NAMES_AR, type ConversionMethod } from '@/lib/date-adapter';
import { getFlagEmoji, getSafeTimezone } from '@/lib/country-utils';
import { JsonLd } from '@/components/seo/JsonLd';
import { DateBreadcrumb, buildBreadcrumbJsonLd } from '@/components/date/DateBreadcrumb';
import { DateShareActions } from '@/components/date/DateShareActions';
import RouteUnavailableState from '@/components/shared/RouteUnavailableState';
import AdLayoutWrapper from '@/components/ads/AdLayoutWrapper';
import AdInArticle from '@/components/ads/AdInArticle';
import AdTopBanner from '@/components/ads/AdTopBanner';
import SiteTrustPanel from '@/components/site/SiteTrustPanel';
import { Calendar, Clock, ArrowLeftRight, type LucideIcon } from 'lucide-react';
import styles from '@/app/date/DateRoutePage.module.css';
import {
  GEO_ROUTE_INDEXING_POLICIES,
  isSeoIndexableCountrySlug,
} from '@/lib/seo/country-indexing';
import { getSiteUrl } from '@/lib/site-config';
import { buildDateKeywords } from '@/lib/seo/section-search-intent';
import { ErrorBoundary } from '@/components/ErrorBoundary.client';
import { logger, serializeError } from '@/lib/logger';

const BASE_URL = getSiteUrl();

const GLOBAL_HIJRI_METHOD: ConversionMethod = 'astronomical';

const COUNTRY_HIJRI_METHOD_OVERRIDES: Partial<Record<string, ConversionMethod>> = {
  'SA': 'umalqura',      // Saudi Arabia
  'AE': 'umalqura',      // UAE
  'KW': 'umalqura',      // Kuwait
  'QA': 'umalqura',      // Qatar
  'BH': 'umalqura',      // Bahrain
  'OM': 'umalqura',      // Oman
};

interface RelatedLink {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface CountryDateDecisionRow {
  label: string;
  value: string;
}

interface CountryDateFaqItem {
  question: string;
  answer: string;
}

interface CountryDateSourceLink {
  href: string;
  label: string;
  description: string;
}

interface CountryDateLocalContextSeed {
  audience: string;
  dailyUse: string;
  calendarRisk: string;
  officialReminder: string;
  comparisonCue: string;
}

interface CountryDateLocalContext {
  intro: string;
  timezoneNote: string;
  officialNote: string;
  cards: readonly [
    CountryDateDecisionRow,
    CountryDateDecisionRow,
    CountryDateDecisionRow,
  ];
}

const COUNTRY_DATE_LOCAL_CONTEXT: Partial<Record<string, CountryDateLocalContextSeed>> = {
  egypt: {
    audience: 'للطلاب والموظفين والعائلات التي تنسق مواعيدها بين القاهرة والمحافظات',
    dailyUse: 'استخدمه عند كتابة موعد مدرسة، حجز طبي، اجتماع عمل، أو رسالة عائلية تحتاج اليوم الهجري والميلادي معاً.',
    calendarRisk: 'الالتباس يظهر غالباً عند مشاركة الموعد مع شخص خارج مصر أو عند اقتراب اليوم من منتصف الليل.',
    officialReminder: 'في الإجازات والمناسبات الدينية، راجع إعلان الجهة المصرية المختصة قبل ترتيب سفر أو إجازة رسمية.',
    comparisonCue: 'إذا كان الطرف الآخر في الخليج أو المغرب العربي، افتح الوقت الآن أولاً لأن فرق الساعات قد يغيّر اليوم المحلي.',
  },
  'saudi-arabia': {
    audience: 'لمن يتابع المواعيد داخل السعودية أو يربطها بالتقويم الهجري في العمل والسفر والعمرة',
    dailyUse: 'استخدمه عند ترتيب موعد حكومي، رحلة داخلية، مناسبة عائلية، أو تذكير مرتبط بالهجري.',
    calendarRisk: 'السياق الهجري في السعودية حساس في رمضان والحج والعطلات، لذلك لا تفصل التاريخ عن طريقة الحساب.',
    officialReminder: 'اعتمد الإعلان الرسمي السعودي عند القرارات الدينية أو الحكومية، خصوصاً في بداية الشهور الهجرية المهمة.',
    comparisonCue: 'عند المقارنة مع بلد عربي آخر، انتبه إلى أن تقويم أم القرى قد لا يطابق طريقة الإعلان المحلي هناك.',
  },
  morocco: {
    audience: 'لمن ينسق مواعيد داخل المغرب أو بين المغرب وأوروبا والمغرب العربي',
    dailyUse: 'يفيد في الرسائل اليومية، مواعيد الإدارات، التخطيط العائلي، ومقارنة التاريخ مع بلد يقيم فيه قريب أو عميل.',
    calendarRisk: 'الاختلاف يظهر عند مشاركة التاريخ مع دولة تبدأ يومها قبل المغرب أو تستخدم إعلاناً هجرياً مختلفاً.',
    officialReminder: 'لرمضان والعيد والمناسبات الرسمية في المغرب، راجع البلاغ الرسمي قبل اعتماد يوم نهائي.',
    comparisonCue: 'إذا كان الموعد مع الخليج أو المشرق، راجع الساعة المحلية لأن فرق التوقيت قد يجعل اليوم مختلفاً.',
  },
  algeria: {
    audience: 'للمستخدم الذي يريد تاريخاً واضحاً داخل الجزائر أو عند التنسيق مع تونس والمغرب وفرنسا',
    dailyUse: 'استخدمه في المواعيد الإدارية، الرسائل المهنية، المناسبات العائلية، أو مراجعة اليوم قبل حجز سفر.',
    calendarRisk: 'أكثر لبس يحدث عندما تخلط بين التاريخ المحلي في الجزائر وتاريخ جهاز مضبوط على بلد آخر.',
    officialReminder: 'في العطل والمناسبات الدينية، يبقى إعلان الجهات الجزائرية هو المرجع النهائي.',
    comparisonCue: 'عند تنسيق موعد مع أوروبا أو الخليج، اجمع التاريخ مع الساعة حتى لا ترسل يوماً صحيحاً بوقت خاطئ.',
  },
  'united-arab-emirates': {
    audience: 'للمقيمين والزوار ومن ينسق أعماله بين دبي وأبوظبي وبقية الإمارات',
    dailyUse: 'يفيد عند ترتيب اجتماع، رحلة، موعد مدرسة، أو رسالة عمل تحتاج التاريخ المحلي بالإمارات.',
    calendarRisk: 'الالتباس يظهر مع الفرق بين توقيت الخليج وتوقيت بلد المرسل، خاصة في آخر اليوم وبدايته.',
    officialReminder: 'للعطل الرسمية والمناسبات الدينية، راجع الإعلان المحلي في الإمارات قبل اعتماد الموعد.',
    comparisonCue: 'إذا كان الطرف الآخر في شمال أفريقيا أو أوروبا، افحص الوقت الآن لأن يوم الإمارات قد يكون بدأ قبله.',
  },
  tunisia: {
    audience: 'لمن يتابع المواعيد في تونس أو يقارنها مع المغرب العربي وأوروبا',
    dailyUse: 'استخدمه للمراسلات اليومية، المواعيد المهنية، تنسيق السفر، أو معرفة التاريخ الهجري مع الميلادي بسرعة.',
    calendarRisk: 'الاختلاف غالباً لا يكون في الميلادي بل في قراءة الهجري عند بداية الشهر أو عند اختلاف توقيت الجهاز.',
    officialReminder: 'في المناسبات الرسمية أو الدينية، راجع الإعلان التونسي قبل اتخاذ قرار نهائي.',
    comparisonCue: 'عند المقارنة مع المشرق أو الخليج، لا تعتمد التاريخ وحده؛ اربطه بالساعة المحلية.',
  },
  libya: {
    audience: 'لمن يحتاج تاريخ اليوم داخل ليبيا مع صيغة واضحة تصلح للرسائل والمواعيد',
    dailyUse: 'يفيد في ترتيب مواعيد عائلية، سفر داخلي، عمل، أو متابعة مناسبة مرتبطة بالهجري.',
    calendarRisk: 'قد يظهر اللبس عندما يكون جهازك على توقيت بلد آخر أو عند مشاركة الموعد مع غرب أفريقيا أو الخليج.',
    officialReminder: 'للمواعيد الرسمية والدينية، استخدم هذه الصفحة كمرجع سريع ثم راجع الإعلان المحلي في ليبيا.',
    comparisonCue: 'إذا كان الموعد مع مصر أو تونس أو الخليج، راجع الوقت الآن لتتأكد أن اليوم نفسه هو المقصود.',
  },
  sudan: {
    audience: 'لمن ينسق مواعيد داخل السودان أو مع أسر وأعمال خارج البلاد',
    dailyUse: 'استخدمه لمشاركة تاريخ اليوم، ترتيب اتصال، متابعة موعد سفر، أو كتابة تذكير بصيغتين واضحتين.',
    calendarRisk: 'أكثر خطأ شائع هو الاعتماد على تاريخ جهاز مضبوط على بلد إقامة مختلف عن السودان.',
    officialReminder: 'للمواعيد الرسمية أو الدينية، راجع المصدر المحلي قبل الاعتماد النهائي.',
    comparisonCue: 'عند تنسيق اتصال مع الخليج أو أوروبا، اقرأ التاريخ مع الساعة لا كرقم منفصل.',
  },
  iraq: {
    audience: 'لمن يريد تاريخ اليوم في العراق بصيغة مناسبة للعمل والعائلة والمناسبات',
    dailyUse: 'يفيد في الرسائل، المواعيد، السفر، ومتابعة التاريخ الهجري إلى جانب الميلادي دون فتح أكثر من أداة.',
    calendarRisk: 'الاختلاف قد يظهر عند أول الشهر الهجري أو عند مقارنة بغداد بدولة في منطقة زمنية بعيدة.',
    officialReminder: 'في المناسبات الدينية والعطل الرسمية، راجع إعلان الجهة المحلية داخل العراق.',
    comparisonCue: 'إذا كان الموعد مع الخليج أو بلاد الشام أو أوروبا، ابدأ بالوقت الآن ثم شارك التاريخ.',
  },
  jordan: {
    audience: 'لمن يرتب مواعيده في الأردن أو ينسقها مع فلسطين والخليج وأوروبا',
    dailyUse: 'استخدمه للمدرسة، العمل، المواعيد العائلية، والسفر عندما تحتاج التاريخ الهجري والميلادي معاً.',
    calendarRisk: 'الالتباس يظهر عند مشاركة الموعد عبر منطقة زمنية مختلفة أو عند بداية شهر هجري جديد.',
    officialReminder: 'للعطل والمناسبات الدينية، اعتمد الإعلان الأردني الرسمي قبل تثبيت الموعد.',
    comparisonCue: 'عند التنسيق مع بلد غرب الأردن أو شرقه، افحص الساعة الحالية حتى لا يسبقك اليوم أو يتأخر.',
  },
  syria: {
    audience: 'لمن يتابع تاريخ اليوم في سوريا أو ينسق مع أهل وأعمال خارج البلاد',
    dailyUse: 'يفيد في الرسائل اليومية، المواعيد العائلية، متابعة مناسبة، أو مقارنة اليوم مع بلد إقامة آخر.',
    calendarRisk: 'قد يختلف فهم اليوم إذا كان جهازك مضبوطاً على أوروبا أو الخليج بينما الموعد مرتبط بسوريا.',
    officialReminder: 'في المناسبات الرسمية والدينية، راجع الإعلان المحلي قبل الاعتماد النهائي.',
    comparisonCue: 'اجمع التاريخ مع الوقت الآن عند مقارنة سوريا ببلد بعيد زمنياً.',
  },
  lebanon: {
    audience: 'لمن ينسق مواعيده داخل لبنان أو بين لبنان والمهجر',
    dailyUse: 'استخدمه عند إرسال موعد عائلي، حجز، تذكير عمل، أو مقارنة التاريخ بين بيروت ومدينة أخرى.',
    calendarRisk: 'الالتباس يظهر عندما يقرأ الشخص التاريخ من بلد إقامة مختلف أو قرب منتصف الليل.',
    officialReminder: 'للعطل والمناسبات الدينية، راجع الإعلان المحلي أو جهة الموعد قبل الاعتماد.',
    comparisonCue: 'إذا كان الطرف الآخر في الأمريكتين أو الخليج، أرفق التاريخ بالساعة المحلية في لبنان.',
  },
  yemen: {
    audience: 'لمن يريد تاريخ اليوم في اليمن بصيغة سهلة للمراسلات والمواعيد',
    dailyUse: 'يفيد في مشاركة اليوم، ترتيب اتصال، متابعة مناسبة عائلية، أو ربط الهجري بالميلادي بسرعة.',
    calendarRisk: 'قد يظهر فرق يوم عند بداية الشهر الهجري أو عندما يكون جهازك مضبوطاً على بلد آخر.',
    officialReminder: 'للمناسبات الدينية أو القرارات الرسمية، راجع الإعلان المحلي قبل تثبيت التاريخ.',
    comparisonCue: 'عند التنسيق مع الخليج أو أفريقيا، افتح الوقت الآن لتتأكد من بداية اليوم محلياً.',
  },
  kuwait: {
    audience: 'للمقيمين والزوار ومن ينسق العمل والمواعيد داخل الكويت',
    dailyUse: 'استخدمه لمواعيد الدوام، المدارس، السفر، أو الرسائل التي تحتاج الهجري والميلادي معاً.',
    calendarRisk: 'الالتباس يظهر مع دول تختلف في بداية اليوم أو في طريقة إعلان الشهر الهجري.',
    officialReminder: 'للعطل الرسمية والمناسبات الدينية، راجع إعلان الكويت الرسمي قبل الاعتماد النهائي.',
    comparisonCue: 'إذا كان الموعد مع المغرب العربي أو أوروبا، راجع فرق الوقت قبل إرسال التاريخ.',
  },
  qatar: {
    audience: 'لمن يتابع تاريخ اليوم في قطر أو ينسق مواعيده مع الخليج وباقي الدول',
    dailyUse: 'يفيد في الاجتماعات، السفر، المواعيد العائلية، والرسائل اليومية التي تحتاج التاريخين.',
    calendarRisk: 'قد يختلف الفهم إذا كان الطرف الآخر في منطقة زمنية لا يبدأ يومها مع قطر.',
    officialReminder: 'للمناسبات الرسمية والدينية، راجع الإعلان المحلي في قطر قبل اتخاذ قرار نهائي.',
    comparisonCue: 'أرفق الساعة مع التاريخ عند التنسيق مع أوروبا أو شمال أفريقيا.',
  },
  bahrain: {
    audience: 'لمن يحتاج تاريخ اليوم في البحرين بصيغة عملية وسريعة',
    dailyUse: 'استخدمه لمواعيد العمل، المدرسة، السفر، أو الرسائل العائلية التي تجمع الهجري والميلادي.',
    calendarRisk: 'الاختلاف يظهر غالباً قرب بداية الشهر الهجري أو عند مقارنة البحرين ببلد بعيد زمنياً.',
    officialReminder: 'للعطل والمناسبات الدينية، راجع الإعلان المحلي قبل اعتماد الموعد.',
    comparisonCue: 'إذا كان الطرف الآخر خارج الخليج، ابدأ من الوقت الآن ثم شارك التاريخ.',
  },
  oman: {
    audience: 'لمن ينسق مواعيده داخل سلطنة عمان أو مع دول الخليج والهند وشرق أفريقيا',
    dailyUse: 'يفيد في السفر، العمل، المواعيد العائلية، ومتابعة اليوم الهجري والميلادي في صفحة واحدة.',
    calendarRisk: 'الالتباس يظهر عندما تقارن عمان بمنطقة زمنية مختلفة أو عند بداية شهر هجري.',
    officialReminder: 'في القرارات الدينية والرسمية، اعتمد إعلان الجهات العمانية المختصة.',
    comparisonCue: 'عند التنسيق مع شمال أفريقيا أو أوروبا، راجع الوقت الحالي لأن اليوم قد لا يكون متطابقاً.',
  },
  somalia: {
    audience: 'لمن يتابع التاريخ في الصومال أو ينسق مع شرق أفريقيا والخليج',
    dailyUse: 'استخدمه لمشاركة موعد، ترتيب اتصال، متابعة مناسبة، أو كتابة تاريخ واضح بالهجري والميلادي.',
    calendarRisk: 'قد يظهر لبس عند مشاركة التاريخ مع بلد يسبق الصومال أو يتأخر عنها في بداية اليوم.',
    officialReminder: 'للمناسبات الدينية أو الرسمية، راجع الإعلان المحلي قبل الاعتماد النهائي.',
    comparisonCue: 'إذا كان الموعد مع الخليج أو أوروبا، اجمع التاريخ مع الساعة المحلية.',
  },
  djibouti: {
    audience: 'لمن يريد تاريخ اليوم في جيبوتي مع ربط واضح بين الهجري والميلادي',
    dailyUse: 'يفيد في المواعيد اليومية، السفر، الاتصالات، ومشاركة التاريخ مع العائلة أو العمل.',
    calendarRisk: 'الاختلاف يظهر عند مقارنة جيبوتي بدولة في منطقة زمنية بعيدة أو عند أول الشهر الهجري.',
    officialReminder: 'للمناسبات الرسمية والدينية، راجع الجهة المحلية قبل تثبيت الموعد.',
    comparisonCue: 'عند التنسيق مع شرق أفريقيا أو الخليج، افحص الوقت الآن بجانب التاريخ.',
  },
  mauritania: {
    audience: 'لمن يتابع التاريخ في موريتانيا أو ينسق مع المغرب العربي وغرب أفريقيا',
    dailyUse: 'استخدمه في الرسائل، المواعيد العائلية، التخطيط للسفر، أو معرفة الهجري والميلادي بسرعة.',
    calendarRisk: 'اللبس يظهر عند مشاركة التاريخ مع دول تبدأ يومها قبل موريتانيا بساعات.',
    officialReminder: 'لرمضان والعيد والعطل الرسمية، راجع الإعلان المحلي في موريتانيا.',
    comparisonCue: 'إذا كان الموعد مع الخليج أو المشرق، انتبه إلى فرق الوقت الكبير نسبياً.',
  },
  comoros: {
    audience: 'لمن يحتاج تاريخ اليوم في جزر القمر أو ينسق مع شرق أفريقيا والخليج',
    dailyUse: 'يفيد في المراسلات، السفر، المناسبات، ومقارنة اليوم الهجري والميلادي بسرعة.',
    calendarRisk: 'قد يتغير فهم اليوم عند مشاركة الموعد مع بلد بعيد زمنياً أو عند بداية الشهر الهجري.',
    officialReminder: 'للمناسبات الرسمية والدينية، راجع الإعلان المحلي قبل الاعتماد النهائي.',
    comparisonCue: 'أرفق الساعة المحلية عندما يكون الطرف الآخر خارج شرق أفريقيا.',
  },
  turkey: {
    audience: 'للمقيمين العرب في تركيا أو من ينسق مواعيده بين تركيا وبلد عربي',
    dailyUse: 'استخدمه عند ترتيب موعد دراسة، إقامة، سفر، أو رسالة عائلية تحتاج تاريخ اليوم في تركيا.',
    calendarRisk: 'الخلط يظهر عندما يستخدم الشخص تاريخ بلده الأصلي بينما الموعد مرتبط بتوقيت تركيا.',
    officialReminder: 'للمعاملات الرسمية التركية، اعتمد التاريخ الميلادي والوثيقة الرسمية أولاً.',
    comparisonCue: 'عند التواصل مع الخليج أو المغرب العربي، راجع الساعة لأن فرق التوقيت يغير بداية اليوم.',
  },
  'united-states': {
    audience: 'للعرب في الولايات المتحدة أو من ينسق معهم من بلد عربي',
    dailyUse: 'استخدمه عند إرسال موعد عائلي، متابعة دراسة أو عمل، أو مقارنة اليوم بين أمريكا وبلدك.',
    calendarRisk: 'الولايات المتحدة تضم مناطق زمنية متعددة، لذلك قد لا يكفي اسم الدولة وحده عند الموعد الدقيق.',
    officialReminder: 'للمعاملات الرسمية، اعتمد الولاية والمدينة والوثيقة المطلوبة قبل تثبيت الموعد.',
    comparisonCue: 'أرفق المدينة أو الولاية مع التاريخ والساعة عندما يكون الطرف الآخر خارج أمريكا.',
  },
  'united-kingdom': {
    audience: 'للعرب في بريطانيا أو من ينسق مواعيده بين لندن وبلد عربي',
    dailyUse: 'يفيد في الدراسة، العمل، السفر، والرسائل العائلية التي تحتاج تاريخ اليوم في بريطانيا.',
    calendarRisk: 'الالتباس يظهر عندما تقارن بريطانيا بالخليج أو شمال أفريقيا قرب منتصف الليل.',
    officialReminder: 'للمعاملات الرسمية، استخدم التاريخ الميلادي كما في الوثيقة البريطانية المطلوبة.',
    comparisonCue: 'عند التنسيق مع بلد عربي، أرفق الوقت الحالي في بريطانيا مع التاريخ.',
  },
};

const COUNTRY_DATE_SOURCE_LINKS: readonly CountryDateSourceLink[] = [
  {
    href: 'https://www.iana.org/time-zones',
    label: 'IANA Time Zone Database',
    description: 'مرجع المناطق الزمنية وتغيرات التوقيت المحلي التي تؤثر في بداية اليوم بين الدول.',
  },
  {
    href: 'https://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types',
    label: 'Unicode CLDR: أنواع التقويم الإسلامي',
    description: 'مرجع تقني يوضح اختلاف أم القرى، المدني، والحسابات الإسلامية الأخرى.',
  },
  {
    href: 'https://www.ummulqura.org.sa/Index.aspx',
    label: 'تقويم أم القرى',
    description: 'مرجع سعودي للتقويم الهجري وأدوات التحويل والصلاة، ويهم خصوصاً دول الخليج والسعودية.',
  },
  {
    href: 'https://www.britannica.com/topic/Gregorian-calendar',
    label: 'Britannica: التقويم الميلادي',
    description: 'خلفية موثوقة عن التقويم الميلادي الشمسي المستخدم في أغلب المعاملات المدنية.',
  },
];

function getHijriMethodNameAr(method: ConversionMethod): string {
  if (method === 'umalqura') return 'تقويم أم القرى';
  if (method === 'civil') return 'التقويم المدني';
  return 'الحساب الفلكي';
}

function resolveCountryHijriMethod(countryCode: string) {
  const normalizedCode = String(countryCode || '').toUpperCase();
  const method = COUNTRY_HIJRI_METHOD_OVERRIDES[normalizedCode] ?? GLOBAL_HIJRI_METHOD;
  const isGlobalDefault = !COUNTRY_HIJRI_METHOD_OVERRIDES[normalizedCode];
  const methodNameAr = getHijriMethodNameAr(method);

  const methodNoteAr = isGlobalDefault
    ? 'للدول التي لا يتوفر لها تخصيص محلي في قاعدة البيانات، نستخدم الحساب الفلكي كإعداد افتراضي عالمي.'
    : method === 'umalqura'
      ? 'تم اختيار هذه الطريقة لأنها الأقرب للاستخدام الرسمي في هذا البلد.'
      : 'تم اختيار هذه الطريقة لأنها الأقرب للاستخدام الشائع في هذا البلد.';

  return {
    method,
    methodNameAr,
    methodNoteAr,
    isGlobalDefault,
  };
}

function buildCountryDateLocalContext(args: {
  countrySlug: string;
  countryNameAr: string;
  timezone: string;
  methodNameAr: string;
  isGlobalDefault: boolean;
  capitalNameAr: string | null;
}): CountryDateLocalContext {
  const seed = COUNTRY_DATE_LOCAL_CONTEXT[args.countrySlug];
  const timezonePlace = args.capitalNameAr
    ? `تُقرأ الصفحة على توقيت ${args.capitalNameAr} عندما تتوفر بيانات العاصمة، ثم تعرض المنطقة الزمنية ${args.timezone} حتى تعرف المرجع بدقة.`
    : `تُقرأ الصفحة على المنطقة الزمنية ${args.timezone} لأنها المرجع المتاح لتاريخ اليوم في ${args.countryNameAr}.`;
  const methodFit = args.isGlobalDefault
    ? `الهجري هنا محسوب بطريقة ${args.methodNameAr} كمرجع عملي سريع، لذلك يبقى الإعلان المحلي مهماً عند أول الشهر وآخره.`
    : `الهجري هنا يستخدم ${args.methodNameAr} لأنه أقرب للمنهج المناسب لهذه الدولة في قاعدة ميقاتنا.`;

  if (!seed) {
    return {
      intro: `هذه الصفحة مناسبة عندما تريد تاريخ اليوم في ${args.countryNameAr} بصيغة مفهومة قبل مشاركة موعد أو مقارنة يومك بدولة أخرى.`,
      timezoneNote: timezonePlace,
      officialNote: `${methodFit} للمعاملات الرسمية أو المواعيد الحساسة، راجع الجهة المختصة داخل ${args.countryNameAr}.`,
      cards: [
        {
          label: 'الاستخدام اليومي',
          value: `شارك التاريخين معاً عندما يكون الموعد مرتبطاً بـ ${args.countryNameAr} لا بتوقيت جهازك الحالي.`,
        },
        {
          label: 'الموعد الرسمي',
          value: `استخدم الصفحة للفهم السريع، ثم راجع المصدر المحلي في ${args.countryNameAr} قبل قرار قانوني أو ديني.`,
        },
        {
          label: 'المقارنة الدولية',
          value: `افتح الوقت الان بجانب التاريخ إذا كان الطرف الآخر في منطقة زمنية مختلفة عن ${args.countryNameAr}.`,
        },
      ],
    };
  }

  return {
    intro: `${seed.audience}، تعرض هذه الصفحة تاريخ اليوم في ${args.countryNameAr} بطريقة تصلح للاستخدام العملي لا كمعلومة مجردة.`,
    timezoneNote: `${timezonePlace} ${seed.dailyUse} ${seed.calendarRisk}`,
    officialNote: `${methodFit} ${seed.officialReminder}`,
    cards: [
      {
        label: 'الاستخدام الأنسب',
        value: seed.dailyUse,
      },
      {
        label: 'نقطة انتباه محلية',
        value: seed.calendarRisk,
      },
      {
        label: 'قبل المقارنة',
        value: seed.comparisonCue,
      },
    ],
  };
}
 
function buildCountryDateDecisionRows(
  countryNameAr: string,
  methodNameAr: string,
  localContext: CountryDateLocalContext,
): CountryDateDecisionRow[] {
  return [
    {
      label: 'تريد مشاركة التاريخ اليوم',
      value: localContext.cards[0].value,
    },
    {
      label: 'الموعد قريب من منتصف الليل',
      value: 'افتح صفحة الوقت الان أولاً، لأن فرق ساعة أو ساعتين قد يعني أن اليوم المحلي لم يبدأ بعد في بلد المقارنة.',
    },
    {
      label: 'الموعد ديني أو حكومي',
      value: `استخدم ${methodNameAr} للفهم السريع. ${localContext.officialNote}`,
    },
    {
      label: 'لديك تاريخ قديم أو تاريخ ميلاد',
      value: 'استخدم محول التاريخ بدلاً من صفحة اليوم، ثم احتفظ بالتاريخ الأصلي كما ورد في الوثيقة.',
    },
  ];
}

function buildCountryDateFaqItems(
  countryNameAr: string,
  methodNameAr: string,
  timezone: string,
  hijriFormatted: string,
  gregorianFormatted: string,
  localContext: CountryDateLocalContext,
): CountryDateFaqItem[] {
  return [
    {
      question: `كم التاريخ الهجري اليوم في ${countryNameAr}؟`,
      answer: `التاريخ الهجري اليوم في ${countryNameAr} هو ${hijriFormatted} حسب ${methodNameAr}. اقرأ النتيجة مع التاريخ الميلادي لأن بعض النماذج والرسائل تحتاج الصيغتين معاً.`,
    },
    {
      question: `كم التاريخ الميلادي اليوم في ${countryNameAr}؟`,
      answer: `التاريخ الميلادي اليوم في ${countryNameAr} هو ${gregorianFormatted}م حسب اليوم المحلي للمنطقة الزمنية ${timezone}.`,
    },
    {
      question: `هل التاريخ في ${countryNameAr} يطابق تاريخ جهازي؟`,
      answer: `ليس دائماً. إذا كان جهازك مضبوطاً على منطقة زمنية مختلفة، فقد ترى يوماً مختلفاً عند منتصف الليل أو قبل الفجر. لذلك تعرض هذه الصفحة التاريخ وفق سياق ${countryNameAr}.`,
    },
    {
      question: `لماذا قد يختلف التاريخ الهجري في ${countryNameAr} عن بلد آخر؟`,
      answer: 'قد يظهر فرق يوم واحد بسبب إعلان بداية الشهر، أو طريقة الحساب، أو اختلاف المنطقة الزمنية. هذا شائع قرب أول الشهر وآخره، خصوصاً في رمضان وشوال وذي الحجة.',
    },
    {
      question: `هل أستطيع اعتماد هذه النتيجة للمعاملات الرسمية في ${countryNameAr}؟`,
      answer: 'استخدمها كمرجع سريع ومفيد، لكن المعاملات القانونية أو الحكومية أو المواعيد الدينية الحساسة تحتاج دائماً مراجعة الجهة المختصة أو الوثيقة الرسمية.',
    },
    {
      question: `ما أهم تنبيه عند استخدام تاريخ اليوم في ${countryNameAr}؟`,
      answer: `${localContext.timezoneNote} ${localContext.officialNote}`,
    },
  ];
}

const links = (countrySlug: string, countryNameAr: string): RelatedLink[] => [
  {
    href: '/date',
    label: 'صفحة التاريخ الرئيسية',
    description: 'عرض التاريخ الهجري والميلادي',
    icon: Calendar,
  },
  {
    href: `/time-now/${countrySlug}`,
    label: `الوقت الان في ${countryNameAr}`,
    description: 'الساعة الحالية وفق التوقيت المحلي',
    icon: Clock,
  },
  {
    href: '/date/converter',
    label: 'تحويل تاريخ آخر',
    description: 'أداة تحويل التواريخ الهجرية والميلادية',
    icon: ArrowLeftRight,
  },
];

export async function generateStaticParams() {
  const slugs = await getPriorityCountrySlugs(24);
  return slugs.map(slug => ({ countrySlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}): Promise<Metadata> {
  const { countrySlug } = await params;
  try {
    const country = await getCountryBySlug(countrySlug);
    if (!country) return { title: 'التاريخ الهجري' };

    const countryAr = country.name_ar;
    const policy = GEO_ROUTE_INDEXING_POLICIES.dateCountry;
    const isIndexableCountry = isSeoIndexableCountrySlug(countrySlug, {
      scope: policy.countryScope,
    });
    return {
      title: `التاريخ اليوم في ${countryAr} | هجري وميلادي حسب الدولة`,
      description: `اعرف التاريخ الهجري والميلادي اليوم في ${countryAr} حسب التوقيت المحلي، وافهم طريقة الحساب ومتى تراجع الوقت أو المحول أو الجهة الرسمية.`,
      keywords: [
        ...buildDateKeywords({ countryNameAr: countryAr }),
        `التاريخ اليوم في ${countryAr}`,
        `كم التاريخ اليوم في ${countryAr}`,
        `التاريخ المحلي في ${countryAr}`,
        `التاريخ حسب الدولة ${countryAr}`,
      ],
      alternates: { canonical: `${BASE_URL}/date/country/${countrySlug}` },
      robots: {
        index: isIndexableCountry,
        follow: true,
        googleBot: {
          index: isIndexableCountry,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
        },
      },
      openGraph: {
        title: `التاريخ اليوم في ${countryAr} | هجري وميلادي`,
        description: `اقرأ التاريخ المحلي في ${countryAr} بصيغتيه الهجرية والميلادية مع روابط الوقت والتحويل والصلاة.`,
        url: `${BASE_URL}/date/country/${countrySlug}`,
        locale: 'ar_SA',
      },
      twitter: {
        card: 'summary_large_image',
        title: `التاريخ اليوم في ${countryAr} | ميقاتنا`,
        description: `تاريخ اليوم في ${countryAr} حسب التوقيت المحلي مع الهجري والميلادي في صفحة واحدة.`,
      },
    };
  } catch (error) {
    logger.error('date-country-metadata-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
    return {
      title: 'التاريخ اليوم حسب الدولة',
      description: 'اعرف التاريخ الهجري والميلادي حسب الدولة مع الوقت الان والتحويل والتقويم من صفحات ميقاتنا.',
      alternates: { canonical: `${BASE_URL}/date/country/${countrySlug}` },
    };
  }
}

export default async function CountryDatePage({
  params,
}: {
  params: Promise<{ countrySlug: string }>;
}) {
  const { countrySlug } = await params;
  let countryRaw;
  let countryLookupFailed = false;
  try {
    countryRaw = await getCountryBySlug(countrySlug);
  } catch (error) {
    countryLookupFailed = true;
    logger.error('date-country-page-data-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      error: serializeError(error),
    });
  }
  if (countryLookupFailed) {
    return (
      <RouteUnavailableState
        eyebrow="تعذر الوصول إلى بيانات الدولة الآن"
        title="صفحة التاريخ حسب الدولة متوقفة مؤقتاً"
        description="تعذر تحميل بيانات الدولة في هذه اللحظة، لذلك أظهرنا لك بديلاً واضحاً يمنع تحوّل الصفحة إلى 5xx أو صفحة فارغة، مع إبقاء المسارات الأساسية متاحة."
        primaryLink={{
          href: '/date',
          label: 'افتح قسم التاريخ',
          description: 'انتقل إلى صفحة التاريخ الرئيسية ثم اختر أداة أو دولة أخرى من المسارات المتاحة.',
        }}
        secondaryLinks={[
          {
            href: '/date/calendar',
            label: 'افتح التقويم الميلادي',
            description: 'راجع التقويم السنوي ومسارات الأيام من صفحة التقويم الرئيسية.',
          },
          {
            href: '/date/converter',
            label: 'افتح محوّل التاريخ',
            description: 'استخدم تحويل التاريخ مباشرة إذا كان هدفك الوصول إلى تاريخ محدد.',
          },
          {
            href: '/fahras',
            label: 'استكشف الصفحات',
            description: 'استخدم فهرس الصفحات للوصول السريع إلى أقرب مسار يفيدك الآن.',
          },
        ]}
      />
    );
  }
  if (!countryRaw) notFound();
  const country = countryRaw as NonNullable<typeof countryRaw>;

  let capital = null;
  try {
    capital = await getCapitalCity(country.country_code);
  } catch (error) {
    logger.warn('date-country-capital-lookup-failed', {
      route: `/date/country/${countrySlug}`,
      countrySlug,
      countryCode: country.country_code,
      error: serializeError(error),
    });
  }
  const _tzRaw = capital?.timezone ?? (country.timezone ? getSafeTimezone(country.timezone) : undefined);
  const timezone = _tzRaw ?? 'UTC';

  // Get current local date in that country's timezone
  const nowIso = await getCachedNowIso();
  let localDateIso = nowIso.split('T')[0];
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
    const parts = formatter.formatToParts(new Date(nowIso));
    const y = parts.find(p => p.type === 'year')?.value;
    const m = parts.find(p => p.type === 'month')?.value;
    const d = parts.find(p => p.type === 'day')?.value;
    if (y && m && d) localDateIso = `${y}-${m}-${d}`;
  } catch (error) {
    logger.warn('date-country-local-date-format-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      timezone,
      error: serializeError(error),
    });
  }

  const { method, methodNameAr, methodNoteAr, isGlobalDefault } = resolveCountryHijriMethod(country.country_code);

  let hijri;
  try {
    hijri = convertDate({ date: localDateIso, toCalendar: 'hijri', method });
  } catch (error) {
    logger.error('date-country-hijri-conversion-failed', {
      routePath: `/date/country/${countrySlug}`,
      countrySlug,
      localDateIso,
      method,
      error: serializeError(error),
    });
    notFound();
  }

  // Build Gregorian info manually from localDateIso to avoid convertDate range errors
  const [gy, gm, gd] = localDateIso.split('-').map(Number);
  const gregorian = {
    day: gd,
    month: gm,
    year: gy,
    monthNameAr: GREGORIAN_MONTH_NAMES_AR[gm - 1],
    formatted: {
      ar: `${gd} ${GREGORIAN_MONTH_NAMES_AR[gm - 1]} ${gy}`,
      iso: localDateIso
    }
  };

  const breadcrumb = [
    { label: 'الرئيسية', href: '/' },
    { label: 'التاريخ', href: '/date' },
    { label: `التاريخ في ${country.name_ar}` },
  ];

  const localContext = buildCountryDateLocalContext({
    countrySlug,
    countryNameAr: country.name_ar,
    timezone,
    methodNameAr,
    isGlobalDefault,
    capitalNameAr: capital?.name_ar ?? null,
  });
  const decisionRows = buildCountryDateDecisionRows(country.name_ar, methodNameAr, localContext);
  const faqItems = buildCountryDateFaqItems(
    country.name_ar,
    methodNameAr,
    timezone,
    hijri.formatted.ar,
    gregorian.formatted.ar,
    localContext,
  );
  const breadcrumbSchema = buildBreadcrumbJsonLd(breadcrumb, BASE_URL);
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `التاريخ اليوم في ${country.name_ar}`,
    url: `${BASE_URL}/date/country/${countrySlug}`,
    inLanguage: 'ar',
    dateModified: nowIso,
    description: `التاريخ الهجري اليوم في ${country.name_ar} هو ${hijri.formatted.ar}، ويوافق ${gregorian.formatted.ar}م حسب ${timezone}.`,
    about: ['تاريخ اليوم', 'التاريخ الهجري', 'التاريخ الميلادي', country.name_ar, methodNameAr],
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const flag = getFlagEmoji(country.country_code);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, webPageSchema, faqSchema]} />
      <AdLayoutWrapper>
        <main className="content-col pt-24 pb-20 mt-12">
          <DateBreadcrumb items={breadcrumb} />

          <section className="date-hero-panel mb-6">
            <div className="date-hero-main">
              <p className="date-kicker m-0">
                <span aria-hidden="true">{flag}</span> تاريخ محلي حسب الدولة
              </p>
              <h1 className="date-hero-title">
                التاريخ اليوم في <span className="text-accent">{country.name_ar}</span>
              </h1>
              <p className="date-hero-copy">
                التاريخ الهجري اليوم في {country.name_ar} هو {hijri.formatted.ar}، ويوافق {gregorian.formatted.ar}م
                حسب المنطقة الزمنية <span dir="ltr">{timezone}</span>. اقرأ التاريخين معاً قبل المشاركة، لأن فرق التوقيت
                أو طريقة اعتماد بداية الشهر قد يغيّران فهم الموعد.
              </p>
            </div>
            <aside className="date-hero-rail" aria-label={`ملخص التاريخ اليوم في ${country.name_ar}`}>
              <p className="date-hero-answer">{hijri.formatted.ar}</p>
              <p className="date-hero-note">
                يوافق {gregorian.formatted.ar}م، يوم {hijri.dayNameAr}. طريقة الحساب: {methodNameAr}.
              </p>
              <div className="date-hero-actions">
                <Link href={`/time-now/${countrySlug}`} className="date-hero-link date-hero-link--primary">
                  الوقت الان في {country.name_ar}
                </Link>
                <Link href="/date/converter" className="date-hero-link">
                  تحويل تاريخ آخر
                </Link>
              </div>
            </aside>
          </section>

          <AdTopBanner slotId={`top-date-country-${countrySlug}`} slotKey="topDateBanner" />

          <section className="date-detail-panel mb-8" aria-label="مشاركة تاريخ اليوم في الدولة">
              <ErrorBoundary name="DateCountryShareActions">
                <DateShareActions
                  hijriFormatted={hijri.formatted.ar}
                  gregorianFormatted={`${gregorian.day} ${gregorian.monthNameAr} ${gregorian.year}`}
                  hijriIso={hijri.formatted.iso}
                  gregorianIso={gregorian.formatted.iso}
                  pageUrl={`${BASE_URL}/date/country/${countrySlug}`}
                />
              </ErrorBoundary>
          </section>

          <section className={styles.sectionPanel} aria-labelledby="country-date-method">
            <div className={styles.sectionHead}>
              <h2 id="country-date-method" className={styles.sectionTitle}>
                كيف حُسب تاريخ اليوم؟
              </h2>
              <p className={styles.sectionCopy}>
                بدأنا من التاريخ المحلي <span dir="ltr">{localDateIso}</span> في المنطقة الزمنية <span dir="ltr">{timezone}</span>،
                ثم حوّلناه إلى هجري باستخدام {methodNameAr}. {methodNoteAr}
                {!isGlobalDefault ? ' قد تختلف رؤية الهلال في بعض الدول المجاورة أو عند أول الشهر.' : ' قد تختلف النتائج عن التقاويم المحلية إذا اعتمدت الدولة إعلاناً رسمياً مختلفاً.'}
              </p>
            </div>
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="country-date-local-context">
            <h2 id="country-date-local-context" className="date-section-title">
              متى يفيدك هذا التاريخ في {country.name_ar}؟
            </h2>
            <div className={styles.proseBody}>
              <p>{localContext.intro}</p>
              <p>{localContext.timezoneNote}</p>
              <p>{localContext.officialNote}</p>
            </div>
            <div className={styles.methodGrid}>
              {localContext.cards.map((card) => (
                <article key={card.label} className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>{card.label}</h3>
                  <p className={styles.cardBody}>{card.value}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="date-detail-panel mb-8" aria-labelledby="country-date-decision">
            <h2 id="country-date-decision" className="date-section-title">
              قبل أن تعتمد التاريخ في {country.name_ar}
            </h2>
            <div className="date-detail-list">
              {decisionRows.map((row) => (
                <div key={row.label} className="date-detail-row">
                  <span className="date-detail-label">{row.label}</span>
                  <span className="date-detail-value">{row.value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.prosePanel} aria-labelledby="country-date-reading">
            <div className={styles.sectionHead}>
              <h2 id="country-date-reading" className={styles.sectionTitle}>
                كيف تقرأ التاريخ اليوم في {country.name_ar}؟
              </h2>
              <p className={styles.sectionCopy}>
                هذه الملاحظات تساعدك على استخدام النتيجة في المواعيد، الرسائل، والمقارنات
                بين الدول دون الخلط بين اليوم المحلي وتوقيت جهازك.
              </p>
            </div>
            <div className={styles.proseBody}>
              <p>
                فكر في التاريخ كأنه بطاقة لها وجهان: وجه ميلادي تستخدمه أغلب التطبيقات والحجوزات، ووجه هجري تحتاجه
                للمناسبات الدينية والعائلية وبعض السياقات الرسمية. في {country.name_ar}، تعرض هذه الصفحة الوجهين معاً
                حتى لا تختار صيغة واحدة وتنسى أن الطرف الآخر قد يقرأ التاريخ بطريقة مختلفة.
              </p>
              <p>
                الصفحة لا تعتمد على توقيت جهازك فقط؛ بل تقرأ اليوم المحلي في {country.name_ar}. هذا مهم عند متابعة بداية
                اليوم في دولة أخرى، أو عند تنسيق موعد عائلي أو عملي أو مناسبة مرتبطة بالتاريخ الهجري. إذا كنت تقارن
                بين بلدين، فابدأ من الوقت الان ثم عد إلى صفحة التاريخ حتى تفهم هل تغيّر اليوم محلياً أم لا.
              </p>
              <p>
                التاريخ الهجري قد يختلف يوماً واحداً بين الدول إذا اعتمدت جهة رسمية رؤية محلية للهلال أو إعلاناً خاصاً
                ببداية الشهر. لذلك نعرض طريقة الحساب المستخدمة بوضوح، ونربط الصفحة بمحوّل التاريخ والتقويم حتى تستطيع
                مراجعة تاريخ آخر أو فتح سنة كاملة عند الحاجة.
              </p>
              <p>
                عند استخدام الصفحة لتنسيق موعد بين بلدك و{country.name_ar}، لا تنظر إلى التاريخ منفصلاً عن الساعة.
                قد يكون يومك المحلي بدأ فعلاً بينما ما زالت الدولة الأخرى في اليوم السابق، أو العكس. لهذا تربط الصفحة
                بين التاريخ والوقت الان، لأن فرق المنطقة الزمنية هو السبب العملي الأكثر شيوعاً وراء الالتباس في الرسائل
                والحجوزات والاجتماعات.
              </p>
              <p>
                إذا كان الموعد دينياً أو حكومياً، تعامل مع التاريخ هنا كمرجع حسابي واضح، ثم قارنه مع الإعلان الرسمي
                داخل {country.name_ar}. أما عند الاستخدام اليومي مثل مشاركة التاريخ، كتابة تذكير، أو مراجعة التقويم،
                فوجود الهجري والميلادي معاً يكفي غالباً لتجنب سوء الفهم.
              </p>
              <p>
                من الأفضل أيضاً فتح التقويم أو محوّل التاريخ عندما يكون الموعد بعد عدة أسابيع، لأن تاريخ اليوم وحده
                لا يشرح لك كيف ينتقل الشهر الهجري خلال الفترة القادمة. الربط بين صفحة الدولة والوقت الان والتحويل يجعل
                المسار أوضح: تعرف اليوم المحلي أولاً، ثم تفحص التاريخ المطلوب، ثم تشارك الصيغة المناسبة.
              </p>
            </div>
            <div className={styles.methodGrid}>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للمواعيد اليومية</h3>
                <p className={styles.cardBody}>استخدم التاريخ المحلي عندما يكون الموعد مرتبطاً بـ {country.name_ar} لا بجهازك الحالي.</p>
              </article>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للهجري</h3>
                <p className={styles.cardBody}>راجع طريقة الحساب والتنبيه لأن الإعلان الرسمي قد يغيّر بداية الشهر عند الحالات الحساسة.</p>
              </article>
              <article className={styles.infoCard}>
                <h3 className={styles.cardTitle}>للمقارنة</h3>
                <p className={styles.cardBody}>افتح محوّل التاريخ إذا كنت تريد مقارنة يوم سابق أو لاحق لا تاريخ اليوم فقط.</p>
              </article>
            </div>
          </section>

          <section className="date-section mb-8" aria-labelledby="country-date-faq-heading">
            <div className="date-section-head">
              <h2 id="country-date-faq-heading" className="date-section-title">
                أسئلة شائعة عن تاريخ اليوم في {country.name_ar}
              </h2>
              <p className="date-section-copy">
                هذه الأسئلة تختصر أكثر مواضع الالتباس: فرق التوقيت، اختلاف الهجري، وحدود الاعتماد الرسمي.
              </p>
            </div>
            <div className="date-faq-grid">
              {faqItems.map((item) => (
                <article key={item.question} className="date-faq-item">
                  <h3 className="date-faq-question">{item.question}</h3>
                  <p className="date-faq-copy m-0">{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <SiteTrustPanel panel="date" />
          </section>

          <AdInArticle slotId={`mid-date-country-${countrySlug}-1`} slotKey="inArticleDate" />

          <section className="related-links mb-8" dir="rtl" aria-labelledby="country-date-sources-heading">
            <p id="country-date-sources-heading" className="related-links__heading">
              مصادر تساعدك على فهم التاريخ المحلي
            </p>
            <div className="related-links__grid">
              {COUNTRY_DATE_SOURCE_LINKS.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  className="related-link-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{source.label}</span>
                    <span className="related-link-card__desc">{source.description}</span>
                  </span>
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </a>
              ))}
            </div>
          </section>

          <nav
            aria-label={`مسارات متابعة التاريخ المحلي في ${country.name_ar}`}
            className="related-links"
            dir="rtl"
          >
            <p className="related-links__heading">
              إذا كنت تتابع الوقت أو الصلاة في {country.name_ar}
            </p>
      
            <div className="related-links__grid">
              {links(countrySlug, country.name_ar).map(({ href, label, description, icon: Icon }) => (
                <Link key={href} href={href} className="related-link-card">
                  {/* Icon container */}
                  <span className="related-link-card__icon" aria-hidden="true">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
      
                  {/* Text */}
                  <span className="related-link-card__body">
                    <span className="related-link-card__label">{label}</span>
                    <span className="related-link-card__desc">{description}</span>
                  </span>
      
                  <span className="related-link-card__arrow" aria-hidden="true">←</span>
                </Link>
              ))}
            </div>
          </nav>

        </main>
      </AdLayoutWrapper>
    </>
  );
}
