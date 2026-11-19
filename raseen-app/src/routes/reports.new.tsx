import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, Sparkles } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  PageHeader,
  Panel,
  ProcessingSteps,
  SectionTitle,
} from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { countries, languagesList, metrics, platforms, topSources } from "@/lib/mock";

export const Route = createFileRoute("/reports/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: typeof search["type"] === "string" ? (search["type"] as string) : "daily",
  }),
  head: () => ({
    meta: [
      { title: "إنشاء تقرير | رسين" },
      {
        name: "description",
        content: "معالج إنشاء التقارير: النوع والفترة والدولة والموضوع والمصادر والمؤشرات.",
      },
      { property: "og:title", content: "إنشاء تقرير | رسين" },
      { property: "og:description", content: "أنشئ تقريرًا إعلاميًا مخصصًا في خطوات واضحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewReportPage,
});

const typeOptions = [
  { id: "daily", label: "تقرير يومي" },
  { id: "weekly", label: "تقرير أسبوعي" },
  { id: "monthly", label: "تقرير شهري" },
  { id: "crisis", label: "تقرير أزمة" },
  { id: "competitors", label: "تقرير منافسين" },
];

const periodOptions = ["آخر 24 ساعة", "آخر 7 أيام", "آخر 30 يومًا", "الربع الحالي"];

const sectionOptions = [
  "الملخص التنفيذي",
  "حصة الصوت",
  "المشاعر",
  "الوصول والتفاعل",
  "الأثر الإعلامي",
  "أبرز الأخبار",
  "أبرز المصادر",
  "أبرز الموضوعات",
  "التنبؤات",
];

const processingSteps = [
  "تجميع بيانات الرصد",
  "حساب المؤشرات",
  "تحليل النبرة والموضوعات",
  "صياغة الملخص التنفيذي",
  "تجهيز ملف التقرير",
];

function NewReportPage() {
  const { type } = Route.useSearch();
  const navigate = useNavigate();

  const [reportType, setReportType] = useState(type);
  const [period, setPeriod] = useState(periodOptions[1]!);
  const [country, setCountry] = useState<string>(countries[0]!);
  const [topic, setTopic] = useState("الذكاء الاصطناعي والحوكمة");
  const [language, setLanguage] = useState<string>(languagesList[0]);
  const [sources, setSources] = useState<string[]>(topSources.slice(0, 3).map((s) => s.name));
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(
    metrics.slice(0, 4).map((m) => m.id),
  );
  const [sections, setSections] = useState<string[]>(sectionOptions.slice(0, 6));
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!processing) return;
    if (step >= processingSteps.length) {
      const t = window.setTimeout(
        () => navigate({ to: "/reports/$reportId", params: { reportId: "rp-2041" } }),
        700,
      );
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 1000);
    return () => window.clearTimeout(t);
  }, [processing, step, navigate]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  if (processing) {
    const pct = Math.round((Math.min(step, processingSteps.length) / processingSteps.length) * 100);
    return (
      <AppShell title="جاري إعداد التقرير" breadcrumb={["رسين", "التقارير", "جاري الإعداد"]}>
        <PageHeader
          icon={Sparkles}
          title="جاري إعداد التقرير بالذكاء الاصطناعي..."
          description="يجمع المحرك بيانات الفترة المحددة ويحسب المؤشرات ثم يصيغ الملخص التنفيذي."
        />
        <Panel>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
            <ProcessingSteps steps={processingSteps} current={step} />
            <div className="panel-muted grid content-center gap-3 p-5 text-center">
              <Loader2 className="mx-auto size-6 animate-spin text-primary-light" />
              <p className="num text-2xl font-bold text-foreground">{pct}%</p>
              <Progress value={pct} />
              <p className="text-xs leading-relaxed text-muted-foreground">
                لا تغلق الصفحة؛ سيتم فتح معاينة التقرير تلقائيًا بعد الانتهاء.
              </p>
            </div>
          </div>
        </Panel>
      </AppShell>
    );
  }

  return (
    <AppShell title="إنشاء تقرير" breadcrumb={["رسين", "التقارير", "إنشاء تقرير"]}>
      <PageHeader
        icon={FileText}
        title="إنشاء تقرير"
        description="حدد نطاق التقرير ومحتواه، ثم اترك الصياغة للمحرك التحليلي."
        actions={
          <Button className="px-6" onClick={() => setProcessing(true)}>
            إنشاء التقرير
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="نوع التقرير" hint="يحدد الأقسام الافتراضية" />
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">الفترة</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">الدولة</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">الموضوع</Label>
              <Input
                className="h-11"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: حوكمة الذكاء الاصطناعي"
              />
            </div>
            <div>
              <Label className="mb-2 block text-xs text-muted-foreground">اللغة</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languagesList.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="المصادر" hint="اختر المصادر المشمولة في التقرير" />
          <div className="grid gap-2 sm:grid-cols-2">
            {topSources.map((s) => (
              <label
                key={s.name}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5 text-sm"
              >
                <Checkbox
                  checked={sources.includes(s.name)}
                  onCheckedChange={() => toggle(sources, setSources, s.name)}
                />
                <span className="truncate text-foreground">{s.name}</span>
              </label>
            ))}
          </div>

          <SectionTitle title="المنصات" hint="نطاق المنصات المرصودة" />
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="المؤشرات" hint="المؤشرات التي ستظهر في التقرير" />
          <div className="grid gap-2 sm:grid-cols-2">
            {metrics.map((m) => (
              <label
                key={m.id}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5 text-sm"
              >
                <Checkbox
                  checked={selectedMetrics.includes(m.id)}
                  onCheckedChange={() => toggle(selectedMetrics, setSelectedMetrics, m.id)}
                />
                <span className="truncate text-foreground">{m.name}</span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="الأقسام" hint="ترتيب الأقسام يتبع ترتيب القائمة" />
          <div className="grid gap-2">
            {sectionOptions.map((s) => (
              <label
                key={s}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface-2/50 px-3 py-2.5 text-sm"
              >
                <Checkbox
                  checked={sections.includes(s)}
                  onCheckedChange={() => toggle(sections, setSections, s)}
                />
                <span className="truncate text-foreground">{s}</span>
              </label>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={() => setProcessing(true)}>
            إنشاء التقرير
          </Button>
        </Panel>
      </div>
    </AppShell>
  );
}
