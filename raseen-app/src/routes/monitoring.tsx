import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  ExternalLink,
  Filter,
  MoreHorizontal,
  Play,
  Radar as RadarIcon,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/raseen/shell";
import {
  AiInsightCard,
  EmptyState,
  KpiCard,
  LoadingBlock,
  PageHeader,
  Panel,
  SectionTitle,
  SentimentBadge,
} from "@/components/raseen/blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  countries,
  languagesList,
  mentions,
  platforms,
  sentimentLabel,
  topTopics,
  type Mention,
} from "@/lib/mock";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "الرصد الإعلامي | رسين" },
      {
        name: "description",
        content: "راقب المشهد الإعلامي عبر الأخبار والصحف والمواقع والتلفزيون والمنصات الاجتماعية.",
      },
      { property: "og:title", content: "الرصد الإعلامي | رسين" },
      {
        property: "og:description",
        content: "رصد مستمر لتسع منصات إعلامية مع فلاتر متقدمة وتحليل للمشاعر.",
      },
    ],
  }),
  component: MonitoringPage,
});

type ViewState = "results" | "loading" | "empty";

function MonitoringPage() {
  const [view, setView] = useState<ViewState>("results");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState("all");
  const [sentiment, setSentiment] = useState("all");
  const [selected, setSelected] = useState<Mention | null>(null);

  const rows = useMemo(
    () =>
      mentions.filter(
        (m) =>
          (platform === "all" || m.platform === platform) &&
          (sentiment === "all" || m.sentiment === sentiment) &&
          (query.trim() === "" ||
            m.title.includes(query.trim()) ||
            m.source.includes(query.trim())),
      ),
    [platform, sentiment, query],
  );

  const summary = [
    { label: "إجمالي النتائج", value: "1,842", delta: 9.3, unit: "إشارة" },
    { label: "إيجابي", value: "1,068", delta: 4.6, unit: "58%" },
    { label: "سلبي", value: "350", delta: 6.1, unit: "19%" },
    { label: "محايد", value: "424", delta: -1.2, unit: "23%" },
    { label: "مصادر جديدة", value: "27", delta: 14.8, unit: "مصدر" },
  ];

  return (
    <AppShell title="الرصد الإعلامي" breadcrumb={["رسين", "الرصد الإعلامي"]}>
      <PageHeader
        icon={RadarIcon}
        title="الرصد الإعلامي"
        description="راقب المشهد الإعلامي عبر مختلف المصادر والمنصات."
        actions={
          <Tabs value={view} onValueChange={(v) => setView(v as ViewState)}>
            <TabsList>
              <TabsTrigger value="results">النتائج</TabsTrigger>
              <TabsTrigger value="loading">التحميل</TabsTrigger>
              <TabsTrigger value="empty">بلا نتائج</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <Panel>
        <SectionTitle
          title="فلاتر الرصد"
          hint="حدد نطاق الرصد بدقة قبل بدء الجمع"
          action={
            <Badge variant="outline" className="gap-1.5 font-normal">
              <Filter className="size-3.5" />
              7 فلاتر
            </Badge>
          }
        />

        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في العناوين والمصادر..."
              className="h-11 ps-10"
              aria-label="البحث في نتائج الرصد"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">الكلمات المفتاحية</Label>
              <Input
                id="keywords"
                defaultValue="الحوكمة، جودة الخدمة، التوسع"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label>المنصة</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="كل المنصات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المنصات</SelectItem>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الدولة</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الدول</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفترة الزمنية</Label>
              <Select defaultValue="7d">
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">آخر 24 ساعة</SelectItem>
                  <SelectItem value="7d">آخر 7 أيام</SelectItem>
                  <SelectItem value="30d">آخر 30 يومًا</SelectItem>
                  <SelectItem value="90d">آخر 90 يومًا</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اللغة</Label>
              <Select defaultValue="العربية">
                <SelectTrigger className="h-10 w-full">
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

            <div className="space-y-2">
              <Label>نوع المصدر</Label>
              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  <SelectItem value="news">إعلام تقليدي</SelectItem>
                  <SelectItem value="digital">إعلام رقمي</SelectItem>
                  <SelectItem value="social">منصات اجتماعية</SelectItem>
                  <SelectItem value="influencer">حسابات مؤثرة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>المشاعر</Label>
              <Select value={sentiment} onValueChange={setSentiment}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المشاعر</SelectItem>
                  <SelectItem value="positive">إيجابي</SelectItem>
                  <SelectItem value="negative">سلبي</SelectItem>
                  <SelectItem value="neutral">محايد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                className="h-10 flex-1 gap-2"
                onClick={() => {
                  setView("loading");
                  window.setTimeout(() => setView("results"), 1100);
                  toast.success("بدأ الرصد", {
                    description: "جاري جمع الإشارات من المصادر المحددة.",
                  });
                }}
              >
                <Play className="size-4" />
                بدء الرصد
              </Button>
              <Button
                variant="outline"
                className="h-10 gap-2"
                onClick={() => {
                  setQuery("");
                  setPlatform("all");
                  setSentiment("all");
                  toast("تم إعادة تعيين الفلاتر");
                }}
              >
                <RotateCcw className="size-4" />
                إعادة تعيين
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">المصادر المشمولة:</span>
            {platforms.map((p) => (
              <Badge key={p} variant="secondary" className="font-normal">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summary.map((s) => (
          <KpiCard
            key={s.label}
            label={s.label}
            value={s.value}
            delta={s.delta}
            unit={s.unit}
            tone={
              s.label === "إيجابي"
                ? "positive"
                : s.label === "سلبي"
                  ? "negative"
                  : s.label === "محايد"
                    ? "neutral"
                    : "default"
            }
          />
        ))}
      </div>

      <Panel>
        <SectionTitle title="أهم الموضوعات المرصودة" hint="حسب حجم الإشارات في نطاق الرصد الحالي" />
        <div className="flex flex-wrap gap-2">
          {topTopics.map((t) => (
            <Badge key={t.name} variant="outline" className="gap-2 px-3 py-1.5 font-normal">
              {t.name}
              <span className="num text-xs text-muted-foreground">{t.volume}</span>
            </Badge>
          ))}
        </div>
      </Panel>

      {view === "loading" ? (
        <Panel>
          <LoadingBlock rows={8} />
        </Panel>
      ) : null}

      {view === "empty" || (view === "results" && rows.length === 0) ? (
        <EmptyState
          title="لا توجد نتائج مطابقة"
          description="لم نجد إشارات إعلامية تطابق الفلاتر الحالية. جرّب توسيع الفترة الزمنية أو إزالة فلتر المشاعر."
          actionLabel="إعادة تعيين الفلاتر"
          onAction={() => {
            setQuery("");
            setPlatform("all");
            setSentiment("all");
            setView("results");
          }}
          icon={Search}
        />
      ) : null}

      {view === "results" && rows.length > 0 ? (
        <Panel padded={false}>
          <div className="p-5 pb-0">
            <SectionTitle
              title="نتائج الرصد"
              hint={`${rows.length} إشارة معروضة من إجمالي 1,842`}
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start">المصدر</TableHead>
                  <TableHead className="text-start">العنوان</TableHead>
                  <TableHead className="text-start">المنصة</TableHead>
                  <TableHead className="text-start">الدولة</TableHead>
                  <TableHead className="text-start">التاريخ</TableHead>
                  <TableHead className="text-start">المشاعر</TableHead>
                  <TableHead className="text-start">الوصول</TableHead>
                  <TableHead className="text-start">التفاعل</TableHead>
                  <TableHead className="text-start">الرابط</TableHead>
                  <TableHead className="text-start">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm text-muted-foreground">{m.source}</TableCell>
                    <TableCell className="max-w-[360px]">
                      <button
                        onClick={() => setSelected(m)}
                        className="line-clamp-2 text-start text-sm font-medium text-foreground hover:text-primary-light"
                      >
                        {m.title}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.platform}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.country}</TableCell>
                    <TableCell className="num text-xs text-muted-foreground">{m.date}</TableCell>
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
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label="إجراءات الإشارة">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelected(m)}>
                            <Search className="size-4" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="size-4" />
                            فتح المصدر
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              toast.success("بدأ التحليل بالذكاء الاصطناعي", {
                                description: "سيظهر الملخص في تفاصيل الإشارة عند اكتماله.",
                              })
                            }
                          >
                            <Sparkles className="size-4" />
                            تحليل بالذكاء الاصطناعي
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast("تم حفظ الإشارة")}>
                            <Bookmark className="size-4" />
                            حفظ
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast("تم نسخ رابط المشاركة")}>
                            <Share2 className="size-4" />
                            مشاركة
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="border-t border-border p-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </Panel>
      ) : null}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-xl">
          {selected ? (
            <>
              <SheetHeader className="text-start">
                <SheetTitle className="text-lg leading-snug">{selected.title}</SheetTitle>
                <SheetDescription>
                  {selected.source} — {selected.platform} — {selected.country}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <SentimentBadge value={selected.sentiment} />
                  <Badge variant="outline" className="num font-normal">
                    {selected.date}
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{selected.excerpt}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="panel-muted p-3">
                    <p className="text-[11px] text-muted-foreground">الوصول</p>
                    <p className="num mt-1 text-lg font-bold text-foreground">
                      {(selected.reach / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="panel-muted p-3">
                    <p className="text-[11px] text-muted-foreground">التفاعل</p>
                    <p className="num mt-1 text-lg font-bold text-foreground">
                      {(selected.engagement / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div className="panel-muted p-3">
                    <p className="text-[11px] text-muted-foreground">النبرة</p>
                    <p className="mt-1 text-lg font-bold text-foreground">
                      {sentimentLabel[selected.sentiment]}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">
                    الكلمات المفتاحية
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.keywords.map((k) => (
                      <Badge key={k} variant="secondary" className="font-normal">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">الموضوعات</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.topics.map((t) => (
                      <Badge key={t} variant="outline" className="font-normal">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <AiInsightCard summary={selected.aiSummary} confidence={82} />

                <div className="flex flex-wrap gap-2">
                  <Button className="gap-2">
                    <ExternalLink className="size-4" />
                    المصدر الأصلي
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="size-4" />
                    حفظ
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="size-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
