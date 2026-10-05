import "server-only";
import { cache } from "react";
import { hasSupabase, DEFAULT_SETTINGS } from "./config";
import { createPublicClient } from "./supabase/public";
import { demoCategories, demoProducts, demoSettings } from "./demo-data";
import type { Category, Product, SiteSettings } from "./types";

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabase) return demoCategories;
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) console.error("getCategories", error.message);
  return (data as Category[]) ?? [];
});

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!hasSupabase) return demoProducts;
  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) console.error("getProducts", error.message);
  return ((data as Product[]) ?? []).map(normalizeProduct);
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
});

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSupabase) return demoSettings;
  const { data } = await createPublicClient().from("site_settings").select("*");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    store_name: map.store_name || DEFAULT_SETTINGS.store_name,
    whatsapp_number: map.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
    shipping_fee: Number(map.shipping_fee ?? DEFAULT_SETTINGS.shipping_fee),
    free_shipping_over: Number(
      map.free_shipping_over ?? DEFAULT_SETTINGS.free_shipping_over,
    ),
    announcement: map.announcement ?? DEFAULT_SETTINGS.announcement,
    contact_email: map.contact_email || DEFAULT_SETTINGS.contact_email,
    instagram: map.instagram || DEFAULT_SETTINGS.instagram,
    address: map.address || DEFAULT_SETTINGS.address,
    phones: map.phones || DEFAULT_SETTINGS.phones,
    announcement_ur: map.announcement_ur ?? DEFAULT_SETTINGS.announcement_ur,
    address_ur: map.address_ur || DEFAULT_SETTINGS.address_ur,
  };
});

/** Numeric columns come back as strings from PostgREST — normalise. */
export function normalizeProduct(p: Product): Product {
  return {
    ...p,
    price: Number(p.price),
    compare_at_price: p.compare_at_price == null ? null : Number(p.compare_at_price),
    images: p.images ?? [],
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
  };
}

export function shippingFor(subtotal: number, s: SiteSettings) {
  return subtotal >= s.free_shipping_over || subtotal === 0 ? 0 : s.shipping_fee;
}
