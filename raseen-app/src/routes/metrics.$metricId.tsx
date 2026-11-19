import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Gauge } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  DeltaBadge,
  KpiCard,
  PageHeader,
  Panel,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { GroupedBars, TrendLineChart } from "@/components/raseen/charts";
import { Button } from "@/components/ui/button";
import { competitors, metricHistory, metrics, topSources } from "@/lib/mock";

export const Route = createFileRoute("/metrics/$metricId")({
  loader: ({ params }) => {
    const metric = metrics.find((m) => m.id === params.metricId);
    if (!metric) throw notFound();
    return { metric };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "مؤشر غير متوفر | رسين" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { metric } = loaderData;
    return {
      meta: [
        { title: `${metric.name} | مؤشرات رسين` },
        { name: "description", content: metric.description },
        { property: "og:title", content: `${metric.name} | مؤشرات رسين` },
        { property: "og:description", content: metric.description },
      ],
    };
  },
  component: MetricDetailPage,
});

function MetricDetailPage() {
  const { metric } = Route.useLoaderData();

  return (
    <AppShell title={metric.name} breadcrumb={["رسين", "المؤشرات", metric.name]}>
      <PageHeader
        icon={Gauge}
        title={metric.name}
        description={metric.description}
        actions={
          <Button asChild variant="outline" className="gap-2">
            <Link to="/metrics">
              <ArrowRight className="size-4" />
              كل المؤشرات
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="القيمة الحالية" value={metric.value} delta={metric.change} />
        <KpiCard label="متوسط الفترة السابقة" value="71" unit="نقطة" />
        <KpiCard label="أعلى قيمة مسجلة" value="82" unit="الأسبوع الرابع" />
        <KpiCard label="مستوى الثقة في القياس" value="94%" unit="جودة البيانات" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <SectionTitle
            title="البيانات التاريخية"
            hint="تطور المؤشر خلال آخر سبعة أسابيع"
            action={<DeltaBadge value={metric.change} />}
          />
          <TrendLineChart
            data={metricHistory}
            keys={[{ key: "value", label: metric.name, color: "var(--chart-1)" }]}
          />
        </Panel>

        <Panel>
          <SectionTitle title="مساهمة المصادر" hint="توزيع المؤشر حسب نوع المصدر" />
          <ul className="space-y-3.5">
            {topSources.slice(0, 6).map((s) => (
              <li key={s.name}>
                <StatRow label={s.name} value={`${s.share}%`} share={s.share * 4} tone="gold" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="المقارنة مع المنافسين" hint="قيمة المؤشر لدى الجهة الأساسية والمنافسين" />
        <GroupedBars
          data={competitors.map((c) => ({
            name: c.name,
            current: c.reputation,
            previous: Math.max(30, c.reputation - 6),
          }))}
          keys={[
            { key: "current", label: "الفترة الحالية", color: "var(--chart-1)" },
            { key: "previous", label: "الفترة السابقة", color: "var(--chart-3)" },
          ]}
        />
      </Panel>

      <AiInsightCard
        summary={metric.ai}
        findings={[
          "المؤشر يتحرك بثبات دون تقلبات حادة، وهو ما يرفع موثوقية القراءة.",
          "المصادر من الفئة الأولى تمثل 46% من مساهمة المؤشر.",
        ]}
        why="استقرار المؤشر يعني أن أي انحراف مفاجئ خلال الأيام القادمة يستحق تحقيقًا فوريًا لا مراقبة فقط."
        confidence={87}
        next={`تحليل أثر ${metric.name} على مؤشر السمعة`}
      />
    </AppShell>
  );
}
