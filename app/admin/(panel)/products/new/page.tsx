import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import type { Category } from "@/lib/types";

export const metadata = { title: "New product" };

export default async function NewProduct() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-4xl font-semibold">Add abaya</h1>
      <ProductForm categories={(data ?? []) as Category[]} />
    </div>
  );
}
