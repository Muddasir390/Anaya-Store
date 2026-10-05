"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { saveProduct } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/client";
import type { Category, ColorOption, Product } from "@/lib/types";

export default function ProductForm({ product, categories }: { product?: Product; categories: Category[] }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [colors, setColors] = useState<ColorOption[]>(product?.colors ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadErr("");
    const supabase = createClient();
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) { setUploadErr("Only image files are allowed."); continue; }
      if (f.size > 6 * 1024 * 1024) { setUploadErr(`${f.name} is over 6 MB — please compress it.`); continue; }
      const ext = f.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("products").upload(path, f, { cacheControl: "31536000", contentType: f.type });
      if (error) { setUploadErr(error.message); continue; }
      urls.push(supabase.storage.from("products").getPublicUrl(path).data.publicUrl);
    }
    setImages((prev) => [...prev, ...urls]);
    setUploading(false);
  }

  const move = (i: number, d: -1 | 1) =>
    setImages((p) => { const a = [...p]; const j = i + d; if (j < 0 || j >= a.length) return a; [a[i], a[j]] = [a[j], a[i]]; return a; });

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="colors" value={JSON.stringify(colors.filter((c) => c.name.trim()))} />

      <div className="space-y-6">
        <section className="card space-y-5 p-6">
          <h2 className="font-display text-2xl font-semibold">Details</h2>
          <div><label className="label" htmlFor="name">Name *</label><input id="name" name="name" required defaultValue={product?.name} className="input" /></div>
          <div><label className="label" htmlFor="tagline">Short tagline</label><input id="tagline" name="tagline" defaultValue={product?.tagline} placeholder="The everyday essential" className="input" /></div>
          <div><label className="label" htmlFor="description">Description</label><textarea id="description" name="description" rows={6} defaultValue={product?.description} className="input" /></div>
          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="label" htmlFor="material">Material</label><input id="material" name="material" defaultValue={product?.material} className="input" /></div>
            <div><label className="label" htmlFor="care">Care instructions</label><input id="care" name="care" defaultValue={product?.care} className="input" /></div>
          </div>
        </section>

        <section className="card space-y-5 p-6">
          <div>
            <h2 className="font-display text-2xl font-semibold">Urdu translation <span className="text-sm font-normal text-muted">(optional)</span></h2>
            <p className="mt-1 text-xs text-muted">Shown to customers who switch the site to Urdu. Leave blank to show the English text.</p>
          </div>
          <div><label className="label" htmlFor="name_ur">Name (اردو)</label><input id="name_ur" name="name_ur" dir="rtl" lang="ur" defaultValue={product?.name_ur} className="input text-lg" /></div>
          <div><label className="label" htmlFor="tagline_ur">Tagline (اردو)</label><input id="tagline_ur" name="tagline_ur" dir="rtl" lang="ur" defaultValue={product?.tagline_ur} className="input" /></div>
          <div><label className="label" htmlFor="description_ur">Description (اردو)</label><textarea id="description_ur" name="description_ur" rows={5} dir="rtl" lang="ur" defaultValue={product?.description_ur} className="input" /></div>
          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="label" htmlFor="material_ur">Material (اردو)</label><input id="material_ur" name="material_ur" dir="rtl" lang="ur" defaultValue={product?.material_ur} className="input" /></div>
            <div><label className="label" htmlFor="care_ur">Care (اردو)</label><input id="care_ur" name="care_ur" dir="rtl" lang="ur" defaultValue={product?.care_ur} className="input" /></div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold">Photos</h2>
            <label className="btn btn-ghost cursor-pointer !py-2 text-xs">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />} Upload
              <input type="file" accept="image/*" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
          <p className="mt-1 text-xs text-muted">First photo is the cover. Portrait (3:4) works best.</p>
          {uploadErr && <p role="alert" className="mt-2 text-sm text-danger">{uploadErr}</p>}
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((src, i) => (
              <div key={src} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-line">
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-on-gold">COVER</span>}
                <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 opacity-0 transition group-hover:opacity-100">
                  <button type="button" onClick={() => move(i, -1)} aria-label="Move earlier" className="px-1.5 text-white">←</button>
                  <button type="button" onClick={() => setImages((p) => p.filter((_, j) => j !== i))} aria-label="Remove" className="px-1.5 text-white"><Trash2 className="h-3.5 w-3.5" /></button>
                  <button type="button" onClick={() => move(i, 1)} aria-label="Move later" className="px-1.5 text-white">→</button>
                </div>
              </div>
            ))}
            {images.length === 0 && <p className="col-span-full rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No photos yet — a stylised illustration is shown until you upload.</p>}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="card space-y-5 p-6">
          <h2 className="font-display text-2xl font-semibold">Pricing & stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label" htmlFor="price">Price *</label><input id="price" name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} className="input" /></div>
            <div><label className="label" htmlFor="cap">Compare-at</label><input id="cap" name="compare_at_price" type="number" step="0.01" min="0" defaultValue={product?.compare_at_price ?? ""} placeholder="Original price" className="input" /></div>
          </div>
          <div><label className="label" htmlFor="stock">Stock quantity</label><input id="stock" name="stock" type="number" min="0" step="1" required defaultValue={product?.stock ?? 10} className="input" /></div>
          <div>
            <label className="label" htmlFor="category">Category</label>
            <select id="category" name="category_id" defaultValue={product?.category_id ?? ""} className="input">
              <option value="">— None —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className="label" htmlFor="sizes">Sizes (comma separated)</label><input id="sizes" name="sizes" defaultValue={product?.sizes.join(", ") ?? "52, 54, 56, 58, 60"} className="input" /></div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-semibold">Colours</h2><button type="button" onClick={() => setColors((c) => [...c, { name: "", hex: "#141414" }])} className="btn btn-ghost !py-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Add</button></div>
          <div className="mt-4 space-y-3">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="color" aria-label="Colour" value={c.hex} onChange={(e) => setColors((p) => p.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)))} className="h-10 w-12 cursor-pointer rounded-lg border border-line bg-transparent" />
                <input aria-label="Colour name" placeholder="Name e.g. Jet Black" value={c.name} onChange={(e) => setColors((p) => p.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className="input" />
                <button type="button" onClick={() => setColors((p) => p.filter((_, j) => j !== i))} aria-label="Remove colour" className="text-muted hover:text-danger"><X className="h-4 w-4" /></button>
              </div>
            ))}
            {colors.length === 0 && <p className="text-xs text-muted">No colour options.</p>}
          </div>
        </section>

        <section className="card space-y-3 p-6">
          <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} className="h-4 w-4 accent-[var(--gold)]" /> Visible in the store</label>
          <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} className="h-4 w-4 accent-[var(--gold)]" /> Feature on homepage</label>
        </section>

        {state?.error && <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{state.error}</p>}
        <button disabled={pending || uploading} className="btn btn-gold w-full !py-4">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "Save changes" : "Create product"}</button>
      </div>
    </form>
  );
}
