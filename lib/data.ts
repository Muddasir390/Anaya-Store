import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { hasSupabase, DEFAULT_SETTINGS } from "./config";
import { createPublicClient } from "./supabase/public";
import { demoCategories, demoProducts, demoSettings } from "./demo-data";
import type { Category, Product, SiteSettings } from "./types";

/** Cross-request cache for catalogue reads (60s, purged by admin edits via updateTag). */
const TTL = { revalidate: 60, tags: ["catalog"] };

const fetchCategories = unstable_cache(async (): Promise<Category[]> => {
  const { data, error } = await createPublicClient()
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data as Category[]) ?? [];
}, ["categories"], TTL);

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabase) return demoCategories;
  try {
    return await fetchCategories();
  } catch (e) {
    console.error("getCategories", e);
    return [];
  }
});

const fetchProducts = unstable_cache(async (): Promise<Product[]> => {
  const { data, error } = await createPublicClient()
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data as Product[]) ?? []).map(normalizeProduct);
}, ["products"], TTL);

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!hasSupabase) return demoProducts;
  try {
    return await fetchProducts();
  } catch (e) {
    console.error("getProducts", e);
    return [];
  }
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
});

const fetchSettingRows = unstable_cache(async () => {
  const { data, error } = await createPublicClient().from("site_settings").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []) as { key: string; value: string }[];
}, ["site_settings"], TTL);

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSupabase) return demoSettings;
  let rows: { key: string; value: string }[] = [];
  try {
    rows = await fetchSettingRows();
  } catch (e) {
    console.error("getSettings", e);
  }
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
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
