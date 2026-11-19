import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Brain,
  Building2,
  Check,
  KeyRound,
  Radar,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Bell,
  User,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { countries, languagesList, org, platforms, topSources } from "@/lib/mock";

export const Route = createFileRoute("/settings/")({
  head: () => ({
    meta: [
      { title: "الإعدادات | رسين" },
      {
        name: "description",
        content: "إعدادات الحساب والمؤسسة والإشعارات والرصد والذكاء الاصطناعي والأمان.",
      },
      { property: "og:title", content: "الإعدادات | رسين" },
      { property: "og:description", content: "اضبط تفضيلات منصة رسين لفريقك ومؤسستك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { id: "profile", label: "الحساب الشخصي", icon: User },
  { id: "org", label: "المؤسسة", icon: Building2 },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "monitoring", label: "الرصد", icon: Radar },
  { id: "ai", label: "الذكاء الاصطناعي", icon: Brain },
  { id: "security", label: "الأمان", icon: ShieldCheck },
] as const;

type SectionId = (typeof sections)[number]["id"];

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");
  const [saved, setSaved] = useState(false);
  const [keywords, setKeywords] = useState("الحوكمة, الذكاء الاصطناعي, التوسع الإقليمي");
  const [aiProvider, setAiProvider] = useState("OpenAI");

  const save = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <AppShell title="الإعدادات" breadcrumb={["رسين", "الإعدادات"]}>
      <PageHeader
        icon={SettingsIcon}
        title="الإعدادات"
        description="اضبط تفضيلات الحساب والمؤسسة ونطاق الرصد ومحرك التحليل."
        actions={
          <Button className="gap-2" onClick={save}>
            <Save className="size-4" />
            حفظ التغييرات
          </Button>
        }
      />

      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">
          <Check className="size-4" />
          تم حفظ التغييرات بنجاح.
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Panel padded={false} className="h-fit p-2">
          <nav aria-label="أقسام الإعدادات" className="space-y-1">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm transition-colors",
                    isActive
                      ? "bg-surface-2 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                  )}
                >
                  <s.icon className="size-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </Panel>

        <div className="space-y-4">
          {active === "profile" ? (
            <Panel>
              <SectionTitle title="الحساب الشخصي" hint="بيانات المستخدم الظاهرة للفريق" />
              <div className="flex items-center gap-4">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {org.initials}
                </span>
                <div>
                  <Button variant="outline" size="sm">
                    تغيير الصورة
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    PNG أو JPG بحجم لا يزيد عن 2 ميجابايت.
                  </p>
                </div>
              </div>
              <Separator className="my-5" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">الاسم</Label>
                  <Input className="h-11" defaultValue={org.user} />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">البريد</Label>
                  <Input className="h-11" dir="ltr" defaultValue={org.email} />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">اللغة</Label>
                  <Select defaultValue={languagesList[0]}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languagesList.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">الدور</Label>
                  <Input className="h-11" defaultValue={org.role} readOnly />
                </div>
              </div>
            </Panel>
          ) : null}

          {active === "org" ? (
            <Panel>
              <SectionTitle title="المؤسسة" hint="تظهر في ترويسة التقارير المصدّرة" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">اسم المؤسسة</Label>
                  <Input className="h-11" defaultValue={org.name} />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">القطاع</Label>
                  <Input className="h-11" defaultValue="الاتصال المؤسسي" />
                </div>
              </div>
              <Separator className="my-5" />
              <Row
                title="الشعار"
                description="يُستخدم في التقارير وشاشات العرض الداخلية."
              >
                <Button variant="outline" size="sm">
                  رفع الشعار
                </Button>
              </Row>
            </Panel>
          ) : null}

          {active === "notifications" ? (
            <Panel>
              <SectionTitle title="الإشعارات" hint="تحكم في التنبيهات التي تصل إلى فريقك" />
              <div className="divide-y divide-border">
                <Row title="تنبيهات الأزمات" description="عند ارتفاع مؤشر الخطر عن 60.">
                  <Switch defaultChecked />
                </Row>
                <Row title="تنبيهات الترند" description="عند صعود موضوع جديد إلى القائمة العشرة.">
                  <Switch defaultChecked />
                </Row>
                <Row title="تنبيهات السمعة" description="عند انخفاض مؤشر السمعة 3 نقاط أو أكثر.">
                  <Switch defaultChecked />
                </Row>
                <Row title="البريد الإلكتروني" description="ملخص يومي إلى بريد الفريق.">
                  <Switch />
                </Row>
              </div>
              <Separator className="my-5" />
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  بريد استلام التنبيهات
                </Label>
                <Input className="h-11" dir="ltr" defaultValue={org.email} />
              </div>
            </Panel>
          ) : null}

          {active === "monitoring" ? (
            <Panel>
              <SectionTitle title="الرصد" hint="نطاق البيانات التي يجمعها المحرك" />
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  الكلمات المفتاحية
                </Label>
                <Input
                  className="h-11"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  افصل بين الكلمات بفاصلة. الكلمات المفتاحية تحدد ما يُرصد ويُحلل.
                </p>
              </div>

              <Separator className="my-5" />
              <p className="mb-2 text-xs font-semibold text-muted-foreground">الدول</p>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => (
                  <span
                    key={c}
                    className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <Separator className="my-5" />
              <p className="mb-2 text-xs font-semibold text-muted-foreground">المنصات</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-foreground"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <Separator className="my-5" />
              <p className="mb-2 text-xs font-semibold text-muted-foreground">المصادر</p>
              <div className="divide-y divide-border">
                {topSources.slice(0, 5).map((s) => (
                  <Row key={s.name} title={s.name} description={`حصة ${s.share}% من الإشارات`}>
                    <Switch defaultChecked />
                  </Row>
                ))}
              </div>
            </Panel>
          ) : null}

          {active === "ai" ? (
            <Panel>
              <SectionTitle title="الذكاء الاصطناعي" hint="محرك التحليل المستخدم في الرؤى والملخصات" />
              <div className="grid gap-3 sm:grid-cols-3">
                {["OpenAI", "Gemini", "Claude"].map((prov) => (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => setAiProvider(prov)}
                    aria-pressed={aiProvider === prov}
                    className={cn(
                      "rounded-xl border border-border bg-surface-2/50 p-4 text-start transition-colors",
                      aiProvider === prov && "border-primary-light/50 ring-1 ring-primary-light/30",
                    )}
                  >
                    <p className="text-sm font-semibold text-foreground">{prov}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {prov === "OpenAI"
                        ? "دقة عالية في التحليل العربي الطويل."
                        : prov === "Gemini"
                          ? "أداء سريع في الملخصات القصيرة."
                          : "تحليل سياقي دقيق للنصوص الحساسة."}
                    </p>
                  </button>
                ))}
              </div>
              <Separator className="my-5" />
              <div className="divide-y divide-border">
                <Row title="تفسير الرؤى" description="إظهار سبب أهمية كل رؤية تحليلية.">
                  <Switch defaultChecked />
                </Row>
                <Row title="درجة الثقة" description="إظهار نسبة الثقة مع كل مخرج تحليلي.">
                  <Switch defaultChecked />
                </Row>
                <Row title="تحليل تلقائي للإشارات الجديدة" description="تحليل فوري عند الرصد.">
                  <Switch />
                </Row>
              </div>
            </Panel>
          ) : null}

          {active === "security" ? (
            <Panel>
              <SectionTitle title="الأمان" hint="حماية الحساب والجلسات" />


              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">
                    كلمة المرور الحالية
                  </Label>
                  <Input className="h-11" type="password" dir="ltr" />
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">
                    كلمة المرور الجديدة
                  </Label>
                  <Input className="h-11" type="password" dir="ltr" />
                </div>
              </div>
              <Button variant="outline" className="mt-4 gap-2">
                <KeyRound className="size-4" />
                تحديث كلمة المرور
              </Button>

              <Separator className="my-5" />
              <Row
                title="التحقق بخطوتين"
                description="طلب رمز تحقق إضافي عند تسجيل الدخول من جهاز جديد."
              >
                <Switch defaultChecked />
              </Row>

              <Separator className="my-5" />
              <p className="mb-2 text-xs font-semibold text-muted-foreground">الجلسات النشطة</p>
              <div className="divide-y divide-border">
                {[
                  { device: "Chrome — الرياض", time: "الجلسة الحالية" },
                  { device: "Safari — iPhone", time: "قبل 3 ساعات" },
                  { device: "Edge — جهاز مكتبي", time: "أمس" },
                ].map((s) => (
                  <Row key={s.device} title={s.device} description={s.time}>
                    <Button variant="ghost" size="sm">
                      إنهاء
                    </Button>
                  </Row>
                ))}
              </div>
            </Panel>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
