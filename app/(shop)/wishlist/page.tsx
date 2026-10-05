import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";
import { getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your wishlist" };

export default async function WishlistPage() {
  const products = await getProducts();
  return (
    <div className="container-x py-12">
      <p className="eyebrow">Saved for later</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">Wishlist</h1>
      <WishlistView products={products} />
    </div>
  );
}
