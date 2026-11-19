import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CircleCheck, KeyRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RaseenLogo } from "@/components/raseen/logo";
import { AuthAside } from "@/components/raseen/auth-aside";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "إعادة تعيين كلمة المرور | رسين" },
      {
        name: "description",
        content: "عيّن كلمة مرور جديدة لحسابك في منصة رسين للاستخبارات الإعلامية.",
      },
      { property: "og:title", content: "إعادة تعيين كلمة المرور | رسين" },
      { property: "og:description", content: "اختر كلمة مرور قوية لحسابك في رسين." },
    ],
  }),
  component: ResetPasswordPage,
});

const rules = [
  "٨ أحرف على الأقل",
  "حرف كبير وحرف صغير",
  "رقم واحد على الأقل",
  "رمز خاص واحد على الأقل",
];

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm.length > 0 && confirm !== value;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <RaseenLogo showTagline />
          <h1 className="mt-9 text-2xl font-bold text-foreground">إعادة تعيين كلمة المرور</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            اختر كلمة مرور جديدة قوية لحماية حسابك في رسين.
          </p>

          {state === "done" ? (
            <div className="mt-7 rounded-2xl border border-success/25 bg-success/10 p-5">
              <CircleCheck className="size-5 text-success" />
              <p className="mt-3 text-sm font-semibold text-foreground">
                تم تحديث كلمة المرور بنجاح
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
              </p>
              <Button className="mt-4" onClick={() => navigate({ to: "/login" })}>
                الانتقال إلى تسجيل الدخول
              </Button>
            </div>
          ) : (
            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (mismatch || !value) return;
                setState("loading");
                window.setTimeout(() => setState("done"), 1000);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                <Input
                  id="new-password"
                  type="password"
                  dir="ltr"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-11 text-start"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">تأكيد كلمة المرور</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  dir="ltr"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-invalid={mismatch}
                  className="h-11 text-start"
                />
                {mismatch ? (
                  <p className="text-xs text-destructive">كلمتا المرور غير متطابقتين.</p>
                ) : null}
              </div>

              <ul className="panel-muted grid gap-2 p-3 text-xs text-muted-foreground">
                {rules.map((r) => (
                  <li key={r} className="flex items-center gap-2">
                    <CircleCheck className="size-3.5 shrink-0 text-success" />
                    {r}
                  </li>
                ))}
              </ul>

              <Button type="submit" className="h-11 w-full gap-2" disabled={state === "loading"}>
                {state === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    تحديث كلمة المرور
                  </>
                )}
              </Button>
            </form>
          )}

          <Button asChild variant="ghost" className="mt-6 gap-2 px-0">
            <Link to="/login">
              <ArrowRight className="size-4" />
              العودة إلى تسجيل الدخول
            </Link>
          </Button>
        </div>
      </div>
      <AuthAside />
    </div>
  );
}
