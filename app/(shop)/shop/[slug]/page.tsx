import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import { getProduct, getProducts, getSettings, getCategories } from "@/lib/data";
import { CURRENCY } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.description.slice(0, 155),
    openGraph: { title: p.name, description: p.description.slice(0, 155), images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const [product, all, settings, categories] = await Promise.all([getProduct(slug), getProducts(), getSettings(), getCategories()]);
  if (!product) notFound();
  const category = categories.find((c) => c.id === product.category_id);
  const related = all.filter((p) => p.id !== product.id && p.category_id === product.category_id).concat(all.filter((p) => p.id !== product.id && p.category_id !== product.category_id)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: CURRENCY,
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-x pt-8 pb-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted">
        <Link href="/" className="hover:text-fg">Home</Link> / <Link href="/shop" className="hover:text-fg">Shop</Link>
        {category && <> / <Link href={`/shop?category=${category.slug}`} className="hover:text-fg">{category.name}</Link></>} / <span className="text-fg">{product.name}</span>
      </nav>
      <ProductDetail product={product} whatsapp={settings.whatsapp_number} />
      {related.length > 0 && (
        <section className="mt-24">
          <p className="eyebrow">You may also love</p>
          <h2 className="mt-3 font-display text-4xl font-medium">Complete the look</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
