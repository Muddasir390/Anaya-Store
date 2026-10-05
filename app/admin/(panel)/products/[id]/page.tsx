import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeProduct } from "@/lib/data";
import type { Category, Product } from "@/lib/types";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: p }, { data: cats }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
  ]);
  if (!p) notFound();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-4xl font-semibold">Edit abaya</h1>
      <ProductForm product={normalizeProduct(p as Product)} categories={(cats ?? []) as Category[]} />
    </div>
  );
}
