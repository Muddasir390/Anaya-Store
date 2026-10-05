import type { Metadata } from "next";
import TrackForm from "@/components/TrackForm";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.track") };
}

export default async function TrackPage() {
  const { t } = await getT();
  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow">{t("tr.eyebrow")}</p>
        <h1 className="mt-3 font-display text-5xl font-medium md:text-6xl">{t("tr.title")}</h1>
        <p className="mt-4 text-muted">{t("tr.text")}</p>
        <TrackForm />
      </div>
    </div>
  );
}
