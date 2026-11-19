import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { AiInsightCard, KpiCard, PageHeader, Panel, SectionTitle, StatRow } from "@/components/raseen/blocks";
import { TrendLineChart } from "@/components/raseen/charts";
import { trendSeries } from "@/lib/mock";

export const Route = createFileRoute("/analysis/campaigns")({
  head: () => ({
    meta: [
      { title: "تحليل الحملات | رسين" },
      { name: "description", content: "أداء الحملات في الوصول والتفاعل والمشاعر وحصة الصوت." },
      { property: "og:title", content: "تحليل الحملات | رسين" },
      { property: "og:description", content: "قياس أثر الحملات الإعلامية عبر خط زمني ومؤشرات أداء." },
    ],
  }),
  component: CampaignsPage,
});

const campaigns = [
  { name: "حملة التوسع الرقمي", reach: 62, sentiment: 66, sov: 31 },
  { name: "حملة جودة الخدمة", reach: 48, sentiment: 54, sov: 22 },
  { name: "حملة المسؤولية المجتمعية", reach: 39, sentiment: 78, sov: 17 },
];

function CampaignsPage() {
  return (
    <AppShell title="تحليل الحملات" breadcrumb={["رسين", "التحليل الإعلامي", "تحليل الحملات"]}>
      <PageHeader
        icon={Megaphone}
        title="تحليل الحملات"
        description="قِس أثر الحملات الإعلامية على الوصول والنبرة وحصة الصوت."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="حملات نشطة" value="3" unit="حملة" />
        <KpiCard label="إجمالي الوصول" value="14.9M" delta={8.4} unit="مستخدم" />
        <KpiCard label="متوسط الإيجابية" value="66%" delta={2.9} unit="من الإشارات" tone="positive" />
        <KpiCard label="حصة الصوت المجمعة" value="34%" delta={3.4} unit="من السوق" />
      </div>

      <Panel>
        <SectionTitle title="أداء الحملات زمنيًا" hint="الوصول وحجم التغطية خلال 30 يومًا" />
        <TrendLineChart
          data={trendSeries["30d"]}
          keys={[
            { key: "reach", label: "الوصول (بالآلاف)", color: "var(--gold)" },
            { key: "volume", label: "حجم التغطية", color: "var(--chart-1)" },
          ]}
        />
      </Panel>

      <Panel>
        <SectionTitle title="مقارنة الحملات" hint="الوصول والنبرة وحصة الصوت لكل حملة" />
        <div className="space-y-6">
          {campaigns.map((c) => (
            <div key={c.name} className="space-y-3">
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <StatRow label="الوصول" value={`${c.reach}%`} share={c.reach} />
              <StatRow label="الإيجابية" value={`${c.sentiment}%`} share={c.sentiment} tone="positive" />
              <StatRow label="حصة الصوت" value={`${c.sov}%`} share={c.sov * 2} tone="gold" />
            </div>
          ))}
        </div>
      </Panel>

      <AiInsightCard
        summary="حملة المسؤولية المجتمعية هي الأعلى في النبرة (78%) والأدنى في الوصول (39%)، بينما حملة التوسع الرقمي تحقق أفضل توازن بين الوصول وحصة الصوت."
        findings={[
          "حملة جودة الخدمة أضعف الحملات نبرةً عند 54%.",
          "حصة الصوت المجمعة ارتفعت 3.4 نقطة.",
          "الوصول يبلغ ذروته في منتصف الفترة ثم يهبط.",
        ]}
        why="ارتفاع النبرة مع انخفاض الوصول يعني رسالة ناجحة بجمهور محدود؛ توسيع نطاق مصادرها أرخص من بناء رسالة جديدة."
        confidence={80}
        next="تحليل الجمهور لتحديد قنوات التوسع"
      />
    </AppShell>
  );
}
