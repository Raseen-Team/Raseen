import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChartNoAxesCombined,
  Loader2,
  Megaphone,
  MessageSquareQuote,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { AiInsightCard, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { DonutChart } from "@/components/raseen/charts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProcessingSteps } from "@/components/raseen/blocks";
import { countries, platforms, topTopics } from "@/lib/mock";

export const Route = createFileRoute("/analysis/")({
  head: () => ({
    meta: [
      { title: "التحليل الإعلامي | رسين" },
      {
        name: "description",
        content: "حوّل البيانات الإعلامية إلى رؤى قابلة للفهم واتخاذ القرار عبر وحدات تحليل متخصصة.",
      },
      { property: "og:title", content: "التحليل الإعلامي | رسين" },
      {
        property: "og:description",
        content: "تحليل الاتجاهات والسمعة والمنافسين والجمهور والحملات والخطاب الإعلامي.",
      },
    ],
  }),
  component: AnalysisPage,
});

const modules = [
  {
    to: "/analysis/trends" as const,
    icon: TrendingUp,
    title: "تحليل اتجاهات الإعلام",
    text: "مؤشر الاتجاه وحجم التغطية والموضوعات الصاعدة وأوقات الذروة.",
  },
  {
    to: "/analysis/reputation" as const,
    icon: ShieldAlert,
    title: "تحليل السمعة",
    text: "مؤشر السمعة ومحركاته الإيجابية والسلبية وأهم المصادر المؤثرة.",
  },
  {
    to: "/analysis/competitors" as const,
    icon: Target,
    title: "تحليل المنافسين",
    text: "مقارنة حصة الصوت والمشاعر والوصول والأثر الإعلامي مع ثلاثة منافسين.",
  },
  {
    to: "/analysis/audience" as const,
    icon: Users,
    title: "تحليل الجمهور",
    text: "الشرائح الأكثر تفاعلًا ونبرتها ومنصاتها وتوزيعها الجغرافي.",
  },
  {
    to: "/analysis/campaigns" as const,
    icon: Megaphone,
    title: "تحليل الحملات",
    text: "أداء الحملات في الوصول والتفاعل والمشاعر وحصة الصوت مع خط زمني.",
  },
  {
    to: "/analysis/discourse" as const,
    icon: MessageSquareQuote,
    title: "تحليل الخطاب الإعلامي",
    text: "الموضوعات والكلمات المفتاحية والنبرة واتجاه الخطاب وتغيّره زمنيًا.",
  },
];

function AnalysisPage() {
  const [prompt, setPrompt] = useState("");
  const [step, setStep] = useState<number | null>(null);

  const aiSteps = [
    "جمع الإشارات",
    "مقارنة المصادر",
    "فهم المشاعر",
    "استخراج الرؤى",
    "إصدار التحليل",
  ];

  const run = () => {
    setStep(0);
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      if (i >= aiSteps.length) {
        window.clearInterval(tick);
        setStep(null);
        return;
      }
      setStep(i);
    }, 800);
  };

  return (
    <AppShell title="التحليل الإعلامي" breadcrumb={["رسين", "التحليل الإعلامي"]}>
      <PageHeader
        icon={ChartNoAxesCombined}
        title="التحليل الإعلامي"
        description="حوّل البيانات الإعلامية إلى رؤى قابلة للفهم واتخاذ القرار."
      />

      <Panel>
        <SectionTitle
          title="محلل رسين"
          hint="اكتب سؤال التحليل بلغة طبيعية وحدد نطاق البيانات"
        />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-prompt">ما تريد تحليله</Label>
              <Textarea
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="اكتب ما تريد تحليله..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                مثال: «حلل سمعة شركة X خلال آخر أسبوع»
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>الفترة</Label>
                <Select defaultValue="7d">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                    <SelectItem value="7d">آخر 7 أيام</SelectItem>
                    <SelectItem value="30d">آخر 30 يومًا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الكيان</Label>
                <Select defaultValue="base">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">الجهة الأساسية</SelectItem>
                    <SelectItem value="c1">المنافس الأول</SelectItem>
                    <SelectItem value="c2">المنافس الثاني</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الموضوع</Label>
                <Select defaultValue={topTopics[0]!.name}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {topTopics.map((t) => (
                      <SelectItem key={t.name} value={t.name}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المصادر</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المصادر</SelectItem>
                    {platforms.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الدول</Label>
                <Select defaultValue="all">
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الدول</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="h-10 w-full gap-2" onClick={run} disabled={step !== null}>
                  {step !== null ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      ابدأ التحليل بالذكاء الاصطناعي
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="panel-muted p-4">
            {step !== null ? (
              <>
                <p className="mb-4 text-sm font-semibold text-foreground">جاري إعداد التحليل</p>
                <ProcessingSteps steps={aiSteps} current={step} />
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-foreground">توزيع المشاعر في النطاق</p>
                <DonutChart
                  height={220}
                  data={[
                    { name: "إيجابي", value: 58, color: "var(--positive)" },
                    { name: "سلبي", value: 19, color: "var(--negative)" },
                    { name: "محايد", value: 23, color: "var(--neutral)" },
                  ]}
                />
              </>
            )}
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle title="وحدات التحليل" hint="ستة مسارات تحليلية متخصصة" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="panel-muted group p-5 transition-colors hover:border-border-strong hover:bg-surface"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-border bg-card text-primary-light">
                <m.icon className="size-5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-foreground">{m.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{m.text}</p>
            </Link>
          ))}
        </div>
      </Panel>

      <AiInsightCard
        summary="التحليل الأخير يشير إلى أن المشهد الإعلامي يتحرك من نقاش الأسعار إلى نقاش جودة الخدمة، مع بقاء التغطية الاقتصادية داعمة للجهة."
        findings={[
          "الخطاب الإعلامي يتجه نحو مفردات الحوكمة والشفافية.",
          "المنافس الأول يتقدم في حصة الصوت لكنه أدنى في مؤشر السمعة.",
          "شريحة قطاع التقنية هي الأكثر إيجابية عند 71%.",
        ]}
        why="اختلاف اتجاه حصة الصوت والسمعة يفتح فرصة تمايز: الحضور الأقل بنبرة أفضل يمكن تحويله إلى ميزة موثوقية."
        confidence={84}
        next="تحليل الخطاب الإعلامي لموضوع جودة الخدمة"
      />
    </AppShell>
  );
}
