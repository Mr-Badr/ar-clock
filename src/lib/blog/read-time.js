function cleanInlineArticleText(value) {
  return String(value || '')
    .trim()
    .replace(/[.،؛\s]+$/u, '');
}

function resolveArticleTrack(article) {
  const hubHref = String(article?.hubHref || '');

  if (hubHref.includes('/calculators/sleep')) {
    return 'sleep';
  }

  if (hubHref.includes('/calculators/building')) {
    return 'building';
  }

  return 'general';
}

function getTrackOpeningParagraph(track, title) {
  if (track === 'sleep') {
    return `من يقرأ عن النوم غالباً يكون متعباً أو محتاراً بين مواعيد متقلبة ونصيحة عامة لا تشبه يومه الحقيقي. لهذا يحاول ${title} أن يشرح الفكرة بطريقة أقرب لليلة عادية ودوام صباحي واستيقاظ تريد أن يكون أخف لا مثالياً على الورق فقط.`;
  }

  if (track === 'building') {
    return `في موضوعات البناء، الخطأ الصغير في الفهم يتحول بسرعة إلى فرق في الكمية أو التكلفة أو القرار الميداني. لذلك يشرح ${title} الفكرة من زاوية الاستخدام الفعلي: ماذا يعني الرقم، ولماذا يختلف، ومتى تحتاج أن تنتقل من القراءة إلى التقدير العملي.`;
  }

  return `هذا المقال يبدأ من جواب يساعدك على فهم سؤال متكرر بطريقة أبسط وأكثر قابلية للتطبيق. لذلك يضع ${title} المعنى العملي أولاً، ثم يقودك تدريجياً إلى القرار أو الصفحة التالية.`;
}

export function buildBlogArticleLeadParagraphs(article) {
  const title = cleanInlineArticleText(article?.title || article?.metaTitle || 'هذا الموضوع');
  const quickAnswer = article?.quickAnswers?.[0];
  const quickQuestion = cleanInlineArticleText(quickAnswer?.question || quickAnswer?.title);
  const quickText = cleanInlineArticleText(quickAnswer?.answer || quickAnswer?.description || quickAnswer?.body);
  const summaryValue = cleanInlineArticleText(article?.summary?.value);
  const summaryNote = cleanInlineArticleText(article?.summary?.note);
  const firstStep = article?.steps?.[0];
  const stepText = cleanInlineArticleText(firstStep?.title || firstStep?.description);
  const track = resolveArticleTrack(article);

  if (quickQuestion && quickText) {
    return [
      `الإجابة المختصرة عن ${quickQuestion}: ${quickText}. هذا هو المعنى الذي تحتاجه أولاً قبل أن تدخل في التفاصيل أو تقارن بين الحالات.`,
      getTrackOpeningParagraph(track, title),
    ];
  }

  if (summaryValue || summaryNote) {
    return Array.from(new Set([
      `${summaryValue ? `${summaryValue}. ` : ''}${summaryNote || 'الفكرة الأساسية في هذه الصفحة أن تفهم الموضوع بطريقة تختصر الالتباس وتترك لك خطوة أوضح بعد القراءة.'}`.trim(),
      getTrackOpeningParagraph(track, title),
    ])).filter(Boolean).slice(0, 2);
  }

  if (stepText) {
    return [
      `ابدأ من هذه النقطة العملية: ${stepText}. عندما تثبت نقطة البداية يصبح باقي المقال أسهل في القراءة وأقل عرضة لسوء الفهم.`,
      getTrackOpeningParagraph(track, title),
    ];
  }

  return [getTrackOpeningParagraph(track, title)];
}

export function splitBlogArticleBodyParagraphs(value) {
  const rawText = String(value || '').trim();

  if (!rawText) {
    return [];
  }

  const explicitParagraphs = rawText
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (explicitParagraphs.length > 1) {
    return explicitParagraphs;
  }

  const normalizedText = rawText.replace(/\s+/gu, ' ').trim();
  const sentences = normalizedText.match(/[^.!؟]+[.!؟]?/gu) || [normalizedText];

  if (sentences.length <= 2) {
    return [normalizedText];
  }

  const paragraphs = [];
  let currentParagraph = '';
  let currentSentenceCount = 0;

  for (const sentence of sentences) {
    const normalizedSentence = sentence.trim();
    if (!normalizedSentence) {
      continue;
    }

    const nextParagraph = currentParagraph
      ? `${currentParagraph} ${normalizedSentence}`
      : normalizedSentence;
    const shouldBreakParagraph = currentSentenceCount >= 2 || nextParagraph.length > 220;

    if (currentParagraph && shouldBreakParagraph) {
      paragraphs.push(currentParagraph.trim());
      currentParagraph = normalizedSentence;
      currentSentenceCount = 1;
      continue;
    }

    currentParagraph = nextParagraph;
    currentSentenceCount += 1;
  }

  if (currentParagraph) {
    paragraphs.push(currentParagraph.trim());
  }

  return paragraphs.length ? paragraphs : [normalizedText];
}

