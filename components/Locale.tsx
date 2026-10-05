"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { dirOf, makeT, type Locale, type TFn } from "@/lib/i18n";

type Ctx = { locale: Locale; dir: "ltr" | "rtl"; rtl: boolean; t: TFn };
const LocaleCtx = createContext<Ctx>({ locale: "en", dir: "ltr", rtl: false, t: makeT("en") });

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<Ctx>(() => ({ locale, dir: dirOf(locale), rtl: locale === "ur", t: makeT(locale) }), [locale]);
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export const useT = () => useContext(LocaleCtx);
