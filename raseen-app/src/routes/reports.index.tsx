import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  CalendarRange,
  FileText,
  History,
  Plus,
  TriangleAlert,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { EmptyState, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/mock";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "التقارير | رسين" },
      {
        name: "description",
        content: "مركز التقارير: تقارير يومية وأسبوعية وشهرية وتقارير أزمة ومنافسين.",
      },
      { property: "og:title", content: "التقارير | رسين" },
      { property: "og:description", content: "أنشئ تقارير إعلامية تحليلية وصدّرها بصيغة PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const templates = [
  {
    id: "daily",
    label: "تقرير يومي",
    icon: CalendarDays,
    hint: "ملخص المشهد الإعلامي خلال 24 ساعة مع أبرز الإشارات.",
    sections: 6,
  },
  {
    id: "weekly",
    label: "تقرير أسبوعي",
    icon: CalendarRange,
    hint: "حصة الصوت والمشاعر والسمعة مع مقارنة بالأسبوع السابق.",
    sections: 8,
  },
  {
    id: "monthly",
    label: "تقرير شهري",
    icon: FileText,
    hint: "تحليل شهري شامل مع اتجاهات المؤشرات الثمانية.",
    sections: 10,
  },
  {
    id: "crisis",
    label: "تقرير أزمة",
    icon: TriangleAlert,
    hint: "خط زمني للأزمة، محركاتها، ومسار الانتشار.",
    sections: 7,
  },
  {
    id: "competitors",
    label: "تقرير منافسين",
    icon: Users,
    hint: "مقارنة الحضور والنبرة والأثر مع المنافسين.",
    sections: 9,
  },
];

function ReportsPage() {
  return (
    <AppShell title="التقارير" breadcrumb={["رسين", "التقارير"]}>
      <PageHeader
        icon={FileText}
        title="التقارير"
        description="أنشئ تقارير إعلامية جاهزة للعرض على القيادة، مبنية على بيانات الرصد والتحليل."
        actions={
          <>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/reports/history">
                <History className="size-4" />
                سجل التقارير
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/reports/new" search={{ type: "daily" }}>
                <Plus className="size-4" />
                إنشاء تقرير
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((t) => (
          <Link
            key={t.id}
            to="/reports/new"
            search={{ type: t.id }}
            className="panel panel-interactive group p-5"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-primary-light">
              <t.icon className="size-5" />
            </span>
            <p className="mt-4 text-sm font-semibold text-foreground">{t.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.hint}</p>
            <p className="num mt-3 text-[11px] text-muted-foreground">{t.sections} أقسام</p>
          </Link>
        ))}
      </div>

      <Panel>
        <SectionTitle
          title="أحدث التقارير"
          hint="التقارير الجاهزة للمراجعة والتصدير"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/reports/history">عرض السجل الكامل</Link>
            </Button>
          }
        />
        <ul className="divide-y divide-border">
          {reports.slice(0, 3).map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <Link
                  to="/reports/$reportId"
                  params={{ reportId: r.id }}
                  className="truncate text-sm font-medium text-foreground hover:underline"
                >
                  {r.title}
                </Link>
                <p className="num mt-0.5 text-xs text-muted-foreground" dir="ltr">
                  {r.date} — {r.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-foreground">
                  {r.type}
                </span>
                <span className="text-xs text-muted-foreground">{r.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <EmptyState
        title="لا توجد تقارير مجدولة"
        description="يمكنك جدولة تقرير يومي أو أسبوعي ليُعد تلقائيًا ويُرسل إلى بريد الفريق."
        actionLabel="إنشاء تقرير"
        icon={FileText}
      />
    </AppShell>
  );
}
