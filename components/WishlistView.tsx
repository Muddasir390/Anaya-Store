"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "./ProductCard";
import { useStore } from "./Providers";
import { useT } from "./Locale";
import type { Product } from "@/lib/types";

export default function WishlistView({ products }: { products: Product[] }) {
  const { wishlist, hydrated } = useStore();
  const { t } = useT();
  if (!hydrated) return <div className="skeleton mt-10 h-72" />;
  const list = products.filter((p) => wishlist.includes(p.id));
  if (!list.length)
    return (
      <div className="py-24 text-center">
        <Heart className="mx-auto h-12 w-12 text-gold" strokeWidth={1.2} />
        <p className="mt-4 font-display text-3xl">{t("wl.emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted">{t("wl.emptyText")}</p>
        <Link href="/shop" className="btn btn-ink mt-6">{t("wl.explore")}</Link>
      </div>
    );
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
      {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}
