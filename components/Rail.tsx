"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "./Locale";

/** Horizontal snap carousel with arrow buttons, drag-to-scroll and edge awareness. */
export default function Rail({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // scrollLeft is 0…-max in RTL; normalise so 0 is always the physical left edge.
    const max = el.scrollWidth - el.clientWidth;
    const x = el.scrollLeft < 0 ? el.scrollLeft + max : el.scrollLeft;
    setEdge({ start: x < 8, end: x >= max - 8 });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const by = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={measure}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: ref.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 5) d.moved = true;
          ref.current!.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className="snap-rail no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:-mx-8 md:gap-6 md:px-8 lg:cursor-grab lg:active:cursor-grabbing"
      >
        {children}
      </div>
      {(["start", "end"] as const).map((side) => (
        <button
          key={side}
          onClick={() => by(side === "start" ? -1 : 1)}
          disabled={edge[side]}
          aria-label={side === "start" ? t("a.scrollLeft") : t("a.scrollRight")}
          className={`absolute top-[38%] hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg/90 shadow-lg backdrop-blur transition hover:border-gold hover:text-gold disabled:pointer-events-none disabled:opacity-0 lg:grid ${side === "start" ? "-left-5" : "-right-5"}`}
        >
          {side === "start" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      ))}
    </div>
  );
}
