/**
 * بيانات تجريبية لصفحة «ربط مصادر البيانات» — رسين
 * جمع البيانات فقط: رصد، تحليل، تحقق، تقارير، تنبؤ.
 */

export type ConnectionStatus = "connected" | "disconnected" | "reauth";

export const connectionStatusLabel: Record<ConnectionStatus, string> = {
  connected: "متصل",
  disconnected: "غير متصل",
  reauth: "يتطلب إعادة المصادقة",
};

export type SyncFrequency = "hourly" | "6h" | "daily" | "weekly";

export const syncFrequencyLabel: Record<SyncFrequency, string> = {
  hourly: "كل ساعة",
  "6h": "كل 6 ساعات",
  daily: "يوميًا",
  weekly: "أسبوعيًا",
};

export const sourcePermissions = [
  "قراءة البيانات العامة",
  "قراءة الإحصائيات",
  "قراءة التفاعل",
  "قراءة البيانات الوصفية",
] as const;

export type DataSource = {
  id: string;
  name: string;
  mark: string;
  category: "منصات اجتماعية" | "منصات محتوى" | "مصادر إخبارية";
  description: string;
  status: ConnectionStatus;
  account: string | null;
  accountId: string | null;
  connectedAt: string | null;
  lastSync: string | null;
  records: number;
  lastImport: string | null;
  autoSync: boolean;
  frequency: SyncFrequency;
};

export const dataSources: DataSource[] = [
  {
    id: "x",
    name: "X",
    mark: "X",
    category: "منصات اجتماعية",
    description: "جمع المنشورات العامة والإشارات لقياس نبرة الخطاب وحجم التغطية.",
    status: "connected",
    account: "@alofoq_media",
    accountId: "x_88421037",
    connectedAt: "12 يناير 2026",
    lastSync: "قبل 8 دقائق",
    records: 184320,
    lastImport: "استيراد 2,140 منشورًا عامًا",
    autoSync: true,
    frequency: "hourly",
  },
  {
    id: "instagram",
    name: "Instagram",
    mark: "IG",
    category: "منصات اجتماعية",
    description: "قراءة المنشورات العامة والإحصائيات لتحليل الوصول والتفاعل البصري.",
    status: "connected",
    account: "alofoq.group",
    accountId: "ig_5521904",
    connectedAt: "12 يناير 2026",
    lastSync: "قبل 24 دقيقة",
    records: 96450,
    lastImport: "استيراد 780 منشورًا عامًا",
    autoSync: true,
    frequency: "6h",
  },
  {
    id: "facebook",
    name: "Facebook",
    mark: "FB",
    category: "منصات اجتماعية",
    description: "رصد الصفحات العامة والتعليقات المرتبطة بالكيانات المتابعة.",
    status: "reauth",
    account: "Al Ofoq Group",
    accountId: "fb_30158872",
    connectedAt: "3 فبراير 2026",
    lastSync: "قبل يومين",
    records: 61230,
    lastImport: "استيراد 410 منشورات عامة",
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    mark: "in",
    category: "منصات اجتماعية",
    description: "قراءة المحتوى المؤسسي العام لتحليل الخطاب المهني وشرائح الجمهور.",
    status: "connected",
    account: "al-ofoq-group",
    accountId: "li_77410",
    connectedAt: "21 يناير 2026",
    lastSync: "قبل ساعة",
    records: 34870,
    lastImport: "استيراد 320 منشورًا مؤسسيًا",
    autoSync: true,
    frequency: "daily",
  },
  {
    id: "tiktok",
    name: "TikTok",
    mark: "TT",
    category: "منصات محتوى",
    description: "جمع المقاطع العامة والبيانات الوصفية لدعم التحقق من المحتوى المرئي.",
    status: "disconnected",
    account: null,
    accountId: null,
    connectedAt: null,
    lastSync: null,
    records: 0,
    lastImport: null,
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "youtube",
    name: "YouTube",
    mark: "YT",
    category: "منصات محتوى",
    description: "قراءة الفيديوهات العامة وإحصائياتها لتحليل التغطية المرئية.",
    status: "connected",
    account: "AlOfoqMedia",
    accountId: "yt_UC91father",
    connectedAt: "8 ديسمبر 2025",
    lastSync: "قبل 12 دقيقة",
    records: 42980,
    lastImport: "استيراد 96 فيديو عامًا",
    autoSync: true,
    frequency: "6h",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    mark: "SC",
    category: "منصات محتوى",
    description: "رصد المحتوى العام في القصص الإخبارية والبيانات الوصفية المرتبطة.",
    status: "disconnected",
    account: null,
    accountId: null,
    connectedAt: null,
    lastSync: null,
    records: 0,
    lastImport: null,
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "telegram",
    name: "Telegram",
    mark: "TG",
    category: "منصات اجتماعية",
    description: "متابعة القنوات العامة لالتقاط الإشارات المبكرة وإشارات التنبؤ.",
    status: "connected",
    account: "raseen_signals",
    accountId: "tg_ch_44120",
    connectedAt: "2 مارس 2026",
    lastSync: "قبل 5 دقائق",
    records: 128740,
    lastImport: "استيراد 3,410 رسالة قناة عامة",
    autoSync: true,
    frequency: "hourly",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    mark: "WA",
    category: "منصات اجتماعية",
    description: "قراءة البيانات الوصفية للحساب المؤسسي دون الوصول إلى المحادثات الخاصة.",
    status: "reauth",
    account: "Al Ofoq Business",
    accountId: "wa_9665xxxx21",
    connectedAt: "18 فبراير 2026",
    lastSync: "قبل 4 أيام",
    records: 5120,
    lastImport: "استيراد بيانات وصفية للحساب",
    autoSync: false,
    frequency: "weekly",
  },
  {
    id: "rss",
    name: "RSS Feed",
    mark: "RSS",
    category: "مصادر إخبارية",
    description: "استقبال الأخبار من روابط RSS الموثوقة للصحف والمواقع الإخبارية.",
    status: "connected",
    account: "42 خلاصة إخبارية",
    accountId: "rss_bundle_42",
    connectedAt: "5 نوفمبر 2025",
    lastSync: "قبل 3 دقائق",
    records: 312460,
    lastImport: "استيراد 1,180 مادة إخبارية",
    autoSync: true,
    frequency: "hourly",
  },
  {
    id: "newsapi",
    name: "News API",
    mark: "API",
    category: "مصادر إخبارية",
    description: "واجهة برمجية لجمع الأخبار من ناشرين موثوقين حسب الكلمات المفتاحية.",
    status: "connected",
    account: "raseen-prod-key",
    accountId: "news_key_7741",
    connectedAt: "5 نوفمبر 2025",
    lastSync: "قبل 17 دقيقة",
    records: 268910,
    lastImport: "استيراد 940 مادة إخبارية",
    autoSync: true,
    frequency: "6h",
  },
];

