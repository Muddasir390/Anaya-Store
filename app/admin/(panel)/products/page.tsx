import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import ProductRowActions from "@/components/admin/ProductRowActions";
import ProductImage from "@/components/ProductImage";
import { normalizeProduct } from "@/lib/data";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export const metadata = { title: "Products" };

export default async function AdminProducts() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  const products = ((data ?? []) as Product[]).map(normalizeProduct);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-semibold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-gold"><Plus className="h-4 w-4" /> Add abaya</Link>
      </div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>{["Product", "Price", "Stock", "Status", ""].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="p-4">
                  <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-gold">
                    <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-surface-2"><ProductImage product={p} sizes="44px" /></span>
                    <span className="font-medium">{p.name}{p.is_featured && <span className="ml-2 text-[10px] text-gold">★ FEATURED</span>}</span>
                  </Link>
                </td>
                <td className="p-4">{money(p.price)}</td>
                <td className={`p-4 ${p.stock === 0 ? "text-danger" : p.stock <= 3 ? "text-gold" : ""}`}>{p.stock}</td>
                <td className="p-4"><span className={`text-xs font-semibold ${p.is_active ? "text-ok" : "text-muted"}`}>{p.is_active ? "Live" : "Hidden"}</span></td>
                <td className="p-4"><ProductRowActions id={p.id} name={p.name} active={p.is_active} /></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-muted">No products yet — add your first abaya.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
