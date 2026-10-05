import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="group flex items-baseline gap-2" aria-label="Anaya — home">
      <span className="font-display text-3xl font-semibold tracking-wide leading-none">Anaya</span>
      <span className="font-arabic text-lg text-gold leading-none transition-transform duration-500 group-hover:-translate-y-0.5">
        عنايا
      </span>
    </Link>
  );
}
