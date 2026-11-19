import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleCheck, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RaseenLogo } from "@/components/raseen/logo";
import { AuthAside } from "@/components/raseen/auth-aside";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور | رسين" },
      {
        name: "description",
        content: "أرسل رابط استعادة كلمة المرور لحسابك في منصة رسين للاستخبارات الإعلامية.",
      },
      { property: "og:title", content: "استعادة كلمة المرور | رسين" },
      { property: "og:description", content: "استعد الوصول إلى حسابك في رسين." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [state, setState] = useState<"idle" | "loading" | "sent">("idle");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <RaseenLogo showTagline />
          <h1 className="mt-9 text-2xl font-bold text-foreground">نسيت كلمة المرور؟</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            أدخل البريد الإلكتروني المسجل وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
          </p>

          {state === "sent" ? (
            <div className="mt-7 rounded-2xl border border-success/25 bg-success/10 p-5">
              <MailCheck className="size-5 text-success" />
              <p className="mt-3 text-sm font-semibold text-foreground">تم إرسال الرابط</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                راجع بريدك الإلكتروني واتبع الرابط لإعادة تعيين كلمة المرور. الرابط صالح لمدة 30
                دقيقة.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/reset-password">فتح صفحة إعادة التعيين</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setState("idle")}>
                  إعادة الإرسال
                </Button>
              </div>
            </div>
          ) : (
            <form
              className="mt-7 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setState("loading");
                window.setTimeout(() => setState("sent"), 1000);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="reset-email">البريد الإلكتروني</Label>
                <Input
                  id="reset-email"
                  type="email"
                  dir="ltr"
                  defaultValue="noura@alofoq.sa"
                  className="h-11 text-start"
                />
              </div>
              <Button type="submit" className="h-11 w-full gap-2" disabled={state === "loading"}>
                {state === "loading" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري إرسال الرابط...
                  </>
                ) : (
                  <>
                    <CircleCheck className="size-4" />
                    إرسال رابط الاستعادة
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
