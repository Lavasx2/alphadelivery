import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { OrdersBoard } from "@/lib/orders-board";

export const Route = createFileRoute("/courier")({
  head: () => ({
    meta: [
      { title: "منطقة الموصلين | كراست تبسة" },
      {
        name: "description",
        content:
          "سجّل كموصل طلبات لدى كراست تبسة، وتابع الطلبات الجديدة واقبلها من هاتفك.",
      },
      { property: "og:title", content: "منطقة الموصلين | كراست تبسة" },
      {
        property: "og:description",
        content: "قبول طلبات التوصيل ومتابعتها لموصلي كراست تبسة.",
      },
    ],
  }),
  component: CourierPage,
});

type App = {
  id: string;
  status: string;
  full_name: string;
};

function CourierPage() {
  const { t } = useI18n();
  const { session, user, isCourier, isOwner, loading, refreshRoles } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("courier_applications")
      .select("id,status,full_name")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    setApp(data?.[0] ?? null);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("courier_applications").insert({
      user_id: user.id,
      full_name: fullName,
      phone,
      vehicle: vehicle || null,
    });
    if (error) setErr(error.message);
    else await load();
    setBusy(false);
  }

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-16">{t("loading")}</p>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-black">{t("courierArea")}</h1>
        <p className="mt-3 text-muted-foreground">{t("becomeCourier")}</p>
        <Link
          to="/auth"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
        >
          {t("signIn")}
        </Link>
      </div>
    );
  }

  if (isCourier || isOwner) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-black">{t("courierArea")}</h1>
        <p className="mt-2 text-sm text-green-500">{t("courierApproved")}</p>
        <OrdersBoard mode="courier" />
      </div>
    );
  }

  const input =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-black">{t("becomeCourier")}</h1>

      {app ? (
        <p className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
          {app.status === "rejected" ? t("courierRejected") : t("courierPending")}
        </p>
      ) : (
        <form onSubmit={apply} className="mt-6 space-y-3">
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
          <input
            className={input}
            placeholder={t("vehicle")}
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
          <button
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? t("loading") : t("send")}
          </button>
        </form>
      )}

      {err && <p className="mt-4 text-sm text-red-500">{err}</p>}
      <button
        onClick={() => void refreshRoles()}
        className="mt-6 text-sm text-muted-foreground underline"
      >
        {t("loading")}
      </button>
    </div>
  );
}
