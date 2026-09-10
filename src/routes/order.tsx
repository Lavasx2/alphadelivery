import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "اطلب للمنزل | كراست تبسة" },
      {
        name: "description",
        content:
          "اطلب من كراست تبسة ونوصل لك للمنزل — أكمل سلة الطلبات وأدخل اسمك ورقم هاتفك وعنوانك.",
      },
      { property: "og:title", content: "اطلب للمنزل | كراست تبسة" },
      {
        property: "og:description",
        content: "أكمل طلبك من كراست تبسة ونوصله ساخناً إلى باب دارك.",
      },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { lines, total, setQty, remove, clear } = useCart();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError(t("fillRequired"));
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase.from("orders").insert({
      customer_name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim() || null,
      items: lines.map((l) => ({
        id: l.item.id,
        name: l.item.name,
        price: l.item.price,
        qty: l.qty,
      })),
      total,
    });
    setLoading(false);
    if (dbError) {
      setError(t("orderError"));
      return;
    }
    clear();
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <CheckCircle2 className="size-16 text-green-500" />
        <h1 className="mt-6 text-3xl font-black">{t("orderDone")}</h1>
        <p className="mt-3 text-muted-foreground">
          {t("thanks")} {name} — {t("orderDoneDesc")}{" "}
          <bdi dir="ltr">{phone}</bdi>
        </p>
        <Link
          to="/menu"
          className="mt-8 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90"
        >
          {t("backToMenu")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="flex items-center gap-3 text-4xl font-black">
        <Bike className="size-9 text-primary" />
        {t("orderTitle")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("orderIntro")}</p>

      {lines.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground">{t("emptyCart")}</p>
          <Link
            to="/menu"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-primary/90"
          >
            {t("browseMenu")}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          {/* Cart */}
          <div>
            <h2 className="text-xl font-bold">{t("cart")}</h2>
            <div className="mt-4 space-y-3">
              {lines.map((l) => (
                <div
                  key={l.item.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  {l.item.image && (
                    <img
                      src={l.item.image}
                      alt={l.item.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="size-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{l.item.name}</h3>
                    <p className="text-sm text-primary font-bold">
                      {formatPrice(l.item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQty(l.item.id, l.qty - 1)}
                      className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
                      aria-label={t("decrease")}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{l.qty}</span>
                    <button
                      onClick={() => setQty(l.item.id, l.qty + 1)}
                      className="flex size-8 items-center justify-center rounded-md border border-border hover:bg-secondary"
                      aria-label={t("increase")}
                    >
                      <Plus className="size-4" />
                    </button>
                    <button
                      onClick={() => remove(l.item.id)}
                      className="mx-1 text-muted-foreground hover:text-destructive"
                      aria-label={t("removeItem")}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/10 p-4 text-lg font-black">
              <span>{t("total")}</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout form */}
          <div>
            <h2 className="text-xl font-bold">{t("deliveryInfo")}</h2>
            <form onSubmit={submitOrder} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("nameRequired")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("phoneRequired")}
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  dir="ltr"
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-left outline-none focus:ring-2 focus:ring-ring"
                  placeholder="05 XX XX XX XX"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("addressRequired")}
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("addressPlaceholder")}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  {t("notesOptional")}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-card px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("notesPlaceholder")}
                />
              </div>
              {error && (
                <p className="rounded-lg bg-destructive/15 p-3 text-sm font-medium text-destructive">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3.5 text-lg font-black text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading
                  ? t("sendingOrder")
                  : `${t("confirmOrder")} — ${formatPrice(total)}`}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                {t("payOnDelivery")}
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
