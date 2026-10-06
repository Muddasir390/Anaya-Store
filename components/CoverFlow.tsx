"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import AbayaArt from "./AbayaArt";
import type { HeroSlide } from "./Hero";

/**
 * 3D cover-flow carousel (CSS 3D transforms only — no WebGL, no extra library).
 * Every card animates just transform + opacity, which the browser composites on the GPU.
 */
export default function CoverFlow({ slides, index, onSelect }: { slides: HeroSlide[]; index: number; onSelect: (i: number) => void }) {
  const n = slides.length;
  const half = Math.floor(n / 2);
  const reduce = useReducedMotion();

  // whole-scene parallax (mouse only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sceneY = useSpring(useTransform(px, [-1, 1], [-6, 6]), { stiffness: 90, damping: 18 });
  const sceneX = useSpring(useTransform(py, [-1, 1], [4, -4]), { stiffness: 90, damping: 18 });

  return (
    <div
      className="relative h-[27rem] w-full select-none sm:h-[32rem] md:h-[38rem]"
      style={{ perspective: "1500px", perspectiveOrigin: "50% 45%" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      {/* mihrab arch frame behind the centre card */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[96%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-t-[999px] border border-gold/35">
        <div className="absolute inset-3 rounded-t-[999px] border border-gold/20" />
      </div>
      <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d", rotateY: reduce ? 0 : sceneY, rotateX: reduce ? 0 : sceneX }}>
        {slides.map((s, k) => {
          let o = (((k - index) % n) + n + half) % n - half; // -half … +half
          if (n % 2 === 0 && o === -half) o = half; // even count: keep symmetrical
          const a = Math.abs(o);
          const center = o === 0;
          const visible = a <= 2;
          const img = s.images[0];
          return (
            <motion.div
              key={s.id}
              className="absolute left-1/2 top-1/2 w-[58%] max-w-[22rem] sm:w-[48%] md:w-[52%]"
              style={{ transformStyle: "preserve-3d", willChange: "transform, opacity", zIndex: 10 - a, pointerEvents: visible ? "auto" : "none" }}
              initial={false}
              animate={{
                x: `${-50 + o * 62}%`,
                y: "-50%",
                z: -a * 160,
                rotateY: -o * 36,
                scale: center ? 1 : 1 - a * 0.1,
                opacity: !visible ? 0 : center ? 1 : Math.max(0.35, 0.85 - a * 0.22),
              }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 20, mass: 0.9 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem] border border-line bg-surface-2 shadow-[var(--shadow)]">
                {center ? (
                  <Link href={s.href} className="absolute inset-0 z-10" aria-label={s.lines.join(" ")} draggable={false} />
                ) : (
                  <button type="button" onClick={() => onSelect(k)} tabIndex={visible ? 0 : -1} aria-label={`Show ${s.lines.join(" ")}`} className="absolute inset-0 z-10 cursor-pointer" />
                )}
                {img ? (
                  <Image src={img} alt={center ? s.lines.join(" ") : ""} fill sizes="(min-width:768px) 360px, 60vw" priority={k === 0} draggable={false} className="object-cover" />
                ) : (
                  <AbayaArt color={s.colors[0]} seed={s.id} className="h-full w-full" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
                {/* depth shading on side cards */}
                {!center && <div className="pointer-events-none absolute inset-0 bg-black/25" />}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-display text-xl font-semibold leading-tight md:text-2xl">{s.caption ?? s.lines.join(" ")}</p>
                  {s.price && <p className="mt-1 text-xs font-medium tracking-wide text-white/80">{s.price}</p>}
                </div>
              </div>
              {/* glossy floor reflection (cheap: one gradient, no blur) */}
              {center && <div aria-hidden className="pointer-events-none absolute -bottom-6 left-[8%] h-6 w-[84%] rounded-[50%] bg-black/40 blur-xl" />}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
