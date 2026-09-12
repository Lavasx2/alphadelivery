import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/menu";
import { addOwnerByEmail, uploadMenuImage } from "@/lib/menu-admin.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة المطعم | كراست تبسة" },
      {
        name: "description",
        content:
          "لوحة تحكم صاحب مطعم كراست تبسة: متابعة الطلبات، تعديل المنيو والأسعار والصور، والموافقة على الموصلين.",
      },
      { property: "og:title", content: "لوحة المطعم | كراست تبسة" },
      {
        property: "og:description",
        content: "إدارة الطلبات والمنيو والموصلين في كراست تبسة.",
      },
    ],
  }),
  component: DashboardPage,
});

type MenuRow = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  popular: boolean;
  available: boolean;
  sort_order: number;
};

type CourierApp = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  vehicle: string | null;
  status: string;
};

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function DashboardPage() {
  const { t } = useI18n();
  const { session, isOwner, loading } = useAuth();
  const [tab, setTab] = useState<"orders" | "menu" | "couriers" | "owners">(
    "orders"
  );

  if (loading) return <p className="mx-auto max-w-3xl px-4 py-16">{t("loading")}</p>;

  if (!session || !isOwner) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-black">{t("dashboard")}</h1>
        <p className="mt-3 text-muted-foreground">
          {session ? t("ownerOnly") : t("signIn")}
        </p>
        {!session && (
          <Link
            to="/auth"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            {t("signIn")}
          </Link>
        )}
      </div>
    );
  }

  const tabs = [
    { id: "orders", label: t("orders") },
    { id: "menu", label: t("manageMenu") },
    { id: "couriers", label: t("couriers") },
    { id: "owners", label: t("owners") },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black">{t("dashboard")}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button
            key={x.id}
            onClick={() => setTab(x.id)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              tab === x.id
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      {tab === "orders" && <OwnerOrders />}
      {tab === "menu" && <MenuManager />}
      {tab === "couriers" && <CouriersManager />}
      {tab === "owners" && <OwnersManager />}
    </div>
  );
}

function OwnerOrders() {
  const [Board, setBoard] = useState<null | React.ComponentType<{
    mode: "owner" | "courier";
  }>>(null);
  useEffect(() => {
    void import("@/lib/orders-board").then((m) => setBoard(() => m.OrdersBoard));
  }, []);
  return Board ? <Board mode="owner" /> : null;
}

function emptyRow(): MenuRow {
  return {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    image_url: null,
    popular: false,
    available: true,
    sort_order: 0,
  };
}

