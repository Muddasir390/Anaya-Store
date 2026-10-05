import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.about") };
}

export default async function About() {
  const { t } = await getT();
  return (
    <PageShell eyebrow={t("ab.eyebrow")} title={t("ab.title")}>
      <p>{t("ab.p1")}</p>
      <h2>{t("ab.h1")}</h2>
      <p>{t("ab.p2")}</p>
      <h2>{t("ab.h2")}</h2>
      <p>{t("ab.p3")}</p>
      <h2>{t("ab.h3")}</h2>
      <p>{t("ab.p4")}</p>
    </PageShell>
  );
}
