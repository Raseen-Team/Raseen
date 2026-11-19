import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  FileSearch,
  Image as ImageIcon,
  Link2,
  ShieldCheck,
  UploadCloud,
  Video,
} from "lucide-react";

import { AppShell } from "@/components/raseen/shell";
import {
  EmptyState,
  ErrorBlock,
  PageHeader,
  Panel,
  SectionTitle,
} from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verification/")({
  head: () => ({
    meta: [
      { title: "التحقق | رسين" },
      {
        name: "description",
        content: "تحقق من صحة الصور والفيديوهات والمصادر والمعلومات الإعلامية عبر رسين.",
      },
      { property: "og:title", content: "التحقق | رسين" },
      {
        property: "og:description",
        content: "أداة تحقق إعلامي تعتمد على تحليل المصدر والسياق والبيانات الوصفية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerificationPage,
});

type Kind = "image" | "video" | "url" | "source";

const kinds: { id: Kind; label: string; hint: string; icon: typeof ImageIcon }[] = [
  {
    id: "image",
    label: "تحقق من صورة",
    hint: "بحث عكسي، بيانات EXIF، وأقدم ظهور للصورة.",
    icon: ImageIcon,
  },
  {
    id: "video",
    label: "تحقق من فيديو",
    hint: "تحليل الإطارات، مطابقة المشاهد، وسياق النشر.",
    icon: Video,
  },
  {
    id: "url",
    label: "تحقق من رابط",
    hint: "فحص الصفحة، تاريخ النشر، ومسار الانتشار.",
    icon: Link2,
  },
  {
    id: "source",
    label: "تحقق من مصدر",
    hint: "سجل المصدر، مستوى الثقة، وسلوك النشر.",
    icon: FileSearch,
  },
];

const recent = [
  { id: "vf-9012", title: "صورة منسوبة لحدث اقتصادي", status: "مضلل", date: "قبل ساعة" },
  { id: "vf-9008", title: "مقطع فيديو عن انقطاع الخدمة", status: "يحتاج تحقق", date: "أمس" },
  { id: "vf-8997", title: "رابط خبر عن التوسع الإقليمي", status: "موثوق", date: "قبل 3 أيام" },
];

function VerificationPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<Kind>("image");
  const [file, setFile] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);

  const needsUrl = kind === "url" || kind === "source";
  const ready = needsUrl ? url.trim().length > 4 : Boolean(file);

  const start = () => {
    if (!ready) {
      setError(true);
      return;
    }
    setError(false);
    navigate({ to: "/verification/processing", search: { kind } });
  };

  return (
    <AppShell title="التحقق" breadcrumb={["رسين", "التحقق"]}>
      <PageHeader
        icon={ShieldCheck}
        title="التحقق"
        description="تحقق من صحة الصور والفيديوهات والمصادر والمعلومات الإعلامية."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kinds.map((k) => {
          const active = kind === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              aria-pressed={active}
              className={cn(
                "panel p-5 text-start transition-shadow hover:shadow-md",
                active && "border-primary-light/50 ring-1 ring-primary-light/30",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-xl border border-border bg-surface-2",
                  active ? "text-gold" : "text-primary-light",
                )}
              >
                <k.icon className="size-5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-foreground">{k.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{k.hint}</p>
            </button>
          );
        })}
      </div>

      <Panel>
        <SectionTitle
          title="مصدر التحقق"
          hint={
            needsUrl
              ? "الصق الرابط أو اسم المصدر الذي تريد فحصه"
              : "يدعم الصور والفيديوهات حتى 200 ميجابايت"
          }
        />

        {needsUrl ? (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              dir="ltr"
              placeholder="https://example.com/news/article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11"
            />
            <Button className="h-11 px-6" onClick={start}>
              ابدأ التحقق
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) setFile(f.name);
              }}
              className={cn(
                "grid place-items-center rounded-2xl border border-dashed border-border bg-surface-2/60 px-6 py-12 text-center transition-colors",
                dragging && "border-gold/60 bg-gold/8",
              )}
            >
              <span className="grid size-12 place-items-center rounded-2xl border border-border bg-card text-primary-light">
                <UploadCloud className="size-5" />
              </span>
              <p className="mt-4 text-sm font-medium text-foreground">
                اسحب الملف هنا أو اختر ملفاً
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {kind === "video" ? "MP4, MOV, WEBM" : "JPG, PNG, WEBP"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => inputRef.current?.click()}
              >
                اختيار ملف
              </Button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={kind === "video" ? "video/*" : "image/*"}
                onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
              />
              {file ? (
                <p className="num mt-3 text-xs text-foreground" dir="ltr">
                  {file}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Input
                dir="ltr"
                placeholder="أو الصق رابط الملف"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11"
              />
              <Button className="h-11 px-6" onClick={start}>
                ابدأ التحقق
              </Button>
            </div>
          </div>
        )}

        {error ? (
          <p className="mt-3 text-xs text-destructive">
            أضف ملفاً أو رابطاً قبل بدء التحقق.
          </p>
        ) : null}
      </Panel>

      <Panel>
        <SectionTitle title="آخر عمليات التحقق" hint="نتائج محفوظة خلال آخر 7 أيام" />
        <ul className="divide-y divide-border">
          {recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{r.title}</p>
                <p className="num mt-0.5 text-xs text-muted-foreground" dir="ltr">
                  {r.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{r.date}</span>
                <span className="rounded-md border border-border bg-surface-2 px-2 py-0.5 text-xs text-foreground">
                  {r.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <EmptyState
          title="لا توجد عمليات تحقق مؤرشفة"
          description="ستظهر هنا نتائج التحقق التي تنقلها إلى الأرشيف للرجوع إليها لاحقًا."
          icon={ShieldCheck}
        />
        <ErrorBlock
          title="تعذر الوصول إلى قاعدة البحث العكسي"
          description="خدمة البحث العكسي غير متاحة مؤقتًا؛ يمكن متابعة التحقق بالاعتماد على تحليل المصدر والسياق."
        />
      </div>
    </AppShell>
  );
}
