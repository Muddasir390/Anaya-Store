import Link from "next/link";
import { Camera as Instagram, Mail, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { whatsappLink } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2/50">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Abayas designed with intention — modest, modern and made to be lived in. Crafted with care, delivered with love.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><Instagram className="h-[18px] w-[18px]" /></a>
            <a href={whatsappLink(settings.whatsapp_number, "Hello Anaya, I have a question.")} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><MessageCircle className="h-[18px] w-[18px]" /></a>
            <a href={`mailto:${settings.contact_email}`} aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:border-gold hover:text-gold"><Mail className="h-[18px] w-[18px]" /></a>
          </div>
        </div>
        <FooterCol title="Shop" links={[["All Abayas", "/shop"], ["Everyday", "/shop?category=everyday"], ["Occasion", "/shop?category=occasion"], ["Embroidered", "/shop?category=embroidered"]]} />
        <FooterCol title="Help" links={[["Track Order", "/track"], ["Size Guide", "/size-guide"], ["Shipping & Returns", "/policies"], ["FAQ", "/faq"]]} />
        <FooterCol title="Anaya" links={[["Our Story", "/about"], ["Contact", "/contact"], ["Privacy", "/policies#privacy"], ["Terms", "/policies#terms"]]} />
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {settings.store_name}. All rights reserved.
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
          <li key={l}>
            <Link href={h} className="text-muted transition hover:text-fg">{l}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
