import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import { getSettings } from "@/lib/data";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.checkout"), robots: { index: false } };
}

export default async function CheckoutPage() {
  const [settings, { t }] = await Promise.all([getSettings(), getT()]);
  return (
    <div className="container-x pt-10 pb-8">
      <p className="eyebrow">{t("co.eyebrow")}</p>
      <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">{t("co.title")}</h1>
      <CheckoutForm settings={settings} />
    </div>
  );
}
