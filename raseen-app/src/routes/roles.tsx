import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Ban,
  CircleCheck,
  Copy,
  FilePenLine,
  Filter,
  History,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  UserRound,
  Users,
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
  SkeletonTable,
} from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  defaultMatrix,
  matrixColumns,
  modulePermissions,
  modules,
  roleActivities,
  roleStatusLabel,
  roles as seedRoles,
  userStatusLabel,
  orgUsers,
  type MatrixColumnId,
  type Matrix,
  type ModuleId,
  type Role,
  type RoleActivityType,
  type UserStatus,
} from "@/lib/roles";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "الأدوار والصلاحيات | رسين" },
      {
        name: "description",
        content:
          "إدارة أدوار الموظفين وصلاحيات الوصول لوحدات الرصد والتحليل والتحقق والمؤشرات والتقارير والتنبؤ داخل منصة رسين.",
      },
      { property: "og:title", content: "الأدوار والصلاحيات | رسين" },
      {
        property: "og:description",
        content: "قم بإدارة أدوار الموظفين وتحديد صلاحيات الوصول لكل وحدة داخل منصة رسين.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RolesPermissionsPage,
});

const num = (n: number) => n.toLocaleString("en-US");

function RoleStatusPill({ status }: { status: Role["status"] }) {
  const map = {
    active: { icon: CircleCheck, className: "border-success/25 bg-success/10 text-success" },
    inactive: { icon: Ban, className: "border-border bg-surface-2 text-muted-foreground" },
    custom: { icon: SlidersHorizontal, className: "border-gold/30 bg-gold/10 text-gold-foreground" },
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
      {roleStatusLabel[status]}
    </span>
  );
}

function UserStatusPill({ status }: { status: UserStatus }) {
  const map = {
    active: "border-success/25 bg-success/10 text-success",
    pending: "border-warning/30 bg-warning/10 text-warning",
    disabled: "border-border bg-surface-2 text-muted-foreground",
  }[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        map,
      )}
    >
      {userStatusLabel[status]}
    </span>
  );
}

function activityTone(type: RoleActivityType) {
  return {
    create: { icon: Plus, className: "border-success/25 bg-success/10 text-success" },
    update: { icon: FilePenLine, className: "border-primary-light/30 bg-primary-light/10 text-primary-light" },
    user: { icon: UserCog, className: "border-gold/30 bg-gold/10 text-gold-foreground" },
    delete: { icon: Trash2, className: "border-destructive/25 bg-destructive/10 text-destructive" },
  }[type];
}

