export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "PKR";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const hasSupabase = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
export const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

export const DEFAULT_SETTINGS = {
  store_name: "Anaya Abayas",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923000000000",
  shipping_fee: 250,
  free_shipping_over: 15000,
  announcement:
    "Complimentary shipping on orders over PKR 15,000 · Cash on delivery available",
  contact_email: "hello@anaya.store",
  instagram: "anaya.abayas",
};
