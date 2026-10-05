"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, ColorOption, Product } from "@/lib/types";

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, o: { size: string | null; color: ColorOption | null; quantity?: number }) => void;
  setQty: (key: string, q: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  hydrated: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore outside Providers");
  return c;
};

const CART_KEY = "anaya.cart.v1";
const WISH_KEY = "anaya.wish.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load persisted state once on mount (client-only data).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage unavailable (private mode) — cart still works in memory */
    }
  }, [items, wishlist, hydrated]);

  const add = useCallback<CartCtx["add"]>((p, { size, color, quantity = 1 }) => {
    const key = `${p.id}|${size ?? ""}|${color?.name ?? ""}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found)
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, 10) } : i,
        );
      return [
        ...prev,
        {
          key,
          productId: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          image: p.images[0] ?? null,
          size,
          color,
          quantity,
        },
      ];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, q: number) => {
    setItems((prev) =>
      q <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(q, 10) } : i)),
    );
  }, []);
  const remove = useCallback(
    (key: string) => setItems((p) => p.filter((i) => i.key !== key)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);
  const toggleWish = useCallback(
    (id: string) =>
      setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    [],
  );

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.quantity, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      wishlist,
      toggleWish,
      hydrated,
    }),
    [items, open, add, setQty, remove, clear, wishlist, toggleWish, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
