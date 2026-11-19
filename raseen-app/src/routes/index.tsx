import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  ExternalLink,
  Gauge,
  MessageSquareQuote,
  Newspaper,
  RefreshCw,
  Radio,
  ShieldAlert,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  DeltaBadge,
  EmptyState,
  KpiCard,
  LoadingBlock,
  Panel,
  SectionTitle,
  SentimentBadge,
  SeverityBadge,
  StatRow,
} from "@/components/raseen/blocks";
import { DonutChart, SentimentAreaChart, TrendLineChart } from "@/components/raseen/charts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  kpis,
  mentions,
  metrics,
  predictions,
  sentimentSeries,
  smartAlerts,
  topSources,
  topTopics,
  trendSeries,
} from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "لوحة المؤشرات | رسين" },
      {
        name: "description",
        content:
          "ملخص المشهد الإعلامي اليوم: حجم التغطية، المشاعر، حصة الصوت، التنبيهات الذكية والتنبؤات.",
      },
      { property: "og:title", content: "لوحة المؤشرات | رسين" },
      {
        property: "og:description",
        content: "إليك ملخص المشهد الإعلامي اليوم من منصة رسين.",
      },
    ],
  }),
  component: DashboardPage,
});

const metricIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "share-of-voice": MessageSquareQuote,
  sentiment: ChartNoAxesCombined,
  reach: Radio,
  engagement: Users,
  "media-impact": Gauge,
  influencers: Users,
  "trend-index": TrendingUp,
  "reputation-score": ShieldAlert,
};

type ViewState = "default" | "loading" | "empty";

