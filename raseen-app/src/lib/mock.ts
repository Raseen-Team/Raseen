/**
 * بيانات تجريبية واقعية لمنصة رسين — Media Intelligence
 * لا ترتبط بأي مصدر حقيقي حاليًا.
 */

export type Sentiment = "positive" | "negative" | "neutral";

export const sentimentLabel: Record<Sentiment, string> = {
  positive: "إيجابي",
  negative: "سلبي",
  neutral: "محايد",
};

export const org = {
  name: "مجموعة الأفق للاتصال المؤسسي",
  user: "نورة العتيبي",
  role: "محللة إعلامية أولى",
  initials: "ن ع",
  email: "noura@alofoq.sa",
};

export const platforms = [
  "الأخبار",
  "الصحف",
  "المواقع",
  "التلفزيون",
  "الراديو",
  "X",
  "TikTok",
  "YouTube",
  "Instagram",
] as const;

export const countries = [
  "السعودية",
  "الإمارات",
  "قطر",
  "الكويت",
  "مصر",
  "الأردن",
  "المغرب",
] as const;

export const languagesList = ["العربية", "الإنجليزية", "الفرنسية"] as const;

export const kpis = [
  { key: "news", label: "عدد الأخبار اليوم", value: "245", delta: 12.4, unit: "خبر" },
  { key: "positive", label: "إيجابي", value: "58%", delta: 4.1, unit: "من التغطية" },
  { key: "negative", label: "سلبي", value: "19%", delta: -2.6, unit: "من التغطية" },
  { key: "neutral", label: "محايد", value: "23%", delta: 0.8, unit: "من التغطية" },
];

export const sentimentSeries = [
  { day: "الأحد", positive: 128, negative: 41, neutral: 62 },
  { day: "الاثنين", positive: 142, negative: 38, neutral: 71 },
  { day: "الثلاثاء", positive: 119, negative: 57, neutral: 66 },
  { day: "الأربعاء", positive: 163, negative: 44, neutral: 74 },
  { day: "الخميس", positive: 151, negative: 62, neutral: 69 },
  { day: "الجمعة", positive: 98, negative: 33, neutral: 51 },
  { day: "السبت", positive: 134, negative: 47, neutral: 58 },
];

export const trendSeries = {
  "24h": [
    { t: "00:00", volume: 42, reach: 180 },
    { t: "04:00", volume: 31, reach: 140 },
    { t: "08:00", volume: 96, reach: 420 },
    { t: "12:00", volume: 148, reach: 610 },
    { t: "16:00", volume: 121, reach: 540 },
    { t: "20:00", volume: 173, reach: 720 },
  ],
  "7d": [
    { t: "الأحد", volume: 231, reach: 940 },
    { t: "الاثنين", volume: 251, reach: 1020 },
    { t: "الثلاثاء", volume: 242, reach: 980 },
    { t: "الأربعاء", volume: 281, reach: 1180 },
    { t: "الخميس", volume: 282, reach: 1240 },
    { t: "الجمعة", volume: 182, reach: 760 },
    { t: "السبت", volume: 239, reach: 1010 },
  ],
  "30d": [
    { t: "الأسبوع 1", volume: 1420, reach: 6100 },
    { t: "الأسبوع 2", volume: 1610, reach: 6800 },
    { t: "الأسبوع 3", volume: 1490, reach: 6400 },
    { t: "الأسبوع 4", volume: 1885, reach: 7950 },
  ],
};

export const topTopics = [
  { name: "الاقتصاد", volume: 412, change: 8.2 },
  { name: "التقنية", volume: 361, change: 14.6 },
  { name: "الذكاء الاصطناعي", volume: 348, change: 27.3 },
  { name: "الأسواق", volume: 259, change: -4.1 },
  { name: "الشركات", volume: 214, change: 3.7 },
  { name: "الأزمات", volume: 97, change: 19.8 },
];

