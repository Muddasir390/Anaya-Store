"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Heart, MessageCircle, Minus, Plus, Ruler, ShoppingBag } from "lucide-react";
import ProductImage from "./ProductImage";
import AbayaArt from "./AbayaArt";
import Image from "next/image";
import { useStore } from "./Providers";
import { discountPct, money, whatsappLink } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductDetail({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const { add, wishlist, toggleWish, hydrated, setOpen } = useStore();
  const [size, setSize] = useState<string | null>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>("details");

  const color = product.colors[colorIdx] ?? null;
  const soldOut = product.stock <= 0;
  const off = discountPct(product.price, product.compare_at_price);
  const liked = hydrated && wishlist.includes(product.id);
  const shots = product.images.length ? product.images : [null, null, null];

  function addToBag(buyNow = false) {
    if (product.sizes.length && !size) {
      setError("Please choose a size");
      return;
    }
    setError("");
    add(product, { size, color, quantity: qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    if (buyNow) setOpen(false);
  }

  const askText = `Hello Anaya! I'm interested in "${product.name}" (${money(product.price)}). ${typeof window !== "undefined" ? window.location.href : ""}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Gallery */}
      <div className="grid gap-3 md:grid-cols-[5rem_1fr]">
        <div className="order-2 flex gap-3 md:order-1 md:flex-col">
          {shots.map((s, i) => (
            <button key={i} onClick={() => setShot(i)} aria-label={`View image ${i + 1}`} className={`relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl border transition ${shot === i ? "border-gold ring-2 ring-gold/30" : "border-line opacity-70 hover:opacity-100"}`}>
              {s ? <Image src={s} alt="" fill sizes="80px" className="object-cover" /> : <AbayaArt color={product.colors[i % Math.max(product.colors.length, 1)]?.hex} seed={product.id + i} className="absolute inset-0 h-full w-full" />}
            </button>
          ))}
        </div>
        <div className="relative order-1 aspect-[3/4] overflow-hidden rounded-[1.8rem] border border-line bg-surface-2 md:order-2">
          <AnimatePresence mode="wait">
            <motion.div key={`${shot}-${product.images.length ? "" : colorIdx}`} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {product.images.length ? (
                <ProductImage product={product} index={shot} sizes="(min-width:1024px) 50vw, 100vw" priority />
              ) : (
                <AbayaArt color={color?.hex} seed={product.id + shot} className="h-full w-full" />
              )}
            </motion.div>
          </AnimatePresence>
          {off > 0 && <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-gold">−{off}%</span>}
        </div>
      </div>

      {/* Info */}
      <div className="lg:pt-4">
        <p className="eyebrow">{product.tagline || "Anaya"}</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-[1.02] md:text-6xl">{product.name}</h1>
        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-semibold">{money(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price && <span className="text-lg text-muted line-through">{money(product.compare_at_price)}</span>}
        </div>
        <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

        {product.colors.length > 0 && (
          <div className="mt-8">
            <p className="label">Colour — <span className="text-fg">{color?.name}</span></p>
            <div className="flex gap-3">
              {product.colors.map((c, i) => (
                <button key={c.name} onClick={() => setColorIdx(i)} aria-label={c.name} aria-pressed={i === colorIdx} className={`h-9 w-9 rounded-full border-2 p-0.5 transition ${i === colorIdx ? "border-gold" : "border-transparent hover:border-line"}`}>
                  <span className="block h-full w-full rounded-full border border-line" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {product.sizes.length > 0 && (
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="label">Size</p>
              <Link href="/size-guide" className="flex items-center gap-1 text-xs text-gold link-underline"><Ruler className="h-3.5 w-3.5" /> Size guide</Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => { setSize(s); setError(""); }} aria-pressed={size === s} className={`h-11 min-w-12 rounded-full border px-4 text-sm font-medium transition ${size === s ? "border-gold bg-gold text-on-gold" : "border-line hover:border-gold"}`}>{s}</button>
              ))}
            </div>
            {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-12 w-12 place-items-center"><Minus className="h-4 w-4" /></button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => Math.min(Math.min(10, product.stock || 10), q + 1))} aria-label="Increase" className="grid h-12 w-12 place-items-center"><Plus className="h-4 w-4" /></button>
          </div>
          <button disabled={soldOut} onClick={() => addToBag()} className="btn btn-gold min-w-[12rem] flex-1 !py-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={added ? "ok" : "add"} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="inline-flex items-center gap-2">
                {soldOut ? "Sold out" : added ? <><Check className="h-4 w-4" /> Added to bag</> : <><ShoppingBag className="h-4 w-4" /> Add to bag</>}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={() => toggleWish(product.id)} aria-label={liked ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={liked} className="grid h-[3.2rem] w-[3.2rem] place-items-center rounded-full border border-line transition hover:border-gold">
            <Heart className={`h-5 w-5 ${liked ? "fill-gold text-gold" : ""}`} />
          </button>
        </div>
        {!soldOut && product.stock <= 5 && <p className="mt-3 text-sm text-danger">Only {product.stock} left — selling fast</p>}

        <a href={whatsappLink(whatsapp, askText)} target="_blank" rel="noreferrer" className="btn btn-ghost mt-4 w-full">
          <MessageCircle className="h-4 w-4" /> Ask about this abaya on WhatsApp
        </a>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {[
            { id: "details", t: "Details & fabric", c: product.material ? `${product.material}.` : "Premium fabric, finished by hand." },
            { id: "care", t: "Care", c: product.care || "Gentle wash or dry clean." },
            { id: "ship", t: "Shipping & returns", c: "Delivery in 2–5 working days. Free shipping over the threshold shown at checkout. Size exchanges accepted within 7 days of delivery on unworn items with tags." },
          ].map((a) => (
            <div key={a.id}>
              <button onClick={() => setOpenAcc(openAcc === a.id ? null : a.id)} aria-expanded={openAcc === a.id} className="flex w-full items-center justify-between py-4 text-left font-medium">
                {a.t}
                <ChevronDown className={`h-4 w-4 transition-transform ${openAcc === a.id ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {openAcc === a.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="pb-5 text-sm leading-relaxed text-muted">{a.c}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
