import { Gauge, Radar, ShieldCheck, TrendingUp } from "lucide-react";

const pillars = [
  { icon: Radar, title: "الرصد الإعلامي", text: "متابعة مستمرة لتسع منصات ومصادر إعلامية." },
  { icon: Gauge, title: "المؤشرات", text: "حصة الصوت والمشاعر والوصول والأثر الإعلامي." },
  { icon: ShieldCheck, title: "التحقق", text: "فحص الصور والفيديو والروابط والمصادر." },
  { icon: TrendingUp, title: "التنبؤ", text: "إشارات مبكرة للأزمات والاتجاهات الصاعدة." },
];

export function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-sidebar p-12 lg:flex lg:flex-col lg:justify-between">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 size-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--gold) 22%, transparent), transparent 65%)",
        }}
      />
      <div className="relative">
        <p className="text-xs font-medium tracking-widest text-sidebar-primary">
          RASEEN MEDIA INTELLIGENCE
        </p>
        <h2 className="mt-4 max-w-md font-display text-3xl leading-snug font-bold text-sidebar-foreground">
          المشهد الإعلامي أمامك في لوحة واحدة: ما حدث، ولماذا حدث، وما قد يحدث.
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-sidebar-foreground/70">
          رسين تجمع الرصد والتحليل والتحقق والمؤشرات والتقارير والتنبؤ في منصة واحدة موجهة لفرق
          الاتصال المؤسسي وغرف الأخبار.
        </p>
      </div>

      <div className="relative grid grid-cols-2 gap-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4"
          >
            <p.icon className="size-5 text-sidebar-primary" />
            <p className="mt-3 text-sm font-semibold text-sidebar-foreground">{p.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/65">{p.text}</p>
          </div>
        ))}
      </div>

      <p className="relative text-xs text-sidebar-foreground/50">
        المنتج النهائي في رسين هو المعلومة والتحليل.
      </p>
    </aside>
  );
}