function DashboardPage() {
  const [range, setRange] = useState<keyof typeof trendSeries>("7d");
  const [view, setView] = useState<ViewState>("default");

  return (
    <AppShell title="لوحة المؤشرات" breadcrumb={["رسين", "الرئيسية"]}>
      <header className="rs-head grid grid-cols-[minmax(0,1fr)] gap-5 pt-2 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-[30px]">مرحبًا بك في رسين</h1>
          <p className="rs-desc mt-1.5 text-sm">
            إليك ملخص المشهد الإعلامي اليوم
          </p>
          <div className="rs-desc mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              الثلاثاء، 4 أغسطس 2026
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="size-3.5" />
              آخر تحديث: قبل 6 دقائق
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewState)}>
            <TabsList>
              <TabsTrigger value="default">البيانات</TabsTrigger>
              <TabsTrigger value="loading">التحميل</TabsTrigger>
              <TabsTrigger value="empty">لا بيانات</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="gap-2 bg-gold text-gold-foreground hover:bg-gold/90">
            <RefreshCw className="size-4" />
            تحديث البيانات
          </Button>
        </div>
      </header>

      {view === "loading" ? <DashboardLoading /> : null}

      {view === "empty" ? (
        <EmptyState
          title="لا توجد بيانات رصد لهذه الفترة"
          description="لم يتم رصد أي إشارات إعلامية مطابقة لإعدادات الرصد الحالية. عدّل الكلمات المفتاحية أو وسّع الفترة الزمنية لبدء جمع البيانات."
          actionLabel="الانتقال إلى إعدادات الرصد"
          icon={Radio}
        />
      ) : null}

      {view === "default" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k, i) => (
              <KpiCard
                key={k.key}
                label={k.label}
                value={k.value}
                delta={k.delta}
                unit={k.unit}
                icon={i === 0 ? Newspaper : ChartNoAxesCombined}
                tone={
                  k.key === "positive"
                    ? "positive"
                    : k.key === "negative"
                      ? "negative"
                      : k.key === "neutral"
                        ? "neutral"
                        : "default"
                }
              />
            ))}
          </div>

          <Panel>
            <SectionTitle
              title="مؤشرات الاستخبارات الإعلامية"
              hint="ثمانية مؤشرات مركبة تلخص حضور الجهة في المشهد الإعلامي"
              action={
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link to="/metrics">
                    كل المؤشرات
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => {
                const Icon = metricIcons[m.id] ?? Gauge;
                return (
                  <Link
                    key={m.id}
                    to="/metrics/$metricId"
                    params={{ metricId: m.id }}
                    className="panel-muted group p-4 transition-colors hover:border-border-strong hover:bg-surface"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-muted-foreground">{m.name}</span>
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="num mt-2 text-xl font-bold text-foreground">{m.value}</p>
                    <div className="mt-2">
                      <DeltaBadge value={m.change} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <SectionTitle
                title="توزيع المشاعر"
                hint="إيجابي، سلبي، محايد — آخر سبعة أيام"
              />
              <SentimentAreaChart data={sentimentSeries} />
            </Panel>

            <Panel>
              <SectionTitle title="مصادر التغطية" hint="نصيب كل منصة من إجمالي الإشارات" />
              <DonutChart
                data={[
                  { name: "الأخبار والصحف", value: 789, color: "var(--chart-1)" },
                  { name: "المواقع", value: 297, color: "var(--chart-2)" },
                  { name: "المنصات الاجتماعية", value: 498, color: "var(--chart-3)" },
                  { name: "التلفزيون والراديو", value: 186, color: "var(--chart-5)" },
                ]}
              />
            </Panel>
          </div>

          <Panel>
            <SectionTitle
              title="اتجاه حجم التغطية والوصول"
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

          <div className="grid gap-5 lg:grid-cols-2">
            <Panel>
              <SectionTitle title="أهم الموضوعات" hint="حسب حجم التغطية والتغير عن الفترة السابقة" />
              <ul className="space-y-4">
                {topTopics.map((t) => (
                  <li key={t.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2 text-sm text-foreground">
                        <Tags className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{t.name}</span>
                      </span>
                      <DeltaBadge value={t.change} />
                    </div>
                    <StatRow
                      label=""
                      value={`${t.volume} إشارة`}
                      share={Math.round((t.volume / 412) * 100)}
                      tone="gold"
                    />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel>
              <SectionTitle title="أهم المصادر" hint="الأخبار والصحف والمواقع والتلفزيون والمنصات" />
              <ul className="space-y-3.5">
                {topSources.map((s) => (
                  <li key={s.name}>
                    <StatRow label={s.name} value={`${s.volume} — ${s.share}%`} share={s.share * 4} />
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel padded={false}>
            <div className="p-5 pb-0">
              <SectionTitle
                title="أحدث الإشارات الإعلامية"
                hint="آخر الأخبار والإشارات المرصودة عبر المنصات"
                action={
                  <Button asChild variant="outline" size="sm" className="gap-1.5">
                    <Link to="/monitoring">
                      الرصد الإعلامي
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </Button>
                }
              />
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-start">العنوان</TableHead>
                    <TableHead className="text-start">المصدر</TableHead>
                    <TableHead className="text-start">المنصة</TableHead>
                    <TableHead className="text-start">المشاعر</TableHead>
                    <TableHead className="text-start">الوصول</TableHead>
                    <TableHead className="text-start">التفاعل</TableHead>
                    <TableHead className="text-start">الرابط</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mentions.slice(0, 6).map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="max-w-[380px]">
                        <Link
                          to="/monitoring"
                          className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary-light"
                        >
                          {m.title}
                        </Link>
                        <p className="mt-1 text-[11px] text-muted-foreground">{m.date}</p>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.source}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.platform}</TableCell>
                      <TableCell>
                        <SentimentBadge value={m.sentiment} />
                      </TableCell>
                      <TableCell className="num text-sm text-muted-foreground">
                        {(m.reach / 1000).toFixed(1)}K
                      </TableCell>
                      <TableCell className="num text-sm text-muted-foreground">
                        {(m.engagement / 1000).toFixed(1)}K
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" aria-label="فتح المصدر الأصلي">
                          <ExternalLink className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-2">
            <Panel>
              <SectionTitle title="التنبيهات الذكية" hint="إشارات تستحق المتابعة الآن" />
              <ul className="space-y-3">
                {smartAlerts.map((a) => (
                  <li key={a.id} className="panel-muted p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {a.description}
                    </p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{a.time}</p>
                  </li>
                ))}
              </ul>
            </Panel>

            <div className="space-y-5">
              <Panel>
                <SectionTitle
                  title="ملخص التنبؤ"
                  hint="اضغط على أي بطاقة لعرض التفاصيل والإشارات الداعمة"
                  action={
                    <Button asChild variant="outline" size="sm" className="gap-1.5">
                      <Link to="/prediction">
                        لوحة التنبؤ
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  }
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  {predictions.map((p) => (
                    <Link
                      key={p.id}
                      to="/prediction/$predictionId"
                      params={{ predictionId: p.id }}
                      className="panel-muted p-4 transition-colors hover:border-border-strong hover:bg-surface"
                    >
                      <p className="text-xs text-muted-foreground">{p.title}</p>
                      <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-foreground">
                        {p.headline}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="num text-lg font-bold text-foreground">
                          {p.probability}%
                        </span>
                        <span className="text-[11px] text-muted-foreground">{p.horizon}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Panel>

              <AiInsightCard
                summary="حجم التغطية اليوم أعلى من المتوسط الأسبوعي بنسبة 12%، والنبرة الإيجابية ما زالت مسيطرة عند 58%، لكن مركز الثقل السلبي انتقل من الأسعار إلى جودة الخدمة الرقمية."
                findings={[
                  "موضوع انقطاع الخدمة يمثل 61% من الإشارات السلبية اليوم.",
                  "منصة X تقود الانتشار بمعدل تفاعل أعلى بثلاث مرات من المتوسط.",
                  "المصادر الاقتصادية المتخصصة تحافظ على نبرة داعمة.",
                ]}
                why="تحوّل مصدر السلبية يعني أن معالجة الأسعار لن تخفض المؤشر السلبي؛ الاستجابة يجب أن تكون تشغيلية ومرتبطة بجودة الخدمة."
                signals={["نمو الحجم 24%", "المشاعر السلبية 19%", "دخول 6 مؤثرين جدد"]}
                confidence={86}
                next="تحليل الخطاب الإعلامي لموضوع جودة الخدمة خلال آخر 72 ساعة"
              />
            </div>
          </div>
        </>
      ) : null}
    </AppShell>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Panel key={i}>
            <LoadingBlock rows={3} />
          </Panel>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <div className="skeleton-bar h-[280px]" />
        </Panel>
        <Panel>
          <div className="skeleton-bar h-[280px]" />
        </Panel>
      </div>
      <Panel>
        <LoadingBlock rows={6} />
      </Panel>
    </div>
  );
}
