import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleCheck,
  CircleHelp,
  CircleSlash,
  Download,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  PageHeader,
  Panel,
  ScoreDial,
  SectionTitle,
  StatRow,
} from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { similarSources, verificationEvidence } from "@/lib/mock";

export const Route = createFileRoute("/verification/result")({
  validateSearch: (search: Record<string, unknown>) => ({
    kind: typeof search["kind"] === "string" ? (search["kind"] as string) : "image",
  }),
  head: () => ({
    meta: [
      { title: "نتيجة التحقق | رسين" },
      {
        name: "description",
        content: "نتيجة التحقق مع درجة الثقة والبيانات الوصفية والأدلة والمصادر المشابهة.",
      },
      { property: "og:title", content: "نتيجة التحقق | رسين" },
      { property: "og:description", content: "تقرير تحقق تفصيلي مع تفسير بالذكاء الاصطناعي." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificationResultPage,
});

type Status = "trusted" | "needs" | "misleading" | "untrusted";

const statusMap: Record<
  Status,
  { label: string; icon: typeof CircleCheck; cls: string }
> = {
  trusted: {
    label: "موثوق",
    icon: CircleCheck,
    cls: "bg-positive/12 text-positive border-positive/25",
  },
  needs: {
    label: "يحتاج تحقق",
    icon: CircleHelp,
    cls: "bg-warning/15 text-warning-foreground border-warning/40",
  },
  misleading: {
    label: "مضلل",
    icon: TriangleAlert,
    cls: "bg-destructive/12 text-destructive border-destructive/25",
  },
  untrusted: {
    label: "غير موثوق",
    icon: CircleSlash,
    cls: "bg-negative/12 text-negative border-negative/25",
  },
};

function StatusBadge({ status }: { status: Status }) {
  const m = statusMap[status];
  const Icon = m.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold",
        m.cls,
      )}
    >
      <Icon className="size-4" />
      {m.label}
    </span>
  );
}

const metadata = [
  { label: "نوع الملف", value: "JPEG — 1920×1080" },
  { label: "تاريخ الإنشاء", value: "غير متوفر" },
  { label: "أول نشر مرصود", value: "2024-11-02" },
  { label: "الموقع الجغرافي", value: "غير محدد في البيانات الوصفية" },
  { label: "أدوات تعديل مرصودة", value: "تعديل في الإضاءة والاقتصاص" },
  { label: "عدد النسخ المتطابقة", value: "7 نسخ" },
];

const trustMap: Record<string, Status> = {
  موثوق: "trusted",
  "يحتاج تحقق": "needs",
  "غير موثوق": "untrusted",
};

function VerificationResultPage() {
  return (
    <AppShell title="نتيجة التحقق" breadcrumb={["رسين", "التحقق", "النتيجة"]}>
      <PageHeader
        icon={ShieldCheck}
        title="نتيجة التحقق"
        description="المحتوى أصلي لكنه استُخدم في سياق مختلف عن الحدث الأصلي."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              تصدير PDF
            </Button>
            <Button asChild className="gap-2">
              <Link to="/verification">
                <ArrowRight className="size-4" />
                تحقق جديد
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionTitle
            title="درجة الثقة"
            hint="تُحسب من مطابقة السياق وجودة المصدر والبيانات الوصفية"
            action={<StatusBadge status="misleading" />}
          />
          <ScoreDial value={34} label="درجة الثقة في صحة الاستخدام" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatRow label="أصالة المحتوى" value="82%" share={82} tone="positive" />
            <StatRow label="مطابقة السياق" value="21%" share={21} tone="negative" />
            <StatRow label="ثقة المصدر الناشر" value="38%" share={38} tone="gold" />
          </div>
        </Panel>

        <Panel>
          <SectionTitle title="حالات النتيجة" hint="التصنيفات المعتمدة في رسين" />
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="trusted" />
            <StatusBadge status="needs" />
            <StatusBadge status="misleading" />
            <StatusBadge status="untrusted" />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            التصنيف الحالي «مضلل» لأن المحتوى حقيقي لكن السياق المرفق به لا يطابق الحدث الأصلي،
            وهو النمط الأكثر شيوعًا في الإشارات المضللة.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle title="البيانات الوصفية" hint="Metadata مستخرجة من الملف" />
          <dl className="divide-y divide-border">
            {metadata.map((m) => (
              <div key={m.label} className="flex flex-wrap justify-between gap-2 py-2.5">
                <dt className="text-sm text-muted-foreground">{m.label}</dt>
                <dd className="text-sm text-foreground">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel>
          <SectionTitle title="الأدلة" hint="مخرجات مراحل الفحص الخمس" />
          <ul className="space-y-3">
            {verificationEvidence.map((e) => (
              <li key={e.label} className="panel-muted p-3">
                <p className="text-xs font-semibold text-foreground">{e.label}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{e.value}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel>
        <SectionTitle title="مصادر مشابهة" hint="نسخ المحتوى مرتبة بحسب تاريخ النشر" />
        <ul className="divide-y divide-border">
          {similarSources.map((s) => (
            <li key={s.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className="text-sm text-foreground">{s.name}</p>
              <div className="flex items-center gap-3">
                <span className="num text-xs text-muted-foreground" dir="ltr">
                  {s.date}
                </span>
                <StatusBadge status={trustMap[s.trust] ?? "needs"} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <AiInsightCard
        title="تفسير بالذكاء الاصطناعي"
        summary="الصورة أصلية وأول ظهور لها في نوفمبر 2024 داخل أرشيف صحيفة إقليمية، لكنها أُعيد نشرها في أغسطس 2026 مرتبطة بحدث مختلف تمامًا. التصنيف: مضلل."
        findings={[
          "فجوة 21 شهرًا بين أقدم ظهور وتاريخ الانتشار الحالي.",
          "إزالة البيانات الوصفية تشير إلى إعادة معالجة الملف قبل النشر.",
          "أعلى نسخة انتشارًا جاءت من حساب مجهول الهوية.",
        ]}
        why="نشر محتوى أصلي في سياق خاطئ يصعب دحضه لأن الصورة نفسها صحيحة؛ الرد الفعّال يعتمد على نشر السياق الأصلي مع رابط الأرشيف."
        confidence={91}
        next="متابعة انتشار النسخة المضللة في وحدة الرصد"
      />
    </AppShell>
  );
}
