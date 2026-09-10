import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { claimOwnerRole } from "@/lib/owner.functions";

export type Role = "owner" | "courier" | "customer";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  roles: Role[];
  isOwner: boolean;
  isCourier: boolean;
  loading: boolean;
  refreshRoles: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRoles(userId: string) {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    return ((data ?? []).map((r) => r.role) as Role[]) ?? [];
  }

  async function loadRoles(userId: string | undefined) {
    if (!userId) {
      setRoles([]);
      return;
    }
    let current = await fetchRoles(userId);
    if (!current.includes("owner")) {
      // Grants the owner role automatically to allowlisted owner emails.
      try {
        const res = await claimOwnerRole();
        if (res?.granted) current = await fetchRoles(userId);
      } catch {
        /* ignore — user simply is not an allowlisted owner */
      }
    }
    setRoles(current);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      void loadRoles(s?.user?.id);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadRoles(data.session?.user?.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);


  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    roles,
    isOwner: roles.includes("owner"),
    isCourier: roles.includes("courier"),
    loading,
    refreshRoles: () => loadRoles(session?.user?.id),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
