import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CircleAlert, CircleCheck, Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RaseenLogo } from "@/components/raseen/logo";
import { AuthAside } from "@/components/raseen/auth-aside";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | رسين" },
      {
        name: "description",
        content: "سجّل الدخول إلى منصة رسين للاستخبارات الإعلامية ومتابعة المشهد الإعلامي.",
      },
      { property: "og:title", content: "تسجيل الدخول | رسين" },
      { property: "og:description", content: "نحلل المشهد الإعلامي ولا نصنع المحتوى." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("noura@alofoq.sa");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error" | "success">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setState("error");
      return;
    }
    setState("loading");
    window.setTimeout(() => {
      setState("success");
      window.setTimeout(() => navigate({ to: "/" }), 700);
    }, 1100);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <RaseenLogo showTagline />

          <h1 className="mt-9 text-3xl font-bold text-foreground">مرحبًا بك في رسين</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            نحلل المشهد الإعلامي ولا نصنع المحتوى
          </p>

          {state === "error" ? (
            <div
              role="alert"
              className="mt-6 flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <span>بيانات الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور.</span>
            </div>
          ) : null}

          {state === "success" ? (
            <div
              role="status"
              className="mt-6 flex items-start gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2.5 text-sm text-success"
            >
              <CircleCheck className="mt-0.5 size-4 shrink-0" />
              <span>تم تسجيل الدخول بنجاح. جاري تحويلك إلى لوحة المؤشرات.</span>
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 text-start"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pe-11 text-start"
                  aria-invalid={state === "error"}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="absolute inset-y-0 end-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox id="remember" defaultChecked />
                <span>تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-light hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full gap-2" disabled={state === "loading"}>
              {state === "loading" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري التحقق من البيانات...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  تسجيل الدخول
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0" />
            الدخول محمي بالتحقق بخطوتين وسجل جلسات كامل على مستوى المؤسسة.
          </p>
        </div>
      </div>

      <AuthAside />
    </div>
  );
}
