import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { OrdersBoard } from "@/lib/orders-board";
import { formatPrice } from "@/lib/menu";
import { submitCourierPayment } from "@/lib/courier-payment.functions";


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
  payment_status: string;
  fee_amount: number | null;
};

type Settings = { fee: number; card: string; holder: string };


function CourierPage() {
  const { t } = useI18n();
  const { session, user, isCourier, isOwner, loading, refreshRoles } = useAuth();
  const [app, setApp] = useState<App | null>(null);
  const [settings, setSettings] = useState<Settings>({ fee: 0, card: "", holder: "" });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [payRef, setPayRef] = useState("");
  const [payHolder, setPayHolder] = useState("");
  const [payLast4, setPayLast4] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: st } = await supabase.from("app_settings").select("key,value");
    const map = new Map((st ?? []).map((r) => [r.key, r.value ?? ""]));
    setSettings({
      fee: Number(map.get("courier_fee") ?? 0) || 0,
      card: map.get("courier_card_number") ?? "",
      holder: map.get("courier_card_holder") ?? "",
    });
    if (!user) return;
    const { data, error } = await supabase
      .from("courier_applications")
      .select("id,status,full_name,payment_status,fee_amount")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) setErr(error.message);
    setApp(data?.[0] ?? null);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function payNow(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await submitCourierPayment({
        data: { reference: payRef, holder: payHolder, last4: payLast4 },
      });
      await load();
    } catch (e2) {
      const m = e2 instanceof Error ? e2.message : "error";
      setErr(m.includes("INVALID_PAYMENT") ? t("invalidPayment") : m);
    }
    setBusy(false);
  }


  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setErr(null);
    const { error } = await supabase.from("courier_applications").insert({
      user_id: user.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      vehicle: vehicle.trim() || null,
    });
    if (error) setErr(error.message);
    else {
      setSent(true);
      await load();
    }
    setBusy(false);
  }

  async function refresh() {
    setBusy(true);
    await Promise.all([refreshRoles(), load()]);
    setBusy(false);
  }

  if (loading) {
    return <p className="mx-auto max-w-3xl px-4 py-16">{t("loading")}</p>;
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-black">{t("courierArea")}</h1>
        <p className="mt-3 text-muted-foreground">{t("courierSignInFirst")}</p>
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
      <p className="mt-3 text-sm text-muted-foreground">{t("courierIntro")}</p>

      {app ? (
        <div className="mt-6 space-y-4">
          <div className="space-y-2 rounded-xl border border-border bg-card p-5 text-sm">
            {sent && <p className="font-bold text-green-500">{t("courierSent")}</p>}
            <p>
              {app.status === "rejected"
                ? t("courierRejected")
                : app.status === "approved"
                  ? t("courierApproved")
                  : t("courierPending")}
            </p>
          </div>

          {app.status !== "rejected" && app.status !== "approved" && (
            <div className="space-y-3 rounded-2xl border border-primary/40 bg-primary/5 p-5 text-sm">
              <h2 className="text-lg font-black">{t("courierFeeTitle")}</h2>
              <p className="text-muted-foreground">{t("courierFeeDesc")}</p>
              <p className="text-base font-black text-primary">
                {t("courierFee")}: {formatPrice(app.fee_amount ?? settings.fee)}
              </p>

              {app.payment_status === "paid" ? (
                <p className="font-bold text-green-500">{t("paymentVerified")}</p>
              ) : app.payment_status === "submitted" ? (
                <p className="font-bold text-amber-500">{t("paymentSubmitted")}</p>
              ) : settings.card ? (
                <form onSubmit={payNow} className="space-y-3">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs text-muted-foreground">{t("payToCard")}</p>
                    <p className="mt-1 text-lg font-black" dir="ltr">
                      {settings.card}
                    </p>
                    {settings.holder && (
                      <p className="text-xs text-muted-foreground">
                        {t("cardHolder")}: {settings.holder}
                      </p>
                    )}
                  </div>
                  <input
                    className={input}
                    placeholder={t("cardHolder")}
                    value={payHolder}
                    onChange={(e) => setPayHolder(e.target.value)}
                    required
                  />
                  <input
                    className={input}
                    placeholder={t("cardLast4")}
                    inputMode="numeric"
                    maxLength={4}
                    dir="ltr"
                    value={payLast4}
                    onChange={(e) => setPayLast4(e.target.value)}
                    required
                  />
                  <input
                    className={input}
                    placeholder={t("paymentRef")}
                    dir="ltr"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    required
                  />
                  <button
                    disabled={busy}
                    className="w-full rounded-xl bg-primary px-5 py-4 text-base font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
                  >
                    {busy ? t("loading") : t("submitPayment")}
                  </button>
                </form>
              ) : (
                <p className="text-amber-500">{t("feeNotSet")}</p>
              )}
            </div>
          )}
        </div>
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
            type="tel"
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
            className="w-full rounded-xl bg-primary px-5 py-4 text-base font-black text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {busy ? t("loading") : t("send")}
          </button>
        </form>
      )}

      {err && <p className="mt-4 text-sm text-red-500">{err}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={() => void refresh()}
        className="mt-6 text-sm text-muted-foreground underline disabled:opacity-60"
      >
        {busy ? t("loading") : t("refreshStatus")}
      </button>
    </div>
  );
}
