import Link from "next/link";
import { Banknote, Clock, Package, ShoppingBag } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import StatusBadge from "@/components/admin/StatusBadge";
import { dateTime, money } from "@/lib/format";
import type { Order } from "@/lib/types";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [{ data: orders }, { count: products }, { data: low }] = await Promise.all([
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("id,name,stock").lte("stock", 3).eq("is_active", true).order("stock").limit(6),
  ]);
  const all = (orders ?? []) as Order[];
  const live = all.filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((n, o) => n + Number(o.total), 0);
  const pending = all.filter((o) => o.status === "pending").length;
  const stats = [
    { l: "Revenue", v: money(revenue), i: Banknote },
    { l: "Orders", v: String(all.length), i: ShoppingBag },
    { l: "Awaiting confirmation", v: String(pending), i: Clock, hot: pending > 0 },
    { l: "Products", v: String(products ?? 0), i: Package },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-4xl font-semibold">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className={`card p-5 ${s.hot ? "!border-gold" : ""}`}>
            <s.i className="h-5 w-5 text-gold" />
            <p className="mt-4 text-2xl font-semibold">{s.v}</p>
            <p className="text-xs text-muted">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Recent orders</h2><Link href="/admin/orders" className="text-sm text-gold">View all →</Link></div>
          {all.length === 0 ? <p className="py-10 text-center text-sm text-muted">No orders yet.</p> : (
            <ul className="mt-4 divide-y divide-line">
              {all.slice(0, 7).map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-3 py-3 transition hover:text-gold">
                    <div className="min-w-0"><p className="font-medium">{o.order_number} · {o.customer_name}</p><p className="text-xs text-muted">{dateTime(o.created_at)}</p></div>
                    <div className="flex items-center gap-3"><span className="text-sm font-semibold">{money(Number(o.total))}</span><StatusBadge status={o.status} /></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card p-6">
          <h2 className="font-display text-2xl font-semibold">Low stock</h2>
          {(low ?? []).length === 0 ? <p className="py-10 text-center text-sm text-muted">All stocked up 👌</p> : (
            <ul className="mt-4 space-y-3">
              {low!.map((p) => (
                <li key={p.id} className="flex justify-between text-sm"><Link href={`/admin/products/${p.id}`} className="hover:text-gold">{p.name}</Link><span className={p.stock === 0 ? "text-danger" : "text-gold"}>{p.stock === 0 ? "Sold out" : `${p.stock} left`}</span></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
