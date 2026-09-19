import { useEffect, useState } from "react";
import { Download, Share } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

export function InstallApp() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<PromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as PromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleClick = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      return;
    }
    setShowIosHint(true);
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-center">
      <button
        type="button"
        onClick={handleClick}
        className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 transition hover:border-primary active:scale-95"
      >
        <img
          src="/app-icon-192.png"
          alt={t("installApp")}
          className="size-16 rounded-2xl shadow-lg"
          loading="lazy"
        />
        <span className="flex items-center gap-2 text-sm font-bold">
          <Download className="size-4 text-primary" />
          {t("installApp")}
        </span>
      </button>
      {(showIosHint || (isIos && !deferred)) && (
        <p className="flex max-w-xs items-center justify-center gap-1 text-xs text-muted-foreground">
          <Share className="size-3.5 shrink-0" />
          {t("installHint")}
        </p>
      )}
    </div>
  );
}
