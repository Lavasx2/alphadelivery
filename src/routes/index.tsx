import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, MapPin, Phone, ShoppingBag, Star, Bike, Clock } from "lucide-react";
import { useMemo } from "react";
import banner from "@/assets/crust-banner.jpg.asset.json";
import { MENU_ITEMS, RESTAURANT, formatPrice } from "@/lib/menu";
import { localizeItem } from "@/lib/menu-i18n";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كراست تبسة | Crust Tebessa — بيتزا وطاكوس وبرغر وتوصيل للمنازل" },
      {
        name: "description",
        content:
          "مطعم كراست تبسة — بيتزا، طاكوس، برغر، مقلوب وصوفلي بأسعار المنيو الرسمية. اطلب من المنزل ونوصل لك في تبسة.",
      },
      { property: "og:title", content: "كراست تبسة | Crust Tebessa" },
      {
        property: "og:description",
        content: "بيتزا، طاكوس وبرغر في قلب تبسة. اطلب أونلاين ونوصل لك للمنزل.",
      },
    ],
  }),
  component: HomePage,
});

const featured = MENU_ITEMS.filter((i) => i.popular);

function HomePage() {
  const { add } = useCart();
  const { t, lang } = useI18n();
  const mapsKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];

  const featuredItems = useMemo(
    () => featured.map((i) => localizeItem(i, lang)),
    [lang]
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={banner.url}
            alt="أطباق كراست تبسة: بيتزا، برغر، طاكوس وبانيني"
            className="size-full object-cover"
            width={1200}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/85 to-background/40" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-24 md:py-36">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 font-semibold text-primary">
              <Star className="size-4 fill-primary" />
              {RESTAURANT.rating} · {RESTAURANT.ratingCount} {t("ratingOn")}
            </span>
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">
            {t("heroTitle")}
            <br />
            <span className="text-primary">{t("heroTitle2")}</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{t("heroDesc")}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-transform hover:scale-105"
            >
              <ShoppingBag className="size-5" />
              {t("orderNow")}
            </Link>
            <a
              href={`tel:${RESTAURANT.phone}`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              <Phone className="size-5" />
              {RESTAURANT.phone}
            </a>
            <a
              href={RESTAURANT.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-bold transition-colors hover:bg-secondary"
            >
              <MapPin className="size-5 text-primary" />
              {t("ourLocation")}
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
        {[
          { icon: Flame, title: t("feature1Title"), desc: t("feature1Desc") },
          { icon: Bike, title: t("feature2Title"), desc: t("feature2Desc") },
          { icon: Clock, title: t("feature3Title"), desc: t("feature3Desc") },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      {/* Featured dishes */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black">{t("mostOrdered")}</h2>
            <p className="mt-1 text-muted-foreground">{t("mostOrderedDesc")}</p>
          </div>
          <Link to="/menu" className="text-sm font-bold text-primary hover:underline">
            {t("fullMenu")} ←
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <span className="text-xs font-bold text-accent">{item.category}</span>
              <h3 className="mt-1 text-lg font-bold">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-black text-primary">
                  {formatPrice(item.price)}
                </span>
                <button
                  onClick={() => add(item)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t("add_")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-3xl font-black">{t("visitUs")}</h2>
        <p className="mt-1 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 text-primary" />
          {RESTAURANT.plusCode}، {RESTAURANT.address}
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <iframe
            title={t("mapTitle")}
            src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=place_id:${RESTAURANT.placeId}&language=${lang}&zoom=16`}
            className="h-96 w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
