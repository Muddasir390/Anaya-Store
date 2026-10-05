"use client";

import { useActionState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { deleteCategory, saveCategory } from "@/app/admin/actions";
import type { Category } from "@/lib/types";

function CatForm({ c }: { c?: Category }) {
  const [state, action, pending] = useActionState(saveCategory, null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-[1fr_1.5fr_5rem_auto]">
      {c && <input type="hidden" name="id" value={c.id} />}
      <input name="name" required placeholder="Name" aria-label="Name" defaultValue={c?.name} className="input" />
      <input name="description" placeholder="Short description" aria-label="Description" defaultValue={c?.description} className="input" />
      <input name="sort_order" type="number" aria-label="Order" defaultValue={c?.sort_order ?? 0} className="input" />
      <input name="name_ur" dir="rtl" lang="ur" placeholder="نام (اردو)" aria-label="Name (Urdu)" defaultValue={c?.name_ur} className="input sm:col-span-2" />
      <input name="description_ur" dir="rtl" lang="ur" placeholder="مختصر تفصیل (اردو)" aria-label="Description (Urdu)" defaultValue={c?.description_ur} className="input sm:col-span-2" />
      <button disabled={pending} className="btn btn-ink !py-2.5 text-xs sm:col-span-4">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : c ? "Save" : "Add"}</button>
      {state?.error && <p role="alert" className="text-sm text-danger sm:col-span-4">{state.error}</p>}
    </form>
  );
}

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const [pending, start] = useTransition();
  return (
    <div className="mt-8 space-y-4">
      <div className="card p-6"><h2 className="mb-4 font-display text-2xl font-semibold">Add category</h2><CatForm /></div>
      {categories.map((c) => (
        <div key={c.id} className="card p-6">
          <CatForm c={c} />
          <button disabled={pending} onClick={() => { if (confirm(`Delete "${c.name}"? Products in it become uncategorised.`)) start(async () => { await deleteCategory(c.id); }); }} className="mt-3 text-xs font-semibold text-danger hover:underline">Delete</button>
        </div>
      ))}
    </div>
  );
}