export const topSources = [
  { name: "الأخبار", volume: 428, share: 24 },
  { name: "الصحف", volume: 361, share: 20 },
  { name: "المواقع", volume: 297, share: 17 },
  { name: "X", volume: 268, share: 15 },
  { name: "التلفزيون", volume: 152, share: 9 },
  { name: "YouTube", volume: 118, share: 7 },
  { name: "TikTok", volume: 84, share: 5 },
  { name: "الراديو", volume: 34, share: 2 },
  { name: "Instagram", volume: 28, share: 1 },
];

export type Mention = {
  id: string;
  title: string;
  source: string;
  platform: string;
  country: string;
  date: string;
  sentiment: Sentiment;
  reach: number;
  engagement: number;
  excerpt: string;
  keywords: string[];
  topics: string[];
  aiSummary: string;
};

export const mentions: Mention[] = [
  {
    id: "m-1041",
    title: "توسع الاستثمارات في مراكز البيانات يعيد رسم خارطة سوق الحوسبة السحابية",
    source: "الاقتصادية",
    platform: "الصحف",
    country: "السعودية",
    date: "2026-08-04 16:20",
    sentiment: "positive",
    reach: 184_000,
    engagement: 6_420,
    excerpt:
      "أظهرت مؤشرات القطاع نموًا متسارعًا في الإنفاق على البنية التحتية الرقمية، مع دخول مشغلين جدد إلى سوق مراكز البيانات الإقليمية خلال الربع الجاري.",
    keywords: ["مراكز البيانات", "الحوسبة السحابية", "الاستثمار الرقمي"],
    topics: ["الاقتصاد", "التقنية"],
    aiSummary:
      "التغطية إيجابية بشكل واضح وتتركز على حجم الاستثمار وأثره على الوظائف التقنية. المصادر الاقتصادية المتخصصة تقود السرد، ولم تُرصد نبرة نقدية مؤثرة.",
  },
  {
    id: "m-1039",
    title: "تباين آراء المحللين حول أثر تحديثات النماذج اللغوية على سوق العمل المحلي",
    source: "قناة الاقتصاد",
    platform: "التلفزيون",
    country: "الإمارات",
    date: "2026-08-04 14:05",
    sentiment: "neutral",
    reach: 96_500,
    engagement: 2_180,
    excerpt:
      "ناقش خبراء في حلقة تلفزيونية أثر أدوات الذكاء الاصطناعي على الوظائف المكتبية، مع تباين واضح بين من يرى فرصة إنتاجية ومن يحذر من إعادة هيكلة سريعة.",
    keywords: ["الذكاء الاصطناعي", "سوق العمل", "الأتمتة"],
    topics: ["الذكاء الاصطناعي", "الاقتصاد"],
    aiSummary:
      "النقاش متوازن ويحمل نبرة محايدة. الإشارات السلبية محصورة في مخاوف إعادة الهيكلة ولم تنتقل بعد إلى المنصات الاجتماعية.",
  },
  {
    id: "m-1036",
    title: "شكاوى متكررة من انقطاع الخدمة الرقمية تتصدر النقاش على منصة X",
    source: "حساب رصد المستهلك",
    platform: "X",
    country: "السعودية",
    date: "2026-08-04 11:48",
    sentiment: "negative",
    reach: 231_400,
    engagement: 18_930,
    excerpt:
      "تصدرت شكاوى المستخدمين حول تعطل الخدمة لمدة تجاوزت ثلاث ساعات قائمة الموضوعات الأكثر تداولًا، مع مشاركة واسعة من حسابات مؤثرة.",
    keywords: ["انقطاع الخدمة", "تجربة العميل", "شكاوى"],
    topics: ["الأزمات", "الشركات"],
    aiSummary:
      "إشارة إنذار مبكر: معدل انتشار الشكوى تجاوز المتوسط الأسبوعي بنسبة 240%. الحسابات المؤثرة ضاعفت الوصول خلال ساعتين.",
  },
  {
    id: "m-1033",
    title: "تقرير: نمو الإنفاق الإعلاني الرقمي في المنطقة بنسبة 17% خلال النصف الأول",
    source: "موقع أسواق اليوم",
    platform: "المواقع",
    country: "قطر",
    date: "2026-08-04 09:31",
    sentiment: "positive",
    reach: 74_800,
    engagement: 1_940,
    excerpt:
      "أشار التقرير إلى تحول ميزانيات المعلنين نحو المنصات القصيرة، مع استقرار حصة الإعلام التقليدي في القطاعات المؤسسية.",
    keywords: ["الإنفاق الإعلاني", "المنصات القصيرة", "الميزانيات"],
    topics: ["الاقتصاد", "الأسواق"],
    aiSummary:
      "تغطية داعمة للسردية القطاعية. يمكن استثمارها في تقرير المنافسين لتوضيح فارق حصة الصوت مقابل المنافس الثاني.",
  },
  {
    id: "m-1030",
    title: "مقابلة موسعة مع الرئيس التنفيذي حول خطة التوسع الإقليمي",
    source: "إذاعة الخليج",
    platform: "الراديو",
    country: "الكويت",
    date: "2026-08-03 19:12",
    sentiment: "positive",
    reach: 41_200,
    engagement: 860,
    excerpt:
      "تناولت المقابلة خطة التوسع في ثلاث أسواق جديدة، وأكدت على الاستثمار في الكفاءات المحلية خلال العامين المقبلين.",
    keywords: ["التوسع الإقليمي", "الكفاءات", "الاستثمار"],
    topics: ["الشركات", "الاقتصاد"],
    aiSummary:
      "رسائل القيادة وصلت بوضوح، ولوحظ إعادة نشر المقاطع الصوتية على المنصات الاجتماعية بمعدل أعلى من المعتاد.",
  },
  {
    id: "m-1028",
    title: "مقطع متداول يربط الشركة بممارسات تسعير غير دقيقة",
    source: "حساب مجهول",
    platform: "TikTok",
    country: "مصر",
    date: "2026-08-03 15:44",
    sentiment: "negative",
    reach: 312_600,
    engagement: 44_100,
    excerpt:
      "انتشر مقطع قصير يتضمن ادعاءات حول فروقات في الأسعار، دون توثيق واضح للمصدر أو تاريخ التسجيل.",
    keywords: ["ادعاءات", "تسعير", "محتوى متداول"],
    topics: ["الأزمات"],
    aiSummary:
      "المحتوى يحمل مؤشرات تضليل: غياب المصدر الأصلي وإعادة استخدام لقطات قديمة. يوصى بتشغيل مسار التحقق من الفيديو.",
  },
  {
    id: "m-1025",
    title: "تقرير تلفزيوني يستعرض جاهزية القطاع لمعايير الحوكمة الجديدة",
    source: "القناة الإخبارية",
    platform: "التلفزيون",
    country: "السعودية",
    date: "2026-08-03 12:03",
    sentiment: "neutral",
    reach: 128_900,
    engagement: 3_310,
    excerpt:
      "استعرض التقرير مستوى التزام الشركات بمعايير الحوكمة، مع إشارة إلى تفاوت الجاهزية بين القطاعات.",
    keywords: ["الحوكمة", "الامتثال", "المعايير"],
    topics: ["الشركات"],
    aiSummary: "تغطية مؤسسية محايدة، مناسبة للاستشهاد بها في التقرير الشهري ضمن قسم السمعة المؤسسية.",
  },
  {
    id: "m-1021",
    title: "نمو المشاهدات على القنوات المتخصصة يعكس اهتمامًا متزايدًا بتحليلات السوق",
    source: "قناة تحليلات",
    platform: "YouTube",
    country: "الأردن",
    date: "2026-08-02 21:35",
    sentiment: "positive",
    reach: 88_300,
    engagement: 7_420,
    excerpt:
      "سجلت المقاطع التحليلية ارتفاعًا في المشاهدات مقارنة بالشهر الماضي، مع تفاعل مرتفع في التعليقات.",
    keywords: ["تحليلات السوق", "المشاهدات", "التفاعل"],
    topics: ["الأسواق", "التقنية"],
    aiSummary: "قناة صاعدة بمعدل نمو 31%. يوصى بإضافتها إلى قائمة المصادر المؤثرة في إعدادات الرصد.",
  },
];

