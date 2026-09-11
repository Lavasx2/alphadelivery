import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { MapPin, Phone, ShoppingBag, Star, UtensilsCrossed } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider, useCart } from "../lib/cart";
import { RESTAURANT } from "../lib/menu";
import { AuthProvider } from "../lib/auth";
import { I18nProvider, useI18n } from "../lib/i18n";
import { AccountMenu, LanguageSwitcher } from "../components/HeaderControls";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          الصفحة غير موجودة
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          حدث خطأ أثناء تحميل الصفحة
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "كراست تبسة | Crust Tebessa — بيتزا وطاكوس وبرغر وتوصيل للمنازل" },
        {
          name: "description",
          content:
            "مطعم كراست تبسة — بيتزا، طاكوس، برغر، مقلوب وصوفلي. اطلب من المنزل ونوصل لك في تبسة. تقييم 4.9 على قوقل مابس.",
        },
        { property: "og:title", content: "كراست تبسة | Crust Tebessa" },
        {
          property: "og:description",
          content:
            "بيتزا، طاكوس وبرغر في قلب تبسة. اطلب أونلاين ونوصل لك للمنزل.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.png", type: "image/png" },

        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700&display=swap",
        },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  }
);

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Header() {
  const { count } = useCart();
  const { t } = useI18n();
  const linkCls =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeCls = "text-primary";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <UtensilsCrossed className="size-5" />
          </span>
          <span className="text-lg font-extrabold">
            كراست <span className="text-primary">تبسة</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link to="/" className={linkCls} activeProps={{ className: activeCls }}>
            {t("home")}
          </Link>
          <Link
            to="/menu"
            className={linkCls}
            activeProps={{ className: activeCls }}
          >
            {t("menu")}
          </Link>
          <LanguageSwitcher />
          <AccountMenu />
          <Link
            to="/order"
            className="relative ms-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ShoppingBag className="size-4" />
            {t("myOrder")}
            {count > 0 && (
              <span className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UtensilsCrossed className="size-5" />
            </span>
            <span className="text-lg font-extrabold">
              Crust <span className="text-primary">Tebessa</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("footerAbout")}</p>
        </div>
        <div>
          <h3 className="font-bold">{t("info")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              {RESTAURANT.plusCode}, {RESTAURANT.address}
            </li>
            <li>
              <a
                href={`tel:${RESTAURANT.phone}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone className="size-4 text-primary" />
                {RESTAURANT.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Star className="size-4 text-primary" />
              {RESTAURANT.rating} {t("onGoogleMaps")} ({RESTAURANT.ratingCount}{" "}
              {t("reviews")})
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold">{t("links")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/menu" className="text-muted-foreground hover:text-primary">
                {t("fullMenu")}
              </Link>
            </li>
            <li>
              <Link to="/order" className="text-muted-foreground hover:text-primary">
                {t("orderHome")}
              </Link>
            </li>
            <li>
              <a
                href={RESTAURANT.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                {t("ourGooglePage")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Crust Tebessa — {t("rights")}
      </div>
    </footer>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
