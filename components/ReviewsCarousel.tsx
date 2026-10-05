"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useT } from "./Locale";

export default function ReviewsCarousel() {
  const { t } = useT();
  const COUNT = 4;
  const reviews = [1, 2, 3, 4].map((k) => ({ n: t(`home.r${k}n` as never), c: t(`home.r${k}c` as never), t: t(`home.r${k}` as never) }));
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % COUNT), 5500);
    return () => clearInterval(t);
  }, [paused]);
  const r = reviews[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative mx-auto max-w-3xl text-center">
      <span className="font-display text-[8rem] leading-none text-gold/25 select-none" aria-hidden>“</span>
      <div className="-mt-16 min-h-[11rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure key={i} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -18, filter: "blur(6px)" }} transition={{ duration: 0.5 }}>
            <div className="text-gold" aria-label={t("a.stars")}>★★★★★</div>
            <blockquote className="mt-4 font-display text-2xl leading-snug md:text-4xl">{r.t}</blockquote>
            <figcaption className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{r.n} · {r.c}</figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {reviews.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={t("a.review", { n: k + 1 })} className="relative h-1.5 overflow-hidden rounded-full bg-line transition-all" style={{ width: k === i ? 40 : 12 }}>
            {k === i && !paused && <motion.span className="absolute inset-0 origin-left rtl:origin-right bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.5, ease: "linear" }} />}
            {k === i && paused && <span className="absolute inset-0 bg-gold" />}
          </button>
        ))}
      </div>
    </div>
  );
}
