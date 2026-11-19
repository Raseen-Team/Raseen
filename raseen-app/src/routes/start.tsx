import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { AppShell } from "@/components/raseen/shell";

/*
 * بدء الرصد: مدار الموضوع ← رادار الرصد ← القصص ← صفحة القصة ← الموجز.
 * The flow lives in /public/flow/index.html (vanilla JS + GSAP) and runs here in embed mode.
 * Links inside it to other pages ask this page to navigate (postMessage {raseenNav}).
 */
const views = ["setup", "scan", "stories", "story", "brief", "briefs"] as const;

export const Route = createFileRoute("/start")({
  validateSearch: (s: Record<string, unknown>): { view?: string } => {
    const v = s["view"];
    return views.includes(v as (typeof views)[number]) ? { view: v as string } : {};
  },
  head: () => ({
    meta: [
      { title: "بدء الرصد | رسين" },
      { name: "description", content: "اكتب الموضوع، ورسين يرصد الأخبار ويجمعها في قصص ويحدد المصدر الأول بالأدلة." },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const { view } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const to = (e.data as { raseenNav?: string } | null)?.raseenNav;
      if (typeof to === "string" && to.startsWith("/")) navigate({ to });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [navigate]);

  return (
    <AppShell bleed>
      <iframe
        title="بدء الرصد"
        src={`/flow/index.html?embed=1#${view ?? "setup"}`}
        className="block h-[calc(100svh-68px)] w-full border-0"
      />
    </AppShell>
  );
}