export function buildBlogArticlePracticalParagraphs(article) {
  const title = cleanInlineArticleText(article?.title || article?.metaTitle || 'هذا الموضوع');
  const quickAnswer = article?.quickAnswers?.[0];
  const quickQuestion = cleanInlineArticleText(quickAnswer?.question || quickAnswer?.title);
  const quickText = cleanInlineArticleText(quickAnswer?.answer || quickAnswer?.description || quickAnswer?.body);
  const firstStep = article?.steps?.[0];
  const stepText = cleanInlineArticleText(firstStep?.title || firstStep?.description);
  const hubTitle = cleanInlineArticleText(article?.hubTitle);
  const sourceCount = article?.sourceLinks?.length || 0;
  const relatedPage = article?.relatedPageLinks?.[0];
  const relatedText = cleanInlineArticleText(relatedPage?.title || article?.summary?.value || article?.checklist?.title);

  const paragraphs = [
    `لا تتعامل مع ${title} كفقرة معلومات منفصلة عن قرارك الحقيقي. اقرأ الفكرة الأساسية، ثم اسأل نفسك أين ستستخدمها: في حساب رقم، مقارنة اختيارين، ترتيب موعد، أو فهم مصطلح يتكرر أمامك. عندما تربط المقال بسؤال عملي واحد تصبح القراءة أقصر وأدق، وتعرف بسرعة هل تحتاج إلى أداة داخل الموقع أم إلى مراجعة مصدر رسمي.`,
  ];

  if (quickQuestion && quickText) {
    paragraphs.push(`أهم اختبار بعد القراءة هو أن تستطيع إجابة هذا السؤال بوضوح: ${quickQuestion}. إذا كانت إجابتك ما زالت عامة، فارجع إلى الخلاصة السريعة في أعلى المقال ثم طبّقها على رقم أو حالة من واقعك. الجواب المختصر هنا هو: ${quickText}.`);
  } else if (stepText) {
    paragraphs.push(`ابدأ بالتطبيق من هذه النقطة: ${stepText}. لا تقفز إلى النتيجة النهائية قبل ترتيب المدخلات، لأن أغلب الأخطاء تحدث عندما تكون الفكرة صحيحة لكن المثال المستخدم غير مناسب للحالة الفعلية.`);
  } else {
    paragraphs.push('أثناء التطبيق، دوّن الفرضية التي بنيت عليها فهمك قبل أن تعتمد النتيجة. هذه العادة البسيطة تكشف لك هل المشكلة في المعادلة نفسها أم في البيانات التي أدخلتها أو السياق الذي تقرأه منه.');
  }

  const trustPhrase = sourceCount > 0
    ? `يوجد في أسفل المقال ${sourceCount} مصدر أو مرجع للمراجعة، فافتحها عندما يكون القرار مالياً أو صحياً أو مرتبطاً بوقت رسمي.`
    : 'إذا كان القرار حساساً أو يتغير حسب بلدك، فراجع المصدر الرسمي قبل الاعتماد النهائي على أي شرح عام.';
  const nextPhrase = relatedText || hubTitle
    ? `بعد ذلك انتقل إلى ${relatedText || hubTitle} حتى تحول الفهم إلى خطوة قابلة للتنفيذ.`
    : 'بعد ذلك انتقل إلى الأداة أو الصفحة المرتبطة عندما تحتاج إلى نتيجة عملية لا شرحاً فقط.';

  paragraphs.push(`${trustPhrase} ${nextPhrase} بهذه الطريقة لا يكون المقال نهاية الرحلة، بل نقطة واضحة داخل مسار يساعدك على الفهم ثم التحقق ثم التطبيق.`);

  return paragraphs;
}

function collectArticleTextParts(article) {
  return [
    article?.description,
    article?.summary?.value,
    article?.summary?.note,
    ...buildBlogArticleLeadParagraphs(article),
    ...buildBlogArticlePracticalParagraphs(article),
    ...(article?.infoItems || []).flatMap((item) => [item?.title, item?.description, item?.content]),
    ...(article?.sections || []).map((section) => section?.body),
    ...(article?.steps || []).flatMap((step) => [step?.title, step?.description]),
    ...(article?.checklist?.items || []),
    ...(article?.quickAnswers || []).flatMap((item) => [item?.question, item?.answer]),
    ...(article?.faqItems || []).flatMap((item) => [item?.question, item?.answer]),
    ...(article?.sourceLinks || []).flatMap((item) => [item?.label, item?.description]),
    ...(article?.relatedPageLinks || []).flatMap((item) => [item?.title, item?.description]),
    ...(article?.comparison?.rows || []).flatMap((row) => [row?.label, ...(row?.values || [])]),
  ];
}

export function countBlogArticleWords(article) {
  return collectArticleTextParts(article)
    .filter(Boolean)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function estimateBlogArticleReadingMinutes(article) {
  const wordCount = countBlogArticleWords(article);
  return Math.max(1, Math.ceil(wordCount / 170));
}
