import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-arabic text-7xl text-gold">٤٠٤</p>
        <h1 className="mt-4 font-display text-5xl">This page has wandered off</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href="/shop" className="btn btn-ink mt-8">Back to the shop</Link>
      </div>
    </div>
  );
}
