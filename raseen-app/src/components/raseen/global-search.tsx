import { Link } from "@tanstack/react-router";
import {
  ChartNoAxesCombined,
  FileText,
  Gauge,
  Newspaper,
  Radio,
  Search,
  Tags,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { mentions, reports, searchSuggestions, topSources, topTopics } from "@/lib/mock";

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="ابحث في الأخبار والمصادر والمواضيع والتقارير والمؤشرات..." />
      <CommandList>
        <CommandEmpty>لا توجد نتائج مطابقة. جرّب كلمة مفتاحية أخرى.</CommandEmpty>

        <CommandGroup heading="اقتراحات البحث">
          {searchSuggestions.map((s) => (
            <CommandItem key={s.label} value={s.label}>
              <Search className="size-4" />
              <span className="flex-1 truncate">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.type}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="الأخبار والإشارات">
          {mentions.slice(0, 4).map((m) => (
            <CommandItem key={m.id} value={m.title} asChild>
              <Link to="/monitoring" onClick={() => onOpenChange(false)}>
                <Newspaper className="size-4" />
                <span className="flex-1 truncate">{m.title}</span>
                <span className="text-xs text-muted-foreground">{m.source}</span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="المواضيع">
          {topTopics.slice(0, 4).map((t) => (
            <CommandItem key={t.name} value={t.name} asChild>
              <Link to="/analysis/trends" onClick={() => onOpenChange(false)}>
                <Tags className="size-4" />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="num text-xs text-muted-foreground">{t.volume}</span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="المصادر">
          {topSources.slice(0, 3).map((s) => (
            <CommandItem key={s.name} value={s.name} asChild>
              <Link to="/monitoring" onClick={() => onOpenChange(false)}>
                <Radio className="size-4" />
                <span className="flex-1 truncate">{s.name}</span>
                <span className="num text-xs text-muted-foreground">{s.volume}</span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="التقارير">
          {reports.slice(0, 3).map((r) => (
            <CommandItem key={r.id} value={r.title} asChild>
              <Link
                to="/reports/$reportId"
                params={{ reportId: r.id }}
                onClick={() => onOpenChange(false)}
              >
                <FileText className="size-4" />
                <span className="flex-1 truncate">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.type}</span>
              </Link>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="المؤشرات والتحليلات">
          <CommandItem value="حصة الصوت" asChild>
            <Link
              to="/metrics/$metricId"
              params={{ metricId: "share-of-voice" }}
              onClick={() => onOpenChange(false)}
            >
              <Gauge className="size-4" />
              <span className="flex-1 truncate">حصة الصوت</span>
              <span className="text-xs text-muted-foreground">مؤشر</span>
            </Link>
          </CommandItem>
          <CommandItem value="تحليل السمعة" asChild>
            <Link to="/analysis/reputation" onClick={() => onOpenChange(false)}>
              <ChartNoAxesCombined className="size-4" />
              <span className="flex-1 truncate">تحليل السمعة</span>
              <span className="text-xs text-muted-foreground">تحليل</span>
            </Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
