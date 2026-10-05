import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.policies") };
}

export default async function Policies() {
  const { t } = await getT();
  return (
    <PageShell eyebrow={t("pol.eyebrow")} title={t("pol.title")}>
      <h2>{t("pol.h1")}</h2>
      <p>{t("pol.p1")}</p>
      <h2>{t("pol.h2")}</h2>
      <p>{t("pol.p2")}</p>
      <h2 id="privacy">{t("pol.h3")}</h2>
      <p>{t("pol.p3")}</p>
      <h2 id="terms">{t("pol.h4")}</h2>
      <p>{t("pol.p4")}</p>
    </PageShell>
  );
}
