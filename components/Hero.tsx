"use client";

import Link from "next/link";
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import CoverFlow from "./CoverFlow";
import Magnetic from "./Magnetic";
import CountUp from "./CountUp";
import { useT } from "./Locale";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  lines: string[];
  text: string;
  href: string;
  cta: string;
  price?: string;
  caption?: string;
  colors: [string, string];
  images: [string | null, string | null];
  big?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ slides }: { slides: HeroSlide[] }) {
  const ref = useRef<HTMLElement>(null);
  const { t, rtl } = useT();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dir, setDir] = useState(1);
  const n = slides.length;
  const s = slides[i];
  const inView = useInView(ref, { amount: 0.25 });
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const on = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);
  const running = !paused && inView && tabVisible;

  const go = useCallback((to: number, d?: number) => {
    setDir(d ?? (to > i ? 1 : -1));
    setI((to + n) % n);
  }, [i, n]);

  useEffect(() => {
    if (!running || n < 2) return;
    const t = setTimeout(() => go(i + 1, 1), 6500);
    return () => clearTimeout(t);
  }, [i, running, n, go]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yMark = useTransform(scrollYProgress, [0, 1], [0, 160]);

  // cursor glow
  const gx = useSpring(useMotionValue(200), { stiffness: 60, damping: 18 });
  const gy = useSpring(useMotionValue(200), { stiffness: 60, damping: 18 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        gx.set(e.clientX - r.left);
        gy.set(e.clientY - r.top);
      }}
    >
      <motion.div aria-hidden style={{ x: gx, y: gy, willChange: "transform" }} className="pointer-events-none absolute left-0 top-0 hidden h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--gold)_22%,transparent),transparent_65%)] md:block" />
      <div className="pointer-events-none absolute -left-40 top-0 h-[34rem] w-[34rem] rounded-full bg-gold/15 blur-3xl" />
      {/* giant calligraphy watermark — slow parallax */}
      <motion.div aria-hidden style={{ y: yMark }} className="pointer-events-none absolute inset-x-0 top-6 select-none text-center font-arabic text-[16rem] leading-none text-gold opacity-[0.07] md:text-[30rem]">
        عنایہ
      </motion.div>
      {/* gold dust */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden style={{ display: inView ? undefined : "none" }}>
        {Array.from({ length: 12 }, (_, k) => (
          <span key={k} className="dust" style={{ left: `${(k * 37 + 11) % 100}%`, bottom: `${(k * 23) % 40}%`, width: 2 + (k % 3), height: 2 + (k % 3), animationDuration: `${6 + (k % 5) * 1.6}s`, animationDelay: `${(k % 7) * 0.9}s` }} />
        ))}
      </div>

      <div className="container-x relative grid items-center gap-8 py-12 md:grid-cols-[1.05fr_1fr] md:py-20">
        <motion.div style={{ y: yText }} className="min-h-[26rem] md:min-h-[32rem]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div key={s.id} exit={{ opacity: 0, x: -40 * dir * (rtl ? -1 : 1) }} transition={{ duration: 0.3 }}>
              <motion.p initial={{ opacity: 0, x: rtl ? 16 : -16 }} animate={{ opacity: 1, x: 0 }} className="eyebrow flex items-center gap-3">
                <motion.span initial={{ width: 0 }} animate={{ width: 40 }} transition={{ duration: 0.8 }} className="block h-px bg-gold" /> {s.eyebrow}
              </motion.p>
              <h1 className={`mt-5 font-display font-medium leading-[0.94] tracking-tight ${rtl ? (s.big ? "text-[clamp(2.6rem,6.4vw,4.8rem)]" : "text-[clamp(2.2rem,5vw,3.8rem)]") : s.big ? "text-[clamp(3.4rem,9vw,7.2rem)]" : "text-[clamp(2.8rem,6.6vw,5.6rem)]"}`}>
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
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                  </Link>
                </Magnetic>
                {s.price && <span className="font-display text-3xl font-semibold">{s.price}</span>}
                {!s.price && <Link href="/about" className="btn btn-ghost px-7 py-4">{t("hero.story")}</Link>}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* controls */}
          {n > 1 && (
            <div className="mt-10 flex items-center gap-5">
              <div className="flex gap-2">
                <button onClick={() => go(i - 1, -1)} aria-label={t("a.prev")} className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><ArrowLeft className="h-4 w-4 rtl:-scale-x-100" /></button>
                <button onClick={() => go(i + 1, 1)} aria-label={t("a.next")} className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><ArrowRight className="h-4 w-4 rtl:-scale-x-100" /></button>
              </div>
              <div className="flex flex-1 max-w-[16rem] gap-2">
                {slides.map((sl, k) => (
                  <button key={sl.id} onClick={() => go(k)} aria-label={t("a.goto", { n: k + 1 })} className="relative h-1 flex-1 overflow-hidden rounded-full bg-line">
                    {k < i && <span className="absolute inset-0 bg-gold" />}
                    {k === i && <motion.span key={`${i}-${running}`} className="absolute inset-0 origin-left rtl:origin-right bg-gold" initial={{ scaleX: running ? 0 : 1 }} animate={{ scaleX: 1 }} transition={{ duration: running ? 6.5 : 0, ease: "linear" }} />}
                  </button>
                ))}
              </div>
              <span dir="ltr" className="font-display text-lg tabular-nums text-muted">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
            </div>
          )}

          <dl className="mt-10 flex gap-10 text-sm">
            <div><dt dir="ltr" className="font-display text-3xl font-semibold"><CountUp to={500} suffix="+" /></dt><dd className="text-xs text-muted">{t("hero.clients")}</dd></div>
            <div><dt className="font-display text-3xl font-semibold"><CountUp to={100} suffix="%" /></dt><dd className="text-xs text-muted">{t("hero.fabric")}</dd></div>
            <div><dt className="font-display text-3xl font-semibold">{t("hero.cod")}</dt><dd className="text-xs text-muted">{t("hero.codText")}</dd></div>
          </dl>
        </motion.div>

        {/* 3D cover-flow */}
        <motion.div
          className="relative touch-pan-y"
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} dragSnapToOrigin
          onDragEnd={(_, info) => { if (info.offset.x < -50) go(i + 1, 1); else if (info.offset.x > 50) go(i - 1, -1); }}
        >
          <CoverFlow slides={slides} index={i} onSelect={(k) => go(k)} />
          <div className="floaty pointer-events-none absolute -top-4 end-0 z-20 grid h-28 w-28 place-items-center rounded-full bg-bg/70 backdrop-blur md:h-32 md:w-32">
            <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
              <defs><path id="ring" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
              <circle cx="60" cy="60" r="58" fill="none" stroke="var(--gold)" strokeOpacity="0.55" />
              <text fill="var(--fg)" fontSize="9.6" fontWeight="700" letterSpacing="3.2" style={{ textTransform: "uppercase" }}>
                <textPath href="#ring">{"Handcrafted ✦ Modest ✦ Modern ✦ "}</textPath>
              </text>
            </svg>
            <div className="font-arabic text-3xl leading-none text-gold md:text-4xl">عباية</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
