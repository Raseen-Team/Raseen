import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  CircleHelp,
  FileText,
  Gauge,
  LayoutDashboard,
  Link2,

  LogOut,
  Menu,
  Moon,
  PanelRightClose,
  PanelRightOpen,
  Radar,
  Search,
  Settings,
  ShieldCheck,
  ShieldHalf,
  Sun,
  TrendingUp,
  ChartNoAxesCombined,
  Languages,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RaseenLogo, RaseenMark } from "@/components/raseen/logo";
import { SeverityBadge } from "@/components/raseen/blocks";
import { notifications, org } from "@/lib/mock";
import { GlobalSearchDialog } from "@/components/raseen/global-search";

export const navItems = [
  { to: "/", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/start", label: "ابدأ رصدًا", icon: Search },
  { to: "/monitoring", label: "الرصد الإعلامي", icon: Radar },
  { to: "/analysis", label: "التحليل الإعلامي", icon: ChartNoAxesCombined },
  { to: "/verification", label: "التحقق", icon: ShieldCheck },
  { to: "/metrics", label: "المؤشرات", icon: Gauge },
  { to: "/reports", label: "التقارير", icon: FileText },
  { to: "/prediction", label: "التنبؤ", icon: TrendingUp },
  { to: "/roles", label: "الأدوار والصلاحيات", icon: ShieldHalf },
  { to: "/social-accounts", label: "حسابات التواصل الاجتماعي", icon: Link2 },
  { to: "/settings", label: "الإعدادات", icon: Settings },

] as const;

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("raseen-theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("raseen-theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav aria-label="القائمة الرئيسية" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <item.icon className="size-[18px] shrink-0" />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
            {active && !collapsed ? (
              <span className="ms-auto size-1.5 rounded-full bg-sidebar-primary" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="border-t border-sidebar-border p-3">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-2.5",
          collapsed && "justify-center bg-transparent p-0",
        )}
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
          {org.initials}
        </span>
        {!collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{org.user}</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">{org.name}</p>
          </div>
        ) : null}
      </div>
      {!collapsed ? (
        <div className="mt-2 flex gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex-1 justify-start gap-2 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Link to="/settings">
              <Settings className="size-4" />
              الإعدادات
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Link to="/login" aria-label="تسجيل الخروج">
              <LogOut className="size-4" />
            </Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function NotificationsPopover() {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="الإشعارات" className="relative min-h-11 min-w-11">
          <Bell className="size-[18px]" />
          {unread > 0 ? (
            <span className="num absolute end-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(92vw,380px)] p-0" dir="rtl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">الإشعارات</p>
          <span className="num text-xs text-muted-foreground">{unread} غير مقروء</span>
        </div>
        <ul className="max-h-[320px] divide-y divide-border overflow-y-auto">
          {notifications.slice(0, 4).map((n) => (
            <li key={n.id} className={cn("px-4 py-3", !n.read && "bg-surface-2")}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed text-foreground">{n.title}</p>
                <SeverityBadge severity={n.severity} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{n.description}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/">عرض كل الإشعارات</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}


/* Main links shown in the top bar; the rest sit under «المزيد». */
const primaryNav = ["/", "/monitoring", "/analysis", "/verification", "/reports"] as const;
const hiddenInMore = ["/start"];

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

const shortLabel: Record<string, string> = {
  "/monitoring": "الرصد",
  "/analysis": "التحليل",
  "/social-accounts": "حسابات التواصل",
};

/* Moving navy/teal band behind the page header, same GLSL as the website hero. */
function Band() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const gl = c?.getContext("webgl");
    if (!c || !gl) return;
    const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}";
    const fs = [
      "precision mediump float;uniform vec2 R;uniform float T;",
      "float h(vec2 p){return fract(sin(dot(p,vec2(41.3,289.1)))*43758.5);}",
      "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
      "void main(){vec2 uv=gl_FragCoord.xy/R; vec2 q=gl_FragCoord.xy;",
      " vec3 base=vec3(.043,.141,.196);",
      " float glow=n(uv*vec2(2.2,1.)+vec2(T*.03,-T*.02))*n(uv*vec2(3.7,1.6)-vec2(T*.02,T*.025));",
      " float spot=exp(-pow(distance(uv*vec2(1.,.5),vec2(.3+.15*sin(T*.15),.4)),2.)*6.);",
      " vec2 cell=floor(q/4.); float r=h(cell); float star=step(.997,r)*(.4+.6*sin(T*1.5+r*90.));",
      " vec3 col=base+vec3(.03,.16,.17)*glow*1.3+vec3(.04,.14,.15)*spot+vec3(.45,.85,.9)*max(star,0.)*.5;",
      " gl_FragColor=vec4(col,1.);}",
    ].join("\n");
    const sh = (t: number, src: string) => {
      const o = gl.createShader(t)!;
      gl.shaderSource(o, src);
      gl.compileShader(o);
      return o;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(lp);
    gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "R");
    const uT = gl.getUniformLocation(pr, "T");
    const resize = () => {
      const d = Math.min(window.devicePixelRatio, 1.5);
      const r = c.getBoundingClientRect();
      c.width = r.width * d;
      c.height = r.height * d;
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const frame = (t: number) => {
      gl.uniform2f(uR, c.width, c.height);
      gl.uniform1f(uT, t / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!still) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <div className="rs-band" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}

function TopNav({ onOpenMobileNav, onOpenSearch }: { onOpenMobileNav: () => void; onOpenSearch: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const main = navItems.filter((i) => (primaryNav as readonly string[]).includes(i.to));
  const more = navItems.filter(
    (i) => !(primaryNav as readonly string[]).includes(i.to) && !hiddenInMore.includes(i.to),
  );
  const moreActive = more.some((i) => isActive(pathname, i.to));

  return (
    <header
      className={cn(
        "sticky top-0 z-30 text-white transition-colors duration-300",
        solid || pathname === "/start" ? "bg-[#0B2432] shadow-[0_1px_0_rgba(255,255,255,.08)]" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center gap-6 px-4 lg:px-8">
        <Link to="/" aria-label="رسين، الرئيسية" className="shrink-0">
          <RaseenLogo invert className="px-0" />
        </Link>

        <nav aria-label="القائمة الرئيسية" className="rs-nav hidden items-center gap-1 lg:flex">
          {main.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex h-[68px] items-center px-3 text-[14.5px] text-white/70 transition-colors hover:text-white",
                isActive(pathname, item.to) && "on font-medium",
              )}
            >
              {shortLabel[item.to] ?? item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "relative flex h-[68px] items-center gap-1 px-3 text-[14.5px] text-white/70 outline-none transition-colors hover:text-white",
                  moreActive && "on font-medium text-white",
                )}
              >
                المزيد
                <ChevronDown className="size-4" />
                {moreActive ? <span className="absolute inset-x-3 bottom-[-1px] h-0.5 rounded bg-gold" /> : null}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {more.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className={cn(isActive(pathname, item.to) && "font-semibold")}>
                    <item.icon className="size-4 text-muted-foreground" />
                    {shortLabel[item.to] ?? item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          <Link
            to="/start"
            className="me-1 hidden h-10 items-center rounded-xl bg-gold px-4 text-[13.5px] font-semibold text-gold-foreground transition-colors hover:bg-gold/90 md:flex"
          >
            ابدأ رصدًا
          </Link>
          <button
            onClick={onOpenSearch}
            className="hidden h-10 w-60 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-[13px] text-white/60 transition-colors hover:bg-white/10 xl:flex"
          >
            <Search className="size-4" />
            ابحث في الأخبار والتقارير
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-white hover:bg-white/10 hover:text-white xl:hidden"
            onClick={onOpenSearch}
            aria-label="البحث"
          >
            <Search className="size-[18px]" />
          </Button>
          <div className="text-white [&_button]:text-white [&_button:hover]:bg-white/10 [&_button:hover]:text-white">
            <NotificationsPopover />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ms-1 grid size-9 place-items-center rounded-full bg-primary-light text-[12px] font-bold text-white" aria-label="قائمة المستخدم">
                {org.initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <span className="block text-sm">{org.user}</span>
                <span className="block text-xs font-normal text-muted-foreground">{org.role}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="size-4" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/login">
                  <LogOut className="size-4" />
                  تسجيل الخروج
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-white hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onOpenMobileNav}
            aria-label="فتح القائمة"
          >
            <Menu className="size-[20px]" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AppShell({
  children,
  bleed = false,
}: {
  title?: string;
  breadcrumb?: string[];
  children: ReactNode;
  /** full-width content with no padding or footer (used by بدء الرصد) */
  bleed?: boolean;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-background">
      <Band />

      <Sheet open={mobileNav} onOpenChange={setMobileNav}>
        <SheetContent side="right" className="w-[280px] border-sidebar-border bg-sidebar p-0">
          <SheetTitle className="sr-only">قائمة رسين</SheetTitle>
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <RaseenLogo invert />
          </div>
          <div className="flex h-[calc(100%-64px)] flex-col">
            <SidebarNav onNavigate={() => setMobileNav(false)} />
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      <div className="relative z-10 flex min-h-screen flex-col">
        <TopNav onOpenMobileNav={() => setMobileNav(true)} onOpenSearch={() => setSearchOpen(true)} />
        {bleed ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="mx-auto w-full max-w-[1440px] flex-1 space-y-6 px-4 pb-10 pt-6 lg:px-8">
            {children}
          </main>
        )}
        <footer hidden={bleed} className="border-t border-border px-4 py-4 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <span>رسين، منصة ذكاء إعلامي للرصد والتحليل ودعم القرار</span>
            <span>البيانات المعروضة تجريبية</span>
          </div>
        </footer>
      </div>

      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
