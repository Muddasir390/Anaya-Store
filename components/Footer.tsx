import Link from "next/link";
import { Camera as Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Logo from "./Logo";
import { prettyPhone, splitPhones, telHref, whatsappLink } from "@/lib/format";
import { loc, makeT, type Locale } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types";
import { getLocale } from "@/lib/i18n/server";

export default async function Footer({ settings }: { settings: SiteSettings }) {
  const locale: Locale = await getLocale();
  const t = makeT(locale);
  return (
    <footer className="mt-24 border-t border-line bg-surface-2/50">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{t("ft.tagline")}</p>
          <address className="mt-5 max-w-xs space-y-2 text-sm not-italic text-muted">
            <p className="flex gap-2"><MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />{loc(settings, "address", locale)}</p>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1"><Phone className="h-4 w-4 shrink-0 text-gold" />{splitPhones(settings.phones).map((p) => <a key={p} href={telHref(p)} dir="ltr" className="transition hover:text-fg">{prettyPhone(p)}</a>)}</p>
          </address>
          <div className="mt-6 flex gap-3">
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><Instagram className="h-[18px] w-[18px]" /></a>
            <a href={whatsappLink(settings.whatsapp_number, t("wa.hello"))} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><MessageCircle className="h-[18px] w-[18px]" /></a>
            <a href={`mailto:${settings.contact_email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><Mail className="h-[18px] w-[18px]" /></a>
          </div>
        </div>
        <FooterCol title={t("ft.shop")} links={[[t("ft.all"), "/shop"], [t("ft.everyday"), "/shop?category=everyday"], [t("ft.occasion"), "/shop?category=occasion"], [t("ft.embroidered"), "/shop?category=embroidered"]]} />
        <FooterCol title={t("ft.help")} links={[[t("nav.track"), "/track"], [t("nav.size"), "/size-guide"], [t("ft.shipping"), "/policies"], [t("ft.faq"), "/faq"]]} />
        <FooterCol title={t("ft.anaya")} links={[[t("nav.story"), "/about"], [t("nav.contact"), "/contact"], [t("ft.privacy"), "/policies#privacy"], [t("ft.terms"), "/policies#terms"]]} />
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        {t("ft.rights", { year: new Date().getFullYear(), store: settings.store_name })}
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="eyebrow">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map(([l, h]) => (
          <li key={h}>
            <Link href={h} className="text-muted transition hover:text-fg">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