export const smartAlerts = [
  {
    id: "a1",
    title: "ارتفاع مفاجئ في التغطية الإعلامية",
    description: "زيادة 24% في حجم التغطية خلال آخر 6 ساعات مقارنة بالمتوسط الأسبوعي.",
    severity: "warning" as const,
    time: "قبل 12 دقيقة",
  },
  {
    id: "a2",
    title: "ارتفاع المشاعر السلبية",
    description: "المشاعر السلبية ارتفعت من 14% إلى 19% مدفوعة بنقاش انقطاع الخدمة.",
    severity: "danger" as const,
    time: "قبل 41 دقيقة",
  },
  {
    id: "a3",
    title: "موضوع جديد بدأ في الصعود",
    description: "موضوع «معايير الحوكمة» يدخل قائمة الموضوعات العشرة الأولى لأول مرة.",
    severity: "info" as const,
    time: "قبل ساعتين",
  },
  {
    id: "a4",
    title: "مصدر إعلامي مؤثر",
    description: "حساب برصيد 1.2 مليون متابع أعاد نشر التغطية السلبية.",
    severity: "warning" as const,
    time: "قبل 3 ساعات",
  },
  {
    id: "a5",
    title: "احتمال أزمة",
    description: "نموذج التنبؤ يرصد احتمالًا بنسبة 72% لتصاعد أزمة إعلامية خلال 48 ساعة.",
    severity: "danger" as const,
    time: "قبل 4 ساعات",
  },
];