function MenuManager() {
  const { t } = useI18n();
  const [rows, setRows] = useState<MenuRow[]>([]);
  const [editing, setEditing] = useState<MenuRow | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order");
    if (error) setErr(error.message);
    setRows((data ?? []) as MenuRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!editing) return;
    setBusy(true);
    setErr(null);
    const row = {
      ...editing,
      id: editing.id || `item-${Date.now()}`,
      price: Number(editing.price) || 0,
    };
    const { error } = await supabase.from("menu_items").upsert(row);
    if (error) setErr(error.message);
    else {
      setEditing(null);
      await load();
    }
    setBusy(false);
  }

  async function remove(id: string) {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) setErr(error.message);
    await load();
  }

  async function onFile(file: File) {
    if (!editing) return;
    setBusy(true);
    setErr(null);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = "";
      buf.forEach((b) => (bin += String.fromCharCode(b)));
      const res = await uploadMenuImage({
        data: {
          fileName: file.name,
          contentType: file.type,
          dataBase64: btoa(bin),
        },
      });
      setEditing({ ...editing, image_url: res.url });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "upload failed");
    }
    setBusy(false);
  }

  return (
    <div className="mt-6">
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button
        onClick={() => setEditing(emptyRow())}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
      >
        {t("addItem")}
      </button>

      {editing && (
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-5">
          <input
            className={inputCls}
            placeholder={t("name")}
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder={t("description")}
            value={editing.description ?? ""}
            onChange={(e) =>
              setEditing({ ...editing, description: e.target.value })
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className={inputCls}
              type="number"
              placeholder={t("price")}
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
            />
            <input
              className={inputCls}
              placeholder={t("category")}
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.available}
                onChange={(e) =>
                  setEditing({ ...editing, available: e.target.checked })
                }
              />
              {t("available")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.popular}
                onChange={(e) =>
                  setEditing({ ...editing, popular: e.target.checked })
                }
              />
              {t("popular")}
            </label>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t("image")}</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 block text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
            {editing.image_url && (
              <img
                src={editing.image_url}
                alt={editing.name}
                className="mt-3 h-28 w-40 rounded-lg object-cover"
              />
            )}
          </div>
          <div className="flex gap-2">
            <button
              disabled={busy}
              onClick={() => void save()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? t("loading") : t("save")}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-bold"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              {r.image_url && (
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="size-12 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-bold">
                  {r.name}{" "}
                  {!r.available && (
                    <span className="text-xs text-red-500">✕</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{r.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-primary">
                {formatPrice(Number(r.price))}
              </span>
              <button
                onClick={() => setEditing(r)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-bold"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => void remove(r.id)}
                className="rounded-lg border border-red-500/40 px-3 py-1.5 text-xs font-bold text-red-500"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CouriersManager() {
  const { t } = useI18n();
  const [apps, setApps] = useState<CourierApp[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("courier_applications")
      .select("*")
      .neq("status", "rejected")
      .order("created_at", { ascending: false });
    if (error) setErr(error.message);
    setApps((data ?? []) as CourierApp[]);
  }, []);


  useEffect(() => {
    void load();
  }, [load]);

  async function decide(app: CourierApp, approve: boolean) {
    setErr(null);
    const { error } = await supabase
      .from("courier_applications")
      .update({ status: approve ? "approved" : "rejected" })
      .eq("id", app.id);
    if (error) {
      setErr(error.message);
      return;
    }
    if (approve) {
      const { error: rErr } = await supabase
        .from("user_roles")
        .insert({ user_id: app.user_id, role: "courier" });
      if (rErr && !rErr.message.includes("duplicate")) setErr(rErr.message);
    } else {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", app.user_id)
        .eq("role", "courier");
    }
    await load();
  }

  return (
    <div className="mt-6 space-y-3">
      {err && <p className="text-sm text-red-500">{err}</p>}
      {apps.length === 0 && <p className="text-muted-foreground">—</p>}
      {apps.map((a) => (
        <div
          key={a.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div>
            <p className="font-bold">{a.full_name}</p>
            <p className="text-sm text-muted-foreground">
              {a.phone} {a.vehicle ? `— ${a.vehicle}` : ""}
            </p>
            <p className="text-xs text-primary">{a.status}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void decide(a, true)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              {t("approve")}
            </button>
            <button
              onClick={() => void decide(a, false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-muted-foreground"
            >
              {t("reject")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OwnersManager() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await addOwnerByEmail({ data: { email } });
      setMsg(t("saved"));
      setEmail("");
    } catch (e) {
      const m = e instanceof Error ? e.message : "error";
      setErr(
        m.includes("NOT_REGISTERED") ? t("ownerNotRegistered") : m
      );
    }
    setBusy(false);
  }

  return (
    <div className="mt-6 max-w-md space-y-3">
      <label className="text-sm text-muted-foreground">{t("addOwner")}</label>
      <input
        className={inputCls}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="owner@email.com"
      />
      <button
        disabled={busy || !email}
        onClick={() => void add()}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {busy ? t("loading") : t("add")}
      </button>
      {msg && <p className="text-sm text-green-500">{msg}</p>}
      {err && <p className="text-sm text-red-500">{err}</p>}
    </div>
  );
}
