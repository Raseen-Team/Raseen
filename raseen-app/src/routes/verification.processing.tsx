import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import { PageHeader, Panel, ProcessingSteps, SectionTitle } from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { verificationSteps } from "@/lib/mock";

export const Route = createFileRoute("/verification/processing")({
  validateSearch: (search: Record<string, unknown>) => ({
    kind: typeof search["kind"] === "string" ? (search["kind"] as string) : "image",
  }),
  head: () => ({
    meta: [
      { title: "جاري التحقق | رسين" },
      {
        name: "description",
        content: "مراحل التحقق: تحليل المصدر، فحص المحتوى، مقارنة البيانات، تحليل السياق.",
      },
      { property: "og:title", content: "جاري التحقق | رسين" },
      { property: "og:description", content: "متابعة مراحل التحقق الإعلامي خطوة بخطوة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificationProcessingPage,
});

const kindLabel: Record<string, string> = {
  image: "تحقق من صورة",
  video: "تحقق من فيديو",
  url: "تحقق من رابط",
  source: "تحقق من مصدر",
};

function VerificationProcessingPage() {
  const { kind } = Route.useSearch();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= verificationSteps.length) {
      const done = window.setTimeout(
        () => navigate({ to: "/verification/result", search: { kind } }),
        700,
      );
      return () => window.clearTimeout(done);
    }
    const t = window.setTimeout(() => setCurrent((c) => c + 1), 1100);
    return () => window.clearTimeout(t);
  }, [current, kind, navigate]);

  const pct = Math.round((Math.min(current, verificationSteps.length) / verificationSteps.length) * 100);

  return (
    <AppShell title="جاري التحقق" breadcrumb={["رسين", "التحقق", "جاري التحقق"]}>
      <PageHeader
        icon={ShieldCheck}
        title="جاري التحقق"
        description={`${kindLabel[kind] ?? "تحقق"} — يعمل المحرك على تحليل المصدر والمحتوى والسياق.`}
        actions={
          <Button variant="outline" onClick={() => navigate({ to: "/verification" })}>
            إلغاء
          </Button>
        }
      />

      <Panel>
        <SectionTitle title="مراحل التحقق" hint="خمس مراحل متسلسلة قبل إصدار النتيجة" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <ProcessingSteps steps={verificationSteps} current={current} />
          <div className="panel-muted grid content-center gap-3 p-5 text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-primary-light" />
            <p className="num text-2xl font-bold text-foreground">{pct}%</p>
            <Progress value={pct} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              يستغرق التحقق عادة أقل من دقيقة، ويعتمد على عدد النسخ المتطابقة للمحتوى.
            </p>
          </div>
        </div>
      </Panel>
    </AppShell>
  );
}