export const metrics = [
  {
    id: "share-of-voice",
    name: "حصة الصوت",
    value: "34.2%",
    change: 3.4,
    description: "نصيب الجهة من إجمالي التغطية الإعلامية مقارنة بالمنافسين.",
    ai: "حصة الصوت ارتفعت بفعل التغطية الاقتصادية المكثفة، مع بقاء الفجوة مع المنافس الأول عند 6 نقاط.",
  },
  {
    id: "sentiment",
    name: "المشاعر",
    value: "58% إيجابي",
    change: 4.1,
    description: "توزيع نبرة التغطية بين إيجابي وسلبي ومحايد.",
    ai: "التحسن مدفوع بتغطية التوسع الإقليمي، بينما تتركز السلبية في موضوع انقطاع الخدمة.",
  },
  {
    id: "reach",
    name: "الوصول",
    value: "4.8M",
    change: 8.9,
    description: "إجمالي الجمهور المحتمل الذي وصلت إليه الإشارات الإعلامية.",
    ai: "قفزة الوصول جاءت من منصتي X وTikTok، وهي وصول غير مدفوع بالكامل.",
  },
  {
    id: "engagement",
    name: "التفاعل",
    value: "182K",
    change: -2.3,
    description: "مجموع التفاعلات على الإشارات المرصودة.",
    ai: "انخفاض التفاعل رغم ارتفاع الوصول يشير إلى تغطية إخبارية أكثر من نقاش جماهيري.",
  },
  {
    id: "media-impact",
    name: "الأثر الإعلامي",
    value: "71 / 100",
    change: 2.7,
    description: "مؤشر مركب يجمع الوصول والتفاعل وجودة المصدر ونبرة التغطية.",
    ai: "جودة المصادر ترفع المؤشر: 46% من الإشارات جاءت من مصادر من الفئة الأولى.",
  },
  {
    id: "influencers",
    name: "المؤثرون",
    value: "37 حسابًا",
    change: 11.2,
    description: "عدد الحسابات والمصادر المؤثرة التي تناولت الجهة.",
    ai: "دخل 6 مؤثرين جدد إلى دائرة النقاش، ثلاثة منهم بنبرة نقدية.",
  },
  {
    id: "trend-index",
    name: "مؤشر الاتجاه",
    value: "68",
    change: 6.5,
    description: "قياس سرعة نمو الموضوعات المرتبطة بالجهة.",
    ai: "الاتجاه صاعد بثبات منذ خمسة أيام، ومحركه الأساسي موضوع الذكاء الاصطناعي.",
  },
  {
    id: "reputation-score",
    name: "مؤشر السمعة",
    value: "78 / 100",
    change: 1.9,
    description: "تقييم مركب للسمعة الإعلامية بناءً على النبرة والمصدر والاستمرارية.",
    ai: "السمعة مستقرة، لكن استمرار نقاش انقطاع الخدمة قد يخفض المؤشر 3 نقاط خلال أسبوع.",
  },
];

