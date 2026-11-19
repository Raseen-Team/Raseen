import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  EmptyState,
  PageHeader,
  Panel,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { DonutChart, HorizontalBars, TrendLineChart } from "@/components/raseen/charts";
import { cn } from "@/lib/utils";
import { predictions, predictionSeries } from "@/lib/mock";

export const Route = createFileRoute("/prediction/")({
  head: () => ({
    meta: [
      { title: "التنبؤ | رسين" },
      {
        name: "description",
        content: "اكتشف الإشارات المبكرة لما قد يحدث في المشهد الإعلامي: أزمات وترندات وقضايا صاعدة.",
      },
      { property: "og:title", content: "التنبؤ | رسين" },
      {
        property: "og:description",
        content: "لوحة تنبؤ إعلامي مع الاحتمال ومستوى الخطر والأفق الزمني.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PredictionPage,
});

export const riskTone: Record<string, string> = {
  مرتفع: "bg-destructive/12 text-destructive border-destructive/25",
  متوسط: "bg-warning/15 text-warning-foreground border-warning/40",
  منخفض: "bg-success/12 text-success border-success/25",
};

const riskDistribution = [
  { name: "خطر مرتفع", value: 1, color: "var(--destructive)" },
  { name: "خطر متوسط", value: 2, color: "var(--gold)" },
  { name: "خطر منخفض", value: 1, color: "var(--positive)" },
];

function PredictionPage() {
  return (
    <AppShell title="التنبؤ" breadcrumb={["رسين", "التنبؤ"]}>
      <PageHeader
        icon={TrendingUp}
        title="التنبؤ"
        description="اكتشف الإشارات المبكرة لما قد يحدث في المشهد الإعلامي."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {predictions.map((p) => (
          <Link
            key={p.id}
            to="/prediction/$predictionId"
            params={{ predictionId: p.id }}
            className="panel panel-interactive group p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.headline}</p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] text-muted-foreground">الاحتمال</p>
                <p className="num mt-0.5 text-xl font-bold text-foreground">{p.probability}%</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">درجة الثقة</p>
                <p className="num mt-0.5 text-xl font-bold text-foreground">{p.confidence}%</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">الأفق الزمني</p>
                <p className="mt-1 text-xs text-foreground">{p.horizon}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-xs font-medium",
                  riskTone[p.risk] ?? riskTone["متوسط"],
                )}
              >
                مستوى الخطر: {p.risk}
              </span>
              <span className="num text-[11px] text-muted-foreground">
                {p.signals.length} إشارات داعمة
              </span>
            </div>

            <div className="mt-4">
              <StatRow
                label="مؤشر الاحتمال"
                value={`${p.probability}%`}
                share={p.probability}
                tone={p.probability > 65 ? "negative" : "gold"}
              />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionTitle title="الخط الزمني للمخاطر" hint="تطور مؤشر الخطر خلال خمسة أيام" />
          <TrendLineChart
            data={predictionSeries}
            keys={[{ key: "risk", label: "مؤشر الخطر", color: "var(--destructive)" }]}
          />
        </Panel>
        <Panel>
          <SectionTitle title="توزيع المخاطر" hint="التنبؤات النشطة بحسب المستوى" />
          <DonutChart data={riskDistribution} />
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="الإشارات الأقوى" hint="ترتيب الإشارات بحسب وزنها في النموذج" />
        <HorizontalBars
          data={[
            { name: "نمو حجم التغطية", value: 92 },
            { name: "تحول النبرة", value: 81 },
            { name: "دخول مؤثرين", value: 74 },
            { name: "تكرار الشكاوى", value: 63 },
            { name: "نمو البحث", value: 52 },
          ]}
        />
      </Panel>

      <AiInsightCard
        title="ملخص التنبؤ بالذكاء الاصطناعي"
        summary="أعلى احتمال حاليًا هو تصاعد أزمة إعلامية بنسبة 72% خلال 48 ساعة، مدفوعًا بتقاطع نمو التغطية وتحول النبرة ودخول حسابات مؤثرة إلى النقاش."
        findings={[
          "تنبؤ واحد بمستوى خطر مرتفع من أصل أربعة.",
          "مؤشر الخطر ارتفع من 38 إلى 72 خلال خمسة أيام.",
          "الترند القادم المتوقع: حوكمة الذكاء الاصطناعي خلال 5 أيام.",
        ]}
        why="التدخل خلال أول 24 ساعة يقلص ذروة الأزمة تاريخيًا بنحو الثلث؛ التأخير يجعل النقاش يُدار من مصادر خارجية."
        confidence={84}
        next="فتح تفاصيل الأزمة القادمة ومراجعة إشاراتها"
      />

      <EmptyState
        title="لا توجد تنبؤات مؤرشفة"
        description="التنبؤات المنتهية أو التي لم تتحقق ستُحفظ هنا لقياس دقة النموذج مع الوقت."
        icon={TrendingUp}
      />
    </AppShell>
  );
}
