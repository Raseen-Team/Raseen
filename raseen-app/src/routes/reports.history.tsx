import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, History, Search } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { EmptyState, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reports } from "@/lib/mock";

export const Route = createFileRoute("/reports/history")({
  head: () => ({
    meta: [
      { title: "سجل التقارير | رسين" },
      {
        name: "description",
        content: "سجل كل التقارير الإعلامية المنشأة في رسين مع حالتها وتاريخها.",
      },
      { property: "og:title", content: "سجل التقارير | رسين" },
      { property: "og:description", content: "ابحث في التقارير السابقة وأعد تصديرها." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportHistoryPage,
});

function ReportHistoryPage() {
  const [q, setQ] = useState("");
  const filtered = reports.filter(
    (r) => r.title.includes(q.trim()) || r.type.includes(q.trim()) || r.id.includes(q.trim()),
  );

  return (
    <AppShell title="سجل التقارير" breadcrumb={["رسين", "التقارير", "السجل"]}>
      <PageHeader
        icon={History}
        title="سجل التقارير"
        description="كل التقارير المنشأة مرتبة من الأحدث إلى الأقدم."
        actions={
          <Button asChild variant="outline">
            <Link to="/reports">مركز التقارير</Link>
          </Button>
        }
      />

      <Panel>
        <SectionTitle
          title="التقارير"
          hint={`${filtered.length} تقرير`}
          action={
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 pe-9"
                placeholder="ابحث بالعنوان أو النوع"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState
            title="لا توجد نتائج مطابقة"
            description="جرّب مصطلحًا آخر أو أنشئ تقريرًا جديدًا يغطي الفترة المطلوبة."
            actionLabel="إنشاء تقرير"
            icon={History}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <Table className="data-table">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">العنوان</TableHead>
                  <TableHead className="text-start">النوع</TableHead>
                  <TableHead className="text-start">التاريخ</TableHead>
                  <TableHead className="text-start">الأقسام</TableHead>
                  <TableHead className="text-start">الحالة</TableHead>
                  <TableHead className="text-start">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell className="max-w-[280px]">
                      <Link
                        to="/reports/$reportId"
                        params={{ reportId: r.id }}
                        className="text-sm font-medium text-foreground decoration-border-strong underline-offset-4 transition-colors hover:text-primary-light hover:underline"
                      >
                        {r.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.type}</TableCell>
                    <TableCell className="num text-sm text-muted-foreground" dir="ltr">
                      {r.date}
                    </TableCell>
                    <TableCell className="num text-sm text-muted-foreground">
                      {r.sections}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-foreground">
                        <span className="size-1.5 rounded-full bg-success" />
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 opacity-70 transition-opacity group-hover:opacity-100"
                      >
                        <Download className="size-4" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

        )}
      </Panel>
    </AppShell>
  );
}
