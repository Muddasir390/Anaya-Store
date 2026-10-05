"use client";

import { useState, useTransition } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { saveOrderNotes, updateOrderStatus } from "@/app/admin/actions";
import { storeToCustomerMessage } from "@/lib/order-messages";
import { whatsappLink } from "@/lib/format";
import { ORDER_STATUSES, type Order, type OrderItem, type OrderStatus } from "@/lib/types";

export default function OrderControls({ order, items }: { order: Order; items: OrderItem[]; storeName: string }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const wa = whatsappLink(order.phone, storeToCustomerMessage({ ...order, status }, items));

  function change(s: OrderStatus) {
    const prev = status;
    setStatus(s);
    setMsg("");
    start(async () => {
      const r = await updateOrderStatus(order.id, s);
      if (r.error) { setStatus(prev); setMsg(r.error); } else setMsg("Status updated");
    });
  }

  return (
    <section className="card space-y-5 p-6">
      <h2 className="font-display text-2xl font-semibold">Manage</h2>
      <div>
        <label className="label" htmlFor="status">Order status</label>
        <select id="status" value={status} disabled={pending} onChange={(e) => change(e.target.value as OrderStatus)} className="input capitalize">
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {msg && <p className="mt-2 text-xs text-muted" aria-live="polite">{msg}</p>}
      </div>
      <a href={wa} target="_blank" rel="noreferrer" className="btn btn-wa w-full">
        <MessageCircle className="h-4 w-4" /> Message customer on WhatsApp
      </a>
      <p className="-mt-2 text-xs text-muted">Opens WhatsApp with a ready message reflecting the current status.</p>
      <div>
        <label className="label" htmlFor="notes">Internal notes</label>
        <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
        <button disabled={pending} onClick={() => start(async () => { const r = await saveOrderNotes(order.id, notes); setMsg(r.error ?? "Notes saved"); })} className="btn btn-ghost mt-2 !py-2 text-xs">
          {pending && <Loader2 className="h-3 w-3 animate-spin" />} Save notes
        </button>
      </div>
    </section>
  );
}
