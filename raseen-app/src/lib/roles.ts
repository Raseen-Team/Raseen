export type RoleStatus = "active" | "inactive" | "custom";

export const roleStatusLabel: Record<RoleStatus, string> = {
  active: "نشط",
  inactive: "معطّل",
  custom: "مخصص",
};

export type Role = {
  id: string;
  name: string;
  description: string;
  users: number;
  status: RoleStatus;
  system: boolean;
};

export const roles: Role[] = [
  {
    id: "owner",
    name: "مالك المؤسسة",
    description: "صلاحيات كاملة على جميع الوحدات وإدارة الفواتير والأدوار.",
    users: 1,
    status: "active",
    system: true,
  },
  {
    id: "admin",
    name: "مدير النظام",
    description: "إدارة المستخدمين والصلاحيات وإعدادات المنصة ومصادر البيانات.",
    users: 3,
    status: "active",
    system: true,
  },
  {
    id: "media-manager",
    name: "مدير الإعلام",
    description: "إدارة عمليات الرصد والتحليل واعتماد التقارير الصادرة.",
    users: 6,
    status: "active",
    system: true,
  },
  {
    id: "analyst",
    name: "محلل إعلامي",
    description: "تشغيل التحليلات وقراءة المؤشرات وإنشاء التقارير التحليلية.",
    users: 14,
    status: "active",
    system: true,
  },
  {
    id: "fact-checker",
    name: "مدقق معلومات",
    description: "تشغيل عمليات التحقق من الصور والفيديو والروابط والمصادر.",
    users: 9,
    status: "active",
    system: true,
  },
  {
    id: "report-reader",
    name: "قارئ التقارير",
    description: "عرض التقارير والمؤشرات دون إمكانية التعديل أو الحذف.",
    users: 21,
    status: "active",
    system: true,
  },
  {
    id: "custom",
    name: "مستخدم مخصص",
    description: "دور مرن تُحدد صلاحياته يدويًا لكل وحدة داخل رسين.",
    users: 4,
    status: "custom",
    system: false,
  },
];

export const modules = [
  { id: "monitoring", label: "الرصد الإعلامي" },
  { id: "analysis", label: "التحليل الإعلامي" },
  { id: "verification", label: "التحقق" },
  { id: "metrics", label: "المؤشرات" },
  { id: "reports", label: "التقارير" },
  { id: "prediction", label: "التنبؤ" },
] as const;

export type ModuleId = (typeof modules)[number]["id"];

export const matrixColumns = [
  { id: "access", label: "الوصول" },
  { id: "view", label: "العرض" },
  { id: "create", label: "الإنشاء" },
  { id: "edit", label: "التعديل" },
  { id: "delete", label: "الحذف" },
  { id: "export", label: "التصدير" },
  { id: "share", label: "المشاركة" },
  { id: "approve", label: "اعتماد النتائج" },
  { id: "manage", label: "الإدارة الكاملة" },
] as const;

export type MatrixColumnId = (typeof matrixColumns)[number]["id"];

export type Matrix = Record<ModuleId, Record<MatrixColumnId, boolean>>;

const row = (on: MatrixColumnId[]): Record<MatrixColumnId, boolean> =>
  Object.fromEntries(matrixColumns.map((c) => [c.id, on.includes(c.id)])) as Record<
    MatrixColumnId,
    boolean
  >;

export const defaultMatrix: Matrix = {
  monitoring: row(["access", "view", "create", "edit", "export", "share"]),
  analysis: row(["access", "view", "create", "export", "share"]),
  verification: row(["access", "view", "create", "export"]),
  metrics: row(["access", "view", "export"]),
  reports: row(["access", "view", "create", "edit", "export", "share"]),
  prediction: row(["access", "view", "create", "export"]),
};

