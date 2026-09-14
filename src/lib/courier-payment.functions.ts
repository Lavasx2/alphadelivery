import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Records a courier's Edahabia (البطاقة الذهبية) payment for their
 * application. The courier can only touch their own row, and cannot change
 * the application status — the owner still verifies and approves.
 */
export const submitCourierPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { reference: string; holder: string; last4: string }) => {
    const reference = String(data.reference ?? "").trim();
    const holder = String(data.holder ?? "").trim();
    const last4 = String(data.last4 ?? "").replace(/\D/g, "").slice(-4);
    if (reference.length < 4 || holder.length < 3 || last4.length !== 4) {
      throw new Error("INVALID_PAYMENT");
    }
    return { reference, holder, last4 };
  })
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: app } = await supabaseAdmin
      .from("courier_applications")
      .select("id,payment_status")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!app) throw new Error("NO_APPLICATION");

    const { data: fee } = await supabaseAdmin
      .from("app_settings")
      .select("value")
      .eq("key", "courier_fee")
      .maybeSingle();

    const { error } = await supabaseAdmin
      .from("courier_applications")
      .update({
        payment_status: "submitted",
        payment_reference: data.reference,
        payment_holder: data.holder,
        payment_last4: data.last4,
        fee_amount: Number(fee?.value ?? 0) || 0,
        paid_at: new Date().toISOString(),
      })
      .eq("id", app.id);
    if (error) throw new Error(error.message);

    return { ok: true };
  });
