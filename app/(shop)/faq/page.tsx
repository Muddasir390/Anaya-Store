import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getT } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.faq") };
}

export default async function FAQ() {
  const { t } = await getT();
  return (
    <PageShell eyebrow={t("fq.eyebrow")} title={t("fq.title")}>
      <div className="divide-y divide-line border-y border-line">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <details key={n} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-fg">
              {t(`fq.q${n}` as Key)}<span className="text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm">{t(`fq.a${n}` as Key)}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
