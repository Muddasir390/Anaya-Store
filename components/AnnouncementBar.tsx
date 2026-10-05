export default function AnnouncementBar({ text }: { text: string }) {
  if (!text) return null;
  const row = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="mx-8 inline-flex items-center gap-8 whitespace-nowrap">
      {text}
      <span className="text-gold">✦</span>
    </span>
  ));
  return (
    <div className="marquee overflow-hidden bg-fg py-2 text-[0.72rem] font-medium tracking-[0.14em] uppercase text-bg">
      <div className="marquee-track">
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>{row}</div>
      </div>
    </div>
  );
}
