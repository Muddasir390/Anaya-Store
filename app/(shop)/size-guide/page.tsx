import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = { title: "Size Guide" };

const rows = [
  ["52", "52\"", "132 cm", "Up to 5'1\" (155 cm)"],
  ["54", "54\"", "137 cm", "5'1\" – 5'3\" (155–160 cm)"],
  ["56", "56\"", "142 cm", "5'3\" – 5'5\" (160–165 cm)"],
  ["58", "58\"", "147 cm", "5'5\" – 5'7\" (165–170 cm)"],
  ["60", "60\"", "152 cm", "5'7\" and above (170+ cm)"],
];

export default function SizeGuide() {
  return (
    <PageShell eyebrow="Find your fit" title="Size guide">
      <p>Abaya sizes are measured by <strong>length</strong>, shoulder to hem. Choose the size closest to your height — our cuts are generous and relaxed through the body.</p>
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[30rem] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-gold">
            <tr>{["Size", "Length (in)", "Length (cm)", "Recommended height"].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-b border-line last:border-0">
                {r.map((c, i) => <td key={i} className={`p-4 ${i === 0 ? "font-semibold text-fg" : ""}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Measuring tips</h2>
      <p>Stand straight in flat shoes. Measure from the top of your shoulder down to where you&apos;d like the hem to fall. Between sizes? Size up for a flowing look, or message us on WhatsApp and we&apos;ll advise.</p>
    </PageShell>
  );
}
