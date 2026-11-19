import type { ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleAlert,
  CircleCheck,
  CircleMinus,
  Inbox,
  Loader2,
  Minus,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sentiment } from "@/lib/mock";
import { sentimentLabel } from "@/lib/mock";

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  description,
  actions,
  icon: Icon,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
}) {
  return (
    <header className="rs-head animate-rise grid grid-cols-1 items-start gap-x-4 gap-y-5 pb-2 pt-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3.5">
        {Icon ? (
          <span className="rs-ico grid size-11 shrink-0 place-items-center rounded-2xl border">
            <Icon className="size-5" />
          </span>
        ) : null}
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-1.5">{eyebrow}</p> : null}
          <h1 className="text-[24px] font-bold leading-tight sm:truncate sm:text-[30px]">
            {title}
          </h1>
          {description ? (
            <p className="rs-desc mt-1.5 max-w-2xl text-sm leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function SectionTitle({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {hint ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* ---------------- Panel ---------------- */

export function Panel({
  children,
  className,
  padded = true,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  interactive?: boolean;
}) {
  return (
    <section
      className={cn("panel", padded && "p-5 sm:p-6", interactive && "panel-interactive", className)}
    >
      {children}
    </section>
  );
}


/* ---------------- Delta / sentiment badges ---------------- */

export function DeltaBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value > 0;
  const flat = value === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        flat && "border-border bg-muted text-muted-foreground",
        !flat && up && "border-success/25 bg-success/10 text-success",
        !flat && !up && "border-destructive/25 bg-destructive/10 text-destructive",
      )}
    >
      <Icon className="size-3.5" />
      <span className="num">
        {value > 0 ? "+" : ""}
        {value}
        {suffix}
      </span>
    </span>
  );
}


export function SentimentBadge({ value }: { value: Sentiment }) {
  const map = {
    positive: { icon: CircleCheck, cls: "bg-positive/12 text-positive border-positive/25" },
    negative: { icon: CircleAlert, cls: "bg-negative/12 text-negative border-negative/25" },
    neutral: { icon: CircleMinus, cls: "bg-neutral/12 text-neutral border-neutral/25" },
  }[value];
  const Icon = map.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        map.cls,
      )}
    >
      <Icon className="size-3.5" />
      {sentimentLabel[value]}
    </span>
  );
}

export function SeverityBadge({
  severity,
}: {
  severity: "info" | "success" | "warning" | "danger";
}) {
  const map = {
    info: { label: "معلومة", icon: CircleAlert, cls: "bg-info/12 text-info border-info/25" },
    success: {
      label: "مكتمل",
      icon: CircleCheck,
      cls: "bg-success/12 text-success border-success/25",
    },
    warning: {
      label: "تحذير",
      icon: TriangleAlert,
      cls: "bg-warning/15 text-warning-foreground border-warning/40",
    },
    danger: {
      label: "خطر",
      icon: TriangleAlert,
      cls: "bg-destructive/12 text-destructive border-destructive/25",
    },
  }[severity];
  const Icon = map.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        map.cls,
      )}
    >
      <Icon className="size-3.5" />
      {map.label}
    </span>
  );
}

/* ---------------- KPI card ---------------- */

export function KpiCard({
  label,
  value,
  delta,
  unit,
  icon: Icon,
  tone = "default",
  onClick,
}: {
  label: string;
  value: string;
  delta?: number;
  unit?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tone?: "default" | "positive" | "negative" | "neutral";
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "panel group relative overflow-hidden p-5 text-start",
        onClick && "panel-interactive",
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium leading-snug text-muted-foreground">{label}</p>
        {Icon ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/70 bg-surface-2/80 text-muted-foreground transition-colors group-hover:text-foreground">
            <Icon className="size-4" />
          </span>
        ) : null}
      </div>
      <div className="relative mt-4 flex flex-wrap items-end gap-2">
        <span className={cn("num text-[32px] font-bold leading-none", tone === "negative" ? "text-negative" : "text-foreground")}>{value}</span>
        {unit ? <span className="pb-0.5 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
      {typeof delta === "number" ? (
        <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
          <DeltaBadge value={delta} />
          <span className="text-[11px] text-muted-foreground">مقارنة بالفترة السابقة</span>
        </div>
      ) : null}
    </Tag>
  );
}


