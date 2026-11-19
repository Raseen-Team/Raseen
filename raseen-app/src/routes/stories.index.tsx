import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, FileText, Layers } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { EmptyState, ErrorBlock, LoadingPanel, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { CoverageChart, LiveTag, StatusBadge } from "@/components/raseen/live-blocks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hhmm, useCoverage, useStories, useTopics, type StoryStatus } from "@/lib/live";

export const Route = createFileRoute("/stories/")({
  head: () => ({ meta: [{ title: "القصص | رسين" }] }),
  component: StoriesPage,
});

type Filter = "all" | StoryStatus;

function StoriesPage() {
  const topics = useTopics();
  const topic = topics.data?.[0];
  const stories = useStories(topic?.id);
  const coverage = useCoverage(topic?.id);
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => (stories.data ?? []).filter((s) => filter === "all" || s.status === filter), [stories.data, filter]);
  const all = stories.data ?? [];
  const total = all.reduce((n, s) => n + s.article_count, 0);

  return (
    <AppShell>
      <PageHeader
        icon={Layers}
        title="القصص"
        description={topic ? `الأخبار المكررة عن «${topic.name}» مجمّعة في قصص، ومع كل قصة المصدر الأول المرشّح وقرائنه.` : "الأخبار المكررة مجمّعة في قصص."}
        actions={
          <>
            <LiveTag />
            <Button asChild className="gap-2 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/brief">
                <FileText className="size-4" />
                افتح الموجز
              </Link>
            </Button>
          </>
        }
      />

      {stories.isLoading || topics.isLoading ? <LoadingPanel /> : null}
      {stories.error || topics.error ? <ErrorBlock onRetry={() => stories.refetch()} /> : null}

      {stories.data ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="أخبار مرصودة" value={total} hint="آخر 7 أيام" />
            <Stat label="قصص بعد التجميع" value={all.length} hint={`بدل ${total} خبرًا متفرقًا`} />
            <Stat label="ادعاءات غير مدعومة" value={all.filter((s) => s.status === "unsupported").length} tone="neg" hint="انتشرت بدون تأكيد رسمي" />
            <Stat label="بانتظار المختص" value={all.filter((s) => s.status === "review").length} tone="gold" hint="لم يُحسم مصدرها" />
          </div>

          <Panel>
            <SectionTitle title="حجم التغطية" hint="عدد الأخبار في كل ساعة، آخر 48 ساعة" />
            <CoverageChart data={coverage.data ?? []} />
          </Panel>

          <Panel padded={false} className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold">كل القصص</h2>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                <TabsList>
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="unsupported">ادعاءات</TabsTrigger>
                  <TabsTrigger value="review">قيد المراجعة</TabsTrigger>
                  <TabsTrigger value="verified">موثّقة</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {list.length === 0 ? (
              <div className="p-5">
                <EmptyState title="لا توجد قصص هنا" description="أول ما يلتقط رسين أخبارًا عن الموضوع تظهر القصص هنا. الرصد يتحدث كل ساعة." />
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {list.map((s) => {
                  const when = s.first_reasons.find((r) => r.key === "earliest")?.value ?? hhmm(s.first_seen);
                  return (
                    <li key={s.id}>
                      <Link
                        to="/stories/$storyId"
                        params={{ storyId: s.id }}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-surface-2 md:grid-cols-[minmax(0,1fr)_repeat(3,72px)_140px_20px]"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{s.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            المصدر الأول المرشّح · <span className="num">{when}</span>
                            {s.first_confidence != null ? <> · ثقة <span className="num">{Math.round(s.first_confidence * 100)}%</span></> : null}
                          </p>
                        </div>
                        <Num v={s.article_count} l="خبر" />
                        <Num v={s.source_count} l="مصدر" />
                        <Num v={s.update_count} l="تحديث" />
                        <div className="justify-self-end md:justify-self-start">
                          <StatusBadge status={s.status} />
                        </div>
                        <ChevronLeft className="hidden size-4 text-muted-foreground md:block" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </>
      ) : null}
    </AppShell>
  );
}

function Num({ v, l }: { v: number; l: string }) {
  return (
    <div className="hidden text-center md:block">
      <p className="num text-base font-semibold">{v}</p>
      <p className="text-[11px] text-muted-foreground">{l}</p>
    </div>
  );
}

function Stat({ label, value, hint, tone }: { label: string; value: number; hint: string; tone?: "neg" | "gold" }) {
  return (
    <div className="panel p-5">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className={tone === "neg" ? "num mt-3 text-[30px] font-bold text-negative" : tone === "gold" ? "num mt-3 text-[30px] font-bold text-[#8a6d0b]" : "num mt-3 text-[30px] font-bold"}>{value}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}
