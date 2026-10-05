const words = ["Crepe", "Nida", "Linen", "Chiffon", "Hand Embroidery", "Pearl Detail", "Silk Blend", "Made with Grace"];

export default function BigMarquee() {
  const row = (rev: boolean) => (
    <div className={`${rev ? "marquee-track-rev" : "marquee-track"} font-display text-5xl md:text-7xl`} style={{ animationDuration: rev ? "55s" : "48s" }}>
      {[0, 1].map((k) => (
        <div key={k} className="flex" aria-hidden={k === 1}>
          {words.concat(words).map((w, i) => (
            <span key={i} className={`mx-6 inline-flex items-center gap-12 whitespace-nowrap ${i % 2 ? "outline-text" : "italic text-gold"}`}>
              {w}<span className="text-2xl text-gold not-italic">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
  return (
    <div className="marquee overflow-hidden border-y border-line py-6 select-none" role="presentation">
      {row(false)}
      <div className="mt-2">{row(true)}</div>
    </div>
  );
}
