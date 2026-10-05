import type { Metadata } from "next";
import ShopBrowser from "@/components/ShopBrowser";
import { getCategories, getProducts } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.shop"), description: t("shop.desc") };
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const [products, categories, { t }] = await Promise.all([getProducts(), getCategories(), getT()]);
  return (
    <div className="container-x pt-10 pb-8">
      <p className="eyebrow">{t("shop.eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-7xl">{t("shop.title")}</h1>
      <div className="mt-8">
        <ShopBrowser
          products={products}
          categories={categories}
          initialCategory={one(sp.category)}
          initialQuery={one(sp.q)}
          focusSearch={one(sp.focus) === "search"}
        />
      </div>
    </div>
  );
}
