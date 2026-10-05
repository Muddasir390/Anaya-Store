import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { getT } from "@/lib/i18n/server";
import type { Key } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("meta.size") };
}

const rows = [
  ["52", "52\"", "132 cm"],
  ["54", "54\"", "137 cm"],
  ["56", "56\"", "142 cm"],
  ["58", "58\"", "147 cm"],
  ["60", "60\"", "152 cm"],
];

export default async function SizeGuide() {
  const { t } = await getT();
  return (
    <PageShell eyebrow={t("sg.eyebrow")} title={t("sg.title")}>
      <p>{t("sg.p1")}</p>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[30rem] text-start text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-gold">
            <tr>{[t("sg.size"), t("sg.in"), t("sg.cm"), t("sg.height")].map((h) => <th key={h} className="p-4 text-start font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-line last:border-0">
                {r.map((c, i) => <td key={i} className={`p-4 ${i === 0 ? "font-semibold text-fg" : ""}`}>{c}</td>)}
                <td className="p-4">{t(`sg.h${r[0]}` as Key)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>{t("sg.tips")}</h2>
      <p>{t("sg.p2")}</p>
    </PageShell>
  );
}
