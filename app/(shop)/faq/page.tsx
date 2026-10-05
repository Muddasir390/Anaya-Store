import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  ["How do I place an order?", "Add your abaya to the bag, check out with your delivery details, then tap “Confirm on WhatsApp” — we'll confirm and arrange delivery."],
  ["What payment methods do you accept?", "Cash on delivery is available on all orders. Contact us on WhatsApp if you'd like to arrange a bank transfer."],
  ["How long does delivery take?", "Typically 2–5 working days depending on your city. You'll get updates on WhatsApp."],
  ["Can I exchange my abaya?", "Yes — within 7 days of delivery, if it's unworn with tags attached. Message us to arrange it."],
  ["How do I choose my size?", "See our size guide — pick the length closest to your height. Not sure? We'll help on WhatsApp."],
  ["How should I care for my abaya?", "Each product page lists care instructions. In general: gentle cold wash or dry clean, steam to refresh, never bleach."],
];

export default function FAQ() {
  return (
    <PageShell eyebrow="Good to know" title="Questions, answered">
      <div className="divide-y divide-line border-y border-line">
        {faqs.map(([q, a]) => (
          <details key={q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-fg">
              {q}<span className="text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm">{a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
