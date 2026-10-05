"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "./ProductCard";
import { useT } from "./Locale";
import { loc } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";

type Sort = "new" | "price-asc" | "price-desc" | "name";

export default function ShopBrowser({
  products,
  categories,
  initialCategory,
  initialQuery,
  focusSearch,
}: {
  products: Product[];
  categories: Category[];
  initialCategory: string;
  initialQuery: string;
  focusSearch: boolean;
}) {
  const { t, locale } = useT();
  const [cat, setCat] = useState(initialCategory);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("new");
  const [size, setSize] = useState("");
  const [inStock, setInStock] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusSearch) searchRef.current?.focus();
  }, [focusSearch]);

  const allSizes = useMemo(
    () => [...new Set(products.flatMap((p) => p.sizes))].sort((a, b) => Number(a) - Number(b)),
    [products],
  );
  const catId = categories.find((c) => c.slug === cat)?.id;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = products.filter(
      (p) =>
        (!catId || p.category_id === catId) &&
        (!size || p.sizes.includes(size)) &&
        (!inStock || p.stock > 0) &&
        (!needle || `${p.name} ${p.tagline} ${p.description} ${p.material} ${p.name_ur ?? ""} ${p.tagline_ur ?? ""}`.toLowerCase().includes(needle)),
    );
    const sorters: Record<Sort, (a: Product, b: Product) => number> = {
      new: (a, b) => b.created_at.localeCompare(a.created_at),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return out.sort(sorters[sort]);
  }, [products, catId, size, inStock, q, sort]);

  const activeFilters = (size ? 1 : 0) + (inStock ? 1 : 0);

  return (
    <>
      <div className="sticky top-[4.5rem] z-30 -mx-5 border-y border-line bg-bg/85 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[12rem] flex-1 md:max-w-xs">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("shop.search")} aria-label={t("shop.search")} className="input !rounded-full !py-2.5 !ps-10" />
          </div>
          <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
            {[{ slug: "", name: t("shop.all"), name_ur: "" }, ...categories].map((c) => (
              <button key={c.slug} onClick={() => setCat(c.slug)} className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c.slug ? "border-transparent text-on-gold" : "border-line hover:border-gold"}`}>
                {cat === c.slug && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <span className="relative">{c.slug ? loc(c, "name", locale) : c.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setFiltersOpen((v) => !v)} className="btn btn-ghost !px-4 !py-2.5" aria-expanded={filtersOpen}>
            <SlidersHorizontal className="h-4 w-4" /> {t("shop.filters")}{activeFilters ? ` (${activeFilters})` : ""}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t("shop.sort")} className="input !w-auto !rounded-full !py-2.5">
            <option value="new">{t("shop.sortNew")}</option>
            <option value="price-asc">{t("shop.sortAsc")}</option>
            <option value="price-desc">{t("shop.sortDesc")}</option>
            <option value="name">{t("shop.sortName")}</option>
          </select>
        </div>
        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
                <div className="flex items-center gap-2">
                  <span className="label !mb-0">{t("shop.size")}</span>
                  {allSizes.map((s) => (
                    <button key={s} onClick={() => setSize(size === s ? "" : s)} className={`h-9 min-w-9 rounded-full border px-3 text-sm transition ${size === s ? "border-gold bg-gold text-on-gold" : "border-line hover:border-gold"}`}>{s}</button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[var(--gold)]" /> {t("shop.inStock")}
                </label>
                {activeFilters > 0 && (
                  <button onClick={() => { setSize(""); setInStock(false); }} className="flex items-center gap-1 text-sm text-gold"><X className="h-3.5 w-3.5" /> {t("shop.clear")}</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-sm text-muted" aria-live="polite">{list.length === 1 ? t("shop.count1") : t("shop.countN", { n: list.length })}</p>

      {list.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">{t("shop.empty")}</p>
          <p className="mt-2 text-sm text-muted">{t("shop.emptyText")}</p>
          <button className="btn btn-ink mt-6" onClick={() => { setQ(""); setCat(""); setSize(""); setInStock(false); }}>{t("shop.reset")}</button>
        </div>
      ) : (
        <motion.div layout className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </motion.div>
      )}
    </>
  );
}
