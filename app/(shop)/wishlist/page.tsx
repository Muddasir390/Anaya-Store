import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";
import { getProducts } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.wishlist") };
}

export default async function WishlistPage() {
  const [products, { t }] = await Promise.all([getProducts(), getT()]);
  return (
    <div className="container-x py-12">
      <p className="eyebrow">{t("wl.eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">{t("wl.title")}</h1>
      <WishlistView products={products} />
    </div>
  );
}
