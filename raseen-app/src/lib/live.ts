/*
 * رسين · live data from Supabase (filled by the hourly worker in raseen-backend/).
 * Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to read real data.
 * Without them, the pages show a small demo built from the same shapes, so the design still works.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type StoryStatus = "verified" | "review" | "unsupported";
export type Role = "first" | "republish" | "update";

export type Topic = { id: string; name: string; kind: string; keywords: string[] };
export type Source = { id: string; name: string; kind: string; is_official: boolean; site_url: string | null; last_fetch: string | null; last_status: string | null };
export type Article = { id: string; url: string; title: string; summary: string | null; published_at: string | null; source_id: string | null; source?: Source | null };
export type Reason = { key: string; label: string; value: string | number };
export type Story = {
  id: string; topic_id: string; title: string; status: StoryStatus;
  first_article_id: string | null; first_confidence: number | null; first_reasons: Reason[];
  article_count: number; source_count: number; update_count: number; republish_count: number;
  first_seen: string | null; last_seen: string | null; reviewed_by: string | null; reviewed_at: string | null;
};
export type StoryArticle = { role: Role; similarity: number | null; article: Article };
export type Claim = { text: string; evidence: number[]; story?: number | null };
export type Evidence = { n: number; article_id: string | null; source: string; official?: boolean; title: string; url: string; published_at: string | null; role?: Role };
export type Brief = { id: string; topic_id: string; title: string; claims: Claim[]; evidence: Evidence[]; model: string | null; status: string; created_at: string; period_from: string; period_to: string };
export type CoveragePoint = { hour: string; articles: number; sources: number };

const URL = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const KEY = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

export const sb: SupabaseClient | null = URL && KEY ? createClient(URL, KEY) : null;
export const isLive = !!sb;

export const statusLabel: Record<StoryStatus, string> = {
  verified: "موثّق",
  review: "قيد المراجعة",
  unsupported: "ادعاء غير مدعوم",
};
export const roleLabel: Record<Role, string> = { first: "المصدر الأول", republish: "إعادة نشر", update: "تحديث جديد" };

/** Riyadh time, e.g. 07:42 */
export function hhmm(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Riyadh" });
}
export function dayLabel(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ar-SA-u-nu-latn", { day: "numeric", month: "long", timeZone: "Asia/Riyadh" });
}

async function must<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data as T;
}

/* ---------------- queries ---------------- */

export function useTopics() {
  return useQuery({
    queryKey: ["topics"],
    queryFn: async (): Promise<Topic[]> =>
      sb ? must(sb.from("topics").select("id,name,kind,keywords").eq("active", true).order("created_at")) : demo.topics,
  });
}

export function useStories(topicId: string | undefined) {
  return useQuery({
    queryKey: ["stories", topicId],
    enabled: !!topicId,
    refetchInterval: 60_000,
    queryFn: async (): Promise<Story[]> =>
      sb
        ? must(sb.from("stories").select("*").eq("topic_id", topicId!).order("article_count", { ascending: false }).limit(100))
        : demo.stories,
  });
}

export function useStory(id: string) {
  return useQuery({
    queryKey: ["story", id],
    queryFn: async (): Promise<{ story: Story; articles: StoryArticle[] }> => {
      if (!sb) {
        const story = demo.stories.find((s) => s.id === id) ?? demo.stories[0]!;
        return { story, articles: demo.storyArticles[story.id] ?? [] };
      }
      const story = await must<Story>(sb.from("stories").select("*").eq("id", id).single());
      const rows = (await must<unknown>(
        sb.from("story_articles").select("role,similarity,article:articles(id,url,title,summary,published_at,source_id,source:sources(*))").eq("story_id", id),
      )) as StoryArticle[];
      rows.sort((a, b) => (a.article.published_at ?? "").localeCompare(b.article.published_at ?? ""));
      return { story, articles: rows };
    },
  });
}

export function useLatestBrief(topicId: string | undefined) {
  return useQuery({
    queryKey: ["brief", topicId],
    enabled: !!topicId,
    queryFn: async (): Promise<Brief | null> => {
      if (!sb) return demo.brief;
      const rows = await must<Brief[]>(sb.from("briefs").select("*").eq("topic_id", topicId!).order("created_at", { ascending: false }).limit(1));
      return rows[0] ?? null;
    },
  });
}

