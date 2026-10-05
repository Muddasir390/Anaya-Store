"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteProduct, toggleProductActive } from "@/app/admin/actions";

export default function ProductRowActions({ id, name, active }: { id: string; name: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center justify-end gap-3 text-xs font-semibold">
      <Link href={`/admin/products/${id}`} className="text-gold hover:underline">Edit</Link>
      <button disabled={pending} onClick={() => start(async () => { await toggleProductActive(id, !active); })} className="text-muted hover:text-fg">{active ? "Hide" : "Show"}</button>
      <button disabled={pending} onClick={() => { if (confirm(`Delete "${name}"? This cannot be undone. (Past orders keep their details.)`)) start(async () => { await deleteProduct(id); }); }} className="text-danger hover:underline">Delete</button>
    </div>
  );
}
