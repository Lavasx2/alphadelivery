import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the owner role to the signed-in user when their email is in the
 * owner_emails allowlist. Safe to call on every sign-in.
 */
export const claimOwnerRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims as { email?: string }).email?.toLowerCase().trim();
    if (!email) return { granted: false };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: allowed } = await supabaseAdmin
      .from("owner_emails")
      .select("email")
      .ilike("email", email)
      .maybeSingle();
    if (!allowed) return { granted: false };

    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "owner" });
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      throw new Error(error.message);
    }
    return { granted: true };
  });
