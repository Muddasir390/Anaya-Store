import { en, type Key } from "./en";
import { ur } from "./ur";

export type Locale = "en" | "ur";
export const LOCALE_COOKIE = "anaya.lang";
export const dicts: Record<Locale, Record<Key, string>> = { en, ur };
export const dirOf = (l: Locale) => (l === "ur" ? "rtl" : "ltr");

export type TFn = (key: Key, vars?: Record<string, string | number>) => string;

export function makeT(locale: Locale): TFn {
  const d = dicts[locale];
  return (key, vars) => {
    let s = d[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** Pick the Urdu value of a translatable DB field when viewing in Urdu (falls back to English). */
export function loc<T extends Record<string, unknown>>(obj: T, field: string, locale: Locale): string {
  if (locale === "ur") {
    const v = obj[`${field}_ur`];
    if (typeof v === "string" && v.trim()) return v;
  }
  return String(obj[field] ?? "");
}
export type { Key };