export const metricHistory = [
  { t: "الأسبوع 1", value: 62 },
  { t: "الأسبوع 2", value: 66 },
  { t: "الأسبوع 3", value: 64 },
  { t: "الأسبوع 4", value: 71 },
  { t: "الأسبوع 5", value: 69 },
  { t: "الأسبوع 6", value: 74 },
  { t: "الأسبوع 7", value: 78 },
];

export const competitors = [
  {
    name: "الجهة الأساسية",
    sov: 34,
    sentiment: 58,
    reach: 4.8,
    engagement: 182,
    impact: 71,
    reputation: 78,
    trend: 68,
  },
  {
    name: "المنافس الأول",
    sov: 40,
    sentiment: 51,
    reach: 5.6,
    engagement: 210,
    impact: 74,
    reputation: 72,
    trend: 61,
  },
  {
    name: "المنافس الثاني",
    sov: 16,
    sentiment: 47,
    reach: 2.1,
    engagement: 96,
    impact: 52,
    reputation: 64,
    trend: 55,
  },
  {
    name: "المنافس الثالث",
    sov: 10,
    sentiment: 44,
    reach: 1.3,
    engagement: 61,
    impact: 43,
    reputation: 58,
    trend: 49,
  },
];

export const audienceSegments = [
  { name: "المهتمون بالاقتصاد", share: 32, sentiment: 62, platform: "X" },
  { name: "قطاع التقنية", share: 26, sentiment: 71, platform: "YouTube" },
  { name: "الإعلاميون والصحفيون", share: 18, sentiment: 54, platform: "الصحف" },
  { name: "الجمهور العام", share: 14, sentiment: 46, platform: "TikTok" },
  { name: "المستثمرون", share: 10, sentiment: 66, platform: "المواقع" },
];

export const geoDistribution = [
  { country: "السعودية", share: 46, mentions: 812 },
  { country: "الإمارات", share: 21, mentions: 371 },
  { country: "مصر", share: 12, mentions: 212 },
  { country: "قطر", share: 8, mentions: 141 },
  { country: "الكويت", share: 7, mentions: 124 },
  { country: "الأردن", share: 6, mentions: 106 },
];

export const campaigns = [
  {
    name: "حملة التوسع الإقليمي",
    reach: "2.4M",
    engagement: "94K",
    sentiment: 64,
    sov: 21,
    impact: 68,
    status: "نشطة",
  },
  {
    name: "حملة الابتكار التقني",
    reach: "1.7M",
    engagement: "71K",
    sentiment: 72,
    sov: 15,
    impact: 61,
    status: "نشطة",
  },
  {
    name: "حملة المسؤولية المجتمعية",
    reach: "860K",
    engagement: "38K",
    sentiment: 78,
    sov: 9,
    impact: 54,
    status: "منتهية",
  },
];