function RoleCard({
  role,
  onView,
  onEdit,
  onDuplicate,
}: {
  role: Role;
  onView: (r: Role) => void;
  onEdit: (r: Role) => void;
  onDuplicate: (r: Role) => void;
}) {
  return (
    <article className="panel panel-interactive group flex flex-col p-5">
      <div className="flex items-start gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-linear-to-b from-surface to-surface-2 text-primary-light shadow-xs transition-colors group-hover:text-foreground">
          {role.system ? <ShieldCheck className="size-5" /> : <SlidersHorizontal className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
              {role.name}
            </h3>
            <RoleStatusPill status={role.status} />
          </div>
          <p className="num mt-1 text-[11px] text-muted-foreground">{num(role.users)} مستخدم</p>
        </div>
      </div>

      <p className="mt-3.5 flex-1 text-[13px] leading-relaxed text-muted-foreground">
        {role.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
        <Button size="sm" className="flex-1 gap-2" onClick={() => onView(role)}>
          <KeyRound className="size-4" />
          عرض الصلاحيات
        </Button>
        <Button size="sm" variant="outline" className="gap-2" onClick={() => onEdit(role)}>
          <Pencil className="size-4" />
          تعديل
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onDuplicate(role)}
          aria-label={`نسخ الدور ${role.name}`}
        >
          <Copy className="size-4" />
          نسخ الدور
        </Button>
      </div>
    </article>
  );
}

function RolesPermissionsPage() {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [activeRole, setActiveRole] = useState<Role>(seedRoles[3]!);
  const [matrix, setMatrix] = useState<Matrix>(defaultMatrix);
  const [detailRole, setDetailRole] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newModules, setNewModules] = useState<ModuleId[]>(["monitoring", "analysis"]);
  const [newPerms, setNewPerms] = useState<MatrixColumnId[]>(["access", "view"]);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const activePermissions = useMemo(
    () =>
      modules.reduce(
        (total, m) => total + matrixColumns.filter((c) => matrix[m.id][c.id]).length,
        0,
      ),
    [matrix],
  );

  const totalUsers = useMemo(() => roles.reduce((t, r) => t + r.users, 0), [roles]);

  const filteredUsers = useMemo(
    () =>
      orgUsers.filter((u) => {
        const q = query.trim();
        const matchQ =
          !q ||
          u.name.includes(q) ||
          u.email.toLowerCase().includes(q.toLowerCase()) ||
          u.jobTitle.includes(q);
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        const matchStatus = statusFilter === "all" || u.status === statusFilter;
        return matchQ && matchRole && matchStatus;
      }),
    [query, roleFilter, statusFilter],
  );

  const toggleCell = (moduleId: ModuleId, column: MatrixColumnId) => {
    setMatrix((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [column]: !prev[moduleId][column] },
    }));
  };

  const reload = () => {
    setLoading(true);
    setFailed(false);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("تم تحديث الأدوار والصلاحيات.");
    }, 1100);
  };

  const duplicateRole = (role: Role) => {
    const copy: Role = {
      ...role,
      id: `${role.id}-copy-${roles.length}`,
      name: `${role.name} (نسخة)`,
      users: 0,
      status: "custom",
      system: false,
    };
    setRoles((prev) => [...prev, copy]);
    toast.success("تم نسخ الدور بنجاح.", { description: copy.name });
  };

  const saveRole = () => {
    if (!newName.trim()) {
      setFailed(true);
      toast.error("تعذر حفظ الدور.", { description: "اسم الدور مطلوب." });
      return;
    }
    setRoles((prev) => [
      ...prev,
      {
        id: `custom-${prev.length}`,
        name: newName.trim(),
        description:
          newDescription.trim() ||
          `دور مخصص يشمل ${newModules.length} وحدات و${newPerms.length} صلاحيات.`,
        users: 0,
        status: "custom",
        system: false,
      },
    ]);
    setCreateOpen(false);
    setNewName("");
    setNewDescription("");
    setFailed(false);
    toast.success("تم إنشاء الدور بنجاح.");
  };

  return (
    <AppShell title="الأدوار والصلاحيات" breadcrumb={["رسين", "الأدوار والصلاحيات"]}>
      <PageHeader
        icon={Shield}
        eyebrow="إدارة المؤسسة"
        title="الأدوار والصلاحيات"
        description="قم بإدارة أدوار الموظفين وتحديد صلاحيات الوصول لكل وحدة داخل منصة رسين."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={reload}>
              <RefreshCw className={cn("size-4", loading && "animate-spin")} />
              تحديث
            </Button>
            <Button className="gap-2" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              إنشاء دور
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="عدد المستخدمين" value={num(totalUsers)} unit="داخل المؤسسة" icon={Users} />
        <KpiCard label="عدد الأدوار" value={num(roles.length)} icon={ShieldCheck} tone="neutral" />
        <KpiCard
          label="الصلاحيات النشطة"
          value={num(activePermissions)}
          unit={`من ${modules.length * matrixColumns.length}`}
          icon={KeyRound}
          tone="positive"
        />
        <KpiCard label="آخر تعديل" value="قبل 20 دقيقة" icon={History} />
      </div>

      {failed ? (
        <ErrorBlock
          title="تعذر حفظ التغييرات."
          description="حدث خطأ أثناء تحديث الأدوار والصلاحيات. يرجى المحاولة مرة أخرى."
          onRetry={() => setFailed(false)}
        />
      ) : null}

      <section className="space-y-4">
        <SectionTitle
          title="الأدوار الافتراضية"
          hint="أدوار جاهزة تغطي فرق الإعلام والتحليل والتحقق داخل المؤسسة"
          action={
            <span className="num inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
              <Filter className="size-3.5" />
              {roles.length}
            </span>
          }
        />
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : roles.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="لا توجد أدوار حتى الآن."
            description="ابدأ بإنشاء أول دور لتحديد صلاحيات الوصول لفريقك داخل رسين."
            actionLabel="إنشاء دور"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((r) => (
              <RoleCard
                key={r.id}
                role={r}
                onView={setDetailRole}
                onEdit={(role) => {
                  setActiveRole(role);
                  toast.success("تم تحديد الدور للتعديل.", { description: role.name });
                }}
                onDuplicate={duplicateRole}
              />
            ))}
          </div>
        )}
      </section>

      <Panel>
        <SectionTitle
          title="مصفوفة الصلاحيات"
          hint="حدد صلاحيات كل وحدة للدور المختار — الوحدات التحليلية فقط"
          action={
            <div className="w-[220px]">
              <Select
                value={activeRole.id}
                onValueChange={(v) => setActiveRole(roles.find((r) => r.id === v) ?? activeRole)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="اختر الدور">{activeRole.name}</SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="data-table min-w-[860px]">
            <thead>
              <tr>
                <th className="sticky start-0 z-2">الوحدة</th>
                {matrixColumns.map((c) => (
                  <th key={c.id} className="text-center">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap font-medium text-foreground">{m.label}</td>
                  {matrixColumns.map((c) => (
                    <td key={c.id} className="text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={matrix[m.id][c.id]}
                          onCheckedChange={() => toggleCell(m.id, c.id)}
                          aria-label={`${c.label} — ${m.label}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          الصلاحيات مخصصة لوحدات الرصد والتحليل والتحقق والمؤشرات والتقارير والتنبؤ فقط.
        </p>
      </Panel>

      <section className="space-y-4">
        <SectionTitle
          title="صلاحيات الوحدات"
          hint={`تفصيل الصلاحيات داخل كل وحدة للدور: ${activeRole.name}`}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modulePermissions.map((group) => (
            <Panel key={group.module}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                  {group.title}
                </h3>
                <span className="num rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
                  {group.items.length}
                </span>
              </div>
              <ul className="mt-4 divide-y divide-border/70">
                {group.items.map((item, i) => (
                  <li key={item} className="flex items-center justify-between gap-3 py-2.5">
                    <span className="text-[13px] leading-relaxed text-foreground">{item}</span>
                    <Switch defaultChecked={i < 4} aria-label={`${group.title} — ${item}`} />
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      </section>

      <Panel>
        <SectionTitle
          title="المستخدمون"
          hint="إدارة أدوار الموظفين وحالة حساباتهم"
          action={
            <span className="num inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-muted-foreground">
              <Filter className="size-3.5" />
              {filteredUsers.length} / {orgUsers.length}
            </span>
          }
        />
        <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="relative">
            <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 pe-9"
              placeholder="ابحث بالاسم أو البريد أو المسمى الوظيفي..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="البحث في المستخدمين"
            />
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">الدور</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11">
                <SelectValue>{roleFilter === "all" ? "كل الأدوار" : roleFilter}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأدوار</SelectItem>
                {seedRoles.map((r) => (
                  <SelectItem key={r.id} value={r.name}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">الحالة</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11">
                <SelectValue>
                  {statusFilter === "all"
                    ? "كل الحالات"
                    : userStatusLabel[statusFilter as UserStatus]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="pending">بانتظار التنشيط</SelectItem>
                <SelectItem value="disabled">معطّل</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : filteredUsers.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title="لا يوجد مستخدمون مطابقون."
            description="عدّل معايير البحث أو الفلاتر لعرض مستخدمي المؤسسة."
            actionLabel="مسح الفلاتر"
            onAction={() => {
              setQuery("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="data-table min-w-[880px]">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>البريد الإلكتروني</th>
                  <th>المسمى الوظيفي</th>
                  <th>الدور</th>
                  <th>الحالة</th>
                  <th>آخر تسجيل دخول</th>
                  <th className="text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="whitespace-nowrap font-medium text-foreground">{u.name}</td>
                    <td dir="ltr" className="num whitespace-nowrap text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap text-muted-foreground">{u.jobTitle}</td>
                    <td className="whitespace-nowrap">{u.role}</td>
                    <td>
                      <UserStatusPill status={u.status} />
                    </td>
                    <td className="num whitespace-nowrap text-muted-foreground">{u.lastLogin}</td>
                    <td className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`إجراءات ${u.name}`}
                            className="min-h-9 min-w-9"
                          >
                            <UserCog className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("تم فتح تعديل الصلاحيات.", { description: u.name })
                            }
                          >
                            <KeyRound className="size-4" />
                            تعديل الصلاحيات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.success("تم تغيير الدور.", { description: u.name })}
                          >
                            <ShieldCheck className="size-4" />
                            تغيير الدور
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.success("تم تعطيل الحساب.", { description: u.name })}
                          >
                            <Ban className="size-4" />
                            تعطيل الحساب
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel>
        <SectionTitle title="سجل النشاط" hint="آخر التعديلات على الأدوار والصلاحيات" />
        <ol className="relative space-y-4 ps-6">
          <span className="absolute inset-y-1 start-[11px] w-px bg-border" aria-hidden="true" />
          {roleActivities.map((a) => {
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
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              </li>
            );
          })}
        </ol>
      </Panel>

      <Dialog open={!!detailRole} onOpenChange={(o) => !o && setDetailRole(null)}>
        <DialogContent className="max-h-[88vh] w-[min(94vw,720px)] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>صلاحيات الدور: {detailRole?.name}</DialogTitle>
            <DialogDescription>{detailRole?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {modules.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-surface-2/50 p-3.5">
                <p className="text-[13px] font-semibold text-foreground">{m.label}</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {matrixColumns.map((c) => (
                    <span
                      key={c.id}
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[11px]",
                        matrix[m.id][c.id]
                          ? "border-success/25 bg-success/10 text-success"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[88vh] w-[min(94vw,640px)] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء دور جديد</DialogTitle>
            <DialogDescription>
              حدد اسم الدور والوحدات والصلاحيات الممنوحة داخل رسين.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">اسم الدور</Label>
              <Input
                className="h-11"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="مثال: محلل مؤشرات"
              />
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">الوصف</Label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="وصف مختصر لنطاق عمل الدور."
                rows={3}
              />
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">اختر الوحدات</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {modules.map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface-2/50 p-3 text-[13px] text-foreground transition-colors hover:border-border-strong"
                  >
                    <Checkbox
                      checked={newModules.includes(m.id)}
                      onCheckedChange={(v) =>
                        setNewModules((prev) =>
                          v ? [...prev, m.id] : prev.filter((x) => x !== m.id),
                        )
                      }
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">اختر الصلاحيات</Label>
              <div className="flex flex-wrap gap-2">
                {matrixColumns.map((c) => {
                  const on = newPerms.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        setNewPerms((prev) =>
                          on ? prev.filter((x) => x !== c.id) : [...prev, c.id],
                        )
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                        on
                          ? "border-primary-light/40 bg-primary-light/12 text-primary-light"
                          : "border-border bg-surface-2 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              إلغاء
            </Button>
            <Button className="gap-2" onClick={saveRole}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
