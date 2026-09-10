import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Globe, LogOut, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { LANGS, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t("language")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">
          {LANGS.find((l) => l.code === lang)?.label}
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute end-0 z-50 mt-1 min-w-36 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
            {LANGS.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-start text-sm hover:bg-accent/50 ${
                    l.code === lang ? "font-bold text-primary" : ""
                  }`}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function AccountMenu() {
  const { t } = useI18n();
  const { user, isOwner, isCourier, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => navigate({ to: "/auth" })}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <UserIcon className="size-4" />
        <span className="hidden sm:inline">{t("signIn")}</span>
      </button>
    );
  }

  async function handleSignOut() {
    setOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <UserIcon className="size-4" />
        <span className="hidden max-w-28 truncate sm:inline">
          {user.email ?? t("account")}
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <ul className="absolute end-0 z-50 mt-1 min-w-48 overflow-hidden rounded-lg border border-border bg-card py-1 shadow-lg">
            {isOwner && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/dashboard" });
                  }}
                  className="block w-full px-4 py-2 text-start text-sm hover:bg-accent/50"
                >
                  {t("dashboard")}
                </button>
              </li>
            )}
            <li>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: "/courier" });
                }}
                className="block w-full px-4 py-2 text-start text-sm hover:bg-accent/50"
              >
                {isCourier ? t("orders") : t("courierArea")}
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex w-full items-center gap-2 px-4 py-2 text-start text-sm text-red-500 hover:bg-accent/50"
              >
                <LogOut className="size-4" />
                {t("signOut")}
              </button>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
