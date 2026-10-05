"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import AbayaArt from "./AbayaArt";
import Magnetic from "./Magnetic";

const words = ["Modest.", "Modern.", "Yours."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />

      <div className="container-x relative grid items-center gap-10 py-14 md:grid-cols-[1.05fr_1fr] md:py-24">
        <motion.div style={{ y: yText }}>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            New Season Collection
          </motion.p>
          <h1 className="mt-5 font-display text-[clamp(3.4rem,9vw,7.2rem)] font-medium leading-[0.92] tracking-tight">
            {words.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-2">
                <motion.span
                  className={`block ${i === 1 ? "italic text-gold" : ""}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-7 max-w-md text-base leading-relaxed text-muted">
            Abayas cut from breathable, luxurious fabrics and finished by hand. Designed for every day, made for every occasion — delivered to your door.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/shop" className="btn btn-gold group px-8 py-4">
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link href="/about" className="btn btn-ghost px-7 py-4">Our story</Link>
          </motion.div>
          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-12 flex gap-10 text-sm">
            {[["500+", "Happy clients"], ["100%", "Premium fabric"], ["COD", "Pay on delivery"]].map(([a, b]) => (
              <div key={b}>
                <dt className="font-display text-3xl font-semibold">{a}</dt>
                <dd className="text-xs text-muted">{b}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <div className="relative mx-auto h-[30rem] w-full max-w-md md:h-[38rem]">
          <motion.div style={{ y: yA }} initial={{ opacity: 0, scale: 0.9, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -4 }} transition={{ duration: 1, delay: 0.3 }} className="absolute left-0 top-6 z-10 aspect-[3/4] w-[62%] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
            <AbayaArt color="#141414" seed="hero-a" className="h-full w-full" />
          </motion.div>
          <motion.div style={{ y: yB }} initial={{ opacity: 0, scale: 0.9, rotate: 5 }} animate={{ opacity: 1, scale: 1, rotate: 5 }} transition={{ duration: 1, delay: 0.5 }} className="absolute bottom-0 right-0 aspect-[3/4] w-[58%] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
            <AbayaArt color="#0f5c4a" seed="hero-b" className="h-full w-full" />
          </motion.div>
          <div className="floaty absolute right-2 top-0 z-20 grid h-28 w-28 place-items-center rounded-full border border-gold/60 bg-bg/70 text-center backdrop-blur">
            <div>
              <div className="font-arabic text-3xl leading-none text-gold">عباية</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em]">Handcrafted</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
