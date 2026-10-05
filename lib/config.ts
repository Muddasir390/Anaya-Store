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
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923042525475",
  shipping_fee: 250,
  free_shipping_over: 15000,
  announcement:
    "Complimentary shipping on orders over PKR 15,000 · Cash on delivery available",
  contact_email: "hello@anaya.store",
  instagram: "anaya.abayas",
  address: "Near Darbar Noor Shah Bukhari, Ahmedpur East, District Bahawalpur, Punjab, Pakistan",
  phones: "03154043456, 03042525475",
  announcement_ur: "PKR 15,000 سے زائد کے آرڈر پر شپنگ مفت · کیش آن ڈیلیوری دستیاب",
  address_ur: "نزد دربار نور شاہ بخاری، احمد پور شرقیہ، ضلع بہاولپور، پنجاب، پاکستان",
};
