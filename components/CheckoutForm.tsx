"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Banknote, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import { useStore } from "./Providers";
import AbayaArt from "./AbayaArt";
import Image from "next/image";
import { placeOrder } from "@/app/(shop)/checkout/actions";
import { money } from "@/lib/format";
import { useT } from "./Locale";
import type { SiteSettings } from "@/lib/types";

export default function CheckoutForm({ settings }: { settings: SiteSettings }) {
  const { items, subtotal, clear, hydrated } = useStore();
  const { t, locale } = useT();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string>>({});

  const shipping = subtotal >= settings.free_shipping_over || subtotal === 0 ? 0 : settings.shipping_fee;
  const total = subtotal + shipping;

  if (!hydrated) return <div className="skeleton mt-10 h-96" />;
  if (items.length === 0)
    return (
      <div className="py-24 text-center">
        <p className="font-display text-4xl">{t("co.empty")}</p>
        <Link href="/shop" className="btn btn-ink mt-6">{t("co.browse")}</Link>
      </div>
    );

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFields({});
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "");
    start(async () => {
      const res = await placeOrder({
        name: v("name"),
        phone: v("phone"),
        email: v("email"),
        address: v("address"),
        city: v("city"),
        notes: v("notes"),
        website: v("website"),
        payment_method: "cod",
        items: items.map((i) => ({ productId: i.productId, name: i.name, size: i.size, color: i.color?.name ?? null, quantity: i.quantity })),
      });
      if (!res.ok) {
        setError(res.error);
        setFields(res.fieldErrors ?? {});
        return;
      }
      // Hand the cart summary to the confirmation page (it builds the WhatsApp message from it).
      try {
        sessionStorage.setItem(
          `anaya.order.${res.orderNumber}`,
          JSON.stringify({ items, subtotal, shipping, total, name: v("name"), phone: v("phone"), address: v("address"), city: v("city") }),
        );
      } catch {}
      clear();
      router.push(`/order/${res.orderNumber}?t=${res.token}`);
    });
  }

  const err = (k: string) => fields[k] && <p role="alert" className="mt-1 text-xs text-danger">{fields[k]}</p>;

  return (
    <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-8">
        <section className="card space-y-5 p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold">{t("co.delivery")}</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="label" htmlFor="name">{t("co.name")}</label><input id="name" name="name" required autoComplete="name" className="input" />{err("name")}</div>
            <div><label className="label" htmlFor="phone">{t("co.phone")}</label><input id="phone" name="phone" required type="tel" dir="ltr" autoComplete="tel" placeholder="+92 300 0000000" className="input rtl:text-right" />{err("phone")}</div>
          </div>
          <div><label className="label" htmlFor="email">{t("co.email")}</label><input id="email" name="email" type="email" dir="ltr" autoComplete="email" className="input rtl:text-right" />{err("email")}</div>
          <div><label className="label" htmlFor="address">{t("co.address")}</label><textarea id="address" name="address" required rows={3} autoComplete="street-address" className="input" />{err("address")}</div>
          <div><label className="label" htmlFor="city">{t("co.city")}</label><input id="city" name="city" required autoComplete="address-level2" className="input" />{err("city")}</div>
          <div><label className="label" htmlFor="notes">{t("co.notes")}</label><textarea id="notes" name="notes" rows={2} placeholder={t("co.notesPh")} className="input" /></div>
          {/* honeypot */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -start-[9999px] h-0 w-0 opacity-0" />
        </section>

        <section className="card p-6 md:p-8">
          <h2 className="font-display text-2xl font-semibold">{t("co.payment")}</h2>
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gold bg-gold-soft/40 p-4">
            <Banknote className="h-6 w-6 text-gold" />
            <div>
              <p className="font-semibold">{t("co.cod")}</p>
              <p className="text-xs text-muted">{t("co.codText")}</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="card h-fit space-y-5 p-6 md:p-8 lg:sticky lg:top-28">
        <h2 className="font-display text-2xl font-semibold">{t("co.summary")}</h2>
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                {i.image ? <Image src={i.image} alt="" fill sizes="64px" className="object-cover" /> : <AbayaArt color={i.color?.hex} seed={i.productId} className="absolute inset-0 h-full w-full" />}
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-display text-lg font-semibold leading-tight">{locale === "ur" && i.nameUr ? i.nameUr : i.name}</p>
                <p className="text-xs text-muted">{[i.size && t("cart.size", { s: i.size }), i.color?.name, t("cart.qty", { n: i.quantity })].filter(Boolean).join(" · ")}</p>
              </div>
              <span className="text-sm font-semibold">{money(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted">{t("co.subtotal")}</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted">{t("co.shipping")}</span><span>{shipping === 0 ? t("co.free") : money(shipping)}</span></div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>{t("co.total")}</span><span>{money(total)}</span></div>
        </div>
        {error && <p role="alert" className="rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{error}</p>}
        <button disabled={pending} className="btn btn-gold w-full !py-4">
          {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> {t("co.placing")}</> : t("co.place")}
        </button>
        <p className="flex items-start gap-2 text-xs text-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {t("co.privacy")}</p>
        <p className="flex items-start gap-2 text-xs text-muted"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#1fa855]" /> {t("co.waNote")}</p>
      </aside>
    </form>
  );
}
