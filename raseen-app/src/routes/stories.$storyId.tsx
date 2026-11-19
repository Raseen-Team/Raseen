import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Clock, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/raseen/shell";
import { ErrorBlock, LoadingPanel, Panel, SectionTitle } from "@/components/raseen/blocks";
import { AiMark, RoleBadge, StatusBadge } from "@/components/raseen/live-blocks";
import { Button } from "@/components/ui/button";
import { dayLabel, hhmm, isLive, useReviewStory, useStory } from "@/lib/live";
import { org } from "@/lib/mock";

export const Route = createFileRoute("/stories/$storyId")({
  head: () => ({ meta: [{ title: "القصة | رسين" }] }),
  component: StoryPage,
});

function StoryPage() {
  const { storyId } = Route.useParams();
  const q = useStory(storyId);
  const review = useReviewStory();

  if (q.isLoading) return <AppShell><LoadingPanel /></AppShell>;
  if (q.error || !q.data) return <AppShell><ErrorBlock onRetry={() => q.refetch()} /></AppShell>;

  const { story: s, articles } = q.data;
  const first = articles.find((a) => a.role === "first")?.article;
  const conf = Math.round((s.first_confidence ?? 0) * 100);
  const decide = (status: "verified" | "review" | "unsupported", msg: string) =>
    review.mutate({ id: s.id, status, by: org.user }, { onSuccess: () => toast.success(msg), onError: (e) => toast.error(e.message) });

  return (
    <AppShell>
      <header className="rs-head animate-rise space-y-3 pt-2">
        <Link to="/stories" className="rs-desc inline-flex items-center gap-1 text-sm hover:text-white">
          <ChevronRight className="size-4" />
          القصص
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <h1 className="text-[22px] font-bold leading-snug sm:text-[28px]">{s.title}</h1>
            <p className="rs-desc mt-2 text-sm">
              <span className="num">{s.article_count}</span> خبرًا من <span className="num">{s.source_count}</span> مصادر، جمعها رسين في قصة واحدة:{" "}
              <span className="num">{s.republish_count}</span> إعادة نشر و<span className="num">{s.update_count}</span> تحديثات جديدة
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={s.status} className="bg-white" />
            <Button asChild className="gap-2 bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/brief">
                <FileText className="size-4" />
                افتح الموجز
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Panel>
            <SectionTitle title="المصدر الأول المرشّح" hint="رسين يرشّح، والمختص يعتمد" action={<AiMark />} />
            {first ? (
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">
                    {first.source?.name ?? "مصدر غير معروف"}
                    {first.source?.is_official ? <span className="ms-2 text-xs font-normal text-positive">مصدر رسمي</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="num">{hhmm(first.published_at)}</span> · {dayLabel(first.published_at)}
                  </p>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed">«{first.title}»</p>
                {first.url && first.url !== "#" ? (
                  <a href={first.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary-light hover:underline">
                    فتح الخبر الأصلي <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </div>
            ) : null}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {s.first_reasons.map((r) => (
                <div key={r.key} className="rounded-xl border border-border p-3">
                  <p className="text-[11px] text-muted-foreground">{r.label}</p>
                  <p className="num mt-1 text-lg font-semibold">{r.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              ثقة الترشيح
              <span className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-gold" style={{ width: `${conf}%` }} />
              </span>
              <span className="num">{conf}%</span>
            </div>
          </Panel>

          <Panel>
            <SectionTitle title="كيف انتشر الخبر" hint="من أول ظهور إلى آخر خبر، مرتّب بالوقت" />
            <ol className="relative space-y-4 border-s border-border ps-5">
              {articles.map(({ role, similarity, article: a }) => (
                <li key={a.id} className="relative">
                  <span className={`absolute -start-[27px] top-1.5 size-3 rounded-full border-2 border-card ${role === "first" ? "bg-gold" : a.source?.is_official ? "bg-positive" : role === "update" ? "bg-primary-light" : "bg-neutral"}`} />
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="num font-semibold text-foreground">{hhmm(a.published_at)}</span>
                    <span>{a.source?.name}</span>
                    <RoleBadge role={role} />
                    {similarity != null && role !== "first" ? <span>تشابه <span className="num">{Math.round(similarity * 100)}%</span></span> : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{a.title}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel className="bg-primary text-primary-foreground">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
                {s.status === "verified" ? <CheckCircle2 className="size-5 text-[#3CC8CF]" /> : s.status === "unsupported" ? <ShieldAlert className="size-5 text-[#ff8a7d]" /> : <Clock className="size-5 text-gold" />}
              </span>
              <div>
                <p className="text-xs text-white/60">تقييم رسين</p>
                <p className="text-lg font-semibold">{s.status === "verified" ? "موثّق من مصدر رسمي" : s.status === "unsupported" ? "ادعاء غير مدعوم" : "قيد المراجعة"}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              {s.status === "unsupported"
                ? "انتشر بدون تأكيد من مصدر رسمي، أو نفاه مصدر رسمي."
                : s.status === "verified"
                  ? "نشره أو أكده مصدر رسمي ضمن هذه القصة."
                  : "رسين ما قدر يحسم المصدر الأول بثقة كافية، فيحتاج نظرة المختص."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" disabled={review.isPending} onClick={() => decide(s.status, "اعتمدت التقييم")} className="bg-gold text-gold-foreground hover:bg-gold/90">
                اعتماد التقييم
              </Button>
              <Button size="sm" variant="outline" disabled={review.isPending} onClick={() => decide("review", "بقيت القصة قيد المراجعة")} className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                إبقاء قيد المراجعة
              </Button>
            </div>
            <p className="mt-3 text-[11px] text-white/50">
              {s.reviewed_by ? `راجعها ${s.reviewed_by} الساعة ${hhmm(s.reviewed_at)}` : "التحقق يعتمده المختص، وقرار الاستجابة للمسؤول"}
              {!isLive ? " · تجريبي" : ""}
            </p>
          </Panel>

          <Panel>
            <SectionTitle title="ملخص سريع" />
            <dl className="space-y-3 text-sm">
              <Row k="أول ظهور" v={`${hhmm(s.first_seen)} · ${dayLabel(s.first_seen)}`} />
              <Row k="آخر خبر" v={`${hhmm(s.last_seen)} · ${dayLabel(s.last_seen)}`} />
              <Row k="إعادة نشر" v={String(s.republish_count)} />
              <Row k="تحديثات جديدة" v={String(s.update_count)} />
              <Row k="مصادر رسمية" v={String(new Set(articles.filter((a) => a.article.source?.is_official).map((a) => a.article.source?.id)).size)} />
            </dl>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="num font-medium">{v}</dd>
    </div>
  );
}
