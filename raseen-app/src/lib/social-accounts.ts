/**
 * بيانات تجريبية لصفحة «حسابات التواصل الاجتماعي» — رسين
 * جمع البيانات فقط: رصد، تحليل، تحقق، تقارير، تنبؤ.
 */

export type AccountStatus = "connected" | "disconnected" | "reauth";

export const accountStatusLabel: Record<AccountStatus, string> = {
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

export const accountPermissions = [
  "قراءة البيانات العامة",
  "قراءة الإحصائيات",
  "قراءة التفاعل",
  "قراءة البيانات الوصفية",
] as const;

export type SocialAccount = {
  id: string;
  platform: string;
  category: "منصات اجتماعية" | "منصات فيديو" | "منصات مراسلة";
  description: string;
  status: AccountStatus;
  account: string | null;
  username: string | null;
  accountId: string | null;
  connectedAt: string | null;
  lastSync: string | null;
  collected: number;
  lastImport: string | null;
  autoSync: boolean;
  frequency: SyncFrequency;
};

export const socialAccounts: SocialAccount[] = [
  {
    id: "x",
    platform: "X",
    category: "منصات اجتماعية",
    description: "جمع المنشورات العامة والإشارات لقياس نبرة الخطاب وحجم التغطية.",
    status: "connected",
    account: "الأفق الإعلامية",
    username: "@alofoq_media",
    accountId: "x_88421037",
    connectedAt: "12 يناير 2026",
    lastSync: "قبل 8 دقائق",
    collected: 184320,
    lastImport: "استيراد 2,140 منشورًا عامًا",
    autoSync: true,
    frequency: "hourly",
  },
  {
    id: "instagram",
    platform: "Instagram",
    category: "منصات اجتماعية",
    description: "قراءة المنشورات العامة والإحصائيات لتحليل الوصول والتفاعل البصري.",
    status: "connected",
    account: "مجموعة الأفق",
    username: "@alofoq.group",
    accountId: "ig_5521904",
    connectedAt: "12 يناير 2026",
    lastSync: "قبل 24 دقيقة",
    collected: 96450,
    lastImport: "استيراد 780 منشورًا عامًا",
    autoSync: true,
    frequency: "6h",
  },
  {
    id: "facebook",
    platform: "Facebook",
    category: "منصات اجتماعية",
    description: "رصد الصفحات العامة والتعليقات المرتبطة بالكيانات المتابعة.",
    status: "reauth",
    account: "Al Ofoq Group",
    username: "@AlOfoqGroup",
    accountId: "fb_30158872",
    connectedAt: "3 فبراير 2026",
    lastSync: "قبل يومين",
    collected: 61230,
    lastImport: "استيراد 410 منشورات عامة",
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    category: "منصات اجتماعية",
    description: "قراءة المحتوى المؤسسي العام لتحليل الخطاب المهني وشرائح الجمهور.",
    status: "connected",
    account: "Al Ofoq Group",
    username: "@al-ofoq-group",
    accountId: "li_77410",
    connectedAt: "21 يناير 2026",
    lastSync: "قبل ساعة",
    collected: 34870,
    lastImport: "استيراد 320 منشورًا مؤسسيًا",
    autoSync: true,
    frequency: "daily",
  },
  {
    id: "tiktok",
    platform: "TikTok",
    category: "منصات فيديو",
    description: "جمع المقاطع العامة والبيانات الوصفية لدعم التحقق من المحتوى المرئي.",
    status: "disconnected",
    account: null,
    username: null,
    accountId: null,
    connectedAt: null,
    lastSync: null,
    collected: 0,
    lastImport: null,
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "youtube",
    platform: "YouTube",
    category: "منصات فيديو",
    description: "قراءة الفيديوهات العامة وإحصائياتها لتحليل التغطية المرئية.",
    status: "connected",
    account: "قناة الأفق",
    username: "@AlOfoqMedia",
    accountId: "yt_UC9114820",
    connectedAt: "8 ديسمبر 2025",
    lastSync: "قبل 12 دقيقة",
    collected: 42980,
    lastImport: "استيراد 96 فيديو عامًا",
    autoSync: true,
    frequency: "6h",
  },
  {
    id: "snapchat",
    platform: "Snapchat",
    category: "منصات فيديو",
    description: "رصد المحتوى العام في القصص الإخبارية والبيانات الوصفية المرتبطة.",
    status: "disconnected",
    account: null,
    username: null,
    accountId: null,
    connectedAt: null,
    lastSync: null,
    collected: 0,
    lastImport: null,
    autoSync: false,
    frequency: "daily",
  },
  {
    id: "telegram",
    platform: "Telegram",
    category: "منصات مراسلة",
    description: "متابعة القنوات العامة لالتقاط الإشارات المبكرة وإشارات التنبؤ.",
    status: "connected",
    account: "قناة رصد الإشارات",
    username: "@raseen_signals",
    accountId: "tg_ch_44120",
    connectedAt: "2 مارس 2026",
    lastSync: "قبل 5 دقائق",
    collected: 128740,
    lastImport: "استيراد 3,410 رسالة قناة عامة",
    autoSync: true,
    frequency: "hourly",
  },
  {
    id: "whatsapp",
    platform: "WhatsApp Business",
    category: "منصات مراسلة",
    description: "قراءة البيانات الوصفية للحساب المؤسسي دون الوصول إلى المحادثات الخاصة.",
    status: "reauth",
    account: "Al Ofoq Business",
    username: "@alofoq.business",
    accountId: "wa_9665xxxx21",
    connectedAt: "18 فبراير 2026",
    lastSync: "قبل 4 أيام",
    collected: 5120,
    lastImport: "استيراد بيانات وصفية للحساب",
    autoSync: false,
    frequency: "weekly",
  },
];

export type AccountActivity = {
  id: string;
  type: "connected" | "synced" | "credentials" | "failed" | "permissions";
  title: string;
  account: string;
  time: string;
};

export const accountActivities: AccountActivity[] = [
  { id: "a1", type: "connected", title: "تم ربط حساب جديد", account: "Telegram — @raseen_signals", time: "قبل 5 دقائق" },
  { id: "a2", type: "synced", title: "اكتملت المزامنة", account: "X — @alofoq_media", time: "قبل 8 دقائق" },
  { id: "a3", type: "permissions", title: "تم تحديث الصلاحيات", account: "LinkedIn — @al-ofoq-group", time: "قبل ساعة" },
  { id: "a4", type: "failed", title: "فشل الاتصال", account: "Facebook — @AlOfoqGroup", time: "قبل يومين" },
  { id: "a5", type: "credentials", title: "تم تحديث بيانات الاعتماد", account: "WhatsApp Business", time: "قبل 3 أيام" },
  { id: "a6", type: "synced", title: "اكتملت المزامنة", account: "YouTube — @AlOfoqMedia", time: "قبل 4 أيام" },
];

export type AccountNotification = {
  id: string;
  kind: "expired" | "success" | "failed" | "connected";
  title: string;
  description: string;
  time: string;
};

export const accountNotifications: AccountNotification[] = [
  {
    id: "n1",
    kind: "expired",
    title: "انتهت صلاحية الاتصال",
    description: "حساب WhatsApp Business يتطلب إعادة المصادقة لمتابعة جمع البيانات الوصفية.",
    time: "قبل 4 أيام",
  },
  {
    id: "n2",
    kind: "success",
    title: "تمت المزامنة بنجاح",
    description: "استيراد 2,140 منشورًا عامًا من حساب X المرتبط.",
    time: "قبل 8 دقائق",
  },
  {
    id: "n3",
    kind: "failed",
    title: "فشل الاتصال بالحساب",
    description: "تعذر الوصول إلى صفحة Facebook العامة بسبب انتهاء صلاحية الرمز.",
    time: "قبل يومين",
  },
  {
    id: "n4",
    kind: "connected",
    title: "تم ربط حساب جديد",
    description: "تم ربط قناة Telegram العامة وبدأ جمع الإشارات المبكرة.",
    time: "قبل 5 دقائق",
  },
];
