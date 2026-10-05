import { requireAdmin } from "@/lib/admin-auth";
import CategoryManager from "@/components/admin/CategoryManager";
import type { Category } from "@/lib/types";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-semibold">Categories</h1>
      <CategoryManager categories={(data ?? []) as Category[]} />
    </div>
  );
}