export const campaignTimeline = [
  { t: "الأسبوع 1", reach: 320, engagement: 12 },
  { t: "الأسبوع 2", reach: 540, engagement: 21 },
  { t: "الأسبوع 3", reach: 720, engagement: 28 },
  { t: "الأسبوع 4", reach: 610, engagement: 24 },
  { t: "الأسبوع 5", reach: 880, engagement: 33 },
];

export const predictions = [
  {
    id: "crisis",
    title: "الأزمة القادمة",
    headline: "احتمال تصاعد أزمة إعلامية",
    probability: 72,
    risk: "مرتفع",
    confidence: 84,
    horizon: "خلال 48 ساعة",
    signals: [
      "ارتفاع التغطية بنسبة 24% خلال 6 ساعات",
      "زيادة المشاعر السلبية من 14% إلى 19%",
      "زيادة الحديث على منصتي X وTikTok",
      "دخول مصادر مؤثرة إلى النقاش",
    ],
    why: "تقاطع ثلاث إشارات في نافذة زمنية قصيرة: نمو الحجم، تحول النبرة، ودخول حسابات ذات وصول مرتفع. هذا النمط سبق أن أنتج تصعيدًا خلال 36–60 ساعة في ثلاث حالات مشابهة.",
  },
  {
    id: "trend",
    title: "الترند القادم",
    headline: "صعود نقاش حوكمة الذكاء الاصطناعي",
    probability: 64,
    risk: "متوسط",
    confidence: 77,
    horizon: "خلال 5 أيام",
    signals: [
      "نمو 27% في موضوع الذكاء الاصطناعي",
      "دخول القناة الإخبارية إلى النقاش",
      "ارتفاع البحث عن مصطلح «معايير الحوكمة»",
    ],
    why: "الموضوع ينتقل من المصادر المتخصصة إلى الإعلام العام، وهي المرحلة التي تسبق عادة الانتشار الواسع.",
  },
  {
    id: "issues",
    title: "القضايا الصاعدة",
    headline: "جودة الخدمة الرقمية تتحول إلى قضية عامة",
    probability: 58,
    risk: "متوسط",
    confidence: 71,
    horizon: "خلال أسبوعين",
    signals: [
      "تكرار الشكاوى في ثلاث مناسبات خلال شهر",
      "تفاعل مرتفع مع محتوى المستخدمين",
      "بداية اهتمام صحفي متخصص",
    ],
    why: "تكرار الحادثة نفسها يحوّل الشكوى الفردية إلى قضية قطاعية يتبناها الإعلام.",
  },
  {
    id: "opinion",
    title: "تغير الرأي العام",
    headline: "تحسن تدريجي في نبرة الجمهور تجاه التوسع",
    probability: 61,
    risk: "منخفض",
    confidence: 69,
    horizon: "خلال 30 يومًا",
    signals: [
      "تحسن نبرة التعليقات بنسبة 9%",
      "انخفاض الإشارات النقدية في المصادر الاقتصادية",
      "ارتفاع إعادة نشر رسائل القيادة",
    ],
    why: "رسائل القيادة تصل إلى الجمهور دون وسيط، وهو ما يرفع الثقة تدريجيًا.",
  },
];

export const predictionSeries = [
  { t: "اليوم 1", risk: 38 },
  { t: "اليوم 2", risk: 44 },
  { t: "اليوم 3", risk: 51 },
  { t: "اليوم 4", risk: 63 },
  { t: "اليوم 5", risk: 72 },
];

export const reports = [
  {
    id: "rp-2041",
    title: "التقرير اليومي للمشهد الإعلامي",
    type: "يومي",
    date: "2026-08-04",
    status: "جاهز",
    sections: 6,
  },
  {
    id: "rp-2038",
    title: "تقرير الأسبوع — حصة الصوت والسمعة",
    type: "أسبوعي",
    date: "2026-08-01",
    status: "جاهز",
    sections: 8,
  },
  {
    id: "rp-2031",
    title: "تقرير أزمة انقطاع الخدمة الرقمية",
    type: "تقرير أزمة",
    date: "2026-07-28",
    status: "جاهز",
    sections: 7,
  },
  {
    id: "rp-2024",
    title: "تقرير المنافسين — الربع الثاني",
    type: "تقرير منافسين",
    date: "2026-07-15",
    status: "أرشيف",
    sections: 9,
  },
  {
    id: "rp-2019",
    title: "التقرير الشهري لشهر يونيو",
    type: "شهري",
    date: "2026-07-01",
    status: "أرشيف",
    sections: 10,
  },
];

