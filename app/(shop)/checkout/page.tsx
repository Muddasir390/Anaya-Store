import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const settings = await getSettings();
  return (
    <div className="container-x pt-10 pb-8">
      <p className="eyebrow">Almost yours</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">Checkout</h1>
      <CheckoutForm settings={settings} />
    </div>
  );
}
