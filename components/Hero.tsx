"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import AbayaArt from "./AbayaArt";
import Magnetic from "./Magnetic";
import CountUp from "./CountUp";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  lines: string[];
  text: string;
  href: string;
  cta: string;
  price?: string;
  colors: [string, string];
  images: [string | null, string | null];
  big?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const n = slides.length;
  const s = slides[i];

  const go = useCallback((to: number, d?: number) => {
    setDir(d ?? (to > i ? 1 : -1));
    setI((to + n) % n);
  }, [i, n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setTimeout(() => go(i + 1, 1), 6500);
    return () => clearTimeout(t);
  }, [i, paused, n, go]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yA = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // cursor glow
  const mx = useMotionValue(30);
  const my = useMotionValue(30);
  const glow = useTransform([mx, my], ([x, y]) => `radial-gradient(520px circle at ${x}% ${y}%, color-mix(in srgb, var(--gold) 20%, transparent), transparent 60%)`);

  const card = (idx: 0 | 1) => {
    const img = s.images[idx];
    return img ? <Image src={img} alt="" fill sizes="(min-width:768px) 22vw, 50vw" className="object-cover" priority={i === 0} /> : <AbayaArt color={s.colors[idx]} seed={`${s.id}${idx}`} className="h-full w-full" />;
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <motion.div style={{ background: glow }} className="pointer-events-none absolute inset-0 hidden md:block" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-gold/15 blur-3xl" />
      {/* gold dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 16 }, (_, k) => (
          <span key={k} className="dust" style={{ left: `${(k * 37 + 11) % 100}%`, bottom: `${(k * 23) % 40}%`, width: 2 + (k % 3), height: 2 + (k % 3), animationDuration: `${6 + (k % 5) * 1.6}s`, animationDelay: `${(k % 7) * 0.9}s` }} />
        ))}
      </div>

      <div className="container-x relative grid items-center gap-8 py-12 md:grid-cols-[1.05fr_1fr] md:py-20">
        <motion.div style={{ y: yText }} className="min-h-[26rem] md:min-h-[32rem]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={s.id} exit={{ opacity: 0, x: -40 * dir }} transition={{ duration: 0.3 }}>
              <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="eyebrow flex items-center gap-3">
                <motion.span initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 0.8 }} className="block h-px bg-gold" /> {s.eyebrow}
              </motion.p>
              <h1 className={`mt-5 font-display font-medium leading-[0.94] tracking-tight ${s.big ? "text-[clamp(3.4rem,9vw,7.2rem)]" : "text-[clamp(2.8rem,6.6vw,5.6rem)]"}`}>
                {s.lines.map((w, k) => (
                  <span key={w + k} className="block overflow-hidden pb-2">
                    <motion.span className={`block ${k === 1 || (!s.big && k === s.lines.length - 1) ? "italic text-gold" : ""}`} initial={{ y: "110%", rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.9, delay: 0.1 + k * 0.1, ease }}>
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 max-w-md text-base leading-relaxed text-muted">{s.text}</motion.p>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic>
                  <Link href={s.href} className="btn btn-gold group px-8 py-4">
                    {s.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
                {s.price && <span className="font-display text-3xl font-semibold">{s.price}</span>}
                {!s.price && <Link href="/about" className="btn btn-ghost px-7 py-4">Our story</Link>}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* controls */}
          {n > 1 && (
            <div className="mt-10 flex items-center gap-5">
              <div className="flex gap-2">
                <button onClick={() => go(i - 1, -1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><ArrowLeft className="h-4 w-4" /></button>
                <button onClick={() => go(i + 1, 1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><ArrowRight className="h-4 w-4" /></button>
              </div>
              <div className="flex flex-1 max-w-[16rem] gap-2">
                {slides.map((sl, k) => (
                  <button key={sl.id} onClick={() => go(k)} aria-label={`Go to slide ${k + 1}`} className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
                    {k < i && <span className="absolute inset-0 bg-gold" />}
                    {k === i && <motion.span key={`${i}-${paused}`} className="absolute inset-0 origin-left bg-gold" initial={{ scaleX: paused ? 1 : 0 }} animate={{ scaleX: 1 }} transition={{ duration: paused ? 0 : 6.5, ease: "linear" }} />}
                  </button>
                ))}
              </div>
              <span className="font-display text-lg tabular-nums text-muted">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            </div>
          )}

          <dl className="mt-10 flex gap-10 text-sm">
            <div><dt className="font-display text-3xl font-semibold"><CountUp to={500} suffix="+" /></dt><dd className="text-xs text-muted">Happy clients</dd></div>
            <div><dt className="font-display text-3xl font-semibold"><CountUp to={100} suffix="%" /></dt><dd className="text-xs text-muted">Premium fabric</dd></div>
            <div><dt className="font-display text-3xl font-semibold">COD</dt><dd className="text-xs text-muted">Pay on delivery</dd></div>
          </dl>
        </motion.div>

        {/* visuals */}
        <motion.div
          className="relative mx-auto h-[30rem] w-full max-w-md touch-pan-y md:h-[38rem]"
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
          onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1, 1); else if (info.offset.x > 60) go(i - 1, -1); }}
        >
          <AnimatePresence mode="popLayout" custom={dir}>
            <motion.div key={s.id} className="absolute inset-0">
              <motion.div style={{ y: yA }} className="absolute left-0 top-6 z-10 w-[62%]">
                <motion.div initial={{ opacity: 0, x: 80 * dir, rotate: -10 }} animate={{ opacity: 1, x: 0, rotate: -4 }} exit={{ opacity: 0, x: -80 * dir, rotate: -10 }} transition={{ duration: 0.9, ease }} className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
                  {card(0)}
                </motion.div>
              </motion.div>
              <motion.div style={{ y: yB }} className="absolute bottom-0 right-0 w-[58%]">
                <motion.div initial={{ opacity: 0, x: 120 * dir, rotate: 12 }} animate={{ opacity: 1, x: 0, rotate: 5 }} exit={{ opacity: 0, x: -120 * dir, rotate: 12 }} transition={{ duration: 1, delay: 0.1, ease }} className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[var(--shadow)]">
                  {card(1)}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="floaty absolute right-2 top-0 z-20 grid h-28 w-28 place-items-center rounded-full border border-gold/60 bg-bg/70 text-center backdrop-blur">
            <div>
              <div className="font-arabic text-3xl leading-none text-gold">عباية</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em]">Handcrafted</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
