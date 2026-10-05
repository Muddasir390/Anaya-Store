"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const reviews = [
  { n: "Fatima R.", c: "Lahore", t: "The fabric is unbelievably soft and the fit is perfect. I've already ordered a second one." },
  { n: "Aisha K.", c: "Karachi", t: "Ordered Sunday, confirmed on WhatsApp within minutes, arrived in two days. Beautiful packaging too." },
  { n: "Mariam S.", c: "Islamabad", t: "Finally an abaya that looks elegant but is comfortable enough for all-day wear." },
  { n: "Hira T.", c: "Faisalabad", t: "The embroidery is so delicate. I got compliments the moment I wore it to Eid." },
];

export default function ReviewsCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 5500);
    return () => clearInterval(t);
  }, [paused]);
  const r = reviews[i];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative mx-auto max-w-3xl text-center">
      <span className="font-display text-[8rem] leading-none text-gold/25 select-none" aria-hidden>“</span>
      <div className="-mt-16 min-h-[11rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.figure key={i} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -18, filter: "blur(6px)" }} transition={{ duration: 0.5 }}>
            <div className="text-gold" aria-label="5 stars">★★★★★</div>
            <blockquote className="mt-4 font-display text-2xl leading-snug md:text-4xl">{r.t}</blockquote>
            <figcaption className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{r.n} · {r.c}</figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-center gap-2">
        {reviews.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Review ${k + 1}`} className="relative h-1.5 overflow-hidden rounded-full bg-line transition-all" style={{ width: k === i ? 40 : 12 }}>
            {k === i && !paused && <motion.span className="absolute inset-0 origin-left bg-gold" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 5.5, ease: "linear" }} />}
            {k === i && paused && <span className="absolute inset-0 bg-gold" />}
          </button>
        ))}
      </div>
    </div>
  );
}
