"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { trackOrder, type TrackResult } from "@/app/(shop)/track/actions";
import { dateTime, money } from "@/lib/format";

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"] as const;

export default function TrackForm() {
  const [res, action, pending] = useActionState<TrackResult | null, FormData>(trackOrder, null);
  const idx = res?.ok ? STEPS.indexOf(res.status as (typeof STEPS)[number]) : -1;

  return (
    <>
      <form action={action} className="card mt-8 space-y-5 p-6 md:p-8">
        <div><label className="label" htmlFor="number">Order number</label><input id="number" name="number" required placeholder="AN-1001" className="input" /></div>
        <div><label className="label" htmlFor="phone">Phone number used at checkout</label><input id="phone" name="phone" required type="tel" className="input" /></div>
        <button disabled={pending} className="btn btn-gold w-full">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track order"}</button>
        {res && !res.ok && <p role="alert" className="text-sm text-danger">{res.error}</p>}
      </form>

      {res?.ok && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card mt-6 p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">{res.number}</h2>
            {res.total > 0 && <span className="font-semibold">{money(res.total)}</span>}
          </div>
          {res.total > 0 && <p className="text-xs text-muted">Placed {dateTime(res.createdAt)}</p>}
          {res.status === "cancelled" ? (
            <p className="mt-6 rounded-xl bg-danger/10 p-4 text-sm text-danger">This order was cancelled.</p>
          ) : (
            <ol className="mt-8 space-y-0">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }} className={`grid h-8 w-8 place-items-center rounded-full border text-xs ${i <= idx ? "border-gold bg-gold text-on-gold" : "border-line text-muted"}`}>
                      {i <= idx ? <Check className="h-4 w-4" /> : i + 1}
                    </motion.span>
                    {i < STEPS.length - 1 && <span className={`h-8 w-px ${i < idx ? "bg-gold" : "bg-line"}`} />}
                  </div>
                  <p className={`pt-1 text-sm font-medium capitalize ${i <= idx ? "" : "text-muted"}`}>{s}</p>
                </li>
              ))}
            </ol>
          )}
          <ul className="mt-6 space-y-1 border-t border-line pt-4 text-sm text-muted">
            {res.items.map((it, i) => <li key={i}>{it.name} ×{it.quantity}{it.size ? ` · Size ${it.size}` : ""}</li>)}
          </ul>
        </motion.div>
      )}
    </>
  );
}