export function useCoverage(topicId: string | undefined, hours = 48) {
  return useQuery({
    queryKey: ["coverage", topicId, hours],
    enabled: !!topicId,
    queryFn: async (): Promise<CoveragePoint[]> => {
      if (!sb) return demo.coverage;
      const since = new Date(Date.now() - hours * 3600_000).toISOString();
      return must(sb.from("coverage_hourly").select("hour,articles,sources").eq("topic_id", topicId!).gte("hour", since).order("hour"));
    },
  });
}

export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: async (): Promise<Source[]> => (sb ? must(sb.from("sources").select("*").order("name")) : demo.sources),
  });
}

/** The specialist approves or keeps under review. Raseen only suggests. */
export function useReviewStory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, by }: { id: string; status: StoryStatus; by: string }) => {
      if (!sb) {
        const s = demo.stories.find((x) => x.id === id);
        if (s) Object.assign(s, { status, reviewed_by: by, reviewed_at: new Date().toISOString() });
        return;
      }
      const { error } = await sb.rpc("review_story", { p_story: id, p_status: status, p_by: by });
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["story", v.id] });
      qc.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

/* ---------------- demo (same shapes as the database; fictional) ---------------- */

const T = "demo-topic";
const src = (id: string, name: string, official = false, kind = "news"): Source => ({ id, name, kind, is_official: official, site_url: null, last_fetch: null, last_status: "ok" });
const S = {
  blog: src("s1", "مدونة الخليج اليوم", false, "blog"),
  sabq: src("s2", "صحيفة سبق"),
  okaz: src("s3", "صحيفة عكاظ"),
  riyadh: src("s4", "جريدة الرياض"),
  moh: src("s5", "وزارة الصحة", true, "official"),
};
const art = (id: string, s: Source, title: string, at: string, summary = ""): Article => ({ id, url: "#", title, summary, published_at: at, source_id: s.id, source: s });
const A = {
  f1: art("a1", S.blog, "وزارة الصحة تفرض رسومًا بقيمة 50 ريالًا على مراجعي المراكز الصحية", "2026-11-18T04:42:00Z", "مصادر: الرسوم على كل زيارة ابتداءً من الشهر القادم"),
  f2: art("a2", S.sabq, "تقارير: الصحة تفرض رسومًا 50 ريالًا على مراجعي المراكز الصحية", "2026-11-18T05:20:00Z", "نقلًا عن مدونة الخليج اليوم"),
  f3: art("a3", S.okaz, "الصحة تفرض رسومًا بقيمة 50 ريالًا على مراجعي المراكز الصحية", "2026-11-18T05:35:00Z", "بحسب مدونة الخليج اليوم"),
  f4: art("a4", S.riyadh, "وزارة الصحة تفرض رسومًا بقيمة 50 ريالًا على مراجعي المراكز الصحية", "2026-11-18T05:50:00Z"),
  f5: art("a5", S.moh, "وزارة الصحة تنفي فرض رسوم على مراجعي المراكز الصحية", "2026-11-18T06:12:00Z", "الخدمة في المراكز الصحية مجانية"),
  v1: art("a6", S.moh, "وزارة الصحة تطلق حملة التطعيم الموسمية ضد الإنفلونزا", "2026-11-18T06:30:00Z"),
  v2: art("a7", S.sabq, "وزارة الصحة تطلق حملة التطعيم الموسمية ضد الإنفلونزا في جميع المناطق", "2026-11-18T07:10:00Z"),
  v3: art("a8", S.okaz, "الصحة: حملة الإنفلونزا تستهدف 3 ملايين مستفيد عبر 2400 مركز", "2026-11-18T09:30:00Z"),
  h1: art("a9", S.riyadh, "افتتاح مستشفى جديد للأطفال في المدينة المنورة بسعة 300 سرير", "2026-11-18T10:00:00Z"),
};
const story = (id: string, title: string, status: StoryStatus, first: Article, conf: number, reasons: Reason[], n: number, src: number, upd: number, rep: number, a: string, b: string): Story => ({
  id, topic_id: T, title, status, first_article_id: first.id, first_confidence: conf, first_reasons: reasons,
  article_count: n, source_count: src, update_count: upd, republish_count: rep, first_seen: a, last_seen: b, reviewed_by: null, reviewed_at: null,
});

