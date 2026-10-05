import type { Metadata } from "next";
import { Camera as Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageShell from "@/components/PageShell";
import { getSettings } from "@/lib/data";
import { prettyPhone, splitPhones, telHref, whatsappLink } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
  const s = await getSettings();
  const rows = [
    { icon: MessageCircle, t: "WhatsApp", d: "Fastest way to reach us", href: whatsappLink(s.whatsapp_number, "Hello Anaya!"), cta: "Start a chat" },
    { icon: Phone, t: "Call us", d: splitPhones(s.phones).map(prettyPhone).join(" · "), href: telHref(splitPhones(s.phones)[0] ?? ""), cta: "Call now" },
    { icon: Mail, t: "Email", d: s.contact_email, href: `mailto:${s.contact_email}`, cta: "Send email" },
    { icon: Instagram, t: "Instagram", d: `@${s.instagram}`, href: `https://instagram.com/${s.instagram}`, cta: "Follow us" },
  ];
  return (
    <PageShell eyebrow="Say salaam" title="Get in touch">
      <p>Questions about sizing, fabrics, or your order? We usually reply within a few hours.</p>
      <div className="grid gap-4 !mt-10 sm:grid-cols-2">
        {rows.map((r) => (
          <a key={r.t} href={r.href} target="_blank" rel="noreferrer" className="card group p-6 transition hover:-translate-y-1 hover:border-gold">
            <r.icon className="h-7 w-7 text-gold" strokeWidth={1.4} />
            <h3 className="mt-4 font-display text-2xl font-semibold text-fg">{r.t}</h3>
            <p className="mt-1 break-all text-sm">{r.d}</p>
            <p className="mt-4 text-xs font-semibold text-gold">{r.cta} →</p>
          </a>
        ))}
      </div>
      <div className="card !mt-6 flex gap-4 p-6">
        <MapPin className="mt-1 h-7 w-7 shrink-0 text-gold" strokeWidth={1.4} />
        <div>
          <h3 className="font-display text-2xl font-semibold text-fg">Visit our store</h3>
          <p className="mt-1 text-sm">{s.address}</p>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-semibold text-gold">Open in Google Maps →</a>
        </div>
      </div>
    </PageShell>
  );
}
