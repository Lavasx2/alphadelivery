import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/menu";
import type { Database } from "@/integrations/supabase/types";

type OrderLine = { name?: string; qty?: number; price?: number };
type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  notes: string | null;
  items: unknown;
  total: number;
  status: string;
  created_at: string;
  courier_id: string | null;
  delivered_at: string | null;
};

const HIDE_DELIVERED_AFTER_MS = 4 * 60 * 1000;

export function OrdersBoard({ mode }: { mode: "owner" | "courier" }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);


  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) setErr(error.message);
    setOrders((data ?? []) as Order[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("orders-board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => void load()
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  async function update(id: string, patch: OrderUpdate) {
    const { error } = await supabase.from("orders").update(patch).eq("id", id);
    if (error) setErr(error.message);
    await load();
  }

  const visible =
    mode === "courier"
      ? orders.filter(
          (o) =>
            o.status === "new" ||
            (o.courier_id && user && o.courier_id === user.id)
        )
      : orders;

  if (loading) return <p className="mt-6 text-muted-foreground">{t("loading")}</p>;

  return (
    <div className="mt-6 space-y-4">
      {err && <p className="text-sm text-red-500">{err}</p>}
      {visible.length === 0 && (
        <p className="text-muted-foreground">{t("noOrders")}</p>
      )}
      {visible.map((o) => {
        const lines = Array.isArray(o.items) ? (o.items as OrderLine[]) : [];
        return (
          <div key={o.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold">
                  {t("customer")}: {o.customer_name} — {o.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("address")}: {o.address}
                </p>
                {o.notes && (
                  <p className="text-sm text-muted-foreground">
                    {t("notes")}: {o.notes}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                {t(o.status)}
              </span>
            </div>

            <ul className="mt-3 space-y-1 text-sm">
              {lines.map((l, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {l.name} × {l.qty ?? 1}
                  </span>
                  <span>{formatPrice(Number(l.price ?? 0) * Number(l.qty ?? 1))}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-lg font-black text-primary">
                {t("total")}: {formatPrice(Number(o.total))}
              </span>
              <div className="flex gap-2">
                {o.status === "new" && (
                  <button
                    onClick={() =>
                      void update(o.id, {
                        status: "delivering",
                        courier_id: user?.id ?? null,
                        accepted_at: new Date().toISOString(),
                      })
                    }
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                  >
                    {t("accept")}
                  </button>
                )}
                {o.status === "delivering" && (
                  <button
                    onClick={() => void update(o.id, { status: "delivered" })}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
                  >
                    {t("markDelivered")}
                  </button>
                )}
                {mode === "owner" && o.status !== "cancelled" && (
                  <button
                    onClick={() => void update(o.id, { status: "cancelled" })}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground"
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
