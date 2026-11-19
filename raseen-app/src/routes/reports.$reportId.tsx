import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Download, FileText, Share2 } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { raseenLogoUrl } from "@/components/raseen/logo";
import {
  AiInsightCard,
  DeltaBadge,
  KpiCard,
  PageHeader,
  Panel,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { GroupedBars, SentimentAreaChart, TrendLineChart } from "@/components/raseen/charts";
import { Button } from "@/components/ui/button";
import { SentimentBadge } from "@/components/raseen/blocks";
import {
  mentions,
  metricHistory,
  metrics,
  predictions,
  reports,
  sentimentSeries,
  topSources,
  topTopics,
} from "@/lib/mock";

export const Route = createFileRoute("/reports/$reportId")({
  loader: ({ params }) => {
    const report = reports.find((r) => r.id === params.reportId);
    if (!report) throw notFound();
    return { report };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "تقرير غير متوفر | رسين" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { report } = loaderData;
    return {
      meta: [
        { title: `${report.title} | تقارير رسين` },
        {
          name: "description",
          content: `${report.type} — ملخص تنفيذي ومؤشرات وأبرز الأخبار والمصادر والتنبؤات.`,
        },
        { property: "og:title", content: `${report.title} | تقارير رسين` },
        {
          property: "og:description",
          content: "معاينة تقرير إعلامي تحليلي جاهز للتصدير والمشاركة.",
        },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ReportPreviewPage,
});

function ReportPreviewPage() {
  const { report } = Route.useLoaderData();
  const kpiMetrics = metrics.slice(0, 5);

  return (
    <AppShell title={report.title} breadcrumb={["رسين", "التقارير", report.type]}>
      <PageHeader
        icon={FileText}
        title={report.title}
        description={`${report.type} — ${report.date} — ${report.sections} أقسام`}
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              تصدير PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="size-4" />
              مشاركة
            </Button>
            <Button asChild className="gap-2">
              <Link to="/reports">
                <ArrowRight className="size-4" />
                كل التقارير
              </Link>
            </Button>
          </>
        }
      />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <img src={raseenLogoUrl} alt="شعار رسين" className="h-11 w-auto object-contain" />
          <p className="text-xs text-muted-foreground">
            {report.type} — {report.date}
          </p>
        </div>
      </Panel>

      <Panel>
        <SectionTitle title="الملخص التنفيذي" hint="مولّد آليًا من بيانات الفترة المحددة" />
        <p className="text-sm leading-relaxed text-foreground">
          ارتفع الحضور الإعلامي للجهة خلال الفترة بنسبة 8.9% في الوصول، مع تحسن في نبرة التغطية
          الاقتصادية. في المقابل انخفض التفاعل 2.3%، وهو مؤشر على تغطية إخبارية أكثر من نقاش
          جماهيري. الموضوع الأكثر تأثيرًا سلبًا هو انقطاع الخدمة الرقمية، ويحتاج معالجة اتصالية
          خلال 48 ساعة قبل أن يتحول إلى قضية قطاعية.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatRow label="جودة المصادر" value="46% فئة أولى" share={46} tone="primary" />
          <StatRow label="نسبة التغطية الإيجابية" value="58%" share={58} tone="positive" />
          <StatRow label="نسبة التغطية السلبية" value="19%" share={19} tone="negative" />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {kpiMetrics.map((m) => (
          <KpiCard key={m.id} label={m.name} value={m.value} delta={m.change} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="المشاعر" hint="توزيع النبرة خلال الفترة" />
          <SentimentAreaChart data={sentimentSeries} />
        </Panel>
        <Panel>
          <SectionTitle title="الوصول والتفاعل" hint="مقارنة أسبوعية" />
          <TrendLineChart
            data={metricHistory}
            keys={[{ key: "value", label: "المؤشر المركب", color: "var(--chart-1)" }]}
          />
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="الأثر الإعلامي" hint="مقارنة المصادر بحسب الحجم والنبرة" />
        <GroupedBars
          data={topSources.slice(0, 5).map((s) => ({
            name: s.name,
            volume: s.volume,
            share: s.share,
          }))}
          keys={[
            { key: "volume", label: "حجم الإشارات", color: "var(--chart-1)" },
            { key: "share", label: "الحصة %", color: "var(--gold)" },
          ]}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="أبرز الأخبار" hint="الإشارات الأعلى أثرًا" />
          <ul className="divide-y divide-border">
            {mentions.slice(0, 5).map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
                    {m.title}
                  </p>
                  <SentimentBadge value={m.sentiment} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {m.source} — {m.date}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionTitle title="أبرز المصادر" hint="مرتبة بحسب حجم الإشارات" />
            <div className="space-y-3">
              {topSources.slice(0, 5).map((s) => (
                <StatRow
                  key={s.name}
                  label={s.name}
                  value={`${s.volume}`}
                  share={Math.min(100, s.volume / 5)}
                />
              ))}
            </div>
          </Panel>
          <Panel>
            <SectionTitle title="أبرز الموضوعات" hint="الموضوعات الأكثر تكرارًا" />
            <div className="space-y-3">
              {topTopics.slice(0, 5).map((t) => (
                <StatRow
                  key={t.name}
                  label={t.name}
                  value={`${t.volume}`}
                  share={Math.min(100, t.volume / 5)}
                  tone="gold"
                />
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel>
        <SectionTitle title="التنبؤات" hint="مخرجات وحدة التنبؤ المرتبطة بالفترة" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {predictions.map((p) => (
            <li key={p.id} className="panel-muted p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{p.title}</p>
                <DeltaBadge value={p.probability} suffix="%" />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.headline}</p>
              <p className="num mt-2 text-[11px] text-muted-foreground">
                مستوى الخطر: {p.risk} — {p.horizon}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <AiInsightCard
        title="ملخص الذكاء الاصطناعي"
        summary="التغطية تتوسع أفقيًا: مصادر أكثر ووصول أعلى، لكن دون تعميق النقاش. القضية الحرجة الوحيدة هي انقطاع الخدمة الرقمية، وهي مسؤولة عن 71% من الإشارات السلبية في الفترة."
        findings={[
          "58% من التغطية إيجابية مقابل 19% سلبية.",
          "مصدران فقط يقودان 34% من الإشارات السلبية.",
          "مؤشر السمعة عند 78 مع مخاطر انخفاض 3 نقاط خلال أسبوع.",
        ]}
        why="معالجة مصدرين اثنين تكفي لتقليص أغلب الأثر السلبي، وهو تدخل منخفض التكلفة وعالي المردود."
        confidence={89}
        next="إعداد تقرير أزمة مخصص لموضوع انقطاع الخدمة"
      />
    </AppShell>
  );
}
