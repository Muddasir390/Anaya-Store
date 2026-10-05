import type { Category, Product } from "./types";

/** Shown automatically until Supabase env vars are configured. */
export const demoCategories: Category[] = [
  { id: "c1", name: "Everyday", slug: "everyday", description: "Effortless daily abayas in breathable crepe and nida.", image_url: null, sort_order: 1 },
  { id: "c2", name: "Occasion", slug: "occasion", description: "Statement pieces for Eid, weddings and evenings.", image_url: null, sort_order: 2 },
  { id: "c3", name: "Embroidered", slug: "embroidered", description: "Hand-finished detailing, thread by thread.", image_url: null, sort_order: 3 },
  { id: "c4", name: "Open Front", slug: "open-front", description: "Layered, flowing kimono-style silhouettes.", image_url: null, sort_order: 4 },
];

const base = {
  sizes: ["52", "54", "56", "58", "60"],
  care: "Gentle machine wash cold or dry clean. Steam to refresh. Do not bleach.",
  is_active: true,
};

export const demoProducts: Product[] = [
  { ...base, id: "p1", slug: "noor-classic-black", name: "Noor Classic Black", tagline: "The everyday essential", description: "A timeless flowing abaya cut from featherlight crepe with a relaxed drape, sheer-sleeve detail and a hem that moves beautifully. Designed to be worn on repeat.", price: 8700, compare_at_price: 10500, category_id: "c1", colors: [{name: "Jet Black", hex: "#141414"}, {name: "Charcoal", hex: "#3d3d42"}], material: "Premium crepe · 100% polyester", stock: 24, is_featured: true, created_at: "2026-09-28T00:00:00Z", images: ["/demo/noor-classic-black.jpg", "/demo/noor-classic-black-detail.jpg"] },
  { ...base, id: "p2", slug: "layla-gold-cuff-open-front", name: "Layla Gold-Cuff Open Front", tagline: "Gold trim, quiet luxury", description: "A satin-finish open-front abaya with gold-embroidered cuffs and a luminous drape. Layer it over anything for an instant statement.", price: 13800, compare_at_price: null, category_id: "c4", colors: [{name: "Espresso", hex: "#3b2a26"}, {name: "Midnight", hex: "#1b2340"}], material: "Satin crepe · gold embroidered cuffs", stock: 12, is_featured: true, created_at: "2026-09-27T00:00:00Z", images: ["/demo/layla-gold-cuff-open-front.jpg", "/demo/layla-gold-cuff-open-front-detail.jpg"] },
  { ...base, id: "p3", slug: "zahra-rose-open-front", name: "Zahra Rose Open Front", tagline: "Flow in every step", description: "A soft rose open-front abaya with ruffled bell sleeves and a matching inner dress. Light, romantic and effortless to style.", price: 11400, compare_at_price: 12900, category_id: "c4", colors: [{name: "Rose", hex: "#d9808f"}, {name: "Ivory", hex: "#ece4d6"}], material: "Chiffon crepe", stock: 9, is_featured: true, created_at: "2026-09-26T00:00:00Z", images: ["/demo/zahra-rose-open-front.jpg", "/demo/zahra-rose-open-front-detail.jpg"] },
  { ...base, id: "p4", slug: "salma-mauve-butterfly", name: "Salma Mauve Butterfly", tagline: "Light as air", description: "A generous butterfly cut in rich mauve with wide, airy sleeves and tonal beaded trim. The perfect Eid companion.", price: 9900, compare_at_price: null, category_id: "c2", colors: [{name: "Mauve", hex: "#8a5a7a"}, {name: "Plum", hex: "#4a2640"}], material: "Soft crepe · beaded trim", stock: 15, is_featured: true, created_at: "2026-09-25T00:00:00Z", images: ["/demo/salma-mauve-butterfly.jpg", "/demo/salma-mauve-butterfly-detail.jpg"] },
  { ...base, id: "p5", slug: "amira-navy-stripe-kimono", name: "Amira Navy Stripe Kimono", tagline: "Graphic, graceful, modern", description: "A navy kimono-style abaya with sculpted blush stripes. Structured yet fluid — made for work and gatherings alike.", price: 9600, compare_at_price: null, category_id: "c1", colors: [{name: "Navy", hex: "#1a2447"}], material: "Crepe with woven stripes", stock: 18, is_featured: false, created_at: "2026-09-24T00:00:00Z", images: ["/demo/amira-navy-stripe-kimono.jpg", "/demo/amira-navy-stripe-kimono-detail.jpg"] },
  { ...base, id: "p6", slug: "mariam-ivory-lace-cuff", name: "Mariam Ivory Lace Cuff", tagline: "For the moments that matter", description: "A pure ivory abaya with delicate lace-trimmed cuffs, floor length with a graceful sweep. Elegant for Eid, nikah and special evenings.", price: 17700, compare_at_price: 20700, category_id: "c2", colors: [{name: "Ivory", hex: "#ece4d6"}], material: "Silk-blend crepe · lace detail", stock: 6, is_featured: true, created_at: "2026-09-23T00:00:00Z", images: ["/demo/mariam-ivory-lace-cuff.jpg", "/demo/mariam-ivory-lace-cuff-detail.jpg"] },
  { ...base, id: "p7", slug: "dana-dusty-mauve", name: "Dana Dusty Mauve", tagline: "Made for warm days", description: "A breathable dusty-mauve abaya with a relaxed shape and easy button front. Gets softer with every wear.", price: 8100, compare_at_price: null, category_id: "c1", colors: [{name: "Dusty Mauve", hex: "#a98390"}, {name: "Stone", hex: "#b9b3a4"}], material: "Linen-viscose blend", stock: 20, is_featured: false, created_at: "2026-09-22T00:00:00Z", images: ["/demo/dana-dusty-mauve.jpg", "/demo/dana-dusty-mauve-detail.jpg"] },
  { ...base, id: "p8", slug: "hana-embroidered-black", name: "Hana Embroidered Black", tagline: "Detail you'll want to touch", description: "Classic black with tonal embroidery across the chest and cuffs. A statement that still feels modest and refined.", price: 14900, compare_at_price: null, category_id: "c3", colors: [{name: "Black", hex: "#141414"}], material: "Nida · machine embroidery", stock: 10, is_featured: true, created_at: "2026-09-21T00:00:00Z", images: ["/demo/hana-embroidered-black.jpg", "/demo/hana-embroidered-black-detail.jpg"] },
  { ...base, id: "p9", slug: "noor-ornate-sleeve", name: "Noor Ornate Sleeve", tagline: "Heritage pattern, modern cut", description: "Midnight black with richly patterned gold-and-black sleeve panels and matching edge trim. Worth every compliment.", price: 15900, compare_at_price: null, category_id: "c3", colors: [{name: "Black Gold", hex: "#1b1511"}], material: "Nida silk blend · jacquard trim", stock: 7, is_featured: false, created_at: "2026-09-20T00:00:00Z", images: ["/demo/noor-ornate-sleeve.jpg", "/demo/noor-ornate-sleeve-detail.jpg"] },
  { ...base, id: "p10", slug: "inaya-rosewood-embroidered", name: "Inaya Rosewood Embroidered", tagline: "Warm, soft, unforgettable", description: "A rosewood abaya with floral appliqué on the bell sleeves. Wide, graceful and full of movement.", price: 13200, compare_at_price: 15000, category_id: "c3", colors: [{name: "Rosewood", hex: "#8a5a4e"}], material: "Crepe · appliqué embroidery", stock: 8, is_featured: false, created_at: "2026-09-19T00:00:00Z", images: ["/demo/inaya-rosewood-embroidered.jpg", "/demo/inaya-rosewood-embroidered-detail.jpg"] },
  { ...base, id: "p11", slug: "sara-slate-swirl", name: "Sara Slate Swirl", tagline: "Soft grey, sculpted detail", description: "A slate-grey abaya with swirling black embroidery on the shoulders and layered chiffon sleeves.", price: 12300, compare_at_price: null, category_id: "c3", colors: [{name: "Slate", hex: "#4a4e55"}], material: "Crepe with chiffon sleeves", stock: 0, is_featured: false, created_at: "2026-09-18T00:00:00Z", images: ["/demo/sara-slate-swirl.jpg", "/demo/sara-slate-swirl-detail.jpg"] },
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
