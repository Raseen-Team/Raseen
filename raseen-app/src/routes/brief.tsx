import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ExternalLink, FileText, Printer } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { EmptyState, ErrorBlock, LoadingPanel, PageHeader, Panel, SectionTitle } from "@/components/raseen/blocks";
import { AiMark, LiveTag, RoleBadge } from "@/components/raseen/live-blocks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dayLabel, hhmm, useLatestBrief, useStories, useTopics } from "@/lib/live";

export const Route = createFileRoute("/brief")({
  head: () => ({ meta: [{ title: "الموجز | رسين" }] }),
  component: BriefPage,
});

function BriefPage() {
  const topics = useTopics();
  const topic = topics.data?.[0];
  const q = useLatestBrief(topic?.id);
  const stories = useStories(topic?.id);
  const [hot, setHot] = useState<number | null>(null);

  const b = q.data;
  const showEvidence = (n: number) => {
    setHot(n);
    document.getElementById(`ev-${n}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const storyIdFor = (articleId: string | null) =>
    stories.data?.find((s) => s.first_article_id === articleId)?.id;

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="الموجز"
        description="كل معلومة في الموجز مربوطة بدليلها. اضغط على الرقم لتشوف الخبر اللي جت منه."
        actions={
          <>
            <LiveTag />
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="size-4" />
              طباعة أو PDF
            </Button>
          </>
        }
      />

      {q.isLoading || topics.isLoading ? <LoadingPanel /> : null}
      {q.error ? <ErrorBlock onRetry={() => q.refetch()} /> : null}
      {q.data === null ? (
        <EmptyState title="ما فيه موجز بعد" description="رسين يكتب الموجز بعد أول جولة رصد فيها أخبار عن الموضوع." />
      ) : null}

      {b ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Panel className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <p className="text-xs text-muted-foreground">
                  من {dayLabel(b.period_from)} <span className="num">{hhmm(b.period_from)}</span> إلى {dayLabel(b.period_to)}{" "}
                  <span className="num">{hhmm(b.period_to)}</span>
                </p>
                <h2 className="mt-1 text-2xl font-bold">{b.title}</h2>
              </div>
              <AiMark label={b.model === "extractive" ? "موجز آلي من العناوين" : "كتبه الذكاء الاصطناعي"} />
            </div>
            <ol className="mt-6 space-y-5">
              {b.claims.map((c, i) => (
                <li key={i} className="flex gap-3 text-[16px] leading-[2]">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-light" />
                  <p>
                    {c.text}{" "}
                    {c.evidence.map((n) => (
                      <button
                        key={n}
                        onClick={() => showEvidence(n)}
                        className={cn(
                          "num mx-0.5 rounded-md border px-1.5 text-xs font-semibold transition-colors",
                          hot === n ? "border-gold bg-gold text-gold-foreground" : "border-primary-light/30 bg-primary-light/10 text-primary-light hover:bg-primary-light/20",
                        )}
                      >
                        [{n}]
                      </button>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              مسودة من رسين. يراجعها المختص قبل الإرسال، ولا تحكم على صحة الادعاءات.
            </p>
          </Panel>

          <Panel>
            <SectionTitle title="الأدلة" hint={`${b.evidence.length} أخبار يستند إليها الموجز`} />
            <ol className="space-y-3">
              {b.evidence.map((e) => {
                const sid = storyIdFor(e.article_id);
                return (
                  <li
                    key={e.n}
                    id={`ev-${e.n}`}
                    className={cn("rounded-xl border p-3 transition-colors", hot === e.n ? "border-gold bg-gold/10" : "border-border")}
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="num rounded-md bg-primary px-1.5 font-semibold text-primary-foreground">{e.n}</span>
                      <span className="font-medium text-foreground">{e.source}</span>
                      {e.official ? <span className="text-positive">رسمي</span> : null}
                      <span className="num">{hhmm(e.published_at)}</span>
                      {e.role ? <RoleBadge role={e.role} /> : null}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{e.title}</p>
                    <div className="mt-2 flex gap-3 text-xs">
                      {e.url && e.url !== "#" ? (
                        <a href={e.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary-light hover:underline">
                          الخبر الأصلي <ExternalLink className="size-3" />
                        </a>
                      ) : null}
                      {sid ? (
                        <Link to="/stories/$storyId" params={{ storyId: sid }} className="text-primary-light hover:underline">
                          القصة كاملة
                        </Link>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Panel>
        </div>
      ) : null}
    </AppShell>
  );
}
