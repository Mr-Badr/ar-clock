function formatArabicDiff(totalMinutes) {
  const absMinutes = Math.abs(totalMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours} ساعة و${minutes} دقيقة`;
  if (hours > 0) return `${hours} ساعة`;
  return `${minutes} دقيقة`;
}

function formatArabicClock(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const period = hour24 >= 12 ? 'م' : 'ص';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function buildContextSummaryLines({ fromCity, toCity, diffData }) {
  if (!diffData?.success || !fromCity || !toCity) return [];

  const { totalMinutes, isDSTFrom, isDSTTo, dayStatus } = diffData;
  const diffLabel = formatArabicDiff(totalMinutes);
  const fromName = fromCity.city_name_ar;
  const toName = toCity.city_name_ar;

  const lines = [];

  if (totalMinutes === 0) {
    lines.push(`فرق التوقيت بين ${fromName} و${toName} يساوي صفر ساعة حالياً، لأن المدينتين تعملان على التوقيت نفسه في هذه اللحظة.`);
  } else {
    const ahead = totalMinutes > 0 ? toName : fromName;
    const behind = totalMinutes > 0 ? fromName : toName;
    lines.push(`فرق التوقيت بين ${fromName} و${toName} هو ${diffLabel} حالياً، حيث تسبق ${ahead} مدينة ${behind} بهذا المقدار.`);
    lines.push(`إذا كانت الساعة 9:00 صباحاً في ${fromName} فإنها تكون ${formatArabicClock((9 * 60) + totalMinutes)} في ${toName}، وهذا يساعدك على تحويل الوقت بسرعة قبل أي اجتماع أو سفر.`);
  }

  if (isDSTFrom || isDSTTo) {
    const activeCities = [isDSTFrom ? fromName : null, isDSTTo ? toName : null].filter(Boolean).join(' و');
    lines.push(`التوقيت الصيفي مفعل حالياً في ${activeCities}، لذلك قد يتغير الفارق الزمني خلال أشهر السنة بحسب قواعد كل منطقة زمنية.`);
  } else {
    lines.push(`لا يوجد توقيت صيفي نشط حالياً بين ${fromName} و${toName}، لذلك يبقى الفرق المعروض مستقراً ما لم تتغير القواعد الرسمية لإحدى المنطقتين.`);
  }

  if (dayStatus === 'next') {
    lines.push(`عند مقارنة الوقت بين المدينتين ستجد أن ${toName} يدخل اليوم التالي قبل ${fromName} في بعض الساعات المتأخرة.`);
  } else if (dayStatus === 'prev') {
    lines.push(`عند مقارنة الوقت بين المدينتين ستجد أن ${toName} ما يزال في اليوم السابق خلال بعض الساعات بسبب الفارق الزمني الكبير.`);
  }

  return lines;
}
