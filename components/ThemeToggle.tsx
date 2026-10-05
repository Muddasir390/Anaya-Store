"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback } from "react";
import { useT } from "./Locale";

export default function ThemeToggle() {
  const { t } = useT();
  const toggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("anaya.theme", next);
      } catch {}
    };
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) return apply();

    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    });
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={t("a.theme")}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition hover:border-gold hover:text-gold"
    >
      <Sun className="h-[18px] w-[18px] scale-100 rotate-0 transition-all duration-500 [[data-theme=dark]_&]:scale-0 [[data-theme=dark]_&]:-rotate-90" />
      <Moon className="absolute h-[18px] w-[18px] scale-0 rotate-90 transition-all duration-500 [[data-theme=dark]_&]:scale-100 [[data-theme=dark]_&]:rotate-0" />
    </button>
  );
}
