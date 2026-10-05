"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/config";
import { slugify } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string } | null;

/* ---------- auth ---------- */
export async function signIn(_p: FormState, fd: FormData): Promise<FormState> {
  if (!hasSupabase) return { error: "Supabase isn't configured yet — see SETUP.md." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(fd.get("email") ?? "").trim(),
    password: String(fd.get("password") ?? ""),
  });
  if (error) return { error: "Invalid email or password." };
  const { data } = await supabase.auth.getUser();
  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", data.user!.id).maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { error: "This account is not an admin. Add it to the admins table (see SETUP.md)." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ---------- orders ---------- */
export async function updateOrderStatus(id: string, status: string) {
  const { supabase } = await requireAdmin();
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return { error: "Bad status" };

  const { data: prev } = await supabase.from("orders").select("status, order_items(product_id, quantity)").eq("id", id).single();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  // Cancelling returns stock; un-cancelling takes it back out.
  if (prev && (status === "cancelled") !== (prev.status === "cancelled")) {
    const sign = status === "cancelled" ? 1 : -1;
    for (const it of prev.order_items ?? []) {
      if (!it.product_id) continue;
      const { data: p } = await supabase.from("products").select("stock").eq("id", it.product_id).single();
      if (p) await supabase.from("products").update({ stock: Math.max(0, p.stock + sign * it.quantity) }).eq("id", it.product_id);
    }
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function saveOrderNotes(id: string, notes: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("orders").update({ admin_notes: notes.slice(0, 1000) }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/admin/orders/${id}`);
  return { ok: true };
}

/* ---------- products ---------- */
const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Name is required").max(120),
  tagline: z.string().trim().max(120).default(""),
  description: z.string().trim().max(4000).default(""),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  compare_at_price: z.preprocess((v) => (v === "" || v == null ? null : Number(v)), z.number().min(0).nullable()),
  category_id: z.preprocess((v) => (v === "" ? null : v), z.string().nullable()),
  stock: z.coerce.number().int().min(0),
  material: z.string().trim().max(200).default(""),
  care: z.string().trim().max(500).default(""),
  sizes: z.string().default(""),
  colors: z.string().default("[]"),
  images: z.string().default("[]"),
  is_active: z.boolean(),
  is_featured: z.boolean(),
});

export async function saveProduct(_p: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const parsed = ProductSchema.safeParse({
    ...Object.fromEntries(fd),
    is_active: fd.get("is_active") === "on",
    is_featured: fd.get("is_featured") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  let colors: unknown, images: unknown;
  try {
    colors = JSON.parse(d.colors);
    images = JSON.parse(d.images);
  } catch {
    return { error: "Invalid colours or images data" };
  }
  const row = {
    name: d.name,
    tagline: d.tagline,
    description: d.description,
    price: d.price,
    compare_at_price: d.compare_at_price,
    category_id: d.category_id,
    stock: d.stock,
    material: d.material,
    care: d.care,
    sizes: d.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    colors,
    images,
    is_active: d.is_active,
    is_featured: d.is_featured,
  };

  if (d.id) {
    const { error } = await supabase.from("products").update(row).eq("id", d.id);
    if (error) return { error: error.message };
  } else {
    let slug = slugify(d.name) || "abaya";
    const { data: clash } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
    if (clash) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    const { error } = await supabase.from("products").insert({ ...row, slug });
    if (error) return { error: error.message };
  }
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleProductActive(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("products").update({ is_active: active }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ---------- categories ---------- */
export async function saveCategory(_p: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const name = String(fd.get("name") ?? "").trim();
  if (name.length < 2) return { error: "Category name is required" };
  const id = String(fd.get("id") ?? "");
  const row = {
    name,
    slug: slugify(name),
    description: String(fd.get("description") ?? "").trim(),
    sort_order: Number(fd.get("sort_order") ?? 0) || 0,
  };
  const { error } = id ? await supabase.from("categories").update(row).eq("id", id) : await supabase.from("categories").insert(row);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

/* ---------- settings ---------- */
export async function saveSettings(_p: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const keys = ["store_name", "whatsapp_number", "shipping_fee", "free_shipping_over", "announcement", "contact_email", "instagram"];
  const rows = keys.map((key) => ({ key, value: String(fd.get(key) ?? "").trim() }));
  const num = rows.filter((r) => ["shipping_fee", "free_shipping_over"].includes(r.key));
  if (num.some((r) => r.value === "" || Number.isNaN(Number(r.value)) || Number(r.value) < 0)) return { error: "Shipping values must be numbers" };
  if (rows.find((r) => r.key === "whatsapp_number")!.value.replace(/\D/g, "").length < 8) return { error: "Enter WhatsApp number with country code, digits only (e.g. 923001234567)" };
  const { error } = await supabase.from("site_settings").upsert(rows);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
