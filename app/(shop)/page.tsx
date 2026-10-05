import Link from "next/link";
import { ArrowRight, Truck, Banknote, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import Hero, { type HeroSlide } from "@/components/Hero";
import Rail from "@/components/Rail";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import { SectionHead } from "@/components/WordReveal";
import { money } from "@/lib/format";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import AbayaArt from "@/components/AbayaArt";
import Image from "next/image";
import Tilt from "@/components/Tilt";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";

const features = [
  { icon: Truck, t: "Fast delivery", d: "Tracked shipping to your door" },
  { icon: Banknote, t: "Cash on delivery", d: "Pay when it arrives" },
  { icon: MessageCircle, t: "WhatsApp concierge", d: "Real people, real help" },
  { icon: RotateCcw, t: "Easy exchanges", d: "Size not right? We'll swap it" },
];

export default async function Home() {
  const [products, categories, settings] = await Promise.all([getProducts(), getCategories(), getSettings()]);
  const featured = (products.filter((p) => p.is_featured).length ? products.filter((p) => p.is_featured) : products).slice(0, 4);
  const newest = products.slice(0, 8);
  const swatches = ["#141414", "#c9b08a", "#0f5c4a", "#c98a96"];

  const lineSplit = (name: string) => {
    const w = name.split(" ");
    if (w.length <= 3) return w;
    const mid = Math.ceil(w.length / 2);
    return [w.slice(0, mid).join(" "), w.slice(mid).join(" ")];
  };
  const lookbook = [
    { id: "lb-desert", img: "/demo/lookbook-desert.jpg", name: "Desert Dusk", tag: "The new season edit", text: "Flowing silhouettes in sand, black and ivory — styled for long golden evenings." },
    { id: "lb-villa", img: "/demo/lookbook-villa.jpg", name: "Villa Mornings", tag: "Everyday elegance", text: "Soft mauves and quiet embroidery for slow mornings and effortless days." },
    { id: "lb-studio", img: "/demo/lookbook-studio.jpg", name: "Studio Prints", tag: "Statement pieces", text: "Bold prints and layered textures made to be noticed." },
  ];
  const withPhotos = featured.filter((p) => p.images[0]).slice(0, 5);
  const slides: HeroSlide[] = [
    { id: "brand", eyebrow: "New Season Collection", lines: ["Modest.", "Modern.", "Yours."], big: true, text: "Abayas cut from breathable, luxurious fabrics and finished by hand. Designed for every day, made for every occasion — delivered to your door.", href: "/shop", cta: "Shop the collection", caption: "The New Season Edit", colors: ["#141414", "#0f5c4a"], images: [lookbook[0].img, null] },
    ...(withPhotos.length >= 2 ? withPhotos : featured.slice(0, 4)).map((p, k): HeroSlide => ({
      id: p.id,
      eyebrow: p.tagline || "Featured",
      lines: lineSplit(p.name),
      text: p.description.length > 150 ? p.description.slice(0, 147) + "…" : p.description,
      href: `/shop/${p.slug}`,
      cta: "View this abaya",
      price: money(p.price),
      caption: p.name,
      colors: [p.colors[0]?.hex ?? swatches[k % 4], p.colors[1]?.hex ?? swatches[(k + 1) % 4]],
      images: [p.images[0] ?? null, p.images[1] ?? null],
    })),
    ...(featured.length < 2 ? lookbook.slice(1).map((l): HeroSlide => ({ id: l.id, eyebrow: l.tag, lines: l.name.split(" "), text: l.text, href: "/shop", cta: "Explore the collection", caption: l.name, colors: ["#141414", "#c9b08a"], images: [l.img, null] })) : []),
  ];


  return (
    <>
      <Hero slides={slides} />

      {/* Category tiles */}
      <section className="container-x py-16">
        <SectionHead eyebrow="Collections" title="Find your signature" italicLast action={<Link href="/shop" className="link-underline hidden text-sm font-medium md:block">View all →</Link>} />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.08}>
              <Tilt max={6}>
                <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.6rem] border border-line bg-surface-2">
                  {(() => { const cover = products.find((p) => p.category_id === c.id && p.images[0])?.images[0] ?? c.image_url; return cover ? <Image src={cover} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" /> : <AbayaArt color={swatches[i % swatches.length]} seed={c.slug} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110" />; })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <h3 className="font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-white/75">{c.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold tracking-wide opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      Shop now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && <section className="container-x py-12">
        <SectionHead eyebrow="Most loved" title="Featured abayas" italicLast />
        <div className="mt-10"><Rail>{featured.map((p, i) => <div key={p.id} className="w-[64%] shrink-0 sm:w-[40%] lg:w-[calc(25%-1.15rem)]"><ProductCard product={p} index={i} /></div>)}</Rail></div>
      </section>}

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
          <Reveal delay={0.15} className="relative mx-auto w-full max-w-sm">
            <Tilt max={5}><div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-bg/15"><Image src="/demo/lookbook-villa.jpg" alt="Woman wearing an Anaya abaya outside a white villa" fill sizes="(min-width:768px) 24rem, 90vw" className="object-cover" /></div></Tilt>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      {newest.length > 4 && (
        <section className="container-x py-12">
          <SectionHead eyebrow="Just landed" title="New arrivals" action={<Link href="/shop" className="btn btn-ghost hidden md:inline-flex">Shop all</Link>} />
          <div className="mt-10"><Rail>{newest.map((p, i) => <div key={p.id} className="w-[64%] shrink-0 sm:w-[40%] lg:w-[calc(25%-1.15rem)]"><ProductCard product={p} index={i} /></div>)}</Rail></div>
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
        <SectionHead eyebrow="Kind words" title="Loved by our clients" italicLast center />
        <div className="mt-10"><ReviewsCarousel /></div>
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
