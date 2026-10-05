import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["", "/shop", "/about", "/contact", "/size-guide", "/faq", "/policies", "/track"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const })),
    ...products.map((p) => ({ url: `${SITE_URL}/shop/${p.slug}`, lastModified: p.created_at })),
  ];
}