export type SourceActivity = {
  id: string;
  type: "connected" | "synced" | "credentials" | "failed" | "permissions";
  title: string;
  source: string;
  time: string;
};

export const sourceActivities: SourceActivity[] = [
  { id: "a1", type: "connected", title: "تم ربط مصدر جديد", source: "Telegram", time: "قبل 5 دقائق" },
  { id: "a2", type: "synced", title: "اكتملت المزامنة", source: "RSS Feed", time: "قبل 12 دقيقة" },
  { id: "a3", type: "permissions", title: "تم تحديث الصلاحيات", source: "LinkedIn", time: "قبل ساعة" },
  { id: "a4", type: "failed", title: "فشل الاتصال", source: "Facebook", time: "قبل يومين" },
  { id: "a5", type: "credentials", title: "تم تحديث بيانات الاعتماد", source: "News API", time: "قبل 3 أيام" },
  { id: "a6", type: "synced", title: "اكتملت المزامنة", source: "YouTube", time: "قبل 4 أيام" },
];

export type SourceNotification = {
  id: string;
  kind: "expired" | "success" | "failed" | "connected";
  title: string;
  description: string;
  time: string;
};

export const sourceNotifications: SourceNotification[] = [
  {
    id: "n1",
    kind: "expired",
    title: "انتهت صلاحية الاتصال",
    description: "اتصال WhatsApp Business يتطلب إعادة المصادقة لمتابعة جمع البيانات الوصفية.",
    time: "قبل 4 أيام",
  },
  {
    id: "n2",
    kind: "success",
    title: "تمت المزامنة بنجاح",
    description: "استيراد 1,180 مادة إخبارية من خلاصات RSS الموثوقة.",
    time: "قبل 12 دقيقة",
  },
  {
    id: "n3",
    kind: "failed",
    title: "فشل الاتصال بالمصدر",
    description: "تعذر الوصول إلى صفحات Facebook العامة بسبب انتهاء صلاحية الرمز.",
    time: "قبل يومين",
  },
  {
    id: "n4",
    kind: "connected",
    title: "تم ربط مصدر جديد",
    description: "تم ربط قناة Telegram العامة وبدأ جمع الإشارات المبكرة.",
    time: "قبل 5 دقائق",
  },
];
