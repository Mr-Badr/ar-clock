// Config for the four solar-based "special prayer time" fact pages
// (last-third-of-night, duha-prayer-time, friday-response-hour,
// prohibited-prayer-times) when scaled out per country/city — see
// src/lib/mwaqit/special-prayer-geo-pages.jsx for the page factory that
// consumes this. White days is Hijri-calendar-based (same for every city),
// so it has no geo variant and isn't listed here.
import {
  getLastThirdOfNightFacts,
  getDuhaPrayerFacts,
  getFridayResponseHourFacts,
  getProhibitedPrayerWindowsFacts,
} from '@/lib/night-prayer-facts';

function primaryValueLabel(factKey, facts) {
  switch (factKey) {
    case 'last-third':
      return facts.lastThirdStartLabel;
    case 'duha':
      return facts.isDuhaNow ? facts.duhaEndLabel : facts.duhaStartLabel;
    case 'friday':
      return facts.responseHourStartLabel;
    case 'prohibited':
      return facts.activeWindow ? facts.activeWindow.endLabel : facts.windows[0]?.startLabel;
    default:
      return '';
  }
}

export const SPECIAL_PRAYER_FACT_TYPES = {
  'last-third-of-night': {
    slug: 'last-third-of-night',
    factKey: 'last-third',
    factBuilder: getLastThirdOfNightFacts,
    topicLabelAr: 'الثلث الأخير من الليل',
    metaPillAr: 'الثلث الأخير من الليل الآن',
    buildH1: (cityAr) => `متى الثلث الأخير من الليل في ${cityAr}؟`,
    buildTitle: (cityAr, facts) => {
      const value = primaryValueLabel('last-third', facts);
      const title = `متى الثلث الأخير من الليل في ${cityAr}؟ | يبدأ ${value}`;
      return title.length <= 80 ? title : `متى الثلث الأخير من الليل في ${cityAr}؟`;
    },
    buildDescription: (cityAr, countryAr) => (
      `احسب وقت الثلث الأخير من الليل في ${cityAr}، ${countryAr} اليوم بدقة الدقيقة: يبدأ متى، ` +
      'ويمتد حتى أذان الفجر — وهو وقت التهجد والدعاء المستحب، محسوب من إحداثيات مدينتك مباشرة.'
    ),
    buildIntro: (cityAr) => (
      `الثلث الأخير من الليل في ${cityAr} هو آخر جزء من الليل، من تمام ثلثي الفترة بين المغرب ` +
      'والفجر حتى أذان الفجر مباشرة — وهو وقت التهجد والدعاء المستحب. البطاقة أدناه تعرض التوقيت ' +
      `الدقيق في ${cityAr} اليوم، محسوباً من إحداثياتها مباشرة.`
    ),
    buildWhyDiffers: (cityAr) => (
      `يعتمد الثلث الأخير على طول الليل بين المغرب والفجر في ${cityAr} تحديداً، وهذا الطول يختلف ` +
      'من مدينة لأخرى بحسب خط العرض وفصل السنة. لهذا لا يصح استخدام توقيت مدينة أخرى، ولو كانت ' +
      'قريبة جغرافياً أو في نفس الدولة.'
    ),
    buildFaq: (cityAr, countryAr, facts) => [
      {
        question: `متى يبدأ الثلث الأخير من الليل في ${cityAr}؟`,
        answer: `يبدأ الثلث الأخير من الليل في ${cityAr} اليوم عند الساعة ${facts.lastThirdStartLabel}، ويمتد حتى أذان الفجر عند ${facts.fajrLabel}.`,
      },
      {
        question: `كيف يُحسب الثلث الأخير من الليل في ${cityAr}؟`,
        answer: `يُقسّم الليل من المغرب (${facts.maghribLabel}) إلى الفجر (${facts.fajrLabel}) في ${cityAr} إلى ثلاثة أجزاء متساوية، ويبدأ الثلث الأخير عند نهاية الجزأين الأولين.`,
      },
      {
        question: `متى منتصف الليل الشرعي في ${cityAr}؟`,
        answer: `منتصف الليل الشرعي في ${cityAr} اليوم هو الساعة ${facts.islamicMidnightLabel}، وهو نقطة المنتصف بين المغرب والفجر.`,
      },
      {
        question: `لماذا يختلف الثلث الأخير في ${cityAr} عن مدينة أخرى في ${countryAr}؟`,
        answer: `لأن طول الليل بين المغرب والفجر يعتمد على خط عرض المدينة، وقد يختلف بين ${cityAr} ومدن أخرى داخل ${countryAr} بضع دقائق حتى في نفس اليوم.`,
      },
      {
        question: `ما فضل الدعاء في الثلث الأخير من الليل؟`,
        answer: 'ثبت في الحديث أن الله تعالى ينزل في هذا الوقت نزولاً يليق بجلاله، ويجيب الداعي ويعطي السائل ويغفر للمستغفر، حتى طلوع الفجر.',
      },
    ],
  },

  'duha-prayer-time': {
    slug: 'duha-prayer-time',
    factKey: 'duha',
    factBuilder: getDuhaPrayerFacts,
    topicLabelAr: 'وقت صلاة الضحى',
    metaPillAr: 'وقت صلاة الضحى الآن',
    buildH1: (cityAr) => `متى وقت صلاة الضحى في ${cityAr}؟`,
    buildTitle: (cityAr, facts) => {
      const value = primaryValueLabel('duha', facts);
      const title = `متى وقت صلاة الضحى في ${cityAr}؟ | ${facts.isDuhaNow ? 'ينتهي' : 'يبدأ'} ${value}`;
      return title.length <= 80 ? title : `متى وقت صلاة الضحى في ${cityAr}؟`;
    },
    buildDescription: (cityAr, countryAr) => (
      `احسب وقت صلاة الضحى الآن في ${cityAr}، ${countryAr}: يبدأ بعد ارتفاع الشمس عن الشروق، ` +
      'وينتهي قبل دخول الظهر — بدقة الدقيقة من إحداثيات مدينتك مباشرة.'
    ),
    buildIntro: (cityAr) => (
      `يبدأ وقت صلاة الضحى في ${cityAr} بعد ارتفاع الشمس عن الشروق بربع ساعة تقريباً، وينتهي قبل ` +
      `دخول الظهر بعشر دقائق. البطاقة أدناه تعرض التوقيت الدقيق في ${cityAr} اليوم.`
    ),
    buildWhyDiffers: (cityAr) => (
      `وقت الضحى في ${cityAr} محسوب من وقتي الشروق والظهر في المدينة نفسها، وكلاهما يعتمدان على ` +
      'إحداثياتها الفعلية. مدينة أخرى قد يكون شروقها أو ظهرها أبكر أو أتأخر بدقائق، فتختلف نافذة الضحى تبعاً لذلك.'
    ),
    buildFaq: (cityAr, countryAr, facts) => [
      {
        question: `متى يبدأ وقت صلاة الضحى في ${cityAr}؟`,
        answer: `يبدأ وقت صلاة الضحى في ${cityAr} اليوم عند ${facts.duhaStartLabel}، بعد الشروق (${facts.sunriseLabel}) بنحو 15 دقيقة.`,
      },
      {
        question: `متى ينتهي وقت صلاة الضحى في ${cityAr}؟`,
        answer: `ينتهي وقت الضحى في ${cityAr} اليوم عند ${facts.duhaEndLabel}، قبل دخول الظهر (${facts.dhuhrLabel}) بنحو 10 دقائق.`,
      },
      {
        question: `هل وقت الضحى الآن في ${cityAr}؟`,
        answer: facts.isDuhaNow
          ? `نعم، وقت الضحى في ${cityAr} جارٍ الآن حتى ${facts.duhaEndLabel}.`
          : `لا، وقت الضحى في ${cityAr} اليوم يبدأ عند ${facts.duhaStartLabel} وينتهي عند ${facts.duhaEndLabel}.`,
      },
      {
        question: `لماذا يختلف وقت الضحى في ${cityAr} عن مدينة أخرى في ${countryAr}؟`,
        answer: `لأن وقتي الشروق والظهر يختلفان بين المدن بحسب خط الطول وخط العرض، فتتحرك نافذة الضحى معهما ولو كانت المدينتان داخل ${countryAr} نفسها.`,
      },
      {
        question: 'كم ركعة صلاة الضحى؟',
        answer: 'أقلها ركعتان، وأكثرها ثمان ركعات أو أكثر عند بعض العلماء، وكل ركعتين بتسليمة.',
      },
    ],
  },

  'friday-response-hour': {
    slug: 'friday-response-hour',
    factKey: 'friday',
    factBuilder: getFridayResponseHourFacts,
    topicLabelAr: 'ساعة الاستجابة يوم الجمعة',
    metaPillAr: 'ساعة الاستجابة كل جمعة',
    buildH1: (cityAr) => `متى ساعة الاستجابة يوم الجمعة في ${cityAr}؟`,
    buildTitle: (cityAr, facts) => {
      const value = primaryValueLabel('friday', facts);
      const title = `متى ساعة الاستجابة يوم الجمعة في ${cityAr}؟ | تبدأ ${value}`;
      return title.length <= 80 ? title : `متى ساعة الاستجابة يوم الجمعة في ${cityAr}؟`;
    },
    buildDescription: (cityAr, countryAr) => (
      `احسب موعد ساعة الاستجابة يوم الجمعة في ${cityAr}، ${countryAr}: آخر ساعة قبل أذان المغرب ` +
      'على الرأي الراجح، محسوبة بدقة الدقيقة من إحداثيات مدينتك.'
    ),
    buildIntro: (cityAr) => (
      `على الرأي الراجح، تبدأ ساعة الاستجابة في ${cityAr} آخر ساعة قبل أذان المغرب يوم الجمعة ` +
      'وتنتهي معه. البطاقة أدناه تعرض موعدها الدقيق هذا الأسبوع.'
    ),
    buildWhyDiffers: (cityAr) => (
      `ساعة الاستجابة في ${cityAr} مرتبطة بأذان المغرب في المدينة نفسها، وموعد المغرب يختلف يومياً ` +
      'ومن مدينة لأخرى بحسب خط الطول والعرض، لذلك لا تصح مقارنتها بتوقيت مدينة أخرى.'
    ),
    buildFaq: (cityAr, countryAr, facts) => [
      {
        question: `متى تبدأ ساعة الاستجابة يوم الجمعة في ${cityAr}؟`,
        answer: `${facts.isFridayToday ? 'اليوم جمعة، و' : ''}تبدأ ساعة الاستجابة في ${cityAr} عند ${facts.responseHourStartLabel}، وتنتهي بأذان المغرب عند ${facts.fridayMaghribLabel}.`,
      },
      {
        question: `هل ساعة الاستجابة جارية الآن في ${cityAr}؟`,
        answer: facts.isLiveNow
          ? `نعم، أنت الآن داخل ساعة الاستجابة في ${cityAr}، وتنتهي بأذان المغرب عند ${facts.fridayMaghribLabel}.`
          : `لا، ساعة الاستجابة في ${cityAr} ${facts.isFridayToday ? 'تبدأ لاحقاً اليوم' : 'تبدأ الجمعة القادمة'} عند ${facts.responseHourStartLabel}.`,
      },
      {
        question: `لماذا تُحسب ساعة الاستجابة في ${cityAr} بأنها آخر ساعة قبل المغرب؟`,
        answer: 'لأنه الرأي الوحيد من قولي العلماء القابل للحساب الفلكي الدقيق (مغرب اليوم ناقص ساعة واحدة)، بخلاف رأي "من جلوس الإمام إلى نهاية الصلاة" الذي يعتمد على توقيت كل مسجد.',
      },
      {
        question: `لماذا يختلف موعد ساعة الاستجابة بين ${cityAr} ومدينة أخرى في ${countryAr}؟`,
        answer: `لأن الموعد مرتبط مباشرة بأذان المغرب، وأذان المغرب يختلف بين مدن ${countryAr} بحسب خط الطول والعرض، ولو بدقائق معدودة.`,
      },
      {
        question: 'ماذا لو فاتتني ساعة الاستجابة هذا الأسبوع؟',
        answer: 'تتكرر كل جمعة، فاضبط تذكيراً قبل أذان المغرب بساعة في الجمعة القادمة، ويبقى ليوم الجمعة كله فضل عظيم بالدعاء والذكر.',
      },
    ],
  },

  'prohibited-prayer-times': {
    slug: 'prohibited-prayer-times',
    factKey: 'prohibited',
    factBuilder: getProhibitedPrayerWindowsFacts,
    topicLabelAr: 'أوقات النهي عن الصلاة',
    metaPillAr: 'أوقات النهي عن الصلاة الآن',
    buildH1: (cityAr) => `ما هي أوقات النهي عن الصلاة في ${cityAr}؟`,
    buildTitle: (cityAr) => `ما هي أوقات النهي عن الصلاة في ${cityAr}؟ | الثلاثة اليوم`,
    buildDescription: (cityAr, countryAr) => (
      `أوقات النهي عن الصلاة الثلاثة في ${cityAr}، ${countryAr} اليوم بدقة الدقيقة — بعد الفجر، ` +
      'عند الاستواء، ومن العصر حتى الغروب — محسوبة من إحداثيات مدينتك مباشرة.'
    ),
    buildIntro: (cityAr) => (
      `أوقات النهي عن الصلاة ثلاثة، ثبتت في صحيح مسلم — بعد الفجر حتى ارتفاع الشمس، عند استواء ` +
      `الشمس قبيل الظهر، ومن العصر حتى غروب الشمس تماماً. البطاقة أدناه تعرض توقيتها الدقيق في ${cityAr} اليوم.`
    ),
    buildWhyDiffers: (cityAr) => (
      `أوقات النهي الثلاثة في ${cityAr} مبنية على الفجر والشروق والظهر والعصر والمغرب في المدينة ` +
      'نفسها، وكلها تتحرك يومياً ومن مدينة لأخرى بحسب الإحداثيات، فلا يصح استخدام جدول مدينة مختلفة.'
    ),
    buildFaq: (cityAr, countryAr, facts) => [
      {
        question: `ما هي أوقات النهي عن الصلاة في ${cityAr} اليوم؟`,
        answer: `ثلاثة أوقات في ${cityAr} اليوم: من الفجر حتى ${facts.windows[0]?.endLabel}، ومن ${facts.windows[1]?.startLabel} حتى الظهر، ومن العصر حتى المغرب عند ${facts.windows[2]?.endLabel}.`,
      },
      {
        question: `هل نحن الآن في وقت نهي في ${cityAr}؟`,
        answer: facts.activeWindow
          ? `نعم، ${cityAr} الآن داخل وقت "${facts.activeWindow.title}"، وينتهي عند ${facts.activeWindow.endLabel}.`
          : `لا، لا يوجد وقت نهي نشط الآن في ${cityAr}. يمكنك أداء النوافل بلا كراهة وقت.`,
      },
      {
        question: `ما الدليل على أوقات النهي عن الصلاة؟`,
        answer: 'ثبتت في صحيح مسلم عن عقبة بن عامر رضي الله عنه: ثلاث ساعات نهانا رسول الله ﷺ أن نصلي فيهن أو نقبر فيهن موتانا: حين تطلع الشمس بازغة حتى ترتفع، وحين يقوم قائم الظهيرة حتى تميل الشمس، وحين تتضيف الشمس للغروب حتى تغرب.',
      },
      {
        question: `لماذا تختلف أوقات النهي في ${cityAr} عن مدينة أخرى في ${countryAr}؟`,
        answer: `لأنها محسوبة من الفجر والشروق والظهر والعصر والمغرب في ${cityAr} نفسها، وهذه المواقيت تختلف بين مدن ${countryAr} بحسب خط الطول والعرض.`,
      },
      {
        question: 'هل النهي يشمل صلاة الفريضة أيضاً؟',
        answer: 'لا، النهي خاص بصلاة النافلة (التطوع) بلا سبب. أما الفرائض وذوات الأسباب (كتحية المسجد أو سجدة التلاوة) فلها تفصيل فقهي آخر عند أهل العلم.',
      },
    ],
  },
};

export function getSpecialPrayerFactType(slug) {
  return SPECIAL_PRAYER_FACT_TYPES[slug] || null;
}

export const SPECIAL_PRAYER_FACT_SLUGS = Object.keys(SPECIAL_PRAYER_FACT_TYPES);
