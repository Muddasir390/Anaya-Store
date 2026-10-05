"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";

/**
 * Pointer-driven 3D tilt. Updates motion values only (no React re-render) and
 * animates transform alone, so it stays on the GPU. Mouse-only; off for reduced motion.
 */
export default function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 180, damping: 20 });
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900, willChange: "transform" }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
    >
      {children}
    </motion.div>
  );
}
