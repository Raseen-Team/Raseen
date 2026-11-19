import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Gauge } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  DeltaBadge,
  PageHeader,
  Panel,
  SectionTitle,
} from "@/components/raseen/blocks";
import { TrendLineChart } from "@/components/raseen/charts";
import { metricHistory, metrics } from "@/lib/mock";

export const Route = createFileRoute("/metrics/")({
  head: () => ({
    meta: [
      { title: "المؤشرات | رسين" },
      {
        name: "description",
        content:
          "ثمانية مؤشرات إعلامية: حصة الصوت، المشاعر، الوصول، التفاعل، الأثر الإعلامي، المؤثرون، مؤشر الاتجاه، السمعة.",
      },
      { property: "og:title", content: "المؤشرات | رسين" },
      { property: "og:description", content: "مؤشرات الاستخبارات الإعلامية في لوحة واحدة." },
    ],
  }),
  component: MetricsPage,
});

function MetricsPage() {
  return (
    <AppShell title="المؤشرات" breadcrumb={["رسين", "المؤشرات"]}>
      <PageHeader
        icon={Gauge}
        title="المؤشرات"
        description="ثمانية مؤشرات مركبة تقيس حضور الجهة وأثرها في المشهد الإعلامي."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <Link
            key={m.id}
            to="/metrics/$metricId"
            params={{ metricId: m.id }}
            className="panel panel-interactive group p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-muted-foreground">{m.name}</p>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <p className="num mt-3 text-2xl font-bold text-foreground">{m.value}</p>
            <div className="mt-3">
              <DeltaBadge value={m.change} />
            </div>
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {m.description}
            </p>
          </Link>
        ))}
      </div>

      <Panel>
        <SectionTitle
          title="الاتجاه العام للمؤشرات"
          hint="مؤشر مركب يجمع المؤشرات الثمانية — آخر سبعة أسابيع"
        />
        <TrendLineChart
          data={metricHistory}
          keys={[{ key: "value", label: "المؤشر المركب", color: "var(--chart-1)" }]}
        />
      </Panel>

      <AiInsightCard
        summary="سبعة من أصل ثمانية مؤشرات في اتجاه صاعد، ومؤشر التفاعل هو الاستثناء الوحيد بانخفاض 2.3%. الصورة العامة: حضور إعلامي أوسع بمشاركة جماهيرية أقل كثافة."
        findings={[
          "حصة الصوت ما زالت أقل من المنافس الأول بستة نقاط.",
          "مؤشر السمعة عند 78 وهو أعلى مستوى خلال سبعة أسابيع.",
          "الوصول يتقدم على التفاعل، وهو نمط تغطية إخبارية لا نقاش عام.",
        ]}
        why="اتساع الوصول دون تفاعل يعني أن الرسائل تُنقل ولا تُناقش؛ الفرصة هنا في تحويل التغطية إلى حوار مع الجمهور المهتم بالاقتصاد والتقنية."
        confidence={88}
        next="مقارنة حصة الصوت مع المنافسين على مستوى المنصات"
      />
    </AppShell>
  );
}
