import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import StatusBadge from "@/components/admin/StatusBadge";
import { dateTime, money } from "@/lib/format";
import { ORDER_STATUSES, type Order } from "@/lib/types";

export const metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const status = Array.isArray(sp.status) ? sp.status[0] : sp.status;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim();
  const { supabase } = await requireAdmin();

  let query = supabase.from("orders").select("*, order_items(quantity)").order("created_at", { ascending: false }).limit(200);
  if (status && (ORDER_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  if (q) {
    const safe = q.replace(/[%,()]/g, "");
    query = query.or(`order_number.ilike.%${safe}%,customer_name.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }
  const { data } = await query;
  const orders = (data ?? []) as (Order & { order_items: { quantity: number }[] })[];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-4xl font-semibold">Orders</h1>
      <form className="mt-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search order #, name or phone…" className="input !w-72 !rounded-full" />
        <select name="status" defaultValue={status ?? ""} className="input !w-auto !rounded-full">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <button className="btn btn-ink !py-2.5">Filter</button>
      </form>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>{["Order", "Customer", "City", "Items", "Total", "Status", "Placed"].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0 transition hover:bg-surface-2/60">
                <td className="p-4 font-semibold"><Link href={`/admin/orders/${o.id}`} className="text-gold hover:underline">{o.order_number}</Link></td>
                <td className="p-4">{o.customer_name}<div className="text-xs text-muted">{o.phone}</div></td>
                <td className="p-4">{o.city}</td>
                <td className="p-4">{o.order_items.reduce((n, i) => n + i.quantity, 0)}</td>
                <td className="p-4 font-medium">{money(Number(o.total))}</td>
                <td className="p-4"><StatusBadge status={o.status} /></td>
                <td className="p-4 text-xs text-muted">{dateTime(o.created_at)}</td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={7} className="p-12 text-center text-muted">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
