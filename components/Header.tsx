"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useStore } from "./Providers";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/size-guide", label: "Size Guide" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, setOpen, wishlist, hydrated } = useStore();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    // Close the mobile menu after navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenu(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          onClick={() => setMenu(true)}
          aria-label="Open menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <div className="max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2">
          <Logo />
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-active={pathname.startsWith(n.href)}
              className="link-underline text-sm font-medium tracking-wide"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/shop?focus=search" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold max-sm:hidden">
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold max-sm:hidden">
            <Heart className="h-[18px] w-[18px]" />
            {hydrated && wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-gold">
                {wishlist.length}
              </span>
            )}
          </Link>
          <ThemeToggle />
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-fg text-bg transition hover:opacity-85"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            <AnimatePresence>
              {hydrated && count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-on-gold"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenu(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col bg-bg p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-full border border-line">
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1">
                {[{ href: "/", label: "Home" }, ...NAV, { href: "/wishlist", label: "Wishlist" }].map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                    <Link href={n.href} className="block border-b border-line py-4 font-display text-3xl">
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
