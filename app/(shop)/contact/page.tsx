import type { Metadata } from "next";
import { Camera as Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/data";
import { prettyPhone, splitPhones, telHref, whatsappLink } from "@/lib/format";
import { getT } from "@/lib/i18n/server";
import { loc } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.contact") };
}

export default async function Contact() {
  const [s, { t, locale }] = await Promise.all([getSettings(), getT()]);
  const address = loc(s, "address", locale);
  const phones = splitPhones(s.phones);
  const rows = [
    { icon: MessageCircle, t: t("ct.wa"), d: t("ct.waText"), href: whatsappLink(s.whatsapp_number, t("wa.contact")), cta: t("ct.start") },
    { icon: Phone, t: t("ct.call"), d: phones.map(prettyPhone).join(" · "), href: telHref(phones[0] ?? ""), cta: t("ct.callNow"), ltr: true },
    { icon: Mail, t: t("ct.email"), d: s.contact_email, href: `mailto:${s.contact_email}`, cta: t("ct.send"), ltr: true },
    { icon: Instagram, t: t("ct.ig"), d: `@${s.instagram}`, href: `https://instagram.com/${s.instagram}`, cta: t("ct.follow"), ltr: true },
  ];
  return (
    <PageShell eyebrow={t("ct.eyebrow")} title={t("ct.title")}>
      <p>{t("ct.text")}</p>
      <div className="grid gap-4 !mt-10 sm:grid-cols-2">
        {rows.map((r) => (
          <a key={r.t} href={r.href} target="_blank" rel="noreferrer" className="card group p-6 transition hover:-translate-y-1 hover:border-gold">
            <r.icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-2xl font-semibold text-fg">{r.t}</h3>
            <p className="mt-1 break-all text-sm" dir={r.ltr ? "ltr" : undefined} style={r.ltr ? { textAlign: "start" } : undefined}>{r.d}</p>
            <p className="mt-4 text-xs font-semibold text-gold">{r.cta} →</p>
          </a>
        ))}
      </div>
      <div className="card !mt-6 flex gap-4 p-6">
        <MapPin className="mt-1 h-7 w-7 shrink-0 text-gold" strokeWidth={1.4} />
        <div>
          <h3 className="font-display text-2xl font-semibold text-fg">{t("ct.visit")}</h3>
          <p className="mt-1 text-sm">{address}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-gold">{t("ct.maps")} →</a>
        </div>
      </div>
    </PageShell>
  );
}