const demo = {
  topics: [{ id: T, name: "وزارة الصحة", kind: "entity", keywords: ["وزارة الصحة", "الصحة", "مستشفى"] }] as Topic[],
  sources: Object.values(S),
  stories: [
    story("st1", A.f1.title, "unsupported", A.f1, 0.95, [
      { key: "earliest", label: "أقدم توقيت", value: "07:42" },
      { key: "similarity", label: "تشابه الصياغة", value: "82%" },
      { key: "cited", label: "نقلوا عنه", value: 2 },
      { key: "gap", label: "سبق أقرب مصدر بـ", value: "38 دقيقة" },
    ], 5, 5, 2, 2, A.f1.published_at!, A.f5.published_at!),
    story("st2", A.v1.title, "verified", A.v1, 0.8, [
      { key: "earliest", label: "أقدم توقيت", value: "09:30" },
      { key: "similarity", label: "تشابه الصياغة", value: "71%" },
      { key: "cited", label: "نقلوا عنه", value: 0 },
      { key: "official", label: "مصدر رسمي", value: "نعم" },
    ], 3, 3, 1, 1, A.v1.published_at!, A.v3.published_at!),
    story("st3", A.h1.title, "review", A.h1, 0.5, [
      { key: "earliest", label: "أقدم توقيت", value: "13:00" },
      { key: "cited", label: "نقلوا عنه", value: 0 },
    ], 1, 1, 0, 0, A.h1.published_at!, A.h1.published_at!),
  ] as Story[],
  storyArticles: {
    st1: [
      { role: "first", similarity: 1, article: A.f1 },
      { role: "republish", similarity: 0.91, article: A.f2 },
      { role: "update", similarity: 0.84, article: A.f3 },
      { role: "republish", similarity: 0.97, article: A.f4 },
      { role: "update", similarity: 0.4, article: A.f5 },
    ],
    st2: [
      { role: "first", similarity: 1, article: A.v1 },
      { role: "republish", similarity: 0.88, article: A.v2 },
      { role: "update", similarity: 0.62, article: A.v3 },
    ],
    st3: [{ role: "first", similarity: 1, article: A.h1 }],
  } as Record<string, StoryArticle[]>,
  brief: {
    id: "b1", topic_id: T, title: "موجز رصد: وزارة الصحة", model: "demo", status: "draft",
    created_at: "2026-11-18T11:00:00Z", period_from: "2026-11-17T11:00:00Z", period_to: "2026-11-18T11:00:00Z",
    claims: [
      { text: "انتشر ادعاء بفرض رسوم 50 ريالًا على مراجعي المراكز الصحية، وأول من نشره «مدونة الخليج اليوم» الساعة 07:42، ونقلته صحيفتا سبق وعكاظ عنها.", evidence: [1, 2, 3], story: 0 },
      { text: "نفت وزارة الصحة الادعاء الساعة 09:12 وأكدت أن الخدمة مجانية.", evidence: [4], story: 0 },
      { text: "أطلقت وزارة الصحة حملة التطعيم الموسمية ضد الإنفلونزا، وأضافت عكاظ أن الحملة تستهدف 3 ملايين مستفيد عبر 2400 مركز.", evidence: [5, 6], story: 1 },
    ],
    evidence: [
      { n: 1, article_id: "a1", source: "مدونة الخليج اليوم", title: A.f1.title, url: "#", published_at: A.f1.published_at, role: "first" },
      { n: 2, article_id: "a2", source: "صحيفة سبق", title: A.f2.title, url: "#", published_at: A.f2.published_at, role: "republish" },
      { n: 3, article_id: "a3", source: "صحيفة عكاظ", title: A.f3.title, url: "#", published_at: A.f3.published_at, role: "update" },
      { n: 4, article_id: "a5", source: "وزارة الصحة", official: true, title: A.f5.title, url: "#", published_at: A.f5.published_at, role: "update" },
      { n: 5, article_id: "a6", source: "وزارة الصحة", official: true, title: A.v1.title, url: "#", published_at: A.v1.published_at, role: "first" },
      { n: 6, article_id: "a8", source: "صحيفة عكاظ", title: A.v3.title, url: "#", published_at: A.v3.published_at, role: "update" },
    ],
  } as Brief,
  coverage: Array.from({ length: 24 }, (_, i) => ({
    hour: new Date(Date.UTC(2026, 10, 17, 12 + i)).toISOString(),
    articles: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 1, 0, 1][i],
    sources: 1,
  })) as CoveragePoint[],
};
