"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Wrapper whose child gently follows the cursor. */
export default function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 14 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
