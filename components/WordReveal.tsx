"use client";

import { motion } from "motion/react";

/** Heading whose words rise into view one after another. */
export function WordReveal({ text, className = "", italicLast = false }: { text: string; className?: string; italicLast?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className={`inline-block ${italicLast && i === words.length - 1 ? "italic text-gold" : ""}`}
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

export function SectionHead({ eyebrow, title, italicLast, action, center }: { eyebrow: string; title: string; italicLast?: boolean; action?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-end gap-6 ${center ? "justify-center text-center" : "justify-between"}`}>
      <div>
        <motion.p initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="eyebrow flex items-center gap-3">
          {!center && <motion.span initial={{ width: 0 }} whileInView={{ width: 36 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="block h-px bg-gold" />}
          {eyebrow}
        </motion.p>
        <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] md:text-6xl">
          <WordReveal text={title} italicLast={italicLast} />
        </h2>
      </div>
      {action}
    </div>
  );
}
