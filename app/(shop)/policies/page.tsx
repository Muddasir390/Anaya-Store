import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Shipping, Returns & Policies" };

export default function Policies() {
  return (
    <PageShell eyebrow="The fine print" title="Policies">
      <h2>Shipping</h2>
      <p>Orders are dispatched within 1–2 working days and delivered in 2–5 working days. Shipping is free above the amount shown in your bag; otherwise a flat fee applies.</p>
      <h2>Exchanges & returns</h2>
      <p>Unworn items with tags can be exchanged within 7 days of delivery. Custom or altered pieces are final sale. Contact us on WhatsApp to start an exchange.</p>
      <h2 id="privacy">Privacy</h2>
      <p>We collect only the details needed to deliver and support your order (name, phone, address, optional email). We never sell your data. Contact us any time to have it removed.</p>
      <h2 id="terms">Terms</h2>
      <p>By placing an order you agree to provide accurate delivery information and to accept the order on delivery. Prices and availability may change without notice. <em>(Replace this placeholder text with your final legal terms.)</em></p>
    </PageShell>
  );
}
