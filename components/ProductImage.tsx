import Image from "next/image";
import AbayaArt from "./AbayaArt";
import type { Product } from "@/lib/types";

export default function ProductImage({
  product,
  index = 0,
  sizes = "(min-width:1024px) 25vw, 50vw",
  priority = false,
  className = "",
}: {
  product: Pick<Product, "images" | "colors" | "id" | "name">;
  index?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const src = product.images[index];
  if (src)
    return (
      <Image src={src} alt={product.name} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
    );
  return (
    <AbayaArt
      color={product.colors[index % Math.max(product.colors.length, 1)]?.hex ?? "#141414"}
      seed={product.id + index}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
