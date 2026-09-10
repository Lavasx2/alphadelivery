import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { MENU_ITEMS, SUPPLEMENTS, formatPrice } from "@/lib/menu";
import { listMenuItems } from "@/lib/menu-public.functions";
import { useCart } from "@/lib/cart";

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
  const { items: allItems } = Route.useLoaderData();
  const { add } = useCart();
  const [category, setCategory] = useState<string>("الكل");
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(allItems.map((i) => i.category))),
    [allItems]
  );

  const items =
    category === "الكل"
      ? allItems
      : allItems.filter((i) => i.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-black">المنيو</h1>
      <p className="mt-2 text-muted-foreground">
        كل أطباقنا محضّرة طازجة عند الطلب — اختر وأضف لسلتك
      </p>

      {/* Category filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        {["الكل", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              category === c
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
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
                    <Flame className="size-3" /> الأكثر طلباً
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
                  {addedId === item.id ? "تمت الإضافة ✓" : "أضف للسلة +"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
          { title: "سوبليمون البيتزا", list: SUPPLEMENTS.pizza },
          { title: "سوبليمون الطاكوس", list: SUPPLEMENTS.tacos },
        ].map((block) => (
          <div key={block.title} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-black text-primary">{block.title}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {block.list.map((s) => (
                <li key={s.name} className="flex justify-between border-b border-border/60 pb-2">
                  <span>{s.name}</span>
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

