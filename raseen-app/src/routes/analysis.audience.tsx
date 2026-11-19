import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { AiInsightCard, KpiCard, PageHeader, Panel, SectionTitle, StatRow } from "@/components/raseen/blocks";
import { DonutChart, HorizontalBars } from "@/components/raseen/charts";
import { countries, platforms } from "@/lib/mock";

export const Route = createFileRoute("/analysis/audience")({
  head: () => ({
    meta: [
      { title: "تحليل الجمهور | رسين" },
      { name: "description", content: "الشرائح الأكثر تفاعلًا ونبرتها ومنصاتها وتوزيعها الجغرافي." },
      { property: "og:title", content: "تحليل الجمهور | رسين" },
      { property: "og:description", content: "من يتحدث عن الجهة؟ وكيف يتحدث؟" },
    ],
  }),
  component: AudiencePage,
});

const segments = [
  { name: "قطاع التقنية", share: 71, tone: "إيجابية" },
  { name: "الصحفيون الاقتصاديون", share: 64, tone: "محايدة" },
  { name: "المستخدمون الأفراد", share: 52, tone: "متباينة" },
  { name: "جهات حكومية", share: 44, tone: "محايدة" },
  { name: "المستثمرون", share: 38, tone: "إيجابية" },
];

function AudiencePage() {
  return (
    <AppShell title="تحليل الجمهور" breadcrumb={["رسين", "التحليل الإعلامي", "تحليل الجمهور"]}>
      <PageHeader
        icon={Users}
        title="تحليل الجمهور"
        description="من يتحدث عن الجهة، بأي نبرة، وعلى أي منصة."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="الحسابات المتحدثة" value="12,480" delta={7.2} unit="حساب" />
        <KpiCard label="الشريحة الأكثر تفاعلًا" value="قطاع التقنية" unit="71% إيجابية" />
        <KpiCard label="المنصة الأعلى" value="منصة X" delta={4.1} unit="38% من الحديث" />
        <KpiCard label="أعلى دولة" value="السعودية" unit="46% من الإشارات" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel>
          <SectionTitle title="الشرائح الأكثر تفاعلًا" hint="نسبة الإيجابية داخل كل شريحة" />
          <ul className="space-y-3.5">
            {segments.map((s) => (
              <li key={s.name}>
                <StatRow label={`${s.name} — نبرة ${s.tone}`} value={`${s.share}%`} share={s.share} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <SectionTitle title="توزيع النبرة العام" />
          <DonutChart
            height={230}
            data={[
              { name: "إيجابي", value: 55, color: "var(--positive)" },
              { name: "سلبي", value: 20, color: "var(--negative)" },
              { name: "محايد", value: 25, color: "var(--neutral)" },
            ]}
          />
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="التوزيع حسب المنصات" />
          <HorizontalBars
            data={platforms.map((p, i) => ({ name: p, value: 480 - i * 62 }))}
          />
        </Panel>
        <Panel>
          <SectionTitle title="التوزيع الجغرافي" />
          <HorizontalBars
            data={countries.map((c, i) => ({ name: c, value: 520 - i * 74 }))}
            color="var(--gold)"
          />
        </Panel>
      </div>

      <AiInsightCard
        summary="الحديث يقوده جمهور مهني (تقنية واقتصاد) بنبرة إيجابية، بينما تتركز النبرة السلبية في شريحة المستخدمين الأفراد على المنصات الاجتماعية."
        findings={[
          "قطاع التقنية الأكثر إيجابية عند 71%.",
          "منصة X تستحوذ على 38% من إجمالي الحديث.",
          "46% من الإشارات مصدرها السعودية.",
        ]}
        why="اختلاف النبرة بين الجمهور المهني والأفراد يعني أن رسالة واحدة لا تكفي؛ الأفراد يحتاجون معلومات تشغيلية سريعة لا تحليلًا."
        confidence={82}
        next="تحليل الخطاب الإعلامي لشريحة الأفراد"
      />
    </AppShell>
  );
}
