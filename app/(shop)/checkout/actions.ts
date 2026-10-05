"use server";

import { z } from "zod";
import { hasServiceRole, hasSupabase } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { digitsOnly } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n";

const Schema = z.object({
  name: z.string().trim().min(2, "err.name").max(100),
  phone: z
    .string()
    .trim()
    .refine((v) => digitsOnly(v).length >= 8 && digitsOnly(v).length <= 15, "err.phone"),
  email: z.union([z.literal(""), z.email("err.email")]).optional(),
  address: z.string().trim().min(8, "err.address").max(300),
  city: z.string().trim().min(2, "err.city").max(80),
  notes: z.string().trim().max(500).optional(),
  payment_method: z.enum(["cod"]).default("cod"),
  website: z.string().max(0).optional(), // honeypot — real users leave this empty
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().max(200),
        size: z.string().nullable(),
        color: z.string().nullable(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1, "err.empty")
    .max(30),
});

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; token: string; demo?: boolean }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const { t, locale } = await getT();
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      fieldErrors[k] ??= t(issue.message as Key);
    }
    return { ok: false, error: Object.values(fieldErrors)[0] ?? t("err.generic"), fieldErrors };
  }
  const d = parsed.data;
  if (d.website) return { ok: false, error: t("err.try") };

  // Preview mode: no database configured yet — simulate so the flow can be demoed.
  if (!hasSupabase || !hasServiceRole) {
    return { ok: true, orderNumber: `DEMO-${Math.floor(1000 + Math.random() * 9000)}`, token: "demo", demo: true };
  }

  const { data, error } = await createAdminClient().rpc("place_order", {
    p_customer: {
      name: d.name,
      phone: d.phone,
      email: d.email ?? "",
      address: d.address,
      city: d.city,
      notes: d.notes ?? "",
      payment_method: d.payment_method,
      lang: locale,
    },
    p_items: d.items.map((i) => ({ product_id: i.productId, name: i.name, size: i.size, color: i.color, quantity: i.quantity })),
  });

  if (error) {
    const m = error.message;
    if (m.includes("OUT_OF_STOCK")) return { ok: false, error: t("err.stock", { name: m.split("OUT_OF_STOCK:")[1]?.trim() ?? "" }) };
    if (m.includes("UNAVAILABLE")) return { ok: false, error: t("err.unavailable") };
    if (m.includes("BAD_SIZE")) return { ok: false, error: t("err.badSize") };
    console.error("place_order failed", m);
    return { ok: false, error: t("err.failed") };
  }
  const r = data as { order_number: string; public_token: string };
  return { ok: true, orderNumber: r.order_number, token: r.public_token };
}
