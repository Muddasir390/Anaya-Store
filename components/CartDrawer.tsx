"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "./Providers";
import AbayaArt from "./AbayaArt";
import { money } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

export default function CartDrawer({ settings }: { settings: SiteSettings }) {
  const { open, setOpen, items, subtotal, setQty, remove } = useStore();
  const toFree = Math.max(settings.free_shipping_over - subtotal, 0);
  const progress = Math.min(subtotal / settings.free_shipping_over, 1);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-bg shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-2xl font-semibold">Your Bag</h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full border border-line"><X className="h-[18px] w-[18px]" /></button>
            </div>

            {items.length === 0 ? (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <ShoppingBag className="mx-auto h-12 w-12 text-gold" strokeWidth={1.2} />
                  <p className="mt-4 font-display text-2xl">Your bag is empty</p>
                  <p className="mt-1 text-sm text-muted">Discover something you&apos;ll love.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-ink mt-6">Explore abayas</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-5 py-4 text-xs">
                  {toFree > 0 ? (
                    <p>Add <b className="text-gold">{money(toFree)}</b> more for free shipping</p>
                  ) : (
                    <p className="text-ok">🎉 You&apos;ve unlocked free shipping</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <motion.div className="h-full rounded-full bg-gold" animate={{ width: `${progress * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                  </div>
                </div>
                <ul className="flex-1 space-y-5 overflow-y-auto p-5">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4">
                        <Link href={`/shop/${i.slug}`} onClick={() => setOpen(false)} className="relative h-28 w-22 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2" style={{ width: 88 }}>
                          {i.image ? <Image src={i.image} alt={i.name} fill sizes="88px" className="object-cover" /> : <AbayaArt color={i.color?.hex} seed={i.productId} className="absolute inset-0 h-full w-full" />}
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="font-display text-lg font-semibold leading-tight">{i.name}</p>
                            <button onClick={() => remove(i.key)} aria-label={`Remove ${i.name}`} className="text-muted transition hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="mt-1 text-xs text-muted">
                            {[i.size && `Size ${i.size}`, i.color?.name].filter(Boolean).join(" · ")}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center rounded-full border border-line">
                              <button onClick={() => setQty(i.key, i.quantity - 1)} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center"><Minus className="h-3.5 w-3.5" /></button>
                              <span className="w-6 text-center text-sm font-semibold">{i.quantity}</span>
                              <button onClick={() => setQty(i.key, i.quantity + 1)} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                            <span className="font-semibold">{money(i.price * i.quantity)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="space-y-3 border-t border-line p-5">
                  <div className="flex justify-between text-sm"><span className="text-muted">Subtotal</span><span className="text-lg font-semibold">{money(subtotal)}</span></div>
                  <p className="text-xs text-muted">Shipping calculated at checkout.</p>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-gold w-full">Checkout</Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
