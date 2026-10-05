import type { Category, Product } from "./types";

/** Shown automatically until Supabase env vars are configured. */
export const demoCategories: Category[] = [
  { id: "c1", name: "Everyday", slug: "everyday", description: "Effortless daily abayas in breathable crepe and nida.", image_url: null, sort_order: 1 },
  { id: "c2", name: "Occasion", slug: "occasion", description: "Statement pieces for Eid, weddings and evenings.", image_url: null, sort_order: 2 },
  { id: "c3", name: "Embroidered", slug: "embroidered", description: "Hand-finished detailing, thread by thread.", image_url: null, sort_order: 3 },
  { id: "c4", name: "Open Front", slug: "open-front", description: "Layered, flowing kimono-style silhouettes.", image_url: null, sort_order: 4 },
];

const SIZES = ["52", "54", "56", "58", "60"];
const base = {
  images: [] as string[],
  sizes: SIZES,
  care: "Gentle machine wash cold or dry clean. Steam to refresh. Do not bleach.",
  is_active: true,
};

export const demoProducts: Product[] = [
  { ...base, id: "p1", slug: "noor-classic-black", name: "Noor Classic Black", tagline: "The everyday essential", description: "A timeless closed abaya cut from featherlight crepe with a clean, relaxed drape. Concealed snap placket, wide sleeves with soft cuffs, and a hem that moves beautifully. Designed to be worn on repeat.", price: 8700, compare_at_price: 10500, category_id: "c1", colors: [{ name: "Jet Black", hex: "#141414" }, { name: "Charcoal", hex: "#3d3d42" }], material: "Premium crepe · 100% polyester", stock: 24, is_featured: true, created_at: "2026-09-20T00:00:00Z" },
  { ...base, id: "p2", slug: "layla-embroidered-sand", name: "Layla Embroidered Sand", tagline: "Gold thread, quiet luxury", description: "Tone-on-tone gold embroidery traces the sleeves and front panel of this sand-hued abaya. Finished with a soft inner lining and a subtle belt loop.", price: 13800, compare_at_price: null, category_id: "c3", colors: [{ name: "Sand", hex: "#c9b08a" }, { name: "Mocha", hex: "#7a5c46" }], material: "Nida silk blend", stock: 12, is_featured: true, created_at: "2026-09-18T00:00:00Z" },
  { ...base, id: "p3", slug: "zahra-open-front-emerald", name: "Zahra Open Front Emerald", tagline: "Flow in every step", description: "An open-front abaya in deep emerald chiffon-crepe. Layer it over anything — long sleeves with dramatic fall and a wrap belt in matching fabric.", price: 11400, compare_at_price: 12900, category_id: "c4", colors: [{ name: "Emerald", hex: "#0f5c4a" }, { name: "Midnight", hex: "#1b2340" }], material: "Chiffon crepe", stock: 9, is_featured: true, created_at: "2026-09-15T00:00:00Z" },
  { ...base, id: "p4", slug: "salma-butterfly-rose", name: "Salma Butterfly Rose", tagline: "Light as air", description: "A generous butterfly cut in blush rose. Wide, airy sleeves and an easy fit make this the perfect Eid companion.", price: 9900, compare_at_price: null, category_id: "c2", colors: [{ name: "Dusty Rose", hex: "#c98a96" }, { name: "Ivory", hex: "#ece4d6" }], material: "Soft crepe", stock: 15, is_featured: true, created_at: "2026-09-10T00:00:00Z" },
  { ...base, id: "p5", slug: "amira-royal-navy", name: "Amira Royal Navy", tagline: "Deep, dignified, effortless", description: "Rich navy with a satin-finish collar and cuffs. Structured yet fluid — ideal for work and gatherings alike.", price: 9600, compare_at_price: null, category_id: "c1", colors: [{ name: "Navy", hex: "#1a2447" }], material: "Crepe with satin trim", stock: 18, is_featured: false, created_at: "2026-09-05T00:00:00Z" },
  { ...base, id: "p6", slug: "mariam-pearl-ivory", name: "Mariam Pearl Ivory", tagline: "For the moments that matter", description: "Ivory evening abaya with hand-set pearl beading along the cuffs and neckline. Floor-length with a graceful sweep.", price: 17700, compare_at_price: 20700, category_id: "c2", colors: [{ name: "Ivory", hex: "#ece4d6" }], material: "Silk-blend crepe · pearl detail", stock: 6, is_featured: true, created_at: "2026-08-28T00:00:00Z" },
  { ...base, id: "p7", slug: "dana-linen-olive", name: "Dana Linen Olive", tagline: "Made for warm days", description: "Breathable linen-blend in a muted olive. Pockets, a relaxed shape, and a fabric that gets softer with every wear.", price: 8100, compare_at_price: null, category_id: "c1", colors: [{ name: "Olive", hex: "#5b6143" }, { name: "Stone", hex: "#b9b3a4" }], material: "Linen-viscose blend", stock: 20, is_featured: false, created_at: "2026-08-20T00:00:00Z" },
  { ...base, id: "p8", slug: "hana-embroidered-wine", name: "Hana Embroidered Wine", tagline: "Floral, bold, unforgettable", description: "Burgundy abaya with cascading floral embroidery down the sleeves. A statement that still feels modest and refined.", price: 15000, compare_at_price: null, category_id: "c3", colors: [{ name: "Wine", hex: "#5e1f33" }], material: "Nida · machine embroidery", stock: 0, is_featured: false, created_at: "2026-08-12T00:00:00Z" },
];

export const demoSettings = {
  store_name: "Anaya Abayas",
  whatsapp_number: "923000000000",
  shipping_fee: 250,
  free_shipping_over: 15000,
  announcement: "Complimentary shipping on orders over PKR 15,000 · Cash on delivery available",
  contact_email: "hello@anaya.store",
  instagram: "anaya.abayas",
};
