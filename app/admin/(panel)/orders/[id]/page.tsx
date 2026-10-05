import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/data";
import OrderControls from "@/components/admin/OrderControls";
import AbayaArt from "@/components/AbayaArt";
import { dateTime, money } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Order" };

export default async function OrderDetail({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data }, settings] = await Promise.all([
    supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle(),
    getSettings(),
  ]);
  if (!data) notFound();
  const o = data as Order;
  const items = o.order_items ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg"><ArrowLeft className="h-4 w-4" /> All orders</Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="font-display text-4xl font-semibold">{o.order_number}</h1><p className="text-sm text-muted">Placed {dateTime(o.created_at)}</p></div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="font-display text-2xl font-semibold">Items</h2>
            <ul className="mt-4 divide-y divide-line">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2">
                    {i.image ? <Image src={i.image} alt="" fill sizes="64px" className="object-cover" /> : <AbayaArt seed={i.name} className="absolute inset-0 h-full w-full" />}
                  </div>
                  <div className="flex-1"><p className="font-medium">{i.name}</p><p className="text-xs text-muted">{[i.size && `Size ${i.size}`, i.color, `Qty ${i.quantity}`].filter(Boolean).join(" · ")}</p></div>
                  <div className="text-sm font-semibold">{money(Number(i.price) * i.quantity)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-2 space-y-1 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span>{money(Number(o.subtotal))}</span></div>
              <div className="flex justify-between text-muted"><span>Shipping</span><span>{Number(o.shipping) ? money(Number(o.shipping)) : "Free"}</span></div>
              <div className="flex justify-between pt-2 text-lg font-semibold"><span>Total · {o.payment_method === "cod" ? "COD" : o.payment_method}</span><span>{money(Number(o.total))}</span></div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6 text-sm">
            <h2 className="font-display text-2xl font-semibold">Customer</h2>
            <dl className="mt-4 space-y-3">
              <div><dt className="text-xs text-muted">Name</dt><dd className="font-medium">{o.customer_name}</dd></div>
              <div><dt className="text-xs text-muted">Language</dt><dd className="font-medium">{o.lang === "ur" ? "اردو (Urdu)" : "English"}</dd></div>
              <div><dt className="text-xs text-muted">Phone / WhatsApp</dt><dd className="font-medium">{o.phone}</dd></div>
              {o.email && <div><dt className="text-xs text-muted">Email</dt><dd className="font-medium break-all">{o.email}</dd></div>}
              <div><dt className="text-xs text-muted">Address</dt><dd className="font-medium whitespace-pre-line">{o.address}, {o.city}</dd></div>
              {o.notes && <div><dt className="text-xs text-muted">Customer notes</dt><dd className="whitespace-pre-line">{o.notes}</dd></div>}
            </dl>
          </section>
          <OrderControls order={o} items={items} storeName={settings.store_name} />
        </div>
      </div>
    </div>
  );
}
