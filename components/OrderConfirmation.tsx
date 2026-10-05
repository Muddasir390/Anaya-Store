"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, MessageCircle } from "lucide-react";
import { customerToStoreMessage } from "@/lib/order-messages";
import { money, whatsappLink } from "@/lib/format";
import { useT } from "./Locale";
import type { Order } from "@/lib/types";

type Snapshot = {
  items: { name: string; quantity: number; size: string | null; color: { name: string } | null; price: number }[];
  total: number;
  name: string;
  address: string;
  city: string;
};

export default function OrderConfirmation({ number, order, whatsapp }: { number: string; order: Order | null; whatsapp: string }) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const { t, locale } = useT();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`anaya.order.${number}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSnap(JSON.parse(raw));
    } catch {}
  }, [number]);

  const lines = order
    ? order.order_items!.map((i) => ({ name: i.name, quantity: i.quantity, size: i.size, color: i.color, price: Number(i.price) }))
    : snap?.items.map((i) => ({ name: i.name, quantity: i.quantity, size: i.size, color: i.color?.name ?? null, price: i.price }));
  const total = order ? Number(order.total) : snap?.total ?? 0;
  const who = order?.customer_name ?? snap?.name ?? "";

  const message = customerToStoreMessage(
    { order_number: number, customer_name: who, total, address: order?.address ?? snap?.address ?? "", city: order?.city ?? snap?.city ?? "" },
    lines ?? [],
    t,
  );

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-xl text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-on-gold">
          <motion.span initial={{ pathLength: 0 }}><Check className="h-10 w-10" strokeWidth={2.5} /></motion.span>
        </motion.div>
        <p className="eyebrow mt-8">{t("oc.thanks")}{who ? `${locale === "ur" ? "،" : ","} ${who.split(" ")[0]}` : ""}</p>
        <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">{t("oc.title")}</h1>
        <p className="mt-4 text-muted">
          {t("oc.text", { n: number })}
        </p>

        <a href={whatsappLink(whatsapp, message)} target="_blank" rel="noreferrer" className="btn btn-wa mt-8 w-full !py-4 text-base sm:w-auto sm:px-10">
          <MessageCircle className="h-5 w-5" /> {t("oc.confirm")}
        </a>

        {lines && (
          <div className="card mt-10 p-6 text-start">
            <ul className="space-y-2 text-sm">
              {lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{l.name} ×{l.quantity}{l.size ? ` · ${t("cart.size", { s: l.size })}` : ""}{l.color ? ` · ${l.color}` : ""}</span>
                  <span className="font-medium">{money(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-semibold"><span>{t("oc.total")}</span><span>{money(total)}</span></div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/track" className="btn btn-ghost">{t("oc.track")}</Link>
          <Link href="/shop" className="btn btn-ink">{t("oc.continue")}</Link>
        </div>
        {number.startsWith("DEMO") && <p className="mt-6 text-xs text-muted">{t("oc.demo")}</p>}
      </div>
    </div>
  );
}
