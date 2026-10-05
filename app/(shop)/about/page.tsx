import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Our Story" };

export default function About() {
  return (
    <PageShell eyebrow="Our story" title="Grace, in every detail">
      <p>Anaya began with a simple belief: modest fashion should never mean compromise. The abaya is a garment of elegance and confidence — it deserves fabric that breathes, cuts that flatter, and finishing worthy of the woman wearing it.</p>
      <h2>Made with intention</h2>
      <p>We work with premium crepe, nida, linen and silk blends, chosen for how they fall and how they feel after a full day of wear. Embroidery and beading are applied with care, and every piece is inspected by hand before it is packed.</p>
      <h2>Service that feels personal</h2>
      <p>We&apos;re a small team, and we like it that way. Order online, then confirm and chat with us directly on <strong>WhatsApp</strong> — we&apos;ll help with sizing, styling and delivery, from first message to doorstep.</p>
      <h2>Our promise</h2>
      <p>If it isn&apos;t the right fit, we&apos;ll exchange it. If something isn&apos;t perfect, we&apos;ll make it right. That&apos;s Anaya.</p>
    </PageShell>
  );
}
