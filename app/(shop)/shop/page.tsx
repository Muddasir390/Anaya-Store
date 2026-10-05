import type { Metadata } from "next";
import ShopBrowser from "@/components/ShopBrowser";
import { getCategories, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Shop Abayas",
  description: "Browse all Anaya abayas — everyday, occasion, embroidered and open-front designs.",
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <div className="container-x pt-10 pb-8">
      <p className="eyebrow">The collection</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-7xl">All abayas</h1>
      <div className="mt-8">
        <ShopBrowser
          products={products}
          categories={categories}
          initialCategory={one(sp.category)}
          initialQuery={one(sp.q)}
          focusSearch={one(sp.focus) === "search"}
        />
      </div>
    </div>
  );
}
