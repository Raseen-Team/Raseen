import { Sparkles } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/lib/utils";
import { hhmm, isLive, roleLabel, statusLabel, type CoveragePoint, type Role, type StoryStatus } from "@/lib/live";

export function StatusBadge({ status, className }: { status: StoryStatus; className?: string }) {
  const tone = {
    verified: "bg-positive/10 text-positive border-positive/25",
    review: "bg-gold/15 text-[#8a6d0b] border-gold/35",
    unsupported: "bg-negative/10 text-negative border-negative/25",
  }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium", tone, className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {statusLabel[status]}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const tone = {
    first: "bg-primary text-primary-foreground border-primary",
    update: "bg-primary-light/10 text-primary-light border-primary-light/25",
    republish: "bg-muted text-muted-foreground border-border",
  }[role];
  return <span className={cn("rounded-md border px-2 py-0.5 text-[11px] font-medium", tone)}>{roleLabel[role]}</span>;
}

/** Shows whether the page reads the real database or the demo data. */
export function LiveTag() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75">
      <span className={cn("size-2 rounded-full", isLive ? "animate-pulse bg-[#3CC8CF]" : "bg-white/40")} />
      {isLive ? "بيانات حية من الرصد" : "بيانات تجريبية"}
    </span>
  );
}

/** Mustard star = made by AI. */
export function AiMark({ label = "مخرجات الذكاء الاصطناعي" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <Sparkles className="size-3.5 text-gold" />
      {label}
    </span>
  );
}

export function CoverageChart({ data, height = 180 }: { data: CoveragePoint[]; height?: number }) {
  const rows = data.map((d) => ({ t: hhmm(d.hour), v: d.articles }));
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="covFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#168B92" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#168B92" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="t" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={28} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: number) => [`${v} خبر`, "التغطية"]}
            labelFormatter={(l) => `الساعة ${l}`}
            contentStyle={{ borderRadius: 10, border: "1px solid var(--color-border)", fontSize: 12, direction: "rtl" }}
          />
          <Area type="monotone" dataKey="v" stroke="#168B92" strokeWidth={2} fill="url(#covFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
