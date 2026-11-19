import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  PageHeader,
  Panel,
  ScoreDial,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { HorizontalBars, TrendLineChart } from "@/components/raseen/charts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { predictions, predictionSeries } from "@/lib/mock";

export const Route = createFileRoute("/prediction/$predictionId")({
  loader: ({ params }) => {
    const prediction = predictions.find((p) => p.id === params.predictionId);
    if (!prediction) throw notFound();
    return { prediction };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "تنبؤ غير متوفر | رسين" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { prediction } = loaderData;
    return {
      meta: [
        { title: `${prediction.title} | تنبؤ رسين` },
        { name: "description", content: prediction.headline },
        { property: "og:title", content: `${prediction.title} | تنبؤ رسين` },
        { property: "og:description", content: prediction.headline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PredictionDetailPage,
});

const riskTone: Record<string, string> = {
  مرتفع: "bg-destructive/12 text-destructive border-destructive/25",
  متوسط: "bg-warning/15 text-warning-foreground border-warning/40",
  منخفض: "bg-success/12 text-success border-success/25",
};

const timeline = [
  { time: "قبل 3 أيام", text: "أول إشارة: ارتفاع طفيف في حجم التغطية عن المعدل الأسبوعي." },
  { time: "قبل يومين", text: "تحول في النبرة: ارتفاع المشاعر السلبية من 14% إلى 17%." },
  { time: "أمس", text: "دخول مصدرين من الفئة الأولى إلى النقاش." },
  { time: "اليوم", text: "دخول حسابات مؤثرة ورفع مؤشر الخطر إلى 72." },
  { time: "المتوقع", text: "ذروة النقاش خلال 36–60 ساعة إن لم يحدث تدخل اتصالي." },
];

function PredictionDetailPage() {
  const { prediction: p } = Route.useLoaderData();

  return (
    <AppShell title={p.title} breadcrumb={["رسين", "التنبؤ", p.title]}>
      <PageHeader
        icon={TrendingUp}
        title={p.title}
        description={p.headline}
        actions={
          <Button asChild variant="outline" className="gap-2">
            <Link to="/prediction">
              <ArrowRight className="size-4" />
              كل التنبؤات
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionTitle
            title="الاحتمال ومستوى الخطر"
            hint="يُحسب من تقاطع الإشارات في نافذة زمنية قصيرة"
            action={
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-xs font-medium",
                  riskTone[p.risk] ?? riskTone["متوسط"],
                )}
              >
                مستوى الخطر: {p.risk}
              </span>
            }
          />
          <ScoreDial value={p.probability} label="احتمال التحقق" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatRow
              label="درجة الثقة"
              value={`${p.confidence}%`}
              share={p.confidence}
              tone="primary"
            />
            <StatRow
              label="قوة الإشارات"
              value={`${p.signals.length} إشارات`}
              share={Math.min(100, p.signals.length * 22)}
              tone="gold"
            />
            <StatRow label="سرعة التصاعد" value="مرتفعة" share={78} tone="negative" />
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="الأفق الزمني" hint="النافذة المتوقعة للتحقق" />
          <p className="text-2xl font-bold text-foreground">{p.horizon}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            النافذة الزمنية تقديرية وتضيق كلما ارتفع حجم التغطية أو دخلت مصادر جديدة إلى النقاش.
          </p>
          <div className="mt-5 space-y-3">
            <StatRow label="التغطية المتوقعة" value="+34%" share={64} />
            <StatRow label="المشاعر السلبية المتوقعة" value="24%" share={24} tone="negative" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="الخط الزمني للمخاطر" hint="تطور مؤشر الخطر" />
          <TrendLineChart
            data={predictionSeries}
            keys={[{ key: "risk", label: "مؤشر الخطر", color: "var(--destructive)" }]}
          />
        </Panel>
        <Panel>
          <SectionTitle title="وزن الإشارات" hint="مساهمة كل إشارة في النموذج" />
          <HorizontalBars
            data={(p.signals as string[]).map((s: string, i: number) => ({
              name: s.length > 22 ? `${s.slice(0, 22)}…` : s,
              value: 90 - i * 13,
            }))}
          />
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="الإشارات الداعمة" hint="المؤشرات التي بُني عليها التنبؤ" />
        <ul className="space-y-3">
          {(p.signals as string[]).map((s: string) => (
            <li key={s} className="panel-muted flex gap-2 p-3">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              <span className="text-sm leading-relaxed text-foreground">{s}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel>
        <SectionTitle title="الخط الزمني للحدث" hint="من أول إشارة إلى الذروة المتوقعة" />
        <ol className="relative space-y-5 ps-5">
          <span className="absolute inset-y-1 start-1.5 w-px bg-border" aria-hidden="true" />
          {timeline.map((t) => (
            <li key={t.time} className="relative">
              <span className="absolute -start-[13px] top-1.5 size-2.5 rounded-full border border-card bg-primary-light" />
              <p className="text-xs font-semibold text-foreground">{t.time}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
            </li>
          ))}
        </ol>
      </Panel>

      <AiInsightCard
        title="ملخص التنبؤ بالذكاء الاصطناعي"
        summary={p.headline}
        signals={p.signals as string[]}
        why={p.why}
        confidence={p.confidence}
        next="مراجعة إشارات الموضوع في وحدة الرصد الإعلامي"
      />
    </AppShell>
  );
}
