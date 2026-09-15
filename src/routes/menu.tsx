import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { MENU_ITEMS, SUPPLEMENTS, formatPrice } from "@/lib/menu";
import { listMenuItems } from "@/lib/menu-public.functions";
import { localizeItem, localizeSupplement } from "@/lib/menu-i18n";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/menu")({
  loader: async () => {
    try {
      const items = await listMenuItems();
      return { items: items.length > 0 ? items : MENU_ITEMS };
    } catch {
      return { items: MENU_ITEMS };
    }
  },
  errorComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">تعذّر تحميل المنيو</h1>
      <p className="mt-2 text-muted-foreground">حاول تحديث الصفحة من فضلك.</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h1 className="text-2xl font-black">الصفحة غير موجودة</h1>
    </div>
  ),
  head: () => ({
    meta: [
      { title: "المنيو | كراست تبسة" },
      {
        name: "description",
        content:
          "منيو كراست تبسة الكامل — بيتزا، طاكوس، برغر، مقلوب، صوفلي، سلطات وبوكس بأسعار واضحة. اطلب للمنزل في تبسة.",
      },
      { property: "og:title", content: "المنيو | كراست تبسة" },
      {
        property: "og:description",
        content: "بيتزا، برغر، طاكوس وباستا — اطلب من المنزل في تبسة.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { items: rawItems } = Route.useLoaderData();
  const { add } = useCart();
  const { t, lang } = useI18n();
  const [category, setCategory] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const allItems = useMemo(
    () => rawItems.map((i) => localizeItem(i, lang)),
    [rawItems, lang]
  );

  const categories = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.category))),
    [allItems]
  );

  const items = category
    ? allItems.filter((i) => i.category === category)
    : allItems;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-black sm:text-4xl">{t("menu")}</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">
        {t("menuIntro")}
      </p>

      {/* Category filter */}
      <div className="-mx-4 mt-6 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:overflow-visible sm:px-0">
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => setCategory(c)}
            className={`min-h-11 shrink-0 snap-start whitespace-nowrap rounded-full px-5 text-sm font-bold transition-colors ${
              category === c
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c ?? t("all")}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl border border-border bg-card"
          >
            {item.image && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.popular && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                    <Flame className="size-3" /> {t("mostOrdered")}
                  </span>
                )}
              </div>
            )}
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold">{item.name}</h3>
                {!item.image && item.popular && (
                  <Flame className="size-4 shrink-0 text-primary" />
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-black text-primary">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => {
                    add(item);
                    setAddedId(item.id);
                    setTimeout(() => setAddedId(null), 900);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                    addedId === item.id
                      ? "bg-green-600 text-white"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {addedId === item.id ? t("added") : t("addToCart")}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
          { title: t("pizzaSupplements"), list: SUPPLEMENTS.pizza },
          { title: t("tacosSupplements"), list: SUPPLEMENTS.tacos },
        ].map((block) => (
          <div key={block.title} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-black text-primary">{block.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {block.list.map((s) => (
                <li key={s.name} className="flex justify-between border-b border-border/60 pb-2">
                  <span>{localizeSupplement(s.name, lang)}</span>
                  <span className="font-bold">{formatPrice(s.price)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