export const discourseKeywords = [
  { word: "الحوكمة", weight: 92 },
  { word: "الاستثمار", weight: 84 },
  { word: "الذكاء الاصطناعي", weight: 78 },
  { word: "جودة الخدمة", weight: 64 },
  { word: "التوسع", weight: 58 },
  { word: "الشفافية", weight: 47 },
  { word: "الأسعار", weight: 41 },
  { word: "الكفاءات", weight: 36 },
];

export const notifications = [
  {
    id: "n1",
    title: "ارتفاع بنسبة 24% في التغطية الإعلامية خلال آخر 6 ساعات.",
    description: "المحرك الأساسي: نقاش انقطاع الخدمة الرقمية على منصة X.",
    time: "قبل 12 دقيقة",
    severity: "warning" as const,
    read: false,
  },
  {
    id: "n2",
    title: "تم رصد ارتفاع في المشاعر السلبية.",
    description: "المشاعر السلبية عند 19% مقابل 14% في المتوسط الأسبوعي.",
    time: "قبل 41 دقيقة",
    severity: "danger" as const,
    read: false,
  },
  {
    id: "n3",
    title: "موضوع جديد بدأ في الصعود.",
    description: "«معايير الحوكمة» دخل قائمة الموضوعات العشرة الأولى.",
    time: "قبل ساعتين",
    severity: "info" as const,
    read: false,
  },
  {
    id: "n4",
    title: "احتمال تصاعد أزمة إعلامية.",
    description: "نموذج التنبؤ يقدّر الاحتمال بـ72% خلال 48 ساعة.",
    time: "قبل 4 ساعات",
    severity: "danger" as const,
    read: true,
  },
  {
    id: "n5",
    title: "اكتمل إعداد التقرير الأسبوعي.",
    description: "تقرير حصة الصوت والسمعة جاهز للمراجعة والتصدير.",
    time: "أمس",
    severity: "success" as const,
    read: true,
  },
];

export const searchSuggestions = [
  { label: "انقطاع الخدمة الرقمية", type: "موضوع" },
  { label: "حصة الصوت", type: "مؤشر" },
  { label: "الاقتصادية", type: "مصدر" },
  { label: "تقرير أزمة انقطاع الخدمة الرقمية", type: "تقرير" },
  { label: "تحليل السمعة — آخر 7 أيام", type: "تحليل" },
  { label: "الذكاء الاصطناعي", type: "موضوع" },
];

export const verificationSteps = [
  "تحليل المصدر",
  "فحص المحتوى",
  "مقارنة البيانات",
  "تحليل السياق",
  "إصدار النتيجة",
];

export const verificationEvidence = [
  {
    label: "أقدم ظهور للمحتوى",
    value: "2024-11-02 — أرشيف موقع إخباري إقليمي",
  },
  { label: "بيانات EXIF", value: "غير متوفرة — تمت إزالة البيانات الوصفية" },
  { label: "نتائج البحث العكسي", value: "7 نسخ متطابقة على منصات مختلفة" },
  { label: "تحليل السياق", value: "السياق المستخدم لا يطابق الحدث الأصلي" },
];

export const similarSources = [
  { name: "أرشيف صحيفة إقليمية", trust: "موثوق", date: "2024-11-02" },
  { name: "موقع تجميع محتوى", trust: "يحتاج تحقق", date: "2025-06-19" },
  { name: "حساب مجهول على TikTok", trust: "غير موثوق", date: "2026-08-03" },
];
