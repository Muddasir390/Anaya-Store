import { CURRENCY } from "./config";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
export const money = (n: number) => fmt.format(n);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const digitsOnly = (s: string) => s.replace(/\D/g, "");

export function whatsappLink(number: string, text: string) {
  return `https://wa.me/${digitsOnly(number)}?text=${encodeURIComponent(text)}`;
}

export function discountPct(price: number, compare: number | null) {
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

/** "03154043456" → "+92 315 4043456" (Pakistani mobile numbers); other formats pass through. */
export function prettyPhone(p: string) {
  const d = digitsOnly(p);
  const m = d.match(/^0(3\d{2})(\d{7})$/) ?? d.match(/^92(3\d{2})(\d{7})$/);
  return m ? `+92 ${m[1]} ${m[2]}` : p.trim();
}
export const telHref = (p: string) => {
  const d = digitsOnly(p);
  return `tel:${d.startsWith("0") ? "+92" + d.slice(1) : "+" + d}`;
};
export const splitPhones = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
