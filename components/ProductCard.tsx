"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Heart } from "lucide-react";
import ProductImage from "./ProductImage";
import { useStore } from "./Providers";
import { discountPct, money } from "@/lib/format";
import { loc } from "@/lib/i18n";
import { useT } from "./Locale";
import type { Product } from "@/lib/types";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { wishlist, toggleWish, hydrated } = useStore();
  const { t, locale } = useT();
  const name = loc(product, "name", locale);
  const tagline = loc(product, "tagline", locale);
  const liked = hydrated && wishlist.includes(product.id);
  const off = discountPct(product.price, product.compare_at_price);
  const soldOut = product.stock <= 0;

  // 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="relative aspect-[3/4] overflow-hidden rounded-[1.4rem] border border-line bg-surface-2"
      >
        <Link href={`/shop/${product.slug}`} className="absolute inset-0" aria-label={name}>
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
            <ProductImage product={product} />
          </div>
          {product.images[1] && (
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <ProductImage product={product} index={1} />
            </div>
          )}
        </Link>
        <div className="pointer-events-none absolute start-3 top-3 flex flex-col gap-1.5">
          {soldOut && <span className="rounded-full bg-fg px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-bg">{t("pc.soldOut")}</span>}
          {!soldOut && off > 0 && <span dir="ltr" className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-gold">−{off}%</span>}
        </div>
        <button
          onClick={() => toggleWish(product.id)}
          aria-label={liked ? t("pc.removeWish") : t("pc.addWish")}
          aria-pressed={liked}
          className="absolute end-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bg/80 backdrop-blur transition hover:scale-110"
        >
          <motion.span key={String(liked)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
            <Heart className={`h-4 w-4 ${liked ? "fill-gold text-gold" : ""}`} />
          </motion.span>
        </button>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-bg/85 py-2 text-center text-xs font-semibold tracking-wide opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {t("pc.view")}
        </div>
      </motion.div>

      <div className="mt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-tight">
            <Link href={`/shop/${product.slug}`} className="link-underline">{name}</Link>
          </h3>
          <div className="shrink-0 text-end text-sm">
            <div className="font-semibold">{money(product.price)}</div>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <div className="text-xs text-muted line-through">{money(product.compare_at_price)}</div>
            )}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted">{tagline}</p>
        {product.colors.length > 0 && (
          <div className="mt-3 flex gap-1.5">
            {product.colors.map((c) => (
              <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-line" style={{ background: c.hex }} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
