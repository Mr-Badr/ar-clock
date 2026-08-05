// Original schematic line-art diagrams for the 6 joint types on /tools/carpenter/wood-joints —
// no external images used (see keyword-research/carpenter-hub/DECISION.md's "visuals decision").
// Plain presentational SVGs, no interactivity, safe to render from a Server Component.
const WOOD_FILL = 'var(--amber-subtle)';
const WOOD_STROKE = 'var(--amber-border)';
const ACCENT = 'var(--amber-text)';
const MUTED = 'var(--text-3)';

function Base({ children, label }) {
  return (
    <svg viewBox="0 0 160 110" width="100%" height="140" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function ButtJointDiagram() {
  return (
    <Base label="وصلة الحافة البسيطة">
      <rect x="20" y="70" width="90" height="18" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <rect x="92" y="20" width="18" height="68" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <line x1="101" y1="72" x2="101" y2="86" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="101" cy="79" r="2.5" fill={ACCENT} />
    </Base>
  );
}

export function MiterJointDiagram() {
  return (
    <Base label="وصلة الغرة بزاوية 45 درجة">
      <polygon points="20,88 100,88 100,70 20,70" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <polygon points="100,88 118,88 118,20 100,38" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <line x1="100" y1="70" x2="100" y2="88" stroke={ACCENT} strokeWidth="2" strokeDasharray="3 3" />
    </Base>
  );
}

export function DadoJointDiagram() {
  return (
    <Base label="الوصلة المجلخة">
      <path d="M20,88 H130 V70 H95 V60 H75 V70 H20 Z" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <rect x="76" y="30" width="18" height="30" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
    </Base>
  );
}

export function RabbetJointDiagram() {
  return (
    <Base label="وصلة الفلحة">
      <path d="M20,88 H120 V70 H100 V50 H20 Z" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <rect x="100" y="20" width="18" height="50" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
    </Base>
  );
}

export function MortiseTenonDiagram() {
  return (
    <Base label="وصلة اللسان والنقر">
      <rect x="20" y="55" width="60" height="18" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <rect x="80" y="61" width="16" height="6" fill={WOOD_FILL} stroke={ACCENT} strokeWidth="2" />
      <path d="M96,20 V88 H130 V72 H112 V56 H130 V20 Z" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
    </Base>
  );
}

export function BiscuitJointDiagram() {
  return (
    <Base label="الوصلة البسكويتية">
      <rect x="15" y="35" width="60" height="40" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <rect x="85" y="35" width="60" height="40" fill={WOOD_FILL} stroke={WOOD_STROKE} strokeWidth="2" />
      <ellipse cx="80" cy="55" rx="14" ry="7" fill="none" stroke={ACCENT} strokeWidth="2" strokeDasharray="3 2" />
    </Base>
  );
}

export const JOINTS = [
  {
    id: 'butt',
    name: 'وصلة الحافة البسيطة (Butt Joint)',
    Diagram: ButtJointDiagram,
    strength: 'الأضعف',
    difficulty: 'سهلة جداً',
    uses: 'إطارات بسيطة، صناديق اقتصادية، أعمال لا تتحمل وزناً كبيراً.',
    note: 'أسرع وصلة تنفيذاً — لوح يلامس لوحاً آخر مباشرة بزاوية قائمة، تُثبَّت بمسامير أو براغي وغراء. قوتها تعتمد كلياً على التثبيت لا على شكل القطع نفسه.',
  },
  {
    id: 'miter',
    name: 'وصلة الغرة (Miter Joint)',
    Diagram: MiterJointDiagram,
    strength: 'ضعيفة إلى متوسطة',
    difficulty: 'متوسطة',
    uses: 'إطارات الصور، حواف الخزائن، أي زاوية تريد إخفاء حواف القطع فيها.',
    note: 'يُقطع طرف كل لوح بزاوية 45 درجة ليلتقيا بزاوية قائمة كاملة دون أن تظهر حافة أي قطعة — جمالية أكثر منها قوة، وغالباً تُدعَّم بغراء أو بسكويت خفي.',
  },
  {
    id: 'dado',
    name: 'الوصلة المجلخة (Dado Joint)',
    Diagram: DadoJointDiagram,
    strength: 'قوية',
    difficulty: 'متوسطة',
    uses: 'الرفوف الداخلية للخزائن والمكتبات — كل رف يستقر داخل تجويف بدل أن يتحمله مسمار فقط.',
    note: 'تجويف (قناة) يُحفر بعرض القطعة الثانية بالضبط لتستقر بداخله، فيوزّع الوزن على كامل عرض التجويف بدل نقطة تثبيت واحدة.',
  },
  {
    id: 'rabbet',
    name: 'وصلة الفلحة (Rabbet Joint)',
    Diagram: RabbetJointDiagram,
    strength: 'قوية',
    difficulty: 'متوسطة',
    uses: 'الجزء الخلفي لخزائن الكتب، إطارات الأدراج، حواف الصناديق.',
    note: 'درجة (خطوة) تُحفر على حافة أحد اللوحين ليستقر فيها اللوح الآخر، فتزيد مساحة التلامس ومقاومة الفصل مقارنة بوصلة الحافة البسيطة.',
  },
  {
    id: 'mortise-tenon',
    name: 'وصلة اللسان والنقر (Mortise & Tenon)',
    Diagram: MortiseTenonDiagram,
    strength: 'الأقوى',
    difficulty: 'تحتاج خبرة',
    uses: 'أرجل الطاولات والكراسي، هياكل الأثاث التي تتحمل وزناً وحركة مستمرة.',
    note: 'أقدم وأقوى وصلة نجارة معروفة — لسان بارز في قطعة يدخل بإحكام في فتحة (نقر) محفورة بالقطعة الأخرى، فيقاوم الشد والالتواء معاً وليس الضغط فقط.',
  },
  {
    id: 'biscuit',
    name: 'الوصلة البسكويتية (Biscuit Joint)',
    Diagram: BiscuitJointDiagram,
    strength: 'متوسطة إلى قوية',
    difficulty: 'سهلة بأداة مخصصة',
    uses: 'لصق ألواح جنباً إلى جنب لتكوين سطح طاولة أو رف عريض من ألواح أضيق.',
    note: 'قطعة خشب بيضاوية صغيرة مغموسة بالغراء تُدخَل في شقين متقابلين بين لوحين، فتمنع انزلاقهما عن بعضهما أثناء وبعد اللصق دون أن تظهر من الخارج.',
  },
];
