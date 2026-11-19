import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareQuote } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { AiInsightCard, KpiCard, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { HorizontalBars, TrendLineChart } from "@/components/raseen/charts";
import { Badge } from "@/components/ui/badge";
import { metricHistory, topTopics } from "@/lib/mock";

export const Route = createFileRoute("/analysis/discourse")({
  head: () => ({
    meta: [
      { title: "تحليل الخطاب الإعلامي | رسين" },
      { name: "description", content: "الموضوعات والكلمات المفتاحية والنبرة واتجاه الخطاب وتغيّره زمنيًا." },
      { property: "og:title", content: "تحليل الخطاب الإعلامي | رسين" },
      { property: "og:description", content: "كيف يُصاغ الحديث عن الجهة؟ ومفرداته المتغيرة." },
    ],
  }),
  component: DiscoursePage,
});

const keywords = [
  "الحوكمة",
  "الشفافية",
  "التحول الرقمي",
  "جودة الخدمة",
  "الاستثمار",
  "الموثوقية",
  "التسعير",
  "الاستدامة",
  "الذكاء الاصطناعي",
  "الانقطاع",
];

function DiscoursePage() {
  return (
    <AppShell
      title="تحليل الخطاب الإعلامي"
      breadcrumb={["رسين", "التحليل الإعلامي", "الخطاب الإعلامي"]}
    >
      <PageHeader
        icon={MessageSquareQuote}
        title="تحليل الخطاب الإعلامي"
        description="كيف تُصاغ الرسائل حول الجهة؟ المفردات، النبرة، واتجاه الخطاب."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="اتجاه الخطاب" value="داعم" unit="بنسبة 61%" tone="positive" />
        <KpiCard label="كلمات مفتاحية" value="184" delta={5.5} unit="مفردة متكررة" />
        <KpiCard label="أعلى مفردة" value="الحوكمة" unit="412 تكرارًا" />
        <KpiCard label="تغيّر المفردات" value="+18%" delta={18} unit="مفردات جديدة" />
      </div>

      <Panel>
        <SectionTitle title="تطور نبرة الخطاب" hint="مؤشر النبرة خلال سبعة أسابيع" />
        <TrendLineChart
          data={metricHistory}
          keys={[{ key: "value", label: "مؤشر النبرة", color: "var(--chart-2)" }]}
        />
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="محاور الخطاب" hint="الموضوعات الأكثر تكرارًا" />
          <HorizontalBars data={topTopics.map((t) => ({ name: t.name, value: t.volume }))} />
        </Panel>
        <Panel>
          <SectionTitle title="الكلمات المفتاحية" hint="حجم المفردة يعبّر عن تكرارها" />
          <div className="flex flex-wrap gap-2.5">
            {keywords.map((k, i) => (
              <Badge
                key={k}
                variant="outline"
                className={i < 3 ? "px-3 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}
              >
                {k}
              </Badge>
            ))}
          </div>
        </Panel>
      </div>

      <AiInsightCard
        summary="الخطاب الإعلامي يتحول من مفردات الأسعار إلى مفردات الحوكمة والموثوقية، وهو تحول يرفع سقف التوقعات تجاه الجهة."
        findings={[
          "«الحوكمة» و«الشفافية» أعلى مفردتين نموًا.",
          "18% من المفردات المستخدمة جديدة على الفترة السابقة.",
          "61% من الخطاب داعم أو محايد إيجابي.",
        ]}
        why="تغيّر المفردات مؤشر مبكر على تغير معايير التقييم؛ أي خلل تشغيلي سيُقرأ لاحقًا كإخلال بالحوكمة لا كعطل تقني."
        confidence={83}
        next="تحليل السمعة لقياس أثر التحول"
      />
    </AppShell>
  );
}
