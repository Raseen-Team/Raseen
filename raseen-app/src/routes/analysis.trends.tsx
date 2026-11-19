import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

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
import { DonutChart, HorizontalBars, TrendLineChart } from "@/components/raseen/charts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { topSources, topTopics, trendSeries } from "@/lib/mock";

export const Route = createFileRoute("/analysis/trends")({
  head: () => ({
    meta: [
      { title: "اتجاهات الإعلام | رسين" },
      {
        name: "description",
        content: "مؤشر الاتجاه وحجم التغطية ومعدل النمو والموضوعات الصاعدة وأوقات الذروة.",
      },
      { property: "og:title", content: "اتجاهات الإعلام | رسين" },
      { property: "og:description", content: "تحليل اتجاهات المشهد الإعلامي ومحركاتها." },
    ],
  }),
  component: TrendsPage,
});

function TrendsPage() {
  const [range, setRange] = useState<keyof typeof trendSeries>("7d");

  return (
    <AppShell
      title="تحليل اتجاهات الإعلام"
      breadcrumb={["رسين", "التحليل الإعلامي", "اتجاهات الإعلام"]}
    >
      <PageHeader
        icon={TrendingUp}
        title="تحليل اتجاهات الإعلام"
        description="اقرأ حركة المشهد الإعلامي: ما ينمو، ما يتراجع، ومتى يبلغ الذروة."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="مؤشر الاتجاه" value="68" delta={6.5} unit="من 100" />
        <KpiCard label="حجم التغطية" value="1,842" delta={9.3} unit="إشارة" />
        <KpiCard label="معدل النمو" value="14.6%" delta={3.2} unit="أسبوعيًا" />
        <KpiCard label="وقت الذروة" value="20:00" unit="بتوقيت الرياض" />
      </div>

      <Panel>
        <SectionTitle
          title="خط الاتجاه"
          action={
            <Tabs value={range} onValueChange={(v) => setRange(v as keyof typeof trendSeries)}>
              <TabsList>
                <TabsTrigger value="24h">24 ساعة</TabsTrigger>
                <TabsTrigger value="7d">7 أيام</TabsTrigger>
                <TabsTrigger value="30d">30 يومًا</TabsTrigger>
              </TabsList>
            </Tabs>
          }
        />
        <TrendLineChart
          data={trendSeries[range]}
          keys={[
            { key: "volume", label: "حجم التغطية", color: "var(--chart-1)" },
            { key: "reach", label: "الوصول (بالآلاف)", color: "var(--gold)" },
          ]}
        />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <SectionTitle title="حجم الموضوعات" hint="الموضوعات الأكثر حضورًا في التغطية" />
          <HorizontalBars data={topTopics.map((t) => ({ name: t.name, value: t.volume }))} />
        </Panel>
        <Panel>
          <SectionTitle title="توزيع المصادر" hint="حسب نوع المنصة" />
          <DonutChart
            height={240}
            data={[
              { name: "إعلام تقليدي", value: 941, color: "var(--chart-1)" },
              { name: "إعلام رقمي", value: 297, color: "var(--chart-2)" },
              { name: "منصات اجتماعية", value: 498, color: "var(--chart-3)" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="الموضوعات الصاعدة" hint="أعلى معدلات النمو خلال الفترة" />
          <ul className="space-y-4">
            {[...topTopics]
              .sort((a, b) => b.change - a.change)
              .slice(0, 5)
              .map((t) => (
                <li key={t.name} className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-foreground">{t.name}</span>
                  <DeltaBadge value={t.change} />
                </li>
              ))}
          </ul>
        </Panel>

        <Panel>
          <SectionTitle title="أهم المصادر" hint="المصادر الأكثر تأثيرًا في صناعة الاتجاه" />
          <ul className="space-y-3.5">
            {topSources.slice(0, 6).map((s) => (
              <li key={s.name}>
                <StatRow label={s.name} value={`${s.share}%`} share={s.share * 4} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="الخط الزمني للأحداث" hint="اللحظات التي غيّرت مسار التغطية" />
        <ol className="relative space-y-5 border-s border-border ps-5">
          {[
            { time: "الأحد 09:20", text: "نشر تقرير الإنفاق الإعلاني الرقمي — بداية موجة إيجابية." },
            { time: "الثلاثاء 11:48", text: "انتشار شكاوى انقطاع الخدمة على منصة X." },
            { time: "الأربعاء 16:20", text: "تغطية اقتصادية موسعة لتوسع مراكز البيانات." },
            { time: "الخميس 20:00", text: "ذروة الحديث اليومي بمشاركة حسابات مؤثرة." },
          ].map((e) => (
            <li key={e.time}>
              <span className="absolute -start-[5px] mt-1.5 size-2.5 rounded-full bg-gold" />
              <p className="num text-xs text-muted-foreground">{e.time}</p>
              <p className="mt-1 text-sm text-foreground">{e.text}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <AiInsightCard
        summary="الاتجاه صاعد منذ خمسة أيام بمعدل 14.6% أسبوعيًا، ومحركه الأساسي موضوع الذكاء الاصطناعي الذي نما 27.3%."
        findings={[
          "ذروة الحديث تتكرر عند الساعة 20:00 بشكل ثابت.",
          "موضوع الأزمات نما 19.8% وهو الأسرع بعد الذكاء الاصطناعي.",
          "المصادر التقليدية تصنع الاتجاه، والمنصات الاجتماعية توسّعه.",
        ]}
        why="ثبات وقت الذروة يمنح نافذة نشر واضحة، وتزامن نمو موضوعي «الذكاء الاصطناعي» و«الأزمات» يعني أن أي خطأ تشغيلي سيُقرأ في سياق تقني حساس."
        signals={["نمو 14.6%", "ذروة 20:00", "موضوعان صاعدان"]}
        confidence={85}
        next="تحليل الخطاب الإعلامي للموضوعات الصاعدة"
      />
    </AppShell>
  );
}
