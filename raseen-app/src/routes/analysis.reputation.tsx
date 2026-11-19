import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert, CircleCheck, ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  KpiCard,
  PageHeader,
  Panel,
  ScoreDial,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { TrendLineChart } from "@/components/raseen/charts";
import { metricHistory, topSources, topTopics } from "@/lib/mock";

export const Route = createFileRoute("/analysis/reputation")({
  head: () => ({
    meta: [
      { title: "تحليل السمعة | رسين" },
      {
        name: "description",
        content: "مؤشر السمعة ومحركاته: ما يحسّن السمعة، ما يضرّها، وأهم المصادر والمواضيع المؤثرة.",
      },
      { property: "og:title", content: "تحليل السمعة | رسين" },
      { property: "og:description", content: "قياس السمعة الإعلامية وتحليل محركاتها." },
    ],
  }),
  component: ReputationPage,
});

const improves = [
  "تغطية اقتصادية متخصصة داعمة لخطة التوسع",
  "ظهور القيادة في مقابلات مباشرة بنبرة واضحة",
  "مبادرات المسؤولية المجتمعية بنبرة إيجابية 78%",
  "التزام معلن بمعايير الحوكمة الجديدة",
];

const harms = [
  "تكرار شكاوى انقطاع الخدمة الرقمية",
  "محتوى متداول غير موثق حول التسعير",
  "بطء الاستجابة العلنية خلال أول ساعتين من الحادثة",
  "غياب بيان رسمي في المنصات الاجتماعية",
];

function ReputationPage() {
  return (
    <AppShell title="تحليل السمعة" breadcrumb={["رسين", "التحليل الإعلامي", "تحليل السمعة"]}>
      <PageHeader
        icon={ShieldAlert}
        title="تحليل السمعة"
        description="اقرأ سمعة الجهة الإعلامية عبر النبرة وجودة المصادر واستمرارية الحضور."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel>
          <ScoreDial value={78} label="مؤشر السمعة" />
        </Panel>
        <div className="grid gap-4 sm:grid-cols-3">
          <KpiCard label="إشارات إيجابية" value="1,068" delta={4.6} unit="58%" tone="positive" />
          <KpiCard label="إشارات سلبية" value="350" delta={6.1} unit="19%" tone="negative" />
          <KpiCard label="إشارات محايدة" value="424" delta={-1.2} unit="23%" tone="neutral" />
        </div>
      </div>

      <Panel>
        <SectionTitle title="اتجاه السمعة" hint="تطور مؤشر السمعة خلال سبعة أسابيع" />
        <TrendLineChart
          data={metricHistory}
          keys={[{ key: "value", label: "مؤشر السمعة", color: "var(--chart-1)" }]}
        />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="ما الذي يحسّن السمعة؟" />
          <ul className="space-y-3">
            {improves.map((i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
                <span className="leading-relaxed text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionTitle title="ما الذي يضر السمعة؟" />
          <ul className="space-y-3">
            {harms.map((i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
                <span className="leading-relaxed text-muted-foreground">{i}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="أهم المصادر المؤثرة" hint="حسب الأثر على مؤشر السمعة" />
          <ul className="space-y-3.5">
            {topSources.slice(0, 5).map((s) => (
              <li key={s.name}>
                <StatRow label={s.name} value={`${s.share}%`} share={s.share * 4} tone="gold" />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionTitle title="أهم المواضيع" hint="الموضوعات المرتبطة بالسمعة" />
          <ul className="space-y-3.5">
            {topTopics.slice(0, 5).map((t) => (
              <li key={t.name}>
                <StatRow
                  label={t.name}
                  value={`${t.volume} إشارة`}
                  share={Math.round((t.volume / 412) * 100)}
                  tone={t.name === "الأزمات" ? "negative" : "positive"}
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <AiInsightCard
        title="ملخص السمعة بالذكاء الاصطناعي"
        summary="السمعة عند 78 من 100 وهي في نطاق «قوية لكن قابلة للتأثر». الرصيد الإيجابي مبني على التغطية الاقتصادية، والخطر الأساسي تشغيلي لا اتصالي."
        findings={[
          "61% من السلبية مصدرها موضوع واحد: جودة الخدمة الرقمية.",
          "المصادر عالية الثقة ما زالت في الجانب الداعم.",
          "لا توجد إشارات تشكيك في القيادة أو الحوكمة.",
        ]}
        why="تركّز السلبية في موضوع واحد يعني أن معالجة سببها الجذري قد ترفع المؤشر إلى 82 خلال أسبوعين، بينما تجاهلها قد يخفضه ثلاث نقاط."
        confidence={89}
        next="تحليل الخطاب الإعلامي لموضوع جودة الخدمة"
      />
    </AppShell>
  );
}