export const modulePermissions: { module: ModuleId; title: string; items: string[] }[] = [
  {
    module: "monitoring",
    title: "الرصد الإعلامي",
    items: [
      "يمكن البحث",
      "يمكن إنشاء عمليات رصد",
      "يمكن تعديل المرشحات",
      "يمكن حفظ النتائج",
      "يمكن تصدير النتائج",
      "يمكن مشاركة النتائج",
    ],
  },
  {
    module: "analysis",
    title: "التحليل الإعلامي",
    items: [
      "إجراء التحليل",
      "تشغيل تحليل الذكاء الاصطناعي",
      "عرض النتائج",
      "تحميل التحليلات",
      "مشاركة التحليلات",
    ],
  },
  {
    module: "verification",
    title: "التحقق",
    items: [
      "رفع صورة",
      "رفع فيديو",
      "التحقق من رابط",
      "التحقق من مصدر",
      "عرض نتائج التحقق",
      "تصدير التقرير",
    ],
  },
  {
    module: "metrics",
    title: "المؤشرات",
    items: ["عرض المؤشرات", "مقارنة المؤشرات", "تصدير المؤشرات", "إنشاء لوحات مخصصة"],
  },
  {
    module: "reports",
    title: "التقارير",
    items: [
      "إنشاء تقرير",
      "عرض التقارير",
      "تعديل التقارير",
      "حذف التقارير",
      "تصدير PDF",
      "مشاركة التقرير",
      "اعتماد التقرير",
    ],
  },
  {
    module: "prediction",
    title: "التنبؤ",
    items: [
      "عرض التوقعات",
      "تشغيل التنبؤ",
      "عرض إشارات الذكاء الاصطناعي",
      "تحليل المخاطر",
      "تصدير النتائج",
    ],
  },
];

export type UserStatus = "active" | "pending" | "disabled";

export const userStatusLabel: Record<UserStatus, string> = {
  active: "نشط",
  pending: "بانتظار التنشيط",
  disabled: "معطّل",
};

export type OrgUser = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  role: string;
  status: UserStatus;
  lastLogin: string;
};

export const orgUsers: OrgUser[] = [
  {
    id: "u1",
    name: "نورة العتيبي",
    email: "noura@raseen.sa",
    jobTitle: "مديرة الاتصال المؤسسي",
    role: "مالك المؤسسة",
    status: "active",
    lastLogin: "قبل 12 دقيقة",
  },
  {
    id: "u2",
    name: "فهد القحطاني",
    email: "fahad@raseen.sa",
    jobTitle: "مدير أنظمة المعلومات",
    role: "مدير النظام",
    status: "active",
    lastLogin: "قبل ساعة",
  },
  {
    id: "u3",
    name: "ريم الدوسري",
    email: "reem@raseen.sa",
    jobTitle: "رئيسة قسم الإعلام",
    role: "مدير الإعلام",
    status: "active",
    lastLogin: "قبل 3 ساعات",
  },
  {
    id: "u4",
    name: "عبدالله الشمري",
    email: "abdullah@raseen.sa",
    jobTitle: "محلل بيانات إعلامية",
    role: "محلل إعلامي",
    status: "active",
    lastLogin: "أمس 21:40",
  },
  {
    id: "u5",
    name: "سارة الحربي",
    email: "sara@raseen.sa",
    jobTitle: "مدققة معلومات",
    role: "مدقق معلومات",
    status: "active",
    lastLogin: "أمس 18:05",
  },
  {
    id: "u6",
    name: "ماجد الزهراني",
    email: "majed@raseen.sa",
    jobTitle: "مستشار إعلامي",
    role: "قارئ التقارير",
    status: "pending",
    lastLogin: "لم يسجل الدخول",
  },
  {
    id: "u7",
    name: "هند المطيري",
    email: "hind@raseen.sa",
    jobTitle: "أخصائية رصد",
    role: "مستخدم مخصص",
    status: "disabled",
    lastLogin: "قبل 9 أيام",
  },
];

export type RoleActivityType = "create" | "update" | "user" | "delete";

export const roleActivities: {
  id: string;
  type: RoleActivityType;
  title: string;
  detail: string;
  time: string;
}[] = [
  {
    id: "a1",
    type: "create",
    title: "تم إنشاء دور جديد",
    detail: "مستخدم مخصص — وحدات الرصد والتحليل",
    time: "قبل 20 دقيقة",
  },
  {
    id: "a2",
    type: "update",
    title: "تم تعديل صلاحيات",
    detail: "محلل إعلامي — تمكين تصدير المؤشرات",
    time: "قبل ساعتين",
  },
  {
    id: "a3",
    type: "user",
    title: "تم تغيير صلاحيات مستخدم",
    detail: "سارة الحربي — من قارئ التقارير إلى مدقق معلومات",
    time: "أمس 19:12",
  },
  {
    id: "a4",
    type: "delete",
    title: "تم حذف دور",
    detail: "مراقب مؤقت — لم يكن مرتبطًا بأي مستخدم",
    time: "قبل يومين",
  },
  {
    id: "a5",
    type: "update",
    title: "تم تعديل صلاحيات",
    detail: "مدير الإعلام — تمكين اعتماد التقارير",
    time: "قبل 3 أيام",
  },
];
