import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { AiInsightCard, KpiCard, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { CompareRadar, GroupedBars } from "@/components/raseen/charts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { competitors } from "@/lib/mock";

export const Route = createFileRoute("/analysis/competitors")({
  head: () => ({
    meta: [
      { title: "تحليل المنافسين | رسين" },
      {
        name: "description",
        content: "مقارنة حصة الصوت والمشاعر والوصول والتفاعل والسمعة مع ثلاثة منافسين رئيسيين.",
      },
      { property: "og:title", content: "تحليل المنافسين | رسين" },
      { property: "og:description", content: "من يتصدر المشهد الإعلامي؟ مقارنة تفصيلية." },
    ],
  }),
  component: CompetitorsPage,
});

function CompetitorsPage() {
  const radar = [
    { metric: "حصة الصوت", base: 34, rival: 40 },
    { metric: "المشاعر", base: 58, rival: 51 },
    { metric: "الوصول", base: 48, rival: 56 },
    { metric: "التفاعل", base: 52, rival: 60 },
    { metric: "الأثر", base: 71, rival: 74 },
    { metric: "السمعة", base: 78, rival: 72 },
  ];

  return (
    <AppShell title="تحليل المنافسين" breadcrumb={["رسين", "التحليل الإعلامي", "تحليل المنافسين"]}>
      <PageHeader
        icon={Target}
        title="تحليل المنافسين"
        description="من يتصدر المشهد الإعلامي؟ مقارنة الجهة الأساسية بثلاثة منافسين عبر سبعة مؤشرات."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {competitors.map((c, i) => (
          <KpiCard
            key={c.name}
            label={c.name}
            value={`${c.sov}%`}
            delta={i === 0 ? 3.4 : i === 1 ? 1.1 : -1.8}
            unit="حصة الصوت"
            tone={i === 0 ? "default" : "neutral"}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel>
          <SectionTitle title="مقارنة المؤشرات" hint="حصة الصوت والسمعة والأثر الإعلامي" />
          <GroupedBars
            data={competitors.map((c) => ({
              name: c.name,
              sov: c.sov,
              reputation: c.reputation,
              impact: c.impact,
            }))}
            keys={[
              { key: "sov", label: "حصة الصوت", color: "var(--chart-1)" },
              { key: "reputation", label: "السمعة", color: "var(--chart-2)" },
              { key: "impact", label: "الأثر الإعلامي", color: "var(--chart-3)" },
            ]}
          />
        </Panel>
        <Panel>
          <SectionTitle title="الجهة مقابل المنافس الأول" hint="مخطط راداري للمؤشرات الستة" />
          <CompareRadar data={radar} />
        </Panel>
      </div>

      <Panel padded={false}>
        <div className="p-5 pb-0">
          <SectionTitle title="جدول المقارنة التفصيلي" hint="القيم الحالية لكل مؤشر" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">الجهة</TableHead>
                <TableHead className="text-start">حصة الصوت</TableHead>
                <TableHead className="text-start">المشاعر الإيجابية</TableHead>
                <TableHead className="text-start">الوصول</TableHead>
                <TableHead className="text-start">التفاعل</TableHead>
                <TableHead className="text-start">الأثر الإعلامي</TableHead>
                <TableHead className="text-start">السمعة</TableHead>
                <TableHead className="text-start">مؤشر الاتجاه</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c) => (
                <TableRow key={c.name}>
                  <TableCell className="text-sm font-medium text-foreground">{c.name}</TableCell>
                  <TableCell className="num text-sm text-muted-foreground">{c.sov}%</TableCell>
                  <TableCell className="num text-sm text-muted-foreground">
                    {c.sentiment}%
                  </TableCell>
                  <TableCell className="num text-sm text-muted-foreground">{c.reach}M</TableCell>
                  <TableCell className="num text-sm text-muted-foreground">
                    {c.engagement}K
                  </TableCell>
                  <TableCell className="num text-sm text-muted-foreground">{c.impact}</TableCell>
                  <TableCell className="num text-sm text-muted-foreground">
                    {c.reputation}
                  </TableCell>
                  <TableCell className="num text-sm text-muted-foreground">{c.trend}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <AiInsightCard
        summary="المنافس الأول يتصدر المشهد بحصة صوت 40% مقابل 34% للجهة الأساسية، لكن الجهة تتقدم في السمعة بست نقاط وفي المشاعر الإيجابية بسبع نقاط."
        findings={[
          "فجوة حصة الصوت تتقلص للأسبوع الثالث على التوالي.",
          "المنافس الثالث يفقد حضوره تدريجيًا في المصادر الاقتصادية.",
          "الأثر الإعلامي متقارب جدًا: 71 مقابل 74.",
        ]}
        why="التقدم في السمعة مع تأخر حصة الصوت يعني أن المشكلة في الحضور لا في الانطباع؛ الحل توسيع نطاق المصادر لا تغيير الرسائل."
        confidence={86}
        next="تحليل الحملات لقياس مردود توسيع الحضور"
      />
    </AppShell>
  );
}