/* ---------------- AI insight card ---------------- */

export function AiInsightCard({
  summary,
  findings,
  why,
  signals,
  confidence,
  next,
  title = "تحليل بالذكاء الاصطناعي",
}: {
  summary: string;
  findings?: string[];
  why?: string;
  signals?: string[];
  confidence?: number;
  next?: string;
  title?: string;
}) {
  return (
    <section className="panel panel-sheen animate-rise overflow-hidden shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-linear-to-l from-gold/8 via-surface-2 to-surface-2 px-5 py-3.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold/12 text-gold">
            <Sparkles className="size-3.5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="eyebrow mt-0.5">محرك رسين التحليلي</p>
          </div>
        </div>
        {typeof confidence === "number" ? (
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1">
            <span className="text-[11px] text-muted-foreground">درجة الثقة</span>
            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, confidence))}%` }}
              />
            </div>
            <span className="num text-[11px] font-semibold text-foreground">{confidence}%</span>
          </div>
        ) : null}
      </header>
      <div className="space-y-5 p-5 text-sm sm:p-6">
        <p className="text-[15px] leading-[1.85] text-foreground">{summary}</p>

        {findings?.length ? (
          <div>
            <p className="eyebrow mb-2.5">أهم الملاحظات</p>
            <ul className="space-y-2">
              {findings.map((f) => (
                <li key={f} className="flex gap-2.5 text-muted-foreground">
                  <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-gold ring-3 ring-gold/15" />
                  <span className="leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {why ? (
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2/70 p-4 ps-5">
            <span
              className="absolute inset-y-0 start-0 w-[3px] bg-gold/70"
              aria-hidden="true"
            />
            <p className="mb-1.5 text-xs font-semibold text-foreground">لماذا هذا مهم؟</p>
            <p className="leading-relaxed text-muted-foreground">{why}</p>
          </div>
        ) : null}

        {signals?.length ? (
          <div>
            <p className="eyebrow mb-2.5">الإشارات الداعمة</p>
            <div className="flex flex-wrap gap-2">
              {signals.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="rounded-full border-border bg-card px-2.5 py-1 font-normal text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        {next ? (
          <p className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <ArrowUpRight className="size-3.5 text-gold" />
            التحليل المقترح تاليًا:{" "}
            <span className="font-medium text-foreground">{next}</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}

/* ---------------- States ---------------- */

export function LoadingBlock({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="جاري التحميل">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-bar h-4" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("panel p-5", className)} role="status" aria-label="جاري التحميل">
      <div className="flex items-start justify-between gap-3">
        <div className="skeleton-bar h-3 w-24" />
        <div className="skeleton-bar size-8 rounded-lg" />
      </div>
      <div className="skeleton-bar mt-4 h-8 w-28" />
      <div className="mt-4 border-t border-border/60 pt-3">
        <div className="skeleton-bar h-3 w-32" />
      </div>
    </div>
  );
}

export function SkeletonChart({ height = 280 }: { height?: number }) {
  const bars = [52, 74, 40, 88, 63, 96, 55, 79];
  return (
    <div
      className="flex items-end gap-3 px-2"
      style={{ height }}
      role="status"
      aria-label="جاري تحميل الرسم البياني"
    >
      {bars.map((h, i) => (
        <div key={i} className="skeleton-bar w-full rounded-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border" role="status" aria-label="جاري التحميل">
      <div className="flex gap-4 border-b border-border bg-surface-2 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton-bar h-3 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 border-b border-border/60 px-4 py-3.5 last:border-b-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton-bar h-3.5 w-full" style={{ opacity: 1 - c * 0.12 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function LoadingPanel({ label = "جاري تحميل البيانات..." }: { label?: string }) {
  return (
    <Panel className="grid place-items-center py-16 text-center">
      <span className="relative grid size-12 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary-light/15" />
        <Loader2 className="size-6 animate-spin text-primary-light" />
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        يتم تجميع الإشارات من مصادر الرصد وترتيبها.
      </p>
    </Panel>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Panel
      padded={false}
      className="relative grid place-items-center overflow-hidden px-6 py-16 text-center"
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border-strong) 1px, transparent 0)",
          backgroundSize: "18px 18px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 72%)",
        }}
        aria-hidden="true"
      />
      <span className="relative grid size-14 place-items-center rounded-2xl border border-border bg-linear-to-b from-card to-surface-2 shadow-sm">
        <Icon className="size-6 text-muted-foreground" />
      </span>
      <h3 className="relative mt-5 text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="relative mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel ? (
        <Button className="relative mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Panel>
  );
}


export function ErrorBlock({
  title = "تعذر تحميل البيانات",
  description = "حدث خطأ أثناء جلب البيانات من مصادر الرصد. أعد المحاولة أو تحقق من إعدادات الرصد.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <Panel className="grid place-items-center px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-2xl border border-destructive/25 bg-destructive/10">
        <TriangleAlert className="size-5 text-destructive" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      ) : null}
    </Panel>
  );
}

/* ---------------- Processing steps ---------------- */

export function ProcessingSteps({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="relative space-y-1">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={step} className="relative flex items-start gap-3.5 pb-4 last:pb-0">
            {!last ? (
              <span
                className={cn(
                  "absolute top-8 start-[13px] h-[calc(100%-1.5rem)] w-px transition-colors duration-500",
                  done ? "bg-success/40" : "bg-border",
                )}
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                "relative z-1 grid size-7 shrink-0 place-items-center rounded-full border text-xs transition-all duration-300",
                done && "border-success/30 bg-success/12 text-success",
                active && "border-gold/45 bg-gold/12 text-gold ring-4 ring-gold/10",
                !done && !active && "border-border bg-surface-2 text-muted-foreground",
              )}
            >
              {done ? (
                <CircleCheck className="size-4" />
              ) : active ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <span className="num">{i + 1}</span>
              )}
            </span>
            <span className="min-w-0 pt-0.5">
              <span
                className={cn(
                  "block text-sm transition-colors duration-300",
                  active && "font-semibold text-foreground",
                  done && "text-foreground",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {step}
              </span>
              {active ? (
                <span className="mt-0.5 block text-[11px] text-gold">جاري التنفيذ…</span>
              ) : done ? (
                <span className="mt-0.5 block text-[11px] text-success">تم</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- Misc ---------------- */

export function StatRow({
  label,
  value,
  share,
  tone = "primary",
}: {
  label: string;
  value: string;
  share: number;
  tone?: "primary" | "positive" | "negative" | "gold";
}) {
  const bar = {
    primary: "bg-primary-light",
    positive: "bg-positive",
    negative: "bg-negative",
    gold: "bg-gold",
  }[tone];
  return (
    <div className="group/stat">
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="truncate font-medium text-foreground">{label}</span>
        <span className="num shrink-0 font-semibold text-muted-foreground transition-colors group-hover/stat:text-foreground">
          {value}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", bar)}
          style={{ width: `${Math.max(0, Math.min(100, share))}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreDial({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = 44;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-5">
      <div className="relative grid size-28 shrink-0 place-items-center">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 -rotate-90"
          role="img"
          aria-label={`${label}: ${pct} من 100`}
        >
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--surface-2)"
            strokeWidth="9"
          />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (c * pct) / 100}
            style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,0.61,0.36,1)" }}
          />
        </svg>
        <div className="relative grid place-items-center">
          <span className="num text-[26px] font-bold leading-none text-foreground">{pct}</span>
          <span className="mt-1 text-[10px] text-muted-foreground">من 100</span>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-tight text-foreground">{label}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          يُحسب المؤشر من نبرة التغطية وجودة المصادر واستمرارية الحضور الإعلامي.
        </p>
      </div>
    </div>
  );
}

