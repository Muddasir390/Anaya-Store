import Link from "next/link";
import { ArrowRight, Truck, Banknote, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import AbayaArt from "@/components/AbayaArt";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";

const features = [
  { icon: Truck, t: "Fast delivery", d: "Tracked shipping to your door" },
  { icon: Banknote, t: "Cash on delivery", d: "Pay when it arrives" },
  { icon: MessageCircle, t: "WhatsApp concierge", d: "Real people, real help" },
  { icon: RotateCcw, t: "Easy exchanges", d: "Size not right? We'll swap it" },
];

const reviews = [
  { n: "Fatima R.", t: "The fabric is unbelievably soft and the fit is perfect. I've already ordered a second one." },
  { n: "Aisha K.", t: "Ordered Sunday, confirmed on WhatsApp within minutes, arrived in two days. Beautiful packaging too." },
  { n: "Mariam S.", t: "Finally an abaya that looks elegant but is comfortable enough for all-day wear." },
];

export default async function Home() {
  const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const featured = (products.filter((p) => p.is_featured).length ? products.filter((p) => p.is_featured) : products).slice(0, 4);
  const newest = products.slice(0, 8);
  const swatches = ["#141414", "#c9b08a", "#0f5c4a", "#c98a96"];

  return (
    <>
      <Hero />

      {/* Category tiles */}
      <section className="container-x py-16">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Find your signature</h2>
          </div>
          <Link href="/shop" className="link-underline hidden text-sm font-medium md:block">View all →</Link>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-line bg-surface-2">
                <AbayaArt color={swatches[i % swatches.length]} seed={c.slug} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-white/75">{c.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-wide opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    Shop now <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-x py-12">
        <Reveal>
          <p className="eyebrow">Most loved</p>
          <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Featured abayas</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Craft story */}
      <section className="my-16 bg-fg text-bg">
        <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow !text-gold">The Anaya difference</p>
            <h2 className="mt-4 font-display text-4xl font-medium leading-tight md:text-6xl">
              Every stitch, <span className="italic text-gold">considered.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed opacity-75">
              We obsess over drape, weight and finish. Each abaya is cut from premium fabric, lined where it matters and checked by hand before it leaves our studio — so it looks as good on the hundredth wear as the first.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Breathable, all-day comfortable fabrics", "Hand-finished embroidery & trims", "Sizes 52–60, with a detailed fit guide"].map((x) => (
                <li key={x} className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-gold" />{x}</li>
              ))}
            </ul>
            <Link href="/about" className="btn mt-9 border border-bg/30 text-bg hover:border-gold hover:text-gold">Read our story</Link>
          </Reveal>
          <Reveal delay={0.15} className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-bg/15">
            <AbayaArt color="#5e1f33" seed="story" className="h-full w-full" />
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      {newest.length > 4 && (
        <section className="container-x py-12">
          <Reveal className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Just landed</p>
              <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">New arrivals</h2>
            </div>
            <Link href="/shop" className="btn btn-ghost hidden md:inline-flex">Shop all</Link>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {newest.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="container-x py-16">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.07} className="card p-6 text-center transition hover:-translate-y-1 hover:border-gold">
              <f.icon className="mx-auto h-7 w-7 text-gold" strokeWidth={1.4} />
              <h3 className="mt-4 font-display text-xl font-semibold">{f.t}</h3>
              <p className="mt-1 text-xs text-muted">{f.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-x py-12">
        <Reveal className="text-center">
          <p className="eyebrow">Kind words</p>
          <h2 className="mt-3 font-display text-4xl font-medium md:text-5xl">Loved by our clients</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.n} delay={i * 0.1} className="card p-7">
              <div className="text-gold" aria-label="5 stars">★★★★★</div>
              <p className="mt-4 font-display text-xl leading-snug">&ldquo;{r.t}&rdquo;</p>
              <p className="mt-5 text-xs font-semibold tracking-wide text-muted">— {r.n}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="container-x pb-8 pt-12">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-surface-2 p-10 text-center md:p-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <h2 className="relative font-display text-4xl font-medium md:text-5xl">Not sure what suits you?</h2>
          <p className="relative mx-auto mt-4 max-w-md text-muted">Message our stylists on WhatsApp — send us your height and preferences and we&apos;ll recommend the perfect abaya.</p>
          <a href={whatsappLink(settings.whatsapp_number, "Hello Anaya! Could you help me choose an abaya?")} target="_blank" rel="noreferrer" className="btn btn-wa relative mt-8 px-8 py-4">
            <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </Reveal>
      </section>
    </>
  );
}
