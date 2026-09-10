import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | كراست تبسة" },
      {
        name: "description",
        content:
          "سجّل الدخول أو أنشئ حساباً في كراست تبسة لمتابعة طلباتك أو للعمل كموصل طلبات.",
      },
      { property: "og:title", content: "تسجيل الدخول | كراست تبسة" },
      {
        property: "og:description",
        content: "حساب زبون أو موصل طلبات في مطعم كراست تبسة.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const { session, isOwner, isCourier, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      if (isOwner) navigate({ to: "/dashboard" });
      else if (isCourier) navigate({ to: "/courier" });
      else navigate({ to: "/" });
    }
  }, [loading, session, isOwner, isCourier, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName, phone },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setMsg("تم إنشاء الحساب — تحقق من بريدك لتفعيله ثم سجّل الدخول.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "حدث خطأ");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black">{t("authTitle")}</h1>

      <div className="mt-6 flex gap-2">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              mode === m
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {t(m === "login" ? "login" : "signup")}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "signup" && (
          <>
            <input
              className={input}
              placeholder={t("fullName")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              className={input}
              placeholder={t("phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </>
        )}
        <input
          className={input}
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={input}
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button
          disabled={busy}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? t("loading") : t(mode === "login" ? "login" : "signup")}
        </button>
      </form>

      {err && <p className="mt-4 text-sm text-red-500">{err}</p>}
      {msg && <p className="mt-4 text-sm text-green-500">{msg}</p>}

      <p className="mt-8 text-sm text-muted-foreground">
        {t("becomeCourier")} —{" "}
        <a href="/courier" className="font-bold text-primary">
          {t("courierArea")}
        </a>
      </p>
    </div>
  );
}
