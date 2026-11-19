import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpDown,
  Ban,
  ChartBar,
  Check,
  CircleCheck,
  Clock,
  Database,
  Eye,
  Facebook,
  Filter,
  Ghost,
  Heart,
  Instagram,
  KeyRound,
  Link2,
  Linkedin,
  MessageCircle,
  Music2,
  Plug,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Tags,
  TriangleAlert,
  Twitter,
  Unplug,
  Users,
  Youtube,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/raseen/shell";
import {
  EmptyState,
  ErrorBlock,
  KpiCard,
  PageHeader,
  Panel,
  SectionTitle,
  SkeletonCard,
} from "@/components/raseen/blocks";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  accountActivities,
  accountNotifications,
  accountPermissions,
  accountStatusLabel,
  socialAccounts,
  syncFrequencyLabel,
  type AccountStatus,
  type SocialAccount,
  type SyncFrequency,
} from "@/lib/social-accounts";

export const Route = createFileRoute("/social-accounts")({
  head: () => ({
    meta: [
      { title: "حسابات التواصل الاجتماعي | رسين" },
      {
        name: "description",
        content:
          "اربط حسابات ومنصات التواصل الاجتماعي داخل رسين لجمع البيانات العامة وتحليلها في الرصد والتحليل والتحقق والتقارير والتنبؤ.",
      },
      { property: "og:title", content: "حسابات التواصل الاجتماعي | رسين" },
      {
        property: "og:description",
        content:
          "قم بربط حسابات ومنصات التواصل الاجتماعي لجمع البيانات وتحليلها داخل رسين.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SocialAccountsPage,
});

const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  x: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  tiktok: Music2,
  youtube: Youtube,
  snapchat: Ghost,
  telegram: Send,
  whatsapp: MessageCircle,
};

const permissionIcons = [Eye, ChartBar, Heart, Tags];

const num = (n: number) => n.toLocaleString("en-US");

function StatusPill({ status }: { status: AccountStatus }) {
  const map = {
    connected: { icon: CircleCheck, className: "border-success/25 bg-success/10 text-success" },
    disconnected: { icon: Ban, className: "border-border bg-surface-2 text-muted-foreground" },
    reauth: { icon: TriangleAlert, className: "border-warning/25 bg-warning/10 text-warning" },
  }[status];
  const Icon = map.icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        map.className,
      )}
    >
      <Icon className="size-3.5" />
      {accountStatusLabel[status]}
    </span>
  );
}

function MetaRow({ label, value, dir }: { label: string; value: string; dir?: "ltr" }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span
        dir={dir}
        className={cn("truncate text-[13px] font-medium text-foreground", dir && "num")}
      >
        {value}
      </span>
    </div>
  );
}

function AccountCard({
  item,
  onConnect,
  onDisconnect,
  onSettings,
}: {
  item: SocialAccount;
  onConnect: (s: SocialAccount) => void;
  onDisconnect: (s: SocialAccount) => void;
  onSettings: (s: SocialAccount) => void;
}) {
  const Icon = platformIcons[item.id] ?? Plug;
  const connected = item.status !== "disconnected";

  return (
    <article className="panel panel-interactive group flex flex-col p-5">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-linear-to-b from-surface to-surface-2 text-primary-light shadow-xs transition-colors group-hover:text-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {item.platform}
            </h3>
            <StatusPill status={item.status} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{item.category}</p>
        </div>
      </div>

      <p className="mt-3.5 text-[13px] leading-relaxed text-muted-foreground">{item.description}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-border/70 bg-surface-2/50 p-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">اسم الحساب</p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">
            {item.account ?? "—"}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">آخر مزامنة</p>
          <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">
            {item.lastSync ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
        {connected ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => onDisconnect(item)}
            >
              <Unplug className="size-4" />
              فصل
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onSettings(item)}>
              <Settings2 className="size-4" />
              الإعدادات
            </Button>
            {item.status === "reauth" ? (
              <Button size="sm" className="ms-auto gap-1.5" onClick={() => onConnect(item)}>
                <KeyRound className="size-4" />
                إعادة المصادقة
              </Button>
            ) : null}
          </>
        ) : (
          <>
            <Button size="sm" className="gap-1.5" onClick={() => onConnect(item)}>
              <Link2 className="size-4" />
              ربط
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => onSettings(item)}>
              <Settings2 className="size-4" />
              الإعدادات
            </Button>
          </>
        )}
      </div>
    </article>
  );
}

