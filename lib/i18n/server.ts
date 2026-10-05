import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, dirOf, makeT, type Locale } from "./index";

export async function getLocale(): Promise<Locale> {
  const c = (await cookies()).get(LOCALE_COOKIE)?.value;
  return c === "ur" ? "ur" : "en";
}

export async function getT() {
  const locale = await getLocale();
  return { t: makeT(locale), locale, dir: dirOf(locale) };
}
