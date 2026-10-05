"use server";

import { hasServiceRole, hasSupabase } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { digitsOnly } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import type { OrderStatus } from "@/lib/types";

export type TrackResult =
  | { ok: true; number: string; status: OrderStatus; total: number; createdAt: string; items: { name: string; quantity: number; size: string | null }[] }
  | { ok: false; error: string };

export async function trackOrder(_prev: TrackResult | null, fd: FormData): Promise<TrackResult> {
  const { t } = await getT();
  const number = String(fd.get("number") ?? "").trim().toUpperCase();
  const phone = digitsOnly(String(fd.get("phone") ?? ""));
  if (!number || phone.length < 6) return { ok: false, error: t("tr.missing") };

  if (!hasSupabase || !hasServiceRole)
    return { ok: true, number, status: "shipped", total: 0, createdAt: new Date().toISOString(), items: [{ name: "Demo order (connect Supabase for real tracking)", quantity: 1, size: null }] };

  const { data } = await createAdminClient()
    .from("orders")
    .select("order_number,status,total,created_at,phone,order_items(name,quantity,size)")
    .eq("order_number", number)
    .maybeSingle();

  // Same message for "no such order" and "wrong phone" so numbers can't be probed.
  const stored = data ? digitsOnly(data.phone) : "";
  const match = stored && (stored.endsWith(phone.slice(-8)) || phone.endsWith(stored.slice(-8)));
  if (!data || !match) return { ok: false, error: t("tr.notFound") };

  return {
    ok: true,
    number: data.order_number,
    status: data.status as OrderStatus,
    total: Number(data.total),
    createdAt: data.created_at,
    items: data.order_items ?? [],
  };
}
