const tone: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  confirmed: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  processing: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  shipped: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
  delivered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  cancelled: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
};
export default function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${tone[status] ?? ""}`}>{status}</span>;
}
