import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type UploadInput = {
  fileName: string;
  contentType: string;
  dataBase64: string;
};

/** Owner-only menu image upload. Returns a public proxy URL. */
export const uploadMenuImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: UploadInput) => {
    if (!input?.dataBase64 || !input?.fileName) throw new Error("Invalid file");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: isOwner } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "owner",
    });
    if (!isOwner) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const bytes = Uint8Array.from(atob(data.dataBase64), (c) => c.charCodeAt(0));
    const ext = (data.fileName.split(".").pop() || "jpg").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("menu-images")
      .upload(path, bytes, {
        contentType: data.contentType || "image/jpeg",
        upsert: false,
      });
    if (error) throw new Error(error.message);

    return { url: `/api/public/menu-image?path=${encodeURIComponent(path)}` };
  });

/** Owner-only: grant the owner role to another registered user by email. */
export const addOwnerByEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string }) => {
    if (!input?.email) throw new Error("Email required");
    return input;
  })
  .handler(async ({ data, context }) => {
    const { data: isOwner } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "owner",
    });
    if (!isOwner) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("email", data.email.trim())
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!profile) throw new Error("NOT_REGISTERED");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: profile.id, role: "owner" });
    if (roleError && !roleError.message.includes("duplicate")) {
      throw new Error(roleError.message);
    }
    return { ok: true };
  });