function activityTone(type: string) {
  if (type === "failed")
    return { icon: TriangleAlert, className: "border-destructive/25 bg-destructive/10 text-destructive" };
  if (type === "connected")
    return { icon: Link2, className: "border-success/25 bg-success/10 text-success" };
  if (type === "synced")
    return { icon: RefreshCw, className: "border-primary-light/25 bg-primary-light/10 text-primary-light" };
  if (type === "credentials")
    return { icon: KeyRound, className: "border-warning/25 bg-warning/10 text-warning" };
  return { icon: ShieldCheck, className: "border-border bg-surface-2 text-muted-foreground" };
}

function notificationTone(kind: string) {
  if (kind === "expired")
    return { icon: Clock, className: "border-warning/25 bg-warning/10 text-warning" };
  if (kind === "failed")
    return { icon: TriangleAlert, className: "border-destructive/25 bg-destructive/10 text-destructive" };
  if (kind === "success")
    return { icon: CircleCheck, className: "border-success/25 bg-success/10 text-success" };
  return { icon: Link2, className: "border-primary-light/25 bg-primary-light/10 text-primary-light" };
}

function SocialAccountsPage() {
  const [items, setItems] = useState<SocialAccount[]>(socialAccounts);
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("collected");
  const [lastSync, setLastSync] = useState("all");
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [active, setActive] = useState<SocialAccount | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((s) => {
      const matchQuery =
        !q ||
        s.platform.toLowerCase().includes(q) ||
        s.description.includes(query.trim()) ||
        (s.account ?? "").toLowerCase().includes(q) ||
        (s.username ?? "").toLowerCase().includes(q);
      const matchPlatform = platform === "all" || s.category === platform;
      const matchStatus = status === "all" || s.status === status;
      const matchSync =
        lastSync === "all" ||
        (lastSync === "recent" && !!s.lastSync && s.lastSync.includes("دقائق")) ||
        (lastSync === "day" && !!s.lastSync && !s.lastSync.includes("أيام")) ||
        (lastSync === "stale" &&
          (!s.lastSync || s.lastSync.includes("أيام") || s.lastSync.includes("يومين")));
      return matchQuery && matchPlatform && matchStatus && matchSync;
    });

    list = [...list].sort((a, b) => {
      if (sort === "name") return a.platform.localeCompare(b.platform, "ar");
      if (sort === "status") return a.status.localeCompare(b.status);
      return b.collected - a.collected;
    });
    return list;
  }, [items, query, platform, status, sort, lastSync]);

  const connectedCount = items.filter((s) => s.status === "connected").length;
  const totalCollected = items.reduce((sum, s) => sum + s.collected, 0);
  const activeCount = items.filter((s) => s.status === "connected" && s.autoSync).length;

  const runSync = (label: string) => {
    setLoading(true);
    setFailed(null);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("تمت المزامنة بنجاح.", { description: label });
    }, 1400);
  };

  const connect = (item: SocialAccount) => {
    setLoading(true);
    setFailed(null);
    window.setTimeout(() => {
      setLoading(false);
      if (item.id === "snapchat") {
        setFailed(item.platform);
        return;
      }
      setItems((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? {
                ...s,
                status: "connected",
                account: s.account ?? `حساب ${s.platform}`,
                username: s.username ?? `@raseen_${s.id}`,
                accountId: s.accountId ?? `${s.id}_new_0001`,
                connectedAt: s.connectedAt ?? "اليوم",
                lastSync: "قبل لحظات",
                lastImport: s.lastImport ?? "استيراد أولي للبيانات العامة",
              }
            : s,
        ),
      );
      toast.success("تم ربط الحساب بنجاح.", { description: item.platform });
    }, 1200);
  };

  const disconnect = (item: SocialAccount) => {
    setItems((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, status: "disconnected", autoSync: false } : s)),
    );
    toast.success("تم فصل الحساب.", { description: item.platform });
  };

  const updateActive = (patch: Partial<SocialAccount>) => {
    if (!active) return;
    const next = { ...active, ...patch };
    setActive(next);
    setItems((prev) => prev.map((s) => (s.id === next.id ? next : s)));
  };

  return (
    <AppShell
      title="حسابات التواصل الاجتماعي"
      breadcrumb={["رسين", "حسابات التواصل الاجتماعي"]}
    >
      <PageHeader
        icon={Link2}
        eyebrow="مصادر الجمع"
        title="حسابات التواصل الاجتماعي"
        description="قم بربط حسابات ومنصات التواصل الاجتماعي لجمع البيانات وتحليلها داخل رسين."
        actions={
          <Button className="gap-2" onClick={() => runSync("جميع الحسابات المتصلة")}>
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
            مزامنة الآن
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="عدد الحسابات المتصلة"
          value={num(connectedCount)}
          unit={`من ${items.length}`}
          icon={Link2}
        />
        <KpiCard
          label="إجمالي البيانات المستوردة"
          value={num(totalCollected)}
          icon={Database}
          tone="positive"
        />
        <KpiCard label="آخر مزامنة" value="قبل 5 دقائق" icon={Clock} tone="neutral" />
        <KpiCard
          label="الحسابات النشطة"
          value={num(activeCount)}
          unit="مزامنة تلقائية"
          icon={Activity}
        />
      </div>

      <Panel>
        <SectionTitle
          title="البحث والفلاتر"
          hint="حدد الحسابات المطلوبة حسب المنصة وحالة الاتصال وآخر مزامنة"
          action={
            <span className="num inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
              <Filter className="size-3.5" />
              {filtered.length} / {items.length}
            </span>
          }
        />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-1">
            <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 pe-9"
              placeholder="ابحث عن منصة أو حساب..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="البحث في الحسابات المرتبطة"
            />
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">المنصة</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المنصات</SelectItem>
                <SelectItem value="منصات اجتماعية">منصات اجتماعية</SelectItem>
                <SelectItem value="منصات فيديو">منصات فيديو</SelectItem>
                <SelectItem value="منصات مراسلة">منصات مراسلة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">حالة الاتصال</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="connected">متصل</SelectItem>
                <SelectItem value="disconnected">غير متصل</SelectItem>
                <SelectItem value="reauth">يتطلب إعادة المصادقة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">الترتيب حسب</Label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-11">
                <ArrowUpDown className="size-4 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collected">حجم البيانات</SelectItem>
                <SelectItem value="name">اسم المنصة</SelectItem>
                <SelectItem value="status">حالة الاتصال</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">آخر مزامنة</Label>
            <Select value={lastSync} onValueChange={setLastSync}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفترات</SelectItem>
                <SelectItem value="recent">خلال الساعة</SelectItem>
                <SelectItem value="day">خلال 24 ساعة</SelectItem>
                <SelectItem value="stale">أقدم من يوم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>

      {failed ? (
        <ErrorBlock
          title="تعذر الاتصال بالحساب."
          description={`يرجى المحاولة مرة أخرى. لم يكتمل الاتصال بـ ${failed}.`}
          onRetry={() => setFailed(null)}
        />
      ) : null}

      <section className="space-y-4">
        <SectionTitle
          title="الحسابات والمنصات"
          hint="حسابات عامة تُستخدم في الرصد والتحليل والتحقق والتقارير والتنبؤ — جمع بيانات فقط"
        />
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="لا توجد حسابات مرتبطة حتى الآن."
            description="ابدأ بربط أول حساب لجمع البيانات الإعلامية."
            actionLabel="مسح الفلاتر"
            onAction={() => {
              setQuery("");
              setPlatform("all");
              setStatus("all");
              setLastSync("all");
            }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((s) => (
              <AccountCard
                key={s.id}
                item={s}
                onConnect={connect}
                onDisconnect={disconnect}
                onSettings={setActive}
              />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Panel>
          <SectionTitle title="سجل النشاط" hint="آخر عمليات الربط والمزامنة والصلاحيات" />
          <ol className="relative space-y-4 ps-6">
            <span className="absolute inset-y-1 start-[11px] w-px bg-border" aria-hidden="true" />
            {accountActivities.map((a) => {
              const tone = activityTone(a.type);
              const Icon = tone.icon;
              return (
                <li key={a.id} className="relative">
                  <span
                    className={cn(
                      "absolute -start-6 grid size-6 place-items-center rounded-full border",
                      tone.className,
                    )}
                  >
                    <Icon className="size-3" />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-foreground">{a.title}</p>
                    <span className="text-[11px] text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.account}</p>
                </li>
              );
            })}
          </ol>
        </Panel>

        <Panel>
          <SectionTitle title="الإشعارات" hint="تنبيهات حالة الحسابات والمزامنة" />
          <ul className="space-y-3">
            {accountNotifications.map((n) => {
              const tone = notificationTone(n.kind);
              const Icon = tone.icon;
              return (
                <li
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface-2/40 p-3.5 transition-colors hover:bg-surface-2"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl border",
                      tone.className,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-foreground">{n.title}</p>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {n.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-h-[88vh] max-w-[min(94vw,620px)] overflow-y-auto" dir="rtl">
          {active ? (
            <>
              <DialogHeader className="text-start">
                <DialogTitle className="flex items-center gap-2.5 text-base">
                  {(() => {
                    const Icon = platformIcons[active.id] ?? Plug;
                    return <Icon className="size-5 text-primary-light" />;
                  })()}
                  إعدادات {active.platform}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  معلومات الحساب المرتبط وإعدادات المزامنة والصلاحيات — جمع البيانات فقط.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-1 rounded-2xl border border-border bg-surface-2/40 p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-foreground">معلومات الحساب المرتبط</p>
                  <StatusPill status={active.status} />
                </div>
                <div className="divide-y divide-border/70">
                  <MetaRow label="اسم الحساب" value={active.account ?? "—"} />
                  <MetaRow label="اسم المستخدم" value={active.username ?? "—"} dir="ltr" />
                  <MetaRow label="معرف الحساب" value={active.accountId ?? "—"} dir="ltr" />
                  <MetaRow label="تاريخ الربط" value={active.connectedAt ?? "—"} />
                  <MetaRow label="آخر مزامنة" value={active.lastSync ?? "—"} />
                  <MetaRow label="حالة الاتصال" value={accountStatusLabel[active.status]} />
                  <MetaRow
                    label="عدد البيانات التي تم جمعها"
                    value={num(active.collected)}
                    dir="ltr"
                  />
                  <MetaRow label="آخر عملية استيراد" value={active.lastImport ?? "—"} />
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-[13px] font-semibold text-foreground">إعدادات المزامنة</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-surface-2/40 p-3.5">
                  <div>
                    <p className="text-[13px] font-medium text-foreground">
                      تفعيل المزامنة التلقائية
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      عند التعطيل تُجمع البيانات فقط عند طلب المزامنة يدويًا.
                    </p>
                  </div>
                  <Switch
                    checked={active.autoSync}
                    onCheckedChange={(v) => updateActive({ autoSync: v })}
                    aria-label="المزامنة التلقائية"
                  />
                </div>
                <div className="mt-3">
                  <Label className="mb-2 block text-xs text-muted-foreground">تكرار المزامنة</Label>
                  <Select
                    value={active.frequency}
                    onValueChange={(v) => updateActive({ frequency: v as SyncFrequency })}
                    disabled={!active.autoSync}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(syncFrequencyLabel) as SyncFrequency[]).map((f) => (
                        <SelectItem key={f} value={f}>
                          {syncFrequencyLabel[f]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="mt-3 w-full gap-2"
                  onClick={() => runSync(active.platform)}
                  disabled={active.status === "disconnected"}
                >
                  <RefreshCw className={cn("size-4", loading && "animate-spin")} />
                  مزامنة الآن
                </Button>
              </div>

              <Separator className="my-4" />

              <div>
                <p className="text-[13px] font-semibold text-foreground">الصلاحيات</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  صلاحيات قراءة فقط — لا تتضمن أي صلاحيات نشر أو إدارة محتوى.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {accountPermissions.map((p, i) => {
                    const Icon = permissionIcons[i] ?? Check;
                    return (
                      <li
                        key={p}
                        className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface-2/40 px-3 py-2.5 text-[13px] text-foreground"
                        aria-disabled="true"
                      >
                        <Icon className="size-4 shrink-0 text-primary-light" />
                        <span className="truncate">{p}</span>
                        <Check className="ms-auto size-3.5 shrink-0 text-success" />
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {active.status === "disconnected" ? (
                  <Button className="gap-2" onClick={() => connect(active)}>
                    <Link2 className="size-4" />
                    ربط الحساب
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      disconnect(active);
                      setActive(null);
                    }}
                  >
                    <Unplug className="size-4" />
                    فصل الحساب
                  </Button>
                )}
                <Button variant="ghost" className="ms-auto" onClick={() => setActive(null)}>
                  إغلاق
                </Button>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
