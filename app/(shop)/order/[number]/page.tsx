import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { hasServiceRole, hasSupabase } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import OrderConfirmation from "@/components/OrderConfirmation";
import type { Order } from "@/lib/types";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.order"), robots: { index: false } };
}

export default async function OrderPage({ params, searchParams }: PageProps<"/order/[number]">) {
  const { number } = await params;
  const sp = await searchParams;
  const token = Array.isArray(sp.t) ? sp.t[0] : sp.t;
  const settings = await getSettings();

  let order: Order | null = null;
  if (hasSupabase && hasServiceRole && token && token !== "demo") {
    const { data } = await createAdminClient()
      .from("orders")
      .select("*, order_items(*)")
      .eq("order_number", number)
      .eq("public_token", token)
      .maybeSingle();
    order = data as Order | null;
  }

  return <OrderConfirmation number={number} order={order} whatsapp={settings.whatsapp_number} />;
}
