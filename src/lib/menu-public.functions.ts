import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { MenuItem } from "@/lib/menu";

/** Public read of the menu managed by the restaurant owner. */
export const listMenuItems = createServerFn({ method: "GET" }).handler(
  async (): Promise<MenuItem[]> => {
    const supabasePublic = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data, error } = await supabasePublic
      .from("menu_items")
      .select("id,name,description,price,category,image_url,popular,available")
      .eq("available", true)
      .order("sort_order", { ascending: true });

    if (error) throw new Error(error.message);

    return (data ?? []).map((r) => {
      const item: MenuItem = {
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        price: Number(r.price),
        category: r.category,
        popular: r.popular,
      };
      if (r.image_url) item.image = r.image_url;
      return item;
    });
  }
);
